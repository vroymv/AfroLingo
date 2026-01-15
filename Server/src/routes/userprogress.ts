import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";

const router = Router();

// Schema validation for incoming progress payload
const progressSchema = z.object({
  userId: z.string().min(1, "userId required"),
  unitId: z.string().min(1, "unitId required"),
  currentActivityNumber: z.number().int().min(0),
  totalActivities: z.number().int().min(1),
});

router.post("/", async (req: Request, res: Response) => {
  const parseResult = progressSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: parseResult.error.flatten(),
    });
  }

  const { userId, unitId, currentActivityNumber, totalActivities } =
    parseResult.data;

  try {
    const now = new Date();

    // Calculate progress percentage (clamped 0-100)
    const progressPct = Math.min(
      100,
      Math.round((currentActivityNumber / totalActivities) * 100)
    );
    // Completed activities should not exceed total
    const completedActivities = Math.min(
      currentActivityNumber,
      totalActivities
    );

    // IMPORTANT: Progress must be monotonic.
    // If a user completed a unit, revisiting earlier activities must not reset progress.
    const record = await prisma.$transaction(async (tx) => {
      const existing = await tx.userProgress.findUnique({
        where: {
          userId_unitId: { userId, unitId },
        },
        select: {
          id: true,
          progress: true,
          completedActivities: true,
          completedAt: true,
          startedAt: true,
        },
      });

      if (!existing) {
        const isCompletedNow =
          progressPct >= 100 || completedActivities >= totalActivities;

        return tx.userProgress.create({
          data: {
            userId,
            unitId,
            progress: progressPct,
            completedActivities,
            startedAt: now,
            lastAccessedAt: now,
            completedAt: isCompletedNow ? now : null,
          },
        });
      }

      const nextCompletedActivities = Math.max(
        existing.completedActivities,
        completedActivities
      );
      const baseProgress = Math.max(existing.progress, progressPct);
      const baseCompletedActivities = nextCompletedActivities;

      // If the unit was already marked complete, never allow it to look incomplete again.
      const coercedCompletedActivities =
        existing.completedAt != null
          ? Math.max(baseCompletedActivities, totalActivities)
          : baseCompletedActivities;

      const isCompletedNow =
        baseProgress >= 100 || coercedCompletedActivities >= totalActivities;

      const nextProgress = isCompletedNow ? 100 : baseProgress;

      return tx.userProgress.update({
        where: {
          userId_unitId: { userId, unitId },
        },
        data: {
          progress: nextProgress,
          completedActivities: coercedCompletedActivities,
          lastAccessedAt: now,
          completedAt: existing.completedAt ?? (isCompletedNow ? now : null),
        },
      });
    });

    return res.json({
      success: true,
      data: record,
    });
  } catch (err: any) {
    console.error("/userprogress error", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to update user progress",
    });
  }
});

export default router;
