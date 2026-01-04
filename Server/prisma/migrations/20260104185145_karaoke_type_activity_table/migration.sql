-- CreateTable
CREATE TABLE "karaoke_exercises" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "language" TEXT,
    "audioClipUrl" TEXT NOT NULL,
    "transcript" JSONB,
    "durationMs" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "karaoke_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "karaoke_exercises_externalId_key" ON "karaoke_exercises"("externalId");

-- CreateIndex
CREATE INDEX "karaoke_exercises_language_idx" ON "karaoke_exercises"("language");

-- CreateIndex
CREATE INDEX "karaoke_exercises_isActive_idx" ON "karaoke_exercises"("isActive");
