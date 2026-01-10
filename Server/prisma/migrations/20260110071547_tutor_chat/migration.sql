/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `tutors` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tutors" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "tutor_chat_threads" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "learnerLastReadAt" TIMESTAMP(3),
    "tutorLastReadAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutor_chat_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutor_chat_messages" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "clientMessageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tutor_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tutor_chat_threads_learnerId_updatedAt_idx" ON "tutor_chat_threads"("learnerId", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "tutor_chat_threads_tutorId_updatedAt_idx" ON "tutor_chat_threads"("tutorId", "updatedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "tutor_chat_threads_learnerId_tutorId_key" ON "tutor_chat_threads"("learnerId", "tutorId");

-- CreateIndex
CREATE INDEX "tutor_chat_messages_threadId_createdAt_idx" ON "tutor_chat_messages"("threadId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "tutor_chat_messages_senderId_idx" ON "tutor_chat_messages"("senderId");

-- CreateIndex
CREATE UNIQUE INDEX "tutor_chat_messages_senderId_clientMessageId_key" ON "tutor_chat_messages"("senderId", "clientMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "tutors_userId_key" ON "tutors"("userId");

-- CreateIndex
CREATE INDEX "tutors_userId_idx" ON "tutors"("userId");

-- AddForeignKey
ALTER TABLE "tutors" ADD CONSTRAINT "tutors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_chat_threads" ADD CONSTRAINT "tutor_chat_threads_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_chat_threads" ADD CONSTRAINT "tutor_chat_threads_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_chat_messages" ADD CONSTRAINT "tutor_chat_messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "tutor_chat_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_chat_messages" ADD CONSTRAINT "tutor_chat_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
