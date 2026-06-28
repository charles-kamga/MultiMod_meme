# UI Audit Report — MultimodalMemeApp

> Audit technique des styles et de la structure visuelle de chaque écran.

---

## Table des matières

1. [Design System Global (`theme/colors.ts`)](#1-design-system-global)
2. [LoginScreen & RegisterScreen](#2-loginscreen--registerscreen)
3. [HomeScreen (Dashboard)](#3-homescreen-dashboard)
4. [ContextScreen, VoiceScreen & RemixerScreen](#4-contextscreen-voicescreen--remixerscreen)
5. [MemeResultScreen](#5-memeresultscreen)
6. [ProfileScreen & GalleryScreen](#6-profilescreen--galleryscreen)

---

## 1. Design System Global

**Fichier :** `src/theme/colors.ts`

### Tokens Couleur

| Token | Hex | Usage |
|---|---|---|
| `background` | `#FAF6F0` | Fond principal app |
| `surface` | `#FCFCF8` | Surface neutre |
| `surfaceContainerLow` | `#F6F3F2` | Cartes / formulaires |
| `surfaceContainerHigh` | `#EAE7E7` | Bordures champs |
| `surfaceContainerHighest` | `#E5E2E1` | Bordures champs |
| `white` | `#FFFFFF` | Input bg, cartes |
| `primary` | `#C84B31` | Terracotta — actions principales |
| `primaryDark` | `#A6331B` | Variante foncée |
| `secondary` | `#1B4232` | Vert forêt |
| `secondaryMid` | `#3F6654` | Accents info |
| `secondaryContainer` | `#C1ECD5` | Info cards bg |
| `accent` | `#F4A261` | Warm gold |
| `tertiary` | `#8A4B10` | Brun |
| `tertiaryContainer` | `#A86328` | Bouton Photo |
| `textMain` | `#1C1B1B` | Titres, corps |
| `textSecondary` | `#64748B` | Sous-titres |
| `onSurfaceVariant` | `#58413C` | Labels, icônes secondaires |
| `outline` | `#8C716B` | Placeholders |
| `outlineVariant` | `#E0BFB9` | Bordures sociales, diviseurs |
| `error` | `#BA1A1A` | Erreur |

### Élévation

| Niveau | shadowColor | offset | opacity | radius | elevation (Android) |
|---|---|---|---|---|---|
| `level1` | `#C84B31` | `{0,4}` | 0.05 | 12 | 3 |
| `level2` | `#1A1A1A` | `{0,8}` | 0.1 | 24 | 6 |

### Typographie

| Token | fontSize | fontWeight | lineHeight | letterSpacing |
|---|---|---|---|---|
| `headlineLg` | 32 | 700 | 40 | — |
| `headlineLgMobile` | 28 | 700 | 34 | — |
| `headlineMd` | 24 | 600 | 32 | — |
| `bodyLg` | 18 | 400 | 28 | — |
| `bodyMd` | 16 | 400 | 24 | — |
| `labelLg` | 14 | 600 | 20 | 0.5 |
| `labelSm` | 12 | 500 | 16 | — |
| `displayLg` | 40 | 700 | 48 | -1 |

### Rayons de bordure

| Token | Value |
|---|---|
| `RADII.sm` | 8 |
| `RADII.md` | 16 |
| `RADII.lg` | 24 |
| `RADII.xl` | 32 |
| `RADII.full` | 9999 |

### Spacing

| Token | Value |
|---|---|
| `base` | 4 |
| `xs` | 8 |
| `sm` | 16 |
| `md` | 24 |
| `lg` | 32 |
| `xl` | 48 |
| `marginHorizontal` | 20 |
| `gutter` | 12 |

---

## 2. LoginScreen & RegisterScreen

**Fichiers :** `src/screens/LoginScreen.tsx`, `src/screens/RegisterScreen.tsx`

### Layout & Containers

| Composant | Parent | Utilisation |
|---|---|---|
| `SafeAreaView` | — | Conteneur racine, `flex: 1`, bg `COLORS.background` |
| `KeyboardAvoidingView` | SafeAreaView | Comportement `padding` (iOS) / `height` (Android) |
| `ScrollView` | KeyboardAvoidingView | `flexGrow: 1`, `justifyContent: center`, paddingHorizontal `SPACING.md` (24), paddingVertical `SPACING.xl` (48) |
| `View.formCard` | ScrollView | Carte blanche `surfaceContainerLow`, borderRadius `RADII.xl` (32), padding `SPACING.md` (24), élévation `level1` |

### Colors (via tokens)

| Élément | Token | Hex |
|---|---|---|
| Fond écran | `COLORS.background` | `#FAF6F0` |
| Carte formulaire | `COLORS.surfaceContainerLow` | `#F6F3F2` |
| Input background | `COLORS.white` | `#FFFFFF` |
| Logo | `COLORS.primary` | `#C84B31` |
| Texte titre | `COLORS.textMain` | `#1C1B1B` |
| Texte sous-titre | `COLORS.textSecondary` | `#64748B` |
| Labels input | `COLORS.onSurfaceVariant` | `#58413C` |
| Placeholders | `COLORS.outline` | `#8C716B` |
| Bordure input | `COLORS.surfaceContainerHighest` | `#E5E2E1` |
| Bouton social border | `COLORS.outlineVariant` | `#E0BFB9` |
| Lien "S'inscrire" | `COLORS.primary` | `#C84B31` |
| Divider text | `COLORS.textSecondary` | `#64748B` |
| Divider line | `COLORS.outlineVariant` | `#E0BFB9` |

### Typography

| Élément | Token | fontSize | fontWeight | color |
|---|---|---|---|---|
| Titre "Bienvenue au Kwatt" | `FONTS.headlineLg` | 32 | 700 | `#1C1B1B` |
| Sous-titre descriptif | `FONTS.bodyMd` | 16 | 400 | `#64748B` |
| Label champ (Email, MDP) | `FONTS.labelSm` | 12 | 500 | `#58413C` |
| Texte input saisi | inline fontSize | 16 | 400 | `#1C1B1B` |
| Texte bouton social | `FONTS.labelLg` | 14 | 600 | `#1C1B1B` |
| Texte "OU" | `FONTS.labelSm` | 12 | 500 | `#64748B` |
| "Mot de passe oublié ?" | `FONTS.labelSm` | 12 | 500 | `#C84B31` |
| "Pas encore de compte ?" | `FONTS.bodyMd` | 16 | 400 | `#64748B` |
| Lien "S'inscrire" | `FONTS.labelLg` | 14 | 600 | `#C84B31` |

### Boutons & Interactive Elements

| Bouton | height | borderRadius | bg color | border | shadow | icon spacing |
|---|---|---|---|---|---|---|
| Social (Google) | 52 | `RADII.full` (9999) | `#FFFFFF` | 1.5px solid `#E0BFB9` | none | marginRight `SPACING.xs` (8) |
| `AfroButton` (connecter) | 56 | `RADII.lg` (24) | `COLORS.primary` | — | `ELEVATION.level1` | — |
| Lien (inscription) | — | — | transparent | — | — | — |

### Text Inputs

| Propriété | Valeur |
|---|---|
| Background | `COLORS.white` = `#FFFFFF` |
| Border radius | `RADII.md` = 16 |
| Border | 1px solid `COLORS.surfaceContainerHighest` = `#E5E2E1` |
| Hauteur | 52 |
| Font size | 16 |
| Text color | `COLORS.textMain` = `#1C1B1B` |
| Padding horizontal | `SPACING.sm` = 16 |
| Placeholder color | `COLORS.outline` = `#8C716B` |
| Icône œil (MDP) | absolute right `SPACING.sm` (16), vertical centré, icon size 20 |

---

## 3. HomeScreen (Dashboard)

**Fichier :** `src/screens/HomeScreen.tsx`

### Layout & Containers

| Composant | Utilisation |
|---|---|
| `SafeAreaView` | Racine, `flex: 1`, bg `#FFF` |
| `ScrollView` | Contenu scrollable |
| `FlatList` | Carrousel horizontal, `pagingEnabled` |
| `View.studioGrid` | Padding 20, contient les cartes |

### Colors — **Attention : le thème est importé mais INUTILISÉ**, les couleurs sont hardcodées

| Élément | Hex |
|---|---|
| Fond écran | `#FFF` |
| Texte "Meme Studio" | `#AAA` |
| Texte "AFROMEME" | `#1A1A1A` |
| Bouton profil bg | `#F0F2F5` |
| Bordure profil | `#EEE` |
| Initiale profil | `#075E54` |
| Cartes carrousel (bg) | `#128C7E` / `#075E54` |
| Texte carrousel titre | `#FFF` |
| Texte carrousel body | `rgba(255,255,255,0.85)` |
| Section title "LABO" | `#CCC` |
| Cartes studio bg | `#F8F9FA` |
| Bordure cartes studio | `#F0F0F0` |
| Carte Audio bg | `#FFF9F2` |
| Carte Audio border | `#FFEAD2` |
| Carte Full bg | `#F2F6FF` |
| Carte Full border | `#DCE7FF` |
| Titres cartes | `#333` |
| Sous-titres cartes | `#888` |
| Icônes cartes | `#333` |
| Footer | `#DDD` |

### Typography

| Élément | fontSize | fontWeight | color |
|---|---|---|---|
| "Meme Studio" (greet) | 14 | 500 | `#AAA` |
| "AFROMEME" (appName) | 24 | 900 | `#1A1A1A` |
| Titre carrousel | 18 | bold | `#FFF` |
| Texte carrousel | 14 | normal | `rgba(255,255,255,0.85)` |
| Section title "LABO" | 12 | 800 | `#CCC` |
| Titre carte | 16 | bold | `#333` |
| Sous-titre carte | 12 | normal | `#888` |
| Footer | 11 | normal | `#DDD` |

### Boutons & Interactive Elements

| Bouton | height / width | borderRadius | bg | border | shadow |
|---|---|---|---|---|---|
| Profil (rond) | 45×45 | 25 | `#F0F2F5` | 1px `#EEE` | none |
| Carte studio | min-height variable | 20 | `#F8F9FA` | 1px `#F0F0F0` | none |
| Carte Audio | min-height variable | 20 | `#FFF9F2` | 1px `#FFEAD2` | none |
| Carte Full | min-height variable | 20 | `#F2F6FF` | 1px `#DCE7FF` | none |

### Text Inputs — Aucun

---

## 4. ContextScreen, VoiceScreen & RemixerScreen

**Fichiers :** `ContextScreen.tsx`, `VoiceScreen.tsx`, `RemixerScreen.tsx`

### Layout & Containers — Commun

| Composant | Usage |
|---|---|
| `SafeAreaView` | Racine, `flex: 1`, bg `COLORS.background` (`#FAF6F0`) |
| `ScrollView` | Contenu (Context, Remixer) |
| `Header` (shared) | Titre + bouton retour + avatar optionnel |

### Colors (via tokens — cohérent entre les 3)

| Élément | Token | Hex |
|---|---|---|
| Fond écran | `COLORS.background` | `#FAF6F0` |
| TextArea / Input bg | `COLORS.white` | `#FFFFFF` |
| TextArea border (Context) | `COLORS.outlineVariant` | `#E0BFB9` — dashed |
| Input borders | `COLORS.surfaceContainerHighest` | `#E5E2E1` |
| Mood section label | `COLORS.onSurfaceVariant` | `#58413C` |
| Info card bg | `COLORS.secondaryContainer` | `#C1ECD5` |
| Info card text | `COLORS.onSecondaryContainer` | `#456C5A` |
| Mic button (ready) | `COLORS.secondary` | `#1B4232` |
| Mic button (recording) | `COLORS.primary` | `#C84B31` |
| Pulse rings | `COLORS.secondary` | `#1B4232` |
| Audio player bg | `COLORS.surfaceContainerHighest` | `#E5E2E1` |
| Play button bg | `COLORS.primary` | `#C84B31` |
| Progress bar bg | `COLORS.outlineVariant` | `#E0BFB9` |
| Progress fill | `COLORS.primary` | `#C84B31` |
| Media buttons | `COLORS.secondary` / `COLORS.tertiaryContainer` | `#1B4232` / `#A86328` |
| Tip card bg | `COLORS.secondaryContainer` | `#C1ECD5` |
| Preview zone (empty) | `COLORS.primaryFixed` | `#FFDAD3` |
| Empty icon circle | `COLORS.tertiaryFixed` | `#FFDCFF` (var) |

### Typography

| Élément | Token | fontSize | fontWeight | color |
|---|---|---|---|---|
| Mood label | `FONTS.labelLg` | 14 | 600 | `#58413C` |
| Info text | `FONTS.bodyMd` | 16 | 400 | `#456C5A` |
| Loading text | `FONTS.labelLg` | 14 | 600 | `#C84B31` |
| Timer display (Voice) | `FONTS.labelLg` | 18 (overridden) | 600 | `#58413C` |
| Transcription text | `FONTS.labelLg` | 14 | 600 | `#58413C` |
| Hint text (Voice) | `FONTS.bodyMd` | 16 | 400 | `#58413C` |
| Expression label | `FONTS.labelLg` | 14 | 600 | `#58413C` |
| Empty preview text | `FONTS.bodyMd` | 16 | 400 | `#58413C` |
| Tip title (Remix) | `FONTS.labelLg` | 14 | 600 | `#3F6654` |
| Tip body | `FONTS.bodyMd` | 16 | 400 | `#456C5A` |
| Char count (Context) | `FONTS.labelSm` | 12 | 500 | `#64748B` |
| Submitting text | `FONTS.labelLg` | 14 | 600 | `#C84B31` |

### Boutons & Interactive Elements

| Bouton | height | borderRadius | bg | border | shadow | icon |
|---|---|---|---|---|---|---|
| Header back | 44×44 | 22 (round) | `COLORS.surfaceContainer` | — | — | ← text |
| `AfroButton` (main) | 56 | `RADII.lg` (24) | `COLORS.primary` | — | `ELEVATION.level1` | — |
| Mood chip (selected) | minHeight 80 | `RADII.lg` (24) | color variable | — | `ELEVATION.level1` | emoji (18px) |
| Mood chip (unselected) | minHeight 80 | `RADII.lg` (24) | `#FFFFFF` | 1px `#E0BFB9` | — | emoji (18px) |
| Microphone (Voice) | 180×180 | 90 (round) | `#1B4232` / `#C84B31` | — | `ELEVATION.level2` | mic/stop 56px |
| Play button (Voice) | 48×48 | 24 (round) | `#C84B31` | — | `ELEVATION.level1` | play/pause 20px |
| Trash button | — | — | — | — | — | 22px |
| Media button (Galerie) | 48 | `RADII.md` (16) | `#1B4232` | — | `ELEVATION.level1` | 18px + 8px spacing |
| Media button (Photo) | 48 | `RADII.md` (16) | `#A86328` | — | `ELEVATION.level1` | 18px + 8px spacing |
| Remove image × | 36×36 | 18 (round) | `rgba(0,0,0,0.6)` | — | — | texte "✕" 16px |

### Text Inputs

| Élément | hauteur | bg | border | radius | fontSize | couleur texte | placeholder |
|---|---|---|---|---|---|---|---|
| TextArea (Context) | minHeight 200 | `#FFFFFF` | 1.5px dashed `#E0BFB9` | `RADII.lg` (24) | 16 | `#1C1B1B` | `#8C716B` |
| Expression (Remix) | 52 | `#FFFFFF` | 1px solid `#E5E2E1` | `RADII.lg` (24) | 16 | `#1C1B1B` | `#8C716B` |

---

## 5. MemeResultScreen

**Fichier :** `src/screens/MemeResultScreen.tsx`

### Layout & Containers

| Composant | Utilisation |
|---|---|
| `View.container` | Racine, `flex: 1`, bg `#0D0D0D` |
| `View.header` | Row, space-between, padding 16, pt 16/50 (Android/iOS), borderBottom 1px `#1E1E1E` |
| `ScrollView` | Contenu, paddingHorizontal 16, pb 40, `alignItems: center` |
| `ViewShot` | Capture le memeCard pour export |
| `View.memeCard` | Largeur 340, borderRadius 16, bg `#1A1A1A` |
| `View.actionsContainer` | mt 24, width 100%, gap 12 |

### Colors — **Tout en dur, aucun token utilisé**

| Élément | Hex |
|---|---|
| Fond écran | `#0D0D0D` |
| Header bg | `#0D0D0D` |
| Header border bottom | `#1E1E1E` |
| Texte header | `#FFFFFF` |
| Icônes header | `#FF6B35` |
| Source badge bg | `#1E1E1E` |
| Source badge border | `#FF6B35` |
| Source badge text | `#FF6B35` |
| Meme card bg | `#1A1A1A` |
| Placeholder image bg | `#1E1E1E` |
| Text overlay bg | `rgba(0,0,0,0.75)` |
| Meme text | `#FFFFFF` |
| Punchline box bg | `#1A1A1A` |
| Punchline left border | `#FF6B35` |
| Punchline text | `#CCCCCC` |
| Saved hint text | `#4CAF50` |
| Bouton Sticker bg | `#25D366` |
| Bouton Share bg | `#FF6B35` |
| Bouton Gallery bg | `#1E1E1E` |
| Bouton Gallery border | `#333` |
| Bouton New border | `#FF6B35` |

### Typography

| Élément | fontSize | fontWeight | color |
|---|---|---|---|
| Header title | 18 | 800 | `#FFFFFF` |
| Source badge | 12 | 700 | `#FF6B35` |
| Meme text (overlay) | 18 | 900 | `#FFFFFF` |
| Punchline text | 14 | italic | `#CCCCCC` |
| Saved hint | 12 | 600 | `#4CAF50` |
| Button text | 15 | 700 | `#FFFFFF` |

### Boutons & Interactive Elements

| Bouton | borderRadius | paddingVertical | bg | border | shadow |
|---|---|---|---|---|---|
| Header back | — (padding 8) | — | — | — | — |
| Header gallery | — (padding 8) | — | — | — | — |
| Exporter en sticker | 12 | 15 | `#25D366` | — | — |
| Partager via... | 12 | 15 | `#FF6B35` | — | — |
| Voir ma galerie | 12 | 15 | `#1E1E1E` | 1px `#333` | — |
| Créer nouveau | 12 | 15 | transparent | 1.5px `#FF6B35` | — |

### Text Inputs — Aucun

---

## 6. ProfileScreen & GalleryScreen

**Fichiers :** `ProfileScreen.tsx`, `GalleryScreen.tsx`

### ProfileScreen

#### Layout & Containers

| Composant | Utilisation |
|---|---|
| `ScrollView` | Racine, `flex: 1`, bg `#FAF6F0`, contentContainerStyle pb 30 |
| `View.headerContainer` | paddingHorizontal 24, pt 20, pb 10 |
| `View.avatarContainer` | `alignItems: center`, mt 20, mb 25 |
| `View.statsContainer` | bg `#FFFFFF`, borderRadius 20, mx 24, py 20 |
| `View.menuContainer` | bg `#FFFFFF`, borderRadius 20, mx 24, px 16 |

#### Colors — **Objet COLORS local, pas le theme/colors.ts**

| Token local | Hex | Usage |
|---|---|---|
| `primary` | `#C84B31` | Titre, logout text |
| `background` | `#FAF6F0` | Fond écran |
| `text` | `#1A1A1A` | Noms, body |
| `gray` | `#888888` | Sous-titres, icônes menu, labels |
| `cardBg` | `#FFFFFF` | Stats card, menu card |

#### Couleurs hardcodées supplémentaires

| Élément | Hex |
|---|---|
| Avatar bg | `#F3A953` |
| Avatar text | `#FFFFFF` |
| Stats shadow | `#000` |
| Menu border bottom | `#F5F5F5` |

#### Typography

| Élément | fontSize | fontWeight | color |
|---|---|---|---|
| Header "Mon Profil" | 28 | bold | `#C84B31` |
| Initiales | 36 | bold | `#FFFFFF` |
| Nom utilisateur | 22 | bold | `#1A1A1A` |
| Email sous-titre | 14 | normal | `#888888` |
| Stat number | 26 | bold | `#1A1A1A` |
| Stat label | 14 | normal | `#888888` |
| Menu item text | 16 | 500 | `#1A1A1A` |
| Logout text | 16 | bold | `#C84B31` |

#### Boutons & Interactive Elements

| Bouton | borderRadius | paddingVertical | bg | borderBottom | icône |
|---|---|---|---|---|---|
| Menu items | — | 16 | transparent | 1px `#F5F5F5` | 22px left, 16px chevron |

### GalleryScreen

#### Layout & Containers

| Composant | Utilisation |
|---|---|
| `View.container` | Racine, `flex: 1`, bg `#0D0D0D` |
| `View.header` | Row, space-between, px 16, pt 16/50, pb 12, borderBottom 1px `#1E1E1E` |
| `FlatList` | 2 colonnes, contentContainerStyle p 16 pb 40 |
| `EmptyState` | Centré, p 32 |

#### Colors — **Tout en dur**

| Élément | Hex |
|---|---|
| Fond écran | `#0D0D0D` |
| Header bg | — (transparent) |
| Header border bottom | `#1E1E1E` |
| Texte header "Ma Galerie" | `#FFFFFF` |
| Counter text | `#666` |
| Icône back/trash | `#FF6B35` |
| Hint text | `#444` |
| Card bg | `#1A1A1A` |
| Card placeholder bg | `#222` |
| Card overlay bg | `rgba(0,0,0,0.85)` |
| Card punchline | `#FFFFFF` |
| Card date | `#555` |
| Card shadow | `#000` |
| Empty title | `#FFFFFF` |
| Empty subtitle | `#666` |
| Empty btn bg | `#FF6B35` |
| Empty btn text | `#FFFFFF` |
| Icône vide | `#555` |

#### Typography

| Élément | fontSize | fontWeight | color |
|---|---|---|---|
| Header title | 20 | 800 | `#FFFFFF` |
| Header count | 12 | normal | `#666` |
| Hint | 11 | italic | `#444` |
| Card punchline | 11 | 700 | `#FFFFFF` |
| Card date | 10 | normal | `#555` |
| Empty title | 22 | 800 | `#FFFFFF` |
| Empty subtitle | 14 | normal | `#666` |
| Empty btn text | 15 | 700 | `#FFFFFF` |

#### Boutons & Interactive Elements

| Bouton | borderRadius | padding | bg | border |
|---|---|---|---|---|
| Header back | padding 8 | — | — | — |
| Header clear | padding 8 | — | — | — |
| Card (appui long → delete) | 12 | — | `#1A1A1A` | — |
| Empty btn | 12 | px 24, py 14 | `#FF6B35` | — |

#### Cards (FlatList items)

| Propriété | Valeur |
|---|---|
| Largeur | `(screenWidth - 48) / 2` |
| Border radius | 12 |
| Overflow | hidden |
| Elevation Android | 4 |
| shadowColor | `#000` |
| shadowOpacity | 0.4 |
| shadowRadius | 4 |

---

## Résumé des incohérences

1. **Deux systèmes de couleurs** — `theme/colors.ts` (utilisé par auth, input, voice, context, remixer) vs couleurs hardcodées (HomeScreen, MemeResultScreen, GalleryScreen, ProfileScreen)
2. **HomeScreen ignore le Design System** — importe `COLORS` mais ne l'utilise jamais (sauf peut-être pour un token inutilisé)
3. **Pas d'objets shadow partagés** — MemeResultScreen, GalleryScreen et ProfileScreen définissent leurs ombres manuellement avec des valeurs différentes
4. **Tailles de boutons divergentes** — `AfroButton` (56px) vs boutons Gallery/MemeResult (paddingVertical 14-15px)
5. **Typographie inconsistante** — FONTS tokens utilisés sur les écrans thématisés, tailles en dur sur les autres
6. **ProfileScreen réinvente COLORS** — définit son propre objet `COLORS` local au lieu d'importer le thème
