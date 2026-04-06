import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export function ScreenContainer({ children, style }) {
  return (
    <SafeAreaView style={[styles.safe, style]}>
      <View style={styles.bg}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bg: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
  },
});

