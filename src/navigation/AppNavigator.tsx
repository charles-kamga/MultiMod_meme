/**
 * NAVIGATION — AppNavigator
 * Combine un StackNavigator (flux Login → génération → résultat)
 * avec un BottomTabNavigator (navigation principale : Accueil, Galerie, Profil).
 *
 * Architecture :
 *   RootStack
 *   ├── Login (AuthScreen — hors tabs)
 *   ├── MainTabs (BottomTab)
 *   │   ├── Home (Dashboard)
 *   │   ├── Gallery (La Galerie du Kwatt)
 *   │   └── Profile (Mon Profil)
 *   ├── Context (Analyseur de Ndoki — modal / stack)
 *   ├── Voice (La Voix du Kwatt — modal / stack)
 *   ├── Remixer (Remix de Statut — modal / stack)
 *   └── MemeResult (La Consécration — stack)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, MainTabParamList } from './types';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';

// Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ContextScreen from '../screens/ContextScreen';
import VoiceScreen from '../screens/VoiceScreen';
import RemixerScreen from '../screens/RemixerScreen';
import MemeResultScreen from '../screens/MemeResultScreen';
import GalleryScreen from '../screens/GalleryScreen';
import ProfileScreen from '../screens/ProfileScreen';
/* ─────────────────────────────────────────────────
 * TAB ICON (Texte-Emoji basé, pas de dépendance externe)
 * ───────────────────────────────────────────────── */

interface TabIconProps {
  icon: string;
  label: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, label, focused }) => (
  <View
    style={[
      styles.tabIconContainer,
      focused && styles.tabIconContainerActive,
    ]}
  >
    <Text style={[styles.tabIconEmoji, focused && styles.tabIconEmojiActive]}>
      {icon}
    </Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
      {label}
    </Text>
  </View>
);

/* ─────────────────────────────────────────────────
 * BOTTOM TAB NAVIGATOR
 * ───────────────────────────────────────────────── */

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: styles.tabBar,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="🏠" label="Accueil" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Gallery"
      component={GalleryScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="🖼️" label="Galerie" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="👤" label="Profil" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

/* ─────────────────────────────────────────────────
 * ROOT STACK NAVIGATOR
 * ───────────────────────────────────────────────── */

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: COLORS.background },
      animation: 'slide_from_right',
    }}
  >
    {/* Auth */}
    <Stack.Screen name="Login" component={LoginScreen} />

    {/* Tabs principal */}
    <Stack.Screen
      name="MainTabs"
      component={MainTabNavigator}
      options={{ animation: 'fade' }}
    />

    {/* Flux de génération */}
    <Stack.Screen name="Context" component={ContextScreen} />
    <Stack.Screen name="Voice" component={VoiceScreen} />
    <Stack.Screen name="Remixer" component={RemixerScreen} />
    <Stack.Screen name="MemeResult" component={MemeResultScreen} />
    <Stack.Screen name="Gallery" component={GalleryScreen} />
  </Stack.Navigator>
);

/* ─────────────────────────────────────────────────
 * STYLES
 * ───────────────────────────────────────────────── */

const styles = StyleSheet.create({
  // Tab Bar
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADII.lg,
    borderTopRightRadius: RADII.lg,
    height: 72,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 0,
    ...ELEVATION.level2,
  },

  // Tab Icon
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.base + 2,
    borderRadius: RADII.full,
  },
  tabIconContainerActive: {
    backgroundColor: COLORS.primaryContainer,
  },
  tabIconEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabIconEmojiActive: {
    fontSize: 22,
  },
  tabLabel: {
    ...FONTS.labelSm,
    color: COLORS.onSurfaceVariant,
    marginTop: 1,
  },
  tabLabelActive: {
    color: COLORS.onPrimaryContainer,
    fontWeight: '700',
  },
});
