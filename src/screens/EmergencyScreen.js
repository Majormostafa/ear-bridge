import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors } from '../theme/colors';
import { usePairing } from '../state/pairing';
import { formatRelativeTime, useAlerts } from '../state/alerts';
import { PrimaryButton } from '../components/PrimaryButton';

function DeviceRow({ device }) {
  return (
    <View style={styles.deviceRow}>
      <View style={styles.deviceIcon}>
        <Ionicons name="phone-portrait-outline" size={16} color="#ffffff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={[styles.deviceStatus, device.connected ? { color: colors.success } : { color: colors.muted }]}>
          {device.connected ? 'Connected' : 'Not Connected'}
        </Text>
      </View>
      <Ionicons name="hammer-outline" size={18} color={colors.muted} />
    </View>
  );
}

export function EmergencyScreen({ navigation }) {
  const { pairedDevices } = usePairing();
  const { alerts, clearAlerts, addAlert } = useAlerts();

  async function sendEmergency() {
    if (pairedDevices.length === 0) {
      Alert.alert('No paired devices', 'Pair a device first.');
      return;
    }

    const target = pairedDevices[0];
    await addAlert({ type: 'Emergency Alert', label: 'Emergency Alert', location: target?.name ?? '' });

    Alert.alert('Sent', 'Emergency alert sent locally (demo).');
  }

  return (
    <ScreenContainer style={{ paddingHorizontal: 0 }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={22} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>Emergency</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <View style={styles.pairedRow}>
          <Text style={styles.pairedTitle}>Paired Device:</Text>
          <Pressable onPress={() => navigation.navigate('DevicePairing')}>
            <Text style={styles.addLink}>Add</Text>
          </Pressable>
        </View>

        <View style={styles.deviceList}>
          {pairedDevices.length === 0 ? (
            <Text style={styles.muted}>No devices paired. Add one to enable emergency alerts.</Text>
          ) : (
            pairedDevices.slice(0, 5).map((d) => <DeviceRow key={d.id} device={d} />)
          )}
        </View>

        <View style={{ height: 14 }} />

        <PrimaryButton title="Send emergency alert" onPress={sendEmergency} style={styles.emergencyBtn} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Incoming Alert</Text>
          <Pressable onPress={() => clearAlerts()}>
            <Text style={styles.clear}>Clear History</Text>
          </Pressable>
        </View>

        <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' }}>
          {alerts.length === 0 ? (
            <Text style={styles.muted}>No alerts available.</Text>
          ) : (
            alerts.slice(0, 4).map((a) => (
              <View key={a.id} style={styles.alertRow}>
                <View style={styles.alertIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.alertTitle}>{a.label}</Text>
                  <Text style={styles.alertSub}>
                    {a.location ? `${a.location} • ` : ''}
                    {formatRelativeTime(Date.now(), a.createdAt)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </View>
            ))
          )}
        </View>

        <View style={styles.needHelp}>
          <Ionicons name="help-circle-outline" size={18} color={colors.muted} />
          <Text style={styles.needHelpText}>Need help?</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingTop: 14,
    paddingBottom: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  backBtn: { position: 'absolute', left: 16, top: 14 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '900' },
  body: { flex: 1, paddingHorizontal: 18, paddingTop: 14 },
  pairedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pairedTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  addLink: { color: colors.primary, fontWeight: '900', fontSize: 14, textDecorationLine: 'underline' },
  deviceList: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
  },
  deviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  deviceIcon: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: 'rgba(11,107,31,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deviceName: { color: colors.text, fontWeight: '900' },
  deviceStatus: { marginTop: 4, fontSize: 13, fontWeight: '700' },
  muted: { color: colors.muted, marginTop: 10, lineHeight: 20 },
  emergencyBtn: { borderRadius: 14, marginTop: 0 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
  sectionTitle: { color: colors.text, fontWeight: '900' },
  clear: { color: colors.primary, fontWeight: '900' },
  alertRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  alertIcon: { width: 18, height: 18, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', marginRight: 12 },
  alertTitle: { color: colors.text, fontWeight: '900' },
  alertSub: { color: colors.muted, marginTop: 4, fontSize: 13 },
  needHelp: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  needHelpText: { color: colors.muted, fontWeight: '800', marginLeft: 10 },
});

