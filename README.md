# MultiMod Meme - ICT202

Application mobile React Native CLI pour generer des memes intelligents et multimodaux a partir de texte, voix ou image.

## Objectif

Le projet cree un generateur de memes capable de lire le contexte d'une situation, de l'envoyer a une API Gateway Express.js, puis de recuperer une punchline ou un visuel pret a partager.

Regle de securite: le mobile ne doit jamais appeler Google Gemini directement. Tous les appels IA passent par le backend Express afin de proteger les cles API.

## Stack

- Frontend: React Native CLI, TypeScript, React Navigation.
- Backend attendu: Node.js, Express.js.
- IA: Google Gemini 1.5 Flash via le backend.
- Upload fichiers: Multer cote backend pour audio et image.
- Stockage local mobile: AsyncStorage pour la galerie.

## Modules

- Context Reader: envoie un texte vers `POST /api/generate/context`.
- Voice-to-Meme: envoie un fichier audio vers `POST /api/generate/voice`.
- Status Remixer: envoie une image vers `POST /api/generate/remix`.
- Galerie: sauvegarde locale des resultats generes.
- Partage: partage general et WhatsApp via `react-native-share`.

## Theme

La refonte visuelle utilise un theme vert:

- Primaire: `#0F7B3A`
- Secondaire: `#16463A`
- Fond: `#F3F8EF`
- Accent: `#E3A72F`

## Backend

L'URL mobile par defaut est:

```ts
http://10.0.2.2:5000/api
```

Sur emulateur Android, `10.0.2.2` pointe vers le `localhost` de la machine. Sur telephone physique, remplacez cette adresse dans `src/services/api.ts` par l'IP locale du PC qui lance Express.

Endpoints attendus:

```txt
GET  /api/health
POST /api/generate/context
POST /api/generate/voice
POST /api/generate/remix
```

## Installation

```bash
npm install
```

## Lancement en developpement

```bash
npm start
npm run android
```

## Generation APK

```bash
cd android
./gradlew assembleRelease
```

APK attendu:

```txt
android/app/build/outputs/apk/release/app-release.apk
```

## Verification

```bash
npx tsc --noEmit
npm run lint
```
