/// <reference types="node" />

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_AUDIO_URL =
  "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2FKaraoke-type-test-audio.mp3?alt=media&token=86fa9267-b71a-415c-b02a-24c08f62f619";

const karaokeDemoTranscript = {
  lines: [
    {
      words: [
        { text: "A", startMs: 0, endMs: 400 },
        { text: "B", startMs: 400, endMs: 800 },
        { text: "C", startMs: 800, endMs: 1200 },
        { text: "D", startMs: 1200, endMs: 1600 },
        { text: "E", startMs: 1600, endMs: 2000 },
      ],
    },
    {
      words: [
        { text: "F", startMs: 2000, endMs: 2400 },
        { text: "G", startMs: 2400, endMs: 2800 },
        { text: "H", startMs: 2800, endMs: 3200 },
        { text: "I", startMs: 3200, endMs: 3600 },
        { text: "J", startMs: 3600, endMs: 4000 },
      ],
    },
    {
      words: [
        { text: "(Update", startMs: 4000, endMs: 5200 },
        { text: "these", startMs: 5200, endMs: 6200 },
        { text: "words", startMs: 6200, endMs: 7400 },
        { text: "later)", startMs: 7400, endMs: 9000 },
      ],
    },
  ],
};

function inferDurationMs(transcript: any): number | null {
  const lines = Array.isArray(transcript?.lines) ? transcript.lines : [];
  let maxEnd = -1;
  for (const line of lines) {
    const words = Array.isArray(line?.words) ? line.words : [];
    for (const word of words) {
      const endMs = typeof word?.endMs === "number" ? word.endMs : -1;
      if (endMs > maxEnd) maxEnd = endMs;
    }
  }

  return maxEnd >= 0 ? maxEnd : null;
}

async function main() {
  console.log("🌱 Seeding Karaoke exercises (non-destructive)...\n");

  const externalId = "karaoke-demo-1";
  const durationMs = inferDurationMs(karaokeDemoTranscript);

  await prisma.karaokeExercise.upsert({
    where: { externalId },
    create: {
      externalId,
      title: "Karaoke Demo (Placeholder)",
      subtitle: "Replace timestamps + audio later",
      language: "sw",
      audioClipUrl: DEMO_AUDIO_URL,
      transcript: karaokeDemoTranscript,
      durationMs,
      isActive: true,
    },
    update: {
      title: "Karaoke Demo (Placeholder)",
      subtitle: "Replace timestamps + audio later",
      language: "sw",
      audioClipUrl: DEMO_AUDIO_URL,
      transcript: karaokeDemoTranscript,
      durationMs,
      isActive: true,
    },
  });

  console.log(`✅ Upserted KaraokeExercise: ${externalId}`);

  // Make sure karaoke shows up in the Practice tab.
  // Practice list is sourced from Activity rows where featuredForPractice=true.
  const existingUnit = await prisma.unit.findFirst({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: { id: true },
  });

  const unitId =
    existingUnit?.id ??
    (
      await prisma.unit.upsert({
        where: { externalId: "unit-practice" },
        create: {
          externalId: "unit-practice",
          title: "Practice",
          level: "practice",
          icon: "🎯",
          color: "#4A90E2",
          xpReward: 0,
          order: 999,
          isActive: true,
        },
        update: {
          title: "Practice",
          level: "practice",
          icon: "🎯",
          color: "#4A90E2",
          xpReward: 0,
          order: 999,
          isActive: true,
        },
        select: { id: true },
      })
    ).id;

  await prisma.activity.upsert({
    where: { externalId: "karaoke-lyrics" },
    create: {
      externalId: "karaoke-lyrics",
      unitId,
      type: "karaoke",
      componentKey: "practice/karaoke",
      contentRef: externalId,
      order: 0,
      isActive: true,
      featuredForPractice: true,
    },
    update: {
      unitId,
      type: "karaoke",
      componentKey: "practice/karaoke",
      contentRef: externalId,
      order: 0,
      isActive: true,
      featuredForPractice: true,
    },
  });

  console.log("✅ Upserted Practice Activity: karaoke-lyrics");
}

main()
  .catch((e) => {
    console.error("❌ Karaoke seed failed", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
