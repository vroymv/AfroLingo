import { PrismaClient } from "@prisma/client";
import {
  calculateActivityXP,
  isPerfectScore,
  ActivityPerformance,
} from "./xpCalculator";
import { updateDailyActivity } from "./streakService";

const prisma = new PrismaClient();

/**
 * Progress tracking service
 */

export interface StartLessonResult {
  lessonProgressId: string;
  currentActivityIndex: number;
  totalActivities: number;
  sessionNumber: number;
  resuming: boolean;
  completedActivities: number;
  xpEarned: number;
}

export interface SubmitActivityResult {
  correct: boolean;
  xpEarned: number;
  perfectScore: boolean;
  explanation?: string;
  nextActivityIndex: number;
  lessonCompleted: boolean;
  totalXP: number;
}

/**
 * Start or resume a lesson
 */
export async function startOrResumeLesson(
  userId: string,
  lessonId: string,
  totalActivities: number
): Promise<StartLessonResult> {
  // Check if lesson progress exists
  let lessonProgress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
  });

  const resuming = lessonProgress !== null && !lessonProgress.isCompleted;

  if (!lessonProgress) {
    // Create new lesson progress
    lessonProgress = await prisma.lessonProgress.create({
      data: {
        userId,
        lessonId,
        currentActivityIndex: 0,
        totalActivities,
        totalSessions: 1,
      },
    });
  } else if (!lessonProgress.isCompleted) {
    // Increment session count
    lessonProgress = await prisma.lessonProgress.update({
      where: { id: lessonProgress.id },
      data: {
        totalSessions: { increment: 1 },
        currentSessionStartedAt: new Date(),
        lastAccessedAt: new Date(),
      },
    });
  } else {
    // Lesson already completed, restart from beginning
    lessonProgress = await prisma.lessonProgress.update({
      where: { id: lessonProgress.id },
      data: {
        currentActivityIndex: 0,
        isCompleted: false,
        completedActivities: 0,
        totalSessions: { increment: 1 },
        attempts: { increment: 1 },
        currentSessionStartedAt: new Date(),
        lastAccessedAt: new Date(),
      },
    });
  }

  // Create new session record
  await prisma.lessonSession.create({
    data: {
      userId,
      lessonProgressId: lessonProgress.id,
      sessionNumber: lessonProgress.totalSessions,
      startActivityIndex: lessonProgress.currentActivityIndex,
    },
  });

  return {
    lessonProgressId: lessonProgress.id,
    currentActivityIndex: lessonProgress.currentActivityIndex,
    totalActivities: lessonProgress.totalActivities,
    sessionNumber: lessonProgress.totalSessions,
    resuming,
    completedActivities: lessonProgress.completedActivities,
    xpEarned: lessonProgress.xpEarned,
  };
}

/**
 * Submit an activity answer
 */
