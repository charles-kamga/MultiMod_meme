import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { MemeResult } from '../types/meme';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';
import { Header, AfroButton, StatusPill } from '../components/SharedComponents';

type Props = NativeStackScreenProps<RootStackParamList, 'MemeResult'>;

const GALLERY_KEY = 'meme_gallery';

const sourceLabel: Record<MemeResult['sourceType'], string> = {
  text: 'Texte',
  audio: 'Voix',
  image: 'Image',
};

const fallbackImages = {
  text: require('../assets/memes/context_ai.png'),
  audio: require('../assets/memes/voice_ai.png'),
  image: require('../assets/memes/remix_ai.png'),
};

const MemeResultScreen: React.FC<Props> = ({ route, navigation }) => {
  const { meme } = route.params;
  const viewShotRef = useRef<any>(null);
  const [sharing, setSharing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saveMeme = async (): Promise<void> => {
      try {
        const stored = await AsyncStorage.getItem(GALLERY_KEY);
        const gallery: MemeResult[] = stored ? JSON.parse(stored) : [];
        if (!gallery.some(item => item.id === meme.id)) {
          await AsyncStorage.setItem(GALLERY_KEY, JSON.stringify([meme, ...gallery]));
        }
        setSaved(true);
      } catch (error) {
        console.warn('Erreur sauvegarde galerie', error);
      }
    };
    saveMeme();
  }, [meme]);

  const captureView = async (): Promise<string | null> => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      return uri ?? null;
    } catch (error) {
      console.warn('Erreur capture meme', error);
      return null;
    }
  };

  const handleShare = async (): Promise<void> => {
    setSharing(true);
    try {
      const uri = await captureView();
      if (!uri) {
        Alert.alert('Capture impossible', "Le meme n'a pas pu etre capture.");
        return;
      }

      await Share.open({
        title: 'Meme IA',
        message: meme.punchline || meme.bottomText || 'Regarde ce meme.',
        url: uri,
        type: 'image/png',
      });
    } catch (error: any) {
      if (error?.message !== 'User did not share') {
        Alert.alert('Partage indisponible', 'Le partage a echoue.');
      }
    } finally {
      setSharing(false);
    }
  };

  const handleShareWhatsApp = async (): Promise<void> => {
    setSharing(true);
    try {
      const uri = await captureView();
      if (!uri) {
        Alert.alert('Capture impossible', "Le meme n'a pas pu etre capture.");
        return;
      }

      await Share.shareSingle({
        title: 'Meme IA',
        message: meme.punchline || meme.bottomText || '',
        url: uri,
        type: 'image/png',
        social: 'whatsapp' as any,
      });
    } catch {
      Alert.alert('WhatsApp introuvable', "WhatsApp n'est pas installe ou ne peut pas recevoir le partage.");
    } finally {
      setSharing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Meme genere"
        subtitle="Sauvegarde locale et partage direct"
        onBack={() => navigation.goBack()}
        rightLabel="Galerie"
        onRightPress={() => navigation.navigate('Gallery')}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <StatusPill label={sourceLabel[meme.sourceType]} tone="dark" />

        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
          <View style={styles.memeCard}>
            {meme.topText ? (
              <View style={styles.textOverlayTop}>
                <Text style={styles.memeText}>{meme.topText.toUpperCase()}</Text>
              </View>
            ) : null}

            <Image
              source={meme.imageUri ? { uri: meme.imageUri } : fallbackImages[meme.sourceType]}
              style={styles.memeImage}
              resizeMode="cover"
            />

            {(meme.bottomText || meme.punchline) ? (
              <View style={styles.textOverlayBottom}>
                <Text style={styles.memeText}>
                  {(meme.bottomText || meme.punchline || '').toUpperCase()}
                </Text>
              </View>
            ) : null}
          </View>
        </ViewShot>

        {meme.transcription ? (
          <View style={styles.transcriptionBox}>
            <Text style={styles.boxTitle}>Transcription</Text>
            <Text style={styles.boxText}>{meme.transcription}</Text>
          </View>
        ) : null}

        {meme.punchline ? (
          <View style={styles.punchlineBox}>
            <Text style={styles.boxTitle}>Punchline</Text>
            <Text style={styles.boxText}>{meme.punchline}</Text>
          </View>
        ) : null}

        {saved ? <Text style={styles.savedHint}>Sauvegarde dans la galerie locale.</Text> : null}

        <View style={styles.actionsContainer}>
          <AfroButton title="Partager" onPress={handleShare} disabled={sharing} />
          <AfroButton
            title={sharing ? 'Preparation...' : 'Partager sur WhatsApp'}
            onPress={handleShareWhatsApp}
            color={COLORS.secondary}
            disabled={sharing}
          />
          {sharing ? <ActivityIndicator color={COLORS.primary} /> : null}
          <TouchableOpacity style={styles.secondaryAction} onPress={() => navigation.navigate('MainTabs')}>
            <Text style={styles.secondaryActionText}>Creer un autre meme</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingHorizontal: SPACING.marginHorizontal,
    paddingBottom: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  memeCard: {
    width: '100%',
    minWidth: 320,
    maxWidth: 370,
    borderRadius: RADII.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.ink,
    ...ELEVATION.level2,
  },
  memeImage: {
    width: '100%',
    height: 315,
    backgroundColor: COLORS.surfaceMuted,
  },
  textOverlayTop: {
    backgroundColor: COLORS.ink,
    padding: SPACING.sm,
  },
  textOverlayBottom: {
    backgroundColor: COLORS.ink,
    padding: SPACING.sm,
  },
  memeText: {
    ...FONTS.title,
    color: COLORS.white,
    textAlign: 'center',
  },
  transcriptionBox: {
    width: '100%',
    backgroundColor: COLORS.secondaryContainer,
    borderRadius: RADII.lg,
    padding: SPACING.md,
  },
  punchlineBox: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    padding: SPACING.md,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  boxTitle: {
    ...FONTS.labelLg,
    color: COLORS.textMain,
    marginBottom: 4,
  },
  boxText: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
  },
  savedHint: {
    ...FONTS.labelSm,
    color: COLORS.primary,
  },
  actionsContainer: {
    width: '100%',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  secondaryAction: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  secondaryActionText: {
    ...FONTS.labelLg,
    color: COLORS.primaryDark,
  },
});

export default MemeResultScreen;
