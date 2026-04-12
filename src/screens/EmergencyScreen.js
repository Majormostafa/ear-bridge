import React, { useCallback, useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AlertTriangle, Ambulance, ArrowLeft, Bell, Flame, Volume2 } from 'lucide-react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useAppTheme } from '../state/appTheme';
import { usePairing } from '../state/pairing';
import { formatRelativeTime, getAlertDisplayLabel, useAlerts } from '../state/alerts';
import { PrimaryButton } from '../components/PrimaryButton';
import { SCREEN_HORIZONTAL_PADDING } from '../theme/layout';

const HEADER_GREEN = '#2E7D32';
const PAGE_NAVY = '#0F172A';
const ACTION_GREEN = '#4ADE80';
const ALERT_ICON_BG = 'rgba(76, 175, 80, 0.1)';

function EmergencyAlertRowIcon({ label }) {
  const l = (label || '').toLowerCase();
  const color = ACTION_GREEN;
  const lucideSize = 22;
  const lucideProps = { size: lucideSize, color, strokeWidth: 2 };

  if (l.includes('baby')) {
    return <MaterialCommunityIcons name="baby-face-outline" size={22} color={color} />;
  }
  if (l.includes('loud') || l.includes('noise')) {
    return <Volume2 {...lucideProps} />;
  }
  if (l.includes('ambulance')) {
    return <Ambulance {...lucideProps} />;
  }
  if (l.includes('fire') || l.includes('alarm')) {
    return <Flame {...lucideProps} />;
  }
  if (l.includes('door bell') || l.includes('doorbell')) {
    return <Bell {...lucideProps} />;
  }
  if (l.includes('emergency')) {
    return <AlertTriangle {...lucideProps} />;
  }
  return <Bell {...lucideProps} />;
}

function DeviceRow({ device, styles, colors }) {
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

export function EmergencyScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useAppTheme();
  const { pairedDevices } = usePairing();
  const { alerts, clearAlerts, addAlert } = useAlerts();

  const onBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  }, [navigation]);

  const styles = useMemo(() => {
    const rowSep = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)';
    const listTop = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';

    return StyleSheet.create({
      layout: {
        flex: 1,
        backgroundColor: PAGE_NAVY,
      },
      flex1: { flex: 1 },
      header: {
        backgroundColor: HEADER_GREEN,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingBottom: 32,
        overflow: 'hidden',
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SCREEN_HORIZONTAL_PADDING - 4,
      },
      headerSide: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerTitle: {
        flex: 1,
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.2,
      },
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
      addLink: { color: ACTION_GREEN, fontWeight: '900', fontSize: 14, textDecorationLine: 'underline' },
      deviceList: {
        backgroundColor: colors.card,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        padding: 14,
        marginTop: 10,
      },
      deviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: rowSep,
      },
      deviceIcon: {
        aspectRatio: 1,
        minWidth: 34,
        minHeight: 34,
        borderRadius: 999,
        backgroundColor: 'rgba(46,125,50,0.55)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      },
      deviceName: { color: colors.text, fontWeight: '900' },
      deviceStatus: { marginTop: 4, fontSize: 13, fontWeight: '700' },
      muted: { color: colors.muted, marginTop: 10, lineHeight: 20 },
      sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
      sectionTitle: { color: colors.text, fontWeight: '900' },
      clear: { color: ACTION_GREEN, fontWeight: '900' },
      listTop: { borderTopWidth: 1, borderTopColor: listTop, marginTop: 8 },
      alertRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: rowSep,
      },
      alertIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: ALERT_ICON_BG,
        alignItems: 'center',
        justifyContent: 'center',
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
        borderTopColor: colors.hairlineOnBg,
      },
      needHelpText: { color: colors.muted, fontWeight: '800', marginLeft: 10 },
    });
  }, [colors, isDarkMode]);

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
    <ScreenWrapper horizontalPadding={0} edges={['left', 'right', 'bottom']} style={{ backgroundColor: PAGE_NAVY }}>
      <View style={styles.layout}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View style={styles.headerRow}>
            <Pressable onPress={onBack} style={styles.headerSide} hitSlop={12} accessibilityLabel="Back">
              <ArrowLeft color="#FFFFFF" size={24} strokeWidth={2} />
            </Pressable>
            <Text style={styles.headerTitle}>Emergency</Text>
            <View style={styles.headerSide} />
          </View>
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
                pairedDevices.slice(0, 5).map((d) => <DeviceRow key={d.id} device={d} styles={styles} colors={colors} />)
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
                    <View style={styles.alertIconCircle}>
                      <EmergencyAlertRowIcon label={a.label} />
                    </View>
                    <View style={styles.flex1}>
                      <Text style={styles.alertTitle}>{getAlertDisplayLabel(a.label)}</Text>
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
