-- Add optional idempotency, timestamps, and metadata to user mistakes

-- AlterTable
ALTER TABLE "user_mistakes" ADD COLUMN "clientMistakeId" TEXT;
ALTER TABLE "user_mistakes" ADD COLUMN "occurredAt" TIMESTAMPTZ;
ALTER TABLE "user_mistakes" ADD COLUMN "metadata" JSONB;

-- CreateIndex
CREATE INDEX "user_mistakes_userId_createdAt_desc_idx" ON "user_mistakes"("userId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "user_mistakes_userId_clientMistakeId_key" ON "user_mistakes"("userId", "clientMistakeId");
