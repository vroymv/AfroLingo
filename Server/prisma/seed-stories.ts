import type { PrismaClient } from "@prisma/client";
import { StoryCategory, StoryDifficulty, StoryType } from "@prisma/client";

import {
  STORIES,
  type SeedStory,
  type SeedStoryCategory,
  type SeedStoryDifficulty,
  type SeedStoryType,
} from "./seed-data/stories";

function toDifficulty(difficulty: SeedStoryDifficulty): StoryDifficulty {
  switch (difficulty) {
    case "Beginner":
      return StoryDifficulty.BEGINNER;
    case "Intermediate":
      return StoryDifficulty.INTERMEDIATE;
    case "Advanced":
      return StoryDifficulty.ADVANCED;
  }
}

function toType(type: SeedStoryType): StoryType {
  switch (type) {
    case "dialogue":
      return StoryType.DIALOGUE;
    case "narrative":
      return StoryType.NARRATIVE;
    case "cultural":
      return StoryType.CULTURAL;
  }
}

function toCategory(category: SeedStoryCategory): StoryCategory {
  switch (category) {
    case "greeting":
      return StoryCategory.GREETING;
    case "dialogue":
      return StoryCategory.DIALOGUE;
    case "culture":
      return StoryCategory.CULTURE;
    case "everyday":
      return StoryCategory.EVERYDAY;
  }
}

async function upsertStory(prisma: PrismaClient, story: SeedStory) {
  const storyRow = await prisma.story.upsert({
    where: { externalId: story.id },
    create: {
      externalId: story.id,
      title: story.title,
      description: story.description,
      cover: story.cover,
      difficulty: toDifficulty(story.difficulty),
      estimatedTime: story.estimatedTime,
      type: toType(story.type),
      category: toCategory(story.category),
      totalWords: story.totalWords,
      isActive: true,
    },
    update: {
      title: story.title,
      description: story.description,
      cover: story.cover,
      difficulty: toDifficulty(story.difficulty),
      estimatedTime: story.estimatedTime,
      type: toType(story.type),
      category: toCategory(story.category),
      totalWords: story.totalWords,
      isActive: true,
    },
  });

  for (let i = 0; i < story.segments.length; i++) {
    const seg = story.segments[i];
    await prisma.storySegment.upsert({
      where: {
        story_segments_storyId_externalId: {
          storyId: storyRow.id,
          externalId: seg.id,
        },
      },
      create: {
        storyId: storyRow.id,
        externalId: seg.id,
        sortOrder: i,
        speaker: seg.speaker ?? null,
        text: seg.text,
        translation: seg.translation,
        audioUrl: seg.audio ?? null,
        highlightedWords: seg.highlightedWords,
      },
      update: {
        sortOrder: i,
        speaker: seg.speaker ?? null,
        text: seg.text,
        translation: seg.translation,
        audioUrl: seg.audio ?? null,
        highlightedWords: seg.highlightedWords,
      },
    });
  }

  const questions = story.questions ?? [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    await prisma.storyQuestion.upsert({
      where: {
        story_questions_storyId_externalId: {
          storyId: storyRow.id,
          externalId: q.id,
        },
      },
      create: {
        storyId: storyRow.id,
        externalId: q.id,
        sortOrder: i,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
      update: {
        sortOrder: i,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
    });
  }
}

export async function seedStories(prisma: PrismaClient) {
  console.log("📖 Seeding Stories...");

  for (const story of STORIES) {
    await upsertStory(prisma, story);
  }

  console.log(`✅ Stories upserted (${STORIES.length})\n`);
}
