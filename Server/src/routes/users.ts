import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";

const router = Router();

// Validation schema for user creation
const createUserSchema = z.object({
  firebaseUid: z.string().min(1, "Firebase UID is required"),
  email: z.string().email("Invalid email format"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  createdAt: z.string().datetime().optional(),
});

// POST /api/users - Create a new user
router.post("/", async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = createUserSchema.parse(req.body);

    // Check if user already exists
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
        createdAt: validatedData.createdAt
          ? new Date(validatedData.createdAt)
          : new Date(),
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

// GET /api/users/:id - Get user by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        progress: true,
        lessonProgress: true,
        activityProgress: true,
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

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PATCH /api/users/:id - Update user
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateSchema = z.object({
      email: z.string().email().optional(),
      name: z.string().min(2).optional(),
    });

    const validatedData = updateSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: validatedData,
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
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/users/:id/stats - Get user's progress statistics only
router.get("/:id/stats", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get all units with user progress (minimal data for stats calculation)
    const units = await prisma.unit.findMany({
      where: { isActive: true },
      include: {
        userProgress: {
          where: { userId: id },
          select: {
            progress: true,
            xpEarned: true,
            completedLessons: true,
          },
        },
      },
    });

    // Calculate streak from user activity
    const { calculateCurrentStreak } = await import(
      "../services/streakService"
    );
    const streakDays = await calculateCurrentStreak(id);

    // Calculate overall statistics
    let totalXP = 0;
    let completedUnits = 0;
    let inProgressUnits = 0;

    units.forEach((unit) => {
      const userProgress = unit.userProgress[0];
      if (userProgress) {
        totalXP += userProgress.xpEarned || 0;

        if (userProgress.progress === 100) {
          completedUnits++;
        } else if (userProgress.progress > 0) {
          inProgressUnits++;
        }
      }
    });

    // Get milestone data for each unit (minimal info for progress visualization)
    const milestones = units.map((unit) => {
      const userProgress = unit.userProgress[0];
      return {
        id: unit.externalId,
        title: unit.title,
        icon: unit.icon,
        color: unit.color,
        progress: userProgress?.progress || 0,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        totalXP,
        streakDays,
        completedUnits,
        inProgressUnits,
        totalUnits: units.length,
        milestones,
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user stats",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/users/:id/progress - Get user's progress with units
router.get("/:id/progress", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get all units with user progress
    const units = await prisma.unit.findMany({
      where: { isActive: true },
      include: {
        userProgress: {
          where: { userId: id },
        },
        lessons: {
          where: { isActive: true },
          include: {
            lessonProgress: {
              where: { userId: id },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    // Calculate streak from user activity
    const { calculateCurrentStreak } = await import(
      "../services/streakService"
    );
    const streakDays = await calculateCurrentStreak(id);

    // Calculate overall statistics
    const stats = {
      totalXP: 0,
      streakDays,
      completedUnits: 0,
      inProgressUnits: 0,
      totalUnits: units.length,
    };

    // Transform units with progress data
    const unitsWithProgress = units.map((unit) => {
      const userProgress = unit.userProgress[0];
      const progress = userProgress?.progress || 0;
      const completedLessons = userProgress?.completedLessons || 0;

      // Calculate XP earned for this unit
      const xpEarned = userProgress?.xpEarned || 0;
      stats.totalXP += xpEarned;

      // Update unit completion stats
      if (progress === 100) {
        stats.completedUnits++;
      } else if (progress > 0) {
        stats.inProgressUnits++;
      }

      return {
        id: unit.externalId,
        title: unit.title,
        level: unit.level,
        icon: unit.icon,
        color: unit.color,
        progress,
        totalLessons: unit.totalLessons,
        completedLessons,
        xpReward: unit.xpReward,
        xpEarned,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        stats,
        units: unitsWithProgress,
      },
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user progress",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
