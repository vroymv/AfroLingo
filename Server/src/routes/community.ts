import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { getRedisClient } from "../config/redis";
import type { Server as SocketIOServer } from "socket.io";

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

const groupMessageCreateBodySchema = z
  .object({
    body: z.string().trim().min(1).max(4000),
    clientMessageId: z.string().trim().min(1).max(200),
    channelId: z.string().trim().min(1).max(200).optional(),
    metadata: z.unknown().optional(),
  })
  .strict();

const groupCreateBodySchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    description: z.string().trim().min(1).max(500).optional(),
    language: z.string().trim().min(2).max(10).optional(),
    tags: z.array(z.string().trim().min(1).max(30)).max(10).optional(),
    privacy: z.enum(["PUBLIC", "PRIVATE", "INVITE"]).optional(),
    invitedUserIds: z.array(z.string().min(1)).max(50).optional(),
  })
  .strict();

const PRESENCE_TTL_MS = 45_000;
const PRESENCE_KEY_TTL_SEC = 120;

function presenceKeyForGroup(groupId: string): string {
  return `presence:group:${groupId}`;
}

async function getOnlineUserIdsForGroup(groupId: string): Promise<string[]> {
  const redis = getRedisClient();
  const key = presenceKeyForGroup(groupId);
  const data = await redis.hgetall(key);
  const now = Date.now();

  const online: string[] = [];
  const stale: string[] = [];

  for (const [userId, lastSeenStr] of Object.entries(data)) {
    const lastSeenMs = Number(lastSeenStr);
    if (!Number.isFinite(lastSeenMs)) {
      stale.push(userId);
      continue;
    }
    if (now - lastSeenMs <= PRESENCE_TTL_MS) {
      online.push(userId);
    } else {
      stale.push(userId);
    }
  }

  if (stale.length > 0) {
    await redis.hdel(key, ...stale);
  }
  await redis.expire(key, PRESENCE_KEY_TTL_SEC);

  return online;
}

async function ensureChannelForGroup(params: {
  groupId: string;
  channelId?: string;
}): Promise<
  | { channelId: string | null }
  | {
      error: {
        code: string;
        message: string;
        context?: Record<string, unknown>;
      };
    }
> {
  const { groupId, channelId } = params;
  if (channelId) {
    const exists = await prisma.groupChannel.findFirst({
      where: { id: channelId, groupId },
      select: { id: true },
    });
    if (!exists) {
      return {
        error: {
          code: "INVALID_CHANNEL",
          message: "Invalid channelId for group",
          context: { groupId, channelId },
        },
      };
    }
    return { channelId };
  }

  let defaultChannel = await prisma.groupChannel.findFirst({
    where: { groupId, isDefault: true },
    select: { id: true },
  });

  if (!defaultChannel) {
    defaultChannel = await prisma.groupChannel.create({
      data: { groupId, name: "General", isDefault: true },
      select: { id: true },
    });
  }

  return { channelId: defaultChannel.id };
}

const groupReportBodySchema = z.object({
  reason: z.string().trim().min(1).max(500),
  messageId: z.string().trim().min(1).max(100).optional(),
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

// POST /api/community/groups/:userId/create
// Creates a group and (optionally) creates invite records for selected users.
// IMPORTANT: Invites only (no auto-membership for invitees).
router.post("/groups/:userId/create", async (req: Request, res: Response) => {
  try {
    const creatorUserId = userIdSchema.parse(req.params.userId);
    const body = groupCreateBodySchema.parse(req.body);

    const creator = await prisma.user.findUnique({
      where: { id: creatorUserId },
      select: { id: true, name: true },
    });
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const requestedInviteIds = Array.from(
      new Set((body.invitedUserIds ?? []).map((id) => String(id).trim()))
    ).filter(Boolean);
    const invitedUserIds = requestedInviteIds.filter(
      (id) => id !== creatorUserId
    );

    const io = req.app.get("io") as SocketIOServer | undefined;

    const result = await prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: {
          name: body.name,
          description: body.description,
          language: body.language,
          tags: body.tags ?? [],
          privacy: body.privacy ?? "PRIVATE",
          createdByUserId: creatorUserId,
          memberships: {
            create: {
              userId: creatorUserId,
              role: "OWNER",
              lastReadAt: new Date(),
              leftAt: null,
            },
          },
          channels: {
            create: {
              name: "General",
              isDefault: true,
            },
          },
        },
        select: {
          id: true,
          name: true,
          privacy: true,
          createdAt: true,
        },
      });

      if (invitedUserIds.length === 0) {
        return {
          group,
          invites: [] as Array<{ id: string; invitedUserId: string }>,
        };
      }

      // Only invite users that exist.
      const existingInvitees = await tx.user.findMany({
        where: { id: { in: invitedUserIds } },
        select: { id: true },
      });
      const existingInviteeIds = existingInvitees.map((u) => u.id);

      if (existingInviteeIds.length === 0) {
        return {
          group,
          invites: [] as Array<{ id: string; invitedUserId: string }>,
        };
      }

      // Create invite records (best-effort skip duplicates).
      const createdInvites: Array<{ id: string; invitedUserId: string }> = [];
      for (const invitedUserId of existingInviteeIds) {
        try {
          const invite = await tx.groupInvite.create({
            data: {
              groupId: group.id,
              invitedUserId,
              invitedByUserId: creatorUserId,
              status: "PENDING",
            },
            select: { id: true, invitedUserId: true },
          });
          createdInvites.push(invite);
        } catch (e: any) {
          // Ignore unique constraint conflicts (already invited).
          if (typeof e?.code === "string" && e.code === "P2002") continue;
          throw e;
        }
      }

      // Create notifications for invitees (best-effort).
      if (createdInvites.length > 0) {
        const createdNotifications = await Promise.all(
          createdInvites.map((inv) =>
            tx.notification.create({
              data: {
                userId: inv.invitedUserId,
                type: "GROUP_INVITE",
                data: {
                  inviteId: inv.id,
                  groupId: group.id,
                  groupName: group.name,
                  invitedByUserId: creatorUserId,
                  invitedByName: creator.name,
                  createdAt: new Date(),
                },
              },
              select: {
                id: true,
                userId: true,
                type: true,
                data: true,
                createdAt: true,
                readAt: true,
              },
            })
          )
        );

        for (const notification of createdNotifications) {
          io?.to(`user:${notification.userId}`).emit("notification:new", {
            notification,
          });
        }
      }

      return { group, invites: createdInvites };
    });

    return res.status(201).json({
      success: true,
      data: {
        group: result.group,
        inviteCount: result.invites.length,
      },
    });
  } catch (error) {
    console.error("Error creating group:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create group",
    });
  }
});

