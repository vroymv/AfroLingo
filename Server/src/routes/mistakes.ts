import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";

const router = Router();

const createMistakeSchema = z
  .object({
    userId: z.string().min(1, "userId is required"),
    unitId: z.string().min(1, "unitId is required"),

    // Prefer activityExternalId from the client, but allow activityId for internal callers.
    activityExternalId: z.string().min(1).optional(),
    activityId: z.string().min(1).optional(),

    questionText: z.string().min(1, "questionText is required"),
    userAnswer: z.any(),
    correctAnswer: z.any(),

    mistakeType: z.string().min(1).optional(),

    // Optional idempotency key from the client to prevent duplicates on retries.
    clientMistakeId: z.string().min(1).optional(),

    // Optional client-side timestamp
    occurredAt: z
      .union([z.string().datetime({ offset: true }), z.string().datetime()])
      .optional(),

    metadata: z.any().optional(),
  })
  .strict();

// POST /api/mistakes
// Records a user mistake during an activity attempt.
router.post("/", async (req: Request, res: Response) => {
  const parsed = createMistakeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: parsed.error.flatten(),
    });
  }

  const {
    userId,
    unitId,
    activityExternalId,
    activityId,
    questionText,
    userAnswer,
    correctAnswer,
    mistakeType,
    clientMistakeId,
    occurredAt,
    metadata,
  } = parsed.data;

  if (!activityExternalId && !activityId) {
    return res.status(400).json({
      success: false,
      message: "Either activityExternalId or activityId is required",
    });
  }

  try {
    // Optional idempotency: if clientMistakeId was sent and already exists, return it.
    if (clientMistakeId) {
      const existing = await prisma.userMistake.findFirst({
        where: { userId, clientMistakeId },
      });
      if (existing) {
        return res.status(200).json({ success: true, data: existing });
      }
    }

    const [user, unit, activity] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
      prisma.unit.findUnique({ where: { id: unitId }, select: { id: true } }),
      activityId
        ? prisma.activity.findUnique({
            where: { id: activityId },
            select: { id: true },
          })
        : prisma.activity.findUnique({
            where: { externalId: activityExternalId! },
            select: { id: true },
          }),
    ]);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!unit) {
      return res
        .status(404)
        .json({ success: false, message: "Unit not found" });
    }

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    const created = await prisma.userMistake.create({
      data: {
        userId,
        unitId,
        activityId: activity.id,
        questionText,
        userAnswer,
        correctAnswer,
        mistakeType,
        clientMistakeId,
        occurredAt: occurredAt ? new Date(occurredAt) : undefined,
        metadata,
      },
    });

    return res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    console.error("Error recording mistake:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to record mistake",
    });
  }
});

const listMistakesQuerySchema = z
  .object({
    userId: z.string().min(1),
    unitId: z.string().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(200).optional(),
  })
  .strict();

// GET /api/mistakes?userId=...&unitId=...&limit=50
router.get("/", async (req: Request, res: Response) => {
  const parsed = listMistakesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid query",
      errors: parsed.error.flatten(),
    });
  }

  const { userId, unitId, limit } = parsed.data;

  try {
    const rows = await prisma.userMistake.findMany({
      where: {
        userId,
        ...(unitId ? { unitId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit ?? 50,
      include: {
        activity: {
          select: { externalId: true, type: true, componentKey: true },
        },
        unit: { select: { id: true, title: true } },
      },
    });

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    console.error("Error listing mistakes:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to list mistakes",
    });
  }
});

export default router;
