import { PrismaClient } from "@prisma/client";

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

  for (const activity of dailyActivities) {
    const activityDate = new Date(activity.date);
    activityDate.setHours(0, 0, 0, 0);

    // Check if this activity is on the expected date
    if (activityDate.getTime() === checkDate.getTime()) {
      streak++;
      // Move to previous day
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Streak broken
      break;
    }
  }

  return streak;
}

/**
 * Update or create daily activity record
 */
export async function updateDailyActivity(
  userId: string,
  data: {
    lessonsCompleted?: number;
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
      lessonsCompleted: data.lessonsCompleted || 0,
      activitiesCompleted: data.activitiesCompleted || 0,
      timeSpent: data.timeSpent || 0,
      xpEarned: data.xpEarned || 0,
      isStreakDay: true, // Consider any activity as streak day
    },
    update: {
      lessonsCompleted: {
        increment: data.lessonsCompleted || 0,
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
