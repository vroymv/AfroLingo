/// <reference types="node" />

import { PrismaClient } from "@prisma/client";

import { UNIT_5_OCCUPATIONS_AND_PLACES_SW } from "./seed-data/unit-5-occupations-and-places";

const prisma = new PrismaClient();

async function seedUnit5OccupationsAndPlaces() {
  console.log("🌱 Seeding Unit 5 (Occupations and Places) only...\n");

  const unit = await prisma.unit.upsert({
    where: { externalId: UNIT_5_OCCUPATIONS_AND_PLACES_SW.externalId },
    create: {
      externalId: UNIT_5_OCCUPATIONS_AND_PLACES_SW.externalId,
      title: UNIT_5_OCCUPATIONS_AND_PLACES_SW.title,
      level: UNIT_5_OCCUPATIONS_AND_PLACES_SW.level,
      icon: UNIT_5_OCCUPATIONS_AND_PLACES_SW.icon,
      color: UNIT_5_OCCUPATIONS_AND_PLACES_SW.color,
      xpReward: UNIT_5_OCCUPATIONS_AND_PLACES_SW.xpReward,
      order: UNIT_5_OCCUPATIONS_AND_PLACES_SW.order,
      isActive: UNIT_5_OCCUPATIONS_AND_PLACES_SW.isActive,
    },
    update: {
      title: UNIT_5_OCCUPATIONS_AND_PLACES_SW.title,
      level: UNIT_5_OCCUPATIONS_AND_PLACES_SW.level,
      icon: UNIT_5_OCCUPATIONS_AND_PLACES_SW.icon,
      color: UNIT_5_OCCUPATIONS_AND_PLACES_SW.color,
      xpReward: UNIT_5_OCCUPATIONS_AND_PLACES_SW.xpReward,
      order: UNIT_5_OCCUPATIONS_AND_PLACES_SW.order,
      isActive: UNIT_5_OCCUPATIONS_AND_PLACES_SW.isActive,
    },
    select: { id: true, externalId: true },
  });

  for (const activity of UNIT_5_OCCUPATIONS_AND_PLACES_SW.activities) {
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
    `✅ Upserted ${UNIT_5_OCCUPATIONS_AND_PLACES_SW.externalId} + ${UNIT_5_OCCUPATIONS_AND_PLACES_SW.activities.length} activities`
  );
}

seedUnit5OccupationsAndPlaces()
  .catch((e) => {
    console.error("❌ Unit 5 seed failed", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
