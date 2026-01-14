import type { SeedLessonUnit } from "./unit-2";

export const UNIT_6_PLURALS_OF_NOUNS_SW: SeedLessonUnit = {
  externalId: "unit-6",
  title: "Plurals of Nouns - Wingi wa Nomino",
  level: "beginner",
  icon: "🔄",
  color: "#FF9800",
  xpReward: 120,
  order: 5,
  isActive: true,
  activities: [
    {
      externalId: "activity-plurals-1",
      type: "introduction",
      question:
        "Let's master the plural forms of Swahili nouns! Swahili uses noun classes to form plurals, making it systematic and logical.",
      order: 1,
      componentKey: "unit6-introduction",
      contentRef: "activity-plurals-1",
    },
    {
      externalId: "activity-plurals-2",
      type: "introduction",
      question: `How Swahili Plurals Work: The Noun Class System

📋 THE PATTERN:
Swahili nouns belong to different 'classes' based on their prefixes (letters at the start). Each class has its own formula for forming plurals:

1️⃣ M-WA CLASS (People)
Formula: M- → WA-
Example: Mtu → Watu (person → people)
Rule: Remove M-, add WA-

2️⃣ M-MI CLASS (Plants & Objects)
Formula: M- → MI-
Example: Mti → Miti (tree → trees)
Rule: Remove M-, add MI-

3️⃣ KI-VI CLASS (Small Things)
Formula: KI- → VI-
Example: Kiti → Viti (chair → chairs)
Rule: Remove KI-, add VI-

4️⃣ N-N CLASS (No Change)
Formula: SAME FORM
Example: Nyumba → Nyumba (house → houses)
Rule: Singular and plural look identical!

💡 THE KEY:
• Look at the PREFIX (start of the word)
• Identify which CLASS it belongs to
• Apply the CLASS FORMULA
• The rest of the word stays the same!

✨ Example:
Mtoto (child) → M- prefix → M-WA class → Remove M-, add WA- → Watoto (children)

Now let's practice with real examples!`,
      order: 2,
      componentKey: "unit6-introduction",
      contentRef: "activity-plurals-2",
    },
    {
      externalId: "activity-plurals-3",
      type: "vocabulary-table",
      question: "M-WA Class (People)",
      order: 3,
      componentKey: "unit6-vocabulary-table",
      contentRef: "activity-plurals-3",
    },
    {
      externalId: "activity-plurals-4",
      type: "vocabulary-table",
      question: "M-MI Class (Plants & Objects)",
      order: 4,
      componentKey: "unit6-vocabulary-table",
      contentRef: "activity-plurals-4",
    },
    {
      externalId: "activity-plurals-5",
      type: "vocabulary-table",
      question: "KI-VI Class (Small Things & Objects)",
      order: 5,
      componentKey: "unit6-vocabulary-table",
      contentRef: "activity-plurals-5",
    },
    {
      externalId: "activity-plurals-6",
      type: "vocabulary-table",
      question: "N-N Class (Animals & Things)",
      order: 6,
      componentKey: "unit6-vocabulary-table",
      contentRef: "activity-plurals-6",
    },
    {
      externalId: "activity-plurals-7",
      type: "multiple-choice",
      question: "What is the plural of 'mtu' (person)?",
      order: 7,
      componentKey: "unit6-multiple-choice",
      contentRef: "activity-plurals-7",
    },
    {
      externalId: "activity-plurals-8",
      type: "multiple-choice",
      question: "What is the plural of 'kiti' (chair)?",
      order: 8,
      componentKey: "unit6-multiple-choice",
      contentRef: "activity-plurals-8",
    },
    {
      externalId: "activity-plurals-9",
      type: "multiple-choice",
      question: "Which noun keeps the same form in plural?",
      order: 9,
      componentKey: "unit6-multiple-choice",
      contentRef: "activity-plurals-9",
    },
    {
      externalId: "activity-plurals-10",
      type: "multiple-choice",
      question: "What is the plural of 'mwalimu' (teacher)?",
      order: 10,
      componentKey: "unit6-multiple-choice",
      contentRef: "activity-plurals-10",
    },
    {
      externalId: "activity-plurals-11",
      type: "multiple-choice",
      question: "What is the plural of 'mlango' (door)?",
      order: 11,
      componentKey: "unit6-multiple-choice",
      contentRef: "activity-plurals-11",
    },
    {
      externalId: "activity-plurals-12",
      type: "matching",
      question: "Match Singular to Plural Forms",
      order: 12,
      componentKey: "unit6-matching",
      contentRef: "activity-plurals-12",
    },
    {
      externalId: "activity-plurals-13",
      type: "matching",
      question: "Match Nouns to Their Classes",
      order: 13,
      componentKey: "unit6-matching",
      contentRef: "activity-plurals-13",
    },
    {
      externalId: "activity-plurals-14",
      type: "spelling-completion",
      question: "Complete the Plural Forms",
      order: 14,
      componentKey: "unit6-spelling-completion",
      contentRef: "activity-plurals-14",
    },
    {
      externalId: "activity-plurals-15",
      type: "spelling-completion",
      question: "Identify the Noun Class",
      order: 15,
      componentKey: "unit6-spelling-completion",
      contentRef: "activity-plurals-15",
    },
    {
      externalId: "activity-plurals-16",
      type: "listening-dictation",
      question: "Listening Exercise: Write the Plural Forms",
      order: 16,
      componentKey: "unit6-listening-dictation",
      contentRef: "activity-plurals-16",
    },
  ],
};
