# UserDailyActivity (Daily Usage + Streak Aggregates)

This document describes how the `UserDailyActivity` table works in AfroLingo, what each field means, and exactly how rows are created/updated.

## Purpose

`UserDailyActivity` is a **per-user, per-local-day** summary row.

It is used for:

- **Streak progress** (XP threshold per user-local calendar day)
- **Daily rollups** such as how many units/activities were completed on a given day
- **App usage signals** (open/close timestamps and counts)

It is intentionally **best-effort**: mobile apps can be killed by the OS, users can lose connectivity, etc.

## Key Concept: “Local Day”

All rows are keyed by the user’s local calendar day.

- If `User.timezone` is set (IANA tz like `"Africa/Nairobi"`), day boundaries are computed using that timezone.
- If `User.timezone` is missing, we fall back to `UTC`.

The database column `UserDailyActivity.date` is stored as a `DATE` (no time). We store it as a stable mapping from the local day key (`YYYY-MM-DD`) into a `Date` value at `00:00:00Z` so Prisma can write a Postgres `DATE`.

## Uniqueness / Upserts

There is always at most one row for a given user and local day:

- Unique constraint: `(userId, date)`

All writes use `create`, `update`, or `upsert` using that key.

## Table Fields

### Primary key & day

- `userId`: the user identifier (Firebase UID in this app)
- `date`: the user-local day key stored as a Postgres `DATE`

### App usage (best-effort)

These fields are populated by explicit “open/close” signals from the client:

- `firstAppOpenedAt`: first time the backend saw the app open that day
- `lastAppOpenedAt`: most recent app open signal that day
- `lastAppClosedAt`: most recent app close/background signal that day
- `appOpensCount`: number of open signals recorded that day
- `appClosesCount`: number of close signals recorded that day

Notes:

- These timestamps are **server timestamps** (based on when the request arrives).
- If the OS kills the app or the user loses network, you may see opens without closes.

### Activity metrics

- `activitiesCompleted`: number of `ActivityProgress` rows completed that day (by `completedAt` in the user-local day)
- `unitsCompleted`: number of `UserProgress` rows completed that day (by `completedAt` in the user-local day)

These are computed from existing tables when the app sends the “close” signal.

### XP / streak

- `xpEarned`: total **positive XP** earned that day (sum of `XpTransaction.amount > 0` inside the local-day bounds)
- `isStreakDay`: `true` if `xpEarned >= 10`

Important policies:

- Negative XP does not reduce daily streak progress.
- Streak counters on `User` are updated by the XP award flow (see below).

### Goal snapshot

- `goalXp`, `goalLessons`: a snapshot of the user’s configured daily goals at the time we write the daily row
- `metGoal`: whether a daily goal award has already been granted (used by the goal award logic)

## How Rows Are Populated (End-to-End)

There are **two primary write paths**:

### 1) App Open (client → backend)

When the user opens the app or returns to foreground, the client calls:

- `POST /api/app-usage/open`

Backend behavior:

- Computes `todayKey` from user timezone
- Upserts `(userId, todayDate)`
- Sets:
  - `firstAppOpenedAt` (if not already set)
  - `lastAppOpenedAt` (always)
  - increments `appOpensCount`

No XP/streak logic happens here.

### 2) App Close / Background (client → backend)

When the user backgrounds the app or closes it, the client calls:

- `POST /api/app-usage/close`

Backend behavior:

1. Compute the user-local date key `todayKey`.
2. Compute the **UTC timestamp range** that corresponds to the user-local day:
   - `startUtc = local midnight of todayKey (in user timezone) converted to UTC`
   - `endUtc = local midnight of tomorrowKey converted to UTC`
3. Recompute rollups from existing data inside `[startUtc, endUtc)`:
   - `activitiesCompleted` from `ActivityProgress` where `isCompleted=true` and `completedAt` is within the range
   - `unitsCompleted` from `UserProgress` where `completedAt` is within the range
   - `xpEarned` from `XpTransaction` sum where `amount > 0` and `createdAt` is within the range
4. Upsert the `UserDailyActivity` row for that local day:
   - updates `lastAppClosedAt`
   - increments `appClosesCount`
   - writes `activitiesCompleted`, `unitsCompleted`, `xpEarned`
   - sets `isStreakDay` to true if the day qualifies
   - snapshots `goalXp`/`goalLessons`

This makes the daily row converge toward a correct rollup even if the user earned XP across multiple activities.

### 3) XP Award (backend-authoritative)

Separately from app open/close, XP is awarded through:

- `POST /api/xp/award`

This flow is server-authoritative and runs in a DB transaction:

- Writes an `XpTransaction` with an idempotency key
- If `amount > 0`, increments the current day’s `UserDailyActivity.xpEarned` and updates `isStreakDay`
- When the day first crosses the streak threshold, updates the `User` streak counters

This is the **source of truth** for streak counters.

## Design Notes / Tradeoffs

- **Why compute aggregates on close?** It gives you a single “session-end” moment to refresh counts from authoritative tables.
- **Why still update `xpEarned` during XP award?** It provides real-time streak progress for the UI during a session.
- **Why store both open/close timestamps and computed counts?** Open/close is a usage signal; counts summarize learning actions.

## Caveats

- If a session crosses local midnight (open before midnight, close after), the close signal will be recorded for the new local day.
- Mobile apps can terminate without a close event; counts will still be correct for XP/streak because XP awards update daily XP.
