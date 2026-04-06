import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../theme/colors';
import { usePairing } from '../state/pairing';
import { PrimaryButton } from '../components/PrimaryButton';
import { OutlineButton } from '../components/OutlineButton';

function CodeBoxes({ value, onChange }) {
  const digits = (value ?? '').replace(/\D/g, '').slice(0, 6).padEnd(6, ' ');

  return (
    <View style={styles.codeWrap}>
      <View style={styles.boxRow}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={styles.codeBox}>
            <Text style={styles.codeBoxText}>{digits[i] === ' ' ? '' : digits[i]}</Text>
          </View>
        ))}
      </View>

      <TextInput
        value={(value ?? '').replace(/\D/g, '').slice(0, 6)}
        keyboardType="number-pad"
        onChangeText={(t) => onChange((t ?? '').replace(/\D/g, '').slice(0, 6))}
        style={styles.hiddenInput}
        autoFocus
      />
    </View>
  );
}

export function DevicePairingScreen({ navigation }) {
  const { addDevice } = usePairing();
  const [code, setCode] = useState('');

  const canAddManually = useMemo(() => code.length === 6, [code]);

  return (
    <ScreenWrapper>
      <View style={styles.layout}>
        <View style={styles.main}>
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Back">
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </Pressable>
            <Text style={styles.title}>Device Pairing</Text>
          </View>

          <Text style={styles.subtitle}>Enter Code</Text>
          <Text style={styles.desc}>Enter The Code Displayed On Your Device</Text>

          <View style={styles.spacerLg} />

          <CodeBoxes value={code} onChange={setCode} />

          <View style={styles.spacerMd} />
        </View>

        <View style={styles.footer}>
          <View style={styles.manualButtons}>
            <View style={styles.btnHalf}>
              <OutlineButton title="Cancel" onPress={() => navigation.goBack()} />
            </View>
            <View style={styles.btnHalf}>
              <PrimaryButton
                title="Pair"
                disabled={!canAddManually}
                onPress={async () => {
                  await addDevice({
                    deviceId: `code_${code}`,
                    name: 'Paired device',
                    connected: true,
                  });
                  Alert.alert('Device paired', 'Saved locally (demo).', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                  ]);
                }}
              />
            </View>
          </View>

          <View style={styles.spacerSm} />

          <Text style={styles.footerNote}>
            QR scanning requires a dev build. In Expo Go, use manual code entry.
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'space-between',
  },
  main: {
    flex: 1,
    minHeight: 0,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative', marginTop: 4 },
  backBtn: { position: 'absolute', left: 0, padding: 8, marginLeft: -8 },
  title: { color: colors.text, fontSize: 26, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: colors.primary, fontSize: 18, fontWeight: '900', textAlign: 'center', marginTop: 16 },
  desc: { color: colors.muted, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  spacerLg: { height: 28 },
  spacerMd: { height: 22 },
  spacerSm: { height: 10 },
  codeWrap: { marginTop: 10 },
  boxRow: { flexDirection: 'row', width: '100%', gap: 6 },
  codeBox: {
    flex: 1,
    minWidth: 0,
    minHeight: 54,
    borderRadius: 10,
    backgroundColor: 'rgba(34,197,94,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBoxText: { color: colors.text, fontSize: 22, fontWeight: '900' },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 1,
    width: 1,
  },
  manualButtons: { flexDirection: 'row', width: '100%', gap: 10 },
  btnHalf: { flex: 1, minWidth: 0 },
  footer: {
    width: '100%',
    paddingBottom: 8,
  },
  footerNote: { color: colors.muted, textAlign: 'center', fontWeight: '600' },
});
