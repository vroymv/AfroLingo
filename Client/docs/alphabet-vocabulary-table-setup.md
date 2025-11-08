# Alphabet Vocabulary Table Activity - Setup Guide

## Overview

Activity 5 of the alphabet lesson displays an interactive table showing all Swahili alphabet letters with example words, translations, images, and audio playback.

## Activity Structure

- **Type**: `alphabet-vocabulary-table`
- **Location**: Activity 5 of 5 in the alphabet lesson
- **Features**:
  - Table with 24 Swahili alphabet letters (A-Z, excluding Q and X)
  - Example word for each letter
  - English translation
  - Play button for audio pronunciation
  - Image placeholder for visual learning

## Vocabulary Words

| Letter | Swahili Word | Translation |
| ------ | ------------ | ----------- |
| A      | Asante       | Thank you   |
| B      | Baba         | Father      |
| C      | Chai         | Tea         |
| D      | Dada         | Sister      |
| E      | Embe         | Mango       |
| F      | Farasi       | Horse       |
| G      | Gari         | Car         |
| H      | Habari       | News/Hello  |
| I      | Injini       | Engine      |
| J      | Jina         | Name        |
| K      | Karibu       | Welcome     |
| L      | Leo          | Today       |
| M      | Mama         | Mother      |
| N      | Nani         | Who         |
| O      | Ondoka       | Leave       |
| P      | Pole         | Sorry       |
| R      | Rafiki       | Friend      |
| S      | Samaki       | Fish        |
| T      | Tafadhali    | Please      |
| U      | Uji          | Porridge    |
| V      | Viatu        | Shoes       |
| W      | Wapi         | Where       |
| Y      | Yai          | Egg         |
| Z      | Ziwa         | Lake        |

## Required Assets

### Audio Files

Audio files should be placed in: `/assets/audio/alphabet/`

**Naming Convention**: `{letter}-{word}.mp3`

Example file structure:

```
/assets/audio/alphabet/
  ├── a-asante.mp3
  ├── b-baba.mp3
  ├── c-chai.mp3
  ├── d-dada.mp3
  ├── e-embe.mp3
  ├── f-farasi.mp3
  ├── g-gari.mp3
  ├── h-habari.mp3
  ├── i-injini.mp3
  ├── j-jina.mp3
  ├── k-karibu.mp3
  ├── l-leo.mp3
  ├── m-mama.mp3
  ├── n-nani.mp3
  ├── o-ondoka.mp3
  ├── p-pole.mp3
  ├── r-rafiki.mp3
  ├── s-samaki.mp3
  ├── t-tafadhali.mp3
  ├── u-uji.mp3
  ├── v-viatu.mp3
  ├── w-wapi.mp3
  ├── y-yai.mp3
  └── z-ziwa.mp3
```

### Image Files (Optional)

Images should be placed in: `/assets/images/vocab/`

**Naming Convention**: `{word}.png`

Example file structure:

```
/assets/images/vocab/
  ├── asante.png
  ├── baba.png
  ├── chai.png
  ├── dada.png
  ├── embe.png
  ├── farasi.png
  ├── gari.png
  ├── habari.png
  ├── injini.png
  ├── jina.png
  ├── karibu.png
  ├── leo.png
  ├── mama.png
  ├── nani.png
  ├── ondoka.png
  ├── pole.png
  ├── rafiki.png
  ├── samaki.png
  ├── tafadhali.png
  ├── uji.png
  ├── viatu.png
  ├── wapi.png
  ├── yai.png
  └── ziwa.png
```

**Image Specifications**:

- Format: PNG (transparent background recommended)
- Dimensions: 200x200px (or larger, will be displayed at 50x50)
- Style: Simple, clear illustrations representing the word

## Implementation Notes

### Current State

- Component is fully implemented and integrated
- Audio playback uses placeholder (button shows visual feedback)
- Images show placeholder icons until actual images are added

### To Enable Full Functionality

1. **Add Audio Files**:

   - Record or source audio of a native Swahili speaker
   - Save files with the naming convention above
   - Audio will automatically play when the play button is tapped

2. **Add Images** (Optional):

   - Create or source simple illustrations
   - Place in the `/assets/images/vocab/` directory
   - Images will automatically display in the table

3. **Update Component** (if using actual audio):
   - In `AlphabetVocabularyTableActivity.tsx`, update the `handlePlayAudio` function
   - Replace placeholder with actual audio loading logic using `expo-audio`

## User Experience

1. User scrolls through the alphabet table
2. Each row shows:
   - Large letter in green
   - Swahili word with English translation
   - Image placeholder (dashed border)
   - Play button icon
3. Tapping play button:
   - Icon changes to volume indicator
   - Audio plays (when files are added)
   - Button scales slightly for feedback
4. After reviewing all letters, user taps "Complete Activity"
5. Lesson completion screen shows with XP reward

## Technical Details

- **Component**: `AlphabetVocabularyTableActivity.tsx`
- **Location**: `/components/learn/activities/`
- **Dependencies**: `expo-audio`, `@expo/vector-icons`
- **Styling**: Follows app's green (#4CAF50) theme
- **Responsive**: Scrollable table for easy navigation
