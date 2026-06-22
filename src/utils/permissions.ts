/**
 * UTILITAIRES — Gestion des permissions Android
 * Microphone (enregistrement vocal) & Stockage (téléchargement d'images)
 */

import { Platform, PermissionsAndroid, Alert } from 'react-native';

/**
 * Demande la permission d'enregistrement audio (Microphone).
 * Retourne `true` si la permission est accordée.
 */
export async function requestMicrophonePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Permission Microphone',
        message:
          "L'application a besoin d'accéder à ton microphone pour enregistrer ta voix et créer des mèmes vocaux.",
        buttonNeutral: 'Plus tard',
        buttonNegative: 'Refuser',
        buttonPositive: 'Accepter',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Erreur permission micro:', err);
    return false;
  }
}

/**
 * Demande la permission de lecture des médias (images) pour Android 13+
 * ou la permission READ_EXTERNAL_STORAGE pour les versions antérieures.
 * Retourne `true` si la permission est accordée.
 */
export async function requestStoragePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const apiLevel = Platform.Version;

    if (typeof apiLevel === 'number' && apiLevel >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Accès aux Photos',
          message:
            "L'application a besoin d'accéder à tes photos pour sélectionner une image à remixer.",
          buttonNeutral: 'Plus tard',
          buttonNegative: 'Refuser',
          buttonPositive: 'Accepter',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Accès au Stockage',
        message:
          "L'application a besoin d'accéder au stockage pour sauvegarder et lire les mèmes.",
        buttonNeutral: 'Plus tard',
        buttonNegative: 'Refuser',
        buttonPositive: 'Accepter',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Erreur permission stockage:', err);
    return false;
  }
}

/**
 * Demande la permission d'accès à la caméra.
 * Retourne `true` si la permission est accordée.
 */
export async function requestCameraPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Accès à la Caméra',
        message:
          "L'application a besoin d'accéder à ta caméra pour prendre des photos à remixer.",
        buttonNeutral: 'Plus tard',
        buttonNegative: 'Refuser',
        buttonPositive: 'Accepter',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Erreur permission caméra:', err);
    return false;
  }
}

/**
 * Affiche une alerte expliquant que la permission est requise.
 */
export function showPermissionDeniedAlert(featureName: string): void {
  Alert.alert(
    'Permission requise',
    `Pour utiliser la fonctionnalité "${featureName}", tu dois autoriser l'accès dans les paramètres de ton téléphone.`,
    [{ text: 'Compris', style: 'default' }],
  );
}
