export const COLORS = {
  background: '#F3F8EF',
  surface: '#FFFFFF',
  surfaceSoft: '#E8F3E4',
  surfaceMuted: '#D8E8D2',
  ink: '#102017',
  textMain: '#102017',
  textSecondary: '#5D6F63',
  primary: '#0F7B3A',
  primaryDark: '#07552A',
  primaryLight: '#36A866',
  primaryContainer: '#CDEFD8',
  onPrimary: '#FFFFFF',
  secondary: '#16463A',
  secondaryContainer: '#D6EEE7',
  onSecondaryContainer: '#183B32',
  accent: '#E3A72F',
  accentSoft: '#FFF0C4',
  coral: '#D96C4A',
  error: '#B3261E',
  border: '#C7D9C3',
  borderStrong: '#98B79D',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  cardShadow: 'rgba(15, 123, 58, 0.14)',
  deepShadow: 'rgba(16, 32, 23, 0.18)',
} as const;

export const SPACING = {
  base: 4,
  xs: 8,
  sm: 14,
  md: 20,
  lg: 28,
  xl: 40,
  marginHorizontal: 20,
  gutter: 12,
} as const;

export const RADII = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 26,
  full: 999,
} as const;

export const ELEVATION = {
  level1: {
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  level2: {
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 7,
  },
} as const;

export const FONTS = {
  display: { fontSize: 34, fontWeight: '800' as const, lineHeight: 40, letterSpacing: 0 },
  headlineLg: { fontSize: 28, fontWeight: '800' as const, lineHeight: 34, letterSpacing: 0 },
  headlineMd: { fontSize: 22, fontWeight: '800' as const, lineHeight: 28, letterSpacing: 0 },
  title: { fontSize: 18, fontWeight: '800' as const, lineHeight: 24, letterSpacing: 0 },
  bodyLg: { fontSize: 17, fontWeight: '400' as const, lineHeight: 25, letterSpacing: 0 },
  bodyMd: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22, letterSpacing: 0 },
  labelLg: { fontSize: 14, fontWeight: '700' as const, lineHeight: 20, letterSpacing: 0 },
  labelSm: { fontSize: 12, fontWeight: '700' as const, lineHeight: 16, letterSpacing: 0 },
} as const;
