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
