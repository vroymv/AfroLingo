import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ASSETS = {
  images: {
    alphabet:
      "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/alphabet%2FSwahili-alphabet.png?alt=media&token=b875c95d-9a67-48de-ac06-19f428118183",
  },
  audio:
    "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
};

async function main() {
  console.log("🧹 Cleaning up existing data...");
  await prisma.userMistake.deleteMany();
  await prisma.userDailyActivity.deleteMany();
  await prisma.activityProgress.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleanup complete\n");

  console.log("📚 Seeding Users...");
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      selectedLanguage: "sw",
      selectedLevel: "absolute-beginner",
      placementTestScore: 85,
      learningReasons: ["culture", "travel"],
      timeCommitment: "15min",
      onboardingCompleted: true,
      onboardingCompletedAt: new Date(),
    },
  });
  console.log("✅ User created\n");

  console.log("📚 Seeding Unit 1: Alphabet...");
  const unit = await prisma.unit.create({
    data: {
      externalId: "unit-1",
      title: "Beginning - The Alphabet",
      level: "absolute-beginner",
      icon: "🔤",
      color: "#4CAF50",
      xpReward: 50,
      order: 1,
      isActive: true,
      activities: {
        create: [
          {
            externalId: "activity-alphabet-1",
            type: "introduction",
            question:
              "Welcome! Let's start your journey by learning the Swahili alphabet.",
            order: 1,
          },
          {
            externalId: "activity-alphabet-2",
            type: "alphabet",
            question: "The Swahili Alphabet",
            alphabetImage: ASSETS.images.alphabet,
            order: 2,
          },
          {
            externalId: "activity-alphabet-3",
            type: "listening-dictation",
            question: "Listening Exercise: Write What You Hear",
            audio: ASSETS.audio,
            order: 3,
          },
        ],
      },
    },
    include: {
      activities: true,
    },
  });
  console.log("✅ Unit 1 created\n");

  console.log("📚 Seeding User Progress...");
  await prisma.userProgress.create({
    data: {
      userId: user.id,
      unitId: unit.id,
      progress: 50,
      completedActivities: 2,
      xpEarned: 25,
    },
  });
  console.log("✅ User Progress created\n");

  console.log("📚 Seeding Activity Progress...");
  await prisma.activityProgress.create({
    data: {
      userId: user.id,
      activityId: unit.activities[0].id, // Accessing activities directly from the included data
      isCompleted: true,
      isCorrect: true,
      xpEarned: 10,
    },
  });
  console.log("Activity Progress created\n");

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(" Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
