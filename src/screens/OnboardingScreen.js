import React, { useMemo, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { OutlineButton } from '../components/OutlineButton';
import { colors } from '../theme/colors';
import { useOnboarding } from '../state/onboarding';

const { width } = Dimensions.get('window');

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
  const [index, setIndex] = useState(0);
  const { skipOnboarding } = useOnboarding();

  const slide = slides[index];
  const indicator = useMemo(() => slides.map((s, i) => i === index), [index]);

  return (
    <ScreenContainer>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const nextIndex = Math.round(x / width);
          setIndex(nextIndex);
        }}
        style={{ flex: 1 }}
      >
        {slides.map((s) => (
          <View key={s.key} style={[styles.slide, { width }]}>
            <View style={styles.illustrationPlaceholder}>
              <Text style={styles.illustrationText}>Ear-Bridge</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{s.title}</Text>
              <Text style={styles.subtitle}>{s.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.indicatorRow}>
        {indicator.map((active, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              active
                ? { backgroundColor: colors.primary }
                : { backgroundColor: 'rgba(255,255,255,0.25)' },
            ]}
          />
        ))}
      </View>

      {index === 0 ? (
        <>
          <PrimaryButton title="Next" onPress={() => setIndex(1)} />
          <View style={{ height: 12 }} />
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
          <View style={{ height: 12 }} />
          <OutlineButton
            title="Skip For Now"
            onPress={async () => {
              await skipOnboarding();
              navigation.replace('Login');
            }}
          />
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
  },
  illustrationPlaceholder: {
    marginTop: 18,
    width: '92%',
    height: 320,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationText: {
    color: colors.muted,
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    marginTop: 26,
    width: '92%',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 18,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginHorizontal: 5,
  },
});

