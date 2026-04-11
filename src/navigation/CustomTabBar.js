import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Home, Bell, Settings, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BAR_BG = '#0F172A';
const INACTIVE = '#94A3B8';
const ACTIVE = '#FFFFFF';

const ICON_SIZE = 24;

/** Selected tab: “bubble” rest pose */
const FLOAT_TRANSLATE_Y = -9;
const FLOAT_SCALE = 1.15;

/** Extra lift while finger is down */
const PRESS_TRANSLATE_Y = -12;
const PRESS_SCALE = 1.2;

const springConfig = {
  friction: 4,
  tension: 125,
  useNativeDriver: true,
};

const TAB_ICONS = [Home, Bell, Settings, User];

const DEFAULT_LABELS = ['Home', 'Alert', 'Setting', 'Profile'];

function getMotionTargets(index, activeIndex, pressingIndex) {
  const isPressing = pressingIndex === index;
  const isActive = activeIndex === index;

  if (isPressing) {
    return { translateY: PRESS_TRANSLATE_Y, scale: PRESS_SCALE };
  }
  if (isActive) {
    return { translateY: FLOAT_TRANSLATE_Y, scale: FLOAT_SCALE };
  }
  return { translateY: 0, scale: 1 };
}

function triggerTabHaptic() {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
}

function createMotionValues() {
  return {
    translateY: [0, 1, 2, 3].map(() => new Animated.Value(0)),
    scale: [0, 1, 2, 3].map(() => new Animated.Value(1)),
  };
}

export function CustomTabBar({ state, descriptors, navigation, insets: propInsets }) {
  const safeInsets = useSafeAreaInsets();
  const insets = propInsets ?? { bottom: safeInsets.bottom, top: 0, left: 0, right: 0 };

  const activeIndex = state.index;
  const [pressingIndex, setPressingIndex] = useState(null);

  const motionRef = useRef(null);
  if (!motionRef.current) {
    motionRef.current = createMotionValues();
  }
  const { translateY: translateYVals, scale: scaleVals } = motionRef.current;

  useLayoutEffect(() => {
    for (let i = 0; i < 4; i += 1) {
      const { translateY: ty, scale: sc } = getMotionTargets(i, activeIndex, pressingIndex);
      Animated.parallel([
        Animated.spring(translateYVals[i], {
          ...springConfig,
          toValue: ty,
        }),
        Animated.spring(scaleVals[i], {
          ...springConfig,
          toValue: sc,
        }),
      ]).start();
    }
  }, [activeIndex, pressingIndex, translateYVals, scaleVals]);

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
                onPressIn={() => setPressingIndex(index)}
                onPressOut={() => setPressingIndex(null)}
                style={styles.tabColumn}
              >
                <Animated.View
                  style={[
                    styles.iconContainer,
                    {
                      transform: [
                        { translateY: translateYVals[index] },
                        { scale: scaleVals[index] },
                      ],
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
    backgroundColor: BAR_BG,
  },
  bar: {
    backgroundColor: BAR_BG,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(148, 163, 184, 0.25)',
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
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
    justifyContent: 'flex-end',
    paddingBottom: 4,
    gap: 6,
  },
  iconContainer: {
    width: ICON_SIZE + 12,
    height: ICON_SIZE + 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
