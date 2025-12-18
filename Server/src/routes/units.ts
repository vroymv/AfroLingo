import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";

const router = Router();

/**
 * GET /api/units/level/:level
 * Returns all units that match the provided `level` path param.
 * Example: GET /api/units/level/Beginner
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

export default router;
