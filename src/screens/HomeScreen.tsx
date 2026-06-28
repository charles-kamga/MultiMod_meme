import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, MainTabParamList } from '../navigation/types';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';
import { Header, FeatureCard, StatusPill, InfoPanel } from '../components/SharedComponents';
import { API_BASE_URL, checkBackendHealth } from '../services/api';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const PHASES = [
  { label: 'Phase 1', body: 'Init + module texte' },
  { label: 'Phase 2', body: 'Audio, image, Multer' },
  { label: 'Phase 3', body: 'UX, partage, APK' },
];

const dashboardArt = require('../assets/memes/dashboard_ai.png');
const contextArt = require('../assets/memes/context_ai.png');
const voiceArt = require('../assets/memes/voice_ai.png');
const remixArt = require('../assets/memes/remix_ai.png');

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    checkBackendHealth().then(result => {
      if (mounted) {
        setBackendOnline(result.success);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Header
          title="Studio Meme Vert"
          subtitle="Contexte, voix, image: tout passe par le backend Express."
          showAvatar
        />

        <View style={styles.heroPanel}>
          <ImageBackground source={dashboardArt} style={styles.heroImage} imageStyle={styles.heroImageStyle}>
            <View style={styles.heroShade}>
              <View style={styles.heroTop}>
                <StatusPill
                  label={
                    backendOnline === null
                      ? 'Verification backend'
                      : backendOnline
                        ? 'Backend en ligne'
                        : 'Mode demo local'
                  }
                  tone={backendOnline ? 'ok' : 'warn'}
                />
                <Text style={styles.heroCode}>Gemini</Text>
              </View>
              <Text style={styles.heroTitle}>Un meme pret a partager, sans exposer les cles API.</Text>
              <Text style={styles.heroText}>{API_BASE_URL}</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.previewRow}>
          <Image source={contextArt} style={styles.previewImage} />
          <Image source={voiceArt} style={styles.previewImage} />
          <Image source={remixArt} style={styles.previewImage} />
        </View>

        <View style={styles.cardsSection}>
          <FeatureCard
            title="Context Reader"
            description="Colle une conversation, choisis l'ambiance et laisse l'IA trouver le sous-entendu."
            icon="TXT"
            accentColor={COLORS.primary}
            badge="Texte"
            onPress={() => navigation.navigate('Context')}
            variant="large"
          />

          <View style={styles.compactRow}>
            <FeatureCard
              title="Voice-to-Meme"
              description="Capture vocale, transcription et sous-titre humoristique."
              icon="MIC"
              accentColor={COLORS.secondary}
              onPress={() => navigation.navigate('Voice')}
              variant="compact"
            />
            <View style={styles.compactSpacer} />
            <FeatureCard
              title="Status Remixer"
              description="Image + expression locale pour une punchline a superposer."
              icon="IMG"
              accentColor={COLORS.accent}
              onPress={() => navigation.navigate('Remixer')}
              variant="compact"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plan 7 jours</Text>
          <View style={styles.phaseRow}>
            {PHASES.map(phase => (
              <View key={phase.label} style={styles.phaseCard}>
                <Text style={styles.phaseLabel}>{phase.label}</Text>
                <Text style={styles.phaseBody}>{phase.body}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <InfoPanel
            title="Regle securite"
            body="Le mobile n'appelle jamais Gemini directement. Texte, audio et image sont envoyes a Express.js, qui orchestre Gemini et masque les cles."
            tone="green"
          />
        </View>

        <TouchableOpacity
          style={styles.galleryLink}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Gallery')}
        >
          <Text style={styles.galleryLinkText}>Ouvrir la galerie locale</Text>
          <Text style={styles.galleryLinkArrow}>{'>'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroPanel: {
    marginHorizontal: SPACING.marginHorizontal,
    marginTop: SPACING.sm,
    backgroundColor: COLORS.secondary,
    borderRadius: RADII.xl,
    overflow: 'hidden',
    ...ELEVATION.level2,
  },
  heroImage: {
    minHeight: 250,
  },
  heroImageStyle: {
    resizeMode: 'cover',
  },
  heroShade: {
    flex: 1,
    minHeight: 250,
    padding: SPACING.md,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(5, 45, 31, 0.62)',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heroCode: {
    ...FONTS.labelSm,
    color: COLORS.accentSoft,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADII.full,
  },
  heroTitle: {
    ...FONTS.headlineLg,
    color: COLORS.white,
  },
  heroText: {
    ...FONTS.labelSm,
    color: COLORS.primaryContainer,
    marginTop: SPACING.sm,
  },
  previewRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.marginHorizontal,
    marginTop: SPACING.sm,
  },
  previewImage: {
    flex: 1,
    height: 86,
    borderRadius: RADII.md,
    backgroundColor: COLORS.surfaceMuted,
  },
  cardsSection: {
    paddingHorizontal: SPACING.marginHorizontal,
    paddingTop: SPACING.md,
  },
  compactRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  compactSpacer: {
    width: SPACING.sm,
  },
  section: {
    paddingHorizontal: SPACING.marginHorizontal,
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    ...FONTS.title,
    color: COLORS.textMain,
    marginBottom: SPACING.sm,
  },
  phaseRow: {
    flexDirection: 'row',
  },
  phaseCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    marginRight: SPACING.xs,
  },
  phaseLabel: {
    ...FONTS.labelSm,
    color: COLORS.primary,
    marginBottom: 4,
  },
  phaseBody: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
  },
  galleryLink: {
    marginHorizontal: SPACING.marginHorizontal,
    marginTop: SPACING.lg,
    borderRadius: RADII.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.primaryContainer,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  galleryLinkText: {
    ...FONTS.labelLg,
    color: COLORS.primaryDark,
  },
  galleryLinkArrow: {
    ...FONTS.title,
    color: COLORS.primaryDark,
  },
});

export default HomeScreen;
