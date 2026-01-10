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

const feedQuerySchema = z.object({
  cursor: z.string().trim().min(1).max(200).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  category: z
    .enum(["DISCUSSION", "QUESTION", "CULTURAL", "PRONUNCIATION"])
    .optional(),
  language: z.string().trim().min(1).max(40).optional(),
  viewerId: z.string().trim().min(1).max(128).optional(),
});

const toggleLikeBodySchema = z
  .object({
    userId: z.string().min(1),
  })
  .strict();

const createPostBodySchema = z
  .object({
    userId: z.string().min(1),
    title: z.string().trim().min(2).max(120),
    content: z.string().trim().min(1).max(4000),
    language: z.string().trim().min(1).max(40).optional(),
    category: z.enum(["DISCUSSION", "QUESTION", "CULTURAL", "PRONUNCIATION"]),
    tags: z.array(z.string().trim().min(1).max(30)).max(10).optional(),
  })
  .strict();

const commentsQuerySchema = z.object({
  cursor: z.string().trim().min(1).max(200).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const createCommentBodySchema = z
  .object({
    userId: z.string().min(1),
    body: z.string().trim().min(1).max(2000),
    parentId: z.string().trim().min(1).max(200).optional(),
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

// ============================================================
// Community Feed API (v1)
// Base prefix: /api/community
// ============================================================

// GET /api/community/feed
// Public feed list (optionally filtered by language/category)
router.get("/feed", async (req: Request, res: Response) => {
  try {
    const { cursor, limit, category, language, viewerId } =
      feedQuerySchema.parse(req.query);

    const take = limit ?? 20;
    const decoded = cursor ? decodeCursor(cursor) : null;

    const posts = await prisma.communityPost.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
        ...(language ? { language } : {}),
      },
      take: take + 1,
      ...(decoded
        ? {
            cursor: { id: decoded.id },
            skip: 1,
          }
        : {}),
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
            userType: true,
            languages: true,
            countryCode: true,
          },
        },
        likes: viewerId
          ? {
              where: { userId: viewerId },
              select: { id: true },
            }
          : false,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        reactions: {
          select: { emoji: true },
        },
      },
    });

    const hasMore = posts.length > take;
    const page = hasMore ? posts.slice(0, take) : posts;
    const nextCursor =
      hasMore && page.length > 0
        ? encodeCursor(
            page[page.length - 1].createdAt,
            page[page.length - 1].id
          )
        : null;

    // Aggregate reactions per post (emoji -> count)
    const reactionAggByPostId = new Map<string, Record<string, number>>();
    for (const p of page) {
      const agg: Record<string, number> = {};
      for (const r of p.reactions) {
        agg[r.emoji] = (agg[r.emoji] ?? 0) + 1;
      }
      reactionAggByPostId.set(p.id, agg);
    }

    return res.status(200).json({
      success: true,
      data: {
        posts: page.map((p) => ({
          id: p.id,
          title: p.title,
          content: p.content,
          tags: p.tags,
          language: p.language,
          category: p.category,
          isTrending: p.isTrending,
          isLiked: viewerId
            ? (p.likes as Array<{ id: string }>).length > 0
            : false,
          createdAt: p.createdAt.toISOString(),
          author: {
            id: p.author.id,
            name: p.author.name,
            avatar: p.author.profileImageUrl,
            userType: p.author.userType,
            languages: p.author.languages,
            countryCode: p.author.countryCode,
          },
          counts: {
            likes: p._count.likes,
            comments: p._count.comments,
          },
          reactions: reactionAggByPostId.get(p.id) ?? {},
        })),
        pageInfo: {
          hasMore,
          nextCursor,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching community feed:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch community feed",
    });
  }
});

