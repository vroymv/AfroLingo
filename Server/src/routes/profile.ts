import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { dateFromDateKey, getDateKeyInTimeZone } from "../utils/dateKey";

const router = Router();

const userIdSchema = z.string().min(1, "userId is required");

function inferDailyLessonGoal(timeCommitment: string | null | undefined) {
  // Derive a lesson goal from onboarding preference when the explicit goal isn't set.
  // This avoids hardcoded client-side placeholders while staying deterministic.
  switch (timeCommitment) {
    case "5min":
      return 1;
    case "15min":
      return 3;
    case "30min":
      return 5;
    default:
      return null;
  }
}

// GET /api/profile/:userId
// Returns profile data needed by the Profile tab in a single request.
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = userIdSchema.parse(req.params.userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        profileImageUrl: true,
        userType: true,
        languages: true,
        bio: true,
        countryCode: true,
        createdAt: true,
        updatedAt: true,

        timezone: true,
        dailyXpGoal: true,
        dailyLessonGoal: true,
        currentStreakDays: true,
        longestStreakDays: true,
        lastStreakDate: true,

        selectedLanguage: true,
        selectedLevel: true,
        placementTestScore: true,
        learningReasons: true,
        timeCommitment: true,
        onboardingCompleted: true,
        currentOnboardingStep: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [xpAgg, progressAgg] = await Promise.all([
      prisma.xpTransaction.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
      prisma.userProgress.aggregate({
        where: { userId },
        _sum: { completedActivities: true },
      }),
    ]);

    const todayKey = getDateKeyInTimeZone(
      new Date(),
      user.timezone || undefined
    );
    const todayDate = dateFromDateKey(todayKey);

    const todayDaily = await prisma.userDailyActivity.findUnique({
      where: {
        userId_date: {
          userId,
          date: todayDate,
        },
      },
      select: {
        xpEarned: true,
        isStreakDay: true,
        metGoal: true,
        goalXp: true,
        goalLessons: true,
        activitiesCompleted: true,
        unitsCompleted: true,
      },
    });

    const inferredLessonGoal =
      user.dailyLessonGoal ?? inferDailyLessonGoal(user.timeCommitment);

    const stats = {
      userId,
      totalXP: xpAgg._sum.amount ?? 0,
      streakDays: user.currentStreakDays ?? 0,
      longestStreakDays: user.longestStreakDays ?? 0,
      lastStreakDate: user.lastStreakDate
        ? user.lastStreakDate.toISOString().split("T")[0]
        : null,
      todayDate: todayKey,
      todayXpEarned: todayDaily?.xpEarned ?? 0,
      todayIsStreakDay: todayDaily?.isStreakDay ?? false,
      streakThreshold: 10,
      dailyXpGoal: user.dailyXpGoal ?? null,
      dailyLessonGoal: inferredLessonGoal,
      todayGoalXp: todayDaily?.goalXp ?? user.dailyXpGoal ?? null,
      todayGoalLessons: todayDaily?.goalLessons ?? inferredLessonGoal,
      todayMetGoal: todayDaily?.metGoal ?? false,
      todayActivitiesCompleted: todayDaily?.activitiesCompleted ?? 0,
      todayUnitsCompleted: todayDaily?.unitsCompleted ?? 0,
      completedActivities: progressAgg._sum.completedActivities ?? 0,
    };

    const onboarding = {
      isCompleted: user.onboardingCompleted,
      selectedLanguage: user.selectedLanguage,
      selectedLevel: user.selectedLevel,
      placementTestScore: user.placementTestScore,
      personalization:
        user.learningReasons.length > 0 || user.timeCommitment
          ? {
              reasons: user.learningReasons,
              timeCommitment: user.timeCommitment || "15min",
            }
          : null,
      currentStep:
        user.currentOnboardingStep !== undefined &&
        user.currentOnboardingStep !== null
          ? Number(user.currentOnboardingStep)
          : 1,
    };

    const communityProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      profileImageUrl: user.profileImageUrl,
      userType: user.userType,
      languages: user.languages,
      bio: user.bio,
      countryCode: user.countryCode,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return res.status(200).json({
      success: true,
      data: {
        stats,
        onboarding,
        communityProfile,
      },
    });
  } catch (error) {
    console.error("Error fetching profile overview:", error);

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

export default router;
