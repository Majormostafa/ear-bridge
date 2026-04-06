import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../theme/colors';
import { useAuth } from '../state/auth';
import { useSubscription } from '../state/subscription';

function RowItem({ title, subtitle, icon, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.flex1}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

export function SettingsScreen({ navigation }) {
  const { signOut, user } = useAuth();
  const { accessGranted, trialActive } = useSubscription();

  return (
    <ScreenWrapper>
      <View style={styles.layout}>
        <View style={styles.main}>
          <View style={styles.top}>
            <Text style={styles.title}>Setting</Text>
            <Text style={styles.welcome}>
              {user?.email ?? ''} {accessGranted ? '' : '(Limited)'}
            </Text>
          </View>

          <View style={styles.spacer} />

          <View style={styles.card}>
            <RowItem
              title="Permissions"
              subtitle="Microphone, Camera, Notifications"
              icon={<Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />}
              onPress={() => {
                const parent = navigation.getParent?.();
                if (parent?.replace) parent.replace('Permissions');
                else if (parent?.navigate) parent.navigate('Permissions');
                else navigation.replace('Permissions');
              }}
            />
            <View style={styles.divider} />
            <RowItem
              title="Subscription"
              subtitle={accessGranted ? (trialActive ? 'Trial Active' : 'Full Access') : 'Start 7 Days Free'}
              icon={<Ionicons name="sparkles-outline" size={20} color={colors.primary} />}
              onPress={() => {
                const parent = navigation.getParent?.();
                if (parent?.replace) parent.replace('Subscription');
                else if (parent?.navigate) parent.navigate('Subscription');
                else navigation.replace('Subscription');
              }}
            />
            <View style={styles.divider} />
            <RowItem
              title="Device Pairing"
              subtitle="Scan QR or enter code"
              icon={<Ionicons name="qr-code-outline" size={20} color={colors.primary} />}
              onPress={() => {
                const parent = navigation.getParent?.();
                if (parent?.navigate) parent.navigate('DevicePairing');
                else navigation.navigate('DevicePairing');
              }}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={() =>
              Alert.alert('Sign out', 'This clears local session on this device only.', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Sign out',
                  style: 'destructive',
                  onPress: () => {
                    const parent = navigation.getParent?.();
                    signOut().then(() => {
                      if (parent?.replace) parent.replace('Login');
                      else navigation.replace('Login');
                    });
                  },
                },
              ])
            }
            style={styles.signOutBtn}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.danger} style={{ marginRight: 10 }} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
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
  spacer: { height: 14 },
  top: { marginTop: 8 },
  title: { color: colors.text, fontSize: 26, fontWeight: '900' },
  welcome: { color: colors.muted, marginTop: 6, fontSize: 14, lineHeight: 18 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 10 },
  iconWrap: {
    aspectRatio: 1,
    minWidth: 40,
    minHeight: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(11,107,31,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTitle: { color: colors.text, fontWeight: '900' },
  rowSub: { color: colors.muted, marginTop: 4, fontSize: 13, lineHeight: 18 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  footer: {
    width: '100%',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  signOutText: { color: colors.danger, fontWeight: '900', fontSize: 15 },
});
