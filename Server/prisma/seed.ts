import { PrismaClient } from "@prisma/client";

import { UNIT_2_NUMBERS_SW } from "./seed-data/unit-2";

const prisma = new PrismaClient();

const GRAMMAR_TIPS: Array<{
  language: string;
  sortOrder: number;
  text: string;
}> = [
  // Swahili (sw)
  {
    language: "sw",
    sortOrder: 1,
    text: "Swahili nouns belong to noun classes, and adjectives/verbs often agree with that class.",
  },
  {
    language: "sw",
    sortOrder: 2,
    text: "In Swahili, verb prefixes can encode subject + tense + object (e.g., ni-na-ku-... = I-present-you-...).",
  },
  {
    language: "sw",
    sortOrder: 3,
    text: "The connector 'na' is commonly used for 'and/with' (e.g., mimi na wewe = me and you).",
  },

  // Zulu (zu)
  {
    language: "zu",
    sortOrder: 1,
    text: "isiZulu has noun classes too—agreement shows up across the sentence (verbs, adjectives, and more).",
  },
  {
    language: "zu",
    sortOrder: 2,
    text: "Zulu uses click consonants; the letter 'c' is a dental click.",
  },
  {
    language: "zu",
    sortOrder: 3,
    text: "You’ll often see respectful forms in greetings and requests; context can change the words you choose.",
  },

  // Xhosa (xh)
  {
    language: "xh",
    sortOrder: 1,
    text: "isiXhosa uses three main click types: c, q, and x—each with a distinct sound.",
  },
  {
    language: "xh",
    sortOrder: 2,
    text: "The prefix 'uku-' commonly marks an infinitive verb form (the 'to ...' form).",
  },
  {
    language: "xh",
    sortOrder: 3,
    text: "Tone and stress matter—practice listening to native speakers to hear the differences.",
  },

  // Lingala (ln)
  {
    language: "ln",
    sortOrder: 1,
    text: "Lingala word order is often Subject–Verb–Object, which can feel familiar to English learners.",
  },
  {
    language: "ln",
    sortOrder: 2,
    text: "Pay attention to tone and rhythm—small changes can shift meaning.",
  },
  {
    language: "ln",
    sortOrder: 3,
    text: "Pronouns and forms can change with respect and familiarity—listen for context.",
  },

  // General fallback
  {
    language: "general",
    sortOrder: 1,
    text: "Consistency beats intensity: 10 minutes daily is better than one long session weekly.",
  },
  {
    language: "general",
    sortOrder: 2,
    text: "Learn phrases, not just single words—your brain remembers patterns.",
  },
  {
    language: "general",
    sortOrder: 3,
    text: "Shadow native speakers: repeat immediately after audio to improve rhythm and pronunciation.",
  },
];

async function main() {
  console.log("🌱 Seeding (non-destructive)...\n");

  console.log("📚 Resolving User (optional)...");
  const userId = "tFgOgdOSSZaUkvPKlarhwx25rVZ2";
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    console.warn(
      `⚠️  User '${userId}' not found; skipping unit/progress seed but continuing with grammar tips.\n`
    );
  } else {
    console.log(`✅ Using existing user: ${user.email}`);

    console.log("📚 Seeding Unit 2: Numbers...");
    const unit = await prisma.unit.upsert({
      where: { externalId: UNIT_2_NUMBERS_SW.externalId },
      create: {
        externalId: UNIT_2_NUMBERS_SW.externalId,
        title: UNIT_2_NUMBERS_SW.title,
        level: UNIT_2_NUMBERS_SW.level,
        icon: UNIT_2_NUMBERS_SW.icon,
        color: UNIT_2_NUMBERS_SW.color,
        xpReward: UNIT_2_NUMBERS_SW.xpReward,
        order: UNIT_2_NUMBERS_SW.order,
        isActive: UNIT_2_NUMBERS_SW.isActive,
      },
      update: {
        title: UNIT_2_NUMBERS_SW.title,
        level: UNIT_2_NUMBERS_SW.level,
        icon: UNIT_2_NUMBERS_SW.icon,
        color: UNIT_2_NUMBERS_SW.color,
        xpReward: UNIT_2_NUMBERS_SW.xpReward,
        order: UNIT_2_NUMBERS_SW.order,
        isActive: UNIT_2_NUMBERS_SW.isActive,
      },
      include: {
        activities: true,
      },
    });

    for (const activity of UNIT_2_NUMBERS_SW.activities) {
      await prisma.activity.upsert({
        where: { externalId: activity.externalId },
        create: {
          externalId: activity.externalId,
          unitId: unit.id,
          type: activity.type,
          componentKey: activity.componentKey ?? "generic-activity",
          contentRef: activity.contentRef ?? activity.externalId,
          order: activity.order,
          isActive: true,
        },
        update: {
          unitId: unit.id,
          type: activity.type,
          componentKey: activity.componentKey ?? "generic-activity",
          contentRef: activity.contentRef ?? activity.externalId,
          order: activity.order,
          isActive: true,
        },
      });
    }

    const unitWithActivities = await prisma.unit.findUnique({
      where: { id: unit.id },
      include: { activities: true },
    });
    const activities = unitWithActivities?.activities ?? [];
    console.log("✅ Unit 2 created\n");

    console.log("📚 Seeding User Progress...");
    await prisma.userProgress.upsert({
      where: { userId_unitId: { userId: user.id, unitId: unit.id } },
      create: {
        userId: user.id,
        unitId: unit.id,
        progress: 0,
        completedActivities: 0,
        xpEarned: 0,
      },
      update: {},
    });
    console.log("✅ User Progress created\n");

    console.log("📚 Seeding Activity Progress...");
    const firstActivity = activities.sort((a, b) => a.order - b.order)[0];
    if (firstActivity) {
      await prisma.activityProgress.upsert({
        where: {
          userId_activityId: { userId: user.id, activityId: firstActivity.id },
        },
        create: {
          userId: user.id,
          activityId: firstActivity.id,
          isCompleted: false,
          xpEarned: 0,
        },
        update: {},
      });
    }
    console.log("✅ Activity Progress created\n");
  }

  console.log("📚 Seeding Grammar Tips...");
  for (const tip of GRAMMAR_TIPS) {
    await prisma.grammarTip.upsert({
      where: {
        language_sortOrder: {
          language: tip.language,
          sortOrder: tip.sortOrder,
        },
      },
      create: {
        language: tip.language,
        sortOrder: tip.sortOrder,
        text: tip.text,
        isActive: true,
      },
      update: {
        text: tip.text,
        isActive: true,
      },
    });
  }
  console.log("✅ Grammar Tips upserted\n");

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(" Error during seeding:", e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
