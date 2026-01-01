export type SeedLessonUnit = {
  externalId: string;
  title: string;
  level: string;
  icon: string;
  color: string;
  xpReward: number;
  order: number;
  isActive: boolean;
  activities: Array<{
    externalId: string;
    type: string;
    question: string;
    order: number;
    componentKey?: string;
    contentRef?: string;
  }>;
};

export const UNIT_2_NUMBERS_SW: SeedLessonUnit = {
  externalId: "unit-2",
  title: "Numbers - Counting in Swahili",
  level: "absolute-beginner",
  icon: "🔢",
  color: "#2196F3",
  xpReward: 50,
  order: 1,
  isActive: true,
  activities: [
    {
      externalId: "activity-counting-1",
      type: "introduction",
      question:
        "Let's learn to count in Swahili! Numbers are essential for everyday conversations.",
      order: 1,
      componentKey: "introduction",
      contentRef: "activity-counting-1",
    },
    {
      externalId: "activity-counting-2",
      type: "numbers-table",
      question: "Numbers in Swahili",
      order: 2,
      componentKey: "numbers-table",
      contentRef: "activity-counting-2",
    },
    {
      externalId: "activity-counting-3",
      type: "multiple-choice",
      question: "What is 'tano' in English?",
      order: 3,
      componentKey: "multiple-choice",
      contentRef: "activity-counting-3",
    },
    {
      externalId: "activity-counting-4",
      type: "multiple-choice",
      question: "How do you say '15' in Swahili?",
      order: 4,
      componentKey: "multiple-choice",
      contentRef: "activity-counting-4",
    },
    {
      externalId: "activity-counting-5",
      type: "multiple-choice",
      question: "What is 'hamsini'?",
      order: 5,
      componentKey: "multiple-choice",
      contentRef: "activity-counting-5",
    },
    {
      externalId: "activity-counting-6",
      type: "numbers-listening",
      question: "Numbers Listening Exercise",
      order: 6,
      componentKey: "numbers-listening",
      contentRef: "activity-counting-6",
    },
    {
      externalId: "activity-counting-7",
      type: "numbers-translation",
      question: "Translate Numbers to Figures",
      order: 7,
      componentKey: "numbers-translation",
      contentRef: "activity-counting-7",
    },
  ],
};
