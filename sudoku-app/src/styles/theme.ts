export const Colors = {
  light: {
    background: '#FFFFFF',
    surface: '#FAFAFA',
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#DDDDDD',
    primary: '#007AFF',
    primaryDark: '#0051D5',
    success: '#52C41A',
    error: '#F5222D',
    warning: '#FAAD14',
    cellDefault: '#FFFFFF',
    cellHighlight: '#F9F9F9',
    cellSelected: '#F0F0F0',
    cellError: '#FFEBEE',
    cellConflict: '#FFF3E0',
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textTertiary: '#808080',
    border: '#333333',
    primary: '#5B9EFF',
    primaryDark: '#4A90E2',
    success: '#52C41A',
    error: '#FF4D4D',
    warning: '#FAAD14',
    cellDefault: '#2A2A2A',
    cellHighlight: '#1A237E',
    cellSelected: '#283593',
    cellError: '#B71C1C',
    cellConflict: '#E65100',
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

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodyXSmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};
