-- Backfill goal snapshot fields on daily activity rows.
-- These fields should default to the user's current goal configuration at the time the daily row is first created.

UPDATE "user_daily_activity" AS uda
SET "goalXp" = u."dailyXpGoal"
FROM "users" AS u
WHERE uda."userId" = u."id"
  AND uda."goalXp" IS NULL;

UPDATE "user_daily_activity" AS uda
SET "goalLessons" = u."dailyLessonGoal"
FROM "users" AS u
WHERE uda."userId" = u."id"
  AND uda."goalLessons" IS NULL
  AND u."dailyLessonGoal" IS NOT NULL;
