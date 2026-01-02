import type { PracticeActivity, PracticeKind } from "./practiceTypes";

export const PRACTICE_TINT = "#4A90E2";

export function kindLabel(kind: PracticeKind) {
  switch (kind) {
    case "listening":
      return "Listening";
    case "pronunciation":
      return "Pronunciation";
    case "daily-quiz":
      return "Daily Quiz";
    case "vocabulary":
      return "Vocabulary";
    case "conversation":
      return "Conversation";
    default:
      return "Practice";
  }
}

export function filterPracticeActivities(
  activities: PracticeActivity[],
  normalizedQuery: string
) {
  if (!normalizedQuery) return activities;

  return activities.filter((a) => {
    const haystack = `${a.title} ${a.description} ${a.tags.join(
      " "
    )} ${kindLabel(a.kind)}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}
