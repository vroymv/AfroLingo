import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";

const router = Router();

const userIdSchema = z.string().min(1, "userId is required");

const discoverQuerySchema = z.object({
  q: z.string().trim().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

// GET /api/community/people/discover/:userId
// Returns a list of other users the viewer can connect with.
router.get("/people/discover/:userId", async (req: Request, res: Response) => {
  try {
    const viewerId = userIdSchema.parse(req.params.userId);
    const { q, limit } = discoverQuerySchema.parse(req.query);

    const take = limit ?? 50;
    const trimmedQ = q?.trim();

    const or: Array<Record<string, unknown>> = [];

    if (trimmedQ && trimmedQ.length > 0) {
      const upper = trimmedQ.toUpperCase();
      const maybeCountryCode = upper.length === 2 ? upper : null;

      or.push({
        name: {
          contains: trimmedQ,
          mode: "insensitive",
        },
      });

      or.push({
        bio: {
          contains: trimmedQ,
          mode: "insensitive",
        },
      });

      if (maybeCountryCode) {
        or.push({
          countryCode: {
            equals: maybeCountryCode,
          },
        });
      }

      const role =
        upper === "LEARNER" || upper === "NATIVE" || upper === "TUTOR"
          ? upper
          : null;
      if (role) {
        or.push({
          userType: role,
        });
      }
    }

    const users = await prisma.user.findMany({
      where: {
        id: { not: viewerId },
        ...(or.length > 0 ? { OR: or } : {}),
      },
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        profileImageUrl: true,
        userType: true,
        languages: true,
        bio: true,
        countryCode: true,
      },
    });

    const userIds = users.map((u) => u.id);

    const [follows, xpAgg] = await Promise.all([
      prisma.userFollow.findMany({
        where: {
          followerId: viewerId,
          followingId: { in: userIds },
        },
        select: {
          followingId: true,
        },
      }),
      prisma.xpTransaction.groupBy({
        by: ["userId"],
        where: {
          userId: { in: userIds },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const followingSet = new Set(follows.map((f) => f.followingId));
    const xpByUserId = new Map(
      xpAgg.map((row) => [row.userId, row._sum.amount ?? 0])
    );

    const data = users.map((u) => ({
      ...u,
      xpTotal: xpByUserId.get(u.id) ?? 0,
      isFollowing: followingSet.has(u.id),
    }));

    return res.status(200).json({
      success: true,
      data: {
        users: data,
      },
    });
  } catch (error) {
    console.error("Error discovering users:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to discover users",
    });
  }
});

// POST /api/community/people/:userId/follow/:targetUserId
router.post(
  "/people/:userId/follow/:targetUserId",
  async (req: Request, res: Response) => {
    try {
      const followerId = userIdSchema.parse(req.params.userId);
      const followingId = userIdSchema.parse(req.params.targetUserId);

      if (followerId === followingId) {
        return res.status(400).json({
          success: false,
          message: "You cannot follow yourself",
        });
      }

      // Best-effort existence check
      const [follower, following] = await Promise.all([
        prisma.user.findUnique({
          where: { id: followerId },
          select: { id: true },
        }),
        prisma.user.findUnique({
          where: { id: followingId },
          select: { id: true },
        }),
      ]);

      if (!follower || !following) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      try {
        await prisma.userFollow.create({
          data: {
            followerId,
            followingId,
          },
        });
      } catch (e: any) {
        // Ignore unique constraint (already following)
        if (typeof e?.code !== "string" || e.code !== "P2002") {
          throw e;
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          followerId,
          followingId,
        },
      });
    } catch (error) {
      console.error("Error following user:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to follow user",
      });
    }
  }
);

// DELETE /api/community/people/:userId/follow/:targetUserId
router.delete(
  "/people/:userId/follow/:targetUserId",
  async (req: Request, res: Response) => {
    try {
      const followerId = userIdSchema.parse(req.params.userId);
      const followingId = userIdSchema.parse(req.params.targetUserId);

      if (followerId === followingId) {
        return res.status(400).json({
          success: false,
          message: "You cannot unfollow yourself",
        });
      }

      await prisma.userFollow
        .delete({
          where: {
            followerId_followingId: {
              followerId,
              followingId,
            },
          },
        })
        .catch(() => {
          // If it doesn't exist, treat as already-unfollowed
          return null;
        });

      return res.status(200).json({
        success: true,
        data: {
          followerId,
          followingId,
        },
      });
    } catch (error) {
      console.error("Error unfollowing user:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to unfollow user",
      });
    }
  }
);

export default router;
