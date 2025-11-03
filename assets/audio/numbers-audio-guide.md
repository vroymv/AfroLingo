# Numbers Audio Files Guide

This guide explains the audio files needed for the counting lessons in AfroLingo.

## Required Audio Files

### 1. Numbers 1-20 (Complete Set)

**File:** `numbers-1-20.mp3`
**Location:** `/assets/audio/numbers-1-20.mp3`
**Content:** Audio recording of all numbers from 1 to 20 in sequence

**Script:**

```
moja (1)
mbili (2)
tatu (3)
nne (4)
tano (5)
sita (6)
saba (7)
nane (8)
tisa (9)
kumi (10)
kumi na moja (11)
kumi na mbili (12)
kumi na tatu (13)
kumi na nne (14)
kumi na tano (15)
kumi na sita (16)
kumi na saba (17)
kumi na nane (18)
kumi na tisa (19)
ishirini (20)
```

### 2. Tens (30-100)

**File:** `numbers-tens.mp3`
**Location:** `/assets/audio/numbers-tens.mp3`
**Content:** Audio recording of tens from 30 to 100

**Script:**

```
thelathini (30)
arobaini (40)
hamsini (50)
sitini (60)
sabini (70)
themanini (80)
tisini (90)
mia moja (100)
```

### 3. Hundreds and Thousands

**File:** `numbers-hundreds.mp3`
**Location:** `/assets/audio/numbers-hundreds.mp3`
**Content:** Audio recording of hundreds and thousands

**Script:**

```
mia moja (100)
mia mbili (200)
mia tatu (300)
mia nne (400)
mia tano (500)
elfu moja (1000)
```

## Recording Guidelines

1. **Voice:** Use a native Swahili speaker or high-quality text-to-speech
2. **Pace:** Speak clearly and at a moderate pace
3. **Pauses:** Include 1-2 second pauses between each number
4. **Format:** Save as MP3 with good quality (128kbps or higher)
5. **Consistency:** Use the same voice for all number recordings

## Audio File Structure

```
/assets/audio/
├── numbers-1-20.mp3          # All numbers 1-20
├── numbers-tens.mp3          # Tens: 30, 40, 50, etc.
└── numbers-hundreds.mp3      # Hundreds and thousands
```

## Testing

Once audio files are added:

1. Navigate to the counting lesson in the app
2. Tap the "Play All Numbers" button on each table
3. Verify that audio plays correctly and matches the displayed numbers
4. Check that pronunciation helps learners understand the correct way to say each number

## Optional: Individual Number Audio

For future enhancements, you may want to add individual audio files for each number to allow users to play them one at a time:

```
/assets/audio/numbers/
├── 01-moja.mp3
├── 02-mbili.mp3
├── 03-tatu.mp3
...etc
```

This would enable per-row audio playback similar to the alphabet activity.
