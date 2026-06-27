import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { logoutUser } from '../services/authService';

const COLORS = {
  primary: '#C84B31',
  background: '#FAF6F0',
  text: '#1A1A1A',
  gray: '#888888',
  cardBg: '#FFFFFF',
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (name[0] || '?').toUpperCase();
};

export default function ProfileScreen({ navigation }: any) {
  const [memeCount, setMemeCount] = useState(0);
  const user = auth().currentUser;
  const displayName = user?.displayName || user?.email || 'Utilisateur';
  const initials = user?.displayName ? getInitials(user.displayName) : '?';
  const email = user?.email || '';

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Tu es sur de vouloir quitter le kwatt ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Oui, je sors',
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Mon Profil</Text>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.initialsAvatar}>
          <Text style={styles.initialsText}>{initials}</Text>
        </View>
        
        <Text style={styles.userName}>{displayName}</Text>
        {email ? <Text style={styles.userSubtitle}>{email}</Text> : null}

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{memeCount}</Text>
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

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="help-circle-outline" size={22} color={COLORS.gray} />
            <Text style={styles.menuItemText}>Centre d'aide</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="person-add-outline" size={22} color={COLORS.gray} />
            <Text style={styles.menuItemText}>Inviter un ami</Text>
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
