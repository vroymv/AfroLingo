import unit7Raw from "@/data/unit-7_lessons.json";

export type Unit7LessonUnit = {
  id: string;
  title: string;
  level: string;
  icon: string;
  color: string;
  xpReward: number;
  lessons: {
    id: string;
    phrase?: string;
    meaning?: string;
    pronunciation?: string;
    audio?: string;
    activities: ({ id: string; type: string } & Record<string, unknown>)[];
  }[];
};

export type Unit7Lesson = Unit7LessonUnit["lessons"][number];
export type Unit7Activity = Unit7Lesson["activities"][number];

export const UNIT_7_LESSON_UNIT = unit7Raw as unknown as Unit7LessonUnit;

export function getUnit7Lesson(): Unit7Lesson | null {
  const lesson = UNIT_7_LESSON_UNIT?.lessons?.[0];
  return lesson ?? null;
}

export function getUnit7Activity(activityId: string): Unit7Activity | null {
  const lesson = getUnit7Lesson();
  if (!lesson) return null;

  const found = lesson.activities.find((a) => a.id === activityId);
  return found ?? null;
}

export function getUnit7ActivityByRef(ref?: string): Unit7Activity | null {
  if (!ref) return null;
  return getUnit7Activity(ref);
}
