/**
 * Tâche 2 : Studio & Dashboard
 * Développeuse : Serena(Numero 85)
 * 
 * DESCRIPTION :
 * Ce module est le point d'entrée "Studio". Il permet de naviguer vers :
 * - Le Context Reader (Ryan)
 * - Le Voice-to-Meme (Samuel)
 * - Le Status Remixer (Yann)
 * 
 * J'ai utilisé une FlatList pour le carrousel afin de respecter l'objectif 
 * technique de fluidité demandé dans le cahier des charges.
 */

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
  StatusBar
} from 'react-native';

// On utilise les couleurs du thème défini par Klod (Tâche 1)
import { COLORS } from '../theme/colors'; 

const { width } = Dimensions.get('window');

// Originalité : Contenu localisé (Le "Kwatt" Spirit)
const INTRO_CAROUSEL = [
  { id: '1', title: 'Le Jimpat de l\'IA 🧙‍♂️', text: 'Transforme tes bad clashs WhatsApp en memes légendaires.', color: '#128C7E' },
  { id: '2', title: 'Mode VOUP VAP 📸', text: 'take ton mola en photo et Ndem l\'IA gérer la punchline.', color: '#075E54' },
];

const HomeScreen = ({ navigation }: any) => {

  // Rendu des cartes du carrousel
  const renderTip = ({ item }: any) => (
    <View style={[styles.tipCard, { backgroundColor: item.color }]}>
      <Text style={styles.tipTitle}>{item.title}</Text>
      <Text style={styles.tipText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header : Accueil personnalisé */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greet}>Meme Studio</Text>
            <Text style={styles.appName}>AFROMEME 🇨🇲</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileInitial}>S</Text>
          </TouchableOpacity>
        </View>

        {/* Carrousel d'astuces (Objectif technique Tâche 2) */}
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

        {/* Grille des modules multimodaux */}
        <View style={styles.studioGrid}>
          <Text style={styles.sectionTitle}>LABO DE CRÉATION</Text>
          
          <View style={styles.gridRow}>
            {/* Bouton vers Tâche 3 : Ryan */}
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => navigation.navigate('Context')}
            >
              <Text style={styles.cardIcon}>✍️</Text>
              <Text style={styles.cardTitle}>Context Reader</Text>
              <Text style={styles.cardSub}>Texte & Clashs</Text>
            </TouchableOpacity>

            {/* Bouton vers Tâche 4 : Samuel */}
            <TouchableOpacity 
              style={[styles.card, styles.cardAudio]} 
              onPress={() => navigation.navigate('Voice')}
            >
              <Text style={styles.cardIcon}>🎙️</Text>
              <Text style={styles.cardTitle}>Voice-to-Meme</Text>
              <Text style={styles.cardSub}>Punchlines vocales</Text>
            </TouchableOpacity>
          </View>

          {/* Bouton vers Tâche 5 : Yann (Largeur totale) */}
          <TouchableOpacity 
            style={[styles.card, styles.cardFull]} 
            onPress={() => navigation.navigate('Remixer')}
          >
            <View style={styles.cardFullContent}>
              <Text style={styles.cardIcon}>🖼️</Text>
              <View style={{marginLeft: 15}}>
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
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20 
  },
  greet: { fontSize: 14, color: '#AAA', fontWeight: '500' },
  appName: { fontSize: 24, fontWeight: '900', color: '#1A1A1A' },
  profileBtn: { 
    width: 45, height: 45, borderRadius: 25, 
    backgroundColor: '#F0F2F5', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#EEE'
  },
  profileInitial: { fontWeight: 'bold', color: '#075E54' },
  
  carouselSection: { marginVertical: 10 },
  tipCard: { 
    width: width - 40, marginHorizontal: 20, 
    borderRadius: 20, padding: 25, minHeight: 130, justifyContent: 'center' 
  },
  tipTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
  tipText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 20 },

  studioGrid: { padding: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#CCC', marginBottom: 15, letterSpacing: 1 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  card: { 
    backgroundColor: '#F8F9FA', width: '48%', padding: 20, 
    borderRadius: 20, borderWidth: 1, borderColor: '#F0F0F0' 
  },
  cardAudio: { backgroundColor: '#FFF9F2', borderColor: '#FFEAD2' },
  cardFull: { width: '100%', backgroundColor: '#F2F6FF', borderColor: '#DCE7FF' },
  cardFullContent: { flexDirection: 'row', alignItems: 'center' },
  cardIcon: { fontSize: 32, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSub: { fontSize: 12, color: '#888', marginTop: 2 },
  
  footer: { padding: 30, alignItems: 'center' },
  footerText: { fontSize: 11, color: '#DDD' }
});

export default HomeScreen;