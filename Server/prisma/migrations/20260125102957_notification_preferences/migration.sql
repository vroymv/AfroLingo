-- AlterTable
ALTER TABLE "users" ADD COLUMN     "groupMessageNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "newFollowerNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "reactivationNudgesEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tutorChatMessageNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true;

-- RenameIndex
ALTER INDEX "user_mistakes_userId_createdAt_desc_idx" RENAME TO "user_mistakes_userId_createdAt_idx";
