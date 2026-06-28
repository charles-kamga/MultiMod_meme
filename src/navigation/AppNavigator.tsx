import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, MainTabParamList } from './types';
import { COLORS, RADII, ELEVATION, FONTS } from '../theme/colors';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ContextScreen from '../screens/ContextScreen';
import VoiceScreen from '../screens/VoiceScreen';
import RemixerScreen from '../screens/RemixerScreen';
import MemeResultScreen from '../screens/MemeResultScreen';
import GalleryScreen from '../screens/GalleryScreen';
import ProfileScreen from '../screens/ProfileScreen';

interface TabIconProps {
  icon: string;
  label: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, label, focused }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconContainerActive]}>
    <Text style={[styles.tabIconText, focused && styles.tabIconTextActive]}>{icon}</Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
  </View>
);

const Tab = createBottomTabNavigator<MainTabParamList>();

const homeTabIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon icon="H" label="Accueil" focused={focused} />
);

const galleryTabIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon icon="G" label="Galerie" focused={focused} />
);

const profileTabIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon icon="P" label="Profil" focused={focused} />
);

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
        tabBarIcon: homeTabIcon,
      }}
    />
    <Tab.Screen
      name="Gallery"
      component={GalleryScreen}
      options={{
        tabBarIcon: galleryTabIcon,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: profileTabIcon,
      }}
    />
  </Tab.Navigator>
);

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
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ animation: 'fade' }} />
    <Stack.Screen name="Context" component={ContextScreen} />
    <Stack.Screen name="Voice" component={VoiceScreen} />
    <Stack.Screen name="Remixer" component={RemixerScreen} />
    <Stack.Screen name="MemeResult" component={MemeResultScreen} />
    <Stack.Screen name="Gallery" component={GalleryScreen} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADII.lg,
    borderTopRightRadius: RADII.lg,
    height: 76,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 0,
    ...ELEVATION.level2,
  },
  tabIconContainer: {
    minWidth: 78,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: RADII.full,
  },
  tabIconContainerActive: {
    backgroundColor: COLORS.primaryContainer,
  },
  tabIconText: {
    ...FONTS.labelLg,
    color: COLORS.textSecondary,
  },
  tabIconTextActive: {
    color: COLORS.primaryDark,
  },
  tabLabel: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  tabLabelActive: {
    color: COLORS.primaryDark,
  },
});
