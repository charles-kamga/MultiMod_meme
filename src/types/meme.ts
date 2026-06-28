export type MemeSource = 'text' | 'audio' | 'image';

export interface MemeResult {
  id: string;
  topText?: string;
  bottomText?: string;
  punchline?: string;
  transcription?: string;
  imageUri?: string;
  sourceType: MemeSource;
  createdAt: number;
}
