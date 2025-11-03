# Audio Files

This folder contains pronunciation audio files for the AfroLingo app.

## Required Audio Files

### Swahili Alphabet

- **File:** `swahili-alphabet.mp3`
- **Description:** Pronunciation of the complete Swahili alphabet
- **Format:** MP3
- **Recommended Quality:** 128kbps or higher
- **Duration:** Approximately 1-2 minutes

### Alphabet Dictation Exercise

- **File:** `alphabet-dictation.mp3`
- **Description:** Recording of 10 letters (A, B, C, D, E, F, G, H, I, J) pronounced clearly
- **Format:** MP3
- **Recommended Quality:** 128kbps or higher
- **Duration:** Approximately 15-20 seconds
- **Content:** Each letter should be pronounced with 1-2 second pauses between them
- **Detailed Instructions:** See `alphabet-dictation-instructions.md` in this folder

## How to Add Audio Files

1. Place your audio file in this directory: `/assets/audio/`
2. Name it exactly as specified above: `swahili-alphabet.mp3`
3. The app will automatically load it when users reach the alphabet lesson

## Recording Tips

For best results when creating alphabet pronunciation audio:

- Speak clearly and at a moderate pace
- Pronounce each letter with its Swahili sound
- Include a brief pause between letters
- Provide example words for each letter if possible
- Use a quiet environment with minimal background noise

## Generating Audio

You can:

1. Record your own voice using tools like Audacity or GarageBand
2. Use text-to-speech services that support Swahili
3. Hire a native Swahili speaker for authentic pronunciation
4. Use AI voice generation tools with Swahili support

## Format Conversion

If you have audio in other formats (WAV, M4A, etc.), you can convert to MP3 using:

- Online converters (e.g., CloudConvert, Online-Convert)
- FFmpeg: `ffmpeg -i input.wav -b:a 128k output.mp3`
- Audio editing software (Audacity, Adobe Audition)
