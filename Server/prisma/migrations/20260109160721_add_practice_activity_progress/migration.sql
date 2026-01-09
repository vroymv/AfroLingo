-- CreateTable
CREATE TABLE "practice_activity_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isCorrect" BOOLEAN,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "bestScore" INTEGER,
    "lastScore" INTEGER,
    "totalTimeSpentSec" INTEGER NOT NULL DEFAULT 0,
    "lastAnswer" JSONB,
    "metadata" JSONB,
    "startedAt" TIMESTAMP(3),
    "lastAttemptAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_activity_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "practice_activity_progress_userId_idx" ON "practice_activity_progress"("userId");

-- CreateIndex
CREATE INDEX "practice_activity_progress_activityId_idx" ON "practice_activity_progress"("activityId");

-- CreateIndex
CREATE INDEX "practice_activity_progress_isCompleted_idx" ON "practice_activity_progress"("isCompleted");

-- CreateIndex
CREATE INDEX "practice_activity_progress_completedAt_idx" ON "practice_activity_progress"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "practice_activity_progress_userId_activityId_key" ON "practice_activity_progress"("userId", "activityId");

-- AddForeignKey
ALTER TABLE "practice_activity_progress" ADD CONSTRAINT "practice_activity_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_activity_progress" ADD CONSTRAINT "practice_activity_progress_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
