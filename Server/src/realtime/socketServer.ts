import type { Server as HttpServer } from "http";

import { Server as SocketIOServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

import { prisma } from "../config/prisma";
import { getFirebaseAuth } from "../config/firebaseAdmin";
import { getRedisClient } from "../config/redis";

const PROTOCOL_VERSION = 1;

const PRESENCE_TTL_MS = 45_000;
const PRESENCE_KEY_TTL_SEC = 120;

type SocketAuthContext = {
  userId: string;
  groupIds: string[];
};

type MessageSendPayload = {
  groupId: string;
  channelId?: string;
  body: string;
  clientMessageId: string;
  metadata?: unknown;
};

type SocketErrorPayload = {
  code: string;
  message: string;
  context?: Record<string, unknown>;
};

function presenceKeyForGroup(groupId: string): string {
  return `presence:group:${groupId}`;
}

async function setUserOnlineInGroup(params: {
  redis: ReturnType<typeof getRedisClient>;
  groupId: string;
  userId: string;
}): Promise<void> {
  const { redis, groupId, userId } = params;
  const key = presenceKeyForGroup(groupId);
  const now = Date.now();

  await redis
    .multi()
    .hset(key, userId, String(now))
    .expire(key, PRESENCE_KEY_TTL_SEC)
    .exec();
}

async function setUserOfflineInGroup(params: {
  redis: ReturnType<typeof getRedisClient>;
  groupId: string;
  userId: string;
}): Promise<void> {
  const { redis, groupId, userId } = params;
  const key = presenceKeyForGroup(groupId);
  await redis.hdel(key, userId);
}

async function getOnlineUserIdsForGroup(params: {
  redis: ReturnType<typeof getRedisClient>;
  groupId: string;
}): Promise<string[]> {
  const { redis, groupId } = params;
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

  // Keep the container key alive while the group is active.
  await redis.expire(key, PRESENCE_KEY_TTL_SEC);

  return online;
}

function getBearerTokenFromAuthorizationHeader(
  value: string | string[] | undefined
): string | null {
  if (!value) return null;
  const header = Array.isArray(value) ? value[0] : value;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

function getHandshakeToken(socket: any): string | null {
  // Recommended: socket.handshake.auth.token
  const fromAuth =
    typeof socket?.handshake?.auth?.token === "string"
      ? socket.handshake.auth.token
      : null;

  if (fromAuth && fromAuth.length > 0) return fromAuth;

  const fromHeader = getBearerTokenFromAuthorizationHeader(
    socket?.handshake?.headers?.authorization
  );
  return fromHeader;
}

async function getGroupRoomIdsForUser(userId: string): Promise<string[]> {
  const memberships = await prisma.groupMembership.findMany({
    where: {
      userId,
      leftAt: null,
    },
    select: {
      groupId: true,
    },
  });

  return memberships.map((m) => `group:${m.groupId}`);
}

async function ensureChannelForMessage(params: {
  groupId: string;
  channelId?: string;
}): Promise<{ channelId: string } | { error: SocketErrorPayload }> {
  const { groupId, channelId } = params;

  if (channelId) {
    const channel = await prisma.groupChannel.findFirst({
      where: {
        id: channelId,
        groupId,
      },
      select: { id: true },
    });

    if (!channel) {
      return {
        error: {
          code: "CHANNEL_NOT_FOUND",
          message: "Channel not found in this group",
          context: { groupId, channelId },
        },
      };
    }

    return { channelId: channel.id };
  }

  const defaultChannel = await prisma.groupChannel.findFirst({
    where: {
      groupId,
      isDefault: true,
    },
    select: { id: true },
  });

  if (defaultChannel) return { channelId: defaultChannel.id };

  const anyChannel = await prisma.groupChannel.findFirst({
    where: { groupId },
    select: { id: true },
  });

  if (anyChannel) return { channelId: anyChannel.id };

  // Fallback: create a default channel if none exist.
  const created = await prisma.groupChannel.create({
    data: {
      groupId,
      name: "General",
      isDefault: true,
    },
    select: { id: true },
  });

  return { channelId: created.id };
}

function roomToGroupId(room: string): string | null {
  if (!room.startsWith("group:")) return null;
  const groupId = room.slice("group:".length);
  return groupId.length > 0 ? groupId : null;
}

export function initSocketServer(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Redis adapter (for horizontal scaling). If Redis is not configured, skip.
  try {
    const redis = getRedisClient();
    const pubClient = redis;
    const subClient = redis.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
  } catch {
    // If REDIS_URL isn't set we can still run sockets in single-instance mode.
  }

  io.use(async (socket, next) => {
    try {
      const token = getHandshakeToken(socket);
      if (!token) {
        return next(new Error("Missing auth token"));
      }

      const decoded = await getFirebaseAuth().verifyIdToken(token);
      const userId = decoded.uid;

      (socket.data as SocketAuthContext).userId = userId;
      return next();
    } catch (e) {
      return next(new Error("Invalid auth token"));
    }
  });

  io.on("connection", async (socket) => {
    const { userId } = socket.data as SocketAuthContext;

    // Always join the user's personal room for notifications.
    await socket.join(`user:${userId}`);

    // Join all group rooms for existing memberships.
    const groupRooms = await getGroupRoomIdsForUser(userId);
    if (groupRooms.length > 0) {
      await socket.join(groupRooms);
    }

    const groupIds = groupRooms
      .map((r) => roomToGroupId(r))
      .filter((v): v is string => Boolean(v));
    (socket.data as SocketAuthContext).groupIds = groupIds;

    socket.emit("hello", {
      protocolVersion: PROTOCOL_VERSION,
      userId,
    });

    // Real-time chat: message send -> persist -> ack -> broadcast.
    socket.on("message:send", async (payload: MessageSendPayload) => {
      const groupId =
        typeof payload?.groupId === "string" ? payload.groupId : "";
      const channelId =
        typeof payload?.channelId === "string" ? payload.channelId : undefined;
      const body = typeof payload?.body === "string" ? payload.body : "";
      const clientMessageId =
        typeof payload?.clientMessageId === "string"
          ? payload.clientMessageId
          : "";

      if (!groupId || !clientMessageId) {
        socket.emit("error", {
          code: "VALIDATION_ERROR",
          message: "groupId and clientMessageId are required",
          context: { groupId, clientMessageId },
        } satisfies SocketErrorPayload);
        return;
      }

      const trimmedBody = body.trim();
      if (trimmedBody.length < 1 || trimmedBody.length > 4000) {
        socket.emit("error", {
          code: "VALIDATION_ERROR",
          message: "Message body must be between 1 and 4000 characters",
          context: { groupId, clientMessageId },
        } satisfies SocketErrorPayload);
        return;
      }

      // Authorization: must be an active member.
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
        socket.emit("error", {
          code: "NOT_A_MEMBER",
          message: "You must be a member of this group to send messages",
          context: { groupId },
        } satisfies SocketErrorPayload);
        return;
      }

      const channelResult = await ensureChannelForMessage({
        groupId,
        channelId,
      });
      if ("error" in channelResult) {
        socket.emit("error", channelResult.error);
        return;
      }

      // Persist (idempotent): unique(senderId, clientMessageId)
      let wasNewlyCreated = true;
      let messageRecord = null as null | {
        id: string;
        groupId: string;
        channelId: string | null;
        senderId: string;
        body: string;
        metadata: unknown;
        clientMessageId: string;
        createdAt: Date;
      };

      try {
        messageRecord = await prisma.groupMessage.create({
          data: {
            groupId,
            channelId: channelResult.channelId,
            senderId: userId,
            body: trimmedBody,
            clientMessageId,
            metadata: (payload as any)?.metadata,
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
        // If already created, fetch the existing message.
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
        socket.emit("error", {
          code: "MESSAGE_PERSIST_FAILED",
          message: "Failed to persist message",
          context: { groupId, clientMessageId },
        } satisfies SocketErrorPayload);
        return;
      }

      // Ack back to sender for optimistic UI reconciliation.
      socket.emit("message:ack", {
        clientMessageId,
        serverMessageId: messageRecord.id,
        createdAt: messageRecord.createdAt,
      });

      // If this was an idempotent retry, stop here to avoid duplicate broadcasts/notifications.
      if (!wasNewlyCreated) {
        return;
      }

      // Broadcast to all group members.
      io.to(`group:${groupId}`).emit("message:new", {
        groupId,
        channelId: messageRecord.channelId,
        message: messageRecord,
      });

      // In-app notifications (offline-only): create notifications for members not currently present.
      try {
        const redis = getRedisClient();
        const onlineUserIds = await getOnlineUserIdsForGroup({
          redis,
          groupId,
        });

        const members = await prisma.groupMembership.findMany({
          where: {
            groupId,
            leftAt: null,
          },
          select: {
            userId: true,
          },
        });

        const onlineSet = new Set(onlineUserIds);
        const recipientUserIds = members
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
            io.to(`user:${notification.userId}`).emit("notification:new", {
              notification,
            });
          }
        }
      } catch {
        // Notifications are best-effort.
      }
    });

    // Presence: mark online and broadcast.
    try {
      const redis = getRedisClient();
      for (const groupId of groupIds) {
        await setUserOnlineInGroup({ redis, groupId, userId });
        const onlineUserIds = await getOnlineUserIdsForGroup({
          redis,
          groupId,
        });
        io.to(`group:${groupId}`).emit("presence:update", {
          groupId,
          onlineUserIds,
          onlineCount: onlineUserIds.length,
        });
      }
    } catch {
      // Presence is best-effort.
    }

    // Client heartbeats: refresh TTL and broadcast (best-effort).
    socket.on("presence:heartbeat", async () => {
      try {
        const redis = getRedisClient();
        const ctx = socket.data as SocketAuthContext;
        for (const groupId of ctx.groupIds ?? []) {
          await setUserOnlineInGroup({ redis, groupId, userId });
          const onlineUserIds = await getOnlineUserIdsForGroup({
            redis,
            groupId,
          });
          io.to(`group:${groupId}`).emit("presence:update", {
            groupId,
            onlineUserIds,
            onlineCount: onlineUserIds.length,
          });
        }
      } catch {
        // best-effort
      }
    });

    // Typing indicators (ephemeral)
    socket.on(
      "typing:start",
      async (payload: { groupId: string; channelId?: string }) => {
        const groupId =
          typeof payload?.groupId === "string" ? payload.groupId : "";
        if (!groupId) return;

        io.to(`group:${groupId}`).emit("typing:update", {
          groupId,
          channelId:
            typeof payload?.channelId === "string"
              ? payload.channelId
              : undefined,
          userId,
          isTyping: true,
        });
      }
    );

    socket.on(
      "typing:stop",
      async (payload: { groupId: string; channelId?: string }) => {
        const groupId =
          typeof payload?.groupId === "string" ? payload.groupId : "";
        if (!groupId) return;

        io.to(`group:${groupId}`).emit("typing:update", {
          groupId,
          channelId:
            typeof payload?.channelId === "string"
              ? payload.channelId
              : undefined,
          userId,
          isTyping: false,
        });
      }
    );

    // Re-sync rooms after the client joins/leaves groups via HTTP.
    socket.on("groups:sync", async () => {
      const desiredRooms = new Set(await getGroupRoomIdsForUser(userId));

      // Leave group rooms that are no longer present.
      for (const room of socket.rooms) {
        if (typeof room !== "string") continue;
        if (!room.startsWith("group:")) continue;
        if (!desiredRooms.has(room)) {
          await socket.leave(room);
        }
      }

      // Join any missing rooms.
      const roomsToJoin: string[] = [];
      for (const room of desiredRooms) {
        if (!socket.rooms.has(room)) roomsToJoin.push(room);
      }
      if (roomsToJoin.length > 0) {
        await socket.join(roomsToJoin);
      }

      const nextGroupIds = Array.from(desiredRooms)
        .map((r) => roomToGroupId(r))
        .filter((v): v is string => Boolean(v));
      (socket.data as SocketAuthContext).groupIds = nextGroupIds;

      // Best-effort: update presence for newly joined rooms.
      try {
        const redis = getRedisClient();
        for (const groupId of nextGroupIds) {
          await setUserOnlineInGroup({ redis, groupId, userId });
          const onlineUserIds = await getOnlineUserIdsForGroup({
            redis,
            groupId,
          });
          io.to(`group:${groupId}`).emit("presence:update", {
            groupId,
            onlineUserIds,
            onlineCount: onlineUserIds.length,
          });
        }
      } catch {
        // best-effort
      }

      socket.emit("groups:synced", {
        groupsCount: Array.from(desiredRooms).length,
      });
    });

    socket.on("disconnect", async () => {
      // Best-effort: mark offline + broadcast.
      try {
        const redis = getRedisClient();
        const ctx = socket.data as SocketAuthContext;
        for (const groupId of ctx.groupIds ?? []) {
          await setUserOfflineInGroup({ redis, groupId, userId });
          const onlineUserIds = await getOnlineUserIdsForGroup({
            redis,
            groupId,
          });
          io.to(`group:${groupId}`).emit("presence:update", {
            groupId,
            onlineUserIds,
            onlineCount: onlineUserIds.length,
          });
        }
      } catch {
        // best-effort
      }
    });
  });

  return io;
}
