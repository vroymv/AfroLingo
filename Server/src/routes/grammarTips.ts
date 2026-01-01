import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";

const router = Router();

const todayTipQuerySchema = z.object({
  language: z.string().trim().min(1).max(32).optional(),
});

function getDayOfYearUTC(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const now = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  return Math.floor((now - start) / 86400000);
}

// GET /api/grammar-tips/today?language=sw
router.get("/today", async (req: Request, res: Response) => {
  try {
    const parsed = todayTipQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const requestedLanguage = (parsed.data.language ?? "").toLowerCase();
    const language = requestedLanguage || "general";

    const date = new Date();
    const dayOfYear = getDayOfYearUTC(date);

    const where = { language, isActive: true } as const;
    let total = await prisma.grammarTip.count({ where });

    // Fallback to general tips if no tips for the requested language.
    if (total === 0 && language !== "general") {
      total = await prisma.grammarTip.count({
        where: { language: "general", isActive: true },
      });

      if (total === 0) {
        return res.status(200).json({
          success: true,
          message: "No grammar tips available",
          data: null,
        });
      }

      const index = dayOfYear % total;
      const tips = await prisma.grammarTip.findMany({
        where: { language: "general", isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        skip: index,
        take: 1,
      });

      const tip = tips[0];
      return res.status(200).json({
        success: true,
        data: {
          id: tip.id,
          language: "general",
          text: tip.text,
          index,
          total,
          dayOfYear,
        },
      });
    }

    if (total === 0) {
      return res.status(200).json({
        success: true,
        message: "No grammar tips available",
        data: null,
      });
    }

    const index = dayOfYear % total;

    const tips = await prisma.grammarTip.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      skip: index,
      take: 1,
    });

    const tip = tips[0];

    return res.status(200).json({
      success: true,
      data: {
        id: tip.id,
        language,
        text: tip.text,
        index,
        total,
        dayOfYear,
      },
    });
  } catch (error) {
    console.error("Error fetching grammar tip:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch grammar tip",
    });
  }
});

export default router;
