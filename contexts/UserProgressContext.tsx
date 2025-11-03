import React, { createContext, ReactNode, useContext, useState } from "react";

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

interface UserProgressContextType {
  progress: UserProgress;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  completeLesson: (lessonId: string, xpEarned: number) => void;
  completePractice: (practiceId: string, xpEarned: number) => void;
  completeStory: (storyId: string, xpEarned: number) => void;
  unlockAchievement: (achievementId: string) => void;
}

const defaultProgress: UserProgress = {
  totalXP: 1250,
  currentStreak: 7,
  longestStreak: 12,
  lessonsCompleted: 15,
  storiesRead: 3,
  practiceSessionsCompleted: 8,
  lastActiveDate: new Date(),
  achievements: [
    {
      id: "first-lesson",
      title: "First Steps",
      description: "Complete your first lesson",
      icon: "🎯",
      unlocked: true,
      unlockedAt: new Date("2024-01-01"),
    },
    {
      id: "week-streak",
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      unlocked: true,
      unlockedAt: new Date("2024-01-07"),
    },
    {
      id: "story-reader",
      title: "Story Explorer",
      description: "Read your first cultural story",
      icon: "📚",
      unlocked: true,
      unlockedAt: new Date("2024-01-10"),
    },
    {
      id: "practice-master",
      title: "Practice Master",
      description: "Complete 10 practice sessions",
      icon: "⭐",
      unlocked: false,
    },
    {
      id: "month-streak",
      title: "Monthly Dedication",
      description: "Maintain a 30-day streak",
      icon: "👑",
      unlocked: false,
    },
  ],
};

const UserProgressContext = createContext<UserProgressContextType | undefined>(
  undefined
);

export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (!context) {
    throw new Error(
      "useUserProgress must be used within a UserProgressProvider"
    );
  }
  return context;
};

interface UserProgressProviderProps {
  children: ReactNode;
}

export const UserProgressProvider: React.FC<UserProgressProviderProps> = ({
  children,
}) => {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  const addXP = (amount: number) => {
    setProgress((prev) => ({
      ...prev,
      totalXP: prev.totalXP + amount,
    }));
  };

  const updateStreak = () => {
    const today = new Date();
    const lastActive = new Date(progress.lastActiveDate);
    const daysSinceLastActive = Math.floor(
      (today.getTime() - lastActive.getTime()) / (1000 * 3600 * 24)
    );

    if (daysSinceLastActive === 1) {
      // Continue streak
      setProgress((prev) => ({
        ...prev,
        currentStreak: prev.currentStreak + 1,
        longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
        lastActiveDate: today,
      }));
    } else if (daysSinceLastActive > 1) {
      // Reset streak
      setProgress((prev) => ({
        ...prev,
        currentStreak: 1,
        lastActiveDate: today,
      }));
    }
  };

  const completeLesson = (lessonId: string, xpEarned: number) => {
    setProgress((prev) => ({
      ...prev,
      lessonsCompleted: prev.lessonsCompleted + 1,
      totalXP: prev.totalXP + xpEarned,
    }));
    updateStreak();
  };

  const completePractice = (practiceId: string, xpEarned: number) => {
    setProgress((prev) => ({
      ...prev,
      practiceSessionsCompleted: prev.practiceSessionsCompleted + 1,
      totalXP: prev.totalXP + xpEarned,
    }));
    updateStreak();

    // Check for practice master achievement
    if (progress.practiceSessionsCompleted + 1 >= 10) {
      unlockAchievement("practice-master");
    }
  };

  const completeStory = (storyId: string, xpEarned: number) => {
    setProgress((prev) => ({
      ...prev,
      storiesRead: prev.storiesRead + 1,
      totalXP: prev.totalXP + xpEarned,
    }));
    updateStreak();
  };

  const unlockAchievement = (achievementId: string) => {
    setProgress((prev) => ({
      ...prev,
      achievements: prev.achievements.map((achievement) =>
        achievement.id === achievementId
          ? { ...achievement, unlocked: true, unlockedAt: new Date() }
          : achievement
      ),
    }));
  };

  const contextValue: UserProgressContextType = {
    progress,
    addXP,
    updateStreak,
    completeLesson,
    completePractice,
    completeStory,
    unlockAchievement,
  };

  return (
    <UserProgressContext.Provider value={contextValue}>
      {children}
    </UserProgressContext.Provider>
  );
};
