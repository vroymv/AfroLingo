# User Setup Loading Screen

## Overview

After completing the onboarding process, users are shown a loading screen while their profile is being set up. This provides a smooth transition between onboarding and the main app interface.

## Flow

1. **Personalization Complete** → User finishes the personalization step
2. **Setup Loading Screen** → Shows animated loading with progress messages
3. **API Request** → Sends user preferences to backend (currently mocked)
4. **Main App** → Redirects to the main tabs interface

## Files Created/Modified

### New Files

- `/app/(onboarding)/setup-loading.tsx` - Loading screen component
- `/services/userSetup.ts` - API utilities for user profile setup

### Modified Files

- `/app/(onboarding)/_layout.tsx` - Added setup-loading screen to navigation stack
- `/app/(onboarding)/personalization.tsx` - Updated navigation to go to setup-loading instead of directly to tabs

## Setup Loading Screen Features

### Visual Elements

- Animated spinning globe icon (🌍)
- App name and branding
- Dynamic loading messages
- Animated loading dots with pulse effect
- Gradient background
- Patient message for user

### Loading Messages Sequence

1. "Creating your learning profile..."
2. "Personalizing your dashboard..."
3. "Preparing your first lesson..."
4. "Almost ready..."

### Animations

- **Fade In**: Smooth entrance animation
- **Globe Rotation**: Continuous 360° rotation (2s duration)
- **Dot Pulse**: Sequential loading dots animation with scale and opacity changes

## API Integration

### Current Implementation (Mocked)

The `userSetup.ts` service provides a fake API implementation that:

- Logs the setup data to console
- Simulates network delay (~2 seconds)
- Returns a success response
- Includes the API endpoint from environment config

### Data Sent to API

```typescript
{
  language: string | null,           // e.g., "sw", "zu", "ln", "xh"
  level: string | null,              // e.g., "beginner", "intermediate"
  placementScore: number | null,     // Test score if taken
  personalization: {
    reasons: string[],               // e.g., ["heritage", "family"]
    timeCommitment: string           // e.g., "15min", "30min"
  } | null
}
```

### Server Implementation (To Do)

When the backend is ready, uncomment the actual API call in `/services/userSetup.ts`:

```typescript
const response = await fetch(`${ENV.API_BASE_URL}/users/setup`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`, // Add when auth is implemented
  },
  body: JSON.stringify(userData),
});

const result = await response.json();
return result;
```

### Expected API Endpoint

- **URL**: `${EXPO_PUBLIC_API_BASE_URL}/users/setup`
- **Method**: POST
- **Content-Type**: application/json

### Expected Response Format

```typescript
{
  success: boolean,
  message: string,
  data?: {
    userId: string,
    profileCreated: boolean,
    dashboardReady: boolean,
    // ... other relevant data
  }
}
```

## Environment Configuration

The API endpoint is configured in `.env`:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

For production, update to your production URL:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-domain.com/api
```

## Error Handling

Currently, errors are handled gracefully:

- Errors are logged to console
- User is still redirected to main app
- No error UI is shown to user

**Future Improvement**: Show error message and retry option when setup fails.

## Testing

To test the loading screen:

1. Run the app
2. Go through the onboarding flow
3. Complete the personalization step
4. You should see the setup loading screen for ~4 seconds
5. Check the console logs to see the mocked API data

### Console Output

You should see:

```
Setting up user profile with data: { language: "sw", ... }

```

## Future Enhancements

1. **Error UI**: Display user-friendly error messages
2. **Retry Logic**: Allow users to retry if setup fails
3. **Progress Bar**: Show actual progress percentage
4. **Cancel Option**: Allow users to cancel and retry later
5. **Offline Support**: Queue setup for when connection is restored
6. **Success Animation**: Show a celebration animation on successful setup

## Notes for Backend Team

The server should create an endpoint that:

1. Accepts the user setup data (see data format above)
2. Creates/updates the user profile in the database
3. Sets up initial learning progress
4. Prepares personalized lesson recommendations
5. Returns confirmation with user ID and profile status

**Important**: The server is a separate project, so coordinate on:

- API endpoint structure
- Authentication tokens
- Response format
- Error codes and messages
