/**
 * XP Calculation Service
 * Calculates XP rewards based on activity performance
 */

export interface ActivityPerformance {
  isCorrect: boolean;
  attempts: number;
  hintsUsed: number;
  timeSpent: number; // in seconds
  activityType: string;
}

export const XP_RULES = {
  PERFECT_SCORE: 10, // First try, no hints
  GOOD_SCORE: 7, // < 3 attempts, no hints
  COMPLETED: 5, // Completed with attempts or hints
  HINT_PENALTY: 1, // -1 XP per hint (min 2 XP)
  MIN_XP: 2, // Minimum XP for any completed activity

  // Lesson bonuses
  LESSON_COMPLETION: 15,
  PERFECT_LESSON: 25, // All activities perfect
  SPEED_BONUS: 5, // Completed faster than average

  // Streak bonuses
  STREAK_7_DAYS: 50,
  STREAK_30_DAYS: 100,
  STREAK_100_DAYS: 500,
};

/**
 * Calculate XP for a single activity
 */
export function calculateActivityXP(performance: ActivityPerformance): number {
  if (!performance.isCorrect) {
    return 0; // No XP for incorrect answers
  }

  let xp = 0;

  // Base XP calculation
  if (performance.attempts === 1 && performance.hintsUsed === 0) {
    // Perfect score
    xp = XP_RULES.PERFECT_SCORE;
  } else if (performance.attempts < 3 && performance.hintsUsed === 0) {
    // Good score
    xp = XP_RULES.GOOD_SCORE;
  } else {
    // Just completed
    xp = XP_RULES.COMPLETED;
  }

  // Apply hint penalty
  if (performance.hintsUsed > 0) {
    xp -= performance.hintsUsed * XP_RULES.HINT_PENALTY;
  }

  // Ensure minimum XP
  return Math.max(xp, XP_RULES.MIN_XP);
}

/**
 * Calculate bonus XP for lesson completion
 */
export function calculateLessonBonusXP(
  _accuracyRate: number, // Prefix with underscore to indicate intentionally unused
  perfectActivities: number,
  totalActivities: number,
  avgTimePerActivity: number,
  expectedAvgTime: number = 60 // 60 seconds default
): number {
  let bonusXP = XP_RULES.LESSON_COMPLETION;

  // Perfect lesson bonus
  if (perfectActivities === totalActivities && totalActivities > 0) {
    bonusXP += XP_RULES.PERFECT_LESSON;
  }

  // Speed bonus (if faster than expected average)
  if (avgTimePerActivity < expectedAvgTime) {
    bonusXP += XP_RULES.SPEED_BONUS;
  }

  return bonusXP;
}

/**
 * Calculate streak bonus XP
 */
export function calculateStreakBonusXP(streakDays: number): number {
  if (streakDays >= 100) {
    return XP_RULES.STREAK_100_DAYS;
  } else if (streakDays >= 30) {
    return XP_RULES.STREAK_30_DAYS;
  } else if (streakDays >= 7) {
    return XP_RULES.STREAK_7_DAYS;
  }
  return 0;
}

/**
 * Check if activity performance is perfect
 */
export function isPerfectScore(performance: ActivityPerformance): boolean {
  return (
    performance.isCorrect &&
    performance.attempts === 1 &&
    performance.hintsUsed === 0
  );
}
