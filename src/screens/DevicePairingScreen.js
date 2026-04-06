import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors } from '../theme/colors';
import { usePairing } from '../state/pairing';
import { PrimaryButton } from '../components/PrimaryButton';
import { OutlineButton } from '../components/OutlineButton';

function CodeBoxes({ value, onChange }) {
  const digits = (value ?? '').replace(/\D/g, '').slice(0, 6).padEnd(6, ' ');

  return (
    <View style={{ marginTop: 10 }}>
      <View style={styles.boxRow}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={styles.codeBox}>
            <Text style={styles.codeBoxText}>{digits[i] === ' ' ? '' : digits[i]}</Text>
          </View>
        ))}
      </View>

      {/* Hidden input drives the boxes */}
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
  const { pairedDevices, addDevice } = usePairing();
  const [code, setCode] = useState('');

  const canAddManually = useMemo(() => code.length === 6, [code]);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Device Pairing</Text>
      </View>

      <Text style={styles.subtitle}>Enter Code</Text>
      <Text style={styles.desc}>Enter The Code Displayed On Your Device</Text>

      <View style={{ height: 28 }} />

      <CodeBoxes value={code} onChange={setCode} />

      <View style={{ height: 22 }} />

      <View style={styles.manualButtons}>
        <OutlineButton
          title="Cancel"
          onPress={() => navigation.goBack()}
          style={{ flex: 1, marginRight: 10 }}
        />
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
          style={{ flex: 1, borderRadius: 14 }}
        />
      </View>

      <View style={{ flex: 1 }} />

      <Text style={styles.footerNote}>
        QR scanning requires a dev build. In Expo Go, use manual code entry.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  backBtn: { position: 'absolute', left: 0, padding: 8, marginLeft: -4 },
  title: { color: colors.text, fontSize: 26, fontWeight: '900' },
  subtitle: { color: colors.primary, fontSize: 18, fontWeight: '900', textAlign: 'center', marginTop: 16 },
  desc: { color: colors.muted, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  centerBox: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  muted: { color: colors.muted, fontWeight: '700' },
  footerNote: { color: colors.muted, textAlign: 'center', fontWeight: '600', marginBottom: 8 },
  boxRow: { flexDirection: 'row', justifyContent: 'center' },
  codeBox: {
    width: 44,
    height: 54,
    borderRadius: 10,
    backgroundColor: 'rgba(34,197,94,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  codeBoxText: { color: colors.text, fontSize: 22, fontWeight: '900' },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 1,
    width: 1,
  },
  manualButtons: { flexDirection: 'row', marginTop: 6, justifyContent: 'space-between' },
});

