import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { MemeResult } from '../types/meme';
import { COLORS, SPACING, RADII, ELEVATION, FONTS } from '../theme/colors';
import { Header, AfroButton } from '../components/SharedComponents';

type Props = NativeStackScreenProps<RootStackParamList, 'Gallery'>;

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 52) / 2;
const GALLERY_KEY = 'meme_gallery';

const sourceShort: Record<MemeResult['sourceType'], string> = {
  text: 'TXT',
  audio: 'MIC',
  image: 'IMG',
};

const fallbackImages = {
  text: require('../assets/memes/context_ai.png'),
  audio: require('../assets/memes/voice_ai.png'),
  image: require('../assets/memes/remix_ai.png'),
};

const GalleryScreen: React.FC<Props> = ({ navigation }) => {
  const [gallery, setGallery] = useState<MemeResult[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGallery = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const stored = await AsyncStorage.getItem(GALLERY_KEY);
      setGallery(stored ? JSON.parse(stored) : []);
    } catch (error) {
      console.warn('Erreur chargement galerie', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadGallery();
    }, [loadGallery]),
  );

  const deleteMeme = (id: string): void => {
    Alert.alert('Supprimer ce meme ?', 'Cette action est definitive.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          const updated = gallery.filter(meme => meme.id !== id);
          setGallery(updated);
          await AsyncStorage.setItem(GALLERY_KEY, JSON.stringify(updated));
        },
      },
    ]);
  };

  const clearAll = (): void => {
    Alert.alert('Vider la galerie ?', 'Tous les memes sauvegardes seront retires.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Tout supprimer',
        style: 'destructive',
        onPress: async () => {
          setGallery([]);
          await AsyncStorage.removeItem(GALLERY_KEY);
        },
      },
    ]);
  };

  const formatDate = (timestamp: number): string =>
    new Date(timestamp).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  const renderMeme = ({ item }: { item: MemeResult }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('MemeResult', { meme: item })}
      onLongPress={() => deleteMeme(item.id)}
    >
      <Image
        source={item.imageUri ? { uri: item.imageUri } : fallbackImages[item.sourceType]}
        style={styles.cardImage}
        resizeMode="cover"
      />

      <View style={styles.cardOverlay}>
        <Text style={styles.cardBadge}>{sourceShort[item.sourceType]}</Text>
        <Text style={styles.cardPunchline} numberOfLines={2}>
          {item.bottomText || item.punchline || item.topText || 'Meme IA'}
        </Text>
        <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Galerie locale"
        subtitle={`${gallery.length} meme${gallery.length > 1 ? 's' : ''} sauvegarde${gallery.length > 1 ? 's' : ''}`}
        onBack={() => navigation.goBack()}
        rightLabel={gallery.length > 0 ? 'Vider' : undefined}
        onRightPress={clearAll}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : gallery.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={fallbackImages.text} style={styles.emptyImage} resizeMode="cover" />
          <Text style={styles.emptyTitle}>Aucun meme pour le moment</Text>
          <Text style={styles.emptySubtitle}>
            Les resultats generes seront sauvegardes ici automatiquement.
          </Text>
          <AfroButton title="Creer un meme" onPress={() => navigation.navigate('MainTabs')} />
        </View>
      ) : (
        <FlatList
          data={gallery}
          keyExtractor={item => item.id}
          renderItem={renderMeme}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: SPACING.marginHorizontal,
    paddingBottom: 110,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  card: {
    width: CARD_SIZE,
    borderRadius: RADII.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    ...ELEVATION.level1,
  },
  cardImage: {
    width: '100%',
    height: CARD_SIZE,
    backgroundColor: COLORS.surfaceMuted,
  },
  cardOverlay: {
    padding: SPACING.sm,
  },
  cardBadge: {
    ...FONTS.labelSm,
    color: COLORS.primary,
    marginBottom: 3,
  },
  cardPunchline: {
    ...FONTS.labelSm,
    color: COLORS.textMain,
    marginBottom: 4,
  },
  cardDate: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    ...FONTS.headlineMd,
    color: COLORS.textMain,
    textAlign: 'center',
  },
  emptyImage: {
    width: 220,
    height: 160,
    borderRadius: RADII.xl,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surfaceMuted,
  },
  emptySubtitle: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
});

export default GalleryScreen;
