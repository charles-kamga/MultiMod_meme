# Projet AFROMEME — Générateur de Memes Multimodal

**AFROMEME** est une application mobile de génération de mèmes par intelligence artificielle, développée dans le cadre du cours **ICT202 — Programmation Mobile** (Groupe 8, G2).

L'application permet de créer des mèmes humoristiques à partir de **trois modes de saisie** : texte (Context Reader), voix (Voice-to-Meme) et image (Status Remixer). Le tout est habillé d'une interface utilisateur "Afro-UX" aux couleurs chaleureuses inspirées des cultures d'Afrique de l'Ouest.

---

## Fonctionnalités

- **Context Reader (Analyseur de Ndoki)** : Saisis ou colle une discussion, choisis un mood (Clash, Ndolo, Nyanga, Sarcasme) et laisse l'IA générer un mème avec une punchline et une image originale.
- **Voice-to-Meme (La Voix du Kwatt)** : Enregistre un message vocal, écoute-le, puis envoie-le à l'IA qui le transcrit et génère un mème adapté.
- **Status Remixer (Remix de Statut)** : Prends une photo (galerie ou caméra), ajoute une expression camerounaise optionnelle, et l'IA remixe l'image en mème personnalisé (avec face-swap InstantID).
- **Galerie locale** : Tous les mèmes générés sont automatiquement sauvegardés dans une galerie locale (AsyncStorage) avec possibilité de suppression individuelle ou totale.
- **Partage & Export** : Partage tes mèmes via les applications systèmes ou exporte-les en tant que sticker WhatsApp.
- **Authentification Firebase** : Connexion email/mot de passe ou Google Sign-In.

---

## Architecture Technique

```
┌─────────────────────────────────────────────────────────┐
│                    APPLICATION MOBILE                    │
│              React Native CLI (TypeScript)               │
│                                                          │
│  Screens : Home / Context / Voice / Remixer / Result     │
│  Services : API Client (Axios) / Firebase Auth           │
│  Storage : AsyncStorage (galerie locale)                 │
│  Permissions : Microphone, Stockage, Caméra              │
└──────────────────┬──────────────────────────────────────┘
                   │ Requêtes HTTP (JSON / FormData)
                   ▼
┌─────────────────────────────────────────────────────────┐
│                  API GATEWAY (Express.js)                 │
│                                                          │
│  Middleware : CORS, Multer (upload fichiers)             │
│  Routes POST /api/context/text                          │
│         POST /api/context/audio                         │
│         GET  /api/health                                │
│                                                          │
│  Services externes :                                     │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐         │
│  │  Gemini  │  │  Fal.ai   │  │  Cloudinary  │         │
│  │ (Google) │  │(Flux/ID)  │  │ (Hébergement)│         │
│  └──────────┘  └───────────┘  └──────────────┘         │
│                                                          │
│  Persistance : Firebase Firestore (historique)           │
└─────────────────────────────────────────────────────────┘
```

### Stack utilisée

| Composant      | Technologie                                                |
|----------------|------------------------------------------------------------|
| Frontend       | React Native CLI 0.86 (TypeScript)                         |
| Navigation     | React Navigation (Native Stack + Bottom Tabs)              |
| Authentification | Firebase Authentication (email + Google)                  |
| Client HTTP    | Axios + Fetch (fallback audio)                             |
| Backend        | Node.js / Express 5                                       |
| Upload fichiers | Multer (stockage mémoire)                                 |
| IA (Texte)     | Google Gemini (modèles Flash / Pro avec fallback)          |
| IA (Image)     | Fal.ai — Flux Schnell (texte→image) / InstantID (face-swap) |
| Hébergement média | Cloudinary                                              |
| Base de données | Firebase Firestore                                         |

---

## Prérequis

Avant de commencer, assure-toi d'avoir installé sur ta machine :

- **Node.js** v22.11.0 ou supérieure (recommandé)
- **npm** ou **yarn**
- **Android Studio** (avec SDK Android, émulateur AVD)
- **Java JDK 17** (requis par React Native CLI)
- **Git**

Pour le développement mobile, configure les variables d'environnement Android (`ANDROID_HOME`, `platform-tools`).

---

## Installation et Lancement

### 1. Cloner le dépôt

```bash
git clone <url-du-depot>
cd MultimodalMemeApp
```

### 2. Backend — API Gateway

Le backend se trouve dans le dossier `meme_clean/meme_project/`.

```bash
cd meme_clean/meme_project
npm install
```

Crée le fichier `.env` à la racine du dossier backend (voir section Configuration).

