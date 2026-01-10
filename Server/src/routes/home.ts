import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";

const router = Router();

const userIdParamSchema = z.string().min(1, "userId is required");

/**
 * GET /api/home/heritage-journey/:userId
 * Server-computed lessons for the Home tab's "Your Heritage Journey" section.
 */
router.get("/heritage-journey/:userId", async (req: Request, res: Response) => {
  try {
    const userId = userIdParamSchema.parse(req.params.userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        selectedLanguage: true,
        selectedLevel: true,
        onboardingCompleted: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // If onboarding selections aren't stored yet, keep a deterministic fallback.
    const requestedLevel = user.selectedLevel || "absolute-beginner";

    // Prefer active units for the user's level; fall back to absolute-beginner.
    const unitsForLevel = await prisma.unit.findMany({
      where: {
        isActive: true,
        level: {
          equals: requestedLevel,
          mode: "insensitive",
        },
      },
      orderBy: { order: "asc" },
      take: 50,
      select: {
        id: true,
        title: true,
        level: true,
        xpReward: true,
        order: true,
        userProgress: {
          where: { userId },
          take: 1,
          select: {
            progress: true,
            completedActivities: true,
            completedAt: true,
            lastAccessedAt: true,
          },
        },
        _count: {
          select: {
            activities: true,
          },
        },
      },
    });

    const units =
      unitsForLevel.length > 0
        ? unitsForLevel
        : await prisma.unit.findMany({
            where: {
              isActive: true,
              level: {
                equals: "absolute-beginner",
                mode: "insensitive",
              },
            },
            orderBy: { order: "asc" },
            take: 50,
            select: {
              id: true,
              title: true,
              level: true,
              xpReward: true,
              order: true,
              userProgress: {
                where: { userId },
                take: 1,
                select: {
                  progress: true,
                  completedActivities: true,
                  completedAt: true,
                  lastAccessedAt: true,
                },
              },
              _count: {
                select: {
                  activities: true,
                },
              },
            },
          });

    const normalized = units.map((unit) => {
      const progress = unit.userProgress[0];
      const totalActivities = unit._count.activities;
      const completedActivities = Math.min(
        progress?.completedActivities ?? 0,
        totalActivities
      );

      const isCompleted =
        progress?.completedAt != null ||
        (typeof progress?.progress === "number" && progress.progress >= 100);

      const isStarted = completedActivities > 0;

      const progressLabel = isCompleted
        ? `${totalActivities}/${totalActivities} completed`
        : isStarted
        ? `${completedActivities}/${totalActivities} completed`
        : "Not started";

      return {
        unitId: unit.id,
        title: unit.title,
        xp: unit.xpReward,
        progress: progressLabel,
        completedActivities,
        totalActivities,
        isCompleted,
        lastAccessedAt: progress?.lastAccessedAt
          ? progress.lastAccessedAt.toISOString()
          : null,
        order: unit.order,
        level: unit.level,
      };
    });

    // Sort: in-progress first, then not started, then completed; stable by unit order.
    const sorted = normalized.sort((a, b) => {
      const rank = (x: (typeof normalized)[number]) => {
        if (x.isCompleted) return 2;
        if (x.completedActivities > 0) return 0;
        return 1;
      };

      const ra = rank(a);
      const rb = rank(b);
      if (ra !== rb) return ra - rb;

      // Prefer most recently accessed among in-progress.
      if (ra === 0) {
        const ta = a.lastAccessedAt ? Date.parse(a.lastAccessedAt) : 0;
        const tb = b.lastAccessedAt ? Date.parse(b.lastAccessedAt) : 0;
        if (ta !== tb) return tb - ta;
      }

      return a.order - b.order;
    });

    const lessons = sorted.slice(0, 3).map(({ order, level, ...rest }) => rest);

    return res.status(200).json({
      success: true,
      data: {
        userId: user.id,
        onboardingCompleted: user.onboardingCompleted,
        selectedLanguage: user.selectedLanguage,
        selectedLevel: user.selectedLevel,
        lessons,
      },
    });
  } catch (error) {
    console.error("Error building heritage journey:", error);

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
