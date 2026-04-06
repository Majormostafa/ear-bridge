import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
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
  ...rest
}) {
  return (
    <View style={[styles.wrap, style]}>
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(17,27,46,0.35)',
  },
  input: {
    color: colors.text,
    fontSize: 17,
  },
});

