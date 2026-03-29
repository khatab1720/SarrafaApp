// Powered by OnSpace.AI
export const Colors = {
  primary: '#11608F',       // Deep Blue
  primaryLight: '#1A7DB8',
  primaryDark: '#0A4A70',
  accent: '#F0B429',        // Gold
  accentDark: '#C89A1A',
  background: '#EEF2F7',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  success: '#16A34A',       // Green for income/positive
  successLight: '#DCFCE7',
  error: '#DC2626',         // Red for expense/negative
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  text: {
    primary: '#0D2137',   // Keep text dark for readability
    secondary: '#4B6278',
    muted: '#8FA3B1',
    light: '#FFFFFF',
    placeholder: '#A0AEC0',
  },
  border: '#E2EAF0',
  divider: '#EDF2F7',
  shadow: 'rgba(17, 96, 143, 0.15)',
  overlay: 'rgba(17, 96, 143, 0.6)',
  // Glassmorphism tokens
  glass: 'rgba(17, 96, 143, 0.72)',
  glassLight: 'rgba(255, 255, 255, 0.12)',
  glassBorder: 'rgba(255, 255, 255, 0.18)',
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
  xxxl: 34,
};

export const BorderRadius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,   // Modern iOS 17/Material 3 premium radius
  full: 999,
};

export const Shadows = {
  sm: {
    shadowColor: 'rgba(17, 96, 143, 0.12)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: 'rgba(17, 96, 143, 0.15)',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 7,
  },
  lg: {
    shadowColor: 'rgba(17, 96, 143, 0.20)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 22,
    elevation: 12,
  },
};
