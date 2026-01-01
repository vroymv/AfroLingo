-- CreateTable
CREATE TABLE "grammar_tips" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grammar_tips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "grammar_tips_language_idx" ON "grammar_tips"("language");

-- CreateIndex
CREATE INDEX "grammar_tips_isActive_idx" ON "grammar_tips"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "grammar_tips_language_sortOrder_key" ON "grammar_tips"("language", "sortOrder");
