import rawData from "./lessons.json";
import { fetchLessons as fetchLessonsFromAPI } from "@/services/lessons";

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
    | "numbers-introduction"
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
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  audio?: string;
  image?: string; // For dialogue and other activities with images
  items?: any[]; // For vocabulary-table, spelling-completion, etc.
  pairs?: { left: string; right: string }[]; // For matching activities
  conversation?: { speaker: string; text: string; translation: string }[]; // For conversation-practice
  dialogue?: {
    speaker: string;
    text: string;
    translation: string;
    audio: string;
  }[]; // For dialogue activities
}

export interface Lesson {
  id: string;
  phrase: string;
  meaning: string;
  audio?: string;
  pronunciation?: string;
  example?: string;
  exampleTranslation?: string;
  alphabetImage?: string;
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
  lessons: Lesson[];
  xpReward: number;
}

export interface LearningPath {
  id: string;
  name: string;
  units: Unit[];
  totalXP: number;
}

// Static fallback data from JSON file (for offline or development use)
export const mockLessonsData: LearningPath = rawData as LearningPath;

/**
 * Fetch lessons from the API
 * Falls back to static data if API call fails
 */
export const getLessonsData = async (level?: string): Promise<LearningPath> => {
  try {
    const data = await fetchLessonsFromAPI(level);
    return data;
  } catch (error) {
    console.warn("Failed to fetch lessons from API, using static data:", error);
    return mockLessonsData;
  }
};

export default mockLessonsData;
