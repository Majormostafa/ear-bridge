import React, { useMemo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '../state/appTheme';

export function TextInputField({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  autoCapitalize = 'none',
  textContentType,
  style,
  error,
  onBlur,
  ...rest
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        outer: {
          width: '100%',
        },
        wrap: {
          width: '100%',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          paddingHorizontal: 14,
          paddingVertical: 10,
          backgroundColor: colors.inputBg,
        },
        wrapError: {
          borderColor: colors.danger,
        },
        input: {
          color: colors.text,
          fontSize: 17,
        },
        errorText: {
          color: colors.danger,
          fontSize: 13,
          marginTop: 6,
          marginLeft: 2,
        },
      }),
    [colors.danger, colors.inputBg, colors.inputBorder, colors.text],
  );

  return (
    <View style={[styles.outer, style]}>
      <View style={[styles.wrap, error ? styles.wrapError : null]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          textContentType={textContentType}
          style={styles.input}
          {...rest}
          onBlur={(e) => {
            rest.onBlur?.(e);
            onBlur?.(e);
          }}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
