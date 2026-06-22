/**
 * ÉCRAN : MemeResultScreen — La Consécration
 * Affichage final du mème avec punchline incrustée, transcription audio, boutons partage/download.
 * Inspiré de la maquette `la_cons_cration_2/screen.png` et `code.html`
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';
import { Header, AfroButton } from '../components/SharedComponents';

type Props = NativeStackScreenProps<RootStackParamList, 'MemeResult'>;

const MemeResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const {
    memeUrl,
    punchlineTop = 'QUAND TU VOIS',
    punchlineBottom = 'LE NDEM ARRIVER',
    transcription,
    source,
  } = route.params;

  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleShareWhatsApp = async (): Promise<void> => {
    try {
      await Share.share({
        message: `${punchlineTop} ${punchlineBottom} 😂🔥 — Créé avec AfroMeme Generator`,
        url: memeUrl || '',
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager pour le moment.');
    }
  };

  const handleDownload = async (): Promise<void> => {
    setIsDownloading(true);
    // Simuler le téléchargement (dans un vrai projet: react-native-fs ou CameraRoll)
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));
    setIsDownloading(false);
    Alert.alert('Téléchargé !', 'Le mème a été sauvegardé dans ta galerie. 🔥');
  };

  const handleRestart = (): void => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="La Consécration"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Le Mème Généré */}
        <View style={styles.memeCard}>
          <View style={styles.memeImageContainer}>
            {memeUrl ? (
              <Image
                source={{ uri: memeUrl }}
                style={styles.memeImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.memeImagePlaceholder} />
            )}

            {/* Punchline Overlay — Haut */}
            <View style={styles.punchlineTopContainer}>
              <Text style={styles.punchlineText}>{punchlineTop}</Text>
            </View>

            {/* Punchline Overlay — Bas */}
            <View style={styles.punchlineBottomContainer}>
              <Text style={styles.punchlineText}>{punchlineBottom}</Text>
            </View>
          </View>
        </View>

        {/* Zone de transcription (si source audio) */}
        {source === 'voice' && (
          <View style={styles.transcriptionCard}>
            <View style={styles.transcriptionHeader}>
              <Text style={styles.transcriptionIcon}>🎤</Text>
              <Text style={styles.transcriptionLabel}>
                Transcription de l'audio
              </Text>
            </View>
            <Text style={styles.transcriptionText2}>
              {transcription ||
                "\"Vraiment, Akié ! On m'avait dit que le gars là était fort, mais je ne savais pas que son ndem pouvait dépasser mon entendement comme ça...\""}
            </Text>
          </View>
        )}

        {/* Boutons d'action */}
        <View style={styles.actionsSection}>
          {/* Partager WhatsApp */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.secondary }]}
            onPress={handleShareWhatsApp}
            activeOpacity={0.85}
          >
            <Text style={styles.actionIcon}>↗️</Text>
            <Text style={styles.actionText}>Partager sur WhatsApp</Text>
          </TouchableOpacity>

          {/* Télécharger */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
            onPress={handleDownload}
            activeOpacity={0.85}
            disabled={isDownloading}
          >
            <Text style={styles.actionIcon}>
              {isDownloading ? '⏳' : '⬇️'}
            </Text>
            <Text style={styles.actionText}>
              {isDownloading
                ? 'Téléchargement...'
                : 'Télécharger dans la Galerie'}
            </Text>
          </TouchableOpacity>

          {/* Recommencer */}
          <AfroButton
            title="↻ Recommencer"
            onPress={handleRestart}
            variant="outline"
            color={COLORS.primary}
          />
        </View>

        {/* Effets populaires */}
        <View style={styles.effectsSection}>
          <Text style={styles.effectsTitle}>Effets populaires</Text>
          <View style={styles.effectsGrid}>
            <TouchableOpacity style={[styles.effectCard, { backgroundColor: COLORS.secondaryContainer + '50' }]}>
              <Text style={styles.effectCardIcon}>🎞️</Text>
              <Text style={styles.effectCardLabel}>Vintage B&W</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.effectCard, { backgroundColor: COLORS.tertiaryFixed }]}>
              <Text style={styles.effectCardIcon}>⭐</Text>
              <Text style={styles.effectCardLabel}>Premium Glow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.effectCard, { backgroundColor: COLORS.outlineVariant + '50' }]}>
              <Text style={styles.effectCardIcon}>✨</Text>
              <Text style={styles.effectCardLabel}>Auto-Glow</Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    padding: SPACING.marginHorizontal,
    paddingBottom: SPACING.xl + SPACING.lg,
  },

  // Meme Card
  memeCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.surfaceVariant + '50',
    ...ELEVATION.level1,
  },
  memeImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.inverseSurface,
    position: 'relative',
    overflow: 'hidden',
  },
  memeImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  memeImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.inverseSurface,
  },
  punchlineTopContainer: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.sm,
    right: SPACING.sm,
    alignItems: 'center',
  },
  punchlineBottomContainer: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.sm,
    right: SPACING.sm,
    alignItems: 'center',
  },
  punchlineText: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.white,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },

  // Transcription
  transcriptionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.surfaceVariant,
    ...ELEVATION.level1,
  },
  transcriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  transcriptionIcon: {
    fontSize: 18,
    marginRight: SPACING.xs,
  },
  transcriptionLabel: {
    ...FONTS.labelLg,
    color: COLORS.secondary,
  },
  transcriptionText2: {
    ...FONTS.bodyMd,
    color: COLORS.onSurfaceVariant,
    fontStyle: 'italic',
    lineHeight: 24,
  },

  // Actions
  actionsSection: {
    marginTop: SPACING.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: RADII.lg,
    marginBottom: SPACING.xs,
    ...ELEVATION.level1,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: SPACING.xs,
  },
  actionText: {
    ...FONTS.labelLg,
    color: COLORS.white,
  },

  // Effects
  effectsSection: {
    marginTop: SPACING.xl,
  },
  effectsTitle: {
    ...FONTS.headlineMd,
    color: COLORS.textMain,
    marginBottom: SPACING.sm,
  },
  effectsGrid: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  effectCard: {
    flex: 1,
    height: 90,
    borderRadius: RADII.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '30',
  },
  effectCardIcon: {
    fontSize: 22,
    marginBottom: SPACING.base,
  },
  effectCardLabel: {
    ...FONTS.labelSm,
    color: COLORS.textMain,
  },
});

export default MemeResultScreen;
