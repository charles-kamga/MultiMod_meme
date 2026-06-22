/**
 * AFRO-UX DESIGN SYSTEM — Tokens
 * Palette inspirée des pigments naturels et paysages luxuriants d'Afrique de l'Ouest.
 * Réf: modern_afro_ux/DESIGN.md
 */

export const COLORS = {
  // — Surfaces —
  background: '#FAF6F0',
  surface: '#FCFCF8',
  surfaceContainer: '#F0EDED',
  surfaceContainerLow: '#F6F3F2',
  surfaceContainerHigh: '#EAE7E7',
  surfaceContainerHighest: '#E5E2E1',
  surfaceVariant: '#E5E2E1',
  white: '#FFFFFF',

  // — Primary (Terracotta) —
  primary: '#C84B31',
  primaryDark: '#A6331B',
  primaryContainer: '#C84B31',
  primaryFixed: '#FFDAD3',
  primaryFixedDim: '#FFB4A4',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#FFFBFF',

  // — Secondary (Rainforest Green) —
  secondary: '#1B4232',
  secondaryMid: '#3F6654',
  secondaryContainer: '#C1ECD5',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#456C5A',

  // — Tertiary / Accent (Warm Gold / Ocre) —
  accent: '#F4A261',
  tertiary: '#8A4B10',
  tertiaryContainer: '#A86328',
  tertiaryFixed: '#FFDCC4',
  tertiaryFixedDim: '#FFB780',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#FFFAFA',

  // — Text —
  textMain: '#1C1B1B',
  textSecondary: '#64748B',
  onSurface: '#1C1B1B',
  onSurfaceVariant: '#58413C',
  outline: '#8C716B',
  outlineVariant: '#E0BFB9',

  // — Inverse —
  inverseSurface: '#313030',
  inverseOnSurface: '#F3F0EF',
  inversePrimary: '#FFB4A4',

  // — Error —
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',

  // — Utility —
  cardShadow: 'rgba(200, 75, 49, 0.05)',
  deepShadow: 'rgba(26, 26, 26, 0.1)',
  transparent: 'transparent',
} as const;

export const SPACING = {
  base: 4,
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  marginHorizontal: 20,
  gutter: 12,
} as const;

export const RADII = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

export const ELEVATION = {
  level1: {
    shadowColor: '#C84B31',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  level2: {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
} as const;

export const FONTS = {
  headlineLg: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  headlineLgMobile: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  headlineMd: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  bodyLg: { fontSize: 18, fontWeight: '400' as const, lineHeight: 28 },
  bodyMd: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  labelLg: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20, letterSpacing: 0.5 },
  labelSm: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  displayLg: { fontSize: 40, fontWeight: '700' as const, lineHeight: 48, letterSpacing: -1 },
} as const;
