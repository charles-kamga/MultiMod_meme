import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, RADII, FONTS, ELEVATION } from '../theme/colors';

const { width } = Dimensions.get('window');

const INTRO_CAROUSEL = [
  { id: '1', title: 'Le Jimpat de l\'IA', text: 'Transforme tes bad clashs WhatsApp en memes légendaires.' },
  { id: '2', title: 'Mode VOUP VAP', text: 'take ton mola en photo et Ndem l\'IA gérer la punchline.' },
];

const HomeScreen = ({ navigation }: any) => {
  const renderTip = ({ item }: any) => (
    <View style={styles.tipCard}>
      <Ionicons name="flash" size={20} color={COLORS.white} style={{ marginBottom: 8 }} />
      <Text style={styles.tipTitle}>{item.title}</Text>
      <Text style={styles.tipText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greet}>Meme Studio</Text>
            <Text style={styles.appName}>AFROMEME</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.carouselSection}>
          <FlatList
            data={INTRO_CAROUSEL}
            renderItem={renderTip}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={styles.studioGrid}>
          <Text style={styles.sectionTitle}>LABO DE CRÉATION</Text>

          <View style={styles.gridRow}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Context')}
            >
              <Ionicons name="document-text-outline" size={32} color={COLORS.primary} style={{ marginBottom: 10 }} />
              <Text style={styles.cardTitle}>Context Reader</Text>
              <Text style={styles.cardSub}>Texte & Clashs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Voice')}
            >
              <Ionicons name="mic-outline" size={32} color={COLORS.primary} style={{ marginBottom: 10 }} />
              <Text style={styles.cardTitle}>Voice-to-Meme</Text>
              <Text style={styles.cardSub}>Punchlines vocales</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.cardFull}
            onPress={() => navigation.navigate('Remixer')}
          >
            <View style={styles.cardFullContent}>
              <Ionicons name="image-outline" size={32} color={COLORS.primary} />
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.cardTitle}>Status Remixer</Text>
                <Text style={styles.cardSub}>Détourne les photos de ta galerie</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0 - ICT202 G2 - Groupe 8</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.marginHorizontal,
  },
  greet: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
  },
  appName: {
    ...FONTS.headlineLgMobile,
    color: COLORS.textMain,
  },
  profileBtn: {
    width: 45,
    height: 45,
    borderRadius: RADII.full,
    backgroundColor: COLORS.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  carouselSection: {
    marginVertical: SPACING.xs,
  },
  tipCard: {
    width: width - SPACING.marginHorizontal * 2,
    marginHorizontal: SPACING.marginHorizontal,
    borderRadius: RADII.lg,
    padding: 25,
    minHeight: 130,
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
  },
  tipTitle: {
    ...FONTS.headlineMd,
    color: COLORS.white,
    marginBottom: SPACING.base,
  },
  tipText: {
    ...FONTS.bodyMd,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  studioGrid: {
    padding: SPACING.marginHorizontal,
  },
  sectionTitle: {
    ...FONTS.labelSm,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.white,
    width: '48%',
    padding: SPACING.marginHorizontal,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
    ...ELEVATION.level1,
  },
  cardFull: {
    width: '100%',
    backgroundColor: COLORS.white,
    padding: SPACING.marginHorizontal,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
    ...ELEVATION.level1,
  },
  cardFullContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    ...FONTS.bodyLg,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  cardSub: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
    marginTop: SPACING.base,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen;
