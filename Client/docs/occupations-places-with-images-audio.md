# Occupations and Places - Images & Audio Implementation

## Overview

Updated the vocabulary table component to display images and individual play buttons for each vocabulary item in the "Occupations and Places" lesson.

## Changes Made

### 1. VocabularyTableActivity Component

**File:** `/components/learn/activities/VocabularyTableActivity.tsx`

#### New Features:

- **Image Display**: Each vocabulary item now shows an image next to the text
- **Individual Play Buttons**: Each item has its own play button for pronunciation
- **Improved Layout**: Card-style layout with better visual hierarchy

#### Layout Structure:

```
┌─────────────────────────────────────────────────┐
│ [Image] │ Swahili Word           │ [▶ Play]    │
│  (80px) │ English Translation    │             │
│         │ [pronunciation]        │             │
└─────────────────────────────────────────────────┘
```

#### Updated Interface:

```typescript
interface VocabularyItem {
  swahili: string;
  english: string;
  pronunciation: string;
  image?: string; // NEW: Image path
  audio?: string; // NEW: Individual audio path
}
```

### 2. Lessons Data Update

**File:** `/data/lessons.json`

Added `audio` field to each place and occupation:

#### Places Audio Files Required:

- `/assets/audio/place-class.mp3`
- `/assets/audio/place-house.mp3`
- `/assets/audio/place-library.mp3`
- `/assets/audio/place-airport.mp3`
- `/assets/audio/place-market.mp3`
- `/assets/audio/place-office.mp3`
- `/assets/audio/place-pharmacy.mp3`
- `/assets/audio/place-hospital.mp3`
- `/assets/audio/place-bank.mp3`
- `/assets/audio/place-school.mp3`

#### Occupations Audio Files Required:

- `/assets/audio/occupation-teacher.mp3`
- `/assets/audio/occupation-cashier.mp3`
- `/assets/audio/occupation-waiter.mp3`
- `/assets/audio/occupation-lawyer.mp3`
- `/assets/audio/occupation-barber.mp3`
- `/assets/audio/occupation-police.mp3`
- `/assets/audio/occupation-driver.mp3`
- `/assets/audio/occupation-doctor.mp3`
- `/assets/audio/occupation-pharmacist.mp3`
- `/assets/audio/occupation-farmer.mp3`

## Styling Details

### Image Container:

- Size: 80x80px
- Border radius: 8px
- Background: Light blue (#E8F4FD)
- Border: 1px solid #B8D8F0
- Currently shows emoji placeholder (🖼️) until actual images are added

### Play Button:

- Size: 44x44px circular button
- Background: Blue (#4A90E2)
- Active state: Darker blue (#357ABD)
- Icon: Play/Pause based on state
- Disabled while audio is playing

### Text Layout:

- **Swahili**: 18px, bold, primary color
- **English**: 14px, medium weight, gray
- **Pronunciation**: 13px, italic, light gray

## Next Steps

### 1. Add Actual Images

Replace the emoji placeholder with actual images:

```typescript
// Uncomment this line in VocabularyTableActivity.tsx (line ~85)
<Image source={{ uri: item.image }} style={styles.itemImage} />

// And remove/comment out the placeholder line
<ThemedText style={styles.imagePlaceholder}>🖼️</ThemedText>
```

### 2. Implement Audio Playback

Update the `playAudio` function to use expo-av:

```typescript
import { Audio } from "expo-av";

const playAudio = async (audioPath?: string, index?: number) => {
  if (!audioPath || playingIndex !== null) return;

  setPlayingIndex(index ?? null);

  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioPath },
      { shouldPlay: true }
    );

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        setPlayingIndex(null);
      }
    });
  } catch (error) {
    console.error("Error playing audio:", error);
    setPlayingIndex(null);
  }
};
```

### 3. Create Image Assets

Create images for all places and occupations at:

- `/assets/images/vocab/place-*.png`
- `/assets/images/vocab/occupation-*.png`

Recommended image specs:

- Size: 160x160px (2x for retina)
- Format: PNG with transparency
- Style: Consistent illustration style
- File size: < 50KB each

### 4. Create Audio Files

Record or generate audio pronunciations for each word and save at the paths specified in the lessons.json file.

## User Experience

### Interaction Flow:

1. User sees list of places/occupations with images
2. User taps play button on any item
3. Audio plays pronunciation of that specific word
4. Play button shows pause icon during playback
5. Other play buttons are disabled while one is playing
6. Button returns to play icon when audio finishes

### Benefits:

- ✅ Visual learning with images
- ✅ Audio reinforcement for correct pronunciation
- ✅ Individual control over each word's audio
- ✅ Clean, modern card-based layout
- ✅ Better engagement and retention

## Testing

Test the component by:

1. Running the app and navigating to Unit 5 "Occupations and Places"
2. Verify images appear (currently shows placeholder)
3. Test play buttons (currently simulated 1-second delay)
4. Check that only one audio can play at a time
5. Verify layout on different screen sizes

## Future Enhancements

- [ ] Add image zoom on tap
- [ ] Add favorite/bookmark feature for specific words
- [ ] Add slow/fast playback speed options
- [ ] Add record & compare feature for pronunciation practice
- [ ] Add offline audio caching
