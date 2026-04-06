import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { AlertsScreen } from '../screens/AlertsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: 'rgba(255,255,255,0.08)',
          borderTopWidth: 1,
          height: 74,
          paddingBottom: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const name = (() => {
            switch (route.name) {
              case 'Home':
                return focused ? 'home' : 'home-outline';
              case 'Alert':
                return focused ? 'notifications' : 'notifications-outline';
              case 'Setting':
                return focused ? 'settings' : 'settings-outline';
              case 'Profile':
                return focused ? 'person' : 'person-outline';
              default:
                return 'ellipse';
            }
          })();
          return <Ionicons name={name} size={size} color={focused ? colors.primary : color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.45)',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '800' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Alert" component={AlertsScreen} options={{ tabBarLabel: 'Alert' }} />
      <Tab.Screen name="Setting" component={SettingsScreen} options={{ tabBarLabel: 'Setting' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

