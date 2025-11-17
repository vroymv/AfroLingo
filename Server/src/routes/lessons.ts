import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";

const router = Router();

/**
 * GET /api/lessons - Get all lessons with their units and activities
 * Query params:
 *   - level: filter by level (e.g., "Absolute Beginner", "Beginner")
 *   - includeActivities: include activities in response (default: true)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { level, includeActivities = "true" } = req.query;

    const units = await prisma.unit.findMany({
      where: {
        ...(level && { level: level as string }),
        isActive: true,
      },
      include: {
        lessons: {
          where: { isActive: true },
          include: {
            activities:
              includeActivities === "true"
                ? {
                    where: { isActive: true },
                    orderBy: { order: "asc" },
                  }
                : false,
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    // Transform the data to match the expected format
    const transformedData = {
      id: "main-path",
      name: "African Languages Journey",
      totalXP: units.reduce((sum, unit) => sum + unit.xpReward, 0),
      units: units.map((unit) => ({
        id: unit.externalId,
        title: unit.title,
        level: unit.level,
        progress: 0, // This will be calculated based on user progress
        totalLessons: unit.totalLessons,
        completedLessons: 0, // This will be calculated based on user progress
        icon: unit.icon,
        color: unit.color,
        xpReward: unit.xpReward,
        lessons: unit.lessons.map((lesson) => ({
          id: lesson.externalId,
          phrase: lesson.phrase,
          meaning: lesson.meaning,
          pronunciation: lesson.pronunciation,
          alphabetImage: lesson.alphabetImage,
          audio: lesson.audio,
          activities:
            includeActivities === "true"
              ? lesson.activities.map((activity) => ({
                  id: activity.externalId,
                  type: activity.type,
                  question: activity.question,
                  description: activity.description,
                  audio: activity.audio,
                  options: activity.options,
                  correctAnswer: activity.correctAnswer,
                  explanation: activity.explanation,
                  items: activity.items,
                  pairs: activity.pairs,
                  conversation: activity.conversation,
                  dialogue: activity.dialogue,
                  alphabetImage: activity.alphabetImage,
                }))
              : [],
        })),
      })),
    };

    return res.status(200).json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch lessons",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/lessons/user/:userId - Get all lessons with user progress
 * Query params:
 *   - level: filter by level (e.g., "Absolute Beginner", "Beginner")
 *   - includeActivities: include activities in response (default: true)
 *
 * This endpoint combines lesson data with user progress for a personalized view
 */
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    console.log("This function is called");
    const { userId } = req.params;
    const { level, includeActivities = "true" } = req.query;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch units with lessons and user progress
    const units = await prisma.unit.findMany({
      where: {
        ...(level && { level: level as string }),
        isActive: true,
      },
      include: {
        userProgress: {
          where: { userId },
        },
        lessons: {
          where: { isActive: true },
          include: {
            lessonProgress: {
              where: { userId },
            },
            activities:
              includeActivities === "true"
                ? {
                    where: { isActive: true },
                    orderBy: { order: "asc" },
                  }
                : false,
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    // Calculate total XP
    const totalXP = units.reduce((sum, unit) => {
      const userProgress = unit.userProgress[0];
      return sum + (userProgress?.xpEarned || 0);
    }, 0);

    // Transform the data to match the expected format with user progress
    const transformedData = {
      id: "main-path",
      name: "African Languages Journey",
      totalXP,
      units: units.map((unit) => {
        const userProgress = unit.userProgress[0];

        return {
          id: unit.externalId,
          title: unit.title,
          level: unit.level,
          progress: userProgress?.progress || 0,
          totalLessons: unit.totalLessons,
          completedLessons: userProgress?.completedLessons || 0,
          icon: unit.icon,
          color: unit.color,
          xpReward: unit.xpReward,
          xpEarned: userProgress?.xpEarned || 0,
          lessons: unit.lessons.map((lesson) => {
            const lessonProgress = lesson.lessonProgress[0];

            return {
              id: lesson.externalId,
              phrase: lesson.phrase,
              meaning: lesson.meaning,
              pronunciation: lesson.pronunciation,
              alphabetImage: lesson.alphabetImage,
              audio: lesson.audio,
              // User progress for this lesson
              isStarted: !!lessonProgress,
              isCompleted: lessonProgress?.isCompleted || false,
              progress: lessonProgress
                ? Math.round(
                    (lessonProgress.completedActivities /
                      lessonProgress.totalActivities) *
                      100
                  )
                : 0,
              currentActivityIndex: lessonProgress?.currentActivityIndex || 0,
              completedActivities: lessonProgress?.completedActivities || 0,
              totalActivities:
                lessonProgress?.totalActivities || lesson.activities.length,
              accuracyRate: lessonProgress?.accuracyRate || null,
              xpEarned: lessonProgress?.xpEarned || 0,
              lastAccessedAt: lessonProgress?.lastAccessedAt || null,
              // Lesson activities
              activities:
                includeActivities === "true"
                  ? lesson.activities.map((activity) => ({
                      id: activity.externalId,
                      type: activity.type,
                      question: activity.question,
                      description: activity.description,
                      audio: activity.audio,
                      options: activity.options,
                      correctAnswer: activity.correctAnswer,
                      explanation: activity.explanation,
                      items: activity.items,
                      pairs: activity.pairs,
                      conversation: activity.conversation,
                      dialogue: activity.dialogue,
                      alphabetImage: activity.alphabetImage,
                    }))
                  : [],
            };
          }),
        };
      }),
    };

    return res.status(200).json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error("Error fetching lessons with user progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch lessons with user progress",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/lessons/unit/:unitId - Get all lessons for a specific unit
 */
router.get("/unit/:unitId", async (req: Request, res: Response) => {
  try {
    const { unitId } = req.params;
    const { includeActivities = "true" } = req.query;

    const unit = await prisma.unit.findUnique({
      where: {
        externalId: unitId,
        isActive: true,
      },
      include: {
        lessons: {
          where: { isActive: true },
          include: {
            activities:
              includeActivities === "true"
                ? {
                    where: { isActive: true },
                    orderBy: { order: "asc" },
                  }
                : false,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    // Transform to match expected format
    const transformedUnit = {
      id: unit.externalId,
      title: unit.title,
      level: unit.level,
      icon: unit.icon,
      color: unit.color,
      xpReward: unit.xpReward,
      totalLessons: unit.totalLessons,
      lessons: unit.lessons.map((lesson) => ({
        id: lesson.externalId,
        phrase: lesson.phrase,
        meaning: lesson.meaning,
        pronunciation: lesson.pronunciation,
        alphabetImage: lesson.alphabetImage,
        audio: lesson.audio,
        activities:
          includeActivities === "true"
            ? lesson.activities.map((activity) => ({
                id: activity.externalId,
                type: activity.type,
                question: activity.question,
                description: activity.description,
                audio: activity.audio,
                options: activity.options,
                correctAnswer: activity.correctAnswer,
                explanation: activity.explanation,
                items: activity.items,
                pairs: activity.pairs,
                conversation: activity.conversation,
                dialogue: activity.dialogue,
                alphabetImage: activity.alphabetImage,
              }))
            : [],
      })),
    };

    return res.status(200).json({
      success: true,
      data: transformedUnit,
    });
  } catch (error) {
    console.error("Error fetching unit lessons:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch unit lessons",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/lessons/:lessonId - Get a specific lesson by ID
 */
router.get("/:lessonId", async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: {
        externalId: lessonId,
        isActive: true,
      },
      include: {
        unit: true,
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

    // Transform to match expected format
    const transformedLesson = {
      id: lesson.externalId,
      phrase: lesson.phrase,
      meaning: lesson.meaning,
      pronunciation: lesson.pronunciation,
      alphabetImage: lesson.alphabetImage,
      audio: lesson.audio,
      unit: {
        id: lesson.unit.externalId,
        title: lesson.unit.title,
        level: lesson.unit.level,
        icon: lesson.unit.icon,
        color: lesson.unit.color,
      },
      activities: lesson.activities.map((activity) => ({
        id: activity.externalId,
        type: activity.type,
        question: activity.question,
        description: activity.description,
        audio: activity.audio,
        options: activity.options,
        correctAnswer: activity.correctAnswer,
        explanation: activity.explanation,
        items: activity.items,
        pairs: activity.pairs,
        conversation: activity.conversation,
        dialogue: activity.dialogue,
        alphabetImage: activity.alphabetImage,
      })),
    };

    return res.status(200).json({
      success: true,
      data: transformedLesson,
    });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch lesson",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
export default router;
