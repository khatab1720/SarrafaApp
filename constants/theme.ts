// Powered by OnSpace.AI
// ── Premium Modern Financial Design System ──

export const Colors = {
  // Core Brand
  primary: '#0D2B6B',          // Deep Navy (authority, trust)
  primaryMid: '#1A4299',       // Mid Navy
  primaryLight: '#2E5FC4',     // Bright Navy
  primarySurface: '#EDF2FF',   // Tinted navy surface

  // Accent — Premium Amber Gold
  accent: '#E8A020',
  accentBright: '#F5BC40',
  accentDark: '#B87918',
  accentSurface: '#FFF8E6',

  // Semantic
  success: '#00966D',          // Rich Emerald
  successLight: '#E6F7F2',
  successMid: '#00B884',

  error: '#D63347',            // Modern Crimson
  errorLight: '#FDEEF1',
  errorMid: '#E84563',

  warning: '#F59E0B',
  warningLight: '#FEF3C7',

  // Backgrounds
  background: '#F0F4FA',       // Blue-tinted off-white
  backgroundAlt: '#E8EDF8',    // Slightly deeper

  // Cards
  card: '#FFFFFF',
  cardTinted: '#FAFBFF',       // Very subtle blue tint

  // Text
  text: {
    primary: '#0C1E3E',        // Deep navy for max readability
    secondary: '#3D557A',      // Muted navy
    muted: '#7A95B8',          // Soft blue-gray
    light: '#FFFFFF',
    placeholder: '#A8BDD4',
    inverse: '#FFFFFF',
  },

  // Borders & Dividers
  border: '#D8E3F0',
  borderLight: '#EAF0F8',
  divider: '#EDF2F8',

  // Shadows
  shadow: 'rgba(13, 43, 107, 0.14)',

  // Overlay
  overlay: 'rgba(13, 43, 107, 0.65)',

  // Glassmorphism tokens
  glass: 'rgba(13, 43, 107, 0.78)',
  glassLight: 'rgba(255, 255, 255, 0.13)',
  glassBorder: 'rgba(255, 255, 255, 0.20)',

  // Currency Card Gradients (bg / border / accent / text)
  currencyUSD: {
    bg: '#EBF9F3',
    border: '#A7E8CE',
    accent: '#007A54',
    text: '#00533A',
    icon: '#00966D',
  },
  currencyEUR: {
    bg: '#EEF4FF',
    border: '#BACFF8',
    accent: '#2A5FC4',
    text: '#1A3D8F',
    icon: '#2E5FC4',
  },
  currencySYP: {
    bg: '#FFF6E6',
    border: '#F5D68A',
    accent: '#C47A00',
    text: '#8A5600',
    icon: '#E8A020',
  },
  currencyTRY: {
    bg: '#F8EEFF',
    border: '#D5AFFA',
    accent: '#7C3ABF',
    text: '#5B2590',
    icon: '#9147E0',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 36,
};

export const BorderRadius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 26,
  full: 999,
};

export const Shadows = {
  sm: {
    shadowColor: 'rgba(13, 43, 107, 0.10)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: 'rgba(13, 43, 107, 0.13)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  lg: {
    shadowColor: 'rgba(13, 43, 107, 0.18)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 28,
    elevation: 14,
  },
  accent: {
    shadowColor: 'rgba(232, 160, 32, 0.38)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 8,
  },
};

// Gradient presets (for reference in LinearGradient)
export const Gradients = {
  primaryHeader: ['#0D2B6B', '#1A4299'],
  primaryHero: ['#0C1E3E', '#0D2B6B', '#1A3A8C'],
  accentBtn: ['#F5BC40', '#E8A020'],
  successCard: ['#007A54', '#00966D'],
  errorCard: ['#C42840', '#D63347'],
  cardShimmer: ['#F0F4FA', '#E8EDF8', '#F0F4FA'],
};
