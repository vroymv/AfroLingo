-- CreateTable
CREATE TABLE "tutors" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "hourlyRate" INTEGER NOT NULL,
    "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bio" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "lessonsCompleted" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tutors_externalId_key" ON "tutors"("externalId");

-- CreateIndex
CREATE INDEX "tutors_language_idx" ON "tutors"("language");

-- CreateIndex
CREATE INDEX "tutors_isActive_idx" ON "tutors"("isActive");
