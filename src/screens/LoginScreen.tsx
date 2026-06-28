import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';
import { AfroButton, StatusPill } from '../components/SharedComponents';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const loginArt = require('../assets/memes/context_ai.png');

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('demo@ict202.cm');
  const [password, setPassword] = useState('ict202');
  const [showPassword, setShowPassword] = useState(false);

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
          <View style={styles.hero}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>MM</Text>
            </View>
            <Image source={loginArt} style={styles.heroArt} resizeMode="cover" />
            <StatusPill label="ICT202 - Gemini via Express" tone="ok" />
            <Text style={styles.title}>MultiMod Meme</Text>
            <Text style={styles.subtitle}>
              Generateur de memes intelligent: texte, voix et image, avec humour local camerounais.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.cardTitle}>Connexion rapide</Text>
            <Text style={styles.cardSubtitle}>
              Le prototype garde les cles IA cote backend. Le mobile ne parle qu'a l'API Gateway.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="demo@ict202.cm"
                placeholderTextColor={COLORS.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mot de passe</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="ict202"
                  placeholderTextColor={COLORS.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.showButton}
                  onPress={() => setShowPassword(value => !value)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.showButtonText}>{showPassword ? 'Masquer' : 'Voir'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <AfroButton
              title="Entrer dans le studio"
              onPress={() => navigation.replace('MainTabs')}
              disabled={!email.trim() || !password.trim()}
            />
          </View>

          <View style={styles.footerStrip}>
            <Text style={styles.footerText}>Express.js + Multer + Gemini 1.5 Flash</Text>
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
    paddingHorizontal: SPACING.marginHorizontal,
    paddingVertical: SPACING.xl,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  brandMark: {
    width: 86,
    height: 86,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...ELEVATION.level2,
  },
  brandMarkText: {
    ...FONTS.headlineLg,
    color: COLORS.white,
  },
  heroArt: {
    width: '100%',
    height: 150,
    borderRadius: RADII.xl,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surfaceMuted,
  },
  title: {
    ...FONTS.display,
    color: COLORS.ink,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  subtitle: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    maxWidth: 330,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...ELEVATION.level1,
  },
  cardTitle: {
    ...FONTS.title,
    color: COLORS.textMain,
  },
  cardSubtitle: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.sm,
  },
  inputLabel: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  input: {
    height: 52,
    borderRadius: RADII.md,
    backgroundColor: COLORS.surfaceSoft,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    color: COLORS.textMain,
    fontSize: 15,
  },
  passwordRow: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 88,
  },
  showButton: {
    position: 'absolute',
    right: 6,
    top: 6,
    bottom: 6,
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
    borderRadius: RADII.sm,
    backgroundColor: COLORS.primaryContainer,
  },
  showButtonText: {
    ...FONTS.labelSm,
    color: COLORS.primaryDark,
  },
  footerStrip: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  footerText: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
  },
});

export default LoginScreen;
