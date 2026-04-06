import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';

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

const styles = StyleSheet.create({
  outer: {
    width: '100%',
  },
  wrap: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(17,27,46,0.35)',
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
});

