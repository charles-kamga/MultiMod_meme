import type { MemeResult } from '../types/meme';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Context: undefined;
  Voice: undefined;
  Remixer: undefined;
  MemeResult: {
    meme: MemeResult;
  };
  Gallery: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Gallery: undefined;
  Profile: undefined;
};
