import { Request, Response } from "express";
import {
  submitActivityAnswer as submitActivityService,
  skipActivityProgress,
  recordHintUsage,
} from "../services/progressService";

/**
 * Submit an activity answer
 * POST /api/activities/:activityId/submit
 */
export async function submitActivityAnswer(req: Request, res: Response) {
  try {
    const { activityId } = req.params;
    const {
      lessonProgressId,
      answer,
      timeSpent,
      hintsUsed = 0,
      isCorrect,
      activityType = "default",
    } = req.body;

    // Get userId from request (set by auth middleware)
    const userId = (req as any).userId;

    // Log the incoming request
    console.log("📝 Submit activity answer request received:", {
      activityId,
      userId,
      lessonProgressId,
      isCorrect,
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

    if (
      !lessonProgressId ||
      answer === undefined ||
      timeSpent === undefined ||
      isCorrect === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: lessonProgressId, answer, timeSpent, isCorrect",
      });
    }

    const result = await submitActivityService(
      userId,
      activityId,
      lessonProgressId,
      answer,
      timeSpent,
      hintsUsed,
      isCorrect,
      activityType
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error submitting activity answer:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit activity answer",
      error: error.message,
    });
  }
}

/**
 * Request a hint for an activity
 * POST /api/activities/:activityId/hint
 */
export async function requestActivityHint(req: Request, res: Response) {
  try {
    const { activityId } = req.params;
    const { hintNumber = 1, lessonProgressId } = req.body;
    const userId = (req as any).userId;

    // Log the incoming request
    console.log("💡 Activity hint request received:", {
      activityId,
      userId,
      lessonProgressId,
      hintNumber,
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

    if (!lessonProgressId) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: lessonProgressId",
      });
    }

    // Record hint usage
    await recordHintUsage(userId, activityId, lessonProgressId);

    // In a real implementation, you would fetch hints from the activity
    // For now, return a generic hint
    const hint = `Hint #${hintNumber}: Think carefully about the question.`;

    return res.status(200).json({
      success: true,
      data: {
        hint,
        hintsRemaining: 2, // You can implement this based on your business logic
      },
    });
  } catch (error: any) {
    console.error("Error requesting hint:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get hint",
      error: error.message,
    });
  }
}

/**
 * Skip an activity
 * POST /api/activities/:activityId/skip
 */
export async function skipActivity(req: Request, res: Response) {
  try {
    const { activityId } = req.params;
    const { lessonProgressId, timeSpent = 0 } = req.body;
    const userId = (req as any).userId;

    // Log the incoming request
    console.log("⏭️ Skip activity request received:", {
      activityId,
      userId,
      lessonProgressId,
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

    if (!lessonProgressId) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: lessonProgressId",
      });
    }

    const result = await skipActivityProgress(
      userId,
      activityId,
      lessonProgressId,
      timeSpent
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error skipping activity:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to skip activity",
      error: error.message,
    });
  }
}
