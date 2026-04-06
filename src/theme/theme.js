import { DefaultTheme } from '@react-navigation/native';
import { colors } from './colors';

// React Navigation v7 expects theme.fonts.* (e.g. `fonts.regular`).
// We merge into DefaultTheme so header config doesn’t crash.
export const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
};

