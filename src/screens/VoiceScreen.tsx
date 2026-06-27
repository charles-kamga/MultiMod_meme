/**
 * ÉCRAN : VoiceScreen — La Voix du Kwatt
 * Gros bouton central micro avec gestion des états (Prêt, En cours, Capturé).
 * Inspiré de la maquette `la_voix_du_kwatt_1/screen.png` et `code.html`
 */

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
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';
import { Header, AfroButton } from '../components/SharedComponents';
import { requestMicrophonePermission, showPermissionDeniedAlert } from '../utils/permissions';
import { generateFromVoice } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Voice'>;

type RecordingState = 'ready' | 'recording' | 'captured';

const VoiceScreen: React.FC<Props> = ({ navigation }) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('ready');
  const [seconds, setSeconds] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [capturedFilePath, setCapturedFilePath] = useState<string>('');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animation de pulsation pendant l'enregistrement
  useEffect(() => {
    if (recordingState === 'recording') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.9,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [recordingState, pulseAnim]);

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
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

    // Simuler le timer (dans un vrai projet, on utiliserait react-native-audio-recorder-player)
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopRecording = useCallback((): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Simuler un chemin de fichier capturé
    setCapturedFilePath('/data/user/0/com.multimodalmemeapp/cache/recording.m4a');
    setRecordingState('captured');
  }, []);

  const discardRecording = useCallback((): void => {
    setRecordingState('ready');
    setSeconds(0);
    setCapturedFilePath('');
  }, []);

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
      navigation.navigate('MemeResult', {
        sourceType: 'voice',
        punchline: result.data.punchlineTop || result.data.punchline || 'Punchline vocale générée !',
        imageUrl: result.data.memeUrl || 'https://via.placeholder.com/500',
      });
    } else {
      Alert.alert('Erreur', result.error || 'Impossible de traiter l\'audio.');
    }
  };

  const micButtonColor =
    recordingState === 'recording' ? COLORS.primary : COLORS.secondary;
  const micIconName = recordingState === 'recording' ? 'stop' : 'mic';

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="La Voix du Kwatt"
        onBack={() => navigation.goBack()}
        showAvatar
      />

      <View style={styles.mainContent}>
        {/* Zone centrale micro */}
        <View style={styles.micZone}>
          {/* Anneaux de pulsation (visibles pendant l'enregistrement) */}
          {recordingState === 'recording' && (
            <>
              <Animated.View
                style={[
                  styles.pulseRing,
                  styles.pulseRingOuter,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.pulseRing,
                  styles.pulseRingInner,
                  {
                    transform: [
                      {
                        scale: Animated.multiply(pulseAnim, 0.85),
                      },
                    ],
                  },
                ]}
              />
            </>
          )}

           {/* Bouton micro principal */}
           <TouchableOpacity
             style={[styles.micButton, { backgroundColor: micButtonColor }]}
             onPress={handleMicPress}
             activeOpacity={0.85}
           >
             <Icon name={micIconName} size={56} color={COLORS.white} />
           </TouchableOpacity>

          {/* Timer */}
          <Text style={styles.timerDisplay}>{formatTime(seconds)}</Text>
        </View>

        {/* Zone "capturé" — Lecteur audio + Poubelle */}
        {recordingState === 'captured' && (
          <View style={styles.capturedZone}>
             <View style={styles.audioPlayer}>
               <TouchableOpacity style={styles.playButton}>
                 <Icon name="play" size={20} color={COLORS.white} />
               </TouchableOpacity>
               <View style={styles.progressBar}>
                 <View style={styles.progressFill} />
               </View>
               <TouchableOpacity
                 style={styles.trashButton}
                 onPress={discardRecording}
               >
                 <Icon name="trash-outline" size={22} color={COLORS.textMain} />
               </TouchableOpacity>
             </View>

            <View style={styles.transcriptionStatus}>
              <ActivityIndicator size="small" color={COLORS.onSurfaceVariant} />
              <Text style={styles.transcriptionText}>
                Transcription IA en attente...
              </Text>
            </View>
          </View>
        )}

        {/* Texte d'aide contextuel */}
        {recordingState !== 'captured' && (
          <View style={styles.hintSection}>
            <Text style={styles.hintText}>
              {recordingState === 'ready'
                ? "Appuie pour commencer le ndem audio. L'IA s'occupe de transformer ta voix en meme viral."
                : "Enregistrement en cours... Appuie à nouveau pour arrêter."}
            </Text>
          </View>
        )}
      </View>

      {/* Footer actions (visible si capturé) */}
      {recordingState === 'captured' && (
        <View style={styles.footer}>
          {isSubmitting ? (
            <View style={styles.submittingRow}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.submittingText}>Envoi en cours...</Text>
            </View>
          ) : (
             <AfroButton
               title="Envoyer l'Audio à l'IA"
               onPress={handleSubmitAudio}
               color={COLORS.primary}
             />
          )}
        </View>
      )}
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

  // Mic Zone
  micZone: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: COLORS.secondary,
    borderRadius: 999,
  },
  pulseRingOuter: {
    width: 250,
    height: 250,
    opacity: 0.15,
  },
  pulseRingInner: {
    width: 220,
    height: 220,
    opacity: 0.25,
  },
  micButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    ...ELEVATION.level2,
  },
  micIcon: {
    // Removed as Icon is now used
  },
  timerDisplay: {
    ...FONTS.labelLg,
    color: COLORS.onSurfaceVariant,
    marginTop: SPACING.lg,
    letterSpacing: 3,
    fontSize: 18,
  },

  // Captured Zone
  capturedZone: {
    width: '100%',
    marginTop: SPACING.lg,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerHighest,
    borderRadius: RADII.lg,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    ...ELEVATION.level1,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...ELEVATION.level1,
  },
  playIcon: {
    // Removed as Icon is now used
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.outlineVariant,
    borderRadius: 2,
    marginHorizontal: SPACING.sm,
    overflow: 'hidden',
  },
  progressFill: {
    width: '33%',
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  trashButton: {
    padding: SPACING.xs,
  },
  trashIcon: {
    // Removed as Icon is now used
  },
  transcriptionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  transcriptionText: {
    ...FONTS.labelLg,
    color: COLORS.onSurfaceVariant,
    fontStyle: 'italic',
    marginLeft: SPACING.xs,
  },

  // Hint
  hintSection: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  hintText: {
    ...FONTS.bodyMd,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Footer
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
