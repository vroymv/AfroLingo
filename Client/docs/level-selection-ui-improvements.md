# Level Selection Screen - UI Improvements

## Overview

The level selection screen has been redesigned with a more visual, icon-driven approach that reduces text and emphasizes imagery and icons.

## Key Changes

### 1. **Visual Card Design**

- Each level option now features a **gradient background** with unique colors:
  - **Absolute Beginner**: Green gradient (#4CAF50 → #8BC34A)
  - **Beginner**: Blue gradient (#2196F3 → #03A9F4)
  - **Refresher**: Purple-Pink gradient (#9C27B0 → #E91E63)

### 2. **Large Icon Display**

- Each card features a large emoji icon (🌱, 🌿, 🌳) in a frosted glass circle
- Icons are 48px, displayed prominently at the top of each card

### 3. **Feature Icons Grid**

- Replaced long text descriptions with icon-based features:
  - **Absolute Beginner**: 👋 Greetings | 🔤 Alphabet | 👨‍👩‍👧‍👦 Family
  - **Beginner**: 💬 Conversations | 📝 Sentences | 📚 Vocabulary
  - **Refresher**: 🎯 Fluency | 🌍 Culture | ⚡ Advanced

### 4. **Selection Indicator**

- Floating checkmark badge in top-right corner when selected
- Card scales up slightly (1.02x) with enhanced shadow
- White badge with black checkmark for contrast

### 5. **Simplified Header**

- Changed from "Your {Language} Level" to just "Choose Your Level"
- Shorter subtitle: "Select the path that fits you best"

## Image Placeholders

### Location

Each card has a dedicated image placeholder section (120px height) at the bottom.

### Recommended Images

#### 1. **beginner-illustration.png** (Absolute Beginner)

**Suggested content:**

- Illustration of someone starting their learning journey
- Person with a book/tablet learning alphabet
- Friendly, welcoming scene with bright colors
- Size: 1200x400px (3:1 ratio)
- Style: Flat illustration, modern, friendly
- Colors: Match green gradient theme

#### 2. **intermediate-illustration.png** (Beginner)

**Suggested content:**

- Two people having a simple conversation
- Speech bubbles with basic words/phrases
- Person building blocks/sentences
- Size: 1200x400px (3:1 ratio)
- Style: Flat illustration, energetic
- Colors: Match blue gradient theme

#### 3. **advanced-illustration.png** (Refresher)

**Suggested content:**

- Confident learner in cultural setting
- Group conversation or cultural celebration
- Lightning bolt/star effect showing mastery
- Size: 1200x400px (3:1 ratio)
- Style: Flat illustration, sophisticated
- Colors: Match purple-pink gradient theme

### Alternative Options

Instead of illustrations, you could use:

- **Photos**: Real students at different learning stages
- **Abstract patterns**: Geometric designs matching gradient colors
- **Cultural imagery**: African patterns/motifs relevant to each level
- **Achievement badges**: Trophy/medal designs for each tier

## Implementation Tips

### Adding Images

1. Place images in `assets/images/onboarding/`
2. Replace the placeholder View with:

```tsx
<Image
  source={require(`@/assets/images/onboarding/${option.imagePlaceholder}`)}
  style={styles.levelImage}
  resizeMode="cover"
/>
```

3. Add to styles:

```tsx
levelImage: {
  width: '100%',
  height: 120,
}
```

### Alternative: Use remote images

```tsx
<Image
  source={{ uri: `https://your-cdn.com/images/${option.imagePlaceholder}` }}
  style={styles.levelImage}
  resizeMode="cover"
/>
```

## Design System Notes

### Spacing

- Card gap: 24px
- Internal padding: 32px (gradient section), 20px (features)
- Corner radius: 24px

### Typography

- Card title: 24px bold
- Card subtitle: 16px regular
- Feature labels: 12px semibold
- Help text: 14px regular

### Effects

- Shadow on cards (elevated when selected)
- Gradient overlay on image section
- Frosted glass effect on icon container

## Accessibility Improvements

- Larger touch targets (minimum 44x44pt)
- High contrast text on gradient backgrounds
- Clear visual feedback for selection
- Icon + text labels for clarity

## Future Enhancements

- Add animation when selecting cards (spring animation)
- Parallax effect on scroll
- Animated gradient transitions
- Lottie animations for icons
- Video backgrounds instead of static images
