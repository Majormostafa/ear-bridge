import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ambulance, ArrowLeft, Bell, Copy, Flame, Siren, Trash2, Volume2 } from 'lucide-react-native';
import { getAlertDisplayLabel, useAlerts } from '../state/alerts';
import { useAppTheme } from '../state/appTheme';
import { SCREEN_HORIZONTAL_PADDING } from '../theme/layout';

const HEADER_GREEN = '#2E7D32';

const CATEGORIES = ['All', 'Alarm', 'Baby', 'House Hold'];

function categoryForAlert(alert) {
  const l = (alert.label || '').toLowerCase();
  if (l.includes('baby')) return 'Baby';
  if (l.includes('fire') || l.includes('alarm') || l.includes('ambulance')) return 'Alarm';
  return 'House Hold';
}

const ALERT_CARD_ICON_COLOR = '#4ADE80';

function renderAlertCardIcon(alert) {
  const l = (alert.label || '').toLowerCase();
  const color = ALERT_CARD_ICON_COLOR;
  if (l.includes('baby')) {
    return <MaterialCommunityIcons name="baby-carriage" size={24} color={color} />;
  }
  if (l.includes('loud') || l.includes('noise')) {
    return <Volume2 size={24} color={color} strokeWidth={2} />;
  }
  if (l.includes('fire') || l.includes('alarm')) {
    return <Flame size={24} color={color} strokeWidth={2} />;
  }
  if (l.includes('ambulance')) {
    return <Ambulance size={24} color={color} strokeWidth={2} />;
  }
  if (l.includes('emergency')) {
    return <Siren size={24} color={color} strokeWidth={2} />;
  }
  return <Bell size={24} color={color} strokeWidth={2} />;
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
  return `${getAlertDisplayLabel(alert.label)}${loc} • ${conf} • ${time} ${date}`;
}

export function AlertsScreen() {
  const { colors, isDarkMode } = useAppTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();
  const { alerts, removeAlert } = useAlerts();
  const [activeCategory, setActiveCategory] = useState('All');

  const tint = useMemo(
    () => ({
      pageBg: colors.background,
      cardSurface: colors.card,
      title: colors.text,
      ts: colors.muted,
      chipInactiveBg: isDarkMode ? '#1E293B' : '#F1F5F9',
      chipActiveBg: isDarkMode ? '#1E293B' : '#E2E8F0',
      chipActiveBorder: isDarkMode ? '#FFFFFF' : colors.primary,
      chipLabelActive: isDarkMode ? '#FFFFFF' : colors.text,
      iconBox: 'rgba(76, 175, 80, 0.15)',
      iconTint: ALERT_CARD_ICON_COLOR,
      actionIcon: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.52)',
      cardBd: colors.cardBorder,
      confidence: colors.success,
      emptyIcon: isDarkMode ? 'rgba(148, 163, 184, 0.35)' : 'rgba(100, 116, 139, 0.35)',
    }),
    [colors, isDarkMode],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: tint.pageBg,
        },
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
          backgroundColor: tint.chipActiveBg,
          borderWidth: 1,
          borderColor: tint.chipActiveBorder,
        },
        chipInactive: {
          backgroundColor: tint.chipInactiveBg,
          borderWidth: 1,
          borderColor: 'transparent',
        },
        chipLabel: {
          fontSize: 14,
          fontWeight: '600',
          color: tint.ts,
        },
        chipLabelActive: {
          color: tint.chipLabelActive,
        },
        listContent: {
          paddingTop: 12,
          flexGrow: 1,
        },
        card: {
          marginHorizontal: SCREEN_HORIZONTAL_PADDING,
          marginBottom: 20,
          backgroundColor: tint.cardSurface,
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 14,
          borderWidth: 1,
          borderColor: tint.cardBd,
        },
        cardRow: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        iconBox: {
          width: 52,
          height: 52,
          borderRadius: 12,
          backgroundColor: tint.iconBox,
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
          color: tint.title,
          letterSpacing: -0.2,
        },
        cardTimeCol: {
          alignItems: 'flex-end',
        },
        cardTime: {
          fontSize: 12,
          fontWeight: '500',
          color: tint.ts,
        },
        cardDate: {
          marginTop: 2,
          fontSize: 11,
          fontWeight: '500',
          color: tint.ts,
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
          color: tint.confidence,
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
          color: tint.title,
        },
        emptySub: {
          marginTop: 8,
          fontSize: 14,
          fontWeight: '500',
          color: tint.ts,
          textAlign: 'center',
          lineHeight: 20,
        },
      }),
    [tint],
  );

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
      return (
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.iconBox}>{renderAlertCardIcon(item)}</View>

            <View style={styles.cardBody}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {getAlertDisplayLabel(item.label)}
                </Text>
                <View style={styles.cardTimeCol}>
                  <Text style={styles.cardTime}>{time}</Text>
                  <Text style={styles.cardDate}>{date}</Text>
                </View>
              </View>

              <View style={styles.cardBottomRow}>
                <Text style={styles.cardConfidence}>{conf}</Text>
                <View style={styles.cardActions}>
                  <Pressable
                    onPress={() => onCopy(item)}
                    style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
                    hitSlop={10}
                  >
                    <Copy size={20} color={tint.actionIcon} strokeWidth={2} />
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
                    <Trash2 size={20} color={tint.actionIcon} strokeWidth={2} />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    },
    [onCopy, onDelete, styles, tint],
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
    [activeCategory, styles],
  );

  const empty = useMemo(() => {
    const filteredOut = alerts.length > 0 && filteredAlerts.length === 0;
    return (
      <View style={styles.emptyWrap}>
        <Bell size={40} color={tint.emptyIcon} strokeWidth={1.75} />
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
  }, [alerts.length, filteredAlerts.length, styles, tint]);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
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
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(tabBarHeight + 20, 100) },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
