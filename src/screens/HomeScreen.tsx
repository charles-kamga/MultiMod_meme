/**
 * ÉCRAN : HomeScreen — Dashboard Afro-Vibe Interactif
 * Tableau de bord avec 3 cartes d'accès rapide multimodales + carrousel mèmes récents.
 * Inspiré de la maquette `dashboard_afro_vibe_interactive/screen.png`
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, MainTabParamList } from '../navigation/types';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';
import { Header, FeatureCard } from '../components/SharedComponents';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_ITEM_WIDTH = SCREEN_WIDTH * 0.6;

const RECENT_MEMES = [
  {
    id: '1',
    quote: '"Quand tu dis que tu arrives et tu es encore au lit..."',
    author: 'MK',
    trending: true,
  },
  {
    id: '2',
    quote: '"Le ndem est fort cette semaine ooh!"',
    author: 'AB',
    trending: false,
  },
  {
    id: '3',
    quote: '"Moi face au miondo de midi..."',
    author: 'LL',
    trending: false,
  },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* En-tête */}
        <Header
          title="Akié ! Quel est le ndem du jour ?"
          subtitle="Laisse ta créativité parler pour le kwatt."
          showAvatar
        />

        {/* Section Fonctionnalités */}
        <View style={styles.cardsSection}>
          {/* Context Reader — Carte large */}
          <FeatureCard
            title="Colle les discussions"
            description="Transforme les screens du kwatt en memes de clash ou de ndolo légendaires."
            icon="📄"
            accentColor={COLORS.primary}
            badge="Context Reader"
            onPress={() => navigation.navigate('Context')}
            variant="large"
          />

          {/* Cartes compactes en row */}
          <View style={styles.compactRow}>
            <FeatureCard
              title="Voice-to-Meme"
              description="Audio → Punchline imagée."
              icon="🎤"
              accentColor={COLORS.secondary}
              onPress={() => navigation.navigate('Voice')}
              variant="compact"
            />
            <View style={styles.compactSpacer} />
            <FeatureCard
              title="Status Remixer"
              description="Upload & Remix unique."
              icon="📷"
              accentColor={COLORS.tertiaryContainer}
              onPress={() => navigation.navigate('Remixer')}
              variant="compact"
            />
          </View>
        </View>

        {/* Mèmes Récents du Kwatt */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Mèmes Récents du Kwatt</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Gallery')}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            snapToInterval={CAROUSEL_ITEM_WIDTH + SPACING.sm}
            decelerationRate="fast"
          >
            {RECENT_MEMES.map((meme) => (
              <View key={meme.id} style={styles.carouselCard}>
                {/* Image placeholder */}
                <View style={styles.carouselImage}>
                  {meme.trending && (
                    <View style={styles.trendingBadge}>
                      <Text style={styles.trendingText}>Trending 🔥</Text>
                    </View>
                  )}
                </View>
                {/* Contenu */}
                <View style={styles.carouselBody}>
                  <Text style={styles.carouselQuote} numberOfLines={2}>
                    {meme.quote}
                  </Text>
                  <View style={styles.carouselFooter}>
                    <View
                      style={[
                        styles.authorBubble,
                        {
                          backgroundColor:
                            meme.id === '1'
                              ? COLORS.secondary
                              : meme.id === '2'
                                ? COLORS.tertiary
                                : COLORS.primary,
                        },
                      ]}
                    >
                      <Text style={styles.authorInitials}>{meme.author}</Text>
                    </View>
                    <TouchableOpacity style={styles.shareBtn}>
                      <Text style={styles.shareIcon}>↗️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
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
    paddingBottom: SPACING.xl + SPACING.lg,
  },

  // Cards Section
  cardsSection: {
    paddingHorizontal: SPACING.marginHorizontal,
    paddingTop: SPACING.md,
  },
  compactRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  compactSpacer: {
    width: SPACING.sm,
  },

  // Recent Memes
  recentSection: {
    marginTop: SPACING.xl,
    paddingLeft: SPACING.marginHorizontal,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: SPACING.marginHorizontal,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    ...FONTS.headlineMd,
    color: COLORS.textMain,
  },
  seeAllText: {
    ...FONTS.labelLg,
    color: COLORS.primary,
  },

  // Carousel
  carouselContent: {
    paddingRight: SPACING.marginHorizontal,
  },
  carouselCard: {
    width: CAROUSEL_ITEM_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    overflow: 'hidden',
    marginRight: SPACING.sm,
    ...ELEVATION.level1,
  },
  carouselImage: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.surfaceContainer,
    position: 'relative',
  },
  trendingBadge: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 3,
    borderRadius: RADII.full,
  },
  trendingText: {
    ...FONTS.labelSm,
    color: COLORS.white,
    fontSize: 10,
  },
  carouselBody: {
    padding: SPACING.sm,
  },
  carouselQuote: {
    ...FONTS.labelLg,
    color: COLORS.textMain,
    fontStyle: 'italic',
    marginBottom: SPACING.xs,
  },
  carouselFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorInitials: {
    ...FONTS.labelSm,
    color: COLORS.white,
    fontSize: 10,
  },
  shareBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    fontSize: 14,
  },
});

export default HomeScreen;
