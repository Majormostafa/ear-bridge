import React, { useMemo } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '../components/PrimaryButton';
import { OutlineButton } from '../components/OutlineButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionCard } from '../components/SectionCard';
import { useAppTheme } from '../state/appTheme';
import { useSubscription } from '../state/subscription';

function FeatureRow({ title, description, styles }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.checkCircle}>
        <Ionicons name="checkmark" size={18} color="#ffffff" />
      </View>
      <View style={styles.flex1}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{description}</Text>
      </View>
    </View>
  );
}

export function SubscriptionScreen({ navigation }) {
  const { colors, isDarkMode } = useAppTheme();
  const { subscription, trialActive, accessGranted, startTrial, markSkipped } = useSubscription();

  const statusText = useMemo(() => {
    if (trialActive) return 'Trial Active';
    if (subscription.unlocked) return 'Full Access';
    if (subscription.skipForNow) return 'Limited Access';
    return 'Not Subscribed';
  }, [trialActive, subscription.unlocked, subscription.skipForNow]);

  const styles = useMemo(() => {
    const line = isDarkMode ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.12)';
    const markerMid = isDarkMode ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.2)';
    const markerBottom = isDarkMode ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.15)';

    return StyleSheet.create({
      layout: {
        flex: 1,
        justifyContent: 'space-between',
      },
      main: {
        flex: 1,
        minHeight: 0,
      },
      flex1: { flex: 1 },
      spacer: { height: 16 },
      spacerSm: { height: 12 },
      spacerMd: { height: 14 },
      gap: { height: 12 },
      title: { fontSize: 30, fontWeight: '900', color: colors.text, textAlign: 'center', marginTop: 6 },
      subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 10 },
      timelineRow: { flexDirection: 'row' },
      timelineCol: { width: '6%', maxWidth: 28, minWidth: 18, alignItems: 'center' },
      timelineMarkerTop: {
        aspectRatio: 1,
        width: 14,
        borderRadius: 999,
        backgroundColor: colors.primary,
      },
      timelineMarkerMid: {
        aspectRatio: 1,
        width: 12,
        borderRadius: 999,
        backgroundColor: markerMid,
      },
      timelineMarkerBottom: {
        aspectRatio: 1,
        width: 10,
        borderRadius: 999,
        backgroundColor: markerBottom,
      },
      timelineLine: { width: 2, flex: 1, minHeight: 22, backgroundColor: line, marginVertical: 2 },
      timelineLabel: { color: colors.text, fontSize: 16, fontWeight: '900' },
      timelineValue: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 6 },
      statusPill: {
        alignSelf: 'center',
        color: colors.muted,
        fontSize: 14,
        fontWeight: '800',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: colors.cardBorder,
      },
      featureRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12 },
      checkCircle: {
        aspectRatio: 1,
        minWidth: 28,
        minHeight: 28,
        borderRadius: 999,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
        marginRight: 12,
      },
      featureTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
      featureDesc: { color: colors.muted, fontSize: 13, marginTop: 6, lineHeight: 18 },
      terms: { color: colors.muted, fontSize: 13, lineHeight: 18, textAlign: 'center' },
      footer: {
        width: '100%',
        paddingBottom: 4,
      },
    });
  }, [colors, isDarkMode]);

  return (
    <ScreenWrapper>
      <View style={styles.layout}>
        <View style={styles.main}>
          <Text style={styles.title}>Unlock Full Safety</Text>
          <Text style={styles.subtitle}>
            Get Real-Time Alerts For Dangerous Around You. Try 7 Days Free, Then $4.99/Month
          </Text>

          <View style={styles.spacer} />

          <SectionCard>
            <View style={styles.timelineRow}>
              <View style={styles.timelineCol}>
                <View style={styles.timelineMarkerTop} />
                <View style={styles.timelineLine} />
                <View style={styles.timelineMarkerMid} />
                <View style={styles.timelineLine} />
                <View style={styles.timelineMarkerBottom} />
              </View>
              <View style={styles.flex1}>
                <Text style={styles.timelineLabel}>Today: Full Access</Text>
                <Text style={styles.timelineValue}>Start detecting important sounds instantly.</Text>
                <View style={styles.spacerSm} />
                <Text style={styles.timelineLabel}>Day 5: Reminder</Text>
                <Text style={styles.timelineValue}>We'll remind you before your free trial ends.</Text>
                <View style={styles.spacerSm} />
                <Text style={styles.timelineLabel}>Day 7: Trial Ends</Text>
                <Text style={styles.timelineValue}>Your subscription starts automatically.</Text>
              </View>
            </View>
          </SectionCard>

          <View style={styles.spacer} />

          <Text style={styles.statusPill}>Status: {statusText}</Text>

          <View style={styles.spacerMd} />

          <FeatureRow
            styles={styles}
            title="Emergency Sound Detection"
            description="Instant alerts for sirens, alarms, car horns, and other critical sound sources."
          />
          <FeatureRow
            styles={styles}
            title="Visual & Vibration Alerts"
            description="Strong vibrations and flashing screen to make sure you notice."
          />
          <FeatureRow
            styles={styles}
            title="Stay Connected"
            description="Automatically notifies a trusted contact in case of emergency."
          />

          <View style={styles.spacer} />

          <Text style={styles.terms}>
            No commitment. Cancel anytime from settings.
            {'\n'}
            <Text style={{ color: colors.primary, fontWeight: '800' }}>Terms & Privacy</Text>
          </Text>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title={trialActive || accessGranted ? 'Full Access Enabled' : 'Start Free Trial'}
            disabled={accessGranted && !trialActive}
            onPress={async () => {
              await startTrial();
              navigation.replace('MainTabs');
            }}
          />

          <View style={styles.gap} />

          <OutlineButton
            title="Skip for now"
            onPress={async () => {
              await markSkipped();
              navigation.replace('MainTabs');
            }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
