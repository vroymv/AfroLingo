-- AlterTable
ALTER TABLE "users" ADD COLUMN     "learningReasons" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "placementTestScore" INTEGER,
ADD COLUMN     "selectedLanguage" TEXT,
ADD COLUMN     "selectedLevel" TEXT,
ADD COLUMN     "timeCommitment" TEXT;
