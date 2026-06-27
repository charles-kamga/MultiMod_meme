/**
 * SERVICE API — Communication avec le backend Flask
 * Base URL pointant vers l'émulateur Android (10.0.2.2 = localhost host machine)
 */

const API_BASE_URL = 'http://10.0.2.2:5000/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MemeResult {
  memeUrl: string;
  punchlineTop: string;
  punchlineBottom: string;
  transcription?: string;
  effectApplied?: string;
}

/**
 * POST /generate/context
 * Envoi du texte de conversation + mood pour générer un mème contextuel.
 */
export async function generateFromContext(
  text: string,
  mood: 'clash' | 'ndolo' | 'nyanga' | 'sarcasme',
): Promise<ApiResponse<MemeResult>> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate/context`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, mood }),
    });
    const json = await response.json();
    return { success: true, data: json };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur réseau inconnue';
    return { success: false, error: message };
  }
}

/**
 * POST /generate/voice
 * Envoi d'un fichier audio via FormData pour transcription + génération de mème.
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
 * POST /generate/remix
 * Envoi d'une image + expression camerounaise optionnelle pour remix visuel.
 */
export async function generateFromImage(
  imageFilePath: string,
  expression?: string,
  mimeType: string = 'image/jpeg',
): Promise<ApiResponse<MemeResult>> {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageFilePath,
      type: mimeType,
      name: 'photo.jpg',
    } as unknown as Blob);

    if (expression) {
      formData.append('expression', expression);
    }

    const response = await fetch(`${API_BASE_URL}/generate/remix`, {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData,
    });
    const json = await response.json();
    return { success: true, data: json };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur réseau inconnue';
    return { success: false, error: message };
  }
}

/**
 * GET /gallery
 * Récupération de la liste des mèmes récents.
 */
export async function fetchGallery(): Promise<ApiResponse<MemeResult[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await response.json();
    return { success: true, data: json };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur réseau inconnue';
    return { success: false, error: message };
  }
}
