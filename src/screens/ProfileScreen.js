import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors } from '../theme/colors';
import { useAuth } from '../state/auth';
import { usePairing } from '../state/pairing';
import { useSubscription } from '../state/subscription';

export function ProfileScreen({ navigation }) {
  const { user } = useAuth();
  const { pairedDevices } = usePairing();
  const { accessGranted, trialActive } = useSubscription();

  return (
    <ScreenContainer>
      <View style={styles.top}>
        <View style={styles.avatar} />
        <Text style={styles.name}>{user?.name ?? 'User'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
      </View>

      <View style={{ height: 14 }} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Subscription</Text>
        <Text style={styles.cardBody}>{accessGranted ? (trialActive ? 'Trial Active' : 'Full Access') : 'Limited Access'}</Text>
      </View>

      <View style={{ height: 12 }} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Paired Devices</Text>
        {pairedDevices.length === 0 ? (
          <Text style={styles.cardBody}>No devices paired yet.</Text>
        ) : (
          pairedDevices.slice(0, 4).map((d) => (
            <View key={d.id} style={styles.deviceRow}>
              <Ionicons name="phone-portrait-outline" size={16} color={colors.primary} style={{ marginRight: 10 }} />
              <Text style={styles.deviceName}>{d.name}</Text>
              <View style={[styles.statusDot, { backgroundColor: d.connected ? colors.success : 'rgba(255,255,255,0.22)' }]} />
            </View>
          ))
        )}

        <Pressable
          onPress={() => {
            const parent = navigation.getParent?.();
            if (parent?.navigate) parent.navigate('DevicePairing');
            else navigation.navigate('DevicePairing');
          }}
          style={styles.pairBtn}
        >
          <Ionicons name="qr-code-outline" size={16} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.pairBtnText}>Add Device</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: 'center', marginTop: 16 },
  avatar: { width: 76, height: 76, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)' },
  name: { color: colors.text, fontWeight: '900', fontSize: 20, marginTop: 12 },
  email: { color: colors.muted, marginTop: 6, fontSize: 14 },
  card: { backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  cardTitle: { color: colors.text, fontWeight: '900', fontSize: 16 },
  cardBody: { color: colors.muted, marginTop: 8, lineHeight: 18, fontSize: 13 },
  deviceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  deviceName: { color: colors.text, fontWeight: '800', flex: 1 },
  statusDot: { width: 10, height: 10, borderRadius: 999 },
  pairBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 14, paddingVertical: 12, borderRadius: 14, backgroundColor: colors.primary },
  pairBtnText: { color: '#fff', fontWeight: '900', fontSize: 15 },
});

