import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";

const router = Router();

const userIdSchema = z.string().min(1, "userId is required");

const discoverQuerySchema = z.object({
  q: z.string().trim().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const groupsDiscoverQuerySchema = z.object({
  q: z.string().trim().min(1).max(100).optional(),
  language: z.string().trim().min(2).max(10).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const groupsMessagesQuerySchema = z.object({
  cursor: z.string().trim().min(1).max(200).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  markRead: z
    .union([
      z.literal("1"),
      z.literal("true"),
      z.literal("0"),
      z.literal("false"),
    ])
    .optional(),
});

const notificationsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

function decodeCursor(cursor: string): { createdAt: Date; id: string } | null {
  const parts = cursor.split("|");
  if (parts.length !== 2) return null;
  const [msStr, id] = parts;
  const ms = Number(msStr);
  if (!Number.isFinite(ms) || ms <= 0) return null;
  if (!id || id.length < 5) return null;
  return { createdAt: new Date(ms), id };
}

function encodeCursor(createdAt: Date, id: string): string {
  return `${createdAt.getTime()}|${id}`;
}

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

// ============================================================
// Groups API (v1) — Option A: userId in path (no JWT for HTTP)
// Base prefix: /api/community
// ============================================================

// GET /api/community/groups/discover/:userId
// Returns a list of groups the user can discover, with membership flags.
router.get("/groups/discover/:userId", async (req: Request, res: Response) => {
  try {
    const viewerId = userIdSchema.parse(req.params.userId);
    const { q, limit, language } = groupsDiscoverQuerySchema.parse(req.query);

    const take = limit ?? 50;
    const trimmedQ = q?.trim();
    const trimmedLanguage = language?.trim();

    const or: Array<Record<string, unknown>> = [];
    if (trimmedQ && trimmedQ.length > 0) {
      or.push({
        name: {
          contains: trimmedQ,
          mode: "insensitive",
        },
      });

      or.push({
        description: {
          contains: trimmedQ,
          mode: "insensitive",
        },
      });
    }

    const groups = await prisma.group.findMany({
      where: {
        isActive: true,
        ...(trimmedLanguage ? { language: trimmedLanguage } : {}),
        ...(or.length > 0 ? { OR: or } : {}),
      },
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        externalId: true,
        name: true,
        description: true,
        language: true,
        tags: true,
        privacy: true,
        avatarUrl: true,
        coverImageUrl: true,
        createdAt: true,
        _count: {
          select: {
            memberships: {
              where: {
                leftAt: null,
              },
            },
          },
        },
      },
    });

    const groupIds = groups.map((g) => g.id);
    const memberships = await prisma.groupMembership.findMany({
      where: {
        userId: viewerId,
        groupId: { in: groupIds },
        leftAt: null,
      },
      select: {
        groupId: true,
        role: true,
        joinedAt: true,
        lastReadAt: true,
      },
    });

    const membershipByGroupId = new Map(memberships.map((m) => [m.groupId, m]));

    const data = groups.map((g) => {
      const m = membershipByGroupId.get(g.id);
      return {
        ...g,
        memberCount: g._count.memberships,
        _count: undefined,
        isMember: Boolean(m),
        membership: m ?? null,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        groups: data,
      },
    });
  } catch (error) {
    console.error("Error discovering groups:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to discover groups",
    });
  }
});

// GET /api/community/groups/my/:userId
// Returns groups the user is a member of, with a simple last-message preview.
router.get("/groups/my/:userId", async (req: Request, res: Response) => {
  try {
    const userId = userIdSchema.parse(req.params.userId);

    const memberships = await prisma.groupMembership.findMany({
      where: {
        userId,
        leftAt: null,
      },
      orderBy: { joinedAt: "desc" },
      select: {
        id: true,
        role: true,
        joinedAt: true,
        lastReadAt: true,
        group: {
          select: {
            id: true,
            externalId: true,
            name: true,
            description: true,
            language: true,
            tags: true,
            privacy: true,
            avatarUrl: true,
            coverImageUrl: true,
            createdAt: true,
            _count: {
              select: {
                memberships: {
                  where: {
                    leftAt: null,
                  },
                },
              },
            },
            messages: {
              take: 1,
              orderBy: [{ createdAt: "desc" }, { id: "desc" }],
              select: {
                id: true,
                body: true,
                createdAt: true,
                senderId: true,
              },
            },
          },
        },
      },
    });

    const groups = await Promise.all(
      memberships.map(async (m) => {
        const lastReadAt = m.lastReadAt ?? new Date(0);
        const unreadCount = await prisma.groupMessage.count({
          where: {
            groupId: m.group.id,
            createdAt: { gt: lastReadAt },
          },
        });

        return {
          membership: {
            id: m.id,
            role: m.role,
            joinedAt: m.joinedAt,
            lastReadAt: m.lastReadAt,
            unreadCount,
          },
          group: {
            ...m.group,
            memberCount: m.group._count.memberships,
            _count: undefined,
            lastMessage: m.group.messages[0] ?? null,
            messages: undefined,
          },
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        groups,
      },
    });
  } catch (error) {
    console.error("Error fetching my groups:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch my groups",
    });
  }
});

// POST /api/community/groups/:userId/join/:groupId
router.post(
  "/groups/:userId/join/:groupId",
  async (req: Request, res: Response) => {
    try {
      const userId = userIdSchema.parse(req.params.userId);
      const groupId = userIdSchema.parse(req.params.groupId);

      const [user, group] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
        prisma.group.findUnique({
          where: { id: groupId },
          select: { id: true },
        }),
      ]);

      if (!user || !group) {
        return res.status(404).json({
          success: false,
          message: "User or group not found",
        });
      }

      const membership = await prisma.groupMembership.upsert({
        where: {
          groupId_userId: { groupId, userId },
        },
        create: {
          groupId,
          userId,
          role: "MEMBER",
          lastReadAt: new Date(),
          leftAt: null,
        },
        update: {
          leftAt: null,
        },
        select: {
          id: true,
          groupId: true,
          userId: true,
          role: true,
          joinedAt: true,
        },
      });

      return res.status(200).json({
        success: true,
        data: {
          membership,
        },
      });
    } catch (error) {
      console.error("Error joining group:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to join group",
      });
    }
  }
);

