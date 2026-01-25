# AfroLingo — Notifications (Selected Scope) Implementation Checklist

Goal

Ship a small, high-signal notification system for AfroLingo covering:

1. Learning & Progress
2. Tutor Chat
3. Groups
4. Community Feed
5. Onboarding & Account

This document is designed to be checked off iteratively as features land.

---

## Status legend

- [ ] Not started
- [x] Done
- [!] Needs confirmation (do not implement yet)

---

## 0) Foundations (do these first)

### 0.1 Decide: in-app only vs push notifications

**Why this matters:** Daily reminders and message alerts typically imply push/local notifications. The codebase already has an in-app notifications feed + websocket events.

- [x] Confirm delivery channels for each notification type:
  - In-app notification inbox (existing)
  - Push notifications (remote push): not in scope for now
  - Local notifications (scheduled on-device): learning only

**Decision options (recommended):**

- Option A (fastest): In-app notifications for social + messages, plus local scheduled reminders for learning.
- Option B (full): In-app + push notifications for all “actionable” events, plus local scheduled reminders.

**Confirmed:** Option A

### 0.2 Confirm: notification preferences storage

**Why this matters:** You already have a Notifications settings UI screen, but it appears local-only right now.

- [x] Confirm where preferences should live:
  - Server-stored per user (recommended for cross-device consistency)
  - Device-local only (fastest, but not consistent)

**Confirmed:** Server-stored per user

### 0.3 Confirm: what counts as “inactive” for reactivation

- [x] Confirm inactivity signal:
  - “No lesson activity logged”
  - “No app opens”
  - “No tutor/group/community interactions”

**Confirmed:** No lesson activity logged

### 0.4 Foundation implementation tasks (next)

#### 0.4.1 Server-stored notification preferences

- [x] Add data model for notification preferences (per user)
- [x] Add API endpoints
  - [x] GET my notification preferences
  - [x] PATCH my notification preferences
- [x] Update Client Notifications settings screen to load/save preferences
- [x] Ensure server-side notification creation respects preferences (where applicable)

#### 0.4.2 Local scheduled learning reminders (device)

- [x] Add local notification scheduling for Daily Practice Reminder
- [x] Add reschedule logic when reminder time changes
- [x] Add disable logic when toggle is turned off

#### 0.4.3 Reactivation based on lesson activity

- [ ] Confirm lesson activity logging exists (required for “inactive”)
- [ ] Implement detection
  - [ ] Server-driven scheduled job/cron + DB query (preferred)
  - [ ] Device-driven checks (fallback)

---

## 1) Existing Notifications Infrastructure (baseline)

### 1.1 In-app notifications API + socket events

- [x] Server can create notifications (Prisma `notification` table)
- [x] Server can emit `notification:new` over socket.io
- [x] Client listens for `notification:new` and updates unread badge
- [x] Client can fetch notifications list + unread count
- [x] Client can mark notifications as read
- [x] Client can deep-link from notification to destination (where applicable)

**Implementation references (already in repo):**

- In-app notification sheet + mapping logic: Client/components/home/HeaderSection.tsx
- Badge/socket provider: Client/contexts/community/NotificationBadgeContext.tsx
- Notifications API: Server/src/routes/community.ts
- Group message notification creation: Server/src/realtime/socketServer.ts

### 1.2 Email verification reminder (Onboarding & Account)

- [x] Show post-signup email verification reminder
- [x] Optional toast/banner alternatives documented

**Docs already in repo:**

- Client/docs/email-verification-notification.md
- Client/docs/POST_SIGNUP_NOTIFICATION_COMPLETE.md

---

## 2) Learning & Progress

### 2.1 Daily practice reminder (customizable time)

- [ ] Add “Daily reminder time” control wired to persistence (device and/or server)
- [ ] Implement scheduling mechanism (see confirmation in section 0)
  - [ ] Local scheduled notification at chosen time
  - [ ] Reschedule when user changes time
  - [ ] Disable scheduling when user toggles off
- [ ] UX: Copy matches “keep your streak alive” intent

**Acceptance checks**

- [ ] User can pick a time, and reminders arrive at that time
- [ ] Turning it off stops reminders

### 2.2 Streak at risk (“X hours left”)

