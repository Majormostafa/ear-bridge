import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Baby, Bell, Copy, Flame, Trash2 } from 'lucide-react-native';
import { useAlerts } from '../state/alerts';
import { SCREEN_HORIZONTAL_PADDING } from '../theme/layout';

const HEADER_GREEN = '#4CAF50';
const TEXT_GREEN = '#2E7D32';
const CHIP_ACTIVE_BG = '#121B2B';
const PAGE_BG = '#FFFFFF';
const MUTED_GRAY = '#9CA3AF';
const BORDER_SUBTLE = '#E5E7EB';
const ICON_TINT = '#2E7D32';
const ICON_BOX_BG = 'rgba(76, 175, 80, 0.14)';

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 2,
};

const CATEGORIES = ['All', 'Alarm', 'Baby', 'House Hold'];

function categoryForAlert(alert) {
  const l = (alert.label || '').toLowerCase();
  if (l.includes('baby')) return 'Baby';
  if (l.includes('fire') || l.includes('alarm') || l.includes('ambulance')) return 'Alarm';
  return 'House Hold';
}

function lucideIconForAlert(alert) {
  const l = (alert.label || '').toLowerCase();
  if (l.includes('baby')) return Baby;
  if (l.includes('fire') || l.includes('alarm')) return Flame;
  return Bell;
}

function formatCardDateTime(createdAtMs) {
  const d = new Date(createdAtMs);
  return {
    time: d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
    date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
  };
}

function buildCopyText(alert) {
  const { time, date } = formatCardDateTime(alert.createdAt);
  const conf =
    typeof alert.confidence === 'number' ? `${Math.round(alert.confidence)}% confidence` : '—';
  const loc = alert.location ? ` • ${alert.location}` : '';
  return `${alert.label ?? 'Alert'}${loc} • ${conf} • ${time} ${date}`;
}

export function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { alerts, removeAlert } = useAlerts();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredAlerts = useMemo(() => {
    if (activeCategory === 'All') return alerts;
    return alerts.filter((a) => categoryForAlert(a) === activeCategory);
  }, [alerts, activeCategory]);

  const onBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  }, [navigation]);

  const onCopy = useCallback(async (item) => {
    try {
      await Clipboard.setStringAsync(buildCopyText(item));
      try {
        await Haptics.selectionAsync();
      } catch {
        /* Haptics unavailable (e.g. web) */
      }
    } catch {
      Alert.alert('Copy failed', 'Could not copy to the clipboard.');
    }
  }, []);

  const onDelete = useCallback(
    (item) => {
      Alert.alert('Delete alert', 'Remove this alert from your history?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeAlert(item.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          },
        },
      ]);
    },
    [removeAlert],
  );

  const renderItem = useCallback(
    ({ item }) => {
      const { time, date } = formatCardDateTime(item.createdAt);
      const conf =
        typeof item.confidence === 'number'
          ? `${Math.round(item.confidence)}% Confidence`
          : 'Confidence';
      const Icon = lucideIconForAlert(item);

      return (
        <View
          style={[
            styles.card,
            CARD_SHADOW,
            Platform.OS === 'android' && styles.cardAndroid,
          ]}
        >
          <View style={styles.cardRow}>
            <View style={styles.iconBox}>
              <Icon size={22} color={ICON_TINT} strokeWidth={2} />
            </View>

            <View style={styles.cardBody}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.label ?? 'Alert'}
                </Text>
                <View style={styles.cardTimeCol}>
                  <Text style={styles.cardTime}>{time}</Text>
                  <Text style={styles.cardDate}>{date}</Text>
                </View>
              </View>

              <View style={styles.cardBottomRow}>
                <Text
                  style={[
                    styles.cardConfidence,
                    typeof item.confidence !== 'number' && styles.cardConfidenceMuted,
                  ]}
                >
                  {conf}
                </Text>
                <View style={styles.cardActions}>
                  <Pressable
                    onPress={() => onCopy(item)}
                    style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
                    hitSlop={10}
                  >
                    <Copy size={20} color={MUTED_GRAY} strokeWidth={2} />
                  </Pressable>
                  <Pressable
                    onPress={() => onDelete(item)}
                    style={({ pressed }) => [
                      styles.iconBtn,
                      styles.iconBtnTrailing,
                      pressed && styles.iconBtnPressed,
                    ]}
                    hitSlop={10}
                  >
                    <Trash2 size={20} color={MUTED_GRAY} strokeWidth={2} />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    },
    [onCopy, onDelete],
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const listHeader = useMemo(
    () => (
      <View style={styles.chipsSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {CATEGORIES.map((cat) => {
            const active = cat === activeCategory;
            return (
              <Pressable
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
              >
                <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{cat}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    ),
    [activeCategory],
  );

  const empty = useMemo(() => {
    const filteredOut = alerts.length > 0 && filteredAlerts.length === 0;
    return (
      <View style={styles.emptyWrap}>
        <Bell size={40} color={BORDER_SUBTLE} strokeWidth={1.75} />
        <Text style={styles.emptyTitle}>
          {filteredOut ? 'Nothing in this category' : 'No alerts yet'}
        </Text>
        <Text style={styles.emptySub}>
          {filteredOut
            ? 'Try another filter or view All.'
            : 'Sound detections will appear here.'}
        </Text>
      </View>
    );
  }, [alerts.length, filteredAlerts.length]);

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} style={styles.headerSide} hitSlop={12}>
            <ArrowLeft color="#FFFFFF" size={24} strokeWidth={2} />
          </Pressable>
          <Text style={styles.headerTitle}>Alert</Text>
          <View style={styles.headerSide} />
        </View>
      </View>

      <FlatList
        data={filteredAlerts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={empty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  header: {
    backgroundColor: HEADER_GREEN,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingBottom: 18,
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
  chipsSection: {
    paddingTop: 20,
    paddingBottom: 8,
  },
  chipsScroll: {
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
    paddingRight: SCREEN_HORIZONTAL_PADDING + 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: CHIP_ACTIVE_BG,
  },
  chipInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: CHIP_ACTIVE_BG,
  },
  chipLabelActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 28,
    flexGrow: 1,
  },
  card: {
    marginHorizontal: SCREEN_HORIZONTAL_PADDING,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  cardAndroid: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: ICON_BOX_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_GREEN,
    letterSpacing: -0.2,
  },
  cardTimeCol: {
    alignItems: 'flex-end',
  },
  cardTime: {
    fontSize: 12,
    fontWeight: '500',
    color: MUTED_GRAY,
  },
  cardDate: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '500',
    color: MUTED_GRAY,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  cardConfidence: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_GREEN,
  },
  cardConfidenceMuted: {
    color: MUTED_GRAY,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
  },
  iconBtnTrailing: {
    marginLeft: 4,
  },
  iconBtnPressed: {
    opacity: 0.55,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 72,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 17,
    fontWeight: '700',
    color: '#374151',
  },
  emptySub: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: MUTED_GRAY,
    textAlign: 'center',
    lineHeight: 20,
  },
});