// DELETE /api/community/groups/:userId/leave/:groupId
router.delete(
  "/groups/:userId/leave/:groupId",
  async (req: Request, res: Response) => {
    try {
      const userId = userIdSchema.parse(req.params.userId);
      const groupId = userIdSchema.parse(req.params.groupId);

      await prisma.groupMembership
        .update({
          where: {
            groupId_userId: { groupId, userId },
          },
          data: {
            leftAt: new Date(),
          },
          select: { id: true },
        })
        .catch(() => null);

      return res.status(200).json({
        success: true,
        data: {
          groupId,
          userId,
        },
      });
    } catch (error) {
      console.error("Error leaving group:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to leave group",
      });
    }
  }
);

// GET /api/community/groups/:userId/:groupId/messages
// Cursor format: "<createdAtMs>|<messageId>"
router.get(
  "/groups/:userId/:groupId/messages",
  async (req: Request, res: Response) => {
    try {
      const userId = userIdSchema.parse(req.params.userId);
      const groupId = userIdSchema.parse(req.params.groupId);
      const { cursor, limit, markRead } = groupsMessagesQuerySchema.parse(
        req.query
      );

      const membership = await prisma.groupMembership.findUnique({
        where: {
          groupId_userId: { groupId, userId },
        },
        select: {
          id: true,
          leftAt: true,
        },
      });

      if (!membership || membership.leftAt) {
        return res.status(403).json({
          success: false,
          message: "You must be a member of this group to view messages",
        });
      }

      const take = limit ?? 30;
      const decoded = cursor ? decodeCursor(cursor) : null;

      const messages = await prisma.groupMessage.findMany({
        where: {
          groupId,
          ...(decoded
            ? {
                OR: [
                  { createdAt: { lt: decoded.createdAt } },
                  {
                    AND: [
                      { createdAt: { equals: decoded.createdAt } },
                      { id: { lt: decoded.id } },
                    ],
                  },
                ],
              }
            : {}),
        },
        take,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          groupId: true,
          channelId: true,
          senderId: true,
          body: true,
          metadata: true,
          clientMessageId: true,
          createdAt: true,
        },
      });

      const last = messages[messages.length - 1];
      const nextCursor = last ? encodeCursor(last.createdAt, last.id) : null;

      const shouldMarkRead = markRead === "1" || markRead === "true";
      if (shouldMarkRead) {
        await prisma.groupMembership.update({
          where: { id: membership.id },
          data: { lastReadAt: new Date() },
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          messages,
          nextCursor,
        },
      });
    } catch (error) {
      console.error("Error fetching group messages:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to fetch messages",
      });
    }
  }
);

// GET /api/community/notifications/:userId
router.get("/notifications/:userId", async (req: Request, res: Response) => {
  try {
    const userId = userIdSchema.parse(req.params.userId);
    const { limit } = notificationsQuerySchema.parse(req.query);

    const take = limit ?? 50;

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        take,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          type: true,
          data: true,
          createdAt: true,
          readAt: true,
        },
      }),
      prisma.notification.count({
        where: { userId, readAt: null },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
});

// POST /api/community/notifications/:userId/read/:notificationId
router.post(
  "/notifications/:userId/read/:notificationId",
  async (req: Request, res: Response) => {
    try {
      const userId = userIdSchema.parse(req.params.userId);
      const notificationId = userIdSchema.parse(req.params.notificationId);

      const result = await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId,
          readAt: null,
        },
        data: {
          readAt: new Date(),
        },
      });

      if (result.count === 0) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          notificationId,
        },
      });
    } catch (error) {
      console.error("Error marking notification read:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to mark notification read",
      });
    }
  }
);

export default router;