- [!] Confirm streak definition + timezone rules
  - What is a “day” boundary? (local midnight vs rolling 24h)

- [ ] Track streak state reliably
- [ ] Trigger alert when streak is at risk
  - [ ] If local-only: compute on device and schedule/check daily
  - [ ] If server-driven: compute on backend and notify user

**Acceptance checks**

- [ ] If user hasn’t practiced, they get a warning before streak resets

### 2.3 Reactivation nudges (3 / 7 / 14 days inactive)

- [ ] Decide inactivity signal (section 0.3)
- [ ] Implement detection
  - [ ] If server-driven: scheduled job/cron + DB query
  - [ ] If device-driven: local check on app open + local schedule
- [ ] Throttling: never send more than one reactivation notification per period

**Acceptance checks**

- [ ] After 3/7/14 days inactive, user receives one gentle nudge

---

## 3) Tutor Chat

### 3.1 New message from a tutor

- [!] Confirm tutor messaging architecture
  - Is tutor chat real-time via websockets? polling? Firebase? server API?

- [ ] Create notification record when a tutor sends a message
- [ ] Emit `notification:new` for in-app inbox
- [ ] (Optional) Push notification if enabled

**Acceptance checks**

- [ ] User sees unread badge increment and a notification item
- [ ] Notification links to the right tutor thread

---

## 4) Groups

### 4.1 New group message

- [x] Create in-app notification for offline group recipients
- [x] Emit `notification:new` event
- [x] Respect `groupMessageNotificationsEnabled` preference when creating notifications

**Note:** Current behavior appears to notify only users who are not “online in the group”.

**Follow-ups (optional, confirm before changing behavior):**

- [!] Confirm if you want notifications even when user is online but not viewing that channel

---

## 5) Community Feed

### 5.1 Someone liked / commented / replied to your post

- [!] Confirm which interactions create notifications (recommended defaults):
  - Reply to your post: yes
  - Comment on your post: yes
  - Like your post: optional (can be noisy)

- [ ] Create notification records on the server for each event type
- [ ] Emit `notification:new`
- [ ] Notification payload includes deep-link data (postId, commentId)

**Acceptance checks**

- [ ] Notifications appear for the selected interaction types

### 5.2 Someone connected to you (follow)

- [!] Confirm “connect” model:
  - One-way follow
  - Two-way friend/connection

- [ ] Create notification when someone follows/connects
- [ ] Emit `notification:new`

**Acceptance checks**

- [ ] User gets one notification per new follower/connection

---

## 6) Notification Settings UX (Client)

You already have a Notifications settings screen; this section is about wiring it up.

- [x] Persist settings (device and/or server; see section 0.2)
- [x] Add toggles matching the scoped list:
  - [x] Daily practice reminder + time picker
  - [x] Streak at risk (toggle exists; delivery implementation pending)
  - [x] Reactivation nudges (toggle exists; delivery implementation pending)
  - [x] Tutor chat messages (toggle exists; notification implementation pending)
  - [x] Group messages
  - [x] Community activity (likes/comments/replies) (toggle exists; notification implementation pending)
  - [x] New follower/connection (toggle exists; notification implementation pending)
  - [ ] Email verification reminder (already implemented, but could be a preference)
- [ ] Ensure settings actually gate notification creation/sending (per-notification type)

---

## 7) Rollout / Guardrails

- [ ] Rate limiting / dedupe rules
  - [ ] Prevent duplicate notifications on retries
  - [ ] Prevent spam for repeated likes/unlikes
- [ ] Backfill strategy (usually none; start fresh)
- [ ] Analytics (optional): open rate and disable rate

---

## 8) Manual acceptance checklist

- [ ] Daily reminder schedules correctly and can be disabled
- [ ] Streak-risk warning triggers under the agreed rules
- [ ] Reactivation triggers at 3/7/14 days under the agreed rules
- [ ] Tutor message produces in-app notification
- [ ] Group message produces in-app notification (existing)
- [ ] Community like/comment/reply produces in-app notification
- [ ] Follow/connect produces in-app notification
- [ ] Email verification reminder works (existing)

---

## Notes / Open questions

Add any new notification ideas here (do not implement without confirming scope).
