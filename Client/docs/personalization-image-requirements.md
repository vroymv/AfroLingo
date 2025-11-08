# Personalization Screen - Image Requirements

## Overview

The personalization screen has been redesigned to be more visual and engaging. Below are the image assets needed to complete the design.

## Image Specifications

### General Requirements

- **Format**: PNG with transparency preferred
- **Aspect Ratio**: Square (1:1) recommended
- **Size**: 256x256px or 512x512px (will be displayed at ~60px diameter in circular containers)
- **Style**: Colorful, illustrative, culturally relevant, warm and inviting
- **Background**: Transparent or can be isolated subject on solid color

---

## Learning Reasons Images

### 1. Heritage (`heritage.png`)

**Path**: `assets/images/onboarding/heritage.png`
**Subject Ideas**:

- Traditional African artifacts (e.g., tribal masks, pottery, textiles)
- Ancestral symbols or family tree imagery
- Historical African monuments or architecture
- Traditional ceremonies or cultural symbols
- Adinkra symbols or other traditional iconography

**Mood**: Respectful, historical, connection to roots

---

### 2. Family (`family.png`)

**Path**: `assets/images/onboarding/family.png`
**Subject Ideas**:

- Multigenerational African family portrait (grandparents, parents, children)
- Family gathering or celebration scene
- Silhouettes of family members together
- African family in traditional or modern attire
- Warm, inclusive family moment

**Mood**: Loving, warm, intergenerational connection

---

### 3. Travel (`travel.png`)

**Path**: `assets/images/onboarding/travel.png`
**Subject Ideas**:

- Iconic African landmarks (Table Mountain, Victoria Falls, Serengeti, etc.)
- Safari scenes or wildlife (elephants, giraffes in natural habitat)
- African cityscapes (Cape Town, Nairobi, Lagos skylines)
- Travel-related imagery with African elements
- Map of Africa with highlighted regions

**Mood**: Adventure, exploration, discovery

---

### 4. Education (`education.png`)

**Path**: `assets/images/onboarding/education.png`
**Subject Ideas**:

- Student studying with African cultural elements
- Graduation cap with African patterns/kente cloth
- Books with African languages or cultural motifs
- Classroom or university setting with African context
- Academic achievement symbols with cultural flair

**Mood**: Scholarly, achievement-oriented, purposeful

---

### 5. Culture (`culture.png`)

**Path**: `assets/images/onboarding/culture.png`
**Subject Ideas**:

- Traditional African musical instruments (djembe, kora, mbira)
- African dance or performance art
- Traditional masks or ceremonial items
- African art, paintings, or sculptures
- Cultural festivals or celebrations
- Traditional clothing and textiles

**Mood**: Vibrant, artistic, celebratory

---

### 6. Career (`career.png`)

**Path**: `assets/images/onboarding/career.png`
**Subject Ideas**:

- Professional workspace with global/international elements
- Business people in professional setting with African context
- Career growth symbols (briefcase, handshake, success imagery)
- International business or diplomacy themes
- Professional development or networking scenes

**Mood**: Professional, ambitious, growth-oriented

---

## Implementation Notes

### Current State

- Emoji placeholders are currently used (🏛️, 👨‍👩‍👧‍👦, ✈️, 🎓, 🎭, 💼)
- Each reason card has a circular placeholder container (60x60px diameter)
- Cards are arranged in a 2-column grid

### When Adding Images

Replace the placeholder section in the code:

```tsx
{
  /* TODO: Replace with actual image when available */
}
<View style={styles.reasonImagePlaceholder}>
  <ThemedText style={styles.reasonIconLarge}>{reason.icon}</ThemedText>
</View>;
```

With:

```tsx
<View style={styles.reasonImagePlaceholder}>
  <Image
    source={require("@/assets/images/onboarding/heritage.png")}
    style={styles.reasonImage}
    resizeMode="cover"
  />
</View>
```

And add the style:

```tsx
reasonImage: {
  width: 60,
  height: 60,
  borderRadius: 30,
},
```

---

## Design Guidelines

### Color Palette Suggestions

- **Heritage**: Earthy tones (browns, terracotta, gold)
- **Family**: Warm colors (oranges, yellows, warm reds)
- **Travel**: Vibrant blues, greens (nature/sky)
- **Education**: Deep blues, purples (scholarly)
- **Culture**: Multi-colored, vibrant (artistic)
- **Career**: Professional blues, grays (business)

### Style Consistency

- Maintain similar illustration style across all 6 images
- Use consistent line weights and color saturation
- Ensure all images work well in both light and dark modes
- Consider using flat design or minimal illustration style
- Include cultural elements but avoid stereotypes

---

## Alternative Options

If custom illustrations aren't immediately available, consider:

1. **Stock Photography Sources**:

   - Unsplash (search: "African culture", "African family", etc.)
   - Pexels
   - Shutterstock (paid)

2. **Icon/Illustration Libraries**:

   - Flaticon (search for African-themed icons)
   - Noun Project
   - Icons8 Illustrations

3. **AI Generation**:
   - Midjourney prompts: "minimalist icon of [subject], flat design, circular, warm colors, African aesthetic"
   - DALL-E or Stable Diffusion with similar prompts

---

## Priority Order

1. **High Priority**: Heritage, Family, Culture (most commonly selected)
2. **Medium Priority**: Travel, Career
3. **Lower Priority**: Education

Start with high-priority images if implementing incrementally.
