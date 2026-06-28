import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

const getStorageKey = () => {
  const uid = auth().currentUser?.uid;
  return uid ? `memes_${uid}` : 'memes_guest';
};

const COLORS = {
  primary: '#C84B31',
  background: '#FAF6F0',
  text: '#1A1A1A',
  gray: '#888888',
  cardBg: '#FFFFFF',
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
          console.error("Erreur lors de la rÃ©cupÃ©ration des mÃ¨mes :", error);
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
      console.error("Erreur de dÃ©connexion :", error);
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
            <Ionicons name="settings-outline" size={22} color={COLORS.gray} />
            <Text style={styles.menuItemText}>Mes paramètres</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="earth-outline" size={22} color={COLORS.gray} />
            <Text style={styles.menuItemText}>Préférences de langue</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.gray} />
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
  },
  initialsAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F3A953',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginBottom: 15,
  },
  initialsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  statsContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    marginHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 25,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  menuContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    marginHorizontal: 24,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 14,
    fontWeight: '500',
  },
  logoutText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
