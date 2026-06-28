/**
 * ÉCRAN : LoginScreen — Connexion au Kwatt
 * Interface d'accueil épurée et chaleureuse.
 * Inspiré de la maquette `connexion_au_kwatt/screen.png`
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';
import { AfroButton } from '../components/SharedComponents';
import { loginWithEmail } from '../services/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    if (!email.trim() || !password) {
      Alert.alert('Oooh !', 'Remplis tous les champs.');
      return;
    }
    setLoading(true);
    const result = await loginWithEmail(email, password);
    setLoading(false);
    if (result.success) {
      // Navigué automatiquement par onAuthStateChanged dans AppNavigator
    } else {
      Alert.alert('Erreur', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="sparkles" size={36} color={COLORS.white} />
            </View>
          </View>

          {/* Titre */}
          <Text style={styles.title}>Bienvenue au Kwatt</Text>
          <Text style={styles.subtitle}>
            Connecte-toi pour créer tes mèmes légendaires.
          </Text>

          {/* Carte formulaire */}
          <View style={styles.formCard}>
            {/* Boutons sociaux */}
            <View style={styles.socialSection}>
              <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-google" size={18} color={COLORS.textMain} style={{ marginRight: SPACING.xs }} />
                <Text style={styles.socialText}>Continuer avec Google</Text>
              </TouchableOpacity>

            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Champs */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="ton-nom@kwatt.cm"
                placeholderTextColor={COLORS.outline}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mot de passe</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.outline}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.onSurfaceVariant} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.forgotRow}>
                <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            </View>

            {/* Bouton principal */}
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            ) : (
              <AfroButton
                title="Se connecter"
                onPress={handleLogin}
                color={COLORS.primary}
              />
            )}
          </View>

          {/* Lien inscription */}
          <View style={styles.signupRow}>
            <Text style={styles.signupLabel}>Pas encore de compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xl,
  },

  // Logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...ELEVATION.level2,
  },
  // Titres
  title: {
    ...FONTS.headlineLg,
    color: COLORS.textMain,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },

  // Carte formulaire
  formCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADII.xl,
    padding: SPACING.md,
    ...ELEVATION.level1,
  },

  // Social
  socialSection: {
    marginBottom: SPACING.sm,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: RADII.full,
    borderWidth: 1.5,
    borderColor: COLORS.outlineVariant,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.xs,
  },
  socialText: {
    ...FONTS.labelLg,
    color: COLORS.textMain,
  },
  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.outlineVariant,
  },
  dividerText: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.sm,
  },

  // Input
  inputGroup: {
    marginBottom: SPACING.sm,
  },
  inputLabel: {
    ...FONTS.labelSm,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.base,
    marginLeft: SPACING.base,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.sm,
    height: 52,
    fontSize: 16,
    color: COLORS.textMain,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHighest,
  },
  passwordRow: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 52,
  },
  eyeButton: {
    position: 'absolute',
    right: SPACING.sm,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: SPACING.xs,
  },
  forgotText: {
    ...FONTS.labelSm,
    color: COLORS.primary,
  },

  loadingRow: {
    alignItems: 'center',
    padding: SPACING.md,
  },

  // Inscription
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  signupLabel: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
  },
  signupLink: {
    ...FONTS.labelLg,
    color: COLORS.primary,
  },
});

export default LoginScreen;
