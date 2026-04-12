import { DefaultTheme } from '@react-navigation/native';

export function buildNavigationTheme(palette, navigationDark) {
  return {
    ...DefaultTheme,
    dark: navigationDark,
    colors: {
      ...DefaultTheme.colors,
      primary: palette.primary,
      background: palette.background,
      card: palette.card,
      text: palette.text,
      border: palette.border,
      notification: palette.primary,
    },
  };
}
