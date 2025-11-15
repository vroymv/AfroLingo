import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { onboardingDataSchema } from "../schemas/onboarding.schema";

const router = Router();

/**
 * PUT /api/onboarding/:userId - Save or update user onboarding selections
 * This endpoint saves the user's onboarding preferences to the database
 *
 * @route PUT /api/onboarding/:userId
 * @param userId - The Firebase UID of the user
 * @body {OnboardingData} - Onboarding selections from the client
 * @returns {Object} - Updated user object with onboarding data
 */
router.put("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const validatedData = onboardingDataSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please create a user account first.",
      });
    }

    // Extract personalization data
    const learningReasons = validatedData.personalization?.reasons || [];
    const timeCommitment =
      validatedData.personalization?.timeCommitment || null;

    // Update user with onboarding data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        selectedLanguage: validatedData.selectedLanguage,
        selectedLevel: validatedData.selectedLevel,
        placementTestScore: validatedData.placementTestScore,
        learningReasons,
        timeCommitment,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        selectedLanguage: true,
        selectedLevel: true,
        placementTestScore: true,
        learningReasons: true,
        timeCommitment: true,
        onboardingCompleted: true,
        onboardingCompletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Onboarding data saved successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(" Error saving onboarding data:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      console.log("Validation errors:", error.issues);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues.map((err: z.ZodIssue) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    // Handle database errors
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: "Failed to save onboarding data",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
});

/**
 * GET /api/onboarding/:userId - Get user's onboarding data
 * This endpoint retrieves the user's onboarding preferences
 *
 * @route GET /api/onboarding/:userId
 * @param userId - The Firebase UID of the user
 * @returns {Object} - User's onboarding data
 */
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    console.log("📥 Getting onboarding data for user:", userId);

    // Get user's onboarding data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        selectedLanguage: true,
        selectedLevel: true,
        placementTestScore: true,
        learningReasons: true,
        timeCommitment: true,
        onboardingCompleted: true,
        onboardingCompletedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Transform data to match client format
    const onboardingData = {
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
    };

    return res.status(200).json({
      success: true,
      message: "Onboarding data retrieved successfully",
      data: onboardingData,
    });
  } catch (error) {
    console.error("Error retrieving onboarding data:", error);

    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve onboarding data",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
});

export default router;
