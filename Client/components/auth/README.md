# Authentication Components

This folder contains reusable authentication UI components used across login and signup screens.

## Components

### `AuthHeader`

Displays the app logo and page title/subtitle.

**Props:**

- `title: string` - The main heading text
- `subtitle: string` - The subtitle/description text

**Usage:**

```tsx
<AuthHeader
  title="Welcome Back!"
  subtitle="Sign in to continue your language journey"
/>
```

---

### `AuthInput`

A reusable input field with icon, label, error handling, and validation.

**Props:**

- `label: string` - The input field label
- `icon: keyof typeof Ionicons.glyphMap` - The Ionicons icon name
- `placeholder: string` - Placeholder text
- `value: string` - Current input value
- `onChangeText: (text: string) => void` - Change handler
- `error?: string` - Optional error message to display
- Plus all standard `TextInput` props

**Usage:**

```tsx
<AuthInput
  label="Email"
  icon="mail-outline"
  placeholder="your.email@example.com"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
  keyboardType="email-address"
  autoCapitalize="none"
/>
```

---

### `PasswordInput`

A specialized password input with show/hide toggle functionality.

**Props:**

- `label: string` - The input field label
- `placeholder: string` - Placeholder text
- `value: string` - Current password value
- `onChangeText: (text: string) => void` - Change handler
- `error?: string` - Optional error message
- `autoComplete?: "password" | "password-new"` - Autocomplete behavior

**Usage:**

```tsx
<PasswordInput
  label="Password"
  placeholder="Enter your password"
  value={password}
  onChangeText={setPassword}
  error={errors.password}
  autoComplete="password"
/>
```

---

### `AuthButton`

Primary action button (e.g., Sign In, Create Account).

**Props:**

- `title: string` - Button text
- `onPress: () => void` - Press handler
- `isLoading?: boolean` - Shows loading indicator
- `disabled?: boolean` - Disables the button
- `style?: ViewStyle` - Additional custom styles

**Usage:**

```tsx
<AuthButton title="Sign In" onPress={handleLogin} isLoading={isLoading} />
```

---

### `SocialAuthButtons`

Google and Apple authentication buttons displayed side by side.

**Props:**

- `onGooglePress: () => void` - Google button handler
- `onApplePress: () => void` - Apple button handler
- `isGoogleLoading?: boolean` - Google loading state
- `isAppleLoading?: boolean` - Apple loading state
- `disabled?: boolean` - Disables both buttons

**Usage:**

```tsx
<SocialAuthButtons
  onGooglePress={handleGoogleLogin}
  onApplePress={handleAppleLogin}
  isGoogleLoading={isGoogleLoading}
  isAppleLoading={isAppleLoading}
  disabled={isLoading}
/>
```

---

### `AuthDivider`

Visual divider with "or" text, typically used between email/password auth and social auth.

**Props:** None

**Usage:**

```tsx
<AuthDivider />
```

---

### `TermsCheckbox`

Checkbox for agreeing to terms and conditions (used in signup).

**Props:**

- `agreed: boolean` - Checkbox state
- `onToggle: () => void` - Toggle handler
- `error?: string` - Optional error message

**Usage:**

```tsx
<TermsCheckbox
  agreed={agreedToTerms}
  onToggle={() => setAgreedToTerms(!agreedToTerms)}
  error={errors.terms}
/>
```

---

## Benefits of This Structure

1. **Reusability**: Components can be used in both login and signup screens
2. **Consistency**: Ensures consistent UI/UX across authentication flows
3. **Maintainability**: Changes to styling or behavior only need to be made once
4. **Testability**: Individual components can be tested in isolation
5. **Clean Code**: Main screen files are much more readable and focused on business logic

## File Structure

```
components/auth/
├── AuthButton.tsx
├── AuthDivider.tsx
├── AuthHeader.tsx
├── AuthInput.tsx
├── PasswordInput.tsx
├── SocialAuthButtons.tsx
├── TermsCheckbox.tsx
└── index.ts (exports all components)
```

## Import Example

```tsx
import {
  AuthButton,
  AuthDivider,
  AuthHeader,
  AuthInput,
  PasswordInput,
  SocialAuthButtons,
  TermsCheckbox,
} from "@/components/auth";
```
