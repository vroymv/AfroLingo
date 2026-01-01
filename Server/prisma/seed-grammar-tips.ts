import { PrismaClient } from "@prisma/client";

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
  console.log("🌱 Seeding Grammar Tips (non-destructive)...\n");

  let upserted = 0;
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
    upserted += 1;
  }

  console.log(`✅ Grammar tips upserted: ${upserted}`);
}

main()
  .catch((e) => {
    console.error("Error seeding grammar tips:", e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
