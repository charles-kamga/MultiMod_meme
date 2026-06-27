/**
 * COMPOSANTS PARTAGÉS — AfroButton, Header, AfroCard, MoodChip
 * Design system Afro-UX : formes organiques, ombres ambiantes, couleurs terracotta.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';

/* ─────────────────────────────────────────────────
 * AFRO BUTTON
 * ───────────────────────────────────────────────── */

interface AfroButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  icon?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const AfroButton: React.FC<AfroButtonProps> = ({
  title,
  onPress,
  color = COLORS.primary,
  variant = 'solid',
  disabled = false,
  style,
}) => {
  const buttonStyle: ViewStyle[] = [
    styles.button,
    variant === 'solid' && { backgroundColor: color },
    variant === 'outline' && {
      backgroundColor: COLORS.transparent,
      borderWidth: 2,
      borderColor: color,
    },
    variant === 'ghost' && {
      backgroundColor: COLORS.transparent,
      elevation: 0,
    },
    disabled && { opacity: 0.5 },
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  const textColor = variant === 'solid' ? COLORS.white : color;

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

/* ─────────────────────────────────────────────────
 * HEADER
 * ───────────────────────────────────────────────── */

interface HeaderProps {
  title: string;
  subtitle?: string;
  showAvatar?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showAvatar = false,
  onBack,
}) => (
  <View style={styles.headerContainer}>
    {onBack && (
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={22} color={COLORS.textMain} />
      </TouchableOpacity>
    )}
    <View style={styles.headerTextSection}>
      <Text style={styles.headerTitle} numberOfLines={2}>
        {title}
      </Text>
      {subtitle && (
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      )}
    </View>
    {showAvatar && (
      <View style={styles.avatarContainer}>
        <View style={styles.avatarPlaceholder} />
      </View>
    )}
  </View>
);

/* ─────────────────────────────────────────────────
 * FEATURE CARD (Dashboard)
 * ───────────────────────────────────────────────── */

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  badge?: string;
  onPress: () => void;
  variant?: 'large' | 'compact';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  accentColor,
  badge,
  onPress,
  variant = 'large',
}) => {
  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={[styles.compactCard, { borderTopWidth: 6, borderTopColor: accentColor }]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: accentColor + '18' },
          ]}
        >
          <Text style={{ fontSize: 22 }}>{icon}</Text>
        </View>
        <View style={styles.compactCardContent}>
          <Text style={styles.compactCardTitle}>{title}</Text>
          <Text style={styles.compactCardDesc}>{description}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.largeCard, { borderLeftWidth: 8, borderLeftColor: accentColor }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.largeCardTopRow}>
        <View
          style={[
            styles.iconCircleLarge,
            { backgroundColor: accentColor + '18' },
          ]}
        >
          <Text style={{ fontSize: 28 }}>{icon}</Text>
        </View>
        {badge && (
          <View style={[styles.badge, { backgroundColor: accentColor }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.largeCardTitle}>{title}</Text>
      <Text style={styles.largeCardDesc}>{description}</Text>
      <View style={styles.largeCardArrowRow}>
       <View style={[styles.arrowCircle, { backgroundColor: accentColor }]}>
         <Icon name="chevron-forward" size={20} color={COLORS.white} />
       </View>
      </View>
    </TouchableOpacity>
  );
};

/* ─────────────────────────────────────────────────
 * MOOD CHIP (Context Screen)
 * ───────────────────────────────────────────────── */

interface MoodChipProps {
  label: string;
  icon: string;
  isSelected: boolean;
  onPress: () => void;
  color?: string;
}

export const MoodChip: React.FC<MoodChipProps> = ({
  label,
  icon,
  isSelected,
  onPress,
  color = COLORS.primary,
}) => (
  <TouchableOpacity
    style={[
      styles.moodChip,
      isSelected
        ? { backgroundColor: color, ...ELEVATION.level1 }
        : { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.outlineVariant },
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={{ fontSize: 18, marginBottom: 4 }}>{icon}</Text>
    <Text
      style={[
        styles.moodChipText,
        { color: isSelected ? COLORS.white : COLORS.onSurfaceVariant },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

/* ─────────────────────────────────────────────────
 * LOADING INDICATOR
 * ───────────────────────────────────────────────── */

export const AfroLoader: React.FC<{ message?: string }> = ({
  message = 'Chargement...',
}) => (
  <View style={styles.loaderContainer}>
    <View style={styles.loaderShape} />
    <Text style={styles.loaderText}>{message}</Text>
  </View>
);

/* ─────────────────────────────────────────────────
 * STYLES
 * ───────────────────────────────────────────────── */

const styles = StyleSheet.create({
  // Button
  button: {
    height: 56,
    borderRadius: RADII.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xs,
    width: '100%',
    ...ELEVATION.level1,
  } as ViewStyle,
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  } as TextStyle,

  // Header
  headerContainer: {
    paddingHorizontal: SPACING.marginHorizontal,
    paddingTop: SPACING.marginHorizontal,
    paddingBottom: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  headerTextSection: {
    flex: 1,
  } as ViewStyle,
  headerTitle: {
    ...FONTS.headlineMd,
    color: COLORS.primary,
    letterSpacing: -0.3,
  } as TextStyle,
  headerSubtitle: {
    ...FONTS.labelLg,
    color: COLORS.onSurfaceVariant,
    marginTop: SPACING.base,
  } as TextStyle,
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  } as ViewStyle,
  backButtonText: {
    fontSize: 22,
    color: COLORS.textMain,
  } as TextStyle,
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    marginLeft: SPACING.sm,
  } as ViewStyle,
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.accent,
  } as ViewStyle,

  // Large Feature Card
  largeCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    padding: SPACING.marginHorizontal,
    marginBottom: SPACING.sm,
    ...ELEVATION.level1,
  } as ViewStyle,
  largeCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  } as ViewStyle,
  iconCircleLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.base + 2,
    borderRadius: RADII.full,
  } as ViewStyle,
  badgeText: {
    ...FONTS.labelSm,
    color: COLORS.white,
    fontWeight: '600',
  } as TextStyle,
  largeCardTitle: {
    ...FONTS.headlineMd,
    color: COLORS.textMain,
    marginBottom: SPACING.xs,
  } as TextStyle,
  largeCardDesc: {
    ...FONTS.bodyMd,
    color: COLORS.onSurfaceVariant,
  } as TextStyle,
  largeCardArrowRow: {
    alignItems: 'flex-end',
    marginTop: SPACING.sm,
  } as ViewStyle,
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  arrowIcon: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: '700',
  } as TextStyle,

  // Compact Feature Card
  compactCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    padding: SPACING.sm,
    ...ELEVATION.level1,
  } as ViewStyle,
  compactCardContent: {
    marginTop: SPACING.xs,
  } as ViewStyle,
  compactCardTitle: {
    ...FONTS.labelLg,
    color: COLORS.textMain,
    fontWeight: '700',
  } as TextStyle,
  compactCardDesc: {
    ...FONTS.labelSm,
    color: COLORS.onSurfaceVariant,
    marginTop: SPACING.base,
  } as TextStyle,

  // Icon Circle (shared)
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  // Mood Chip
  moodChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADII.lg,
    minHeight: 80,
  } as ViewStyle,
  moodChipText: {
    ...FONTS.labelSm,
    fontWeight: '600',
  } as TextStyle,

  // Loader
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  } as ViewStyle,
  loaderShape: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    opacity: 0.6,
    marginBottom: SPACING.sm,
  } as ViewStyle,
  loaderText: {
    ...FONTS.labelLg,
    color: COLORS.onSurfaceVariant,
  } as TextStyle,
});
