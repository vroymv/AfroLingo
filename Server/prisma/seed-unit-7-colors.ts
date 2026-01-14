/// <reference types="node" />

import { PrismaClient } from "@prisma/client";

import { UNIT_7_COLORS_SW } from "./seed-data/unit-7-colors";

const prisma = new PrismaClient();

async function seedUnit7Colors() {
  console.log("🌱 Seeding Unit 7 (Colors - Rangi) only...\n");

  const unit = await prisma.unit.upsert({
    where: { externalId: UNIT_7_COLORS_SW.externalId },
    create: {
      externalId: UNIT_7_COLORS_SW.externalId,
      title: UNIT_7_COLORS_SW.title,
      level: UNIT_7_COLORS_SW.level,
      icon: UNIT_7_COLORS_SW.icon,
      color: UNIT_7_COLORS_SW.color,
      xpReward: UNIT_7_COLORS_SW.xpReward,
      order: UNIT_7_COLORS_SW.order,
      isActive: UNIT_7_COLORS_SW.isActive,
    },
    update: {
      title: UNIT_7_COLORS_SW.title,
      level: UNIT_7_COLORS_SW.level,
      icon: UNIT_7_COLORS_SW.icon,
      color: UNIT_7_COLORS_SW.color,
      xpReward: UNIT_7_COLORS_SW.xpReward,
      order: UNIT_7_COLORS_SW.order,
      isActive: UNIT_7_COLORS_SW.isActive,
    },
    select: { id: true, externalId: true },
  });

  for (const activity of UNIT_7_COLORS_SW.activities) {
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
    `✅ Upserted ${UNIT_7_COLORS_SW.externalId} + ${UNIT_7_COLORS_SW.activities.length} activities`
  );
}

seedUnit7Colors()
  .catch((e) => {
    console.error("❌ Unit 7 seed failed", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
