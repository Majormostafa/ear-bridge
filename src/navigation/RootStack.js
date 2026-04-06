import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { PermissionsScreen } from '../screens/PermissionsScreen';
import { SubscriptionScreen } from '../screens/SubscriptionScreen';
import { EmergencyScreen } from '../screens/EmergencyScreen';
import { DevicePairingScreen } from '../screens/DevicePairingScreen';

const Stack = createNativeStackNavigator();

export function RootStack({ initialRouteName }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
      <Stack.Screen name="DevicePairing" component={DevicePairingScreen} />
    </Stack.Navigator>
  );
}

