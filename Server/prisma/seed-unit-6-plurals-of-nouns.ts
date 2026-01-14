/// <reference types="node" />

import { PrismaClient } from "@prisma/client";

import { UNIT_6_PLURALS_OF_NOUNS_SW } from "./seed-data/unit-6-plurals-of-nouns";

const prisma = new PrismaClient();

async function seedUnit6PluralsOfNouns() {
  console.log("🌱 Seeding Unit 6 (Plurals of Nouns) only...\n");

  const unit = await prisma.unit.upsert({
    where: { externalId: UNIT_6_PLURALS_OF_NOUNS_SW.externalId },
    create: {
      externalId: UNIT_6_PLURALS_OF_NOUNS_SW.externalId,
      title: UNIT_6_PLURALS_OF_NOUNS_SW.title,
      level: UNIT_6_PLURALS_OF_NOUNS_SW.level,
      icon: UNIT_6_PLURALS_OF_NOUNS_SW.icon,
      color: UNIT_6_PLURALS_OF_NOUNS_SW.color,
      xpReward: UNIT_6_PLURALS_OF_NOUNS_SW.xpReward,
      order: UNIT_6_PLURALS_OF_NOUNS_SW.order,
      isActive: UNIT_6_PLURALS_OF_NOUNS_SW.isActive,
    },
    update: {
      title: UNIT_6_PLURALS_OF_NOUNS_SW.title,
      level: UNIT_6_PLURALS_OF_NOUNS_SW.level,
      icon: UNIT_6_PLURALS_OF_NOUNS_SW.icon,
      color: UNIT_6_PLURALS_OF_NOUNS_SW.color,
      xpReward: UNIT_6_PLURALS_OF_NOUNS_SW.xpReward,
      order: UNIT_6_PLURALS_OF_NOUNS_SW.order,
      isActive: UNIT_6_PLURALS_OF_NOUNS_SW.isActive,
    },
    select: { id: true, externalId: true },
  });

  for (const activity of UNIT_6_PLURALS_OF_NOUNS_SW.activities) {
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

  console.log(
    `✅ Upserted ${UNIT_6_PLURALS_OF_NOUNS_SW.externalId} + ${UNIT_6_PLURALS_OF_NOUNS_SW.activities.length} activities`
  );
}

seedUnit6PluralsOfNouns()
  .catch((e) => {
    console.error("❌ Unit 6 seed failed", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
