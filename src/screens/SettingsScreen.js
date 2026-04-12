import React, { useMemo } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Moon } from 'lucide-react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useAppTheme } from '../state/appTheme';
import { useAuth } from '../state/auth';
import { useSubscription } from '../state/subscription';

const SWITCH_ON_GREEN = '#2E7D32';

function RowItem({ title, subtitle, icon, onPress, colors, styles }) {
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

function ThemeToggleRow({ styles }) {
  const { isDarkMode, setIsDarkMode } = useAppTheme();

  return (
    <View style={styles.row}>
      <View style={styles.themeIconWrap}>
        <Moon size={20} color={SWITCH_ON_GREEN} strokeWidth={2} />
      </View>
      <View style={styles.flex1}>
        <Text style={styles.rowTitle}>App Theme</Text>
        <Text style={styles.rowSub}>Dark mode</Text>
      </View>
      <Switch
        accessibilityLabel="Toggle dark mode"
        value={isDarkMode}
        onValueChange={setIsDarkMode}
        trackColor={{ false: 'rgba(148, 163, 184, 0.45)', true: SWITCH_ON_GREEN }}
        thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
        ios_backgroundColor="rgba(148, 163, 184, 0.35)"
      />
    </View>
  );
}

export function SettingsScreen({ navigation }) {
  const { colors, isDarkMode } = useAppTheme();
  const { signOut, user } = useAuth();
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
          borderColor: colors.cardBorder,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 14,
          paddingHorizontal: 10,
          backgroundColor: colors.card,
        },
        iconWrap: {
          aspectRatio: 1,
          minWidth: 40,
          minHeight: 40,
          borderRadius: 999,
          backgroundColor: colors.iconTintBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        },
        themeIconWrap: {
          aspectRatio: 1,
          minWidth: 40,
          minHeight: 40,
          borderRadius: 999,
          backgroundColor: isDarkMode ? 'rgba(46, 125, 50, 0.065)' : 'rgba(46, 125, 50, 0.11)',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        },
        rowTitle: { color: colors.text, fontWeight: '900' },
        rowSub: { color: colors.muted, marginTop: 4, fontSize: 13, lineHeight: 18 },
        divider: { height: 1, backgroundColor: colors.hairlineStrong },
        footer: {
          width: '100%',
        },
        signOutBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: colors.hairlineOnBg,
        },
        signOutText: { color: colors.danger, fontWeight: '900', fontSize: 15 },
      }),
    [colors, isDarkMode],
  );

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
            <ThemeToggleRow styles={styles} />
            <View style={styles.divider} />
            <RowItem
              title="Permissions"
              subtitle="Microphone, Camera, Notifications"
              icon={<Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />}
              colors={colors}
              styles={styles}
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
              colors={colors}
              styles={styles}
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
              colors={colors}
              styles={styles}
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
