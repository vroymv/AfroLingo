-- DropIndex
DROP INDEX "tutor_chat_threads_learnerId_updatedAt_idx";

-- DropIndex
DROP INDEX "tutor_chat_threads_tutorId_updatedAt_idx";

-- AlterTable
ALTER TABLE "tutor_chat_threads" ADD COLUMN     "lastMessageAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "tutor_chat_threads_learnerId_lastMessageAt_idx" ON "tutor_chat_threads"("learnerId", "lastMessageAt" DESC);

-- CreateIndex
CREATE INDEX "tutor_chat_threads_tutorId_lastMessageAt_idx" ON "tutor_chat_threads"("tutorId", "lastMessageAt" DESC);
