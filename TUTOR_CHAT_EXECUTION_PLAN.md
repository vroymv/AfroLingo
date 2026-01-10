# AfroLingo — Tutor 1:1 Realtime Chat (Execution Plan)

## Decisions (confirmed)

- Tutors are real authenticated users: `User.userType = TUTOR`.
- Chat is **1:1 only**: Learner (`User`) ↔ Tutor (`User`).
- Realtime messaging: reuse existing WebSocket patterns.
- Text-only for v1 (no attachments).
- No inbox gating (any learner can start a chat with a tutor).
- Keep the existing `Tutor` table, mapped to `User` via `Tutor.userId`.

---

## Goal

Enable learners to open a conversation from the Tutors tab and chat with tutors in a WhatsApp-style UI, with:

- Persisted threads + messages in Postgres (Prisma)
- Realtime delivery via WebSocket
- Inbox (thread list) + unread indicators

---

## 0) Preflight / Repo audit

- [x] Identify current Tutors data source (Server: `/api/tutors` via `prisma.tutor.findMany`; Client: `Client/services/tutors.ts`)
- [x] Decide reconciliation approach: keep `Tutor` table + map to `User` via `Tutor.userId`
- [x] Locate existing WebSocket server + event patterns (Socket.IO rooms like `user:{userId}`)
- [x] Confirm navigation target(s) for chat screens in the Client (Expo Router)

**DoD**

- We know exactly where to hook server + client changes.

---

## 1) Database schema (Prisma)

### Tutor identity

- [x] Seed `User` rows for tutors and set `userType = TUTOR`
- [x] Add `Tutor.userId` relation to `User` (1:1 mapping)

### Chat core

- [x] Add `TutorChatThread`
  - [ ] Fields: `id`, `learnerId`, `tutorId`, timestamps
  - [ ] Uniqueness: one thread per `(learnerId, tutorId)`
  - [ ] Indexes: `(learnerId, updatedAt DESC)`, `(tutorId, updatedAt DESC)`
- [x] Add `TutorChatMessage`
  - [ ] Fields: `id`, `threadId`, `senderId`, `body`, `clientMessageId`, timestamps
  - [ ] Idempotency: unique `(senderId, clientMessageId)` or `(threadId, senderId, clientMessageId)`
  - [ ] Indexes: `(threadId, createdAt DESC)`
- [x] Add per-participant read state (for unread counts)

  - [ ] Either `lastReadAtLearner` / `lastReadAtTutor` on thread
  - [ ] Or normalized `TutorChatParticipant` table (only if needed)

- [x] Add `lastMessageAt` for inbox ordering

**DoD**

- Migration applies cleanly; schema supports fast inbox + message pagination.

---

## 2) Server HTTP API

- [x] `POST /api/tutor-chat/threads` (get-or-create thread for learner+tutor)
- [x] `GET /api/tutor-chat/threads?userId=...` (list inbox for user)
- [x] `GET /api/tutor-chat/threads/:threadId/messages?cursor=...` (paginate messages)
- [x] `POST /api/tutor-chat/threads/:threadId/messages` (send message)
- [x] `POST /api/tutor-chat/threads/:threadId/read` (mark thread read)

**Guardrails**

- [ ] Validate both users exist
- [ ] Validate tutor has `userType = TUTOR`
- [ ] Prevent learner==tutor
- [ ] Authorization: only participants can read/send
- [ ] Idempotent send (safe on retries)

**DoD**

- API returns stable JSON and is safe under retries.

---

## 3) Server realtime (WebSocket)

- [x] On message send, emit `tutor_chat:message:new` to the other participant
- [x] Reuse existing auth/rooms approach (join room per userId)
- [ ] Optionally emit `tutor_chat:thread:updated` for inbox updates

**DoD**

- Two devices see new messages instantly without polling.

---

## 4) Client services + types

- [x] Add types: `TutorChatThread`, `TutorChatMessage`
- [x] Add service wrappers:
  - [x] `getOrCreateTutorChatThread(learnerId, tutorId)`
  - [x] `fetchTutorChatThreads(userId)`
  - [x] `fetchTutorChatMessages(threadId, cursor?)`
  - [x] `sendTutorChatMessage(threadId, body, clientMessageId)`
  - [x] `markTutorChatThreadRead(threadId, userId)`
- [ ] Add socket subscription utilities for tutor chat events (optional; currently handled directly in screens)

**DoD**

- Client can fetch inbox/messages and send reliably.

---

## 5) Client UX

- [x] Add Tutor Inbox screen (thread list)
- [x] Add Tutor Chat screen (messages + composer)
- [x] Implement optimistic send + retry UX
- [x] Implement basic pagination for message history
- [x] Implement unread indicators in inbox

**DoD**

- End-to-end chat usable and feels responsive.

---

## 6) Tutors tab integration

- [x] Wire TutorCard “Chat” button to:
  - [x] Create/get thread
  - [x] Navigate to chat screen
- [x] Handle unauthenticated user: redirect to sign-in (currently shows prompt)

**DoD**

- Tapping Chat reliably opens the correct 1:1 conversation.

---

## 7) QA / Manual acceptance

- [ ] Learner opens tutor chat, sends message
- [ ] Tutor receives message in realtime and replies
- [ ] App restart preserves history
- [ ] Unread badge updates when reading thread
- [ ] Retry sending under simulated network failure

---

## Progress log

- 2026-01-10: Added Tutor↔User mapping, chat schema + migrations, seeded tutor users, implemented server chat API + realtime event, and added initial Client inbox/chat screens.