// GET /api/community/groups/:userId/invites
// Lists pending invites for the user.
router.get("/groups/:userId/invites", async (req: Request, res: Response) => {
  try {
    const userId = userIdSchema.parse(req.params.userId);
    const { limit } = notificationsQuerySchema.parse(req.query);
    const take = limit ?? 50;

    const invites = await prisma.groupInvite.findMany({
      where: {
        invitedUserId: userId,
        status: "PENDING",
        group: { isActive: true },
      },
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        createdAt: true,
        group: {
          select: {
            id: true,
            name: true,
            privacy: true,
            language: true,
            tags: true,
            avatarUrl: true,
          },
        },
        invitedByUser: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        invites,
      },
    });
  } catch (error) {
    console.error("Error fetching group invites:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invites",
    });
  }
});

// POST /api/community/groups/:userId/invites/:inviteId/accept
router.post(
  "/groups/:userId/invites/:inviteId/accept",
  async (req: Request, res: Response) => {
    try {
      const userId = userIdSchema.parse(req.params.userId);
      const inviteId = userIdSchema.parse(req.params.inviteId);

      const updated = await prisma.$transaction(async (tx) => {
        const invite = await tx.groupInvite.findUnique({
          where: { id: inviteId },
          select: {
            id: true,
            groupId: true,
            invitedUserId: true,
            status: true,
            group: { select: { isActive: true } },
          },
        });

        if (!invite || invite.invitedUserId !== userId) {
          return { kind: "NOT_FOUND" as const };
        }

        if (!invite.group.isActive) {
          return { kind: "GONE" as const };
        }

        if (invite.status !== "PENDING") {
          return { kind: "ALREADY" as const, groupId: invite.groupId };
        }

        await tx.groupMembership.upsert({
          where: { groupId_userId: { groupId: invite.groupId, userId } },
          create: {
            groupId: invite.groupId,
            userId,
            role: "MEMBER",
            lastReadAt: new Date(),
            leftAt: null,
          },
          update: {
            leftAt: null,
          },
          select: { id: true },
        });

        await tx.groupInvite.update({
          where: { id: invite.id },
          data: {
            status: "ACCEPTED",
            respondedAt: new Date(),
          },
          select: { id: true },
        });

        return { kind: "OK" as const, groupId: invite.groupId };
      });

      if (updated.kind === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Invite not found",
        });
      }

      if (updated.kind === "GONE") {
        return res.status(410).json({
          success: false,
          message: "Group is no longer available",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          groupId: updated.groupId,
        },
      });
    } catch (error) {
      console.error("Error accepting group invite:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to accept invite",
      });
    }
  }
);

// POST /api/community/groups/:userId/invites/:inviteId/decline
router.post(
  "/groups/:userId/invites/:inviteId/decline",
  async (req: Request, res: Response) => {
    try {
      const userId = userIdSchema.parse(req.params.userId);
      const inviteId = userIdSchema.parse(req.params.inviteId);

      const invite = await prisma.groupInvite.findUnique({
        where: { id: inviteId },
        select: { id: true, invitedUserId: true, status: true },
      });

      if (!invite || invite.invitedUserId !== userId) {
        return res.status(404).json({
          success: false,
          message: "Invite not found",
        });
      }

      if (invite.status === "PENDING") {
        await prisma.groupInvite.update({
          where: { id: invite.id },
          data: {
            status: "DECLINED",
            respondedAt: new Date(),
          },
          select: { id: true },
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          inviteId: invite.id,
        },
      });
    } catch (error) {
      console.error("Error declining group invite:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to decline invite",
      });
    }
  }
);

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

