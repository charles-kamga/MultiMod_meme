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
import Icon from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MemeResult {
  id: string;
  topText?: string;
  bottomText?: string;
  punchline?: string;
  imageUri?: string;   // URI locale ou URL distante
  sourceType: 'text' | 'audio' | 'image';
  createdAt: number;
}

interface Props {
  route: {
    params: {
      meme: MemeResult;
    };
  };
  navigation: any;
}

// ─── Composant ───────────────────────────────────────────────────────────────

const MemeResultScreen: React.FC<Props> = ({route, navigation}) => {
  const params = route?.params || {};
  const sourceType = params.sourceType || 'text';
  const punchline = params.punchline || 'Pas de punchline reçue';
  const imageUrl = params.imageUrl || 'https://via.placeholder.com/500';
  
  // Pour la sauvegarde locale, on reconstruit l'objet MemeResult
  const meme = {
    id: params.id || Date.now().toString(),
    sourceType: sourceType as any,
    punchline: punchline,
    imageUri: imageUrl,
    createdAt: Date.now(),
  };

  const viewShotRef = useRef<any>(null);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sauvegarde automatique dans la galerie locale dès l'arrivée sur l'écran
  useEffect(() => {
    if (sourceType === 'gallery') {
      return;
    }
    saveMemeToGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceType]);

  // ── Sauvegarde dans AsyncStorage ──────────────────────────────────────────

  const saveMemeToGallery = async () => {
    try {
      const stored = await AsyncStorage.getItem('meme_gallery');
      const gallery: MemeResult[] = stored ? JSON.parse(stored) : [];

      // Eviter les doublons
      const exists = gallery.find(m => m.id === meme.id);
      if (!exists) {
        gallery.unshift(meme); // plus récent en premier
        await AsyncStorage.setItem('meme_gallery', JSON.stringify(gallery));
      }
      setSaved(true);
    } catch (e) {
      console.error('Erreur sauvegarde galerie :', e);
    }
  };

  // ── Capture de l'écran → URI base64 ──────────────────────────────────────

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

  // ── Partage générique (toutes apps) ──────────────────────────────────────

  const handleShare = async () => {
    setSharing(true);
    try {
      const uri = await captureView();
      if (!uri) {
        Alert.alert('Erreur', 'Impossible de capturer le mème.');
        return;
      }

      await Share.open({
        title: 'Mon mème généré par IA 🔥',
        message: meme.punchline || meme.bottomText || 'Regarde ce mème !',
        url: uri,
        type: 'image/png',
      });
    } catch (e: any) {
      // L'utilisateur a fermé le panneau de partage → pas une vraie erreur
      if (e?.message !== 'User did not share') {
        Alert.alert('Erreur', 'Le partage a échoué.');
      }
    } finally {
      setSharing(false);
    }
  };

  // ── Partage direct WhatsApp ───────────────────────────────────────────────

  const handleShareWhatsApp = async () => {
    setSharing(true);
    try {
      const uri = await captureView();
      if (!uri) {
        Alert.alert('Erreur', 'Impossible de capturer le mème.');
        return;
      }

      await Share.shareSingle({
        title: 'Mon mème IA 🔥',
        message: meme.punchline || meme.bottomText || '',
        url: uri,
        type: 'image/png',
       social: 'whatsapp' as any,
      });
    } catch (e: any) {
      Alert.alert(
        'WhatsApp introuvable',
        'WhatsApp n\'est pas installé sur cet appareil.',
      );
    } finally {
      setSharing(false);
    }
  };

  // ── Badge source ──────────────────────────────────────────────────────────
  
  const renderSourceBadge = () => {
    const sources = {
      text: { label: 'Texte', icon: 'document-text' },
      audio: { label: 'Voix', icon: 'mic' },
      image: { label: 'Image', icon: 'image' },
    };
    const source = sources[meme.sourceType as keyof typeof sources] || sources.text;
    return (
      <View style={styles.sourceBadge}>
        <Icon name={source.icon} size={14} color="#FF6B35" />
        <Text style={styles.sourceBadgeText}> {source.label}</Text>
      </View>
    );
  };

  // ── Rendu ─────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={22} color="#FF6B35" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ton Mème 🔥</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Gallery')}
          style={styles.galleryBtn}>
          <Icon name="folder-open" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Badge source */}
        {renderSourceBadge()}

        {/* ─── Carte Mème (zone capturée) ─── */}
        <ViewShot ref={viewShotRef} options={{format: 'png', quality: 1}}>
          <View style={styles.memeCard}>

            {/* Texte du haut */}
            {meme.topText ? (
              <View style={styles.textOverlayTop}>
                <Text style={styles.memeText}>{meme.topText.toUpperCase()}</Text>
              </View>
            ) : null}

            {/* Image */}
            {meme.imageUri ? (
              <Image
                source={{uri: meme.imageUri}}
                style={styles.memeImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderEmoji}>😂</Text>
              </View>
            )}

            {/* Texte du bas / punchline */}
            {(meme.bottomText || meme.punchline) ? (
              <View style={styles.textOverlayBottom}>
                <Text style={styles.memeText}>
                  {(meme.bottomText || meme.punchline || '').toUpperCase()}
                </Text>
              </View>
            ) : null}
          </View>
        </ViewShot>

        {/* Punchline complète en dessous */}
        {meme.punchline ? (
          <View style={styles.punchlineBox}>
            <Text style={styles.punchlineText}>"{meme.punchline}"</Text>
          </View>
        ) : null}

        {/* Indicateur sauvegarde */}
        {saved && (
          <Text style={styles.savedHint}>✅ Sauvegardé dans ta galerie</Text>
        )}

        {/* ─── Boutons de partage ─── */}
        <View style={styles.actionsContainer}>

          {/* Partage WhatsApp */}
          <TouchableOpacity
            style={[styles.btn, styles.btnWhatsApp]}
            onPress={handleShareWhatsApp}
            disabled={sharing}>
            {sharing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.btnContent}>
                <Icon name="logo-whatsapp" size={20} color="#fff" />
                <Text style={styles.btnText}> Partager sur WhatsApp</Text>
              </View>
            )}
          </TouchableOpacity>
          
          {/* Partage général */}
          <TouchableOpacity
            style={[styles.btn, styles.btnShare]}
            onPress={handleShare}
            disabled={sharing}>
            {sharing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.btnContent}>
                <Icon name="share-social" size={20} color="#fff" />
                <Text style={styles.btnText}> Partager via...</Text>
              </View>
            )}
          </TouchableOpacity>
          
          {/* Voir la galerie */}
          <TouchableOpacity
            style={[styles.btn, styles.btnGallery]}
            onPress={() => navigation.navigate('Gallery')}>
            <View style={styles.btnContent}>
              <Icon name="images" size={20} color="#fff" />
              <Text style={styles.btnText}> Voir ma galerie</Text>
            </View>
          </TouchableOpacity>
          
          {/* Nouveau mème */}
          <TouchableOpacity
            style={[styles.btn, styles.btnNew]}
            onPress={() => navigation.goBack()}>
            <View style={styles.btnContent}>
              <Icon name="add-circle" size={20} color="#FF6B35" />
              <Text style={[styles.btnText, {color: '#FF6B35'}]}> Créer un nouveau mème</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

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
  backIcon: {fontSize: 22, color: '#FF6B35'},
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  galleryBtn: {padding: 8},
  galleryIcon: {fontSize: 22},
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
  },
  sourceBadgeText: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  // ── Mème card ──
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
  placeholderEmoji: {fontSize: 80},
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
  // ── Punchline ──
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
  savedHint: {
    marginTop: 10,
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  // ── Boutons ──
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
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MemeResultScreen;
