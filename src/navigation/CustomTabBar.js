import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Home, Bell, Settings, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../state/appTheme';

const ICON_SIZE = 24;

const ACTIVE_SCALE = 1.1;
const INACTIVE_SCALE = 1;
const INACTIVE_ICON_OPACITY = 0.5;

const springConfig = {
  stiffness: 150,
  damping: 20,
  useNativeDriver: true,
};

const TAB_ICONS = [Home, Bell, Settings, User];

const DEFAULT_LABELS = ['Home', 'Alert', 'Setting', 'Profile'];

function getMotionTargets(index, activeIndex) {
  const isActive = activeIndex === index;
  if (isActive) {
    return { scale: ACTIVE_SCALE, opacity: 1 };
  }
  return { scale: INACTIVE_SCALE, opacity: INACTIVE_ICON_OPACITY };
}

function triggerTabHaptic() {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
}

function createMotionValues(activeIndex) {
  return {
    scale: [0, 1, 2, 3].map((i) => new Animated.Value(i === activeIndex ? ACTIVE_SCALE : INACTIVE_SCALE)),
    opacity: [0, 1, 2, 3].map((i) => new Animated.Value(i === activeIndex ? 1 : INACTIVE_ICON_OPACITY)),
  };
}

export function CustomTabBar({ state, descriptors, navigation, insets: propInsets }) {
  const { isDarkMode } = useAppTheme();
  const { INACTIVE, ACTIVE } = useMemo(
    () =>
      isDarkMode
        ? { INACTIVE: '#94A3B8', ACTIVE: '#FFFFFF' }
        : { INACTIVE: '#64748B', ACTIVE: '#0F172A' },
    [isDarkMode],
  );

  const safeInsets = useSafeAreaInsets();
  const insets = propInsets ?? { bottom: safeInsets.bottom, top: 0, left: 0, right: 0 };

  const activeIndex = state.index;

  const motionRef = useRef(null);
  if (!motionRef.current) {
    motionRef.current = createMotionValues(activeIndex);
  }
  const { scale: scaleVals, opacity: opacityVals } = motionRef.current;

  useLayoutEffect(() => {
    for (let i = 0; i < 4; i += 1) {
      const { scale: sc, opacity: op } = getMotionTargets(i, activeIndex);
      Animated.parallel([
        Animated.spring(scaleVals[i], {
          ...springConfig,
          toValue: sc,
        }),
        Animated.spring(opacityVals[i], {
          ...springConfig,
          toValue: op,
        }),
      ]).start();
    }
  }, [activeIndex, scaleVals, opacityVals]);

  const emitNavigate = useCallback(
    (index) => {
      const route = state.routes[index];
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (activeIndex !== index && !event.defaultPrevented) {
        triggerTabHaptic();
        navigation.navigate(route.name);
      }
    },
    [activeIndex, navigation, state.routes]
  );

  const emitLongPress = useCallback(
    (index) => {
      const route = state.routes[index];
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    },
    [navigation, state.routes]
  );

  return (
    <View style={[styles.outer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.bar}>
        <View style={styles.row}>
          <View style={styles.spacer} />

          {TAB_ICONS.map((Icon, index) => {
            const route = state.routes[index];
            const opts = descriptors[route.key].options;
            const label = opts.tabBarLabel ?? DEFAULT_LABELS[index];
            const focused = activeIndex === index;

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={opts.tabBarAccessibilityLabel}
                testID={opts.tabBarTestID}
                onPress={() => emitNavigate(index)}
                onLongPress={() => emitLongPress(index)}
                style={styles.tabColumn}
              >
                <Animated.View
                  style={[
                    styles.iconContainer,
                    {
                      opacity: opacityVals[index],
                      transform: [{ scale: scaleVals[index] }],
                    },
                  ]}
                >
                  <Icon
                    size={ICON_SIZE}
                    color={focused ? ACTIVE : INACTIVE}
                    strokeWidth={focused ? 2.25 : 2}
                  />
                </Animated.View>
                <Text style={[styles.label, { color: focused ? ACTIVE : INACTIVE }]} numberOfLines={1}>
                  {label}
                </Text>
              </Pressable>
            );
          })}

          <View style={styles.spacer} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: 'transparent',
  },
  bar: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 0,
    paddingTop: 12,
    elevation: 0,
    shadowOpacity: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    minHeight: 52,
  },
  spacer: {
    width: 8,
  },
  tabColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
    gap: 6,
  },
  iconContainer: {
    width: ICON_SIZE + 16,
    height: Math.ceil(ICON_SIZE * 1.1) + 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
