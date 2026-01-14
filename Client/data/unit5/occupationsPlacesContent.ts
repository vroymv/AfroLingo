import occupationsAndPlacesLesson from "@/data/occupations_and_places_lesson.json";

export type Unit5Lesson = {
  id: string;
  title: string;
  level: string;
  icon: string;
  color: string;
  phrase?: string;
  meaning?: string;
  pronunciation?: string;
  audio?: string;
  activities: Array<{ id: string; type: string } & Record<string, unknown>>;
};

export type Unit5Activity = Unit5Lesson["activities"][number];

export const UNIT_5_LESSON =
  occupationsAndPlacesLesson as unknown as Unit5Lesson;

export function getUnit5Activity(activityId: string): Unit5Activity | null {
  const found = UNIT_5_LESSON.activities.find((a) => a.id === activityId);
  return found ?? null;
}

export function getUnit5ActivityByRef(ref?: string): Unit5Activity | null {
  if (!ref) return null;
  return getUnit5Activity(ref);
}
