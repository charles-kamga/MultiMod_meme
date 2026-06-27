/**
 * ÉCRAN : RemixerScreen — Remix de Statut
 * Sélecteur d'image (caméra/galerie), zone de prévisualisation, champ expression.
 * Inspiré de la maquette `remix_de_statut/screen.png`
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';
import { Header, AfroButton } from '../components/SharedComponents';
import { sendImageRemix } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Remixer'>;

const RemixerScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    fileName: string;
    type: string;
  } | null>(null);
  const [expression, setExpression] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permission Caméra',
          message: 'L\'application a besoin d\'accéder à votre caméra pour prendre des photos.',
          buttonNeutral: 'Plus tard',
          buttonNegative: 'Refuser',
          buttonPositive: 'Autoriser',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleSelectFromGallery = async (): Promise<void> => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Erreur Galerie', result.errorMessage || 'Impossible de charger l\'image.');
        return;
      }

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage({
          uri: asset.uri || '',
          fileName: asset.fileName || 'upload.jpg',
          type: asset.type || 'image/jpeg',
        });
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image.');
    }
  };

  const handleTakeWithCamera = async (): Promise<void> => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Refusée', "L'accès à la caméra est nécessaire pour prendre une photo.");
      return;
    }

    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 1,
        saveToPhotos: true,
      });

      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Erreur Caméra', result.errorMessage || 'Impossible de prendre la photo.');
        return;
      }

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage({
          uri: asset.uri || '',
          fileName: asset.fileName || 'upload.jpg',
          type: asset.type || 'image/jpeg',
        });
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la capture photo.');
    }
  };

  const handleSubmitRemix = async (): Promise<void> => {
    if (!selectedImage) {
      Alert.alert('Oooh !', 'Sélectionne ou capture une image d\'abord.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendImageRemix(
        selectedImage.uri,
        selectedImage.fileName,
        selectedImage.type,
        expression.trim(),
      );
      
      navigation.navigate('MemeResult', {
        sourceType: 'image',
        punchline: result?.data?.punchline || result?.punchline || 'Remix réussi !',
        imageUrl: result?.data?.generatedImage || result?.generatedImage || 'https://via.placeholder.com/500',
      });
    } catch (error: any) {
      console.error('Erreur Remix:', error);
      Alert.alert('Erreur', error.message || 'Impossible de remixer l\'image.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Remix de Statut"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Zone de prévisualisation */}
        <View style={styles.previewZone}>
          {selectedImage ? (
            <View style={styles.imagePreviewWrapper}>
            <Image
              source={{ uri: selectedImage?.uri }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeImageBtn}
              onPress={() => setSelectedImage(null)}
            >
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyPreview}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyIcon}>🖼️</Text>
              </View>
              <Text style={styles.emptyText}>
                Aucun média sélectionné. Capture l'instant ou choisis dans ta galerie.
              </Text>
            </View>
          )}
        </View>

        {/* Boutons Galerie / Photo */}
        <View style={styles.mediaButtonsRow}>
          <TouchableOpacity
            style={[styles.mediaButton, { backgroundColor: COLORS.secondary }]}
            onPress={handleSelectFromGallery}
            activeOpacity={0.85}
          >
            <Text style={styles.mediaButtonIcon}>🖼️</Text>
            <Text style={styles.mediaButtonText}>Galerie</Text>
          </TouchableOpacity>
          <View style={styles.mediaButtonSpacer} />
          <TouchableOpacity
            style={[styles.mediaButton, { backgroundColor: COLORS.tertiaryContainer }]}
            onPress={handleTakeWithCamera}
            activeOpacity={0.85}
          >
            <Text style={styles.mediaButtonIcon}>📷</Text>
            <Text style={styles.mediaButtonText}>Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Champ expression camerounaise */}
        <View style={styles.expressionSection}>
          <Text style={styles.expressionLabel}>
            Expression Camerounaise (Optionnel)
          </Text>
          <View style={styles.expressionInputContainer}>
            <TextInput
              style={styles.expressionInput}
              placeholder="Ex: Ndem, Akié, C'est le feu..."
              placeholderTextColor={COLORS.outline}
              value={expression}
              onChangeText={setExpression}
              maxLength={100}
            />
            <Text style={styles.expressionInputIcon}>文</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Astuce du Studio</Text>
            <Text style={styles.tipText}>
              Gemini capte l'essence de ton expression pour créer un meme qui
              parle au pays.
            </Text>
          </View>
        </View>

        {/* Bouton d'action */}
        <View style={styles.actionSection}>
          {isSubmitting ? (
            <View style={styles.submittingRow}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.submittingText}>Remixage en cours...</Text>
            </View>
          ) : (
            <AfroButton
              title="Laisser Gemini Analyser ✨"
              onPress={handleSubmitRemix}
              color={COLORS.primary}
              disabled={!selectedImage}
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

  // Preview Zone
  previewZone: {
    marginTop: SPACING.sm,
    borderRadius: RADII.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.outlineVariant,
    borderStyle: 'dashed',
    backgroundColor: COLORS.primaryFixed,
    minHeight: 220,
  },
  emptyPreview: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.tertiaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  emptyIcon: {
    fontSize: 28,
  },
  emptyText: {
    ...FONTS.bodyMd,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  imagePreviewWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 260,
    borderRadius: RADII.lg - 2,
  },
  removeImageBtn: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },

  // Media Buttons
  mediaButtonsRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: RADII.md,
    ...ELEVATION.level1,
  },
  mediaButtonIcon: {
    fontSize: 18,
    marginRight: SPACING.xs,
  },
  mediaButtonText: {
    ...FONTS.labelLg,
    color: COLORS.white,
  },
  mediaButtonSpacer: {
    width: SPACING.sm,
  },

  // Expression
  expressionSection: {
    marginTop: SPACING.md,
  },
  expressionLabel: {
    ...FONTS.labelLg,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.xs,
  },
  expressionInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHighest,
    paddingHorizontal: SPACING.sm,
  },
  expressionInput: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: COLORS.textMain,
  },
  expressionInputIcon: {
    fontSize: 22,
    color: COLORS.onSurfaceVariant,
    marginLeft: SPACING.xs,
  },

  // Tip Card
  tipCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondaryContainer,
    borderRadius: RADII.lg,
    padding: SPACING.sm,
    marginTop: SPACING.md,
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 20,
    marginRight: SPACING.xs,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    ...FONTS.labelLg,
    color: COLORS.secondaryMid,
    marginBottom: SPACING.base,
  },
  tipText: {
    ...FONTS.bodyMd,
    color: COLORS.onSecondaryContainer,
    lineHeight: 22,
  },

  // Action
  actionSection: {
    marginTop: SPACING.lg,
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

export default RemixerScreen;
