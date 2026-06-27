/**
 * ÉCRAN : ContextScreen — Analyseur de Ndoki (Texte)
 * Grand champ texte + sélecteur d'ambiance (Clash, Ndolo, Nyanga, Sarcasme) + bouton d'action.
 * Inspiré de la maquette `analyseur_de_ndoki/screen.png`
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, RADII, FONTS } from '../theme/colors';
import { Header, AfroButton, MoodChip } from '../components/SharedComponents';
import { generateFromContext } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Context'>;

type Mood = 'clash' | 'ndolo' | 'nyanga' | 'sarcasme';

interface MoodOption {
  key: Mood;
  label: string;
  icon: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { key: 'clash', label: 'Clash / Mbindi', icon: '⚡' },
  { key: 'ndolo', label: 'Ndolo / Amour', icon: '❤️' },
  { key: 'nyanga', label: 'Nyanga / Fierté', icon: '💎' },
  { key: 'sarcasme', label: 'Sarcasme Total', icon: '🎭' },
];

const MAX_CHARS = 2000;

const ContextScreen: React.FC<Props> = ({ navigation }) => {
  const [text, setText] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<Mood>('clash');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate = async (): Promise<void> => {
    if (!text.trim()) {
      Alert.alert('Oooh !', 'Colle ou écris une discussion avant de lancer le ndem.');
      return;
    }

    setIsLoading(true);
    const result = await generateFromContext(text, selectedMood);
    setIsLoading(false);

    if (result.success && result.data) {
      navigation.navigate('MemeResult', {
        memeUrl: result.data.memeUrl,
        punchlineTop: result.data.punchlineTop,
        punchlineBottom: result.data.punchlineBottom,
        source: 'context',
      });
    } else {
      Alert.alert('Erreur', result.error || 'Impossible de générer le mème.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Analyseur de Ndoki (Texte)"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Zone de texte */}
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Colle ou écris l'échange ici... (Ex: Ce que ma copine m'a dit ce matin...)"
            placeholderTextColor={COLORS.outline}
            multiline
            textAlignVertical="top"
            maxLength={MAX_CHARS}
            value={text}
            onChangeText={setText}
          />
          <View style={styles.charCountRow}>
            <Text style={styles.charCount}>
              {text.length} / {MAX_CHARS}
            </Text>
          </View>
        </View>

        {/* Sélecteur de Mood */}
        <View style={styles.moodSection}>
          <Text style={styles.moodSectionLabel}>
            ◉ CHOISIR LE NDOKI (MOOD)
          </Text>
          <View style={styles.moodGrid}>
            {MOOD_OPTIONS.map((mood) => (
              <View key={mood.key} style={styles.moodChipWrapper}>
                <MoodChip
                  label={mood.label}
                  icon={mood.icon}
                  isSelected={selectedMood === mood.key}
                  onPress={() => setSelectedMood(mood.key)}
                  color={
                    mood.key === 'clash'
                      ? COLORS.primary
                      : mood.key === 'ndolo'
                        ? COLORS.secondary
                        : mood.key === 'nyanga'
                          ? COLORS.tertiary
                          : COLORS.textMain
                  }
                />
              </View>
            ))}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <View style={styles.infoTextBlock}>
            <Text style={styles.infoText}>
              L'IA va scanner le sous-entendu, le sarcasme et la dose de "piment"
              dans ton texte pour sortir le mème parfait.
            </Text>
          </View>
        </View>

        {/* Bouton d'action */}
        <View style={styles.actionSection}>
          {isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Le ndem opère...</Text>
            </View>
          ) : (
            <AfroButton
              title="Laisser Gemini Analyser ✨"
              onPress={handleGenerate}
              color={COLORS.primary}
              disabled={!text.trim()}
            />
          )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.marginHorizontal,
    paddingBottom: SPACING.xl,
  },

  // Text Area
  textAreaContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    borderWidth: 1.5,
    borderColor: COLORS.outlineVariant,
    borderStyle: 'dashed',
    marginTop: SPACING.sm,
    overflow: 'hidden',
  },
  textArea: {
    minHeight: 200,
    padding: SPACING.sm,
    fontSize: 16,
    color: COLORS.textMain,
    lineHeight: 24,
  },
  charCountRow: {
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  charCount: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
  },

  // Mood Section
  moodSection: {
    marginTop: SPACING.md,
  },
  moodSectionLabel: {
    ...FONTS.labelLg,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  moodChipWrapper: {
    width: '48%',
  },

  // Info Card
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondaryContainer,
    borderRadius: RADII.lg,
    padding: SPACING.sm,
    marginTop: SPACING.md,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: SPACING.xs,
    marginTop: 2,
  },
  infoTextBlock: {
    flex: 1,
  },
  infoText: {
    ...FONTS.bodyMd,
    color: COLORS.onSecondaryContainer,
    lineHeight: 22,
  },

  // Action
  actionSection: {
    marginTop: SPACING.lg,
  },
  loadingRow: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  loadingText: {
    ...FONTS.labelLg,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
});

export default ContextScreen;
