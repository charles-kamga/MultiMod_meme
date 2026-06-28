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
import { Header, AfroButton, MoodChip, InfoPanel } from '../components/SharedComponents';
import { generateFromContext } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Context'>;
type Mood = 'clash' | 'ndolo' | 'nyanga' | 'sarcasme';

const MOODS: Array<{ key: Mood; label: string; icon: string; color: string }> = [
  { key: 'clash', label: 'Clash', icon: 'CL', color: COLORS.coral },
  { key: 'ndolo', label: 'Ndolo', icon: 'ND', color: COLORS.primary },
  { key: 'nyanga', label: 'Nyanga', icon: 'NY', color: COLORS.accent },
  { key: 'sarcasme', label: 'Sarcasme', icon: 'SA', color: COLORS.secondary },
];

const MAX_CHARS = 2000;

const ContextScreen: React.FC<Props> = ({ navigation }) => {
  const [text, setText] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood>('clash');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (): Promise<void> => {
    const cleanText = text.trim();
    if (cleanText.length < 10) {
      Alert.alert('Texte trop court', 'Ajoute assez de contexte pour que le backend puisse analyser la situation.');
      return;
    }

    setIsLoading(true);
    const result = await generateFromContext(cleanText, selectedMood, 'cm');
    setIsLoading(false);

    if (result.success && result.data) {
      navigation.navigate('MemeResult', { meme: result.data });
      return;
    }

    Alert.alert('Backend indisponible', result.error || 'Impossible de generer le meme.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Context Reader"
        subtitle="Texte vers punchline multimodale"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Colle ici une conversation, une situation ou un statut a transformer en meme..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            textAlignVertical="top"
            maxLength={MAX_CHARS}
            value={text}
            onChangeText={setText}
          />
          <Text style={styles.charCount}>{text.length} / {MAX_CHARS}</Text>
        </View>

        <Text style={styles.sectionLabel}>Ambiance culturelle</Text>
        <View style={styles.moodGrid}>
          {MOODS.map(mood => (
            <View key={mood.key} style={styles.moodWrapper}>
              <MoodChip
                label={mood.label}
                icon={mood.icon}
                color={mood.color}
                isSelected={selectedMood === mood.key}
                onPress={() => setSelectedMood(mood.key)}
              />
            </View>
          ))}
        </View>

        <View style={styles.panelSpace}>
          <InfoPanel
            title="Pipeline securise"
            body="Le texte part vers POST /generate/context. Express ajoute le prompt culturel, appelle Gemini, puis renvoie la punchline."
          />
        </View>

        <View style={styles.actionSection}>
          {isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Analyse du contexte en cours...</Text>
            </View>
          ) : (
            <AfroButton
              title="Generer le meme texte"
              onPress={handleGenerate}
              disabled={text.trim().length < 10}
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
  textAreaContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    borderWidth: 1.5,
    borderColor: COLORS.borderStrong,
    overflow: 'hidden',
  },
  textArea: {
    minHeight: 220,
    padding: SPACING.md,
    color: COLORS.textMain,
    fontSize: 16,
    lineHeight: 24,
  },
  charCount: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
    textAlign: 'right',
    paddingRight: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  sectionLabel: {
    ...FONTS.labelLg,
    color: COLORS.textMain,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  moodWrapper: {
    width: '50%',
    padding: 4,
  },
  panelSpace: {
    marginTop: SPACING.md,
  },
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
