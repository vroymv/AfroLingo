-- AlterTable
ALTER TABLE "user_daily_activity" ADD COLUMN     "goalLessons" INTEGER,
ADD COLUMN     "goalXp" INTEGER,
ADD COLUMN     "metGoal" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "currentStreakDays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dailyLessonGoal" INTEGER,
ADD COLUMN     "dailyXpGoal" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "lastStreakDate" DATE,
ADD COLUMN     "longestStreakDays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "timezone" TEXT;
