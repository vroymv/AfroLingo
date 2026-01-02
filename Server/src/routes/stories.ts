import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import type { StoryCategory, StoryDifficulty, StoryType } from "@prisma/client";

const router = Router();

const storyIdParamSchema = z.string().min(1, "story id is required");

const userIdSchema = z.string().min(1, "userId is required");

const completeStoryBodySchema = z.object({
  userId: userIdSchema,
});

const listQuerySchema = z.object({
  category: z.string().optional(),
  difficulty: z.string().optional(),
  type: z.string().optional(),
  userId: z.string().optional(),
});

type ClientStoryDifficulty = "Beginner" | "Intermediate" | "Advanced";
type ClientStoryType = "dialogue" | "narrative" | "cultural";
type ClientStoryCategory = "greeting" | "dialogue" | "culture" | "everyday";

function toClientDifficulty(
  difficulty: StoryDifficulty
): ClientStoryDifficulty {
  switch (difficulty) {
    case "BEGINNER":
      return "Beginner";
    case "INTERMEDIATE":
      return "Intermediate";
    case "ADVANCED":
      return "Advanced";
  }
}

function toClientType(type: StoryType): ClientStoryType {
  switch (type) {
    case "DIALOGUE":
      return "dialogue";
    case "NARRATIVE":
      return "narrative";
    case "CULTURAL":
      return "cultural";
  }
}

function toClientCategory(category: StoryCategory): ClientStoryCategory {
  switch (category) {
    case "GREETING":
      return "greeting";
    case "DIALOGUE":
      return "dialogue";
    case "CULTURE":
      return "culture";
    case "EVERYDAY":
      return "everyday";
  }
}

function parseEnumFilter<T extends string>(
  value: string | undefined,
  allowed: readonly T[]
) {
  if (!value) return undefined;
  const normalized = value.trim().toUpperCase();
  const match = allowed.find((v) => v === normalized);
  return match;
}

/**
 * GET /api/stories
 * Returns a list of story summaries.
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const query = listQuerySchema.parse(req.query);

    const userId = query.userId ? userIdSchema.parse(query.userId) : undefined;

    const category = parseEnumFilter(query.category, [
      "GREETING",
      "DIALOGUE",
      "CULTURE",
      "EVERYDAY",
    ] as const);
    const difficulty = parseEnumFilter(query.difficulty, [
      "BEGINNER",
      "INTERMEDIATE",
      "ADVANCED",
    ] as const);
    const type = parseEnumFilter(query.type, [
      "DIALOGUE",
      "NARRATIVE",
      "CULTURAL",
    ] as const);

    const stories = await prisma.story.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
        ...(difficulty ? { difficulty } : {}),
        ...(type ? { type } : {}),
      },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        externalId: true,
        title: true,
        description: true,
        cover: true,
        difficulty: true,
        estimatedTime: true,
        type: true,
        category: true,
        totalWords: true,
        progress: userId
          ? {
              where: { userId },
              select: { isCompleted: true, completedWords: true },
              take: 1,
            }
          : false,
      },
    });

    return res.status(200).json({
      success: true,
      data: stories.map((s) => ({
        // If userId was passed, `progress` is an array with 0..1 elements; otherwise it's omitted.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(userId
          ? (() => {
              const p = (s as any).progress?.[0];
              return {
                completedWords: p?.completedWords ?? [],
                isCompleted: p?.isCompleted ?? false,
              };
            })()
          : { completedWords: [], isCompleted: false }),
        id: s.externalId,
        title: s.title,
        description: s.description,
        cover: s.cover,
        difficulty: toClientDifficulty(s.difficulty),
        estimatedTime: s.estimatedTime,
        type: toClientType(s.type),
        category: toClientCategory(s.category),
        totalWords: s.totalWords,
        segments: [],
        questions: undefined,
      })),
    });
  } catch (error) {
    console.error("Error fetching stories:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch stories",
    });
  }
});

/**
 * GET /api/stories/:storyId
 * Returns a single story with ordered segments/questions.
 */
router.get("/:storyId", async (req: Request, res: Response) => {
  try {
    const storyId = storyIdParamSchema.parse(req.params.storyId);
    const userIdRaw = req.query.userId;
    const userId =
      typeof userIdRaw === "string" && userIdRaw.length > 0
        ? userIdSchema.parse(userIdRaw)
        : undefined;

    const story = await prisma.story.findUnique({
      where: { externalId: storyId },
      include: {
        segments: { orderBy: { sortOrder: "asc" } },
        questions: { orderBy: { sortOrder: "asc" } },
        progress: userId
          ? {
              where: { userId },
              select: { isCompleted: true, completedWords: true },
              take: 1,
            }
          : false,
      },
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: story.externalId,
        title: story.title,
        description: story.description,
        cover: story.cover,
        difficulty: toClientDifficulty(story.difficulty),
        estimatedTime: story.estimatedTime,
        type: toClientType(story.type),
        category: toClientCategory(story.category),
        totalWords: story.totalWords,
        segments: story.segments.map((seg) => ({
          id: seg.externalId,
          text: seg.text,
          translation: seg.translation,
          audio: seg.audioUrl ?? undefined,
          highlightedWords: seg.highlightedWords,
          speaker: seg.speaker ?? undefined,
        })),
        questions: story.questions.map((q) => ({
          id: q.externalId,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })),
        completedWords:
          userId && Array.isArray((story as any).progress)
            ? (story as any).progress?.[0]?.completedWords ?? []
            : [],
        isCompleted:
          userId && Array.isArray((story as any).progress)
            ? (story as any).progress?.[0]?.isCompleted ?? false
            : false,
      },
    });
  } catch (error) {
    console.error("Error fetching story detail:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch story",
    });
  }
});

/**
 * POST /api/stories/:storyId/complete
 * Marks a story as completed for a user (UserStoryProgress upsert).
 */
router.post("/:storyId/complete", async (req: Request, res: Response) => {
  try {
    const storyExternalId = storyIdParamSchema.parse(req.params.storyId);
    const body = completeStoryBodySchema.parse(req.body);

    const story = await prisma.story.findUnique({
      where: { externalId: storyExternalId },
      select: { id: true, externalId: true },
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const now = new Date();

    const progress = await prisma.userStoryProgress.upsert({
      where: {
        userId_storyId: {
          userId: body.userId,
          storyId: story.id,
        },
      },
      create: {
        userId: body.userId,
        storyId: story.id,
        isCompleted: true,
        completedAt: now,
        lastAccessedAt: now,
        completedWords: [],
      },
      update: {
        isCompleted: true,
        completedAt: now,
        lastAccessedAt: now,
      },
      select: {
        isCompleted: true,
        completedWords: true,
        completedAt: true,
        lastAccessedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        storyId: story.externalId,
        ...progress,
      },
    });
  } catch (error) {
    console.error("Error marking story complete:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to mark story complete",
    });
  }
});

export default router;
