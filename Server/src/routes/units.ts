import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";

const router = Router();

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
