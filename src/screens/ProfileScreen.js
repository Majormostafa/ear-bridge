import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAppTheme } from '../state/appTheme';
import { useAuth } from '../state/auth';
import { usePairing } from '../state/pairing';
import { useSubscription } from '../state/subscription';

export function ProfileScreen({ navigation }) {
  const { colors } = useAppTheme();
  const { user } = useAuth();
  const { pairedDevices } = usePairing();
  const { accessGranted, trialActive } = useSubscription();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        layout: {
          flex: 1,
          justifyContent: 'space-between',
        },
        main: {
          flex: 1,
          minHeight: 0,
        },
        spacer: { height: 14 },
        spacerSm: { height: 12 },
        top: { alignItems: 'center', marginTop: 16 },
        avatar: {
          width: '22%',
          maxWidth: 88,
          aspectRatio: 1,
          borderRadius: 999,
          backgroundColor: colors.profilePlaceholder,
        },
        name: { color: colors.text, fontWeight: '900', fontSize: 20, marginTop: 12 },
        email: { color: colors.muted, marginTop: 6, fontSize: 14 },
        card: {
          backgroundColor: colors.card,
          borderRadius: 18,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        },
        cardTitle: { color: colors.text, fontWeight: '900', fontSize: 16 },
        cardBody: { color: colors.muted, marginTop: 8, lineHeight: 18, fontSize: 13 },
        deviceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
        deviceName: { color: colors.text, fontWeight: '800', flex: 1 },
        statusDot: { aspectRatio: 1, minWidth: 10, borderRadius: 999 },
        footer: {
          width: '100%',
          paddingTop: 14,
          paddingBottom: 4,
        },
      }),
    [colors],
  );

  return (
    <ScreenWrapper>
      <View style={styles.layout}>
        <View style={styles.main}>
          <View style={styles.top}>
            <View style={styles.avatar} />
            <Text style={styles.name}>{user?.name ?? 'User'}</Text>
            <Text style={styles.email}>{user?.email ?? ''}</Text>
          </View>

          <View style={styles.spacer} />

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Subscription</Text>
            <Text style={styles.cardBody}>
              {accessGranted ? (trialActive ? 'Trial Active' : 'Full Access') : 'Limited Access'}
            </Text>
          </View>

          <View style={styles.spacerSm} />

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Paired Devices</Text>
            {pairedDevices.length === 0 ? (
              <Text style={styles.cardBody}>No devices paired yet.</Text>
            ) : (
              pairedDevices.slice(0, 4).map((d) => (
                <View key={d.id} style={styles.deviceRow}>
                  <Ionicons name="phone-portrait-outline" size={16} color={colors.primary} style={{ marginRight: 10 }} />
                  <Text style={styles.deviceName}>{d.name}</Text>
                  <View style={[styles.statusDot, { backgroundColor: d.connected ? colors.success : colors.offlineDot }]} />
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title="Add Device"
            onPress={() => {
              const parent = navigation.getParent?.();
              if (parent?.navigate) parent.navigate('DevicePairing');
              else navigation.navigate('DevicePairing');
            }}
            accessibilityLabel="Add paired device"
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
