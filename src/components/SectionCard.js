import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export function SectionCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
  },
});

