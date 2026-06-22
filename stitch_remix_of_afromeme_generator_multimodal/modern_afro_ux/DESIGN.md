---
name: Modern Afro-UX
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#58413c'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#8c716b'
  outline-variant: '#e0bfb9'
  surface-tint: '#aa361e'
  primary: '#a6331b'
  on-primary: '#ffffff'
  primary-container: '#c84b31'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a4'
  secondary: '#3f6654'
  on-secondary: '#ffffff'
  secondary-container: '#c1ecd5'
  on-secondary-container: '#456c5a'
  tertiary: '#8a4b10'
  on-tertiary: '#ffffff'
  tertiary-container: '#a86328'
  on-tertiary-container: '#fffafa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a4'
  on-primary-fixed: '#3e0500'
  on-primary-fixed-variant: '#891e07'
  secondary-fixed: '#c1ecd5'
  secondary-fixed-dim: '#a6d0ba'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#274e3d'
  tertiary-fixed: '#ffdcc4'
  tertiary-fixed-dim: '#ffb780'
  on-tertiary-fixed: '#2f1400'
  on-tertiary-fixed-variant: '#6f3800'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -1px
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.5px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  margin-horizontal: 20px
  gutter: 12px
---

## Brand & Style
The design system is rooted in a "Modern Afro-UX" aesthetic, blending the warmth of traditional West African earth tones with the precision of contemporary Afro-futurism. It is designed for a high-end, premium mobile experience that feels organic yet technologically advanced.

The style leverages **Minimalism** with a **Tactile** edge. It prioritizes expansive whitespace (using the Soft Ivory background) to let the vibrant Terracotta and Rainforest Green act as structural anchors. The emotional response should be one of "rooted sophistication"—feeling grounded in heritage while moving forward into a clean, digital future. Key visual motifs include organic curves, subtle grain textures reminiscent of fine pottery or textiles, and a rhythmic use of bold color blocks.

## Colors
The palette is inspired by natural pigments and lush landscapes. 
- **Primary (Terracotta):** Used for primary actions, critical branding elements, and active states. It represents the earth and energy.
- **Secondary (Rainforest Green):** Used for success states, navigation backgrounds, and deep-contrast elements. It provides a stabilizing, premium weight to the UI.
- **Accent (Warm Gold):** Reserved for highlights, badges, and "special" interactions (like premium features or ratings).
- **Background (Soft Ivory):** The canvas for the entire application, providing a warmer, more sophisticated feel than pure white, reducing eye strain and enhancing the "gourmet" feel.
- **Text (Deep Charcoal & Slate):** Charcoal is used for high-hierarchy headings to ensure legibility, while Slate Gray handles metadata and secondary descriptions.

## Typography
The typography strategy pairs the expressive, friendly nature of **Be Vietnam Pro** for headings with the clean, modern approachability of **Plus Jakarta Sans** for UI elements and body copy.

Headings should be set with tight letter-spacing to create a "locked-in," editorial look. Use `display-lg` sparingly for hero sections or onboarding. For Android-specific optimization, ensure `body-md` remains the standard for all readability-heavy sections to maintain accessibility.

## Layout & Spacing
This design system utilizes a **Fluid Grid** logic optimized for React Native. The layout is built on a 4px baseline grid to ensure vertical rhythm. 

- **Margins:** A standard 20px horizontal margin is applied to the main screen containers.
- **Rhythm:** Use `md` (24px) for spacing between unrelated sections and `sm` (16px) for elements within a logical group (e.g., card internal padding).
- **Reflow:** On wider Android tablets, content should be capped at a maximum width of 720px and centered to maintain the premium, focused feel of the Afro-UX narrative.

## Elevation & Depth
In this design system, depth is communicated through **Ambient Shadows** and **Tonal Layering**. Unlike the harsh shadows of early Material Design, these elevations are soft and slightly tinted with the Primary color to feel organic.

- **Low Elevation (Level 1):** Used for cards. Shadow: `offset: {width: 0, height: 4}, radius: 12, opacity: 0.05, color: #C84B31`.
- **High Elevation (Level 2):** Used for floating action buttons or active modals. Shadow: `offset: {width: 0, height: 8}, radius: 24, opacity: 0.1, color: #1A1A1A`.
- **Surface Layering:** Use the Ivory background as the base, with pure white (#FFFFFF) used for elevated card surfaces to create a subtle "lift" without heavy shadow usage.

## Shapes
The shape language is the core of the "Afro-UX" identity. It avoids sharp corners entirely in favor of **Pill-shaped** and hyper-rounded geometry. 

- **Standard Containers:** Apply a 24px radius to all main cards and buttons.
- **Small Elements:** Chips and small input fields should use a 12px or fully circular (pill) radius.
- **Organic Accents:** Use "squircle" masks for profile images or featured product thumbnails to evoke a handcrafted feel.

## Components

### Buttons
- **Primary:** Terracotta background, White text, 24px border-radius, minimum height of 56px for touch targets.
- **Secondary:** Rainforest Green background, White text.
- **Ghost:** Transparent background with a 1.5px Terracotta border.

### Cards
- Surfaces should be white (#FFFFFF) against the Ivory background.
- Padding: 20px internal.
- Border Radius: 24px.
- Use a subtle grain texture overlay (2% opacity) on featured cards to add tactile depth.

### Input Fields
- Background: A slightly darker shade of Ivory or very light gray.
- Border: 1px border that turns Terracotta on focus.
- Text: Deep Charcoal for input, Slate Gray for placeholders.

### Chips & Tags
- Used for categories. 
- Background: Secondary (Rainforest Green) at 10% opacity with solid Green text, or Gold at 10% for "Premium" tags.
- Fully rounded (pill) ends.

### Lists
- Use generous vertical spacing (16px) between list items.
- Separators should be subtle: 1px height using the background color (#FAF6F0) darkened by 5%.

### Progress & Loading
- Use custom loaders that utilize the "Organic Shape" philosophy—avoid perfect circles; use slightly asymmetrical rotating shapes in Terracotta.