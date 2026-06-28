/**
 * Couche de communication avec l'API Gateway Express.
 * Utilise Axios comme client HTTP principal (avec fallback fetch pour l'audio).
 * Tous les appels pointent vers https://meme-project-kappa.vercel.app/api.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://meme-project-kappa.vercel.app/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Envoie un texte à l'API pour générer un mème (Context Reader / Analyseur de Ndoki).
 * Le mood est préfixé au texte pour que l'IA reçoive le contexte émotionnel.
 *
 * @param text - Le contenu textuel à analyser
 * @param mood - L'ambiance choisie (clash, ndolo, nyanga, sarcasme)
 */
export const sendContextText = async (text: string, mood: string) => {
  try {
    const response = await api.post('/context/text', {
      textInput: `[Mood: ${mood}] ${text}`,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du texte :", error);
    throw error;
  }
};

/**
 * Envoie un fichier audio à l'API (Voice-to-Meme / La Voix du Kwatt).
 * Utilise `fetch` directement car FormData + Axios peut causer des conflits de boundary.
 *
 * @param audioFilePath - URI locale du fichier audio enregistré
 * @param mimeType - Type MIME de l'audio (défaut: audio/m4a)
 */
export async function generateFromVoice(
  audioFilePath: string,
  mimeType: string = 'audio/m4a',
): Promise<ApiResponse<any>> {
  try {
    const formData = new FormData();
    formData.append('audioInput', {
      uri: audioFilePath,
      type: mimeType,
      name: 'recording.m4a',
    } as any);

    const response = await fetch('https://meme-project-kappa.vercel.app/api/context/audio', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: `Erreur API Vercel (${response.status}): ${text}` };
    }

    const json = await response.json();
    return { success: true, data: json };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur réseau inconnue';
    return { success: false, error: message };
  }
}

/**
 * Envoie une image (et un texte optionnel) à l'API pour remixer en mème
 * (Status Remixer / Remix de Statut).
 *
 * @param uri - URI locale de l'image
 * @param fileName - Nom du fichier
 * @param type - Type MIME de l'image
 * @param textPrompt - Texte d'expression camerounaise (optionnel)
 */
export const sendImageRemix = async (uri: string, fileName: string, type: string, textPrompt: string) => {
  try {
    const formData = new FormData();

    formData.append('textInput', textPrompt || "Remix ce statut");

    formData.append('imagesInputs', {
      uri: uri,
      name: fileName || 'upload.jpg',
      type: type || 'image/jpeg',
    } as any);

    const response = await api.post('/context/text', formData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du Remix Image :", error);
    throw error;
  }
};

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}