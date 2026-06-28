import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { COLORS, SPACING, RADII, FONTS, ELEVATION } from '../theme/colors';

const getStorageKey = () => {
  const uid = auth().currentUser?.uid;
  return uid ? `memes_${uid}` : 'memes_guest';
};

export interface MemeResult {
  id: string;
  topText?: string;
  bottomText?: string;
  punchline?: string;
  imageUri?: string;
  sourceType: 'text' | 'audio' | 'image';
  createdAt: number;
}

interface Props {
  route: {
    params: {
      meme?: MemeResult;
      memeUrl?: string;
      punchlineTop?: string;
      punchlineBottom?: string;
      transcription?: string;
      source?: 'context' | 'voice' | 'remix';
      sourceType?: 'voice' | 'context' | 'remix' | 'text' | 'audio' | 'image' | 'gallery';
      resultData?: any;
    };
  };
  navigation: any;
}

const MemeResultScreen: React.FC<Props> = ({route, navigation}) => {
  const params = route?.params || {};
  const directMeme = params?.meme;
  const sourceType = params?.sourceType;
  const resultData = params?.resultData;

  const meme: MemeResult = React.useMemo(() => {
    if (directMeme) {
      return directMeme;
    }

    const data = resultData || params || {};
    const srcType = sourceType || params?.source;

    let mappedSource: 'text' | 'audio' | 'image' = 'audio';
    if (srcType === 'context' || srcType === 'text') {
      mappedSource = 'text';
    } else if (srcType === 'remix' || srcType === 'image') {
      mappedSource = 'image';
    } else if (srcType === 'voice' || srcType === 'audio') {
      mappedSource = 'audio';
    }

    const imageUri = data.memeUrl || data.imageUri || data.imageUrl || '';
    const topText = data.punchlineTop || data.topText || '';
    const bottomText = data.punchlineBottom || data.bottomText || data.punchline || '';
    const punchline = data.punchline || data.punchlineBottom || data.punchlineTop || '';

    return {
      id: data.id || String(Date.now()),
      topText,
      bottomText,
      punchline,
      imageUri,
      sourceType: mappedSource,
      createdAt: data.createdAt || Date.now(),
    };
  }, [directMeme, sourceType, resultData, params]);

  const viewShotRef = useRef<any>(null);
  const [sharing, setSharing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (sourceType === 'gallery') {
      return;
    }
    saveMemeToGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceType]);

  const saveMemeToGallery = async () => {
    try {
      const stored = await AsyncStorage.getItem(getStorageKey());
      const gallery: MemeResult[] = stored ? JSON.parse(stored) : [];

      const exists = gallery.find(m => m.id === meme.id);
      if (!exists) {
        gallery.unshift(meme);
        await AsyncStorage.setItem(getStorageKey(), JSON.stringify(gallery));
      }
      setSaved(true);
    } catch (e) {
      console.error('Erreur sauvegarde galerie :', e);
    }
  };

  const captureView = async (): Promise<string | null> => {
    try {
      if (viewShotRef.current && viewShotRef.current.capture) {
        const uri = await viewShotRef.current.capture();
        return uri;
      }
      return null;
    } catch (e) {
      console.error('Erreur capture :', e);
      return null;
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const uri = await captureView();
      if (!uri) {
        Alert.alert('Erreur', 'Impossible de capturer le mème.');
        return;
      }

      await Share.open({
        title: 'Mon meme genere par IA',
        message: meme.punchline || meme.bottomText || 'Regarde ce meme !',
        url: uri,
        type: 'image/png',
      });
    } catch (e: any) {
      if (e?.message !== 'User did not share') {
        Alert.alert('Erreur', 'Le partage a echoue.');
      }
    } finally {
      setSharing(false);
    }
  };

  const exportToWhatsAppSticker = async () => {
    setIsExporting(true);
    try {
      const uri = await captureView();
      if (!uri) {
        Alert.alert('Erreur', 'Impossible de capturer le mème.');
        return;
      }

      await Share.shareSingle({
        title: 'Mon sticker IA',
        message: meme.punchline || meme.bottomText || '',
        url: uri,
        type: 'image/png',
        social: 'whatsappsticker' as any,
      });
    } catch {
      Alert.alert(
        'WhatsApp introuvable',
        'WhatsApp n\'est pas installé sur cet appareil.',
      );
    } finally {
      setIsExporting(false);
    }
  };

  const sourceLabel = {
    text: 'Texte',
    audio: 'Voix',
    image: 'Image',
  }[meme.sourceType];

  const sourceIcon = {
    text: 'chatbubble-ellipses',
    audio: 'mic',
    image: 'image',
  }[meme.sourceType];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ton Meme</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs', { screen: 'Gallery' })}
          style={styles.galleryBtn}>
          <Ionicons name="images-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.sourceBadge}>
          <Ionicons name={sourceIcon} size={12} color={COLORS.primary} style={{marginRight: 4}} />
          <Text style={styles.sourceBadgeText}>{sourceLabel}</Text>
        </View>

        <ViewShot ref={viewShotRef} options={{format: 'png', quality: 1}}>
          <View style={styles.memeCard}>

            {meme.topText ? (
              <View style={styles.textOverlayTop}>
                <Text style={styles.memeText}>{meme.topText.toUpperCase()}</Text>
              </View>
            ) : null}

            {meme.imageUri ? (
              <Image
                source={{uri: meme.imageUri}}
                style={styles.memeImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="happy-outline" size={80} color={COLORS.surfaceContainerHigh} />
              </View>
            )}

            {(meme.bottomText || meme.punchline) ? (
              <View style={styles.textOverlayBottom}>
                <Text style={styles.memeText}>
                  {(meme.bottomText || meme.punchline || '').toUpperCase()}
                </Text>
              </View>
            ) : null}
          </View>
        </ViewShot>

        {meme.punchline ? (
          <View style={styles.punchlineBox}>
            <Text style={styles.punchlineText}>"{meme.punchline}"</Text>
          </View>
        ) : null}

        {saved && (
          <View style={styles.savedRow}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} style={{marginRight: 4}} />
            <Text style={styles.savedHint}>Sauvegarde dans ta galerie</Text>
          </View>
        )}

        <View style={styles.actionsContainer}>

          <TouchableOpacity
            style={[styles.btn, styles.btnSticker]}
            onPress={exportToWhatsAppSticker}
            disabled={isExporting}>
            {isExporting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="logo-whatsapp" size={18} color={COLORS.white} style={{marginRight: 8}} />
                <Text style={styles.btnText}>Exporter en sticker</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnShare]}
            onPress={handleShare}
            disabled={sharing}>
            {sharing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="share-social-outline" size={18} color={COLORS.white} style={{marginRight: 8}} />
                <Text style={styles.btnText}>Partager via...</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnGallery]}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Gallery' })}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="images-outline" size={18} color={COLORS.textMain} style={{marginRight: 8}} />
              <Text style={[styles.btnText, {color: COLORS.textMain}]}>Voir ma galerie</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnNew]}
            onPress={() => navigation.goBack()}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="refresh-outline" size={18} color={COLORS.primary} style={{marginRight: 8}} />
              <Text style={[styles.btnText, {color: COLORS.primary}]}>
                Creer un nouveau meme
              </Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
    paddingTop: Platform.OS === 'android' ? SPACING.sm : 50,
    paddingBottom: SPACING.xs,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerHigh,
  },
  backBtn: {padding: 8},
  headerTitle: {
    ...FONTS.headlineMd,
    color: COLORS.textMain,
  },
  galleryBtn: {padding: 8},
  scroll: {
    paddingHorizontal: SPACING.sm,
    paddingBottom: 40,
    alignItems: 'center',
  },
  sourceBadge: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
    backgroundColor: COLORS.surfaceContainer,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: RADII.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceBadgeText: {
    ...FONTS.labelSm,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  memeCard: {
    width: 340,
    borderRadius: RADII.md,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHighest,
    ...ELEVATION.level1,
  },
  memeImage: {
    width: '100%',
    height: 300,
  },
  placeholderImage: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textOverlayTop: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 12,
  },
  textOverlayBottom: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 12,
  },
  memeText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  punchlineBox: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.surfaceContainerLow,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    padding: 14,
    borderRadius: RADII.sm,
    width: 340,
  },
  punchlineText: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  savedHint: {
    ...FONTS.labelSm,
    color: COLORS.primary,
  },
  actionsContainer: {
    marginTop: SPACING.md,
    width: '100%',
    gap: 12,
  },
  btn: {
    borderRadius: RADII.md,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSticker: {backgroundColor: '#25D366'},
  btnShare: {backgroundColor: COLORS.primary},
  btnGallery: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHighest,
  },
  btnNew: {
    backgroundColor: COLORS.transparent,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  btnText: {
    ...FONTS.labelLg,
    color: COLORS.white,
  },
});

export default MemeResultScreen;
