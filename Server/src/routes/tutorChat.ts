import { Router, type Request, type Response } from "express";
import type { Server as SocketIOServer } from "socket.io";
import { z } from "zod";
import { prisma } from "../config/prisma";

const router = Router();

const createThreadSchema = z
  .object({
    learnerId: z.string().min(1),
    tutorId: z.string().min(1),
  })
  .strict();

const listThreadsQuerySchema = z
  .object({
    userId: z.string().min(1),
  })
  .strict();

const listMessagesQuerySchema = z
  .object({
    cursor: z.string().min(1).optional(),
    limit: z
      .preprocess(
        (v) => (typeof v === "string" ? Number(v) : v),
        z.number().int().min(1).max(100).optional()
      )
      .optional(),
  })
  .strict();

const sendMessageSchema = z
  .object({
    senderId: z.string().min(1),
    body: z.string().trim().min(1).max(4000),
    clientMessageId: z.string().min(1).max(128),
  })
  .strict();

const markReadSchema = z
  .object({
    userId: z.string().min(1),
  })
  .strict();

async function assertTutorUser(tutorId: string) {
  const tutor = await prisma.user.findUnique({
    where: { id: tutorId },
    select: { id: true, userType: true },
  });

  if (!tutor) {
    return {
      ok: false as const,
      status: 404 as const,
      message: "Tutor not found",
    };
  }

  if (tutor.userType !== "TUTOR") {
    return {
      ok: false as const,
      status: 400 as const,
      message: "Target user is not a tutor",
    };
  }

  return { ok: true as const };
}

async function assertUserExists(userId: string, label: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    return {
      ok: false as const,
      status: 404 as const,
      message: `${label} not found`,
    };
  }

  return { ok: true as const };
}

function isPrismaUniqueViolation(err: unknown): err is { code: string } {
  return (
    typeof err === "object" && err !== null && (err as any).code === "P2002"
  );
}

// POST /api/tutor-chat/threads
// Body: { learnerId, tutorId }
router.post("/threads", async (req: Request, res: Response) => {
  try {
    const parsed = createThreadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { learnerId, tutorId } = parsed.data;

    if (learnerId === tutorId) {
      return res.status(400).json({
        success: false,
        message: "Cannot start a chat with yourself",
      });
    }

    const learnerCheck = await assertUserExists(learnerId, "Learner");
    if (!learnerCheck.ok) {
      return res
        .status(learnerCheck.status)
        .json({ success: false, message: learnerCheck.message });
    }

    const tutorCheck = await assertTutorUser(tutorId);
    if (!tutorCheck.ok) {
      return res
        .status(tutorCheck.status)
        .json({ success: false, message: tutorCheck.message });
    }

    const thread = await prisma.tutorChatThread.upsert({
      where: { learnerId_tutorId: { learnerId, tutorId } },
      create: {
        learnerId,
        tutorId,
        lastMessageAt: null,
        learnerLastReadAt: null,
        tutorLastReadAt: null,
      },
      update: {},
      select: {
        id: true,
        learnerId: true,
        tutorId: true,
        learnerLastReadAt: true,
        tutorLastReadAt: true,
        lastMessageAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ success: true, data: thread });
  } catch (error) {
    console.error("Error creating tutor chat thread:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create chat thread" });
  }
});

// GET /api/tutor-chat/threads?userId=...
router.get("/threads", async (req: Request, res: Response) => {
  try {
    const parsed = listThreadsQuerySchema.safeParse(req.query);
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

    const { userId } = parsed.data;

    const threads = await prisma.tutorChatThread.findMany({
      where: {
        OR: [{ learnerId: userId }, { tutorId: userId }],
      },
      orderBy: [{ lastMessageAt: "desc" }, { updatedAt: "desc" }],
      take: 100,
      select: {
        id: true,
        learnerId: true,
        tutorId: true,
        learnerLastReadAt: true,
        tutorLastReadAt: true,
        lastMessageAt: true,
        createdAt: true,
        updatedAt: true,
        learner: { select: { id: true, name: true, profileImageUrl: true } },
        tutor: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
            userType: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { id: true, body: true, senderId: true, createdAt: true },
        },
      },
    });

    const shaped = threads.map((t) => {
      const lastMessage = t.messages[0] ?? null;
      const otherUser = t.learnerId === userId ? t.tutor : t.learner;

      return {
        id: t.id,
        learnerId: t.learnerId,
        tutorId: t.tutorId,
        learnerLastReadAt: t.learnerLastReadAt,
        tutorLastReadAt: t.tutorLastReadAt,
        lastMessageAt: t.lastMessageAt,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        otherUser,
        lastMessage,
      };
    });

    return res.status(200).json({ success: true, data: shaped });
  } catch (error) {
    console.error("Error listing tutor chat threads:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch chat threads" });
  }
});

