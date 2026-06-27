/**
 * TYPES DE NAVIGATION — Typage strict des routes et paramètres
 */

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Context: undefined;
  Voice: undefined;
  Remixer: undefined;
  MemeResult: {
    meme?: any;
    memeUrl?: string;
    punchlineTop?: string;
    punchlineBottom?: string;
    transcription?: string;
    source?: 'context' | 'voice' | 'remix';
    sourceType?: 'voice' | 'context' | 'remix' | 'text' | 'audio' | 'image';
    resultData?: any;
  };
  Gallery: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Gallery: undefined;
  Profile: undefined;
};
