import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { getFirebaseAuth } from "../config/firebaseAdmin";

const router = Router();

function getBearerTokenFromAuthorizationHeader(header: unknown): string | null {
  if (typeof header !== "string") return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function requireSameUser(req: Request, userId: string): Promise<void> {
  const token = getBearerTokenFromAuthorizationHeader(
    req.header("authorization"),
  );
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const decoded = await getFirebaseAuth().verifyIdToken(token);
  if (!decoded?.uid || decoded.uid !== userId) {
    throw new Error("FORBIDDEN");
  }
}

// Validation schema for user creation
const createUserSchema = z.object({
  firebaseUid: z.string().min(1, "Firebase UID is required"),
  email: z.string().email("Invalid email format"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  createdAt: z.coerce.date().optional(),
});

const communityUserTypeSchema = z.enum(["LEARNER", "NATIVE", "TUTOR"]);

const updateUserProfileSchema = z
  .object({
    name: z.string().min(2).max(120).optional(),
    profileImageUrl: z.string().min(1).max(255).optional().nullable(),

    userType: communityUserTypeSchema.optional(),
    languages: z.array(z.string().min(1).max(64)).max(20).optional(),
    bio: z.string().max(1000).optional().nullable(),
    countryCode: z
      .string()
      .transform((v) => v.trim().toUpperCase())
      .refine((v) => v.length === 2, "countryCode must be a 2-letter code")
      .optional()
      .nullable(),
  })
  .strict();

const hhmmTimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be HH:mm in 24h format");

const notificationPreferencesPatchSchema = z
  .object({
    dailyReminderEnabled: z.boolean().optional(),
    dailyReminderTime: hhmmTimeSchema.optional(),
    streakAlertsEnabled: z.boolean().optional(),
    reactivationNudgesEnabled: z.boolean().optional(),
    tutorChatMessageNotificationsEnabled: z.boolean().optional(),
    groupMessageNotificationsEnabled: z.boolean().optional(),
    newFollowerNotificationsEnabled: z.boolean().optional(),
    weeklySummaryEnabled: z.boolean().optional(),
    achievementUnlockedNotificationsEnabled: z.boolean().optional(),
    communityActivityNotificationsEnabled: z.boolean().optional(),
  })
  .strict();

const notificationPreferencesSelect = {
  dailyReminderEnabled: true,
  dailyReminderTime: true,
  streakAlertsEnabled: true,
  reactivationNudgesEnabled: true,
  tutorChatMessageNotificationsEnabled: true,
  groupMessageNotificationsEnabled: true,
  newFollowerNotificationsEnabled: true,
  weeklySummaryEnabled: true,
  achievementUnlockedNotificationsEnabled: true,
  communityActivityNotificationsEnabled: true,
} as const;

// POST /api/users - Create a new user
router.post("/", async (req: Request, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.firebaseUid },
    });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User already exists",
        data: existingUser,
      });
    }

    // Create new user in database
    const newUser = await prisma.user.create({
      data: {
        id: validatedData.firebaseUid,
        email: validatedData.email,
        name: validatedData.name,
        createdAt: validatedData.createdAt ?? new Date(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
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
        message: "Failed to create user",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
});

// GET /api/users/:userId - Fetch user's profile fields used across the app
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = z
      .string()
      .min(1, "userId is required")
      .parse(req.params.userId);

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
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
});

// PUT /api/users/:userId - Update user profile/community fields
router.put("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = z
      .string()
      .min(1, "userId is required")
      .parse(req.params.userId);
    const validatedData = updateUserProfileSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const data = {
      ...validatedData,
      // Normalize empties to null for nullable fields
      bio:
        validatedData.bio !== undefined
          ? validatedData.bio && validatedData.bio.trim().length > 0
            ? validatedData.bio
            : null
          : undefined,
      profileImageUrl:
        validatedData.profileImageUrl !== undefined
          ? validatedData.profileImageUrl &&
            validatedData.profileImageUrl.trim().length > 0
            ? validatedData.profileImageUrl
            : null
          : undefined,
      countryCode:
        validatedData.countryCode !== undefined
          ? validatedData.countryCode && validatedData.countryCode.length > 0
            ? validatedData.countryCode
            : null
          : undefined,
      updatedAt: new Date(),
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
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
      },
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues.map((err: z.ZodIssue) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
});

// GET /api/users/:userId/notification-preferences
router.get(
  "/:userId/notification-preferences",
  async (req: Request, res: Response) => {
    try {
      const userId = z
        .string()
        .min(1, "userId is required")
        .parse(req.params.userId);
      await requireSameUser(req, userId);

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          ...notificationPreferencesSelect,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          userId: user.id,
          preferences: {
            dailyReminderEnabled: user.dailyReminderEnabled,
            dailyReminderTime: user.dailyReminderTime,
            streakAlertsEnabled: user.streakAlertsEnabled,
            reactivationNudgesEnabled: user.reactivationNudgesEnabled,
            tutorChatMessageNotificationsEnabled:
              user.tutorChatMessageNotificationsEnabled,
            groupMessageNotificationsEnabled:
              user.groupMessageNotificationsEnabled,
            newFollowerNotificationsEnabled:
              user.newFollowerNotificationsEnabled,
            weeklySummaryEnabled: user.weeklySummaryEnabled,
            achievementUnlockedNotificationsEnabled:
              user.achievementUnlockedNotificationsEnabled,
            communityActivityNotificationsEnabled:
              user.communityActivityNotificationsEnabled,
          },
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";

      if (message === "UNAUTHORIZED") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (message === "FORBIDDEN") {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      console.error("Error fetching notification preferences:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to fetch notification preferences",
      });
    }
  },
);

// PATCH /api/users/:userId/notification-preferences
router.patch(
  "/:userId/notification-preferences",
  async (req: Request, res: Response) => {
    try {
      const userId = z
        .string()
        .min(1, "userId is required")
        .parse(req.params.userId);
      await requireSameUser(req, userId);

      const patch = notificationPreferencesPatchSchema.parse(req.body);

      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          ...patch,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          ...notificationPreferencesSelect,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Notification preferences updated",
        data: {
          userId: updated.id,
          preferences: {
            dailyReminderEnabled: updated.dailyReminderEnabled,
            dailyReminderTime: updated.dailyReminderTime,
            streakAlertsEnabled: updated.streakAlertsEnabled,
            reactivationNudgesEnabled: updated.reactivationNudgesEnabled,
            tutorChatMessageNotificationsEnabled:
              updated.tutorChatMessageNotificationsEnabled,
            groupMessageNotificationsEnabled:
              updated.groupMessageNotificationsEnabled,
            newFollowerNotificationsEnabled:
              updated.newFollowerNotificationsEnabled,
            weeklySummaryEnabled: updated.weeklySummaryEnabled,
            achievementUnlockedNotificationsEnabled:
              updated.achievementUnlockedNotificationsEnabled,
            communityActivityNotificationsEnabled:
              updated.communityActivityNotificationsEnabled,
          },
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";

      if (message === "UNAUTHORIZED") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (message === "FORBIDDEN") {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      console.error("Error updating notification preferences:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to update notification preferences",
      });
    }
  },
);

export default router;
