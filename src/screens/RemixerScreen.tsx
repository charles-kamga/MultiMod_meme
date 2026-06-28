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
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';
import { Header, AfroButton, InfoPanel } from '../components/SharedComponents';
import {
  requestStoragePermission,
  requestCameraPermission,
  showPermissionDeniedAlert,
} from '../utils/permissions';
import { generateFromImage } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Remixer'>;

const RemixerScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expression, setExpression] = useState('Ndem du kwatt');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickFromGallery = async (): Promise<void> => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      showPermissionDeniedAlert('Galerie photos');
      return;
    }
    setSelectedImage('file:///data/user/0/com.multimodalmemeapp/cache/selected_image.jpg');
  };

  const handleTakePhoto = async (): Promise<void> => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      showPermissionDeniedAlert('Camera');
      return;
    }
    setSelectedImage('file:///data/user/0/com.multimodalmemeapp/cache/captured_photo.jpg');
  };

  const handleSubmitRemix = async (): Promise<void> => {
    if (!selectedImage) {
      Alert.alert('Image requise', "Selectionne ou capture une image avant d'envoyer.");
      return;
    }

    setIsSubmitting(true);
    const result = await generateFromImage(selectedImage, expression.trim() || undefined);
    setIsSubmitting(false);

    if (result.success && result.data) {
      navigation.navigate('MemeResult', { meme: result.data });
      return;
    }

    Alert.alert('Backend indisponible', result.error || "Impossible de remixer l'image.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Status Remixer"
        subtitle="Image vers punchline superposee"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.previewZone}>
          {selectedImage ? (
            <View style={styles.imagePreviewWrapper}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} resizeMode="cover" />
              <View style={styles.previewOverlay}>
                <Text style={styles.previewText}>PREVIEW REMIX</Text>
              </View>
              <TouchableOpacity
                style={styles.removeImageBtn}
                onPress={() => setSelectedImage(null)}
                activeOpacity={0.75}
              >
                <Text style={styles.removeImageText}>Retirer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyPreview}>
              <Text style={styles.emptyIcon}>IMG</Text>
              <Text style={styles.emptyTitle}>Aucune image</Text>
              <Text style={styles.emptyText}>
                Choisis un statut, une photo ou un screenshot a analyser par le backend.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.mediaButtonsRow}>
          <TouchableOpacity style={[styles.mediaButton, styles.galleryButton]} onPress={handlePickFromGallery} activeOpacity={0.85}>
            <Text style={styles.mediaButtonText}>Galerie</Text>
          </TouchableOpacity>
          <View style={styles.mediaButtonSpacer} />
          <TouchableOpacity style={[styles.mediaButton, styles.cameraButton]} onPress={handleTakePhoto} activeOpacity={0.85}>
            <Text style={styles.mediaButtonText}>Camera</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.expressionSection}>
          <Text style={styles.expressionLabel}>Expression locale optionnelle</Text>
          <TextInput
            style={styles.expressionInput}
            placeholder="Ex: Aki, ndem, on est ensemble..."
            placeholderTextColor={COLORS.textSecondary}
            value={expression}
            onChangeText={setExpression}
            maxLength={100}
          />
        </View>

        <View style={styles.panelSpace}>
          <InfoPanel
            title="Multer + Gemini Vision"
            body="Le fichier image part vers POST /generate/remix. Multer gere l'upload, Gemini analyse la scene et le backend renvoie le texte."
            tone="green"
          />
        </View>

        <View style={styles.actionSection}>
          {isSubmitting ? (
            <View style={styles.submittingRow}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.submittingText}>Analyse image en cours...</Text>
            </View>
          ) : (
            <AfroButton title="Remixer le statut" onPress={handleSubmitRemix} disabled={!selectedImage} />
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
  previewZone: {
    borderRadius: RADII.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.borderStrong,
    backgroundColor: COLORS.surface,
    minHeight: 250,
    ...ELEVATION.level1,
  },
  emptyPreview: {
    minHeight: 250,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    ...FONTS.headlineMd,
    color: COLORS.primary,
    backgroundColor: COLORS.primaryContainer,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADII.md,
    marginBottom: SPACING.sm,
  },
  emptyTitle: {
    ...FONTS.title,
    color: COLORS.textMain,
    marginBottom: 4,
  },
  emptyText: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  imagePreviewWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 270,
    backgroundColor: COLORS.surfaceMuted,
  },
  previewOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 32, 23, 0.78)',
    padding: SPACING.sm,
  },
  previewText: {
    ...FONTS.title,
    color: COLORS.white,
    textAlign: 'center',
  },
  removeImageBtn: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: COLORS.white,
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 7,
  },
  removeImageText: {
    ...FONTS.labelSm,
    color: COLORS.error,
  },
  mediaButtonsRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  mediaButton: {
    flex: 1,
    height: 50,
    borderRadius: RADII.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryButton: {
    backgroundColor: COLORS.primary,
  },
  cameraButton: {
    backgroundColor: COLORS.secondary,
  },
  mediaButtonText: {
    ...FONTS.labelLg,
    color: COLORS.white,
  },
  mediaButtonSpacer: {
    width: SPACING.sm,
  },
  expressionSection: {
    marginTop: SPACING.md,
  },
  expressionLabel: {
    ...FONTS.labelLg,
    color: COLORS.textMain,
    marginBottom: SPACING.xs,
  },
  expressionInput: {
    height: 54,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    color: COLORS.textMain,
    fontSize: 15,
  },
  panelSpace: {
    marginTop: SPACING.md,
  },
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
