/**
 * XP Rules Configuration
 * Defines the XP awarded for various actions and achievements in the app.
 */

export const XP_RULES = {
  // Activity Performance
  PERFECT_SCORE: 15, // First try, no hints
  GOOD_SCORE: 10, // < 3 attempts, no hints
  COMPLETED: 5, // Completed with attempts or hints
  HINT_PENALTY: 2, // -2 XP per hint (min 2 XP)
  MIN_XP: 2, // Minimum XP for any completed activity

  // Activity Type Bonuses (Added on top of performance score)
  ACTIVITY_TYPE_BONUS: {
    LISTENING: 5,
    SPEAKING: 5,
    READING: 2,
    WRITING: 3,
    GRAMMAR: 3,
    VOCABULARY: 2,
    DEFAULT: 0,
  },

  // Lesson Bonuses
  LESSON_COMPLETION: 20,
  PERFECT_LESSON: 50, // All activities perfect
  SPEED_BONUS: 10, // Completed faster than average

  // Daily Streak Bonuses
  DAILY_STREAK_BONUS: 5, // Base bonus for maintaining a streak
  STREAK_MILESTONES: {
    7: 50,
    14: 100,
    30: 250,
    50: 500,
    100: 1000,
    365: 5000,
  },

  // Other Bonuses
  DAILY_GOAL_MET: 20, // Met daily XP goal
};

export type ActivityType = keyof typeof XP_RULES.ACTIVITY_TYPE_BONUS;
