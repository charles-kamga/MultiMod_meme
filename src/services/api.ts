import type { MemeResult, MemeSource } from '../types/meme';
import { Image } from 'react-native';

const API_BASE_URL = 'http://10.0.2.2:5000/api';

const OFFLINE_IMAGES = {
  text: Image.resolveAssetSource(require('../assets/memes/context_ai.png')).uri,
  audio: Image.resolveAssetSource(require('../assets/memes/voice_ai.png')).uri,
  image: Image.resolveAssetSource(require('../assets/memes/remix_ai.png')).uri,
};

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

interface BackendMemePayload {
  id?: string;
  memeUrl?: string;
  imageUrl?: string;
  imageUri?: string;
  punchlineTop?: string;
  topText?: string;
  punchlineBottom?: string;
  bottomText?: string;
  punchline?: string;
  transcription?: string;
}

type Mood = 'clash' | 'ndolo' | 'nyanga' | 'sarcasme';

const moodLabels: Record<Mood, string> = {
  clash: 'Clash propre',
  ndolo: 'Ndolo discret',
  nyanga: 'Nyanga premium',
  sarcasme: 'Sarcasme doux',
};

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return {};
  }
  return JSON.parse(text);
}

function asPayload(json: unknown): BackendMemePayload {
  if (json && typeof json === 'object' && 'data' in json) {
    return (json as { data?: BackendMemePayload }).data ?? {};
  }
  return (json ?? {}) as BackendMemePayload;
}

function normalizeMeme(payload: BackendMemePayload, sourceType: MemeSource): MemeResult {
  const fallbackPunchline =
    sourceType === 'text'
      ? 'Le contexte a parle, le kwatt a compris.'
      : sourceType === 'audio'
        ? 'La voix est sortie, le meme aussi.'
        : 'Cette image avait deja une histoire.';

  return {
    id: payload.id ?? `${sourceType}-${Date.now()}`,
    topText: payload.punchlineTop ?? payload.topText ?? 'Meme IA',
    bottomText: payload.punchlineBottom ?? payload.bottomText ?? payload.punchline ?? fallbackPunchline,
    punchline: payload.punchline ?? payload.punchlineBottom ?? payload.bottomText ?? fallbackPunchline,
    transcription: payload.transcription,
    imageUri: payload.memeUrl ?? payload.imageUrl ?? payload.imageUri,
    sourceType,
    createdAt: Date.now(),
  };
}

function createOfflineMeme(sourceType: MemeSource, seed: string, mood?: Mood): MemeResult {
  const cleanSeed = seed.trim();
  const samples: Record<MemeSource, string[]> = {
    text: [
      'Quand tu lis la conversation et meme le silence a des preuves.',
      'Le contexte etait petit, mais le ndem etait en 4K.',
      'On voulait expliquer calmement, le screenshot a choisi la violence.',
    ],
    audio: [
      'La note vocale a commence doucement, puis le quartier a compris.',
      'Quand tu dis juste deux mots mais ca devient une reunion de famille.',
      'Le micro a capture la voix, mais aussi les intentions.',
    ],
    image: [
      'Cette photo navait pas de legende, elle avait deja un dossier.',
      'Quand le statut veut etre discret mais pose trop fort.',
      'Le sourire dit pardon, larriere-plan dit toute la verite.',
    ],
  };
  const bucket = samples[sourceType];
  const index = Math.abs(cleanSeed.length + sourceType.length) % bucket.length;
  const punchline = bucket[index];

  return {
    id: `demo-${sourceType}-${Date.now()}`,
    topText: sourceType === 'text' && mood ? moodLabels[mood] : 'Mode demo IA',
    bottomText: punchline,
    punchline,
    transcription: sourceType === 'audio' ? cleanSeed || 'Audio de demonstration transcrit localement.' : undefined,
    imageUri: OFFLINE_IMAGES[sourceType],
    sourceType,
    createdAt: Date.now(),
  };
}

async function requestBackend<T>(
  path: string,
  init: RequestInit,
  mapData: (json: unknown) => T,
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, init);
    const json = await parseJson(response);

    if (!response.ok) {
      const error =
        json && typeof json === 'object' && 'error' in json
          ? String((json as { error?: unknown }).error)
          : `Erreur backend ${response.status}`;
      return { success: false, error };
    }

    return { success: true, data: mapData(json) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur reseau inconnue';
    return { success: false, error: message };
  }
}

export async function checkBackendHealth(): Promise<ApiResponse<{ online: boolean }>> {
  return requestBackend('/health', { method: 'GET' }, () => ({ online: true }));
}

export async function generateFromContext(
  text: string,
  mood: Mood,
  locale: 'cm' | 'neutral' = 'cm',
): Promise<ApiResponse<MemeResult>> {
  const result = await requestBackend(
    '/generate/context',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, mood, locale }),
    },
    json => normalizeMeme(asPayload(json), 'text'),
  );
  return result.success ? result : { success: true, data: createOfflineMeme('text', text, mood) };
}

export async function generateFromVoice(
  audioFilePath: string,
  mimeType: string = 'audio/mp4',
): Promise<ApiResponse<MemeResult>> {
  const formData = new FormData();
  formData.append('audio', {
    uri: audioFilePath,
    type: mimeType,
    name: 'recording.m4a',
  } as unknown as Blob);
  formData.append('locale', 'cm');

  const result = await requestBackend(
    '/generate/voice',
    {
      method: 'POST',
      body: formData,
    },
    json => normalizeMeme(asPayload(json), 'audio'),
  );
  return result.success ? result : { success: true, data: createOfflineMeme('audio', audioFilePath) };
}

export async function generateFromImage(
  imageFilePath: string,
  expression?: string,
  mimeType: string = 'image/jpeg',
): Promise<ApiResponse<MemeResult>> {
  const formData = new FormData();
  formData.append('image', {
    uri: imageFilePath,
    type: mimeType,
    name: 'status.jpg',
  } as unknown as Blob);
  formData.append('locale', 'cm');

  if (expression) {
    formData.append('expression', expression);
  }

  const result = await requestBackend(
    '/generate/remix',
    {
      method: 'POST',
      body: formData,
    },
    json => normalizeMeme(asPayload(json), 'image'),
  );
  return result.success
    ? result
    : { success: true, data: createOfflineMeme('image', expression || imageFilePath) };
}

export { API_BASE_URL };
