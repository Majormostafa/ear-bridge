import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../theme/colors';
import { usePairing } from '../state/pairing';
import { formatRelativeTime, useAlerts } from '../state/alerts';
import { PrimaryButton } from '../components/PrimaryButton';
import { SCREEN_HORIZONTAL_PADDING } from '../theme/layout';

function DeviceRow({ device }) {
  return (
    <View style={styles.deviceRow}>
      <View style={styles.deviceIcon}>
        <Ionicons name="phone-portrait-outline" size={16} color="#ffffff" />
      </View>
      <View style={styles.flex1}>
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
    <ScreenWrapper horizontalPadding={0}>
      <View style={styles.layout}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Back">
            <Ionicons name="chevron-back" size={22} color="#ffffff" />
          </Pressable>
          <Text style={styles.headerTitle}>Emergency</Text>
        </View>

        <View style={[styles.body, { paddingHorizontal: SCREEN_HORIZONTAL_PADDING }]}>
          <View style={styles.main}>
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

            <View style={styles.spacer} />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Incoming Alert</Text>
              <Pressable onPress={() => clearAlerts()}>
                <Text style={styles.clear}>Clear History</Text>
              </Pressable>
            </View>

            <View style={styles.listTop}>
              {alerts.length === 0 ? (
                <Text style={styles.muted}>No alerts available.</Text>
              ) : (
                alerts.slice(0, 4).map((a) => (
                  <View key={a.id} style={styles.alertRow}>
                    <View style={styles.alertIcon} />
                    <View style={styles.flex1}>
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
          </View>

          <View style={styles.footer}>
            <PrimaryButton title="Send emergency alert" onPress={sendEmergency} />
            <View style={styles.needHelp}>
              <Ionicons name="help-circle-outline" size={18} color={colors.muted} />
              <Text style={styles.needHelpText}>Need help?</Text>
            </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  flex1: { flex: 1 },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 14,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
  },
  backBtn: { position: 'absolute', left: SCREEN_HORIZONTAL_PADDING, top: 14, paddingVertical: 4, paddingRight: 8 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '900', textAlign: 'center' },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 14,
  },
  main: {
    flex: 1,
    minHeight: 0,
  },
  spacer: { height: 14 },
  pairedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pairedTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  addLink: { color: colors.primary, fontWeight: '900', fontSize: 14, textDecorationLine: 'underline' },
  deviceList: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    marginTop: 10,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  deviceIcon: {
    aspectRatio: 1,
    minWidth: 34,
    minHeight: 34,
    borderRadius: 999,
    backgroundColor: 'rgba(11,107,31,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deviceName: { color: colors.text, fontWeight: '900' },
  deviceStatus: { marginTop: 4, fontSize: 13, fontWeight: '700' },
  muted: { color: colors.muted, marginTop: 10, lineHeight: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
  sectionTitle: { color: colors.text, fontWeight: '900' },
  clear: { color: colors.primary, fontWeight: '900' },
  listTop: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', marginTop: 8 },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  alertIcon: {
    aspectRatio: 1,
    minWidth: 18,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginRight: 12,
  },
  alertTitle: { color: colors.text, fontWeight: '900' },
  alertSub: { color: colors.muted, marginTop: 4, fontSize: 13 },
  footer: {
    width: '100%',
    paddingBottom: 4,
  },
  needHelp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  needHelpText: { color: colors.muted, fontWeight: '800', marginLeft: 10 },
});
