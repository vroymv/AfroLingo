import { Router, Request, Response } from "express";
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

export default router;
