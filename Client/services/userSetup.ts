import { ENV } from "@/config/env";
import { auth } from "@/config/firebase";

export interface UserSetupData {
  language: string | null;
  level: string | null;
  placementScore: number | null;
  personalization: {
    reasons: string[];
    timeCommitment: string;
  } | null;
  currentStep: number;
  isCompleted: boolean;
}

export interface SetupResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Setup user profile after onboarding
 * This will send the user's onboarding choices to the backend
 *
 * @param userData - User onboarding data
 * @returns Promise with setup response
 */
export async function setupUserProfile(
  userData: UserSetupData
): Promise<SetupResponse> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const token = await user.getIdToken();

    const onboardingData = {
      selectedLanguage: userData.language,
      selectedLevel: userData.level,
      placementTestScore: userData.placementScore,
      personalization: userData.personalization,
    };

    const response = await fetch(`${ENV.API_BASE_URL}/onboarding/${user.uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(onboardingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    console.error("❌ Error setting up user profile:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get user profile setup status
 *
 * @param userId - User ID (optional, will use current authenticated user if not provided)
 * @returns Promise with setup status
 */
export async function getSetupStatus(userId?: string): Promise<any> {
  try {
    // Get current authenticated user
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Use provided userId or current user's ID
    const targetUserId = userId || user.uid;

    // Get Firebase authentication token
    const token = await user.getIdToken();

    console.log("📥 Getting setup status for user:", targetUserId);

    // Make actual API call to get onboarding data
    const response = await fetch(
      `${ENV.API_BASE_URL}/onboarding/${targetUserId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();

    console.log("✅ Setup status retrieved:", result);

    return {
      success: result.success,
      isSetupComplete: result.data?.isCompleted || false,
      data: result.data,
    };
  } catch (error) {
    console.error("❌ Error getting setup status:", error);
    throw error;
  }
}
