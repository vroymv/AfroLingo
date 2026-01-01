/**
 * XP Service
 * Handles XP transactions and calculations across the app
 */

import { prisma } from "../config/prisma";
import { XP_RULES } from "../config/xpRules";
import type { Prisma } from "@prisma/client";
import {
  addDaysToDateKey,
  dateFromDateKey,
  getDateKeyInTimeZone,
} from "../utils/dateKey";

export type XPSourceType =
  | "activity_completion"
  | "unit_completion"
  | "lesson_completion"
  | "streak_milestone"
  | "daily_streak"
  | "daily_goal_met"
  | "perfect_unit"
  | "speed_bonus"
  | "manual_adjustment"
  | "bonus_reward";

export interface AwardXPParams {
  userId: string;
  amount: number;
  sourceType: XPSourceType;
  sourceId: string;
  metadata?: Record<string, any>;
  skipDuplicateCheck?: boolean; // For cases where duplicates are expected
}

/**
 * Award XP to a user and create a transaction record
 */
export async function awardXP(params: AwardXPParams): Promise<{
  success: boolean;
  xpAwarded: number;
  isDuplicate: boolean;
  totalXP: number;
}> {
  const {
    userId,
    amount,
    sourceType,
    sourceId,
    metadata = {},
    skipDuplicateCheck = false,
  } = params;

  // Generate idempotency key
  const idempotencyKey = `${sourceType}_${sourceId}_${userId}`;

  // Ensure XP award + streak updates are consistent.
  const txResult = await prisma.$transaction(async (tx) => {
    // Check for duplicate transaction (unless skip is true)
    if (!skipDuplicateCheck) {
      const existingTransaction = await tx.xpTransaction.findFirst({
        where: { idempotencyKey },
        select: { id: true },
      });

      if (existingTransaction) {
        return {
          xpAwarded: 0,
          isDuplicate: true,
        };
      }
    }

    // Create transaction
    await tx.xpTransaction.create({
      data: {
        userId,
        amount,
        sourceType,
        sourceId,
        idempotencyKey: skipDuplicateCheck
          ? `${idempotencyKey}_${Date.now()}`
          : idempotencyKey,
        metadata,
      },
    });

    // Update streak and daily activity ONLY for positive XP.
    // Negative XP does not unqualify a streak day.
    if (amount > 0) {
      await applyStreakFromPositiveXp({
        tx,
        userId,
        xpDelta: amount,
        sourceType,
      });
    }

    return {
      xpAwarded: amount,
      isDuplicate: false,
    };
  });

  // Get updated total
  const totalXP = await getTotalXP(userId);

  return {
    success: true,
    xpAwarded: txResult.xpAwarded,
    isDuplicate: txResult.isDuplicate,
    totalXP,
  };
}

const STREAK_XP_THRESHOLD = 10;

