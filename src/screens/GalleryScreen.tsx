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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import type {MemeResult} from './MemeResultScreen';

const {width} = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2; // 2 colonnes avec padding

// ─── Composant ───────────────────────────────────────────────────────────────

const GalleryScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [gallery, setGallery] = useState<MemeResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Recharge la galerie à chaque fois qu'on revient sur cet écran
  useFocusEffect(
    useCallback(() => {
      loadGallery();
    }, []),
  );

  // ── Chargement depuis AsyncStorage ───────────────────────────────────────

  const loadGallery = async () => {
    setLoading(true);
    try {
      const stored = await AsyncStorage.getItem('meme_gallery');
      const data: MemeResult[] = stored ? JSON.parse(stored) : [];
      setGallery(data);
    } catch (e) {
      console.error('Erreur chargement galerie :', e);
    } finally {
      setLoading(false);
    }
  };

  // ── Suppression d'un mème ─────────────────────────────────────────────────

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
            await AsyncStorage.setItem('meme_gallery', JSON.stringify(updated));
          },
        },
      ],
    );
  };

  // ── Vider toute la galerie ────────────────────────────────────────────────

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
            await AsyncStorage.removeItem('meme_gallery');
          },
        },
      ],
    );
  };

  // ── Formater la date ──────────────────────────────────────────────────────

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('fr-FR', {day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'});
  };

  // ── Badge source ──────────────────────────────────────────────────────────

  const sourceEmoji = {text: '💬', audio: '🎙️', image: '🖼️'};

  // ── Rendu d'une carte mème ────────────────────────────────────────────────

  const renderMeme = ({item}: {item: MemeResult}) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('MemeResult', {meme: item})}
      onLongPress={() => deleteMeme(item.id)}>

      {/* Aperçu image ou placeholder */}
      {item.imageUri ? (
        <Image source={{uri: item.imageUri}} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={styles.cardPlaceholder}>
          <Text style={styles.cardPlaceholderEmoji}>😂</Text>
        </View>
      )}

      {/* Overlay bas avec punchline */}
      <View style={styles.cardOverlay}>
        <Text style={styles.cardSourceEmoji}>
          {sourceEmoji[item.sourceType]}
        </Text>
        {(item.bottomText || item.punchline) ? (
          <Text style={styles.cardPunchline} numberOfLines={2}>
            {item.bottomText || item.punchline}
          </Text>
        ) : null}
        <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
      </View>

    </TouchableOpacity>
  );

  // ── État vide ─────────────────────────────────────────────────────────────

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🗂️</Text>
      <Text style={styles.emptyTitle}>Galerie vide</Text>
      <Text style={styles.emptySubtitle}>
        Tes mèmes générés apparaîtront ici automatiquement.
      </Text>
      <TouchableOpacity
        style={styles.emptyBtn}
        onPress={() => navigation.goBack()}>
        <Text style={styles.emptyBtnText}>✨ Créer mon premier mème</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Rendu principal ───────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Ma Galerie</Text>
          {gallery.length > 0 && (
            <Text style={styles.headerCount}>{gallery.length} mème{gallery.length > 1 ? 's' : ''}</Text>
          )}
        </View>
        {gallery.length > 0 ? (
          <TouchableOpacity onPress={clearAll} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>🗑️</Text>
          </TouchableOpacity>
        ) : (
          <View style={{width: 40}} />
        )}
      </View>

      {/* Conseil appui long */}
      {gallery.length > 0 && (
        <Text style={styles.hint}>Appui long sur un mème pour le supprimer</Text>
      )}

      {/* Contenu */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
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

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  backBtn: {padding: 8},
  backIcon: {fontSize: 22, color: '#FF6B35'},
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  clearBtn: {padding: 8},
  clearBtnText: {fontSize: 22},
  hint: {
    textAlign: 'center',
    color: '#444',
    fontSize: 11,
    marginTop: 8,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  // ── Carte ──
  card: {
    width: CARD_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: CARD_SIZE,
  },
  cardPlaceholder: {
    width: '100%',
    height: CARD_SIZE,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPlaceholderEmoji: {fontSize: 48},
  cardOverlay: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 8,
  },
  cardSourceEmoji: {fontSize: 14, marginBottom: 2},
  cardPunchline: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardDate: {
    color: '#555',
    fontSize: 10,
  },
  // ── État vide ──
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyEmoji: {fontSize: 64, marginBottom: 16},
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyBtn: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default GalleryScreen;
