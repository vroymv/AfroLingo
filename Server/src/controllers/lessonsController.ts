import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { startOrResumeLesson } from "../services/progressService";
import { calculateLessonBonusXP } from "../services/xpCalculator";
import {
  updateDailyActivity,
  calculateCurrentStreak,
} from "../services/streakService";

const prisma = new PrismaClient();

/**
 * Start or resume a lesson
 * POST /api/lessons/:lessonId/start
 */
export async function startLesson(req: Request, res: Response) {
  try {
    const { lessonId } = req.params;
    const userId = (req as any).userId;

    // Validate userId is present (should be set by middleware)
    if (!userId) {
      console.error("❌ No userId found in request");
      return res.status(401).json({
        success: false,
        message: "User identification required",
      });
    }

    // Get lesson to find total activities
    const lesson = await prisma.lesson.findUnique({
      where: { externalId: lessonId },
      include: {
        activities: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const totalActivities = lesson.activities.length;

    const result = await startOrResumeLesson(
      userId,
      lesson.id,
      totalActivities
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error starting lesson:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to start lesson",
      error: error.message,
    });
  }
}

/**
 * Complete a lesson
 * POST /api/lessons/:lessonId/complete
 */
export async function completeLesson(req: Request, res: Response) {
  try {
    const { lessonId } = req.params;
    const { finalScore = 100 } = req.body;
    const userId = (req as any).userId;

    // Log the incoming request
    console.log("✅ Complete lesson request received:", {
      lessonId,
      userId,
      finalScore,
      timestamp: new Date().toISOString(),
    });

    // Validate userId is present (should be set by middleware)
    if (!userId) {
      console.error("❌ No userId found in request");
      return res.status(401).json({
        success: false,
        message: "User identification required",
      });
    }

    // Get lesson
    const lesson = await prisma.lesson.findUnique({
      where: { externalId: lessonId },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Get lesson progress
    const lessonProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId: lesson.id,
        },
      },
    });

    if (!lessonProgress) {
      return res.status(404).json({
        success: false,
        message: "Lesson progress not found",
      });
    }

    // Get perfect activities count
    const perfectActivities = await prisma.activityProgress.count({
      where: {
        userId,
        activity: {
          lessonId: lesson.id,
        },
        perfectScore: true,
      },
    });

    // Calculate bonus XP
    const avgTimePerActivity =
      lessonProgress.totalActivities > 0
        ? lessonProgress.totalTimeSpent / lessonProgress.totalActivities
        : 0;

    const bonusXP = calculateLessonBonusXP(
      lessonProgress.accuracyRate || 0,
      perfectActivities,
      lessonProgress.totalActivities,
      avgTimePerActivity
    );

    // Update lesson progress
    const updatedProgress = await prisma.lessonProgress.update({
      where: { id: lessonProgress.id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        xpEarned: { increment: bonusXP },
        score: finalScore,
      },
    });

    // Update current session
    const currentSession = await prisma.lessonSession.findFirst({
      where: {
        lessonProgressId: lessonProgress.id,
        sessionNumber: lessonProgress.totalSessions,
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    if (currentSession) {
      await prisma.lessonSession.update({
        where: { id: currentSession.id },
        data: {
          wasCompleted: true,
          endedAt: new Date(),
        },
      });
    }

    // Update daily activity
    await updateDailyActivity(userId, {
      lessonsCompleted: 1,
      xpEarned: bonusXP,
    });

    // Calculate current streak
    const currentStreak = await calculateCurrentStreak(userId);

    // Get next lesson
    const nextLesson = await prisma.lesson.findFirst({
      where: {
        unitId: lesson.unitId,
        order: { gt: lesson.order },
        isActive: true,
      },
      orderBy: { order: "asc" },
    });

    return res.status(200).json({
      success: true,
      data: {
        lessonCompleted: true,
        totalXP: updatedProgress.xpEarned,
        bonusXP,
        accuracyRate: updatedProgress.accuracyRate || 0,
        perfectActivities,
        totalActivities: updatedProgress.totalActivities,
        nextLessonId: nextLesson?.externalId,
        currentStreak,
      },
    });
  } catch (error: any) {
    console.error("Error completing lesson:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to complete lesson",
      error: error.message,
    });
  }
}

/**
 * Get lesson progress
 * GET /api/lessons/:lessonId/progress
 */
export async function getLessonProgress(req: Request, res: Response) {
  try {
    const { lessonId } = req.params;
    const userId = (req as any).userId;

    // Log the incoming request for lesson progress
    console.log("📊 Lesson progress request received:", {
      lessonId,
      userId,
      timestamp: new Date().toISOString(),
    });

    // Validate userId is present (should be set by middleware)
    if (!userId) {
      console.error("❌ No userId found in request");
      return res.status(401).json({
        success: false,
        message: "User identification required",
      });
    }

    // Get lesson
    const lesson = await prisma.lesson.findUnique({
      where: { externalId: lessonId },
      include: {
        activities: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Get lesson progress
    const lessonProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId: lesson.id,
        },
      },
    });

    if (!lessonProgress) {
      return res.status(200).json({
        success: true,
        data: {
          lessonProgress: null,
          currentSession: null,
          activities: [],
        },
      });
    }

    // Get current session
    const currentSession = await prisma.lessonSession.findFirst({
      where: {
        lessonProgressId: lessonProgress.id,
        sessionNumber: lessonProgress.totalSessions,
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    // Get activity progress for all activities
    const activityProgress = await prisma.activityProgress.findMany({
      where: {
        userId,
        activityId: {
          in: lesson.activities.map((a) => a.id),
        },
      },
    });

    const activityProgressMap = new Map(
      activityProgress.map((ap) => [ap.activityId, ap])
    );

    const activities = lesson.activities.map((activity, index) => {
      const progress = activityProgressMap.get(activity.id);
      return {
        activityId: activity.id,
        externalId: activity.externalId,
        order: index,
        isCompleted: progress?.isCompleted || false,
        isCorrect: progress?.isCorrect || null,
        attempts: progress?.attempts || 0,
        perfectScore: progress?.perfectScore || false,
        isSkipped: progress?.isSkipped || false,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        lessonProgress: {
          currentActivityIndex: lessonProgress.currentActivityIndex,
          totalActivities: lessonProgress.totalActivities,
          completedActivities: lessonProgress.completedActivities,
          isCompleted: lessonProgress.isCompleted,
          accuracyRate: lessonProgress.accuracyRate || 0,
          totalCorrect: lessonProgress.totalCorrect,
          totalIncorrect: lessonProgress.totalIncorrect,
          xpEarned: lessonProgress.xpEarned,
          totalSessions: lessonProgress.totalSessions,
          totalTimeSpent: lessonProgress.totalTimeSpent,
          canResume:
            !lessonProgress.isCompleted &&
            lessonProgress.currentActivityIndex > 0,
        },
        currentSession: currentSession
          ? {
              sessionNumber: currentSession.sessionNumber,
              activitiesCompleted: currentSession.activitiesCompleted,
              startedAt: currentSession.startedAt,
              timeSpent: currentSession.timeSpent,
            }
          : null,
        activities,
      },
    });
  } catch (error: any) {
    console.error("Error getting lesson progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lesson progress",
      error: error.message,
    });
  }
}

/**
 * Get lesson session history
 * GET /api/lessons/:lessonId/sessions
 */
export async function getLessonSessions(req: Request, res: Response) {
  try {
    const { lessonId } = req.params;
    const userId = (req as any).userId;

    // Log the incoming request
    console.log("📜 Lesson sessions request received:", {
      lessonId,
      userId,
      timestamp: new Date().toISOString(),
    });

    // Validate userId is present (should be set by middleware)
    if (!userId) {
      console.error("❌ No userId found in request");
      return res.status(401).json({
        success: false,
        message: "User identification required",
      });
    }

    // Get lesson
    const lesson = await prisma.lesson.findUnique({
      where: { externalId: lessonId },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Get lesson progress
    const lessonProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId: lesson.id,
        },
      },
    });

    if (!lessonProgress) {
      return res.status(200).json({
        success: true,
        data: {
          sessions: [],
          totalSessions: 0,
          totalTimeSpent: 0,
          averageSessionTime: 0,
        },
      });
    }

    // Get all sessions
    const sessions = await prisma.lessonSession.findMany({
      where: {
        lessonProgressId: lessonProgress.id,
      },
      orderBy: {
        sessionNumber: "asc",
      },
    });

    const totalTimeSpent = sessions.reduce((sum, s) => sum + s.timeSpent, 0);
    const averageSessionTime =
      sessions.length > 0 ? totalTimeSpent / sessions.length : 0;

    return res.status(200).json({
      success: true,
      data: {
        sessions: sessions.map((s) => ({
          sessionNumber: s.sessionNumber,
          startedAt: s.startedAt,
          endedAt: s.endedAt,
          timeSpent: s.timeSpent,
          activitiesCompleted: s.activitiesCompleted,
          correctAnswers: s.correctAnswers,
          incorrectAnswers: s.incorrectAnswers,
          wasCompleted: s.wasCompleted,
        })),
        totalSessions: sessions.length,
        totalTimeSpent,
        averageSessionTime,
      },
    });
  } catch (error: any) {
    console.error("Error getting lesson sessions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lesson sessions",
      error: error.message,
    });
  }
}
