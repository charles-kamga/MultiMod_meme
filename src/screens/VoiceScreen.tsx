import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';
import { Header, AfroButton, InfoPanel, StatusPill } from '../components/SharedComponents';
import { requestMicrophonePermission, showPermissionDeniedAlert } from '../utils/permissions';
import { generateFromVoice } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Voice'>;
type RecordingState = 'ready' | 'recording' | 'captured';

const VoiceScreen: React.FC<Props> = ({ navigation }) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('ready');
  const [seconds, setSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedFilePath, setCapturedFilePath] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (recordingState !== 'recording') {
      pulseAnim.setValue(1);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.94, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [recordingState, pulseAnim]);

  useEffect(() => () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const startRecording = useCallback(async (): Promise<void> => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      showPermissionDeniedAlert('Microphone');
      return;
    }

    setRecordingState('recording');
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds(value => value + 1), 1000);
  }, []);

  const stopRecording = useCallback((): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCapturedFilePath('/data/user/0/com.multimodalmemeapp/cache/recording.m4a');
    setRecordingState('captured');
  }, []);

  const discardRecording = (): void => {
    setRecordingState('ready');
    setSeconds(0);
    setCapturedFilePath('');
  };

  const handleMicPress = (): void => {
    if (recordingState === 'ready') {
      startRecording();
    } else if (recordingState === 'recording') {
      stopRecording();
    }
  };

  const handleSubmitAudio = async (): Promise<void> => {
    if (!capturedFilePath) {
      return;
    }

    setIsSubmitting(true);
    const result = await generateFromVoice(capturedFilePath);
    setIsSubmitting(false);

    if (result.success && result.data) {
      navigation.navigate('MemeResult', { meme: result.data });
      return;
    }

    Alert.alert('Backend indisponible', result.error || "Impossible de traiter l'audio.");
  };

  const micColor = recordingState === 'recording' ? COLORS.coral : COLORS.primary;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Voice-to-Meme"
        subtitle="Audio vers transcription et sous-titre"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.mainContent}>
        <StatusPill
          label={
            recordingState === 'ready'
              ? 'Pret a enregistrer'
              : recordingState === 'recording'
                ? 'Enregistrement'
                : 'Audio capture'
          }
          tone={recordingState === 'recording' ? 'warn' : 'ok'}
        />

        <View style={styles.micZone}>
          {recordingState === 'recording' ? (
            <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
          ) : null}

          <TouchableOpacity
            style={[styles.micButton, { backgroundColor: micColor }]}
            onPress={handleMicPress}
            activeOpacity={0.85}
            disabled={recordingState === 'captured'}
          >
            <Text style={styles.micIcon}>{recordingState === 'recording' ? 'STOP' : 'MIC'}</Text>
          </TouchableOpacity>
          <Text style={styles.timerDisplay}>{formatTime(seconds)}</Text>
        </View>

        {recordingState === 'captured' ? (
          <View style={styles.capturedZone}>
            <View style={styles.audioPlayer}>
              <Text style={styles.audioTitle}>Recording.m4a</Text>
              <TouchableOpacity onPress={discardRecording} style={styles.deleteButton} activeOpacity={0.75}>
                <Text style={styles.deleteText}>Reprendre</Text>
              </TouchableOpacity>
            </View>
            <InfoPanel
              title="Endpoint attendu"
              body="POST /generate/voice avec FormData audio. Le backend transcrit, demande la punchline a Gemini et renvoie le meme."
              tone="gold"
            />
          </View>
        ) : (
          <Text style={styles.hintText}>
            Appuie sur MIC pour simuler la capture. L'integration native du recorder peut ensuite remplacer ce chemin de fichier.
          </Text>
        )}
      </View>

      {recordingState === 'captured' ? (
        <View style={styles.footer}>
          {isSubmitting ? (
            <View style={styles.submittingRow}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.submittingText}>Envoi audio au backend...</Text>
            </View>
          ) : (
            <AfroButton title="Envoyer l'audio a l'IA" onPress={handleSubmitAudio} />
          )}
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.marginHorizontal,
  },
  micZone: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  pulseRing: {
    position: 'absolute',
    width: 245,
    height: 245,
    borderRadius: 123,
    borderWidth: 4,
    borderColor: COLORS.coral,
    opacity: 0.22,
  },
  micButton: {
    width: 176,
    height: 176,
    borderRadius: 88,
    alignItems: 'center',
    justifyContent: 'center',
    ...ELEVATION.level2,
  },
  micIcon: {
    ...FONTS.headlineMd,
    color: COLORS.white,
  },
  timerDisplay: {
    ...FONTS.title,
    color: COLORS.textMain,
    marginTop: SPACING.lg,
  },
  hintText: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 310,
  },
  capturedZone: {
    width: '100%',
    gap: SPACING.sm,
  },
  audioPlayer: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioTitle: {
    ...FONTS.labelLg,
    color: COLORS.textMain,
  },
  deleteButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    borderRadius: RADII.full,
    backgroundColor: COLORS.surfaceSoft,
  },
  deleteText: {
    ...FONTS.labelSm,
    color: COLORS.primaryDark,
  },
  footer: {
    paddingHorizontal: SPACING.marginHorizontal,
    paddingBottom: SPACING.lg,
  },
  submittingRow: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  submittingText: {
    ...FONTS.labelLg,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
});

export default VoiceScreen;
