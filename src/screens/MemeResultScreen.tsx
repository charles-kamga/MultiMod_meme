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
      sourceType?: 'voice' | 'context' | 'remix' | 'text' | 'audio' | 'image';
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
      const stored = await AsyncStorage.getItem('meme_gallery');
      const gallery: MemeResult[] = stored ? JSON.parse(stored) : [];

      const exists = gallery.find(m => m.id === meme.id);
      if (!exists) {
        gallery.unshift(meme);
        await AsyncStorage.setItem('meme_gallery', JSON.stringify(gallery));
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

  const handleShareWhatsApp = async () => {
    setSharing(true);
    try {
      const uri = await captureView();
      if (!uri) {
        Alert.alert('Erreur', 'Impossible de capturer le mème.');
        return;
      }

      await Share.shareSingle({
        title: 'Mon meme IA',
        message: meme.punchline || meme.bottomText || '',
        url: uri,
        type: 'image/png',
       social: 'whatsapp' as any,
      });
    } catch {
      Alert.alert(
        'WhatsApp introuvable',
        'WhatsApp n\'est pas installe sur cet appareil.',
      );
    } finally {
      setSharing(false);
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
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FF6B35" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ton Meme</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Gallery')}
          style={styles.galleryBtn}>
          <Ionicons name="images-outline" size={22} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.sourceBadge}>
          <Ionicons name={sourceIcon} size={12} color="#FF6B35" style={{marginRight: 4}} />
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
                <Ionicons name="happy-outline" size={80} color="#555" />
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
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" style={{marginRight: 4}} />
            <Text style={styles.savedHint}>Sauvegarde dans ta galerie</Text>
          </View>
        )}

        <View style={styles.actionsContainer}>

          <TouchableOpacity
            style={[styles.btn, styles.btnWhatsApp]}
            onPress={handleShareWhatsApp}
            disabled={sharing}>
            {sharing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="logo-whatsapp" size={18} color="#FFF" style={{marginRight: 8}} />
                <Text style={styles.btnText}>Partager sur WhatsApp</Text>
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
                <Ionicons name="share-social-outline" size={18} color="#FFF" style={{marginRight: 8}} />
                <Text style={styles.btnText}>Partager via...</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnGallery]}
            onPress={() => navigation.navigate('Gallery')}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="images-outline" size={18} color="#FFF" style={{marginRight: 8}} />
              <Text style={styles.btnText}>Voir ma galerie</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnNew]}
            onPress={() => navigation.goBack()}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="refresh-outline" size={18} color="#FF6B35" style={{marginRight: 8}} />
              <Text style={[styles.btnText, {color: '#FF6B35'}]}>
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
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 50,
    paddingBottom: 12,
    backgroundColor: '#0D0D0D',
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  backBtn: {padding: 8},
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  galleryBtn: {padding: 8},
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  sourceBadge: {
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceBadgeText: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  memeCard: {
    width: 340,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    elevation: 8,
    shadowColor: '#FF6B35',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  memeImage: {
    width: '100%',
    height: 300,
  },
  placeholderImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#1E1E1E',
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
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  punchlineBox: {
    marginTop: 16,
    backgroundColor: '#1A1A1A',
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B35',
    padding: 14,
    borderRadius: 8,
    width: 340,
  },
  punchlineText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  savedHint: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsContainer: {
    marginTop: 24,
    width: '100%',
    gap: 12,
  },
  btn: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWhatsApp: {backgroundColor: '#25D366'},
  btnShare: {backgroundColor: '#FF6B35'},
  btnGallery: {backgroundColor: '#1E1E1E', borderWidth: 1, borderColor: '#333'},
  btnNew: {backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#FF6B35'},
  btnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default MemeResultScreen;
