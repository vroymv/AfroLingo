# Continue Lesson → Resume Most-Recent Unit (Home → Learn)

## Summary

Tapping **Continue Lesson** on the Home screen now resumes the user into the **most recently accessed, incomplete unit** by navigating to the existing unit screen at `/learn/lesson/[unitId]`.

This is implemented as:

- A server endpoint that computes a **resume unit** for a given user
- A client service call that fetches that unit
- Home navigation that deep-links into the unit route
- Best-effort tracking that updates `UserProgress.lastAccessedAt` whenever a unit is opened

---

## User Experience

### Home

- When the user taps **Continue Lesson**:
  1. The app requests a resume target from the server.
  2. If a unit is returned, the app navigates directly to that unit.
  3. If not (or request fails), it falls back to the Learn tab.

### Learn

- The unit route used is the existing unit screen:
  - `Client/app/learn/lesson/[unitId].tsx`

---

## Data Model Dependency

Resume prioritization depends on `UserProgress.lastAccessedAt` being meaningful.

Relevant fields (Prisma):

- `UserProgress.lastAccessedAt` — drives “most recently accessed” ordering
- `UserProgress.completedAt` and `UserProgress.progress` — determines “incomplete”

The app updates last access in two ways:

- When the user opens a unit from the Learn unit list (already implemented)
- When the user opens a unit via Home “Continue Lesson” (added)

---

## Server API

### 1) Get Resume Unit

**Route**: `GET /api/units/resume/:userId`

**Purpose**: Returns the best unit to resume.

**Selection rules**:

1. Find the user’s incomplete unit progress rows and choose the most recent by `lastAccessedAt`.
2. If none exist, fall back to the first active unit by `Unit.order`.

**Response (success)**

```json
{ "success": true, "data": { "unitId": "..." } }
```

**Response (no units)**

```json
{ "success": false, "message": "No active units available" }
```

### 2) Touch Unit Access (Last Accessed)

**Route**: `POST /api/units/:unitId/access`

**Purpose**: Upserts `UserProgress` for the user + unit and updates `lastAccessedAt`.

**Payload**

```json
{ "userId": "..." }
```

---

## Client Implementation

### Service

- `Client/services/units.ts`
  - `getResumeUnit(userId)` calls `GET /units/resume/:userId`

### Home Navigation

- `Client/app/(tabs)/index.tsx`
  - `handleTodayLesson` now:
    - calls `getResumeUnit(user.id)`
    - navigates to `/learn/lesson/[unitId]` when available
    - otherwise navigates to `/(tabs)/learn`

### Unit Screen “Touch”

- `Client/app/learn/lesson/[unitId].tsx`
  - On open, performs a best-effort `touchUnitAccess({ userId, unitId })` to keep resume ordering correct.

---

## Edge Cases & Fallbacks

- **Not signed in / missing user id**: navigate to Learn tab.
- **Resume endpoint fails**: navigate to Learn tab.
- **User has no progress yet**: server returns the first active unit by `order`.
- **No active units exist**: server returns 404; client falls back to Learn tab.

---

## Notes / Future Improvements (Optional)

- Enforce auth on the resume endpoint (instead of passing `userId` in the path) when your auth middleware is fully wired.
- If completion is tracked only via `completedAt` (and not `progress`), adjust the server-side incomplete logic accordingly.
- Expand resume target to activity-level resume if/when you want to jump into a specific activity.
