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
import { Header, InfoPanel, StatusPill } from '../components/SharedComponents';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

const STATS = [
  { value: '3', label: 'Modules' },
  { value: '100%', label: 'Backend' },
  { value: '237', label: 'Culture' },
];

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const logout = (): void => {
    Alert.alert('Deconnexion', 'Retourner a la page de connexion ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Oui',
        onPress: () =>
          navigation.getParent()?.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profil projet" subtitle="Livrable ICT202" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MM</Text>
          </View>
          <Text style={styles.profileName}>MultiMod Meme</Text>
          <Text style={styles.profileBio}>React Native CLI + Express.js + Gemini 1.5 Flash</Text>
          <StatusPill label="Theme vert actif" tone="ok" />
        </View>

        <View style={styles.statsCard}>
          {STATS.map((stat, index) => (
            <View key={stat.label} style={[styles.statBox, index < STATS.length - 1 && styles.statBorder]}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <InfoPanel
          title="Fonctions bonus"
          body="Partage direct, galerie locale, adaptation culturelle et architecture securisee sont exposes dans l'application."
          tone="gold"
        />

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Gallery')}>
            <Text style={styles.menuText}>Galerie des memes</Text>
            <Text style={styles.menuArrow}>{'>'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Context')}>
            <Text style={styles.menuText}>Tester Context Reader</Text>
            <Text style={styles.menuArrow}>{'>'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={logout}>
            <Text style={[styles.menuText, styles.dangerText]}>Deconnexion</Text>
            <Text style={styles.menuArrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Version APK 1.0.0</Text>
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
    paddingBottom: 110,
    gap: SPACING.md,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...ELEVATION.level1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText: {
    ...FONTS.headlineLg,
    color: COLORS.white,
  },
  profileName: {
    ...FONTS.headlineMd,
    color: COLORS.textMain,
  },
  profileBio: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.sm,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...ELEVATION.level1,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
  },
  statBorder: {
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  statValue: {
    ...FONTS.title,
    color: COLORS.primary,
  },
  statLabel: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...ELEVATION.level1,
  },
  menuItem: {
    minHeight: 58,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuText: {
    ...FONTS.bodyMd,
    color: COLORS.textMain,
  },
  dangerText: {
    color: COLORS.error,
  },
  menuArrow: {
    ...FONTS.title,
    color: COLORS.textSecondary,
  },
  versionText: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ProfileScreen;
