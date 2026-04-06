import 'react-native-gesture-handler';
import React, { useEffect, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStack } from './src/navigation/RootStack';
import { navTheme } from './src/theme/theme';
import { AuthProvider, useAuth } from './src/state/auth';
import { OnboardingProvider, useOnboarding } from './src/state/onboarding';
import { PermissionsProvider, usePermissions } from './src/state/permissions';
import { SubscriptionProvider, useSubscription } from './src/state/subscription';
import { AlertsProvider } from './src/state/alerts';
import { PairingProvider } from './src/state/pairing';

function AppGate() {
  const { user, booting: authBooting } = useAuth();
  const { onboardingDone, booting: onboardingBooting } = useOnboarding();
  const { allCoreGranted, booting: permBooting } = usePermissions();
  const { accessGranted, subscription, booting: subsBooting } = useSubscription();

  const flow = useMemo(() => {
    if (!onboardingDone) return { initial: 'Onboarding', key: 'onboarding' };
    if (!user) return { initial: 'Login', key: 'auth' };
    if (!allCoreGranted) return { initial: 'Permissions', key: 'permissions' };
    if (!accessGranted && !subscription?.skipForNow) return { initial: 'Subscription', key: 'subscription' };
    return { initial: 'MainTabs', key: 'main' };
  }, [accessGranted, allCoreGranted, onboardingDone, subscription?.skipForNow, user]);

  if (authBooting || onboardingBooting || permBooting || subsBooting) {
    return null;
  }

  return (
    <NavigationContainer theme={navTheme} key={flow.key}>
      <RootStack initialRouteName={flow.initial} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: navTheme.colors.background }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AuthProvider>
          <OnboardingProvider>
            <PermissionsProvider>
              <SubscriptionProvider>
                <AlertsProvider>
                  <PairingProvider>
                    <AppGate />
                  </PairingProvider>
                </AlertsProvider>
              </SubscriptionProvider>
            </PermissionsProvider>
          </OnboardingProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
