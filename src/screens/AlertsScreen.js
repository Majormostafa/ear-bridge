import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../theme/colors';
import { useAlerts, formatRelativeTime } from '../state/alerts';

function iconForAlert(alert) {
  const label = (alert?.label ?? '').toLowerCase();
  if (label.includes('baby')) return 'happy-outline';
  if (label.includes('door')) return 'home-outline';
  if (label.includes('fire')) return 'flame-outline';
  if (label.includes('loud')) return 'volume-high-outline';
  if (label.includes('ambulance')) return 'medical-outline';
  return 'notifications-outline';
}

export function AlertsScreen() {
  const { alerts, clearAlerts } = useAlerts();

  return (
    <ScreenWrapper>
      <View style={styles.layout}>
        <View style={styles.main}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Recent Incoming Alert</Text>
            <Pressable
              onPress={() =>
                Alert.alert('Clear history', 'Are you sure you want to clear alerts? This is local-only.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear', style: 'destructive', onPress: () => clearAlerts() },
                ])
              }
            >
              <Text style={styles.clear}>Clear History</Text>
            </Pressable>
          </View>

          <View style={styles.spacer} />

          {alerts.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="notifications-off-outline" size={22} color={colors.muted} />
              <Text style={styles.emptyText}>No alerts yet. Start listening.</Text>
            </View>
          ) : (
            <View style={styles.listTop}>
              {alerts.slice(0, 10).map((a) => (
                <View key={a.id} style={styles.item}>
                  <View style={styles.leftIcon}>
                    <Ionicons name={iconForAlert(a)} size={18} color={colors.primary} />
                  </View>
                  <View style={styles.flex1}>
                    <Text style={styles.itemTitle}>{a.label}</Text>
                    <Text style={styles.itemSub}>
                      {a.location ? a.location + ' • ' : ''}
                      {formatRelativeTime(Date.now(), a.createdAt)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.needHelp}>
            <Ionicons name="help-circle-outline" size={18} color={colors.muted} />
            <Text style={styles.needHelpText}>Need help?</Text>
          </View>
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
  title: { color: colors.text, fontSize: 18, fontWeight: '900', flex: 1, paddingRight: 8 },
  clear: { color: colors.primary, fontSize: 14, fontWeight: '900', marginTop: 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8 },
  spacer: { height: 12 },
  listTop: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  leftIcon: {
    aspectRatio: 1,
    minWidth: 34,
    minHeight: 34,
    borderRadius: 999,
    backgroundColor: 'rgba(11,107,31,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemTitle: { color: colors.text, fontWeight: '900' },
  itemSub: { color: colors.muted, marginTop: 4, fontSize: 13 },
  empty: { alignItems: 'center', marginTop: 38, padding: 16 },
  emptyText: { color: colors.muted, marginTop: 10, textAlign: 'center', fontWeight: '600' },
  footer: {
    width: '100%',
  },
  needHelp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  needHelpText: { color: colors.muted, marginLeft: 10, fontWeight: '800' },
});