async function applyStreakFromPositiveXp(params: {
  tx: Prisma.TransactionClient;
  userId: string;
  xpDelta: number;
  sourceType: XPSourceType;
}): Promise<void> {
  const { tx, userId, xpDelta, sourceType } = params;

  const user = await tx.user.findUnique({
    where: { id: userId },
    select: {
      timezone: true,
      dailyXpGoal: true,
      dailyLessonGoal: true,
      currentStreakDays: true,
      longestStreakDays: true,
      lastStreakDate: true,
    },
  });

  if (!user) return;

  const todayKey = getDateKeyInTimeZone(new Date(), user.timezone || undefined);
  const todayDate = dateFromDateKey(todayKey);

  const existingDaily = await tx.userDailyActivity.findUnique({
    where: {
      userId_date: {
        userId,
        date: todayDate,
      },
    },
    select: {
      xpEarned: true,
      isStreakDay: true,
      goalXp: true,
      goalLessons: true,
    },
  });

  const previousXpEarned = existingDaily?.xpEarned ?? 0;
  const nextXpEarned = previousXpEarned + xpDelta;
  const nextIsStreakDay = nextXpEarned >= STREAK_XP_THRESHOLD;

  const shouldIncrementActivities = sourceType === "activity_completion";
  const shouldIncrementUnits =
    sourceType === "unit_completion" || sourceType === "lesson_completion";

  if (!existingDaily) {
    await tx.userDailyActivity.create({
      data: {
        userId,
        date: todayDate,
        xpEarned: xpDelta,
        isStreakDay: nextIsStreakDay,
        goalXp: user.dailyXpGoal,
        goalLessons: user.dailyLessonGoal,
        activitiesCompleted: shouldIncrementActivities ? 1 : 0,
        unitsCompleted: shouldIncrementUnits ? 1 : 0,
      },
    });
  } else {
    const updateData: Prisma.UserDailyActivityUpdateInput = {
      xpEarned: { increment: xpDelta },
      isStreakDay: nextIsStreakDay,
      goalXp: existingDaily.goalXp ?? user.dailyXpGoal,
      goalLessons:
        existingDaily.goalLessons ?? user.dailyLessonGoal ?? undefined,
    };

    if (shouldIncrementActivities) {
      updateData.activitiesCompleted = { increment: 1 };
    }

    if (shouldIncrementUnits) {
      updateData.unitsCompleted = { increment: 1 };
    }

    await tx.userDailyActivity.update({
      where: {
        userId_date: {
          userId,
          date: todayDate,
        },
      },
      data: updateData,
    });
  }

  const justQualified =
    nextIsStreakDay && !(existingDaily?.isStreakDay ?? false);
  if (!justQualified) return;

  const lastKey = user.lastStreakDate
    ? user.lastStreakDate.toISOString().split("T")[0]
    : null;

  if (lastKey === todayKey) {
    return;
  }

  const yesterdayKey = addDaysToDateKey(todayKey, -1);
  const nextCurrentStreakDays =
    lastKey === yesterdayKey ? user.currentStreakDays + 1 : 1;
  const nextLongest = Math.max(user.longestStreakDays, nextCurrentStreakDays);

  await tx.user.update({
    where: { id: userId },
    data: {
      currentStreakDays: nextCurrentStreakDays,
      longestStreakDays: nextLongest,
      lastStreakDate: todayDate,
    },
  });
}

/**
 * Get total XP for a user
 */
export async function getTotalXP(userId: string): Promise<number> {
  const result = await prisma.xpTransaction.aggregate({
    where: { userId },
    _sum: {
      amount: true,
    },
  });

  return result._sum.amount || 0;
}

/**
 * Get XP breakdown by source type
 */
export async function getXPBreakdown(
  userId: string
): Promise<Record<string, number>> {
  const transactions = await prisma.xpTransaction.groupBy({
    by: ["sourceType"],
    where: { userId },
    _sum: {
      amount: true,
    },
  });

  const breakdown: Record<string, number> = {};
  transactions.forEach((tx) => {
    breakdown[tx.sourceType] = tx._sum.amount || 0;
  });

  return breakdown;
}

/**
 * Get recent XP transactions for a user
 */
export async function getRecentTransactions(
  userId: string,
  limit: number = 10
) {
  return prisma.xpTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Check if user met daily goal and award bonus
 */
export async function checkAndAwardDailyGoal(userId: string): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get user's daily goal
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { dailyXpGoal: true },
  });

  if (!user) return false;

  // Get today's XP
  const dailyActivity = await prisma.userDailyActivity.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });

  if (!dailyActivity) return false;

  // Check if goal is met and not already awarded
  if (dailyActivity.xpEarned >= user.dailyXpGoal && !dailyActivity.metGoal) {
    // Award bonus
    await awardXP({
      userId,
      amount: XP_RULES.DAILY_GOAL_MET,
      sourceType: "daily_goal_met",
      sourceId: today.toISOString().split("T")[0],
      metadata: {
        goalXp: user.dailyXpGoal,
        earnedXp: dailyActivity.xpEarned,
      },
    });

    // Update daily activity
    await prisma.userDailyActivity.update({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      data: {
        metGoal: true,
        goalXp: user.dailyXpGoal,
      },
    });

    return true;
  }

  return false;
}
