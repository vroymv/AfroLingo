/// <reference types="node" />

import { PrismaClient } from "@prisma/client";

import { UNIT_3_TIME_SW } from "./seed-data/unit-3-time";

const prisma = new PrismaClient();

async function seedUnit3Time() {
  console.log("🌱 Seeding Unit 3 (Days, Months, and Seasons) only...\n");

  const unit = await prisma.unit.upsert({
    where: { externalId: UNIT_3_TIME_SW.externalId },
    create: {
      externalId: UNIT_3_TIME_SW.externalId,
      title: UNIT_3_TIME_SW.title,
      level: UNIT_3_TIME_SW.level,
      icon: UNIT_3_TIME_SW.icon,
      color: UNIT_3_TIME_SW.color,
      xpReward: UNIT_3_TIME_SW.xpReward,
      order: UNIT_3_TIME_SW.order,
      isActive: UNIT_3_TIME_SW.isActive,
    },
    update: {
      title: UNIT_3_TIME_SW.title,
      level: UNIT_3_TIME_SW.level,
      icon: UNIT_3_TIME_SW.icon,
      color: UNIT_3_TIME_SW.color,
      xpReward: UNIT_3_TIME_SW.xpReward,
      order: UNIT_3_TIME_SW.order,
      isActive: UNIT_3_TIME_SW.isActive,
    },
    select: { id: true, externalId: true },
  });

  for (const activity of UNIT_3_TIME_SW.activities) {
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
    `✅ Upserted ${UNIT_3_TIME_SW.externalId} + ${UNIT_3_TIME_SW.activities.length} activities`
  );
}

seedUnit3Time()
  .catch((e) => {
    console.error("❌ Unit 3 seed failed", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
