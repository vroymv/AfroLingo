-- CreateEnum
CREATE TYPE "ThemePreference" AS ENUM ('SYSTEM', 'LIGHT', 'DARK');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hapticsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "offlineDownloadsEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "soundEffectsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "themePreference" "ThemePreference" NOT NULL DEFAULT 'DARK';
