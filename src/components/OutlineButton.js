import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';
import { BUTTON_BORDER_RADIUS, BUTTON_MIN_HEIGHT } from '../theme/layout';

export function OutlineButton({ title, onPress, disabled, style, accessibilityLabel }) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled ? styles.disabled : null,
        pressed ? { opacity: 0.9 } : null,
        style,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    width: '100%',
    minHeight: BUTTON_MIN_HEIGHT,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: BUTTON_BORDER_RADIUS,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  disabled: { opacity: 0.5 },
  text: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});

