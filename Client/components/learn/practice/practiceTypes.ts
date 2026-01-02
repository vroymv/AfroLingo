export type PracticeKind =
  | "listening"
  | "pronunciation"
  | "daily-quiz"
  | "vocabulary"
  | "conversation";

export type PracticeActivity = {
  id: string;
  title: string;
  description: string;
  kind: PracticeKind;
  emoji: string;
  durationLabel: string;
  xpLabel: string;
  tags: string[];
};

export type PracticeFeaturedMode = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  kind: PracticeKind;
};
