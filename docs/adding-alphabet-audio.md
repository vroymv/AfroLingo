# Adding Swahili Alphabet Audio

## Quick Setup Guide

Your alphabet learning screen is now ready to display the image and play pronunciation audio! Here's how to add the audio file:

## Step 1: Get or Create Audio File

You have several options:

### Option A: Record Your Own

1. Use Voice Memos (Mac) or any recording app
2. Pronounce each letter of the Swahili alphabet clearly
3. Export as MP3 or M4A format

### Option B: Use Text-to-Speech

1. Use online TTS services like:
   - Google Cloud Text-to-Speech (supports Swahili)
   - Amazon Polly
   - ElevenLabs
2. Generate audio for the Swahili alphabet
3. Download as MP3

### Option C: Use AI Voice Generation

1. Services like ElevenLabs, Murf.ai, or PlayHT
2. Select a Swahili or appropriate African accent
3. Generate and download

## Step 2: Add the File

1. Place your audio file here: `/assets/audio/`
2. Name it exactly: `swahili-alphabet.mp3`
3. Make sure it's in MP3 format

```
AfroLingo/
  assets/
    audio/
      swahili-alphabet.mp3  ← Place your file here
```

## Step 3: Test It

1. Run your app: `npx expo start`
2. Navigate to the alphabet lesson
3. You should see:
   - ✅ The alphabet image (can tap to enlarge)
   - ✅ A prominent play button
   - ✅ Progress bar showing playback time
   - ✅ Audio controls (play/pause)

## What the User Sees

### Image Display

- Clean, bordered display of the Swahili alphabet
- "Tap to enlarge" hint at the bottom
- Fullscreen modal when tapped
- Pinch-to-zoom capability in fullscreen

### Audio Player

- 🔊 Icon and instruction text
- Large play/pause button with icon
- Progress bar showing current position
- Time display (current/total)
- Visual feedback when playing

### Fallback

If no audio file is present, users will see:

- Muted speaker icon
- "Audio pronunciation coming soon!" message

## File Requirements

- **Format**: MP3 (recommended) or M4A
- **Quality**: 128kbps or higher
- **Duration**: 1-3 minutes recommended
- **Content**: Clear pronunciation of each letter

## Swahili Alphabet Letters

A, B, Ch, D, E, F, G, H, I, J, K, L, M, N, O, P, R, S, T, U, V, W, Y, Z

Note: Include these digraphs: Ch, Dh, Gh, Kh, Ng', Ny, Sh, Th

## Converting Audio Formats

If you have audio in a different format:

### Using Online Converter

- Visit cloudconvert.com or online-convert.com
- Upload your file
- Convert to MP3
- Download

### Using FFmpeg (Command Line)

```bash
ffmpeg -i input.wav -b:a 128k swahili-alphabet.mp3
```

## Testing Without Audio

The component gracefully handles missing audio:

- Shows a "coming soon" message
- All other features work normally
- You can still view and enlarge the image
- Continue button always works

## Need Help?

If the audio doesn't play:

1. Check the file is exactly at: `/assets/audio/swahili-alphabet.mp3`
2. Verify it's a valid MP3 file
3. Try restarting the Expo dev server
4. Check console for any error messages
