import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../state/appTheme';

export function SectionCard({ children, style }) {
  const { colors } = useAppTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          width: '100%',
          backgroundColor: colors.card,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          padding: 16,
        },
      }),
    [colors.card, colors.cardBorder],
  );

  return <View style={[styles.card, style]}>{children}</View>;
}
