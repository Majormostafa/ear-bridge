import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { PrimaryButton } from '../components/PrimaryButton';
import { OutlineButton } from '../components/OutlineButton';
import { useAppTheme } from '../state/appTheme';
import { SCREEN_HORIZONTAL_PADDING } from '../theme/layout';
import { useOnboarding } from '../state/onboarding';

const slides = [
  {
    key: 'critical',
    title: 'Detect Critical Sounds',
    subtitle: 'Stay Aware Of Important Sounds Around You With Real-Time Detection',
  },
  {
    key: 'connected',
    title: 'Stay Connected & Supported',
    subtitle: 'Instant Alerts Keep Your Trusted Contact Ready To Help When Needed',
  },
];

export function OnboardingScreen({ navigation }) {
  const { colors, isDarkMode } = useAppTheme();
  const listRef = useRef(null);
  useWindowDimensions();
  const pageWidth = Dimensions.get('window').width;
  const [index, setIndex] = useState(0);
  const { skipOnboarding } = useOnboarding();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        layout: {
          flex: 1,
          justifyContent: 'space-between',
        },
        pagerHost: {
          flex: 1,
          minHeight: 0,
          width: '100%',
        },
        flatList: {
          flex: 1,
        },
        pagerTopSafe: {
          flex: 1,
          width: '100%',
        },
        slide: {
          flex: 1,
        },
        slideInner: {
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        illustrationPlaceholder: {
          width: '100%',
          maxWidth: '100%',
          aspectRatio: 4 / 5,
          borderRadius: 20,
          backgroundColor: colors.softSurface,
          alignItems: 'center',
          justifyContent: 'center',
        },
        illustrationText: {
          color: colors.muted,
          fontSize: 18,
          fontWeight: '600',
        },
        content: {
          width: '100%',
          maxWidth: '100%',
          paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
          marginTop: 26,
          alignItems: 'center',
        },
        title: {
          color: colors.text,
          fontSize: 28,
          fontWeight: '800',
          marginBottom: 10,
          textAlign: 'center',
        },
        subtitle: {
          color: colors.muted,
          fontSize: 16,
          lineHeight: 22,
          textAlign: 'center',
        },
        indicatorWrap: {
          width: '100%',
        },
        indicatorRow: {
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 10,
          marginBottom: 8,
        },
        dot: {
          width: 12,
          height: 12,
          borderRadius: 999,
          marginHorizontal: 5,
        },
        footerSafe: {
          width: '100%',
          paddingBottom: 4,
        },
        gap: {
          height: 12,
        },
      }),
    [colors],
  );

  const dotInactive = isDarkMode ? 'rgba(255,255,255,0.25)' : 'rgba(100,116,139,0.35)';

  const indicator = useMemo(() => slides.map((s, i) => i === index), [index]);

  const getItemLayout = useCallback(
    (_, i) => ({
      length: pageWidth,
      offset: pageWidth * i,
      index: i,
    }),
    [pageWidth]
  );

  const scrollToPage = useCallback((targetIndex, animated) => {
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    listRef.current?.scrollToIndex({ index: targetIndex, animated });
  }, []);

  const onScrollToIndexFailed = useCallback(
    (info) => {
      const offset = info.index * pageWidth;
      setTimeout(() => {
        listRef.current?.scrollToOffset({ offset, animated: true });
      }, 50);
    },
    [pageWidth]
  );

  const onMomentumScrollEnd = useCallback(
    (e) => {
      const x = e.nativeEvent.contentOffset.x;
      const nextIndex = Math.round(x / pageWidth);
      const clamped = Math.max(0, Math.min(slides.length - 1, nextIndex));
      setIndex(clamped);
    },
    [pageWidth]
  );

  const goNext = useCallback(() => {
    const next = Math.min(index + 1, slides.length - 1);
    if (next === index) return;
    scrollToPage(next, true);
    setIndex(next);
  }, [index, scrollToPage]);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={[styles.slide, { width: pageWidth }]}>
        <View style={styles.slideInner}>
          <View style={styles.illustrationPlaceholder}>
            <Text style={styles.illustrationText}>Ear-Bridge</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        </View>
      </View>
    ),
    [pageWidth, styles]
  );

  return (
    <ScreenWrapper horizontalPadding={0} edges={[]}>
      <View style={styles.layout}>
        <View style={styles.pagerHost}>
          <SafeAreaView edges={['top']} style={styles.pagerTopSafe}>
            <FlatList
              key={pageWidth}
              ref={listRef}
              data={slides}
              keyExtractor={(item) => item.key}
              renderItem={renderItem}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              decelerationRate="fast"
              bounces={false}
              getItemLayout={getItemLayout}
              onMomentumScrollEnd={onMomentumScrollEnd}
              onScrollToIndexFailed={onScrollToIndexFailed}
              style={styles.flatList}
            />
          </SafeAreaView>
        </View>

        <View style={[styles.indicatorWrap, { paddingHorizontal: SCREEN_HORIZONTAL_PADDING }]}>
          <View style={styles.indicatorRow}>
            {indicator.map((active, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  active ? { backgroundColor: colors.primary } : { backgroundColor: dotInactive },
                ]}
              />
            ))}
          </View>
        </View>

        <SafeAreaView edges={['bottom']} style={[styles.footerSafe, { paddingHorizontal: SCREEN_HORIZONTAL_PADDING }]}>
          {index === 0 ? (
            <>
              <PrimaryButton title="Next" onPress={goNext} />
              <View style={styles.gap} />
              <OutlineButton
                title="Skip"
                onPress={async () => {
                  await skipOnboarding();
                  navigation.replace('Login');
                }}
              />
            </>
          ) : (
            <>
              <PrimaryButton
                title="Access Account"
                onPress={async () => {
                  await skipOnboarding();
                  navigation.replace('Login');
                }}
              />
              <View style={styles.gap} />
              <OutlineButton
                title="Skip For Now"
                onPress={async () => {
                  await skipOnboarding();
                  navigation.replace('Login');
                }}
              />
            </>
          )}
        </SafeAreaView>
      </View>
    </ScreenWrapper>
  );
}
