-- AlterTable
ALTER TABLE "users" ADD COLUMN     "achievementUnlockedNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "communityActivityNotificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dailyReminderEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "dailyReminderTime" TEXT NOT NULL DEFAULT '09:00',
ADD COLUMN     "streakAlertsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "weeklySummaryEnabled" BOOLEAN NOT NULL DEFAULT false;
