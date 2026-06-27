import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Importation de tous les écrans du projet
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

/**
 * 1. LE NAVIGATEUR PAR ONGLETS (MainTabs)
 * Contient uniquement les 3 hubs principaux de l'application.
 * Masque les en-têtes pour laisser le Stack parent ou les écrans gérer leur UI.
 */
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
        // Couleurs du design system Afro-UX
        tabBarActiveTintColor: '#C84B31',   // Terracotta
        tabBarInactiveTintColor: '#888888', // Gris secondaire
        tabBarStyle: { 
          backgroundColor: '#FAF6F0',       // Fond Ivoire
          paddingBottom: 5, 
          height: 60 
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

/**
 * 2. LE NAVIGATEUR RACINE (Root Stack - AppNavigator)
 * Exporté sous forme nommée pour correspondre parfaitement à ton fichier App.tsx.
 * Il gère la pile globale : de l'authentification aux sous-modules de génération.
 */
export const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: '#FAF6F0' },
        headerTintColor: '#1A1A1A',
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      {/* Écrans d'Authentification (Hors navigation principale) */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ headerShown: false }} 
      />

      {/* Conteneur des Onglets Principaux (Barre à 3 options en bas) */}
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }} 
      />

      {/* Les Écrans de fonctionnalités (S'ouvrent EN PLEIN ÉCRAN par-dessus la barre) */}
      <Stack.Screen 
        name="Context" 
        component={ContextScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Voice" 
        component={VoiceScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Remixer" 
        component={RemixerScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="MemeResult" 
        component={MemeResultScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};