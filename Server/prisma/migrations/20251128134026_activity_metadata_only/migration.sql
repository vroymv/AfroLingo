/*
  Warnings:

  - You are about to drop the column `alphabetImage` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `audio` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `conversation` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `correctAnswer` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `dialogue` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `explanation` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `items` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `pairs` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `activities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "activities" DROP COLUMN "alphabetImage",
DROP COLUMN "audio",
DROP COLUMN "conversation",
DROP COLUMN "correctAnswer",
DROP COLUMN "description",
DROP COLUMN "dialogue",
DROP COLUMN "explanation",
DROP COLUMN "items",
DROP COLUMN "options",
DROP COLUMN "pairs",
DROP COLUMN "question",
ADD COLUMN     "componentKey" TEXT NOT NULL DEFAULT 'generic-activity',
ADD COLUMN     "contentRef" TEXT;

-- CreateIndex
CREATE INDEX "activities_componentKey_idx" ON "activities"("componentKey");
