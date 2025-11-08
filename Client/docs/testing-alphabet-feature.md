# Quick Start: Testing the Alphabet Feature

## 🚀 Run the App

```bash
cd /Users/roy/Documents/AfroLingo
npx expo start
```

## 📍 Navigate to the Feature

1. Open your app in iOS Simulator or Expo Go
2. Navigate to: **Learn Tab** → **Alphabet Lesson**
3. You should see the enhanced alphabet screen

## ✅ What to Test

### Image Display

- [ ] Alphabet image appears in a blue-bordered card
- [ ] "Tap to enlarge" text visible at bottom of image
- [ ] Image is clear and readable
- [ ] Tapping image opens fullscreen view
- [ ] Close button (X) works in fullscreen
- [ ] Can scroll/zoom in fullscreen mode

### Audio Player (with file)

- [ ] Audio instruction text appears
- [ ] Play button is prominent and centered
- [ ] Clicking play starts audio
- [ ] Button changes to "Pause" when playing
- [ ] Progress bar animates during playback
- [ ] Time counter updates (e.g., 0:15 / 2:30)
- [ ] Can pause and resume
- [ ] Audio restarts from beginning after finishing

### Audio Player (without file)

- [ ] Shows muted speaker icon
- [ ] Displays "coming soon" message
- [ ] No errors in console
- [ ] Can still continue to next activity

### General UX

- [ ] "Continue" button always visible at bottom
- [ ] All text is readable
- [ ] Colors match app theme
- [ ] Smooth transitions
- [ ] No lag or freezing
- [ ] Works on both iOS and Android (if testing)

## 🐛 Common Issues & Fixes

### Issue: Audio doesn't play

**Check:**

1. File exists at `/assets/audio/swahili-alphabet.mp3`
2. File is valid MP3 format
3. Restart Expo dev server
4. Clear cache: `npx expo start -c`

### Issue: Image doesn't appear

**Check:**

1. File exists at `/assets/images/Swahili-alphabet.png`
2. Path in code matches actual filename
3. Image file isn't corrupted

### Issue: Fullscreen doesn't work

**Check:**

1. No JavaScript errors in console
2. Modal component is properly imported
3. Try rebuilding the app

### Issue: Progress bar doesn't update

**Check:**

1. Audio file has valid duration metadata
2. `expo-audio` package is installed
3. Check console for audio player errors

## 📝 Console Commands for Debugging

```bash
# Clear cache and restart
npx expo start -c

# Check for errors
# (Watch the terminal/console as you interact with the screen)

# Reinstall dependencies if needed
npm install

# Update expo-audio if needed
npx expo install expo-audio
```

## 🎯 Expected Behavior Summary

**Without Audio File:**

- Image displays ✅
- Fullscreen works ✅
- Shows "coming soon" for audio ✅
- Continue button works ✅

**With Audio File:**

- Everything above ✅
- Plus: Audio plays ✅
- Progress tracking ✅
- Play/pause controls ✅

## 📞 Next Steps After Testing

1. **If working well**: Add more lessons with similar structure
2. **If audio missing**: Follow `/docs/adding-alphabet-audio.md`
3. **If bugs found**: Check console, debug, or ask for help
4. **If perfect**: Celebrate! 🎉 Then move to next feature

## 🎬 Screen Recording Tips

To share your progress:

```bash
# iOS Simulator
Cmd + R (to record screen)

# Expo Go on device
Use your phone's screen recording feature
```

Record yourself:

1. Tapping the image to enlarge
2. Playing the audio (if available)
3. Watching the progress bar
4. Clicking continue

This will help showcase the feature!
