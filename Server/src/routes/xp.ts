import { Router, Request, Response } from "express";
import { z } from "zod";
import {
  awardXP,
  getTotalXP,
  getXPBreakdown,
  getRecentTransactions,
  XPSourceType,
} from "../services/xpService";

const router = Router();

// Schema for awarding XP
const awardXPSchema = z.object({
  // In this app, `userId` is the Firebase UID (not necessarily a UUID)
  userId: z.string().min(1, "userId is required"),
  amount: z.number().int(),
  sourceType: z.enum([
    "activity_completion",
    "unit_completion",
    "lesson_completion",
    "streak_milestone",
    "daily_streak",
    "daily_goal_met",
    "perfect_unit",
    "speed_bonus",
    "manual_adjustment",
    "bonus_reward",
  ]),
  sourceId: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
  skipDuplicateCheck: z.boolean().optional(),
});

// POST /api/xp/preview - Log XP payload without touching the database
router.post("/preview", async (req: Request, res: Response) => {
  try {
    const validatedData = awardXPSchema.parse(req.body);

    const idempotencyKey = `${validatedData.sourceType}_${validatedData.sourceId}_${validatedData.userId}`;

    console.log("[XP PREVIEW] Incoming XP award:", {
      ...validatedData,
      idempotencyKey,
    });

    return res.status(200).json({
      success: true,
      data: {
        preview: true,
        xpAwarded: validatedData.amount,
        idempotencyKey,
        message: "XP preview logged on server. No database changes were made.",
      },
    });
  } catch (error) {
    console.error("Error in XP preview:", error);

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

// POST /api/xp/award - Award XP to a user
router.post("/award", async (req: Request, res: Response) => {
  try {
    const validatedData = awardXPSchema.parse(req.body);

    const result = await awardXP({
      userId: validatedData.userId,
      amount: validatedData.amount,
      sourceType: validatedData.sourceType as XPSourceType,
      sourceId: validatedData.sourceId,
      metadata: validatedData.metadata,
      skipDuplicateCheck: validatedData.skipDuplicateCheck,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error awarding XP:", error);

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

// GET /api/xp/:userId/total - Get total XP for a user
router.get("/:userId/total", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const totalXP = await getTotalXP(userId);

    return res.status(200).json({
      success: true,
      data: {
        userId,
        totalXP,
      },
    });
  } catch (error) {
    console.error("Error fetching total XP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/xp/:userId/breakdown - Get XP breakdown by source
router.get("/:userId/breakdown", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const [totalXP, breakdown] = await Promise.all([
      getTotalXP(userId),
      getXPBreakdown(userId),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        userId,
        totalXP,
        breakdown,
      },
    });
  } catch (error) {
    console.error("Error fetching XP breakdown:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/xp/:userId/transactions - Get recent XP transactions
router.get("/:userId/transactions", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const transactions = await getRecentTransactions(userId, limit);

    return res.status(200).json({
      success: true,
      data: {
        userId,
        transactions,
      },
    });
  } catch (error) {
    console.error("Error fetching XP transactions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