Pour lancer le serveur en développement :

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000` (ou le port défini dans `.env`).

### 3. Frontend — Application Mobile

```bash
# Depuis la racine du projet
npm install
```

Configure l'URL de l'API dans `src/services/api.ts` :

```typescript
// Pour l'émulateur Android (ne pas utiliser localhost)
baseURL: 'http://10.0.2.2:5000/api'

// Pour un téléphone physique sur le même réseau Wi-Fi
baseURL: 'http://192.168.x.x:5000/api'  // Remplace par l'IP locale du serveur
```

Lance l'application sur l'émulateur ou un appareil physique :

```bash
npx react-native run-android
```

---

## Configuration des Variables d'Environnement

Crée un fichier `.env` dans le dossier `meme_clean/meme_project/` avec les variables suivantes :

| Variable                  | Description                                      | Obligatoire |
|---------------------------|--------------------------------------------------|-------------|
| `PORT`                    | Port du serveur (défaut : 5000)                  | Non         |
| `GEMINI_API_KEY`          | Clé d'API Google Gemini                          | Oui         |
| `FAL_KEY`                 | Clé d'API Fal.ai (format : `key:id`)            | Oui         |
| `CLOUDINARY_CLOUD_NAME`   | Nom du cloud Cloudinary                          | Oui         |
| `CLOUDINARY_API_KEY`      | Clé d'API Cloudinary                             | Oui         |
| `CLOUDINARY_API_SECRET`   | Secret d'API Cloudinary                          | Oui         |

**Fichier `.env` d'exemple :**

```env
PORT=5000
GEMINI_API_KEY=ta_cle_gemini_ici
FAL_KEY=ta_cle_fal_ici
CLOUDINARY_CLOUD_NAME=ton_cloud_name
CLOUDINARY_API_KEY=ton_api_key
CLOUDINARY_API_SECRET=ton_api_secret
```

### Où obtenir les clés ?

| Service    | URL d'inscription                                         |
|------------|-----------------------------------------------------------|
| Google AI (Gemini) | https://aistudio.google.com/app/apikey              |
| Fal.ai     | https://fal.ai/dashboard                                   |
| Cloudinary | https://cloudinary.com/console                             |

### Fichier Firebase Service Account

Place également le fichier `firebase-service-account.json` (téléchargeable depuis la console Firebase → Paramètres du projet → Comptes de service → Générer une nouvelle clé privée) dans le dossier `meme_clean/meme_project/`.

---

## Structure du Projet

```
MultimodalMemeApp/
├── App.tsx                          # Point d'entrée React Native
├── src/
│   ├── screens/                     # Écrans de l'application
│   │   ├── HomeScreen.tsx           # Tableau de bord
│   │   ├── LoginScreen.tsx          # Connexion
│   │   ├── RegisterScreen.tsx       # Inscription
│   │   ├── ContextScreen.tsx        # Analyse de texte
│   │   ├── VoiceScreen.tsx          # Enregistrement vocal
│   │   ├── RemixerScreen.tsx        # Remix d'image
│   │   ├── MemeResultScreen.tsx     # Résultat du mème
│   │   ├── GalleryScreen.tsx        # Galerie locale
│   │   └── ProfileScreen.tsx        # Profil utilisateur
│   ├── components/
│   │   └── SharedComponents.tsx      # Design system (AfroButton, Header, MoodChip...)
│   ├── navigation/
│   │   ├── AppNavigator.tsx         # Navigation stack + tabs
│   │   └── types.ts                 # Types TypeScript pour les routes
│   ├── services/
│   │   ├── api.ts                   # Client HTTP (Axios) pour l'API Gateway
│   │   └── authService.ts           # Service Firebase Auth
│   ├── theme/
│   │   └── colors.ts                # Tokens de design (couleurs, espacement, typo)
│   └── utils/
│       └── permissions.ts           # Gestion des permissions Android
│
├── meme_clean/meme_project/         # Backend Express.js
│   ├── server.js                    # API Gateway
│   ├── package.json
│   ├── .env                         # Variables d'environnement (clés API)
│   └── firebase-service-account.json
│
└── README.md                        # Ce fichier
```

---

## Sécurité

- Les clés d'API ne sont **jamais** commitées dans le dépôt (présentes uniquement dans `.env`, ignoré par `.gitignore`).
- Le fichier `firebase-service-account.json` est également ignoré par Git.
- Toutes les requêtes entre le mobile et l'API Gateway transitent via HTTP(S) avec validation côté serveur.
- Multer limite le nombre d'images téléchargées (max 3) pour éviter les abus.
