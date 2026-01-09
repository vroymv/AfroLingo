# AfroLingo — Groups Tab (Agent Build Checklist)

This document is a condensed, execution-oriented checklist intended for an AI coding agent to build the Groups tab end-to-end.

How to use

- Work top-to-bottom.
- After completing a step, change `- [ ]` to `- [x]` and (optionally) add a short note under **Notes** for that step.
- Prefer small PR-sized increments (or small commits if you’re not using PRs).

## Locked decisions

- Transport: **socket.io**
- WS auth: **Firebase Auth ID token** (validated during socket.io handshake via Firebase Admin)
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
  - [ ] `REDIS_URL`
  - [ ] Firebase Admin credentials (`GOOGLE_APPLICATION_CREDENTIALS` or service-account env vars)

_Note: Server DB connectivity now supports `DATABASE_URL` (preferred) in addition to the older `PGHOST/PGDATABASE/PGUSER/PGPASSWORD` style._

**DoD**

- Server boots with DB connectivity.

**Notes**

- ***

## 1) Data model (Prisma schema)

- [x] Add Prisma models for groups + chat (v1 minimal)
  - [x] `Group`
  - [x] `GroupMembership`
  - [x] (Optional for v1) `GroupChannel` (or assume implicit “General”)
  - [x] `GroupMessage` (append-only)
  - [x] `Notification` (in-app)
- [x] Add enums (if needed)
  - [x] `GroupPrivacy` (PUBLIC/PRIVATE/INVITE)
  - [x] `GroupRole` (OWNER/MEMBER)
  - [x] `NotificationType` (GROUP_MESSAGE, etc.)
- [x] Add indexes + unique constraints
  - [x] Unique membership per (groupId, userId)
  - [x] Message indexes for pagination (groupId/channelId + createdAt)
  - [x] Notification indexes (userId + createdAt, userId + readAt)

**DoD**

- `Server/prisma/schema.prisma` updated.
- Migration is created and applies cleanly.

**Notes**

- ***

## 2) Migration + Prisma client

- [x] Run migration generation
- [x] Ensure Prisma Client generation succeeds
- [x] Verify tables exist (quick SQL sanity)

**DoD**

- DB schema matches Prisma; server compiles.

**Notes**

- ***

## 3) Seed data (for realistic testing)

- [x] Add deterministic seed script
  - [ ] Create ~10–30 groups across languages
  - [ ] Create memberships for a few test users
  - [ ] Seed message history for 3–5 groups
- [ ] Add a `package.json` script to run seed
- [ ] Document seed accounts + group IDs in this file (or Server/README)

Run command (local/dev):

- `cd Server && npx ts-node prisma/seed-groups-only.ts`

**DoD**

- Fresh DB can be seeded repeatedly with stable results.

**Notes**

- ***

## 4) HTTP API (baseline, required even with WS)

- [x] Group discovery
  - [x] `GET /api/community/groups/discover/:userId` (search/filter)
  - [x] `GET /api/community/groups/my/:userId`
- [x] Membership
  - [x] `POST /api/community/groups/:userId/join/:groupId`
  - [x] `DELETE /api/community/groups/:userId/leave/:groupId`
- [x] Messages
  - [x] `GET /api/community/groups/:userId/:groupId/messages?cursor=...` (cursor pagination)
- [ ] Notifications (in-app)
- [x] Notifications (in-app)
  - [x] `GET /api/community/notifications/:userId`
  - [x] `POST /api/community/notifications/:userId/read/:notificationId`

**DoD**

- Client can render group lists and pull message history without WS.

**Notes**

- ***

## 5) WebSocket foundation (socket.io + Firebase)

- [x] Add socket.io server
- [x] Implement Firebase ID token auth in handshake (Firebase Admin verifies token)
  - [x] Reject invalid/expired tokens
  - [x] Attach `userId` to socket context
- [x] Room strategy
  - [x] Join `user:{userId}` room
  - [x] Join `group:{groupId}` rooms for memberships (on connect + `groups:sync`)
- [x] Version the protocol
  - [x] Define `protocolVersion` constant
  - [x] Include it in connect/hello event

**DoD**

- Authenticated sockets can connect and join the correct rooms.

**Notes**

- ***

## 6) Redis presence + typing (ephemeral)

- [x] Add Redis client in server
- [x] Implement presence keys + TTL
  - [x] On connect: mark online in each group
  - [x] On disconnect: best-effort cleanup (optional; TTL is primary)
  - [x] Heartbeat/refresh: extend TTL periodically
- [x] Implement typing indicators (no persistence)
  - [x] Events: `typing:start`, `typing:stop`
  - [x] Broadcast to `group:{groupId}`
- [x] Add socket.io Redis adapter (for horizontal scaling)

**DoD**

- Two clients in same group see each other online and typing.

**Notes**

- ***

## 7) Real-time chat (store + broadcast + ack)

- [x] Event: `message:send`
  - [x] Validate membership
  - [x] Persist message (supports `channelId`)
  - [x] Enforce idempotency (unique key per sender)
  - [x] Emit `message:ack` to sender
  - [x] Broadcast `message:new` to group room
- [ ] Backfill strategy on reconnect
  - [ ] On reconnect: client refetches latest messages via HTTP

**DoD**

- Sending a message results in DB record + immediate broadcast + ack.

**Notes**

- ***

## 8) Notifications (in-app)

- [x] Create `Notification` records on relevant events
  - [x] New group message (offline-only: recipients not present per Redis presence)
- [x] Emit `notification:new` over WS to `user:{userId}` room
- [ ] Unread counts
  - [ ] Add simple unread count calculation (v1 acceptable)

**DoD**

- User receives in-app notification and can mark it read.

**Notes**

- ***

## 9) Client integration (Groups tab)

- [x] Wire Groups list screen to real API (replace/mock store as needed)
- [x] Add Group detail/chat screen (baseline)
  - [x] History fetch (HTTP)
  - [x] Live updates (WS `message:new` + `message:ack`)
  - [x] Composer with optimistic UI + ack reconciliation
  - [x] Typing indicator (WS `typing:start/stop` + `typing:update`)
  - [x] Presence indicator (online count via `presence:update` + heartbeat)
  - [x] Suppress unread while viewing active group
- [x] Add join/leave UX (HTTP + `groups:sync`)
- [x] Add notification badge UI
  - [x] Badge on Community bottom tab
  - [x] Badge on Community→Groups top tab

**DoD**

- End-to-end flow works in the app: discover → join → chat → see live updates.

**Notes**

- ***

## 10) Guardrails: validation, rate limits, abuse hooks

- [x] Input validation (message length, groupId shape)
- [x] Rate limit message sending
- [x] Add minimal reporting stub (optional v1)

**DoD**

- Obvious abuse vectors are mitigated for launch.

**Notes**

- ***

## 11) Testing + observability

- [ ] Add service-level tests (membership checks, message creation)
- [ ] Add minimal WS smoke test (connect/send/receive)
- [ ] Add structured logs (connect/disconnect/send errors)
- [ ] Add basic metrics counters (optional)

**DoD**

- Basic regressions are covered; logs help debug live issues.

**Notes**

- ***

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
