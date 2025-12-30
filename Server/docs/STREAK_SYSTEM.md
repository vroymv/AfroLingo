# Streak System (10 XP/day, timezone midnight)

This document describes how the **daily streak** system works in AfroLingo as implemented across **backend + client**.

## Definition

A user earns **one streak day** for a calendar day if they earn at least **10 XP** that day.

- **Threshold:** `10 XP`
- **Day boundary:** **midnight in the user’s timezone** (strict local-day reset)
- **Negative XP:** does **not** reduce today’s streak progress and does **not** un-qualify a streak day.

## Data Model

No new tables are required. The implementation uses two existing sources of truth:

### 1) `User` (streak counters)

Stored on the `User` record:

- `currentStreakDays` – current consecutive streak length
- `longestStreakDays` – best streak ever achieved
- `lastStreakDate` (`DATE`) – the most recent **calendar day** that counted as a streak day
- `timezone` – IANA timezone string (e.g. `"Africa/Nairobi"`). If missing, UTC is used.

### 2) `UserDailyActivity` (per-day accumulator)

A single row per user per day:

- `date` (`DATE`) – the user-local calendar day (stored as a pure date)
- `xpEarned` – total **positive** XP earned that day (via XP awards)
- `isStreakDay` – whether `xpEarned >= 10` for that day

The constraint `@@unique([userId, date])` guarantees only one record exists per user per day.

## Backend Implementation

### Where streak updates happen

Streak updates are **server-authoritative** and are applied automatically whenever XP is awarded through:

- `POST /api/xp/award`

That endpoint calls the shared XP service:

- [Server/src/services/xpService.ts](../src/services/xpService.ts)

### Transaction & idempotency

The XP award service runs the following in **one database transaction**:

1. Check duplicate by `idempotencyKey`
2. Create the `XpTransaction`
3. If `amount > 0`, update daily XP + streak

If the request is a duplicate, the transaction short-circuits and **does not** update daily XP or streak.

### Timezone day-key logic

The server converts “now” into a user-local calendar date key:

- [Server/src/utils/dateKey.ts](../src/utils/dateKey.ts)

Key functions:

- `getDateKeyInTimeZone(date, timezone)` → `YYYY-MM-DD`
- `dateFromDateKey("YYYY-MM-DD")` → `Date` at `00:00:00Z` (stable date mapping for DB `DATE`)

This ensures the day boundary is **strictly midnight in the user’s timezone**.

### Daily XP accumulation

On a positive XP award, the backend:

- Computes `todayKey` in the user’s timezone
- Reads `UserDailyActivity` for `(userId, todayDate)`
- Increments `xpEarned` by `xpDelta`
- Recomputes `isStreakDay = (xpEarned >= 10)`

### When streak counters update

The streak counters update **only once per day**:

- The backend updates `User.currentStreakDays/longestStreakDays/lastStreakDate` **only when the day first crosses** from `< 10 XP` to `>= 10 XP`.

This prevents multiple activities in the same day from inflating the streak.

Rules on first qualification for `todayKey`:

- If `lastStreakDate == todayKey`: no change (already counted today)
- Else if `lastStreakDate == yesterdayKey`: `currentStreakDays += 1`
- Else: `currentStreakDays = 1` (gap detected → streak resets)
- `longestStreakDays = max(longestStreakDays, currentStreakDays)`
- `lastStreakDate = todayKey`

### Negative XP policy

Negative XP awards (if any exist) are still written to `XpTransaction`, but **do not**:

- decrement `UserDailyActivity.xpEarned`
- flip `UserDailyActivity.isStreakDay` from true → false
- change streak counters

## Progress Tracker API

The client’s “live stats” widget fetches from:

- `GET /api/progress-tracker/:userId`

Implemented in:

- [Server/src/routes/progressTracker.ts](../src/routes/progressTracker.ts)

### Response shape (backward-compatible)

Existing fields are preserved:

- `totalXP`
- `streakDays` (current streak)
- `completedActivities`

Additional streak fields are included:

- `longestStreakDays`
- `lastStreakDate` (YYYY-MM-DD or null)
- `todayDate` (YYYY-MM-DD in user’s timezone)
- `todayXpEarned`
- `todayIsStreakDay`
- `streakThreshold` (currently `10`)

## Frontend Integration

### Data fetching

The client fetch helper is:

- [Client/services/progressTracker.ts](../../Client/services/progressTracker.ts)

It remains compatible with older servers because the new fields are **optional** in the TypeScript type.

### UI rendering

The lessons dashboard displays streak + today’s streak progress in:

- [Client/components/learn/ProgressTracker.tsx](../../Client/components/learn/ProgressTracker.tsx)

The dashboard page passes the live stats through:

- [Client/components/learn/LessonsTab.tsx](../../Client/components/learn/LessonsTab.tsx)

Minimal UI additions:

- Best streak line: `Best streak: X days`
- Today progress line: `Today: Y/10 XP` (+ “Streak day” when qualified)

## Example Timeline

Assume the user timezone is `Africa/Nairobi`.

- Day 1: user earns 6 XP → `todayXpEarned=6`, `isStreakDay=false`, streak unchanged
- Later Day 1: user earns 5 XP → `todayXpEarned=11`, `isStreakDay=true`, streak becomes 1
- Same Day 1: more XP → daily XP increases, but streak stays 1
- Day 2: user earns 10+ XP → streak becomes 2
- Day 3: user earns 0 XP → at midnight the day changes; streak will reset to 1 next time they qualify again (because of the gap)

## Operational Notes

- If you set `User.timezone` during onboarding, the streak will match local midnight perfectly.
- Users without a timezone will use UTC day boundaries.
- If you ever need to backfill streak counters, you can recompute from `UserDailyActivity` by scanning `isStreakDay=true` days in date order.
