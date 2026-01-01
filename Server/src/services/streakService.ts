import { PrismaClient } from "@prisma/client";
import { dateFromDateKey, getDateKeyInTimeZone } from "../utils/dateKey";

const prisma = new PrismaClient();

/**
 * Streak calculation service
 */

/**
 * Calculate current streak for a user
 */
export async function calculateCurrentStreak(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentStreakDays: true },
  });

  return user?.currentStreakDays ?? 0;
}

/**
 * Update user streak and award bonuses
 */
export async function updateUserStreak(_userId: string): Promise<number> {
  // Streaks are maintained by xpService when XP is awarded.
  // Keep this function for backward compatibility.
  return 0;
}

/**
 * Update or create daily activity record
 */
export async function updateDailyActivity(
  userId: string,
  data: {
    unitsCompleted?: number;
    activitiesCompleted?: number;
    xpEarned?: number;
  }
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true },
  });

  const todayKey = getDateKeyInTimeZone(
    new Date(),
    user?.timezone || undefined
  );
  const todayDate = dateFromDateKey(todayKey);

  await prisma.userDailyActivity.upsert({
    where: {
      userId_date: {
        userId,
        date: todayDate,
      },
    },
    create: {
      userId,
      date: todayDate,
      unitsCompleted: data.unitsCompleted || 0,
      activitiesCompleted: data.activitiesCompleted || 0,
      xpEarned: data.xpEarned || 0,
    },
    update: {
      unitsCompleted: {
        increment: data.unitsCompleted || 0,
      },
      activitiesCompleted: {
        increment: data.activitiesCompleted || 0,
      },
      xpEarned: {
        increment: data.xpEarned || 0,
      },
    },
  });
}

/**
 * Check if today is a streak day for the user
 */
export async function isTodayStreakDay(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true },
  });

  const todayKey = getDateKeyInTimeZone(
    new Date(),
    user?.timezone || undefined
  );
  const todayDate = dateFromDateKey(todayKey);

  const dailyActivity = await prisma.userDailyActivity.findUnique({
    where: {
      userId_date: {
        userId,
        date: todayDate,
      },
    },
  });

  return dailyActivity?.isStreakDay || false;
}
