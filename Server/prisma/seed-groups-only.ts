import { PrismaClient } from "@prisma/client";

import { seedGroups } from "./seed-groups";

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log("🌱 Seeding Groups (only)...\n");
    await seedGroups(prisma);
    console.log("\n✅ Groups-only seeding completed successfully!");
  } catch (e) {
    console.error("\n❌ Error during groups-only seeding:", e);
    throw e;
  } finally {
    await prisma.$disconnect();
  }
}

main();
