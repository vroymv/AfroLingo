import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";

const router = Router();

const userIdSchema = z.string().min(1, "userId is required");

// GET /api/progress-tracker/:userId
// Returns lightweight stats used by the client ProgressTracker widget.
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = userIdSchema.parse(req.params.userId);

    const [xpAgg, progressAgg, user] = await Promise.all([
      prisma.xpTransaction.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
      prisma.userProgress.aggregate({
        where: { userId },
        _sum: { completedActivities: true },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { currentStreakDays: true },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        userId,
        totalXP: xpAgg._sum.amount ?? 0,
        streakDays: user?.currentStreakDays ?? 0,
        completedActivities: progressAgg._sum.completedActivities ?? 0,
      },
    });
  } catch (error) {
    console.error("Error fetching progress tracker stats:", error);

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
