import React, { useMemo } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '../components/PrimaryButton';
import { OutlineButton } from '../components/OutlineButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';
import { useSubscription } from '../state/subscription';

function FeatureRow({ title, description }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.checkCircle}>
        <Ionicons name="checkmark" size={18} color="#ffffff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{description}</Text>
      </View>
    </View>
  );
}

export function SubscriptionScreen({ navigation }) {
  const { subscription, trialActive, accessGranted, startTrial, unlockFullAccess, markSkipped } = useSubscription();

  const statusText = useMemo(() => {
    if (trialActive) return 'Trial Active';
    if (subscription.unlocked) return 'Full Access';
    if (subscription.skipForNow) return 'Limited Access';
    return 'Not Subscribed';
  }, [trialActive, subscription.unlocked, subscription.skipForNow]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Unlock Full Safety</Text>
      <Text style={styles.subtitle}>
        Get Real-Time Alerts For Dangerous Around You. Try 7 Days Free, Then $4.99/Month
      </Text>

      <View style={{ height: 16 }} />

      <SectionCard>
        <View style={styles.timelineRow}>
          <View style={styles.timelineCol}>
            <View style={styles.timelineMarkerTop} />
            <View style={styles.timelineLine} />
            <View style={styles.timelineMarkerMid} />
            <View style={styles.timelineLine} />
            <View style={styles.timelineMarkerBottom} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.timelineLabel}>Today: Full Access</Text>
            <Text style={styles.timelineValue}>Start detecting important sounds instantly.</Text>
            <View style={{ height: 12 }} />
            <Text style={styles.timelineLabel}>Day 5: Reminder</Text>
            <Text style={styles.timelineValue}>We'll remind you before your free trial ends.</Text>
            <View style={{ height: 12 }} />
            <Text style={styles.timelineLabel}>Day 7: Trial Ends</Text>
            <Text style={styles.timelineValue}>Your subscription starts automatically.</Text>
          </View>
        </View>
      </SectionCard>

      <View style={{ height: 16 }} />

      <Text style={styles.statusPill}>Status: {statusText}</Text>

      <View style={{ height: 14 }} />

      <FeatureRow title="Emergency Sound Detection" description="Instant alerts for sirens, alarms, car horns, and other critical sound sources." />
      <FeatureRow title="Visual & Vibration Alerts" description="Strong vibrations and flashing screen to make sure you notice." />
      <FeatureRow title="Stay Connected" description="Automatically notifies a trusted contact in case of emergency." />

      <View style={{ height: 16 }} />

      <Text style={styles.terms}>
        No commitment. Cancel anytime from settings.
        {'\n'}
        <Text style={{ color: colors.primary, fontWeight: '800' }}>Terms & Privacy</Text>
      </Text>

      <View style={{ flex: 1 }} />

      <PrimaryButton
        title={trialActive || accessGranted ? 'Full Access Enabled' : 'Start Free Trial'}
        disabled={accessGranted && !trialActive}
        onPress={async () => {
          await startTrial();
          // Front-end only: directly unlock the demo.
          navigation.replace('MainTabs');
        }}
      />

      <View style={{ height: 12 }} />

      <OutlineButton
        title="Skip for now"
        onPress={async () => {
          await markSkipped();
          navigation.replace('MainTabs');
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '900', color: colors.text, textAlign: 'center', marginTop: 6 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 10 },
  timelineRow: { flexDirection: 'row' },
  timelineCol: { width: 24, alignItems: 'center' },
  timelineMarkerTop: { width: 14, height: 14, borderRadius: 999, backgroundColor: colors.primary },
  timelineMarkerMid: { width: 12, height: 12, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.25)' },
  timelineMarkerBottom: { width: 10, height: 10, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.18)' },
  timelineLine: { width: 2, flex: 1, height: 22, backgroundColor: 'rgba(255,255,255,0.18)', marginVertical: 2 },
  timelineLabel: { color: colors.text, fontSize: 16, fontWeight: '900' },
  timelineValue: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 6 },
  statusPill: { alignSelf: 'center', color: colors.muted, fontSize: 14, fontWeight: '800', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12 },
  checkCircle: { width: 28, height: 28, borderRadius: 999, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 2, marginRight: 12 },
  featureTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  featureDesc: { color: colors.muted, fontSize: 13, marginTop: 6, lineHeight: 18 },
  terms: { color: colors.muted, fontSize: 13, lineHeight: 18, textAlign: 'center' },
});

