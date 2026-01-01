/*
  Warnings:

  - You are about to drop the column `timeSpent` on the `user_daily_activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_daily_activity" DROP COLUMN "timeSpent",
ADD COLUMN     "appClosesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "appOpensCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "firstAppOpenedAt" TIMESTAMP(3),
ADD COLUMN     "lastAppClosedAt" TIMESTAMP(3),
ADD COLUMN     "lastAppOpenedAt" TIMESTAMP(3);
