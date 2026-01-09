import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";

const router = Router();

/**
 * GET /api/practice/activities
 * Returns activities featured for the Practice tab.
 */
router.get("/activities", async (_req: Request, res: Response) => {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        isActive: true,
        featuredForPractice: true,
        NOT: {
          componentKey: {
            in: ["alphabet", "alphabet-introduction"],
          },
        },
      },
      orderBy: { order: "asc" },
      select: {
        externalId: true,
        type: true,
        componentKey: true,
        contentRef: true,
        order: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: activities.map((a) => ({
        id: a.externalId,
        type: a.type,
        componentKey: a.componentKey,
        contentRef: a.contentRef ?? undefined,
        order: a.order,
      })),
    });
  } catch (error) {
    console.error("Error fetching practice activities:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch practice activities",
    });
  }
});

// GET /api/practice/progress/:userId
// Returns practice progress for a user. Optionally filter by activityExternalId.
router.get("/progress/:userId", async (req: Request, res: Response) => {
  try {
    const userId = z.string().min(1).parse(req.params.userId);
    const activityExternalId = z
      .string()
      .min(1)
      .optional()
      .parse(req.query.activityExternalId);

    const where: any = { userId };
    if (activityExternalId) {
      const activity = await prisma.activity.findUnique({
        where: { externalId: activityExternalId },
        select: { id: true },
      });
      if (!activity) {
        return res.status(404).json({
          success: false,
          message: "Practice activity not found",
        });
      }
      where.activityId = activity.id;
    }

    const rows = await prisma.practiceActivityProgress.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        activity: {
          select: { externalId: true, type: true, componentKey: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        userId: r.userId,
        activityExternalId: r.activity.externalId,
        activityType: r.activity.type,
        componentKey: r.activity.componentKey,
        isCompleted: r.isCompleted,
        isCorrect: r.isCorrect ?? undefined,
        attempts: r.attempts,
        bestScore: r.bestScore ?? undefined,
        lastScore: r.lastScore ?? undefined,
        totalTimeSpentSec: r.totalTimeSpentSec,
        startedAt: r.startedAt ?? undefined,
        lastAttemptAt: r.lastAttemptAt ?? undefined,
        completedAt: r.completedAt ?? undefined,
        updatedAt: r.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching practice progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch practice progress",
    });
  }
});

const practiceProgressEventSchema = z
  .object({
    userId: z.string().min(1, "userId required"),
    activityExternalId: z.string().min(1, "activityExternalId required"),
    event: z.enum(["start", "attempt", "complete"]),

    isCorrect: z.boolean().optional(),
    score: z.number().int().min(0).max(100).optional(),
    timeSpentSec: z.number().int().min(0).optional(),

    answer: z.any().optional(),
    metadata: z.any().optional(),
  })
  .strict();

// POST /api/practice/progress
// Upserts practice progress for the user + activity.
router.post("/progress", async (req: Request, res: Response) => {
  const parseResult = practiceProgressEventSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: parseResult.error.flatten(),
    });
  }

  const {
    userId,
    activityExternalId,
    event,
    isCorrect,
    score,
    timeSpentSec,
    answer,
    metadata,
  } = parseResult.data;

  try {
    const activity = await prisma.activity.findUnique({
      where: { externalId: activityExternalId },
      select: { id: true },
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Practice activity not found",
      });
    }

    const [user, existing] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
      prisma.practiceActivityProgress.findUnique({
        where: { userId_activityId: { userId, activityId: activity.id } },
        select: {
          id: true,
          startedAt: true,
          completedAt: true,
          bestScore: true,
        },
      }),
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found. Ensure the client has called POST /api/users to create the user record.",
      });
    }

    const now = new Date();
    const attemptsIncrement =
      event === "attempt" || event === "complete" ? 1 : 0;
    const addTime = timeSpentSec ?? 0;

    const record = await prisma.practiceActivityProgress.upsert({
      where: {
        userId_activityId: { userId, activityId: activity.id },
      },
      update: {
        lastAttemptAt: now,
        attempts: { increment: attemptsIncrement },
        totalTimeSpentSec: { increment: addTime },

        ...(typeof isCorrect === "boolean" ? { isCorrect } : {}),
        ...(typeof score === "number" ? { lastScore: score } : {}),
        ...(answer !== undefined ? { lastAnswer: answer } : {}),
        ...(metadata !== undefined ? { metadata } : {}),

        ...(event === "start" && !existing?.startedAt
          ? { startedAt: now }
          : {}),
        ...(event === "complete"
          ? {
              isCompleted: true,
              completedAt: existing?.completedAt ? existing.completedAt : now,
            }
          : {}),
      },
      create: {
        userId,
        activityId: activity.id,
        startedAt: now,
        lastAttemptAt: now,
        attempts: attemptsIncrement,
        totalTimeSpentSec: addTime,
        isCompleted: event === "complete",
        ...(typeof isCorrect === "boolean" ? { isCorrect } : {}),
        ...(typeof score === "number"
          ? { lastScore: score, bestScore: score }
          : {}),
        ...(answer !== undefined ? { lastAnswer: answer } : {}),
        ...(metadata !== undefined ? { metadata } : {}),
        ...(event === "complete" ? { completedAt: now } : {}),
      },
    });

    // Maintain bestScore when score is provided
    let out = record;
    if (typeof score === "number") {
      const currentBest = existing?.bestScore ?? record.bestScore;
      const nextBest =
        currentBest === null || currentBest === undefined
          ? score
          : Math.max(currentBest, score);

      if (record.bestScore !== nextBest) {
        out = await prisma.practiceActivityProgress.update({
          where: { id: record.id },
          data: { bestScore: nextBest },
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: out,
    });
  } catch (error: any) {
    console.error("Error updating practice progress:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to update practice progress",
    });
  }
});

export default router;
