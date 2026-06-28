import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export const AfroButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  color = COLORS.primary,
  variant = 'solid',
  disabled = false,
  style,
}) => {
  const solid = variant === 'solid';
  const outline = variant === 'outline';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        solid && { backgroundColor: color },
        outline && [styles.outlineButton, { borderColor: color }],
        variant === 'ghost' && styles.ghostButton,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: solid ? COLORS.white : color }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

interface HeaderProps {
  title: string;
  subtitle?: string;
  showAvatar?: boolean;
  onBack?: () => void;
  rightLabel?: string;
  onRightPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showAvatar = false,
  onBack,
  rightLabel,
  onRightPress,
}) => (
  <View style={styles.headerContainer}>
    {onBack ? (
      <TouchableOpacity onPress={onBack} style={styles.headerIconButton} activeOpacity={0.75}>
        <Text style={styles.headerIconText}>{'<'}</Text>
      </TouchableOpacity>
    ) : null}

    <View style={styles.headerTextSection}>
      <Text style={styles.headerTitle} numberOfLines={2}>{title}</Text>
      {subtitle ? <Text style={styles.headerSubtitle} numberOfLines={2}>{subtitle}</Text> : null}
    </View>

    {rightLabel ? (
      <TouchableOpacity onPress={onRightPress} style={styles.headerPill} activeOpacity={0.75}>
        <Text style={styles.headerPillText}>{rightLabel}</Text>
      </TouchableOpacity>
    ) : showAvatar ? (
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>237</Text>
      </View>
    ) : null}
  </View>
);

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
}) => (
  <TouchableOpacity
    style={[
      variant === 'large' ? styles.featureLarge : styles.featureCompact,
      { borderColor: accentColor },
    ]}
    activeOpacity={0.86}
    onPress={onPress}
  >
    <View style={styles.featureTopRow}>
      <View style={[styles.featureIcon, { backgroundColor: `${accentColor}22` }]}>
        <Text style={[styles.featureIconText, { color: accentColor }]}>{icon}</Text>
      </View>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: `${accentColor}18` }]}>
          <Text style={[styles.badgeText, { color: accentColor }]}>{badge}</Text>
        </View>
      ) : null}
    </View>
    <Text style={variant === 'large' ? styles.featureTitleLarge : styles.featureTitle}>
      {title}
    </Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </TouchableOpacity>
);

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
        ? { backgroundColor: color, borderColor: color }
        : { backgroundColor: COLORS.surface, borderColor: COLORS.border },
    ]}
    activeOpacity={0.82}
    onPress={onPress}
  >
    <Text style={[styles.moodIcon, { color: isSelected ? COLORS.white : color }]}>{icon}</Text>
    <Text style={[styles.moodText, { color: isSelected ? COLORS.white : COLORS.textMain }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export const StatusPill: React.FC<{ label: string; tone?: 'ok' | 'warn' | 'dark' }> = ({
  label,
  tone = 'ok',
}) => {
  const color = tone === 'ok' ? COLORS.primary : tone === 'warn' ? COLORS.accent : COLORS.secondary;
  return (
    <View style={[styles.statusPill, { backgroundColor: `${color}18`, borderColor: `${color}55` }]}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <Text style={[styles.statusText, { color }]}>{label}</Text>
    </View>
  );
};

export const InfoPanel: React.FC<{ title: string; body: string; tone?: 'green' | 'gold' }> = ({
  title,
  body,
  tone = 'green',
}) => {
  const color = tone === 'green' ? COLORS.primary : COLORS.accent;
  return (
    <View style={[styles.infoPanel, { borderLeftColor: color }]}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoBody}>{body}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: RADII.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    ...ELEVATION.level1,
  } as ViewStyle,
  ghostButton: {
    backgroundColor: COLORS.transparent,
    elevation: 0,
    shadowOpacity: 0,
  } as ViewStyle,
  outlineButton: {
    borderWidth: 1.5,
    backgroundColor: COLORS.transparent,
  } as ViewStyle,
  disabled: {
    opacity: 0.45,
  } as ViewStyle,
  buttonText: {
    ...FONTS.labelLg,
    fontSize: 15,
  } as TextStyle,
  headerContainer: {
    paddingHorizontal: SPACING.marginHorizontal,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  } as ViewStyle,
  headerIconText: {
    ...FONTS.title,
    color: COLORS.primaryDark,
  } as TextStyle,
  headerTextSection: {
    flex: 1,
  } as ViewStyle,
  headerTitle: {
    ...FONTS.headlineMd,
    color: COLORS.ink,
  } as TextStyle,
  headerSubtitle: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
    marginTop: 3,
  } as TextStyle,
  headerPill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primaryContainer,
    borderRadius: RADII.full,
  } as ViewStyle,
  headerPillText: {
    ...FONTS.labelSm,
    color: COLORS.primaryDark,
  } as TextStyle,
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  } as ViewStyle,
  avatarText: {
    ...FONTS.labelSm,
    color: COLORS.white,
  } as TextStyle,
  featureLarge: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    borderWidth: 1.5,
    padding: SPACING.md,
    minHeight: 190,
    ...ELEVATION.level1,
  } as ViewStyle,
  featureCompact: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    borderWidth: 1.5,
    padding: SPACING.sm,
    minHeight: 152,
    ...ELEVATION.level1,
  } as ViewStyle,
  featureTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  } as ViewStyle,
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  featureIconText: {
    ...FONTS.title,
  } as TextStyle,
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADII.full,
  } as ViewStyle,
  badgeText: {
    ...FONTS.labelSm,
  } as TextStyle,
  featureTitleLarge: {
    ...FONTS.headlineMd,
    color: COLORS.textMain,
    marginBottom: SPACING.xs,
  } as TextStyle,
  featureTitle: {
    ...FONTS.title,
    color: COLORS.textMain,
    marginBottom: SPACING.xs,
  } as TextStyle,
  featureDescription: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
  } as TextStyle,
  moodChip: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: RADII.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    alignItems: 'center',
    minHeight: 82,
  } as ViewStyle,
  moodIcon: {
    ...FONTS.title,
    marginBottom: 4,
  } as TextStyle,
  moodText: {
    ...FONTS.labelSm,
    textAlign: 'center',
  } as TextStyle,
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADII.full,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  } as ViewStyle,
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 7,
  } as ViewStyle,
  statusText: {
    ...FONTS.labelSm,
  } as TextStyle,
  infoPanel: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    padding: SPACING.md,
    borderLeftWidth: 5,
    ...ELEVATION.level1,
  } as ViewStyle,
  infoTitle: {
    ...FONTS.title,
    color: COLORS.textMain,
    marginBottom: 5,
  } as TextStyle,
  infoBody: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
  } as TextStyle,
});
