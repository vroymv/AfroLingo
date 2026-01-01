/**
 * XP Calculation Service
 * Calculates XP rewards based on activity performance
 */

import { XP_RULES, ActivityType } from "../config/xpRules";

export interface ActivityPerformance {
  isCorrect: boolean;
  attempts: number;
  hintsUsed: number;
  timeSpent: number; // in seconds
  activityType: string;
}

// Re-export rules for backward compatibility if needed, or just for convenience
export { XP_RULES };

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
  xp = Math.max(xp, XP_RULES.MIN_XP);

  // Apply Activity Type Bonus
  const typeKey = performance.activityType.toUpperCase() as ActivityType;
  // @ts-ignore - we handle the undefined case with DEFAULT
  const typeBonus = XP_RULES.ACTIVITY_TYPE_BONUS[typeKey] || XP_RULES.ACTIVITY_TYPE_BONUS.DEFAULT;
  
  xp += typeBonus;

  return xp;
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
  // Check for specific milestones
  // We cast the keys to numbers to ensure proper comparison
  const milestones = Object.keys(XP_RULES.STREAK_MILESTONES)
    .map(Number)
    .sort((a, b) => b - a); // Sort descending

  for (const milestone of milestones) {
    if (streakDays === milestone) {
      // @ts-ignore - we know the key exists
      return XP_RULES.STREAK_MILESTONES[milestone];
    }
  }
  
  // Optional: Return daily streak bonus for non-milestone days if desired
  // return XP_RULES.DAILY_STREAK_BONUS;
  
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
