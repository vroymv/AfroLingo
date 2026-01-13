import unit3Raw from "./time_lesson.json";

export type Unit3TimeActivityContent = {
  id: string;
  type: string;
  question?: string;
  description?: string;
  audio?: string;
  image?: string;
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  items?: any[];
  pairs?: { left: string; right: string }[];
  conversation?: { speaker: string; text: string; translation: string }[];
  dialogue?: {
    speaker: string;
    text: string;
    translation: string;
    audio: string;
  }[];
};

type Unit3TimeUnit = {
  id: string;
  activities?: Unit3TimeActivityContent[];
};

const unit3 = unit3Raw as unknown as Unit3TimeUnit;

const activityIndex: Record<string, Unit3TimeActivityContent> =
  Object.fromEntries((unit3.activities ?? []).map((a) => [a.id, a]));

export function getUnit3TimeActivityContent(
  contentRef: string
): Unit3TimeActivityContent | null {
  return activityIndex[contentRef] ?? null;
}
