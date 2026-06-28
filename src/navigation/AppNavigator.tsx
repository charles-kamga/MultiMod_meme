import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ContextScreen from '../screens/ContextScreen';
import VoiceScreen from '../screens/VoiceScreen';
import RemixerScreen from '../screens/RemixerScreen';
import MemeResultScreen from '../screens/MemeResultScreen';
import GalleryScreen from '../screens/GalleryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'help-circle-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Gallery') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#C84B31',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#FAF6F0',
          paddingBottom: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#FAF6F0',
        },
        headerTintColor: '#1A1A1A',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
      <Tab.Screen name="Gallery" component={GalleryScreen} options={{ title: 'Galerie' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil', headerShown: false }} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF6F0' }}>
        <ActivityIndicator size="large" color="#C84B31" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FAF6F0' },
        headerTintColor: '#1A1A1A',
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      {user === null ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Context" component={ContextScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Voice" component={VoiceScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Remixer" component={RemixerScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MemeResult" component={MemeResultScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};