// POST /api/community/feed
// Body: { userId, title, content, category, tags?, language? }
router.post("/feed", async (req: Request, res: Response) => {
  try {
    const body = createPostBodySchema.parse(req.body);

    const author = await prisma.user.findUnique({
      where: { id: body.userId },
      select: { id: true },
    });
    if (!author) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const post = await prisma.communityPost.create({
      data: {
        authorId: body.userId,
        title: body.title,
        content: body.content,
        category: body.category,
        tags: body.tags ?? [],
        language: body.language,
        isTrending: false,
        isActive: true,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        id: post.id,
        createdAt: post.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating community post:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
});

// POST /api/community/feed/:postId/toggle-like
// Body: { userId }
router.post(
  "/feed/:postId/toggle-like",
  async (req: Request, res: Response) => {
    try {
      const postId = z.string().min(1).parse(req.params.postId);
      const { userId } = toggleLikeBodySchema.parse(req.body);

      // Ensure entities exist (best-effort)
      const [post, user] = await Promise.all([
        prisma.communityPost.findUnique({ where: { id: postId } }),
        prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
      ]);
      if (!post || !post.isActive) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const existing = await prisma.communityPostLike.findUnique({
        where: { postId_userId: { postId, userId } },
        select: { id: true },
      });

      if (existing) {
        await prisma.communityPostLike.delete({
          where: { postId_userId: { postId, userId } },
        });
      } else {
        await prisma.communityPostLike
          .create({ data: { postId, userId }, select: { id: true } })
          .catch((e: any) => {
            if (e?.code === "P2002") return null;
            throw e;
          });
      }

      const likeCount = await prisma.communityPostLike.count({
        where: { postId },
      });

      return res.status(200).json({
        success: true,
        data: {
          postId,
          userId,
          isLiked: !existing,
          likes: likeCount,
        },
      });
    } catch (error) {
      console.error("Error toggling post like:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to toggle like",
      });
    }
  }
);

// GET /api/community/feed/:postId/comments
// Returns top-level comments (parentId=null) newest-first.
router.get("/feed/:postId/comments", async (req: Request, res: Response) => {
  try {
    const postId = z.string().min(1).parse(req.params.postId);
    const { cursor, limit } = commentsQuerySchema.parse(req.query);

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { id: true, isActive: true },
    });
    if (!post || !post.isActive) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const take = limit ?? 30;
    const decoded = cursor ? decodeCursor(cursor) : null;

    const comments = await prisma.communityPostComment.findMany({
      where: {
        postId,
        parentId: null,
      },
      take: take + 1,
      ...(decoded
        ? {
            cursor: { id: decoded.id },
            skip: 1,
          }
        : {}),
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
            userType: true,
            languages: true,
            countryCode: true,
          },
        },
      },
    });

    const hasMore = comments.length > take;
    const page = hasMore ? comments.slice(0, take) : comments;
    const nextCursor =
      hasMore && page.length > 0
        ? encodeCursor(
            page[page.length - 1].createdAt,
            page[page.length - 1].id
          )
        : null;

    return res.status(200).json({
      success: true,
      data: {
        comments: page.map((c) => ({
          id: c.id,
          body: c.isDeleted ? "[deleted]" : c.body,
          parentId: c.parentId,
          isDeleted: c.isDeleted,
          createdAt: c.createdAt.toISOString(),
          author: {
            id: c.author.id,
            name: c.author.name,
            avatar: c.author.profileImageUrl,
            userType: c.author.userType,
            languages: c.author.languages,
            countryCode: c.author.countryCode,
          },
        })),
        pageInfo: {
          hasMore,
          nextCursor,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching community post comments:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
});

// POST /api/community/feed/:postId/comments
// Body: { userId, body, parentId? }
router.post("/feed/:postId/comments", async (req: Request, res: Response) => {
  try {
    const postId = z.string().min(1).parse(req.params.postId);
    const body = createCommentBodySchema.parse(req.body);

    const [post, author] = await Promise.all([
      prisma.communityPost.findUnique({
        where: { id: postId },
        select: { id: true, isActive: true },
      }),
      prisma.user.findUnique({
        where: { id: body.userId },
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
          userType: true,
          languages: true,
          countryCode: true,
        },
      }),
    ]);

    if (!post || !post.isActive) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (body.parentId) {
      const parent = await prisma.communityPostComment.findUnique({
        where: { id: body.parentId },
        select: { id: true, postId: true },
      });
      if (!parent || parent.postId !== postId) {
        return res.status(400).json({
          success: false,
          message: "Invalid parentId",
        });
      }
    }

    const created = await prisma.communityPostComment.create({
      data: {
        postId,
        authorId: author.id,
        parentId: body.parentId ?? null,
        body: body.body,
        isDeleted: false,
      },
      select: {
        id: true,
        body: true,
        parentId: true,
        isDeleted: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        id: created.id,
        body: created.isDeleted ? "[deleted]" : created.body,
        parentId: created.parentId,
        isDeleted: created.isDeleted,
        createdAt: created.createdAt.toISOString(),
        author: {
          id: author.id,
          name: author.name,
          avatar: author.profileImageUrl,
          userType: author.userType,
          languages: author.languages,
          countryCode: author.countryCode,
        },
      },
    });
  } catch (error) {
    console.error("Error creating community post comment:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create comment",
    });
  }
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
