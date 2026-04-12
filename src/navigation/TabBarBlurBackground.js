import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../state/appTheme';

const DARK_GLASS_OVERLAY = 'rgba(15, 23, 42, 0.28)';
const LIGHT_GLASS_OVERLAY = 'rgba(248, 250, 252, 0.42)';

/**
 * Bottom tab bar backdrop: frosted glass on native, solid tint on web.
 */
export function TabBarBlurBackground() {
  const { isDarkMode } = useAppTheme();

  if (Platform.OS === 'web') {
    const webBg = isDarkMode ? 'rgba(15, 23, 42, 0.92)' : 'rgba(248, 250, 252, 0.94)';
    return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: webBg }]} />;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <BlurView intensity={72} tint={isDarkMode ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: isDarkMode ? DARK_GLASS_OVERLAY : LIGHT_GLASS_OVERLAY },
        ]}
      />
    </View>
  );
}
