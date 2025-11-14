-- AlterTable
ALTER TABLE "activity_progress" ADD COLUMN     "answerHistory" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "hintsUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isSkipped" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lessonProgressId" TEXT,
ADD COLUMN     "mistakeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "perfectScore" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "xpEarned" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "attempts" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "lesson_progress" ADD COLUMN     "accuracyRate" DOUBLE PRECISION,
ADD COLUMN     "averageActivityTime" DOUBLE PRECISION,
ADD COLUMN     "currentActivityIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentSessionStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastActivityCompletedAt" TIMESTAMP(3),
ADD COLUMN     "totalCorrect" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalIncorrect" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalSessions" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "totalTimeSpent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "xpEarned" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "attempts" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "lesson_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonProgressId" TEXT NOT NULL,
    "sessionNumber" INTEGER NOT NULL,
    "startActivityIndex" INTEGER NOT NULL DEFAULT 0,
    "endActivityIndex" INTEGER,
    "activitiesCompleted" INTEGER NOT NULL DEFAULT 0,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "incorrectAnswers" INTEGER NOT NULL DEFAULT 0,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "wasCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "lesson_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_daily_activity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "lessonsCompleted" INTEGER NOT NULL DEFAULT 0,
    "activitiesCompleted" INTEGER NOT NULL DEFAULT 0,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "isStreakDay" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_daily_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_mistakes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "userAnswer" JSONB NOT NULL,
    "correctAnswer" JSONB NOT NULL,
    "mistakeType" TEXT,
    "wasReviewed" BOOLEAN NOT NULL DEFAULT false,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3),
    "isMastered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_mistakes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lesson_sessions_userId_idx" ON "lesson_sessions"("userId");

-- CreateIndex
CREATE INDEX "lesson_sessions_lessonProgressId_idx" ON "lesson_sessions"("lessonProgressId");

-- CreateIndex
CREATE INDEX "lesson_sessions_startedAt_idx" ON "lesson_sessions"("startedAt");

-- CreateIndex
CREATE INDEX "user_daily_activity_userId_idx" ON "user_daily_activity"("userId");

-- CreateIndex
CREATE INDEX "user_daily_activity_date_idx" ON "user_daily_activity"("date");

-- CreateIndex
CREATE INDEX "user_daily_activity_isStreakDay_idx" ON "user_daily_activity"("isStreakDay");

-- CreateIndex
CREATE UNIQUE INDEX "user_daily_activity_userId_date_key" ON "user_daily_activity"("userId", "date");

-- CreateIndex
CREATE INDEX "user_mistakes_userId_idx" ON "user_mistakes"("userId");

-- CreateIndex
CREATE INDEX "user_mistakes_activityId_idx" ON "user_mistakes"("activityId");

-- CreateIndex
CREATE INDEX "user_mistakes_lessonId_idx" ON "user_mistakes"("lessonId");

-- CreateIndex
CREATE INDEX "user_mistakes_wasReviewed_idx" ON "user_mistakes"("wasReviewed");

-- CreateIndex
CREATE INDEX "user_mistakes_isMastered_idx" ON "user_mistakes"("isMastered");

-- CreateIndex
CREATE INDEX "user_mistakes_createdAt_idx" ON "user_mistakes"("createdAt");

-- CreateIndex
CREATE INDEX "activity_progress_lessonProgressId_idx" ON "activity_progress"("lessonProgressId");

-- CreateIndex
CREATE INDEX "activity_progress_completedAt_idx" ON "activity_progress"("completedAt");

-- CreateIndex
CREATE INDEX "lesson_progress_isCompleted_idx" ON "lesson_progress"("isCompleted");

-- CreateIndex
CREATE INDEX "lesson_progress_lastAccessedAt_idx" ON "lesson_progress"("lastAccessedAt");

-- AddForeignKey
ALTER TABLE "lesson_sessions" ADD CONSTRAINT "lesson_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_sessions" ADD CONSTRAINT "lesson_sessions_lessonProgressId_fkey" FOREIGN KEY ("lessonProgressId") REFERENCES "lesson_progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_activity" ADD CONSTRAINT "user_daily_activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_mistakes" ADD CONSTRAINT "user_mistakes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_mistakes" ADD CONSTRAINT "user_mistakes_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_mistakes" ADD CONSTRAINT "user_mistakes_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