// GET /api/tutor-chat/threads/:threadId/messages?cursor=...&limit=...
router.get(
  "/threads/:threadId/messages",
  async (req: Request, res: Response) => {
    try {
      const threadId = z.string().min(1).parse(req.params.threadId);

      const parsed = listMessagesQuerySchema.safeParse(req.query);
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

      const limit = parsed.data.limit ?? 30;

      const messages = await prisma.tutorChatMessage.findMany({
        where: { threadId },
        orderBy: { createdAt: "desc" },
        take: limit,
        ...(parsed.data.cursor
          ? { cursor: { id: parsed.data.cursor }, skip: 1 }
          : {}),
        select: {
          id: true,
          threadId: true,
          senderId: true,
          body: true,
          clientMessageId: true,
          createdAt: true,
        },
      });

      const nextCursor =
        messages.length === limit ? messages[messages.length - 1].id : null;

      return res.status(200).json({
        success: true,
        data: {
          items: messages,
          nextCursor,
        },
      });
    } catch (error) {
      console.error("Error fetching tutor chat messages:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch chat messages" });
    }
  }
);

// POST /api/tutor-chat/threads/:threadId/messages
router.post(
  "/threads/:threadId/messages",
  async (req: Request, res: Response) => {
    try {
      const threadId = z.string().min(1).parse(req.params.threadId);

      const parsed = sendMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid request body",
          errors: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      const { senderId, body, clientMessageId } = parsed.data;

      const thread = await prisma.tutorChatThread.findUnique({
        where: { id: threadId },
        select: {
          id: true,
          learnerId: true,
          tutorId: true,
        },
      });

      if (!thread) {
        return res
          .status(404)
          .json({ success: false, message: "Thread not found" });
      }

      const isParticipant =
        senderId === thread.learnerId || senderId === thread.tutorId;

      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message: "You are not a participant in this thread",
        });
      }

      const otherUserId =
        senderId === thread.learnerId ? thread.tutorId : thread.learnerId;

      let message: {
        id: string;
        threadId: string;
        senderId: string;
        body: string;
        clientMessageId: string;
        createdAt: Date;
      } | null = null;

      try {
        message = await prisma.tutorChatMessage.create({
          data: {
            threadId,
            senderId,
            body,
            clientMessageId,
          },
          select: {
            id: true,
            threadId: true,
            senderId: true,
            body: true,
            clientMessageId: true,
            createdAt: true,
          },
        });
      } catch (err) {
        if (!isPrismaUniqueViolation(err)) {
          throw err;
        }

        message = await prisma.tutorChatMessage.findFirst({
          where: { senderId, clientMessageId },
          select: {
            id: true,
            threadId: true,
            senderId: true,
            body: true,
            clientMessageId: true,
            createdAt: true,
          },
        });
      }

      if (!message) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to send message" });
      }

      const now = new Date();
      await prisma.tutorChatThread.update({
        where: { id: threadId },
        data: {
          lastMessageAt: message.createdAt,
          ...(senderId === thread.learnerId
            ? { learnerLastReadAt: now }
            : { tutorLastReadAt: now }),
        },
      });

      const io = req.app.get("io") as SocketIOServer | undefined;
      io?.to(`user:${otherUserId}`).emit("tutor_chat:message:new", {
        threadId,
        message,
      });

      return res.status(201).json({ success: true, data: message });
    } catch (error) {
      console.error("Error sending tutor chat message:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send message" });
    }
  }
);

// POST /api/tutor-chat/threads/:threadId/read
router.post("/threads/:threadId/read", async (req: Request, res: Response) => {
  try {
    const threadId = z.string().min(1).parse(req.params.threadId);

    const parsed = markReadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { userId } = parsed.data;

    const thread = await prisma.tutorChatThread.findUnique({
      where: { id: threadId },
      select: { id: true, learnerId: true, tutorId: true },
    });

    if (!thread) {
      return res
        .status(404)
        .json({ success: false, message: "Thread not found" });
    }

    if (userId !== thread.learnerId && userId !== thread.tutorId) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this thread",
      });
    }

    const now = new Date();

    const updated = await prisma.tutorChatThread.update({
      where: { id: threadId },
      data:
        userId === thread.learnerId
          ? { learnerLastReadAt: now }
          : { tutorLastReadAt: now },
      select: {
        id: true,
        learnerId: true,
        tutorId: true,
        learnerLastReadAt: true,
        tutorLastReadAt: true,
        lastMessageAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Error marking tutor thread read:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to mark thread read" });
  }
});

export default router;
