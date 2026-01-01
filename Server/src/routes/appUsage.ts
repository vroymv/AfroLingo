import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import {
  dateFromDateKey,
  getDateKeyInTimeZone,
  getUtcRangeForDateKeyInTimeZone,
} from "../utils/dateKey";

const router = Router();

const appUsageEventSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

async function getUserLocalTodayDate(userId: string, now: Date) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true, dailyXpGoal: true, dailyLessonGoal: true },
  });

  const timezone = user?.timezone || undefined;
  const todayKey = getDateKeyInTimeZone(now, timezone);
  const todayDate = dateFromDateKey(todayKey);

  return {
    todayKey,
    todayDate,
    timezone,
    dailyXpGoal: user?.dailyXpGoal ?? null,
    dailyLessonGoal: user?.dailyLessonGoal ?? null,
  };
}

// POST /api/app-usage/open
// Records a best-effort "app opened" signal for the user's local day.
router.post("/open", async (req: Request, res: Response) => {
  try {
    const { userId } = appUsageEventSchema.parse(req.body);
    const now = new Date();
    const { todayKey, todayDate, dailyXpGoal, dailyLessonGoal } =
      await getUserLocalTodayDate(userId, now);

    const existing = await prisma.userDailyActivity.findUnique({
      where: { userId_date: { userId, date: todayDate } },
      select: { firstAppOpenedAt: true, goalXp: true, goalLessons: true },
    });

    if (!existing) {
      await prisma.userDailyActivity.create({
        data: {
          userId,
          date: todayDate,
          firstAppOpenedAt: now,
          lastAppOpenedAt: now,
          appOpensCount: 1,
          goalXp: dailyXpGoal,
          goalLessons: dailyLessonGoal,
        },
      });
    } else {
      await prisma.userDailyActivity.update({
        where: { userId_date: { userId, date: todayDate } },
        data: {
          firstAppOpenedAt: existing.firstAppOpenedAt ?? now,
          lastAppOpenedAt: now,
          appOpensCount: { increment: 1 },
          goalXp: existing.goalXp ?? dailyXpGoal ?? undefined,
          goalLessons: existing.goalLessons ?? dailyLessonGoal ?? undefined,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        userId,
        todayDate: todayKey,
        recordedAt: now.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error recording app open:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// POST /api/app-usage/close
// Records a best-effort "app closed/background" signal for the user's local day.
router.post("/close", async (req: Request, res: Response) => {
  try {
    const { userId } = appUsageEventSchema.parse(req.body);
    const now = new Date();

    const { todayKey, todayDate, timezone, dailyXpGoal, dailyLessonGoal } =
      await getUserLocalTodayDate(userId, now);

    const { startUtc, endUtc } = getUtcRangeForDateKeyInTimeZone(
      todayKey,
      timezone
    );

    const [activitiesCompleted, unitsCompleted, xpAgg, existing] =
      await Promise.all([
        prisma.activityProgress.count({
          where: {
            userId,
            isCompleted: true,
            completedAt: {
              gte: startUtc,
              lt: endUtc,
            },
          },
        }),
        prisma.userProgress.count({
          where: {
            userId,
            completedAt: {
              gte: startUtc,
              lt: endUtc,
            },
          },
        }),
        prisma.xpTransaction.aggregate({
          where: {
            userId,
            amount: { gt: 0 },
            createdAt: {
              gte: startUtc,
              lt: endUtc,
            },
          },
          _sum: { amount: true },
        }),
        prisma.userDailyActivity.findUnique({
          where: { userId_date: { userId, date: todayDate } },
          select: {
            xpEarned: true,
            isStreakDay: true,
            goalXp: true,
            goalLessons: true,
          },
        }),
      ]);

    const computedPositiveXp = xpAgg._sum.amount ?? 0;
    const existingXpEarned = existing?.xpEarned ?? 0;
    const nextXpEarned = Math.max(existingXpEarned, computedPositiveXp);

    const streakThreshold = 10;
    const nextIsStreakDay =
      (existing?.isStreakDay ?? false) || nextXpEarned >= streakThreshold;

    await prisma.userDailyActivity.upsert({
      where: { userId_date: { userId, date: todayDate } },
      create: {
        userId,
        date: todayDate,
        lastAppClosedAt: now,
        appClosesCount: 1,
        unitsCompleted,
        activitiesCompleted,
        xpEarned: nextXpEarned,
        isStreakDay: nextIsStreakDay,
        goalXp: dailyXpGoal,
        goalLessons: dailyLessonGoal,
      },
      update: {
        lastAppClosedAt: now,
        appClosesCount: { increment: 1 },
        unitsCompleted,
        activitiesCompleted,
        xpEarned: nextXpEarned,
        isStreakDay: nextIsStreakDay,
        goalXp: existing?.goalXp ?? dailyXpGoal ?? undefined,
        goalLessons: existing?.goalLessons ?? dailyLessonGoal ?? undefined,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        userId,
        todayDate: todayKey,
        recordedAt: now.toISOString(),
        computed: {
          unitsCompleted,
          activitiesCompleted,
          xpEarned: nextXpEarned,
          isStreakDay: nextIsStreakDay,
        },
      },
    });
  } catch (error) {
    console.error("Error recording app close:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
