import { PrismaClient } from "@prisma/client";
import { calculateStreakBonusXP } from "./xpCalculator";
import { awardXP } from "./xpService";

const prisma = new PrismaClient();

/**
 * Streak calculation service
 */

/**
 * Calculate current streak for a user
 */
export async function calculateCurrentStreak(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get all streak days in descending order
  const dailyActivities = await prisma.userDailyActivity.findMany({
    where: {
      userId,
      isStreakDay: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  if (dailyActivities.length === 0) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(today);

  // Check if the most recent activity is today or yesterday
  // If the most recent activity is older than yesterday, streak is 0 (unless we are checking strictly for today)
  // But here we want to calculate the streak *including* today if applicable.

  // If the first activity is not today, we check if it's yesterday.
  // If it's not today and not yesterday, streak is broken (0).
  // However, if the user hasn't done anything today yet, the streak from yesterday should still be valid (but not incremented for today).
  // But this function is usually called after an activity, so today should be present.

  // Let's stick to the logic: count consecutive days backwards from today.

  for (const activity of dailyActivities) {
    const activityDate = new Date(activity.date);
    activityDate.setHours(0, 0, 0, 0);

    // Check if this activity is on the expected date
    if (activityDate.getTime() === checkDate.getTime()) {
      streak++;
      // Move to previous day
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (activityDate.getTime() > checkDate.getTime()) {
      // Should not happen with desc sort, but just in case
      continue;
    } else {
      // Gap found
      // If the gap is just today (meaning user hasn't done anything today),
      // and we are checking streak, maybe we should allow it?
      // But this function is called "calculateCurrentStreak".
      // Usually "current streak" implies active streak.
      // If I missed yesterday, streak is 0.

      // If I haven't done today yet, but did yesterday, streak is X.
      // If I do today, streak becomes X+1.

      // The loop checks `checkDate` which starts at `today`.
      // If `dailyActivities[0]` is yesterday, then `activityDate != checkDate` (today).
      // So it goes to `else`.

      // We should probably handle the case where today is missing but yesterday exists.
      if (
        streak === 0 &&
        activityDate.getTime() === checkDate.getTime() - 86400000
      ) {
        // Today is missing, but yesterday is present.
        // Streak starts from yesterday.
        streak++;
        checkDate.setDate(checkDate.getDate() - 2); // Move to day before yesterday
      } else {
        break;
      }
    }
  }

  return streak;
}

/**
 * Update user streak and award bonuses
 */
export async function updateUserStreak(userId: string): Promise<number> {
  const streak = await calculateCurrentStreak(userId);

  // Update user record
  await prisma.user.update({
    where: { id: userId },
    data: { currentStreakDays: streak },
  });

  // Calculate and award bonus
  const bonus = calculateStreakBonusXP(streak);
  if (bonus > 0) {
    const today = new Date(new Date().setHours(0, 0, 0, 0));

    await awardXP({
      userId,
      amount: bonus,
      sourceType: "streak_milestone",
      sourceId: `streak_${streak}_${today.toISOString().split("T")[0]}`,
      metadata: { streakDays: streak, milestone: true },
    });

    // Update daily activity to include bonus
    await prisma.userDailyActivity.upsert({
      where: { userId_date: { userId, date: today } },
      create: {
        userId,
        date: today,
        xpEarned: bonus,
        isStreakDay: true,
      },
      update: {
        xpEarned: { increment: bonus },
      },
    });
  }
  return streak;
}

/**
 * Update or create daily activity record
 */
export async function updateDailyActivity(
  userId: string,
  data: {
    unitsCompleted?: number;
    activitiesCompleted?: number;
    timeSpent?: number;
    xpEarned?: number;
  }
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.userDailyActivity.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    create: {
      userId,
      date: today,
      unitsCompleted: data.unitsCompleted || 0,
      activitiesCompleted: data.activitiesCompleted || 0,
      timeSpent: data.timeSpent || 0,
      xpEarned: data.xpEarned || 0,
      isStreakDay: true, // Consider any activity as streak day
    },
    update: {
      unitsCompleted: {
        increment: data.unitsCompleted || 0,
      },
      activitiesCompleted: {
        increment: data.activitiesCompleted || 0,
      },
      timeSpent: {
        increment: data.timeSpent || 0,
      },
      xpEarned: {
        increment: data.xpEarned || 0,
      },
      isStreakDay: true,
    },
  });

  // Update the user's overall streak
  await updateUserStreak(userId);
}

/**
 * Check if today is a streak day for the user
 */
export async function isTodayStreakDay(userId: string): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailyActivity = await prisma.userDailyActivity.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });

  return dailyActivity?.isStreakDay || false;
}
