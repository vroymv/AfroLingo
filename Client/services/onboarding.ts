import { ENV } from "@/config/env";
import { getAuthHeaders, getCurrentUserId } from "./apiClient";

/**
 * Interface matching the OnboardingState from OnboardingContext
 */
export interface OnboardingData {
  selectedLanguage: string;
  selectedLevel: string;
  placementTestScore?: number | null;
  personalization?: {
    reasons: string[];
    timeCommitment: string;
  } | null;
}

/**
 * Response from the onboarding API
 */
export interface OnboardingResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: {
    field: string;
    message: string;
  }[];
}

/**
 * Save or update user's onboarding selections to the database
 *
 * @param onboardingData - The onboarding data to save
 * @returns Promise<OnboardingResponse>
 *
 * @example
 * const result = await saveOnboardingData({
 *   selectedLanguage: "sw",
 *   selectedLevel: "absolute-beginner",
 *   placementTestScore: null,
 *   personalization: {
 *     reasons: ["cultural-connection", "travel"],
 *     timeCommitment: "15min"
 *   }
 * });
 */
export const saveOnboardingData = async (
  onboardingData: OnboardingData
): Promise<OnboardingResponse> => {
  try {
    // Get user ID and headers
    const userId = getCurrentUserId();
    const headers = await getAuthHeaders();

    // Send request
    const response = await fetch(`${ENV.API_BASE_URL}/onboarding/${userId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(onboardingData),
    });

    const result: OnboardingResponse = await response.json();

    if (!result.success) {
      console.error("Failed to save onboarding data:", result.message);
    }

    return result;
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Retrieve user's onboarding data from the database
 *
 * @returns Promise<OnboardingResponse>
 *
 * @example
 * const result = await getOnboardingData();
 * if (result.success) {
 *   console.log('User onboarding data:', result.data);
 * }
 */
export const getOnboardingData = async (): Promise<OnboardingResponse> => {
  try {
    const userId = getCurrentUserId();
    const headers = await getAuthHeaders();

    const response = await fetch(`${ENV.API_BASE_URL}/onboarding/${userId}`, {
      method: "GET",
      headers,
    });

    const result: OnboardingResponse = await response.json();

    if (!result.success) {
      console.error("Failed to retrieve onboarding data:", result.message);
    }

    return result;
  } catch (error) {
    console.error("Error retrieving onboarding data:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
