import React, { useMemo } from 'react';
import { Alert, Linking, StyleSheet, Switch, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { usePermissions } from '../state/permissions';
import { ensureNotificationPermission } from '../utils/localNotifications';

function ToggleCard({ title, description, icon, value, onToggle }) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.flex1}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={(v) => onToggle(v)}
        thumbColor={value ? colors.primary : 'rgba(255,255,255,0.25)'}
        trackColor={{ false: 'rgba(255,255,255,0.18)', true: 'rgba(11,107,31,0.35)' }}
      />
    </View>
  );
}

export function PermissionsScreen({ navigation }) {
  const { permissions, booting, setPermissionGranted, allCoreGranted } = usePermissions();

  const ready = useMemo(() => allCoreGranted, [allCoreGranted]);

  async function requestMicrophone(on) {
    await setPermissionGranted('microphone', !!on);
    if (on) {
      Alert.alert('Microphone (demo)', 'Microphone permission is simulated in Expo Go. Listening simulation is enabled.');
    }
  }

  async function requestCamera(on) {
    if (!on) {
      await setPermissionGranted('camera', false);
      return;
    }
    const res = await Camera.requestCameraPermissionsAsync();
    if (res.status === 'granted') await setPermissionGranted('camera', true);
    else Alert.alert('Camera permission denied', 'Enable camera access for device pairing.');
  }

  async function requestNotifications(on) {
    if (!on) {
      await setPermissionGranted('notifications', false);
      return;
    }
    await setPermissionGranted('notifications', true);
    await ensureNotificationPermission();
    Alert.alert(
      'Notifications',
      'In Expo Go, OS push notifications may be limited. Alerts will show inside the app.',
    );
  }

  async function requestBackground(on) {
    if (!on) {
      await setPermissionGranted('background', false);
      return;
    }
    await setPermissionGranted('background', true);
    Alert.alert(
      'Background activity',
      'Front-end only: you can enable background activity from device settings if needed.',
      [
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
        { text: 'Later', style: 'cancel' },
      ]
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.layout}>
        <View style={styles.main}>
          <Text style={styles.title}>Permissions</Text>
          <Text style={styles.subtitle}>
            To Keep You Safe And Ensure The App Works Properly, Please Allow The Following Permissions:
          </Text>

          <View style={styles.spacerTop} />

          <View>
            <View style={styles.cardGap}>
              <ToggleCard
                title="Microphone Access"
                description="Detects Important Sounds Around You In Real Time."
                value={permissions.microphone}
                onToggle={(v) => requestMicrophone(v)}
                icon={<Ionicons name="mic" size={20} color={colors.primary} />}
              />
            </View>

            <View style={styles.cardGap}>
              <ToggleCard
                title="Camera Access"
                description="Used For Device Pairing And Emergency Features."
                value={permissions.camera}
                onToggle={(v) => requestCamera(v)}
                icon={<Ionicons name="camera" size={20} color={colors.primary} />}
              />
            </View>

            <View style={styles.cardGap}>
              <ToggleCard
                title="Notifications"
                description="Send Alerts When Important Sounds Are Detected."
                value={permissions.notifications}
                onToggle={(v) => requestNotifications(v)}
                icon={<Ionicons name="notifications" size={20} color={colors.primary} />}
              />
            </View>

            <View style={styles.cardGapLast}>
              <ToggleCard
                title="Background Activity"
                description="Sound Detection Running When App Closed."
                value={permissions.background}
                onToggle={(v) => requestBackground(v)}
                icon={<Ionicons name="battery-charging" size={20} color={colors.primary} />}
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title={booting ? 'Loading...' : 'Continue'}
            disabled={!ready}
            onPress={() => navigation.replace('Subscription')}
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
  flex1: { flex: 1 },
  spacerTop: { height: 14 },
  cardGap: { marginBottom: 12 },
  cardGapLast: { marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '900', color: colors.text, textAlign: 'center', marginTop: 8 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 10, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(17,27,46,0.25)',
  },
  iconWrap: {
    aspectRatio: 1,
    minWidth: 38,
    minHeight: 38,
    borderRadius: 999,
    backgroundColor: 'rgba(11,107,31,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  cardDesc: { color: colors.muted, fontSize: 13, marginTop: 6, lineHeight: 18 },
  footer: {
    width: '100%',
    paddingBottom: 4,
  },
});
