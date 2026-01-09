# AfroLingo — WhatsApp-style Create Group + Invites (Implementation Checklist)

Goal

Build a WhatsApp-like “Create Group” wizard in the Client that:

- Lets a creator select participants to invite (search any user)
- Allows creating an empty group (invite later)
- Uses a multi-step flow (single route with internal step state)
- Defaults privacy to **Private**
- Does **not** add members automatically (invites only)
- Invites must be visible from the in-app **Notifications modal**

Scope assumptions (confirmed)

- Participants come from **all users** (server-side search)
- Selected users receive **invites** (no automatic membership)
- Group icon picker: **not in v1**

---

## 0) Preflight

- [x] Confirm current create-group UI entry point(s)
- [x] Confirm there is no existing create-group HTTP endpoint (avoid duplication)

**DoD**

- We know which screens/routes to update and which APIs already exist.

**Notes**

- ***

---

## 1) Server data model (Prisma)

- [x] Add invite model(s)
  - [x] `GroupInvite` (or `GroupInvitation`) model for pending invites
  - [x] Invite status enum (e.g. PENDING/ACCEPTED/DECLINED/CANCELED)
- [x] Add indexes + constraints
  - [x] Unique invite per `(groupId, invitedUserId)`
  - [x] Query-friendly indexes for “my pending invites”
- [x] Add notification type for invites (optional but recommended)

**DoD**

- Prisma schema updated; migration applies cleanly.

**Notes**

- ***

---

## 2) Server HTTP API (Create group + invite lifecycle)

- [x] Create group endpoint
  - [x] `POST /api/community/groups/:userId/create`
  - [x] Creates group + creator membership (OWNER)
  - [x] Creates default channel (“General”)
  - [x] Creates invites for selected users (if any)
- [x] Invites endpoints
  - [x] `GET /api/community/groups/:userId/invites` (pending invites)
  - [x] `POST /api/community/groups/:userId/invites/:inviteId/accept`
  - [x] `POST /api/community/groups/:userId/invites/:inviteId/decline`
- [x] Validation + guardrails
  - [x] Validate creator exists
  - [x] Validate invitee IDs exist (or ignore unknowns safely)
  - [x] Prevent self-invite
  - [ ] Ensure invitee is not already a member

**DoD**

- Endpoints work with realistic data; responses are stable for the Client.

**Notes**

- ***

---

## 3) Server real-time + notifications (optional v1 but high value)

- [x] Create in-app notifications for group invites
- [x] Emit WS event `notification:new` to invited users (if socket connected)

**DoD**

- Invited users see an in-app notification and/or badge.

**Notes**

- ***

---

## 4) Client services + types

- [x] Extend people discovery API to support server-side search
  - [x] `fetchDiscoverPeople(viewerId, { q, limit })`
- [x] Add group creation API client
  - [x] `createGroupWithInvites({ userId, name, privacy, invitedUserIds, ... })`
- [x] Add invite inbox API client
  - [x] `fetchGroupInvites(userId)`
  - [x] `acceptGroupInvite(userId, inviteId)` / `declineGroupInvite(userId, inviteId)`

**DoD**

- Client has typed wrappers for all required endpoints.

**Notes**

- ***

---

## 5) Client UX — WhatsApp-like create wizard (single route)

Route: keep using the existing entry route, but change it to a 2-step wizard.

- [x] Step 1: Add participants
  - [x] Search input (server-backed)
  - [x] Select/deselect users (multi-select)
  - [x] Selected “chips” row (optional)
  - [x] CTA: `Next` (enabled even if none selected)
- [x] Step 2: Group info
  - [x] Group name (required)
  - [x] Optional description + language + category (if desired)
  - [x] Privacy default = Private (toggle optional)
  - [x] CTA: `Create`
- [x] Success behavior
  - [x] Navigate to the group detail screen
  - [ ] Show invite sent confirmation (toast/snackbar if you have one)

**DoD**

- User can create a group with or without selected invitees.

**Notes**

- ***

---

## 6) Client state integration

- [x] Replace local-only `createGroup()` usage with server-backed creation
- [x] Refresh groups list after creation
- [x] Avoid breaking existing group list/chat flows

**DoD**

- Created groups appear in “My Groups” immediately.

**Notes**

- ***

---

## 7) Invites inbox UX (follow-up screen)

- [ ] Add a place to see pending invites (in Community → Groups, or a new screen)
- [ ] Ensure the notification modal surfaces group invites (and links to the invites inbox)
- [ ] Accept invite → joins group (membership created)
- [ ] Decline invite → invite marked declined

**DoD**

- Users can accept/decline invites and see the group appear/disappear correctly.

**Notes**

- ***

---

## 8) Validation + edge cases

- [ ] Creating group with zero invites
- [ ] Creating group with many invites (limit + error messaging)
- [ ] Invite accept when group deleted/inactive
- [ ] Duplicate accept/decline calls are safe (idempotent-ish)

**DoD**

- No obvious broken flows under repeated taps/network retries.

**Notes**

- ***

---

## 9) Manual acceptance checklist

- [ ] Search for users, select some, create group, verify invited users see invite
- [ ] Create group with no participants
- [ ] Accept invite and verify group appears in “My Groups”
- [ ] Decline invite and verify it disappears from pending
