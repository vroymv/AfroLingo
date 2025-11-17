/**
 * Shared type definitions for React Context providers
 */

import { ReactNode } from "react";

// ============================================
// Auth Context Types
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  emailVerified?: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}

// ============================================
// User Progress Context Types
// ============================================

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface UserProgress {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  storiesRead: number;
  practiceSessionsCompleted: number;
  achievements: Achievement[];
  lastActiveDate: Date;
}

export interface UserProgressContextType {
  progress: UserProgress;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  completeLesson: (lessonId: string, xpEarned: number) => void;
  completePractice: (practiceId: string, xpEarned: number) => void;
  completeStory: (storyId: string, xpEarned: number) => void;
  unlockAchievement: (achievementId: string) => void;
}

export interface UserProgressProviderProps {
  children: ReactNode;
}

// ============================================
// Onboarding Context Types
// ============================================

export interface OnboardingState {
  isCompleted: boolean;
  currentStep: number;
  selectedLanguage: string | null;
  selectedLevel: string | null;
  placementTestScore: number | null;
  personalization: {
    reasons: string[];
    timeCommitment: string;
  } | null;
}

export type OnboardingAction =
  | { type: "SET_LANGUAGE"; payload: string }
  | { type: "SET_LEVEL"; payload: string }
  | { type: "SET_PLACEMENT_SCORE"; payload: number }
  | {
      type: "SET_PERSONALIZATION";
      payload: { reasons: string[]; timeCommitment: string };
    }
  | { type: "SET_CURRENT_STEP"; payload: number }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "RESET" }
  | { type: "LOAD_STATE"; payload?: OnboardingState };

export interface OnboardingContextType {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  isLoading: boolean;
}

export interface OnboardingProviderProps {
  children: ReactNode;
}

// ============================================
// Lesson Progress Context Types
// ============================================

export interface ActiveLessonState {
  lessonId: string;
  unitId: string;
  lessonIndex: number; // index within unit
  activityIndex: number; // current activity index
  startedAt: Date;
  completed: boolean;
}

export interface LessonProgressContextType {
  activeLesson?: ActiveLessonState;
  lessonsData?: any; // LessonsData from services/lessons
  isLoading: boolean;
  error: string | null;
  startLesson: (lessonId: string) => Promise<void>;
  nextLessonId: () => string | undefined;
  completeLesson: () => void;
  advanceActivity: () => void;
  goToNextLesson: () => string | undefined;
  isInLesson: boolean;
  getLessonMeta: (lessonId: string) =>
    | {
        phrase: string;
        meaning: string;
        unitTitle: string;
        alphabetImage?: string;
        audio?: string;
      }
    | undefined;
  getCurrentActivity: () => any | undefined;
  refreshLessons: () => Promise<void>;
}

export interface LessonProgressProviderProps {
  children: ReactNode;
}
