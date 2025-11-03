export interface StorySegment {
  id: string;
  text: string;
  translation: string;
  audio?: string;
  highlightedWords: string[];
}

export interface Story {
  id: string;
  title: string;
  description: string;
  cover: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  segments: StorySegment[];
  completedWords: string[];
  totalWords: number;
}

export const mockStoriesData: Story[] = [
  {
    id: "story-1",
    title: "Meeting a Friend",
    description: "A simple conversation between two friends meeting",
    cover: "🤝",
    difficulty: "Beginner",
    estimatedTime: "3 min",
    totalWords: 15,
    completedWords: ["molo", "unjani"],
    segments: [
      {
        id: "seg-1",
        text: "Molo Sipho, unjani?",
        translation: "Hello Sipho, how are you?",
        highlightedWords: ["molo", "unjani"],
      },
      {
        id: "seg-2",
        text: "Ndiphilile, enkosi. Wena unjani?",
        translation: "I am well, thank you. How are you?",
        highlightedWords: [],
      },
      {
        id: "seg-3",
        text: "Nam ndiphilile. Kumnandi ukubona.",
        translation: "I am also well. Nice to see you.",
        highlightedWords: [],
      },
    ],
  },
  {
    id: "story-2",
    title: "At the Market",
    description: "Shopping for fruits at a local market",
    cover: "🍎",
    difficulty: "Intermediate",
    estimatedTime: "5 min",
    totalWords: 25,
    completedWords: [],
    segments: [
      {
        id: "seg-4",
        text: "Mingaki amaapile?",
        translation: "How much are the apples?",
        highlightedWords: [],
      },
      {
        id: "seg-5",
        text: "Zimalini ezintlanu.",
        translation: "Five rands for five.",
        highlightedWords: [],
      },
    ],
  },
  {
    id: "story-3",
    title: "Traditional Celebration",
    description: "Experience a traditional African celebration",
    cover: "🎉",
    difficulty: "Advanced",
    estimatedTime: "8 min",
    totalWords: 40,
    completedWords: [],
    segments: [
      {
        id: "seg-6",
        text: "Namhlanje siyathokoza!",
        translation: "Today we are celebrating!",
        highlightedWords: [],
      },
      {
        id: "seg-7",
        text: "Yonke indlu iyavuya.",
        translation: "The whole family is happy.",
        highlightedWords: [],
      },
    ],
  },
];
