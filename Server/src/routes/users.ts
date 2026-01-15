import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";

const router = Router();

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

export default router;
