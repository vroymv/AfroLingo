import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";

const router = Router();

/**
 * GET /api/karaoke
 * Returns a list of active karaoke exercises.
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const exercises = await prisma.karaokeExercise.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        externalId: true,
        title: true,
        subtitle: true,
        language: true,
        audioClipUrl: true,
        transcript: true,
        durationMs: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: exercises.map((e) => ({
        id: e.externalId ?? e.id,
        title: e.title,
        subtitle: e.subtitle ?? undefined,
        language: e.language ?? undefined,
        audioClipUrl: e.audioClipUrl,
        transcript: e.transcript ?? undefined,
        durationMs: e.durationMs ?? undefined,
      })),
    });
  } catch (error) {
    console.error("Error fetching karaoke exercises:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch karaoke exercises",
    });
  }
});

/**
 * GET /api/karaoke/active
 * Returns the first active karaoke exercise.
 */
router.get("/active", async (_req: Request, res: Response) => {
  try {
    const exercise = await prisma.karaokeExercise.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        externalId: true,
        title: true,
        subtitle: true,
        language: true,
        audioClipUrl: true,
        transcript: true,
        durationMs: true,
      },
    });

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "No active karaoke exercise found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: exercise.externalId ?? exercise.id,
        title: exercise.title,
        subtitle: exercise.subtitle ?? undefined,
        language: exercise.language ?? undefined,
        audioClipUrl: exercise.audioClipUrl,
        transcript: exercise.transcript ?? undefined,
        durationMs: exercise.durationMs ?? undefined,
      },
    });
  } catch (error) {
    console.error("Error fetching active karaoke exercise:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch active karaoke exercise",
    });
  }
});

/**
 * GET /api/karaoke/:id
 * Returns a karaoke exercise by externalId or database id.
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const requestedId = req.params.id;

    const exercise = await prisma.karaokeExercise.findFirst({
      where: {
        isActive: true,
        OR: [{ externalId: requestedId }, { id: requestedId }],
      },
      select: {
        id: true,
        externalId: true,
        title: true,
        subtitle: true,
        language: true,
        audioClipUrl: true,
        transcript: true,
        durationMs: true,
      },
    });

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Karaoke exercise not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: exercise.externalId ?? exercise.id,
        title: exercise.title,
        subtitle: exercise.subtitle ?? undefined,
        language: exercise.language ?? undefined,
        audioClipUrl: exercise.audioClipUrl,
        transcript: exercise.transcript ?? undefined,
        durationMs: exercise.durationMs ?? undefined,
      },
    });
  } catch (error) {
    console.error("Error fetching karaoke exercise:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch karaoke exercise",
    });
  }
});

export default router;
