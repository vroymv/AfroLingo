import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";

const router = Router();

const unitAccessSchema = z.object({
  userId: z.string().min(1, "userId required"),
});

const userIdParamSchema = z.string().min(1, "userId is required");

/**
 * GET /api/units/resume/:userId
 * Returns the best resume target for the user: the most recently accessed incomplete unit.
 * Falls back to the first active unit by `order`.
 */
router.get("/resume/:userId", async (req: Request, res: Response) => {
  try {
    const userId = userIdParamSchema.parse(req.params.userId);

    const inProgress = await prisma.userProgress.findFirst({
      where: {
        userId,
        completedAt: null,
        progress: { lt: 100 },
        unit: { isActive: true },
      },
      orderBy: { lastAccessedAt: "desc" },
      select: { unitId: true },
    });

    if (inProgress?.unitId) {
      return res.status(200).json({
        success: true,
        data: { unitId: inProgress.unitId },
      });
    }

    const firstUnit = await prisma.unit.findFirst({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { id: true },
    });

    if (!firstUnit?.id) {
      return res.status(404).json({
        success: false,
        message: "No active units available",
      });
    }

    return res.status(200).json({
      success: true,
      data: { unitId: firstUnit.id },
    });
  } catch (error) {
    console.error("Error computing resume unit:", error);

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

/**
 * POST /api/units/level/:level
 * Returns all units that match the provided `level` path param.
 * Example: POST /api/units/level/Beginner
 */
router.post("/level/:level", async (req: Request, res: Response) => {
  try {
    const { level } = req.params;
    const { userId } = req.body;

    if (!level) {
      return res
        .status(400)
        .json({ success: false, message: "Level is required" });
    }

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const units = await prisma.unit.findMany({
      where: {
        level: {
          equals: level,
          mode: "insensitive",
        },
      },
      orderBy: { order: "asc" },
      include: {
        userProgress: {
          where: {
            userId: userId,
          },
        },
        activities: true,
        // Only this user's mistakes for this unit
        mistakes: {
          where: {
            userId: userId,
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: units });
  } catch (error) {
    console.error("Error fetching units by level:", error);
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

/**
 * POST /api/units/:unitId/access
 * Touches user progress for the unit (creates if missing) and updates lastAccessedAt.
 */
router.post("/:unitId/access", async (req: Request, res: Response) => {
  const { unitId } = req.params;
  const parseResult = unitAccessSchema.safeParse(req.body);

  if (!unitId) {
    return res
      .status(400)
      .json({ success: false, message: "Unit ID is required" });
  }

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: parseResult.error.flatten(),
    });
  }

  const { userId } = parseResult.data;

  try {
    const now = new Date();

    const record = await prisma.userProgress.upsert({
      where: {
        userId_unitId: { userId, unitId },
      },
      update: {
        lastAccessedAt: now,
      },
      create: {
        userId,
        unitId,
        progress: 0,
        completedActivities: 0,
        startedAt: now,
        lastAccessedAt: now,
      },
    });

    return res.status(200).json({ success: true, data: record });
  } catch (error: any) {
    // Prisma FK errors for unknown unit/user can surface as P2003
    const code = error?.code as string | undefined;
    if (code === "P2003") {
      return res
        .status(404)
        .json({ success: false, message: "Unit or user not found" });
    }

    console.error("Error touching unit access:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

/**
 * GET /api/units/:unitId
 * Returns a single unit by its ID, including its activities.
 */
router.get("/:unitId", async (req: Request, res: Response) => {
  try {
    const { unitId } = req.params;

    if (!unitId) {
      return res
        .status(400)
        .json({ success: false, message: "Unit ID is required" });
    }

    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: {
        activities: true,
      },
    });

    if (!unit) {
      return res
        .status(404)
        .json({ success: false, message: "Unit not found" });
    }

    return res.status(200).json({ success: true, data: unit });
  } catch (error) {
    console.error("Error fetching unit by id:", error);
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export default router;
