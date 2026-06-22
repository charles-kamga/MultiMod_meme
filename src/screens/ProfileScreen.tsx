/**
 * ÉCRAN : ProfileScreen — Mon Profil Afro-Vibe
 * Page profil utilisateur avec avatar, stats, et menu de paramètres.
 * Inspiré de la maquette `mon_profil_afro_vibe/screen.png` et du code de référence.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, MainTabParamList } from '../navigation/types';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';
import { Header } from '../components/SharedComponents';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface StatItem {
  value: string;
  label: string;
}

interface MenuItem {
  label: string;
  icon: string;
  action?: () => void;
}

const STATS: StatItem[] = [
  { value: '1.2k', label: 'Mèmes' },
  { value: '8.4k', label: 'Partages' },
  { value: '342', label: 'Favoris' },
];

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const MENU_ITEMS: MenuItem[] = [
    { label: 'Mes paramètres', icon: '⚙️' },
    { label: 'Préférences de langue', icon: '🌍' },
    { label: "Centre d'aide", icon: '❓' },
    { label: 'Inviter un ami', icon: '📨' },
    {
      label: 'Déconnexion',
      icon: '🚪',
      action: () => {
        Alert.alert(
          'Déconnexion',
          'Tu es sûr de vouloir quitter le kwatt ?',
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Oui, je sors',
              style: 'destructive',
              onPress: () => navigation.getParent()?.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              }),
            },
          ],
        );
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Mon Profil" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Profil */}
        <View style={styles.profileSection}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.largeAvatar}>
              <Text style={styles.avatarEmoji}>👤</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Text style={styles.editAvatarIcon}>✏️</Text>
            </TouchableOpacity>
          </View>

          {/* Nom et bio */}
          <Text style={styles.profileName}>Le Ndoki Master</Text>
          <Text style={styles.profileBio}>
            Créateur de punchlines depuis 237 🇨🇲
          </Text>

          {/* Badge */}
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeIcon}>⭐</Text>
            <Text style={styles.premiumBadgeText}>Membre Premium</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          {STATS.map((stat, index) => (
            <React.Fragment key={stat.label}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {index < STATS.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuItemIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.menuItemText,
                    item.label === 'Déconnexion' && styles.menuItemTextDanger,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Version */}
        <Text style={styles.versionText}>AfroMeme Generator v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.marginHorizontal,
    paddingBottom: SPACING.xl,
  },

  // Profile Section
  profileSection: {
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.sm,
  },
  largeAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.primary + '30',
    ...ELEVATION.level1,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  editAvatarIcon: {
    fontSize: 16,
  },
  profileName: {
    ...FONTS.headlineMd,
    color: COLORS.textMain,
    marginBottom: SPACING.base,
  },
  profileBio: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADII.full,
  },
  premiumBadgeIcon: {
    fontSize: 14,
    marginRight: SPACING.base,
  },
  premiumBadgeText: {
    ...FONTS.labelSm,
    color: COLORS.tertiary,
    fontWeight: '600',
  },

  // Stats
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...ELEVATION.level1,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: SPACING.base,
  },
  statLabel: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: COLORS.surfaceVariant,
    alignSelf: 'center',
  },

  // Menu
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    padding: SPACING.xs,
    ...ELEVATION.level1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.sm,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerLow,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  menuItemText: {
    ...FONTS.bodyMd,
    color: COLORS.textMain,
  },
  menuItemTextDanger: {
    color: COLORS.error,
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.textSecondary,
  },

  // Version
  versionText: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});

export default ProfileScreen;
