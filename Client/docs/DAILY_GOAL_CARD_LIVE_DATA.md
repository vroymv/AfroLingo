# DailyGoalCard Live Data (How it works)

This document explains where the data shown in **DailyGoalCard** comes from and how it stays up to date.

## 1) What DailyGoalCard displays

The card is intended to show (all for **today**, in the user’s timezone):

- Current streak days (🔥)
- Daily XP goal progress (% ring)
- Lessons completed today (uses “activities completed today” as the lessons counter)
- XP earned today + remaining XP to daily goal

## 2) Client data flow

### Component

- `DailyGoalCard` fetches data when the Home screen gains focus using `useFocusEffect`.
- It calls `getProgressTrackerStats(user.id)`.

### Client service

- The fetch helper is `Client/services/progressTracker.ts`.
- It calls the backend:

  `GET {EXPO_PUBLIC_API_BASE_URL}/progress-tracker/:userId`

### Why `useFocusEffect`

Using `useFocusEffect` means:

- When the user returns to Home (after completing a lesson/activity), the card refreshes automatically.
- No polling is required.

## 3) Backend data flow

### Endpoint

The live payload is served by:

- `GET /api/progress-tracker/:userId`

Implementation:

- `Server/src/routes/progressTracker.ts`

### Returned fields used by DailyGoalCard

The endpoint returns a `data` object. The card uses these fields:

- `streakDays` → shown in the 🔥 badge
- `todayXpEarned` → used to compute % and “+X XP earned”
- `dailyXpGoal` / `todayGoalXp` → used for goal target
- `todayActivitiesCompleted` → used for “lessons completed today”
- `dailyLessonGoal` / `todayGoalLessons` → used for “X of Y lessons”

Notes:

- `todayGoalXp` and `todayGoalLessons` are “snapshotted” daily goals (if present on the daily row). The client falls back to the user-level defaults.

## 4) Where “today” comes from (midnight reset)

The backend computes the user-local date key `YYYY-MM-DD` using the user’s IANA timezone (`User.timezone`).

Utility:

- `Server/src/utils/dateKey.ts`

This makes the system **strict about midnight** in the user’s timezone: when the local date flips, the “today” row changes.

## 5) How today’s XP and lesson counts get into the database

### Source of truth: XP awards

Today’s rollups are updated as a side effect of awarding XP.

When the app awards XP (client `awardXP()` → server `POST /api/xp/award`), the server writes:

1. `XpTransaction` (idempotent via `idempotencyKey`)
2. A daily rollup row in `UserDailyActivity` (for the user-local date)

Implementation:

- `Server/src/services/xpService.ts`

### Important rules

- Only **positive** XP updates daily rollups.
- Duplicate XP awards (same idempotency key) do not update daily rollups.

### Fields updated per award

Inside the XP award transaction, the server:

- Increments `UserDailyActivity.xpEarned` by the awarded XP.
- If the XP award `sourceType` is:
  - `activity_completion`: increments `UserDailyActivity.activitiesCompleted`
  - `unit_completion` or `lesson_completion`: increments `UserDailyActivity.unitsCompleted`

### Daily goals

When the daily row is created/updated, it also records daily goal “snapshots”:

- `goalXp` from `User.dailyXpGoal`
- `goalLessons` from `User.dailyLessonGoal`

This is why the progress-tracker endpoint can return both:

- current user-level goal settings, and
- the day’s goal snapshot.

## 6) Known limitations / assumptions

- “Lessons completed today” is currently backed by `todayActivitiesCompleted` (activity completions). If you later add a true “lesson completion” event, the card can be switched to count that instead.
- If a user doesn’t earn XP (e.g., they browse without completing anything), there may be no `UserDailyActivity` row for today; in that case the API returns `0` for today fields.

## 7) Troubleshooting

If the card stays at zero:

- Confirm `EXPO_PUBLIC_API_BASE_URL` is set.
- Confirm XP is being awarded via `POST /api/xp/award` when activities complete.
- Confirm the user has `timezone` set (otherwise UTC midnight is used).
- Confirm the server is running and `GET /api/progress-tracker/:userId` returns data.
