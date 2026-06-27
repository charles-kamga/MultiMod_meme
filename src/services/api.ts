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
 * MODULE AUDIO (Voice-to-Meme)
 */
export const sendVoiceAudio = async (fileUri: string) => {
  try {
    const formData = new FormData();

    // ALERTE DAVE : Le serveur attend impérativement 'audioInput' au lieu de 'audio'
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