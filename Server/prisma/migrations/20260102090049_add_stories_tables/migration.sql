-- CreateEnum
CREATE TYPE "StoryDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "StoryType" AS ENUM ('DIALOGUE', 'NARRATIVE', 'CULTURAL');

-- CreateEnum
CREATE TYPE "StoryCategory" AS ENUM ('GREETING', 'DIALOGUE', 'CULTURE', 'EVERYDAY');

-- CreateTable
CREATE TABLE "stories" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "difficulty" "StoryDifficulty" NOT NULL,
    "estimatedTime" TEXT NOT NULL,
    "type" "StoryType" NOT NULL,
    "category" "StoryCategory" NOT NULL,
    "totalWords" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_segments" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "speaker" TEXT,
    "text" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "audioUrl" TEXT,
    "highlightedWords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "story_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_questions" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "correctAnswer" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "story_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_story_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "completedWords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_story_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stories_externalId_key" ON "stories"("externalId");

-- CreateIndex
CREATE INDEX "stories_category_idx" ON "stories"("category");

-- CreateIndex
CREATE INDEX "stories_difficulty_idx" ON "stories"("difficulty");

-- CreateIndex
CREATE INDEX "stories_type_idx" ON "stories"("type");

-- CreateIndex
CREATE INDEX "story_segments_storyId_idx" ON "story_segments"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "story_segments_storyId_externalId_key" ON "story_segments"("storyId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "story_segments_storyId_sortOrder_key" ON "story_segments"("storyId", "sortOrder");

-- CreateIndex
CREATE INDEX "story_questions_storyId_idx" ON "story_questions"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "story_questions_storyId_externalId_key" ON "story_questions"("storyId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "story_questions_storyId_sortOrder_key" ON "story_questions"("storyId", "sortOrder");

-- CreateIndex
CREATE INDEX "user_story_progress_userId_idx" ON "user_story_progress"("userId");

-- CreateIndex
CREATE INDEX "user_story_progress_storyId_idx" ON "user_story_progress"("storyId");

-- CreateIndex
CREATE INDEX "user_story_progress_isCompleted_idx" ON "user_story_progress"("isCompleted");

-- CreateIndex
CREATE UNIQUE INDEX "user_story_progress_userId_storyId_key" ON "user_story_progress"("userId", "storyId");

-- AddForeignKey
ALTER TABLE "story_segments" ADD CONSTRAINT "story_segments_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_questions" ADD CONSTRAINT "story_questions_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_story_progress" ADD CONSTRAINT "user_story_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_story_progress" ADD CONSTRAINT "user_story_progress_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
