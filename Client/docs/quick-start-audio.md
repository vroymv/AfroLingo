# Quick Start: Adding the Audio File

## 🎯 Goal

Add the `alphabet-dictation.mp3` audio file so the listening exercise works.

## 📍 Where to Put It

```
/assets/audio/alphabet-dictation.mp3
```

## 🎤 What Should Be In It

A clear recording of someone saying these 10 letters with 1-2 second pauses:

**A ... B ... C ... D ... E ... F ... G ... H ... I ... J**

## ⚡ Fastest Options

### Option 1: Text-to-Speech (Quickest)

Use an online TTS service:

1. Go to https://ttsmp3.com/
2. Select language: Swahili or English
3. Enter text: "A... B... C... D... E... F... G... H... I... J"
4. Click "Download MP3"
5. Save as `alphabet-dictation.mp3`
6. Move to `/assets/audio/` folder

### Option 2: Record Yourself

1. Open Voice Memos (Mac) or Voice Recorder (Windows)
2. Speak clearly: "A ... B ... C ... D ... E ... F ... G ... H ... I ... J"
3. Save/export as MP3
4. Name it `alphabet-dictation.mp3`
5. Move to `/assets/audio/` folder

### Option 3: Use Audacity (Free Software)

1. Download Audacity (free)
2. Click record button
3. Speak the letters with pauses
4. File → Export → Export as MP3
5. Save as `alphabet-dictation.mp3`
6. Move to `/assets/audio/` folder

### Option 4: AI Voice Generation

Use services like:

- ElevenLabs (https://elevenlabs.io/)
- Play.ht
- Murf.ai

## ✅ After Adding the File

1. Restart your Expo development server
2. Reload the app
3. Navigate to alphabet lesson
4. The audio should now play!

## 🧪 Test It

Enter this answer to test: **A B C D E F G H I J**

## ⚠️ Troubleshooting

**Audio doesn't play?**

- Check the file is named exactly: `alphabet-dictation.mp3`
- Check it's in the correct folder: `/assets/audio/`
- Restart the Expo server
- Clear the app cache

**Wrong file path error?**

- Make sure there are no spaces in the filename
- Ensure the file extension is `.mp3` (not `.MP3` or `.m4a`)

## 📝 Notes

- File should be around 15-20 seconds long
- Recommended quality: 128kbps MP3
- Make sure letters are clearly pronounced
- Keep background noise minimal