export async function submitActivityAnswer(
  userId: string,
  activityId: string,
  lessonProgressId: string,
  answer: any,
  timeSpent: number,
  hintsUsed: number,
  isCorrect: boolean,
  activityType: string = "default"
): Promise<SubmitActivityResult> {
  // Get lesson progress
  const lessonProgress = await prisma.lessonProgress.findUnique({
    where: { id: lessonProgressId },
    include: {
      lesson: true,
    },
  });

  if (!lessonProgress) {
    throw new Error("Lesson progress not found");
  }

  // Get or create activity progress
  let activityProgress = await prisma.activityProgress.findUnique({
    where: {
      userId_activityId: {
        userId,
        activityId,
      },
    },
  });

  const attempts = activityProgress ? activityProgress.attempts + 1 : 1;

  // Calculate XP
  const performance: ActivityPerformance = {
    isCorrect,
    attempts,
    hintsUsed,
    timeSpent,
    activityType,
  };

  const xpEarned = calculateActivityXP(performance);
  const perfectScore = isPerfectScore(performance);

  // Update or create activity progress
  activityProgress = await prisma.activityProgress.upsert({
    where: {
      userId_activityId: {
        userId,
        activityId,
      },
    },
    create: {
      userId,
      activityId,
      lessonProgressId,
      isCompleted: isCorrect,
      isCorrect,
      userAnswer: answer,
      answerHistory: [{ answer, timestamp: new Date(), isCorrect }],
      timeSpent,
      hintsUsed,
      xpEarned: isCorrect ? xpEarned : 0,
      perfectScore: isCorrect && perfectScore,
      attempts: 1,
      mistakeCount: isCorrect ? 0 : 1,
      startedAt: new Date(),
      completedAt: isCorrect ? new Date() : null,
    },
    update: {
      isCompleted: isCorrect,
      isCorrect,
      userAnswer: answer,
      answerHistory: {
        push: [{ answer, timestamp: new Date(), isCorrect }],
      },
      timeSpent: { increment: timeSpent },
      hintsUsed: { increment: hintsUsed },
      xpEarned: isCorrect ? { increment: xpEarned } : undefined,
      perfectScore: isCorrect && perfectScore,
      attempts: { increment: 1 },
      mistakeCount: isCorrect ? undefined : { increment: 1 },
      completedAt: isCorrect ? new Date() : null,
    },
  });

  // If incorrect, create mistake record
  if (!isCorrect) {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (activity) {
      await prisma.userMistake.create({
        data: {
          userId,
          activityId,
          lessonId: lessonProgress.lessonId,
          questionText: activity.question,
          userAnswer: answer,
          correctAnswer: activity.correctAnswer || {},
          mistakeType: activityType,
        },
      });
    }
  }

  // Update lesson progress if correct
  let nextActivityIndex = lessonProgress.currentActivityIndex;
  let lessonCompleted = false;

  if (isCorrect) {
    const isNewCompletion =
      activityProgress.attempts === 1 || !activityProgress.isCompleted;

    nextActivityIndex = lessonProgress.currentActivityIndex + 1;
    lessonCompleted = nextActivityIndex >= lessonProgress.totalActivities;

    const updatedLessonProgress = await prisma.lessonProgress.update({
      where: { id: lessonProgressId },
      data: {
        currentActivityIndex: nextActivityIndex,
        completedActivities: isNewCompletion ? { increment: 1 } : undefined,
        totalCorrect: { increment: 1 },
        xpEarned: { increment: xpEarned },
        lastActivityCompletedAt: new Date(),
        totalTimeSpent: { increment: timeSpent },
        accuracyRate: undefined, // Will be calculated later
      },
    });

    // Calculate and update accuracy rate
    const totalAnswers =
      updatedLessonProgress.totalCorrect + updatedLessonProgress.totalIncorrect;
    if (totalAnswers > 0) {
      const accuracyRate =
        (updatedLessonProgress.totalCorrect / totalAnswers) * 100;
      await prisma.lessonProgress.update({
        where: { id: lessonProgressId },
        data: { accuracyRate },
      });
    }

    // Update current session
    const currentSession = await prisma.lessonSession.findFirst({
      where: {
        lessonProgressId,
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
          activitiesCompleted: { increment: 1 },
          correctAnswers: { increment: 1 },
          timeSpent: { increment: timeSpent },
          endActivityIndex: nextActivityIndex - 1,
        },
      });
    }

    // Update daily activity
    await updateDailyActivity(userId, {
      activitiesCompleted: 1,
      timeSpent,
      xpEarned,
    });
  } else {
    // Update incorrect count
    await prisma.lessonProgress.update({
      where: { id: lessonProgressId },
      data: {
        totalIncorrect: { increment: 1 },
      },
    });

    // Update session
    const currentSession = await prisma.lessonSession.findFirst({
      where: {
        lessonProgressId,
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
          incorrectAnswers: { increment: 1 },
          timeSpent: { increment: timeSpent },
        },
      });
    }
  }

  // Get updated lesson progress for total XP
  const updatedProgress = await prisma.lessonProgress.findUnique({
    where: { id: lessonProgressId },
  });

  return {
    correct: isCorrect,
    xpEarned: isCorrect ? xpEarned : 0,
    perfectScore: isCorrect && perfectScore,
    explanation: isCorrect ? "Great job!" : "Try again!",
    nextActivityIndex,
    lessonCompleted,
    totalXP: updatedProgress?.xpEarned || 0,
  };
}

/**
 * Skip an activity
 */
export async function skipActivityProgress(
  userId: string,
  activityId: string,
  lessonProgressId: string,
  timeSpent: number
): Promise<{ nextActivityIndex: number; lessonCompleted: boolean }> {
  const lessonProgress = await prisma.lessonProgress.findUnique({
    where: { id: lessonProgressId },
  });

  if (!lessonProgress) {
    throw new Error("Lesson progress not found");
  }

  // Create/update activity progress as skipped
  await prisma.activityProgress.upsert({
    where: {
      userId_activityId: {
        userId,
        activityId,
      },
    },
    create: {
      userId,
      activityId,
      lessonProgressId,
      isSkipped: true,
      timeSpent,
      startedAt: new Date(),
    },
    update: {
      isSkipped: true,
      timeSpent: { increment: timeSpent },
    },
  });

  // Move to next activity
  const nextActivityIndex = lessonProgress.currentActivityIndex + 1;
  const lessonCompleted = nextActivityIndex >= lessonProgress.totalActivities;

  await prisma.lessonProgress.update({
    where: { id: lessonProgressId },
    data: {
      currentActivityIndex: nextActivityIndex,
      totalTimeSpent: { increment: timeSpent },
    },
  });

  return {
    nextActivityIndex,
    lessonCompleted,
  };
}

/**
 * Record hint usage
 */
export async function recordHintUsage(
  userId: string,
  activityId: string,
  lessonProgressId: string
): Promise<void> {
  // Update activity progress
  await prisma.activityProgress.upsert({
    where: {
      userId_activityId: {
        userId,
        activityId,
      },
    },
    create: {
      userId,
      activityId,
      lessonProgressId,
      hintsUsed: 1,
      startedAt: new Date(),
    },
    update: {
      hintsUsed: { increment: 1 },
      perfectScore: false, // Can't be perfect with hints
    },
  });

  // Update session
  const lessonProgress = await prisma.lessonProgress.findUnique({
    where: { id: lessonProgressId },
  });

  if (lessonProgress) {
    const currentSession = await prisma.lessonSession.findFirst({
      where: {
        lessonProgressId,
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
          hintsUsed: { increment: 1 },
        },
      });
    }
  }
}
