import { ENV } from "@/config/env";
import { getAuthHeaders } from "./apiClient";

/**
 * Interface for Lesson data
 */
export interface Activity {
  id: string;
  type:
    | "introduction"
    | "alphabet"
    | "flashcard"
    | "multiple-choice"
    | "listening"
    | "listening-dictation"
    | "vocabulary-fill-in"
    | "vocabulary-table"
    | "alphabet-vocabulary-table"
    | "numbers-table"
    | "numbers-listening"
    | "numbers-translation"
    | "matching"
    | "spelling-completion"
    | "conversation-practice"
    | "dialogue"
    | "speaking";
  question?: string;
  description?: string;
  audio?: string;
  options?: any;
  correctAnswer?: any;
  explanation?: string;
  items?: any;
  pairs?: any;
  conversation?: any;
  dialogue?: any;
  alphabetImage?: string;
  image?: string;
}

export interface Lesson {
  id: string;
  phrase: string;
  meaning: string;
  pronunciation?: string;
  alphabetImage?: string;
  audio?: string;
  example?: string;
  exampleTranslation?: string;
  activities: Activity[];
  // User progress fields (when fetching with user data)
  isStarted?: boolean;
  isCompleted?: boolean;
  progress?: number;
  currentActivityIndex?: number;
  completedActivities?: number;
  totalActivities?: number;
  accuracyRate?: number | null;
  xpEarned?: number;
  lastAccessedAt?: string | null;
}

export interface Unit {
  id: string;
  title: string;
  level:
    | "Absolute Beginner"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Refresher";
  progress: number;
  totalLessons: number;
  completedLessons: number;
  icon: string;
  color: string;
  xpReward: number;
  xpEarned?: number; // XP earned by user for this unit
  lessons: Lesson[];
}

export interface LessonsData {
  id: string;
  name: string;
  totalXP: number;
  units: Unit[];
}

/**
 * API Response wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Fetch all lessons with units and activities
 *
 * @param level - Optional filter by level (e.g., "Absolute Beginner", "Beginner")
 * @param includeActivities - Whether to include activities in the response (default: true)
 * @returns Promise<LessonsData>
 *
 * @example
 * const lessons = await fetchLessons();
 * const beginnerLessons = await fetchLessons("Absolute Beginner");
 */
export const fetchLessons = async (
  level?: string,
  includeActivities: boolean = true
): Promise<LessonsData> => {
  try {
    const params = new URLSearchParams();
    if (level) params.append("level", level);
    params.append("includeActivities", includeActivities.toString());

    const headers = await getAuthHeaders();

    const response = await fetch(
      `${ENV.API_ENDPOINTS.LESSONS}?${params.toString()}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch lessons: ${response.statusText}`);
    }

    const result: ApiResponse<LessonsData> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Failed to fetch lessons");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};

/**
 * Fetch a specific lesson by ID
 *
 * @param lessonId - The lesson ID to fetch
 * @returns Promise<Lesson & { unit: any }>
 *
 * @example
 * const lesson = await fetchLessonById("lesson-alphabet");
 */
export const fetchLessonById = async (
  lessonId: string
): Promise<Lesson & { unit: any }> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${ENV.API_ENDPOINTS.LESSONS}/${lessonId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lesson: ${response.statusText}`);
    }

    const result: ApiResponse<Lesson & { unit: any }> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Lesson not found");
    }

    return result.data;
  } catch (error) {
    console.error(`Error fetching lesson ${lessonId}:`, error);
    throw error;
  }
};

/**
 * Fetch all lessons for a specific unit
 *
 * @param unitId - The unit ID to fetch lessons for
 * @param includeActivities - Whether to include activities in the response (default: true)
 * @returns Promise<Unit>
 *
 * @example
 * const unitLessons = await fetchLessonsByUnit("unit-1");
 */
export const fetchLessonsByUnit = async (
  unitId: string,
  includeActivities: boolean = true
): Promise<Unit> => {
  try {
    const params = new URLSearchParams();
    params.append("includeActivities", includeActivities.toString());

    const headers = await getAuthHeaders();

    const response = await fetch(
      `${ENV.API_ENDPOINTS.LESSONS}/unit/${unitId}?${params.toString()}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch unit lessons: ${response.statusText}`);
    }

    const result: ApiResponse<Unit> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Unit not found");
    }

    return result.data;
  } catch (error) {
    console.error(`Error fetching lessons for unit ${unitId}:`, error);
    throw error;
  }
};

/**
 * Fetch all lessons with user progress
 *
 * @param userId - The user ID to fetch progress for
 * @param level - Optional filter by level (e.g., "Absolute Beginner", "Beginner")
 * @param includeActivities - Whether to include activities in the response (default: true)
 * @returns Promise<LessonsData>
 *
 * @example
 * const userLessons = await fetchLessonsWithProgress("user-123");
 * const userBeginnerLessons = await fetchLessonsWithProgress("user-123", "Absolute Beginner");
 */
export const fetchLessonsWithProgress = async (
  userId: string,
  level?: string,
  includeActivities: boolean = true
): Promise<LessonsData> => {
  try {
    const params = new URLSearchParams();
    if (level) params.append("level", level);
    params.append("includeActivities", includeActivities.toString());

    const headers = await getAuthHeaders();

    const response = await fetch(
      `${ENV.API_ENDPOINTS.LESSONS}/user/${userId}?${params.toString()}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch lessons with progress: ${response.statusText}`
      );
    }

    const result: ApiResponse<LessonsData> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Failed to fetch lessons with progress"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching lessons with progress:", error);
    throw error;
  }
};

/**
 * Start or resume a lesson
 *
 * @param lessonId - The lesson ID to start
 * @returns Promise<any>
 *
 * @example
 * const progress = await startLesson("lesson-alphabet");
 */
export const startLessonApi = async (lessonId: string): Promise<any> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${ENV.API_BASE_URL}/progress/lessons/${lessonId}/start`,
      {
        method: "POST",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to start lesson: ${response.statusText}`);
    }

    const result: ApiResponse<any> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Failed to start lesson");
    }

    return result.data;
  } catch (error) {
    console.error(`Error starting lesson ${lessonId}:`, error);
    throw error;
  }
};

/**
 * Complete a lesson
 *
 * @param lessonId - The lesson ID to complete
 * @param finalScore - Optional final score (default: 100)
 * @returns Promise<any>
 *
 * @example
 * const result = await completeLesson("lesson-alphabet", 95);
 */
export const completeLessonApi = async (
  lessonId: string,
  finalScore: number = 100
): Promise<any> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${ENV.API_BASE_URL}/progress/lessons/${lessonId}/complete`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ finalScore }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to complete lesson: ${response.statusText}`);
    }

    const result: ApiResponse<any> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Failed to complete lesson");
    }

    return result.data;
  } catch (error) {
    console.error(`Error completing lesson ${lessonId}:`, error);
    throw error;
  }
};

/**
 * Get lesson progress for a specific lesson
 *
 * @param lessonId - The lesson ID to get progress for
 * @returns Promise<any>
 *
 * @example
 * const progress = await getLessonProgress("lesson-alphabet");
 */
export const getLessonProgress = async (lessonId: string): Promise<any> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${ENV.API_BASE_URL}/progress/lessons/${lessonId}/progress`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get lesson progress: ${response.statusText}`);
    }

    const result: ApiResponse<any> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Failed to get lesson progress");
    }

    return result.data;
  } catch (error) {
    console.error(`Error getting progress for lesson ${lessonId}:`, error);
    throw error;
  }
};
