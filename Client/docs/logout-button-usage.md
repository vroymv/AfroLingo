# 🚪 Logout Button Component

## Import

```typescript
import { LogoutButton } from "@/components/auth/LogoutButton";
```

## Usage Examples

### Basic Usage

```tsx
<LogoutButton />
```

### Variants

#### Contained (Default) - Red background

```tsx
<LogoutButton variant="contained" />
```

#### Outlined - Red border

```tsx
<LogoutButton variant="outlined" />
```

#### Text Only - No background

```tsx
<LogoutButton variant="text" />
```

### Sizes

```tsx
<LogoutButton size="small" />
<LogoutButton size="medium" /> {/* Default */}
<LogoutButton size="large" />
```

### Without Icon

```tsx
<LogoutButton showIcon={false} />
```

### With Callback

```tsx
<LogoutButton
  onLogoutComplete={() => {
    console.log("User logged out!");
    // Additional cleanup or navigation
  }}
/>
```

### Combined Props

```tsx
<LogoutButton
  variant="outlined"
  size="large"
  showIcon={true}
  onLogoutComplete={() => router.push("/(auth)/login")}
/>
```

## Where to Add It

### In Profile/Settings Screen

```tsx
// app/(tabs)/profile.tsx
import { LogoutButton } from "@/components/auth/LogoutButton";

export default function ProfileScreen() {
  return (
    <View>
      {/* Other profile content */}

      <View style={styles.dangerZone}>
        <Text style={styles.sectionTitle}>Account</Text>
        <LogoutButton variant="outlined" size="large" />
      </View>
    </View>
  );
}
```

### In Header Menu

```tsx
// In a header component
import { LogoutButton } from "@/components/auth/LogoutButton";

<View style={styles.headerActions}>
  <LogoutButton variant="text" size="small" showIcon={false} />
</View>;
```

### In Settings Menu

```tsx
// In settings list
<TouchableOpacity style={styles.menuItem}>
  <LogoutButton variant="text" />
</TouchableOpacity>
```

## Features

- ✅ Confirmation dialog before logout
- ✅ Loading state during logout
- ✅ Error handling
- ✅ Multiple style variants
- ✅ Customizable sizes
- ✅ Optional icon
- ✅ Callback on success
- ✅ Fully accessible

## Screenshots Mockup

```
┌──────────────────────┐
│  Contained (Default) │
│   [🚪 Logout]        │ ← Red background, white text
└──────────────────────┘

┌──────────────────────┐
│    Outlined          │
│   [🚪 Logout]        │ ← Red border, red text
└──────────────────────┘

┌──────────────────────┐
│      Text            │
│   [🚪 Logout]        │ ← No background, red text
└──────────────────────┘
```

## Confirmation Dialog

When user taps logout button:

```
┌─────────────────────────────┐
│         Logout              │
│                             │
│ Are you sure you want to    │
│ logout?                     │
│                             │
│  [Cancel]      [Logout]     │
└─────────────────────────────┘
```

## Implementation Notes

The component:

1. Uses `useAuth()` hook to access logout function
2. Shows confirmation Alert before logging out
3. Displays loading spinner during logout
4. Handles errors gracefully
5. Calls optional callback on success
6. Automatically redirects to login screen (handled by root layout)
