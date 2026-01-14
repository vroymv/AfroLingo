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

// Note: The app currently fetches Units directly from the API (see LessonsTab / LessonPlayer).
// Keep this module focused on shared types.

export const mockLessonsData: LearningPath = {
  id: "main-path",
  name: "African Languages Journey",
  units: [],
  totalXP: 0,
};

export const getLessonsData = async (): Promise<LearningPath> =>
  mockLessonsData;

export default mockLessonsData;
