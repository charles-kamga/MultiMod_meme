import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';
import type {MemeResult} from './MemeResultScreen';
import { COLORS, SPACING, RADII, FONTS, ELEVATION } from '../theme/colors';

const getStorageKey = () => {
  const uid = auth().currentUser?.uid;
  return uid ? `memes_${uid}` : 'memes_guest';
};

const {width} = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2;

const GalleryScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [gallery, setGallery] = useState<MemeResult[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadGallery();
    }, []),
  );

  const loadGallery = async () => {
    setLoading(true);
    try {
      const stored = await AsyncStorage.getItem(getStorageKey());
      const data: MemeResult[] = stored ? JSON.parse(stored) : [];
      setGallery(data);
    } catch (e) {
      console.error('Erreur chargement galerie :', e);
    } finally {
      setLoading(false);
    }
  };

  const deleteMeme = (id: string) => {
    Alert.alert(
      'Supprimer ce mème ?',
      'Cette action est irréversible.',
      [
        {text: 'Annuler', style: 'cancel'},
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const updated = gallery.filter(m => m.id !== id);
            setGallery(updated);
            await AsyncStorage.setItem(getStorageKey(), JSON.stringify(updated));
          },
        },
      ],
    );
  };

  const clearAll = () => {
    Alert.alert(
      'Vider la galerie ?',
      'Tous tes mèmes seront supprimés définitivement.',
      [
        {text: 'Annuler', style: 'cancel'},
        {
          text: 'Tout supprimer',
          style: 'destructive',
          onPress: async () => {
            setGallery([]);
            await AsyncStorage.removeItem(getStorageKey());
          },
        },
      ],
    );
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('fr-FR', {day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'});
  };

  const sourceIcons: Record<string, string> = {
    text: 'chatbubble-ellipses',
    audio: 'mic',
    image: 'image',
  };

  const renderMeme = ({item}: {item: MemeResult}) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('MemeResult', {
        sourceType: 'gallery',
        punchline: item.punchline || item.bottomText || 'Pas de punchline',
        imageUrl: item.imageUri || 'https://via.placeholder.com/500',
      })}
      onLongPress={() => deleteMeme(item.id)}>
      {item.imageUri ? (
        <Image source={{uri: item.imageUri}} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={styles.cardPlaceholder}>
          <Ionicons name="happy-outline" size={48} color={COLORS.surfaceContainerHigh} />
        </View>
      )}
      <View style={styles.cardOverlay}>
        <Ionicons
          name={sourceIcons[item.sourceType] || 'help-circle-outline'}
          size={14}
          color={COLORS.primary}
          style={{marginBottom: 2}}
        />
        {(item.bottomText || item.punchline) ? (
          <Text style={styles.cardPunchline} numberOfLines={2}>
            {item.bottomText || item.punchline}
          </Text>
        ) : null}
        <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="images-outline" size={64} color={COLORS.surfaceContainerHigh} />
      <Text style={styles.emptyTitle}>Galerie vide</Text>
      <Text style={styles.emptySubtitle}>
        Tes mèmes générés apparaîtront ici automatiquement.
      </Text>
      <TouchableOpacity
        style={styles.emptyBtn}
        onPress={() => navigation.goBack()}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name="sparkles" size={16} color={COLORS.white} style={{marginRight: 6}} />
          <Text style={styles.emptyBtnText}>Créer mon premier mème</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Ma Galerie</Text>
          {gallery.length > 0 && (
            <Text style={styles.headerCount}>{gallery.length} mème{gallery.length > 1 ? 's' : ''}</Text>
          )}
        </View>
        {gallery.length > 0 ? (
          <TouchableOpacity onPress={clearAll} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        ) : (
          <View style={{width: 40}} />
        )}
      </View>
      {gallery.length > 0 && (
        <Text style={styles.hint}>Appui long sur un mème pour le supprimer</Text>
      )}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : gallery.length === 0 ? (
        <EmptyState />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
    paddingTop: Platform.OS === 'android' ? SPACING.sm : 50,
    paddingBottom: SPACING.xs,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerHigh,
  },
  backBtn: {padding: 8},
  headerTitle: {
    ...FONTS.headlineMd,
    color: COLORS.textMain,
    textAlign: 'center',
  },
  headerCount: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  clearBtn: {padding: 8},
  hint: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    ...FONTS.labelSm,
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: SPACING.sm,
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  card: {
    width: CARD_SIZE,
    borderRadius: RADII.md,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHighest,
    ...ELEVATION.level1,
  },
  cardImage: {
    width: '100%',
    height: CARD_SIZE,
  },
  cardPlaceholder: {
    width: '100%',
    height: CARD_SIZE,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardOverlay: {
    backgroundColor: COLORS.white,
    padding: 8,
  },
  cardPunchline: {
    ...FONTS.labelSm,
    color: COLORS.textMain,
    fontWeight: '700',
    lineHeight: 15,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardDate: {
    ...FONTS.labelSm,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    ...FONTS.headlineMd,
    color: COLORS.textMain,
    marginBottom: 8,
    marginTop: SPACING.sm,
  },
  emptySubtitle: {
    ...FONTS.bodyMd,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    borderRadius: RADII.md,
  },
  emptyBtnText: {
    ...FONTS.labelLg,
    color: COLORS.white,
  },
});

export default GalleryScreen;
