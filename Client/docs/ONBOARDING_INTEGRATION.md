# Onboarding Backend Integration Guide

## Overview

This guide shows how to integrate the onboarding backend API with your client app to save user preferences.

## Setup

The onboarding service is located at `services/onboarding.ts` and provides two main functions:

- `saveOnboardingData()` - Save/update onboarding preferences
- `getOnboardingData()` - Retrieve saved preferences

## Integration in Personalization Screen

Update your final onboarding screen (`app/(onboarding)/personalization.tsx`) to save data to the backend:

```typescript
import { saveOnboardingData } from "@/services/onboarding";

const handleFinish = async () => {
  try {
    // Prepare personalization data
    const personalizationData = {
      reasons: selectedReasons,
      timeCommitment: selectedTime || "15min",
    };

    // Update context
    dispatch({
      type: "SET_PERSONALIZATION",
      payload: personalizationData,
    });

    // Prepare onboarding data for backend
    const onboardingData = {
      selectedLanguage: state.selectedLanguage!,
      selectedLevel: state.selectedLevel!,
      placementTestScore: state.placementTestScore,
      personalization: personalizationData,
    };

    // Save to backend
    const result = await saveOnboardingData(onboardingData);

    if (result.success) {
      console.log("✅ Onboarding data saved to database");
      // Complete onboarding
      dispatch({ type: "COMPLETE_ONBOARDING" });
      router.push("/(tabs)");
    } else {
      console.error("❌ Failed to save onboarding data:", result.message);
      // You can still proceed - user can update preferences later
      dispatch({ type: "COMPLETE_ONBOARDING" });
      router.push("/(tabs)");
    }
  } catch (error) {
    console.error("Error completing onboarding:", error);
    // Proceed anyway - user can update preferences later
    dispatch({ type: "COMPLETE_ONBOARDING" });
    router.push("/(tabs)");
  }
};
```

## Retrieving Saved Onboarding Data

You can retrieve the user's onboarding data on app load to restore their preferences:

```typescript
import { useEffect } from "react";
import { getOnboardingData } from "@/services/onboarding";
import { useOnboarding } from "@/contexts/OnboardingContext";

function App() {
  const { dispatch } = useOnboarding();

  useEffect(() => {
    const loadOnboardingData = async () => {
      const result = await getOnboardingData();

      if (result.success && result.data) {
        const {
          selectedLanguage,
          selectedLevel,
          placementTestScore,
          personalization,
        } = result.data;

        // Restore onboarding state from database
        if (selectedLanguage) {
          dispatch({ type: "SET_LANGUAGE", payload: selectedLanguage });
        }
        if (selectedLevel) {
          dispatch({ type: "SET_LEVEL", payload: selectedLevel });
        }
        if (placementTestScore !== null) {
          dispatch({
            type: "SET_PLACEMENT_SCORE",
            payload: placementTestScore,
          });
        }
        if (personalization) {
          dispatch({ type: "SET_PERSONALIZATION", payload: personalization });
        }
        if (result.data.isCompleted) {
          dispatch({ type: "COMPLETE_ONBOARDING" });
        }
      }
    };

    loadOnboardingData();
  }, [dispatch]);

  // ... rest of your app
}
```

## API Endpoints

### Save Onboarding Data

- **Endpoint**: `PUT /api/onboarding/:userId`
- **Authentication**: Required (Firebase token)
- **Automatic**: User ID is extracted from the authenticated user

### Get Onboarding Data

- **Endpoint**: `GET /api/onboarding/:userId`
- **Authentication**: Required (Firebase token)
- **Automatic**: User ID is extracted from the authenticated user

## Data Structure

```typescript
interface OnboardingData {
  selectedLanguage: "sw" | "zu" | "ln" | "xh";
  selectedLevel: "absolute-beginner" | "beginner" | "refresher";
  placementTestScore?: number | null;
  personalization?: {
    reasons: string[];
    timeCommitment: "5min" | "15min" | "30min" | "60min";
  } | null;
}
```

## Error Handling

The service functions return a response object:

```typescript
interface OnboardingResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: {
    field: string;
    message: string;
  }[];
}
```

Always check `result.success` before proceeding:

```typescript
const result = await saveOnboardingData(data);
if (result.success) {
  // Success
  console.log("Saved:", result.data);
} else {
  // Error
  console.error("Error:", result.message);
  if (result.errors) {
    result.errors.forEach((err) => {
      console.error(`${err.field}: ${err.message}`);
    });
  }
}
```

## Security

- All API calls require Firebase authentication
- The user can only save/retrieve their own data
- The backend validates that the authenticated user matches the requested user ID
- Invalid tokens or unauthorized access attempts return 403 Forbidden

## Testing

You can test the API endpoints using the examples in `/Server/docs/ONBOARDING_API.md`
