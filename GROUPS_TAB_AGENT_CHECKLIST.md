# AfroLingo — Groups Tab (Agent Build Checklist)

This document is a condensed, execution-oriented checklist intended for an AI coding agent to build the Groups tab end-to-end.

How to use

- Work top-to-bottom.
- After completing a step, change `- [ ]` to `- [x]` and (optionally) add a short note under **Notes** for that step.
- Prefer small PR-sized increments (or small commits if you’re not using PRs).

## Locked decisions

- Transport: **socket.io**
- WS auth: **JWT** (validated during socket.io handshake)
- Presence store: **Redis** (TTL-based presence + socket.io Redis adapter for multi-instance)
- DB: Postgres + Prisma

## Target v1 scope

- Group discovery + “My Groups”
- Join/leave groups
- Group chat (text-only)
- Presence (online) + typing indicators (best-effort)
- In-app notifications for group activity

## Non-goals (v1)

- File attachments, voice rooms, E2E encryption
- Full moderation suite (beyond basic rate limiting + reporting stub)

---

# Checklist

## 0) Preflight: repo + environment

- [ ] Confirm server starts locally and DB connection works
- [ ] Confirm Prisma migrations run (`prisma migrate dev`) in Server
- [ ] Add env vars (local dev)
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET` (or equivalent)
  - [ ] `REDIS_URL`

**DoD**

- Server boots with DB connectivity.

**Notes**

-

---

## 1) Data model (Prisma schema)

- [ ] Add Prisma models for groups + chat (v1 minimal)
  - [ ] `Group`
  - [ ] `GroupMembership`
  - [ ] (Optional for v1) `GroupChannel` (or assume implicit “General”)
  - [ ] `GroupMessage` (append-only)
  - [ ] `Notification` (in-app)
- [ ] Add enums (if needed)
  - [ ] `GroupPrivacy` (PUBLIC/PRIVATE/INVITE)
  - [ ] `GroupRole` (OWNER/MEMBER)
  - [ ] `NotificationType` (GROUP_MESSAGE, etc.)
- [ ] Add indexes + unique constraints
  - [ ] Unique membership per (groupId, userId)
  - [ ] Message indexes for pagination (groupId/channelId + createdAt)
  - [ ] Notification indexes (userId + createdAt, userId + readAt)

**DoD**

- `Server/prisma/schema.prisma` updated.
- Migration is created and applies cleanly.

**Notes**

-

---

## 2) Migration + Prisma client

- [ ] Run migration generation
- [ ] Ensure Prisma Client generation succeeds
- [ ] Verify tables exist (quick SQL sanity)

**DoD**

- DB schema matches Prisma; server compiles.

**Notes**

-

---

## 3) Seed data (for realistic testing)

- [ ] Add deterministic seed script
  - [ ] Create ~10–30 groups across languages
  - [ ] Create memberships for a few test users
  - [ ] Seed message history for 3–5 groups
- [ ] Add a `package.json` script to run seed
- [ ] Document seed accounts + group IDs in this file (or Server/README)

**DoD**

- Fresh DB can be seeded repeatedly with stable results.

**Notes**

-

---

## 4) HTTP API (baseline, required even with WS)

- [ ] Group discovery
  - [ ] `GET /groups` (search/filter)
  - [ ] `GET /groups/my`
- [ ] Membership
  - [ ] `POST /groups/:groupId/join`
  - [ ] `POST /groups/:groupId/leave`
- [ ] Messages
  - [ ] `GET /groups/:groupId/messages?cursor=...` (cursor pagination)
- [ ] Notifications (in-app)
  - [ ] `GET /notifications`
  - [ ] `POST /notifications/:id/read`

**DoD**

- Client can render group lists and pull message history without WS.

**Notes**

-

---

## 5) WebSocket foundation (socket.io + JWT)

- [ ] Add socket.io server
- [ ] Implement JWT auth in handshake
  - [ ] Reject invalid/expired tokens
  - [ ] Attach `userId` to socket context
- [ ] Room strategy
  - [ ] Join `user:{userId}` room
  - [ ] Join `group:{groupId}` rooms for memberships (on connect + when joining)
- [ ] Version the protocol
  - [ ] Define `protocolVersion` constant
  - [ ] Include it in connect/hello event

**DoD**

- Authenticated sockets can connect and join the correct rooms.

**Notes**

-

---

## 6) Redis presence + typing (ephemeral)

- [ ] Add Redis client in server
- [ ] Implement presence keys + TTL
  - [ ] On connect: mark online in each group
  - [ ] On disconnect: best-effort cleanup (optional; TTL is primary)
  - [ ] Heartbeat/refresh: extend TTL periodically
- [ ] Implement typing indicators (no persistence)
  - [ ] Events: `typing:start`, `typing:stop`
  - [ ] Broadcast to `group:{groupId}`
- [ ] Add socket.io Redis adapter (for horizontal scaling)

**DoD**

- Two clients in same group see each other online and typing.

**Notes**

-

---

## 7) Real-time chat (store + broadcast + ack)

- [ ] Event: `message:send`
  - [ ] Validate membership
  - [ ] Persist message
  - [ ] Enforce idempotency (unique key per sender)
  - [ ] Emit `message:ack` to sender
  - [ ] Broadcast `message:new` to group room
- [ ] Backfill strategy on reconnect
  - [ ] On reconnect: client refetches latest messages via HTTP

**DoD**

- Sending a message results in DB record + immediate broadcast + ack.

**Notes**

-

---

## 8) Notifications (in-app)

- [ ] Create `Notification` records on relevant events
  - [ ] New group message (based on preferences and/or “not currently viewing group” heuristic)
- [ ] Emit `notification:new` over WS to `user:{userId}` room
- [ ] Unread counts
  - [ ] Add simple unread count calculation (v1 acceptable)

**DoD**

- User receives in-app notification and can mark it read.

**Notes**

-

---

## 9) Client integration (Groups tab)

- [ ] Wire Groups list screen to real API (replace/mock store as needed)
- [ ] Add Group detail/chat screen
  - [ ] Paginated history (HTTP)
  - [ ] Live updates (WS)
  - [ ] Composer with optimistic UI + ack reconciliation
  - [ ] Typing indicator
  - [ ] Presence indicator (online count)
- [ ] Add join/leave UX
- [ ] Add notification UI integration (if notifications tab exists)

**DoD**

- End-to-end flow works in the app: discover → join → chat → see live updates.

**Notes**

-

---

## 10) Guardrails: validation, rate limits, abuse hooks

- [ ] Input validation (message length, groupId shape)
- [ ] Rate limit message sending
- [ ] Add minimal reporting stub (optional v1)

**DoD**

- Obvious abuse vectors are mitigated for launch.

**Notes**

-

---

## 11) Testing + observability

- [ ] Add service-level tests (membership checks, message creation)
- [ ] Add minimal WS smoke test (connect/send/receive)
- [ ] Add structured logs (connect/disconnect/send errors)
- [ ] Add basic metrics counters (optional)

**DoD**

- Basic regressions are covered; logs help debug live issues.

**Notes**

-

---

# WS Event Contract (v1)

Client → Server

- `message:send` `{ groupId, channelId?, body, clientMessageId }`
- `typing:start` `{ groupId, channelId? }`
- `typing:stop` `{ groupId, channelId? }`

Server → Client

- `message:new` `{ groupId, channelId?, message }`
- `message:ack` `{ clientMessageId, serverMessageId, createdAt }`
- `typing:update` `{ groupId, channelId?, userId, isTyping }`
- `presence:update` `{ groupId, onlineCount, onlineUserIds? }` (choose one: count-only for privacy)
- `notification:new` `{ notification }`
- `error` `{ code, message, context? }`

---

# Acceptance checks (quick manual)

- Join group updates “My Groups” immediately
- Two devices chatting in the same group see messages in real time
- Reconnect doesn’t duplicate messages (idempotency works)
- Presence shows online/typing changes (best-effort)
- Notifications appear and can be marked read
