# Onboarding API Documentation

## Overview

The Onboarding API allows the client to save and retrieve user onboarding preferences, including language selection, proficiency level, placement test scores, and personalization settings.

## Authentication

All endpoints require a valid Firebase authentication token in the `Authorization` header:

```
Authorization: Bearer <firebase-token>
```

## Endpoints

### 1. Save/Update Onboarding Data

**Endpoint:** `PUT /api/onboarding/:userId`

**Description:** Saves or updates a user's onboarding selections to the database.

**URL Parameters:**

- `userId` (string, required): The Firebase UID of the user

**Request Body:**

```typescript
{
  "selectedLanguage": "sw" | "zu" | "ln" | "xh",
  "selectedLevel": "absolute-beginner" | "beginner" | "refresher",
  "placementTestScore": number | null,  // Optional, 0-100
  "personalization": {                   // Optional
    "reasons": string[],                 // At least one reason required if provided
    "timeCommitment": "5min" | "15min" | "30min" | "60min"
  } | null
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Onboarding data saved successfully",
  "data": {
    "id": "firebase-uid",
    "email": "user@example.com",
    "name": "User Name",
    "selectedLanguage": "sw",
    "selectedLevel": "absolute-beginner",
    "placementTestScore": null,
    "learningReasons": ["cultural-connection", "travel"],
    "timeCommitment": "15min",
    "onboardingCompleted": true,
    "onboardingCompletedAt": "2025-11-09T12:00:00.000Z",
    "createdAt": "2025-11-09T10:00:00.000Z",
    "updatedAt": "2025-11-09T12:00:00.000Z"
  }
}
```

**Error Responses:**

_400 Bad Request_ - Validation error:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "selectedLanguage",
      "message": "Invalid language selection"
    }
  ]
}
```

_403 Forbidden_ - Unauthorized:

```json
{
  "success": false,
  "message": "Unauthorized: Cannot update another user's onboarding data"
}
```

_404 Not Found_ - User doesn't exist:

```json
{
  "success": false,
  "message": "User not found. Please create a user account first."
}
```

---

### 2. Get Onboarding Data

**Endpoint:** `GET /api/onboarding/:userId`

**Description:** Retrieves a user's onboarding preferences.

**URL Parameters:**

- `userId` (string, required): The Firebase UID of the user

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Onboarding data retrieved successfully",
  "data": {
    "isCompleted": true,
    "selectedLanguage": "sw",
    "selectedLevel": "absolute-beginner",
    "placementTestScore": null,
    "personalization": {
      "reasons": ["cultural-connection", "travel"],
      "timeCommitment": "15min"
    }
  }
}
```

**Error Responses:**

_403 Forbidden_ - Unauthorized:

```json
{
  "success": false,
  "message": "Unauthorized: Cannot access another user's onboarding data"
}
```

_404 Not Found_ - User doesn't exist:

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Example Usage (React Native with Expo)

### Save Onboarding Data

```typescript
import { auth } from "@/config/firebase";

const saveOnboardingData = async (onboardingState: OnboardingState) => {
  try {
    // Get current user
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get authentication token
    const token = await user.getIdToken();

    // Prepare data
    const onboardingData = {
      selectedLanguage: onboardingState.selectedLanguage,
      selectedLevel: onboardingState.selectedLevel,
      placementTestScore: onboardingState.placementTestScore,
      personalization: onboardingState.personalization,
    };

    // Send request
    const response = await fetch(`${API_BASE_URL}/api/onboarding/${user.uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(onboardingData),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    console.log("Onboarding data saved:", result.data);
    return result.data;
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    throw error;
  }
};
```

### Retrieve Onboarding Data

```typescript
const getOnboardingData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const token = await user.getIdToken();

    const response = await fetch(`${API_BASE_URL}/api/onboarding/${user.uid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Error retrieving onboarding data:", error);
    throw error;
  }
};
```

---

## Integration with OnboardingContext

You can integrate this API with your existing `OnboardingContext`:

```typescript
// In your personalization.tsx or final onboarding screen

import { auth } from "@/config/firebase";
import { API_BASE_URL } from "@/config/env";

const handleFinish = async () => {
  try {
    // Set personalization in context
    dispatch({
      type: "SET_PERSONALIZATION",
      payload: {
        reasons: selectedReasons,
        timeCommitment: selectedTime || "15min",
      },
    });

    // Complete onboarding in context
    dispatch({ type: "COMPLETE_ONBOARDING" });

    // Save to database
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      const onboardingData = {
        selectedLanguage: state.selectedLanguage!,
        selectedLevel: state.selectedLevel!,
        placementTestScore: state.placementTestScore,
        personalization: {
          reasons: selectedReasons,
          timeCommitment: selectedTime || "15min",
        },
      };

      const response = await fetch(
        `${API_BASE_URL}/api/onboarding/${user.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(onboardingData),
        }
      );

      const result = await response.json();

      if (!result.success) {
        console.error("Failed to save onboarding data:", result.message);
        // You can still proceed to the main app even if API call fails
      }
    }

    // Navigate to main app
    router.push("/(tabs)");
  } catch (error) {
    console.error("Error completing onboarding:", error);
    // Proceed anyway - user can update preferences later
    router.push("/(tabs)");
  }
};
```

---

## Validation Rules

### Language Selection

- Must be one of: `"sw"`, `"zu"`, `"ln"`, `"xh"`

### Level Selection

- Must be one of: `"absolute-beginner"`, `"beginner"`, `"refresher"`

### Placement Test Score

- Optional
- If provided, must be a number between 0 and 100

### Personalization

- Optional
- If provided:
  - `reasons`: Array of strings, at least one required
  - `timeCommitment`: Must be one of `"5min"`, `"15min"`, `"30min"`, `"60min"`

---

## Security

- All endpoints require Firebase authentication
- Users can only access/update their own onboarding data
- The `userId` in the URL must match the authenticated user's UID
- Attempting to access another user's data will result in a 403 Forbidden error
