/// <reference types="node" />

import { PrismaClient } from "@prisma/client";

import { UNIT_4_GREETINGS_SW } from "./seed-data/unit-4-greetings";

const prisma = new PrismaClient();

async function seedUnit4Greetings() {
  console.log("🌱 Seeding Unit 4 (Greetings - Salamu) only...\n");

  const unit = await prisma.unit.upsert({
    where: { externalId: UNIT_4_GREETINGS_SW.externalId },
    create: {
      externalId: UNIT_4_GREETINGS_SW.externalId,
      title: UNIT_4_GREETINGS_SW.title,
      level: UNIT_4_GREETINGS_SW.level,
      icon: UNIT_4_GREETINGS_SW.icon,
      color: UNIT_4_GREETINGS_SW.color,
      xpReward: UNIT_4_GREETINGS_SW.xpReward,
      order: UNIT_4_GREETINGS_SW.order,
      isActive: UNIT_4_GREETINGS_SW.isActive,
    },
    update: {
      title: UNIT_4_GREETINGS_SW.title,
      level: UNIT_4_GREETINGS_SW.level,
      icon: UNIT_4_GREETINGS_SW.icon,
      color: UNIT_4_GREETINGS_SW.color,
      xpReward: UNIT_4_GREETINGS_SW.xpReward,
      order: UNIT_4_GREETINGS_SW.order,
      isActive: UNIT_4_GREETINGS_SW.isActive,
    },
    select: { id: true, externalId: true },
  });

  for (const activity of UNIT_4_GREETINGS_SW.activities) {
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
    `✅ Upserted ${UNIT_4_GREETINGS_SW.externalId} + ${UNIT_4_GREETINGS_SW.activities.length} activities`
  );
}

seedUnit4Greetings()
  .catch((e) => {
    console.error("❌ Unit 4 seed failed", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
