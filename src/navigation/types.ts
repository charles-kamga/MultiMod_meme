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
    memeUrl?: string;
    punchlineTop?: string;
    punchlineBottom?: string;
    transcription?: string;
    source: 'context' | 'voice' | 'remix';
  };
  Gallery: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Gallery: undefined;
  Profile: undefined;
};
