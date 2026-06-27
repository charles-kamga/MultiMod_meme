# 📱 Multimodal Meme App - Frontend Mobile (React Native CLI)

Bienvenue sur le dépôt du client mobile de notre **Générateur de Memes Multimodal**[cite: 1]. Cette application est développée en **React Native CLI (TypeScript)** et est optimisée pour **Android**[cite: 1].

Elle intègre une interface utilisateur moderne inspirée de la culture et du design africain (Afro-UX Chaleureux) et communique exclusivement avec notre API Gateway Express.js pour transformer les textes, audios et images en mèmes cultes du kwatt.

---

## 🎨 Charte Graphique (Afro-UX Modern)

Pour assurer la cohérence visuelle pendant le développement des écrans, respectez la palette de couleurs mutes et chaleureuses :
* **Background Global** : `#FAF6F0` (Ivoire / Crème doux)
* **Couleur Primaire** : `#C84B31` (Terracotta / Terre Cuite)
* **Couleur Secondaire** : `#1B4232` (Vert Forêt Tropicale)
* **Accents** : `#F4A261` (Ocre Jaune / Or Chaud)
* **Textes / Titres** : `#1A1A1A` (Charbon Profond)

---

## 📁 Structure du Code Source (`/src`)

Le projet est modularisé pour permettre à plusieurs développeurs de travailler simultanément sans créer de conflits Git :

```text
src/
├── components/       # Composants d'UI réutilisables (Boutons, Cartes, Loaders)
├── screens/          # Écrans principaux de l'application (Architecture Core)
│   ├── HomeScreen.tsx         # Dashboard d'accueil et choix du canal
│   ├── ContextScreen.tsx      # Module Texte (Context Reader)
│   ├── VoiceScreen.tsx        # Module Audio (Voice-to-Meme)
│   ├── RemixerScreen.tsx      # Module Image (Status Remixer)
│   └── MemeResultScreen.tsx   # Écran de rendu du mème finalisé et partage
├── navigation/       # Configuration des flux de navigation (React Navigation Stack)
├── services/         # Client API (Configuration d'Axios pour les requêtes vers le serveur)
├── hooks/            # Hooks personnalisés (Gestion des permissions, Enregistreur Audio)
└── utils/            # Fonctions d'aide (Formatage, constantes de style)
```

---

## 🛠️ Configuration et Lancement (Émulateur ou Téléphone Physique)

### 🧱 Prérequis

* Node.js (Version 18 ou supérieure recommandée)
* Android Studio installé et configuré avec un émulateur Android (AVD).
* Variables d'environnement ANDROID_HOME et outils SDK configurés dans votre système.

### 1. Installation des Dépendances

À la racine du dossier frontend, exécutez la commande suivante pour installer les packages requis :

```bash
npm install
```

### 2. Liaison avec le Serveur Backend Express.js

Pour que l'application mobile puisse communiquer avec l'API, vous devez configurer l'adresse IP cible.

Ouvrez le fichier de configuration de vos services d'API (généralement situé dans `src/services/api.ts`).

Configurez l'URL de base pour pointer vers le serveur de développement.

⚠️ **Note Critique pour l'Émulateur Android** : N'utilisez pas `localhost` ou `127.0.0.1` car l'émulateur Android possède sa propre boucle locale virtuelle. Utilisez l'adresse IP de redirection d'Android Studio :

```typescript
export const BASE_URL = "http://10.0.2.2:5000/api";
```

> Si vous testez sur un **téléphone physique**, remplacez `10.0.2.2` par l'adresse IP locale de la machine qui héberge le serveur Express (ex: `http://192.168.1.50:5000/api`), et assurez-vous que le téléphone et le PC partagent le même réseau Wi-Fi.

### 3. Exécution de l'Application

1. Démarrez votre émulateur Android ou connectez votre smartphone physique en mode débogage USB.
2. Lancez le serveur de bundle (Metro Bundler) et déployez l'application sur votre appareil :

```bash
npx react-native run-android
```

---

## 🔒 Gestion des Permissions Android

L'application exploite deux capteurs matériels stratégiques. Le code intègre des vérifications asynchrones via `PermissionsAndroid` pour :

* **Le Microphone (RECORD_AUDIO)** : Requis pour capturer les notes vocales du module Voice-to-Meme[cite: 1, 2].
* **Le Stockage / La Galerie (READ_EXTERNAL_STORAGE / READ_MEDIA_IMAGES)** : Requis pour sélectionner les images du module Status Remixer[cite: 1, 2].