// POST /api/community/groups/:userId/:groupId/messages
// HTTP fallback for sending chat messages (idempotent). Also broadcasts over WS when available.
router.post(
  "/groups/:userId/:groupId/messages",
  async (req: Request, res: Response) => {
    try {
      const userId = userIdSchema.parse(req.params.userId);
      const groupId = userIdSchema.parse(req.params.groupId);
      const { body, clientMessageId, channelId, metadata } =
        groupMessageCreateBodySchema.parse(req.body ?? {});

      const membership = await prisma.groupMembership.findUnique({
        where: {
          groupId_userId: { groupId, userId },
        },
        select: { id: true, leftAt: true },
      });

      if (!membership || membership.leftAt) {
        return res.status(403).json({
          success: false,
          message: "You must be a member of this group to send messages",
        });
      }

      const channelResult = await ensureChannelForGroup({ groupId, channelId });
      if ("error" in channelResult) {
        return res.status(400).json({
          success: false,
          message: channelResult.error.message,
          code: channelResult.error.code,
          context: channelResult.error.context,
        });
      }

      let wasNewlyCreated = true;
      let messageRecord: {
        id: string;
        groupId: string;
        channelId: string | null;
        senderId: string;
        body: string;
        metadata: unknown;
        clientMessageId: string;
        createdAt: Date;
      } | null = null;

      try {
        messageRecord = await prisma.groupMessage.create({
          data: {
            groupId,
            channelId: channelResult.channelId,
            senderId: userId,
            body,
            clientMessageId,
            metadata: metadata as any,
          },
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
      } catch (e: any) {
        if (typeof e?.code === "string" && e.code === "P2002") {
          wasNewlyCreated = false;
          messageRecord = await prisma.groupMessage.findUnique({
            where: {
              senderId_clientMessageId: {
                senderId: userId,
                clientMessageId,
              },
            },
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
        } else {
          throw e;
        }
      }

      if (!messageRecord) {
        return res.status(500).json({
          success: false,
          message: "Failed to persist message",
        });
      }

      // Consider sending a message as reading the group.
      await prisma.groupMembership.update({
        where: { id: membership.id },
        data: { lastReadAt: new Date() },
      });

      // Broadcast over WS if available (only when newly created).
      if (wasNewlyCreated) {
        const io = req.app.get("io") as SocketIOServer | undefined;
        io?.to(`group:${groupId}`).emit("message:new", {
          groupId,
          channelId: messageRecord.channelId,
          message: messageRecord,
        });

        // Best-effort offline-only notifications.
        try {
          const [memberships, onlineUserIds] = await Promise.all([
            prisma.groupMembership.findMany({
              where: { groupId, leftAt: null },
              select: { userId: true },
            }),
            getOnlineUserIdsForGroup(groupId),
          ]);

          const onlineSet = new Set(onlineUserIds);
          const recipientUserIds = memberships
            .map((m) => m.userId)
            .filter((id) => id !== userId)
            .filter((id) => !onlineSet.has(id));

          if (recipientUserIds.length > 0) {
            const preview =
              messageRecord.body.length > 140
                ? `${messageRecord.body.slice(0, 140)}…`
                : messageRecord.body;

            const createdNotifications = await prisma.$transaction(
              recipientUserIds.map((recipientId) =>
                prisma.notification.create({
                  data: {
                    userId: recipientId,
                    type: "GROUP_MESSAGE",
                    data: {
                      groupId: messageRecord.groupId,
                      channelId: messageRecord.channelId,
                      messageId: messageRecord.id,
                      senderId: messageRecord.senderId,
                      preview,
                      createdAt: messageRecord.createdAt,
                    },
                  },
                  select: {
                    id: true,
                    userId: true,
                    type: true,
                    data: true,
                    createdAt: true,
                    readAt: true,
                  },
                })
              )
            );

            for (const notification of createdNotifications) {
              io?.to(`user:${notification.userId}`).emit("notification:new", {
                notification,
              });
            }
          }
        } catch {
          // best-effort
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          message: messageRecord,
        },
      });
    } catch (error) {
      console.error("Error sending group message:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to send message",
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

// POST /api/community/groups/:userId/:groupId/report
// Minimal abuse/reporting stub (v1): accept a report and log it.
router.post(
  "/groups/:userId/:groupId/report",
  async (req: Request, res: Response) => {
    try {
      const userId = userIdSchema.parse(req.params.userId);
      const groupId = userIdSchema.parse(req.params.groupId);
      const body = groupReportBodySchema.parse(req.body ?? {});

      console.log("[community] group report", {
        userId,
        groupId,
        messageId: body.messageId ?? null,
        reason: body.reason,
      });

      return res.status(202).json({
        success: true,
        data: {
          accepted: true,
        },
      });
    } catch (error) {
      console.error("Error reporting group content:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to submit report",
      });
    }
  }
);

export default router;
