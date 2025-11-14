import { auth } from "@/config/firebase";

/**
 * Get API headers with user identification
 * Throws an error if user is not authenticated
 */
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated. Please login to continue.");
  }

  const userId = user.uid;

  if (!userId) {
    throw new Error("User ID not found. Please login again.");
  }

  return {
    "Content-Type": "application/json",
    "x-user-id": userId,
  };
};

/**
 * Get user ID from current authenticated user
 * Throws an error if user is not authenticated
 */
export const getCurrentUserId = (): string => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated. Please login to continue.");
  }

  const userId = user.uid;

  if (!userId) {
    throw new Error("User ID not found. Please login again.");
  }

  return userId;
};
