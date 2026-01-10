import {
  PrismaClient,
  type PrismaClient as PrismaClientType,
} from "@prisma/client";

import { TUTORS } from "./seed-data/tutors";

export async function seedTutors(prisma: PrismaClient) {
  console.log("👨‍🏫 Seeding Tutors...");

  const emailForExternalTutorId = (externalId: string) =>
    `tutor-${externalId}@seed.afrolingo.local`;

  for (const tutor of TUTORS) {
    const user = await prisma.user.upsert({
      where: { email: emailForExternalTutorId(tutor.id) },
      create: {
        email: emailForExternalTutorId(tutor.id),
        name: tutor.name,
        userType: "TUTOR",
        languages: [tutor.language],
        bio: tutor.bio,
        profileImageUrl: tutor.avatar,
      },
      update: {
        name: tutor.name,
        userType: "TUTOR",
        languages: [tutor.language],
        bio: tutor.bio,
        profileImageUrl: tutor.avatar,
      },
      select: { id: true },
    });

    await prisma.tutor.upsert({
      where: { externalId: tutor.id },
      create: {
        externalId: tutor.id,
        userId: user.id,
        name: tutor.name,
        language: tutor.language,
        rating: tutor.rating,
        reviewCount: tutor.reviewCount,
        hourlyRate: tutor.hourlyRate,
        specialties: tutor.specialties,
        bio: tutor.bio,
        avatar: tutor.avatar,
        availability: tutor.availability,
        lessonsCompleted: tutor.lessonsCompleted,
        isActive: true,
      },
      update: {
        userId: user.id,
        name: tutor.name,
        language: tutor.language,
        rating: tutor.rating,
        reviewCount: tutor.reviewCount,
        hourlyRate: tutor.hourlyRate,
        specialties: tutor.specialties,
        bio: tutor.bio,
        avatar: tutor.avatar,
        availability: tutor.availability,
        lessonsCompleted: tutor.lessonsCompleted,
        isActive: true,
      },
    });
  }

  console.log(`✅ Tutors upserted (${TUTORS.length})\n`);
}

async function main() {
  const prisma = new PrismaClient();
  try {
    await seedTutors(prisma as unknown as PrismaClientType);
  } finally {
    await prisma.$disconnect();
  }
}

// Allow running this file directly: `npm run db:seed:tutors`
if (require.main === module) {
  main().catch((e) => {
    console.error("Error during tutor seeding:", e);
    process.exitCode = 1;
  });
}
