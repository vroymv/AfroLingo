# Onboarding Images

This folder contains illustrations for the level selection screen.

## Required Images

### beginner-illustration.png

**Status**: ⚠️ Needs to be added
**Used for**: Absolute Beginner level card
**Dimensions**: Flexible (recommended 1200x400px or similar 3:1 ratio)
**Description**: The image you provided showing a person climbing stairs

**To add this image:**

1. Save your `beginner-illustration.png` image to this directory:
   `/Users/roy/Documents/AfroLingo/assets/images/onboarding/beginner-illustration.png`

2. The image will automatically appear in the "Absolute Beginner" card on the level selection screen.

### intermediate-illustration.png

**Status**: 📝 Placeholder (optional)
**Used for**: Beginner level card
**Suggested content**: Two people having a conversation, speech bubbles with words

### advanced-illustration.png

**Status**: 📝 Placeholder (optional)
**Used for**: Refresher level card
**Suggested content**: Confident learner in cultural setting, group conversation

## Image Guidelines

- **Format**: PNG or JPG
- **Size**: Keep under 500KB for optimal performance
- **Aspect Ratio**: 3:1 works well (e.g., 1200x400, 900x300)
- **Height**: Will be displayed at 120pt on mobile devices
- **Style**: Flat illustrations with vibrant colors matching gradient themes

## Implementation

The level selection screen (`app/(onboarding)/level-selection.tsx`) is already configured to:

- Display `beginner-illustration.png` for the Absolute Beginner card
- Show placeholders for the other two levels until you add those images

Once you add more images, update the code to use them instead of placeholders.
