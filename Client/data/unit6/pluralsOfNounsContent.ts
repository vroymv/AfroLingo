import unit6Raw from "@/data/unit-6_lessons.json";

export type Unit6LessonUnit = {
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

export type Unit6Lesson = Unit6LessonUnit["lessons"][number];
export type Unit6Activity = Unit6Lesson["activities"][number];

export const UNIT_6_LESSON_UNIT = unit6Raw as unknown as Unit6LessonUnit;

export function getUnit6Lesson(): Unit6Lesson | null {
  const lesson = UNIT_6_LESSON_UNIT?.lessons?.[0];
  return lesson ?? null;
}

export function getUnit6Activity(activityId: string): Unit6Activity | null {
  const lesson = getUnit6Lesson();
  if (!lesson) return null;

  const found = lesson.activities.find((a) => a.id === activityId);
  return found ?? null;
}

export function getUnit6ActivityByRef(ref?: string): Unit6Activity | null {
  if (!ref) return null;
  return getUnit6Activity(ref);
}
