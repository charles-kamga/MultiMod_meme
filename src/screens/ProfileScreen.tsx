/**
 * ÉCRAN : ProfileScreen — Profil utilisateur
 * Affiche les informations du compte (nom, email, avatar avec initiales),
 * le nombre de mèmes générés (issu d'AsyncStorage) et les options
 * de paramètres, langue et déconnexion.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, RADII, FONTS, ELEVATION } from '../theme/colors';

const getStorageKey = () => {
  const uid = auth().currentUser?.uid;
  return uid ? `memes_${uid}` : 'memes_guest';
};

export default function ProfileScreen({ navigation }: any) {
  const [memeCount, setMemeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const user = auth().currentUser;
  const userEmail = user?.email || 'Utilisateur';
  const userName = user?.displayName || userEmail.split('@')[0];

  const getInitials = () => {
    if (user?.displayName) {
      const names = user.displayName.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0].substring(0, 2).toUpperCase();
    }
    return userEmail.substring(0, 2).toUpperCase();
  };

  useFocusEffect(
    useCallback(() => {
      const fetchRealMemeCount = async () => {
        try {
          const savedMemesRaw = await AsyncStorage.getItem(getStorageKey());
          if (savedMemesRaw) {
            const savedMemesArray = JSON.parse(savedMemesRaw);
            setMemeCount(savedMemesArray.length);
          } else {
            setMemeCount(0);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des mèmes :", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRealMemeCount();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Mon Profil</Text>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.initialsAvatar}>
          <Text style={styles.initialsText}>{getInitials()}</Text>
        </View>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userSubtitle}>{userEmail}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Text style={styles.statNumber}>{memeCount}</Text>
          )}
          <Text style={styles.statLabel}>Mèmes générés</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="settings-outline" size={22} color={COLORS.onSurfaceVariant} />
            <Text style={styles.menuItemText}>Mes paramètres</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.onSurfaceVariant} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="earth-outline" size={22} color={COLORS.onSurfaceVariant} />
            <Text style={styles.menuItemText}>Préférences de langue</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.onSurfaceVariant} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.noBorder]}
          onPress={handleLogout}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.primary} />
            <Text style={[styles.menuItemText, styles.logoutText]}>Déconnexion</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  headerContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.marginHorizontal,
    paddingBottom: SPACING.xs,
  },
  headerTitle: {
    ...FONTS.headlineLgMobile,
    color: COLORS.primary,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: SPACING.marginHorizontal,
    marginBottom: 25,
  },
  initialsAvatar: {
    width: 110,
    height: 110,
    borderRadius: RADII.full,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...ELEVATION.level2,
    marginBottom: 15,
  },
  initialsText: {
    ...FONTS.displayLg,
    color: COLORS.white,
    letterSpacing: 1,
  },
  userName: {
    ...FONTS.headlineMd,
    color: COLORS.textMain,
    marginBottom: SPACING.base,
  },
  userSubtitle: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    marginHorizontal: SPACING.md,
    paddingVertical: SPACING.marginHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
    ...ELEVATION.level1,
    marginBottom: 25,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    ...FONTS.headlineLg,
    color: COLORS.textMain,
  },
  statLabel: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
    marginTop: SPACING.base,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    marginHorizontal: SPACING.md,
    paddingHorizontal: SPACING.sm,
    ...ELEVATION.level1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerHigh,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    ...FONTS.bodyMd,
    color: COLORS.textMain,
    marginLeft: 14,
    fontWeight: '500',
  },
  logoutText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
