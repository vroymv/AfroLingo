import { PrismaClient } from "@prisma/client";

import { UNIT_2_NUMBERS_SW } from "./seed-data/unit-2";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding (non-destructive)...\n");

  console.log("📚 Resolving User...");
  const userId = "tFgOgdOSSZaUkvPKlarhwx25rVZ2";
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error(
      `Seed aborted: expected existing user id '${userId}' (Roy) not found.`
    );
  }
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
