import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";

const router = Router();

const tutorsQuerySchema = z.object({
  q: z.string().trim().min(1).max(80).optional(),
  language: z.string().trim().min(1).max(80).optional(),
  limit: z
    .preprocess(
      (v) => (typeof v === "string" ? Number(v) : v),
      z.number().int().min(1).max(100).optional()
    )
    .optional(),
});

// GET /api/tutors?q=...&language=...&limit=...
router.get("/", async (req: Request, res: Response) => {
  try {
    const parsed = tutorsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const q = parsed.data.q?.toLowerCase();
    const language = parsed.data.language;
    const limit = parsed.data.limit ?? 50;

    const tutors = await prisma.tutor.findMany({
      where: {
        isActive: true,
        userId: { not: null },
        ...(language ? { language } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { language: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: [{ rating: "desc" }, { reviewCount: "desc" }, { name: "asc" }],
      take: limit,
      select: {
        externalId: true,
        userId: true,
        name: true,
        language: true,
        rating: true,
        reviewCount: true,
        hourlyRate: true,
        specialties: true,
        bio: true,
        avatar: true,
        availability: true,
        lessonsCompleted: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: tutors.map((t) => ({
        id: t.externalId,
        userId: t.userId,
        name: t.name,
        language: t.language,
        rating: t.rating,
        reviewCount: t.reviewCount,
        hourlyRate: t.hourlyRate,
        specialties: t.specialties,
        bio: t.bio,
        avatar: t.avatar,
        availability: t.availability,
        lessonsCompleted: t.lessonsCompleted,
      })),
    });
  } catch (error) {
    console.error("Error fetching tutors:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tutors",
    });
  }
});

export default router;
