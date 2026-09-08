import { Platform } from 'react-native';

const colors = {
  bg: '#FEFEFE',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: 'rgba(110, 66, 225, 0.12)', // Main purple #6E42E1 with opacity
  borderActive: '#6E42E1',
  muted: '#744BDC',
  
  // Accents mapped to new palette values
  neonCyan: '#9B68F4',
  neonMagenta: '#5B38C9',
  neonPurple: '#6E42E1',
  neonAmber: '#1F4A73',
  neonGreen: '#4D2EB7',
  
  // Base Text (HCI Contrast Compliant)
  textPrimary: '#1F4A73',   // Deep blue for readable titles on light surface
  textSecondary: '#4D2EB7', // Dark violet for readable labels and copy
  textMuted: '#744BDC',     // Light violet for secondary details
};

const spacing = { xs: 6, sm: 10, md: 16, lg: 24 };

const typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    web: 'system-ui',
  }),
  h1: 32,
  h2: 24,
  h3: 18,
  body: 15,
  small: 12,
  weightBold: '900',
  weightSemi: '700',
};

export default { colors, spacing, typography };
