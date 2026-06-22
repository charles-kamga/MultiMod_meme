/**
 * ÉCRAN : GalleryScreen — La Galerie du Kwatt
 * Flux des mèmes récents avec filtres (Tous, Mes Créations, Favoris).
 * Inspiré de la maquette `la_galerie_du_kwatt/screen.png` et du code de référence.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, MainTabParamList } from '../navigation/types';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';
import { Header } from '../components/SharedComponents';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Gallery'>,
  NativeStackScreenProps<RootStackParamList>
>;

type FilterKey = 'all' | 'mine' | 'favorites';

interface FilterOption {
  key: FilterKey;
  label: string;
}

const FILTERS: FilterOption[] = [
  { key: 'all', label: 'Tous' },
  { key: 'mine', label: 'Mes Créations' },
  { key: 'favorites', label: 'Favoris' },
];

interface MemeItem {
  id: string;
  title: string;
  author: string;
  likes: number;
}

const MOCK_MEMES: MemeItem[] = [
  { id: '1', title: 'Le clash du siècle', author: 'MK', likes: 237 },
  { id: '2', title: 'Ndolo impossible', author: 'AB', likes: 184 },
  { id: '3', title: 'Ndem level 100', author: 'LL', likes: 312 },
  { id: '4', title: 'Miondo vibes', author: 'JD', likes: 156 },
  { id: '5', title: 'Akié du matin', author: 'NK', likes: 298 },
  { id: '6', title: 'Kwatt legend', author: 'PT', likes: 421 },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - SPACING.marginHorizontal * 2 - SPACING.sm) / 2;

const GalleryScreen: React.FC<Props> = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const renderMemeCard = ({ item }: { item: MemeItem }): React.JSX.Element => (
    <TouchableOpacity style={styles.galleryCard} activeOpacity={0.85}>
      <View style={styles.galleryThumb}>
        <View style={styles.thumbOverlay}>
          <Text style={styles.thumbEmoji}>🎨</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.galleryTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.cardMeta}>
          <View style={styles.authorChip}>
            <Text style={styles.authorText}>{item.author}</Text>
          </View>
          <Text style={styles.likesText}>❤️ {item.likes}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="La Galerie du Kwatt" />

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              activeFilter === filter.key && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.key && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Grille de mèmes */}
      <FlatList
        data={MOCK_MEMES}
        renderItem={renderMemeCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Filters
  filterRow: {
    paddingHorizontal: SPACING.marginHorizontal,
    paddingVertical: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.marginHorizontal,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADII.full,
    backgroundColor: COLORS.white,
    marginRight: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    ...FONTS.labelLg,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.white,
  },

  // Grid
  gridContent: {
    paddingHorizontal: SPACING.marginHorizontal,
    paddingBottom: SPACING.xl,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  galleryCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    overflow: 'hidden',
    ...ELEVATION.level1,
  },
  galleryThumb: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbOverlay: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: {
    fontSize: 22,
  },
  cardFooter: {
    padding: SPACING.xs + 2,
  },
  galleryTitle: {
    ...FONTS.labelLg,
    color: COLORS.textMain,
    fontWeight: '700',
    marginBottom: SPACING.base,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorChip: {
    backgroundColor: COLORS.secondary + '20',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADII.full,
  },
  authorText: {
    ...FONTS.labelSm,
    color: COLORS.secondary,
    fontSize: 10,
  },
  likesText: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
});

export default GalleryScreen;
