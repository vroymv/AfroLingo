import type { PrismaClient } from "@prisma/client";

const DEFAULT_SEED_USER_ID = "seed-user";

type SeedGroup = {
  externalId: string;
  name: string;
  description: string;
  language?: string;
  tags?: string[];
};

const SEED_GROUPS: SeedGroup[] = [
  {
    externalId: "group-sw-beginners",
    name: "Swahili Beginners Club",
    description:
      "Friendly space for absolute beginners to practice daily phrases.",
    language: "sw",
    tags: ["beginner", "daily-practice"],
  },
  {
    externalId: "group-sw-conversation",
    name: "Swahili Conversation Circle",
    description: "Short prompts and weekly conversation challenges.",
    language: "sw",
    tags: ["conversation"],
  },
  {
    externalId: "group-zu-beginners",
    name: "Zulu Starters",
    description: "Learn greetings, basics, and build confidence together.",
    language: "zu",
    tags: ["beginner"],
  },
  {
    externalId: "group-xh-pronunciation",
    name: "Xhosa Pronunciation Lab",
    description: "Practice clicks and pronunciation with bite-sized drills.",
    language: "xh",
    tags: ["pronunciation"],
  },
  {
    externalId: "group-ln-phrases",
    name: "Lingala Phrases",
    description: "Common phrases for everyday conversations.",
    language: "ln",
    tags: ["phrases"],
  },
  {
    externalId: "group-general-study",
    name: "AfroLingo Study Buddies",
    description: "A general community group for study sessions and motivation.",
    tags: ["study", "motivation"],
  },
];

export async function seedGroups(
  prisma: PrismaClient,
  options?: {
    seedUserId?: string;
  }
) {
  const seedUserId = options?.seedUserId ?? DEFAULT_SEED_USER_ID;

  console.log("👥 Seeding Groups...");

  // Ensure a stable seed user exists so groups can be created deterministically.
  const seedUser = await prisma.user.upsert({
    where: { id: seedUserId },
    create: {
      id: seedUserId,
      email: "seed@afrolingo.local",
      name: "AfroLingo Seed",
    },
    update: {
      name: "AfroLingo Seed",
    },
    select: { id: true },
  });

  for (const group of SEED_GROUPS) {
    const created = await prisma.group.upsert({
      where: { externalId: group.externalId },
      create: {
        externalId: group.externalId,
        name: group.name,
        description: group.description,
        language: group.language,
        tags: group.tags ?? [],
        createdByUserId: seedUser.id,
        isActive: true,
      },
      update: {
        name: group.name,
        description: group.description,
        language: group.language,
        tags: group.tags ?? [],
        isActive: true,
      },
      select: { id: true },
    });

    // Ensure a default channel exists.
    let defaultChannel = await prisma.groupChannel.findFirst({
      where: {
        groupId: created.id,
        isDefault: true,
      },
      select: { id: true },
    });

    if (!defaultChannel) {
      defaultChannel = await prisma.groupChannel.create({
        data: {
          groupId: created.id,
          name: "General",
          isDefault: true,
        },
        select: { id: true },
      });
    }

    // Add the seed user as a member for easier testing.
    await prisma.groupMembership.upsert({
      where: {
        groupId_userId: {
          groupId: created.id,
          userId: seedUser.id,
        },
      },
      create: {
        groupId: created.id,
        userId: seedUser.id,
        role: "OWNER",
        lastReadAt: new Date(),
      },
      update: {
        role: "OWNER",
      },
    });

    // Seed a couple of messages (idempotent via (senderId, clientMessageId)).
    const seedMessages = [
      `Welcome to ${group.name}!`,
      "Introduce yourself and share your learning goal for the week.",
      "Tip: keep messages short and practice daily.",
    ];

    for (let index = 0; index < seedMessages.length; index += 1) {
      const clientMessageId = `${group.externalId}-seed-${index + 1}`;

      await prisma.groupMessage
        .upsert({
          where: {
            senderId_clientMessageId: {
              senderId: seedUser.id,
              clientMessageId,
            },
          },
          create: {
            groupId: created.id,
            channelId: defaultChannel.id,
            senderId: seedUser.id,
            body: seedMessages[index] ?? "",
            clientMessageId,
          },
          update: {
            // keep content stable
            body: seedMessages[index] ?? "",
          },
        })
        .catch((e) => {
          // In case the unique selector name differs between Prisma versions, fail loudly.
          throw e;
        });
    }
  }

  console.log(`✅ Groups seeded: ${SEED_GROUPS.length}`);
}
