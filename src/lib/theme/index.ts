import { Platform } from 'react-native';
import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { colors } from './colors';

const fontFamily = Platform.OS === 'ios' ? 'Georgia' : 'serif';

const fontConfig = {
  fontFamily,
};

export const theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.shelfBrown,
    primaryContainer: colors.shelfLight,
    secondary: colors.textSecondary,
    secondaryContainer: colors.cream,
    background: colors.cream,
    surface: colors.warmWhite,
    surfaceVariant: colors.paper,
    error: colors.error,
    onPrimary: '#FFFFFF',
    onBackground: colors.textPrimary,
    onSurface: colors.textPrimary,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.textMuted,
  },
};

export type AppTheme = typeof theme;
