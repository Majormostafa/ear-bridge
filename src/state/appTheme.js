import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkPalette, lightPalette } from '../theme/colors';
import { buildNavigationTheme } from '../theme/theme';

const STORAGE_KEY = '@earbridge_dark_mode';

const AppThemeContext = createContext(null);

export function AppThemeProvider({ children }) {
  const [isDarkMode, setDark] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v === '0') setDark(false);
      if (v === '1') setDark(true);
    });
  }, []);

  const setIsDarkMode = useCallback((next) => {
    setDark(next);
    AsyncStorage.setItem(STORAGE_KEY, next ? '1' : '0').catch(() => {});
  }, []);

  const value = useMemo(() => {
    const colors = isDarkMode ? darkPalette : lightPalette;
    return {
      isDarkMode,
      setIsDarkMode,
      colors,
      navTheme: buildNavigationTheme(colors, isDarkMode),
    };
  }, [isDarkMode, setIsDarkMode]);

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return ctx;
}
