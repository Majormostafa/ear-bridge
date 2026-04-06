import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../theme/colors';
import { useAuth } from '../state/auth';
import { usePermissions } from '../state/permissions';
import { useSubscription } from '../state/subscription';
import { useAlerts } from '../state/alerts';
import { useSoundDetection } from '../detection/useSoundDetection';
import { PrimaryButton } from '../components/PrimaryButton';

function ProgressBar({ value }) {
  return (
    <View style={styles.progressWrap}>
      <View style={[styles.progressInner, { width: `${Math.max(0, Math.min(100, value))}%` }]} />
    </View>
  );
}

export function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { permissions } = usePermissions();
  const { accessGranted, trialActive } = useSubscription();
  const { addAlert } = useAlerts();

  const enabled = accessGranted && permissions.microphone;
  const [lastAmbulance, setLastAmbulance] = useState(null);

  useSoundDetection({
    enabled,
    onNewAlert: async (evt) => {
      await addAlert({ type: evt.type, label: evt.label, location: evt.location });
      if (evt.type === 'Emergency Sound' && (evt.label || '').toLowerCase().includes('ambulance')) {
        setLastAmbulance({
          label: evt.label,
          location: evt.location,
          confidence: evt.confidence,
        });
      }
    },
  });

  const status = useMemo(() => {
    if (!permissions.microphone) return 'Microphone required';
    if (!accessGranted) return 'Start Free Trial to detect sounds';
    return 'Listening';
  }, [permissions.microphone, accessGranted]);

  return (
    <ScreenWrapper>
      <View style={styles.layout}>
        <View style={styles.main}>
          <View style={styles.headerRow}>
            <View style={styles.profileCircle} />
            <View style={styles.headerText}>
              <Text style={styles.welcome}>Welcome {user?.name ?? 'User'}</Text>
              <Text style={styles.location}>Egypt, Cairo</Text>
            </View>
            <Ionicons name="notifications-outline" size={22} color={colors.muted} />
          </View>

          <View style={styles.listenWrap}>
            <View
              style={[
                styles.listenCircle,
                enabled ? { borderColor: 'rgba(34,197,94,0.7)' } : { borderColor: 'rgba(255,255,255,0.18)' },
              ]}
            >
              <View
                style={[
                  styles.listenDot,
                  enabled ? { backgroundColor: colors.primary } : { backgroundColor: 'rgba(255,255,255,0.35)' },
                ]}
              />
              <Text style={styles.listenTxt}>{enabled ? 'Listening' : 'Stopped'}</Text>
            </View>
          </View>

          {enabled && lastAmbulance ? (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.emergencyIconWrap}>
                  <Ionicons name="medical-outline" size={18} color="#ffffff" />
                </View>
                <Text style={styles.cardTitle}>Ambulance Nearby</Text>
                <Text style={styles.nowTag}>Now</Text>
              </View>
              <Text style={styles.cardBody}>Emergency Siren Detected, Check Your Surroundings</Text>
              <ProgressBar value={lastAmbulance.confidence || 95} />
              <View style={styles.confRow}>
                <Text style={styles.confLabel}>Confidence: </Text>
                <Text style={styles.confValue}>{lastAmbulance.confidence || 95}%</Text>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Status</Text>
              <Text style={styles.cardBody}>{status}</Text>
            </View>
          )}

          {!enabled && (
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.infoText}>
                {trialActive ? 'Microphone needed.' : 'Go to Subscription to start your trial.'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title="Emergency"
            disabled={!enabled}
            onPress={() => {
              if (!enabled) {
                Alert.alert('Emergency disabled', 'Start free trial and enable microphone to use emergency alerts.');
                return;
              }
              const parent = navigation.getParent?.();
              if (parent?.navigate) parent.navigate('Emergency');
              else navigation.navigate('Emergency');
            }}
          />
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
  headerText: { flex: 1, marginLeft: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  profileCircle: {
    aspectRatio: 1,
    width: '11%',
    maxWidth: 48,
    minWidth: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  welcome: { color: colors.text, fontSize: 16, fontWeight: '800' },
  location: { color: colors.muted, fontSize: 13, marginTop: 2 },
  listenWrap: { alignItems: 'center', marginTop: 22 },
  listenCircle: {
    width: '58%',
    maxWidth: 280,
    aspectRatio: 1,
    borderWidth: 10,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(17,27,46,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  listenDot: {
    aspectRatio: 1,
    width: '5.5%',
    maxWidth: 14,
    borderRadius: 999,
    backgroundColor: colors.primary,
    marginBottom: 14,
  },
  listenTxt: { color: colors.text, fontSize: 18, fontWeight: '900' },
  card: {
    marginTop: 18,
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  emergencyIconWrap: {
    aspectRatio: 1,
    minWidth: 34,
    minHeight: 34,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '900', flex: 1 },
  nowTag: { color: 'rgba(34,197,94,0.95)', fontWeight: '900' },
  cardBody: { color: colors.muted, marginTop: 10, lineHeight: 20 },
  progressWrap: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
    marginTop: 14,
  },
  progressInner: { height: '100%', backgroundColor: colors.primary },
  confRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 10 },
  confLabel: { color: colors.muted, fontSize: 14, fontWeight: '600' },
  confValue: { color: colors.text, fontSize: 16, fontWeight: '900' },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(11,107,31,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(11,107,31,0.22)',
  },
  infoText: { color: colors.muted, marginLeft: 10, lineHeight: 18, fontSize: 13, flex: 1 },
  footer: {
    width: '100%',
    paddingTop: 12,
    paddingBottom: 4,
  },
});
