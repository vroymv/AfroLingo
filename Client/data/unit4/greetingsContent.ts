import greetingsLesson from "@/data/greetings_lesson.json";

export type GreetingsLesson = {
  id: string;
  title: string;
  level: string;
  icon: string;
  color: string;
  activities: Array<{ id: string; type: string } & Record<string, unknown>>;
};

export type GreetingsActivity = GreetingsLesson["activities"][number];

export const GREETINGS_LESSON = greetingsLesson as unknown as GreetingsLesson;

export function getGreetingsActivity(
  activityId: string
): GreetingsActivity | null {
  const found = GREETINGS_LESSON.activities.find((a) => a.id === activityId);
  return found ?? null;
}

export function getGreetingsActivityByRef(
  ref?: string
): GreetingsActivity | null {
  if (!ref) return null;
  return getGreetingsActivity(ref);
}
