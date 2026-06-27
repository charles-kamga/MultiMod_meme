import axios from 'axios';

// 1. Nouvelle URL officielle sur Vercel
const api = axios.create({
  baseURL: 'https://meme-project-kappa.vercel.app/api',
  timeout: 30000, // On passe à 30s car les serveurs gratuits Vercel peuvent être lents au réveil
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * MODULE TEXTE (Context Reader)
 */
export const sendContextText = async (text: string, mood: string) => {
  try {
    // ALERTE DAVE : Le serveur attend 'textInput'
    // On lui envoie le texte combiné avec le mood pour que Gemini ait tout le contexte
    const response = await api.post('/context/text', { 
      textInput: `[Mood: ${mood}] ${text}` 
    });
    
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du texte :", error);
    throw error;
  }
};

/**
 * MODULE AUDIO (Voice-to-Meme) — Version Axios
 */
export const sendVoiceAudio = async (fileUri: string) => {
  try {
    const formData = new FormData();

    formData.append('audioInput', {
      uri: fileUri,
      type: 'audio/wav',
      name: 'voice_recording.wav',
    } as any);

    const response = await api.post('/context/audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'audio :", error);
    throw error;
  }
};

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * MODULE AUDIO — Version Fetch (Dave)
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
 * MODULE IMAGE (Status Remixer - Image to Image)
 */
export const sendImageRemix = async (uri: string, fileName: string, type: string, textPrompt: string) => {
  try {
    const formData = new FormData();

    // 1. On ajoute le texte d'ambiance (champ 'textInput' demandé par Dave)
    formData.append('textInput', textPrompt || "Remix ce statut");

    // 2. On prépare et on ajoute le fichier image (champ 'imagesInputs' demandé par Dave)
    formData.append('imagesInputs', {
      uri: uri,
      name: fileName || 'upload.jpg',
      type: type || 'image/jpeg',
    } as any);

    // 3. Envoi de la requête multipart
    // Note : On ne force PAS le Content-Type pour laisser Axios gérer le boundary
    const response = await api.post('/context/text', formData);

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du Remix Image :", error);
    throw error;
  }
};