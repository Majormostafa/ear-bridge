import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { SCREEN_HORIZONTAL_PADDING } from '../theme/layout';

/**
 * Safe area + keyboard avoidance + default horizontal padding.
 * Use a child with flex:1 and justifyContent: 'space-between' when anchoring actions to the bottom.
 */
export function ScreenWrapper({
  children,
  style,
  contentStyle,
  horizontalPadding = SCREEN_HORIZONTAL_PADDING,
  keyboardVerticalOffset = 0,
  edges,
}) {
  const padStyle =
    horizontalPadding != null ? { paddingHorizontal: horizontalPadding } : null;

  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges ?? ['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={[styles.inner, padStyle, contentStyle]}>{children}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  kav: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
});
