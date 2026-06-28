/**
 * ÉCRAN : LoginScreen — Connexion au Kwatt
 * Interface d'accueil avec formulaire email/mot de passe + bouton Google Sign-In.
 * La navigation automatique est gérée par onAuthStateChanged dans AppNavigator.
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
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';
import { AfroButton } from '../components/SharedComponents';
import { loginWithEmail, loginWithGoogle } from '../services/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);

  const handleGoogleLogin = async (): Promise<void> => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la connexion avec Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (): Promise<void> => {
    if (!email.trim() || !password) {
      Alert.alert('Oooh !', 'Remplis tous les champs.');
      return;
    }
    setLoading(true);
    const result = await loginWithEmail(email, password);
    setLoading(false);
    if (!result.success) {
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
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Image
                source={require('../assets/images/logo.png')}
                style={{ width: 120, height: 120 }}
              />
            </View>
          </View>

          <Text style={styles.title}>Bienvenue au Kwatt</Text>
          <Text style={styles.subtitle}>
            Connecte-toi pour créer tes mèmes légendaires.
          </Text>

          <View style={styles.formCard}>
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

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              activeOpacity={0.8}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator size="small" color={COLORS.textMain} />
              ) : (
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <Ionicons name="logo-google" size={20} color="#EA4335" style={{marginRight: 10}} />
                  <Text style={styles.googleButtonText}>Se connecter avec Google</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

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
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHighest,
    backgroundColor: COLORS.white,
    marginTop: SPACING.sm,
  },
  googleButtonText: {
    ...FONTS.labelLg,
    color: COLORS.textMain,
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
