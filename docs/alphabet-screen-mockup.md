# Alphabet Learning Screen - Visual Guide

## 📱 What Your Users Will See

### Screen Layout

```
╔══════════════════════════════════════════════════╗
║  ← Back          Unit Progress Bar          ✕   ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║         The Swahili Alphabet                     ║
║      Learn the foundation of the language        ║
║                                                  ║
║  👆 Tap the image below to view it fullscreen   ║
║                                                  ║
║    ╔════════════════════════════════════╗       ║
║    ║                                    ║       ║
║    ║     [Swahili Alphabet Chart]      ║       ║
║    ║                                    ║       ║
║    ║     A a   B b   Ch ch   D d       ║       ║
║    ║     E e   F f   G g     H h       ║       ║
║    ║     I i   J j   K k     L l       ║       ║
║    ║     ... (alphabet continues)       ║       ║
║    ║                                    ║       ║
║    ╠════════════════════════════════════╣       ║
║    ║      🔍 Tap to enlarge             ║       ║
║    ╚════════════════════════════════════╝       ║
║                                                  ║
║         🔊 Listen to the pronunciation          ║
║                                                  ║
║    ╔════════════════════════════════════╗       ║
║    ║  ▶  Play Alphabet Pronunciation   ║       ║
║    ╚════════════════════════════════════╝       ║
║         ━━━━━━━━━━━━━━━━━━━━━━━━━━              ║
║         0:00 / 2:30                             ║
║                                                  ║
║   Listen carefully to learn how each letter     ║
║   is pronounced in Swahili. Practice along      ║
║   with the audio for best results.              ║
║                                                  ║
║                                                  ║
║    ╔════════════════════════════════════╗       ║
║    ║        Continue  →                 ║       ║
║    ╚════════════════════════════════════╝       ║
╚══════════════════════════════════════════════════╝
```

## 🎬 Interactive States

### 1. When Audio is Playing

```
╔════════════════════════════════════╗
║  ⏸  Pause Pronunciation           ║
╚════════════════════════════════════╝
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0:45 / 2:30
        ↑
    (animated progress)
```

### 2. Fullscreen Image View

```
╔══════════════════════════════════════════════════╗
║  Swahili Alphabet                          ✕     ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║                                                  ║
║         [FULLSCREEN ALPHABET IMAGE]              ║
║                                                  ║
║            (Pinch to zoom)                       ║
║            (Scroll to pan)                       ║
║                                                  ║
║                                                  ║
╠══════════════════════════════════════════════════╣
║     Pinch to zoom • Scroll to explore           ║
╚══════════════════════════════════════════════════╝
```

### 3. If Audio File is Missing

```
╔════════════════════════════════════╗
║         🔇                         ║
║  Audio pronunciation coming soon!  ║
╚════════════════════════════════════╝
```

## 🎨 Color Scheme

- **Primary Blue** (#4A90E2): Audio button, image border
- **Active Blue** (#357ABD): Playing state
- **Success Green** (#4CAF50): Continue button
- **Text Gray** (#666): Descriptions
- **Background** (#F8F9FA): Main background
- **White**: Cards and modals

## 🎯 Interactive Elements

### Image Interaction

1. **Normal State**: Shows alphabet with subtle shadow
2. **Tap**: Opens fullscreen modal
3. **Fullscreen**: Can pinch-to-zoom, scroll to pan
4. **Close**: Tap X button returns to normal view

### Audio Interaction

1. **Before Playing**: Shows ▶ play icon
2. **Loading**: Shows spinner (if buffering)
3. **Playing**:
   - Shows ⏸ pause icon
   - Button turns darker blue
   - Progress bar animates
   - Time updates in real-time
4. **Paused**: Returns to play state with preserved position

### Button States

- **Normal**: Full color with shadow
- **Pressed**: Slightly darker (activeOpacity)
- **Disabled**: Not applicable (always enabled)

## 📐 Sizing & Spacing

### Image

- Max width: 500px
- Aspect ratio: 1:1 (square)
- Border: 3px solid blue
- Border radius: 20px
- Shadow: elevation 8

### Audio Button

- Min width: 280px
- Padding: 18px vertical, 32px horizontal
- Border radius: 16px
- Icon size: 48px

### Continue Button

- Full width (minus 20px margin each side)
- Height: ~54px (18px padding + text)
- Border radius: 12px

## 🔤 Typography

### Title

- Font size: 24pt
- Weight: 700 (bold)
- Color: Theme text color

### Instructions

- Font size: 14-16pt
- Weight: 500-600 (medium/semibold)
- Color: #333 or #666

### Button Text

- Font size: 16-18pt
- Weight: 700 (bold)
- Color: White

### Time/Progress

- Font size: 12pt
- Weight: 500
- Color: #666

## ⚡ Animations & Transitions

1. **Modal Open/Close**: Fade animation
2. **Button Press**: Subtle scale (via activeOpacity)
3. **Progress Bar**: Smooth width transition
4. **Audio State Change**: Immediate icon swap

## 📱 Responsive Behavior

- Image scales to fit screen width
- Fullscreen uses actual device dimensions
- Buttons maintain readable sizes
- Text remains legible on all devices
- Touch targets minimum 44x44 points

## ✨ Polish Details

- Drop shadows on interactive elements
- Rounded corners throughout
- Consistent color palette
- Icon + text combinations
- Visual feedback on all interactions
- Proper spacing and breathing room
- Professional gradient overlays
