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

    const record = await prisma.userProgress.upsert({
      where: {
        userId_unitId: { userId, unitId },
      },
      update: {
        progress: progressPct,
        completedActivities,
        lastAccessedAt: new Date(),
      },
      create: {
        userId,
        unitId,
        progress: progressPct,
        completedActivities,
      },
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
