import { useEffect, useRef } from "react";
import { useLessonRuntime } from "@/contexts/LessonRuntimeContext";
import { updateUserProgress } from "@/services/userprogress";
import { awardXP } from "@/services/xp";

export function useLessonProgressReporter() {
  const { userId, unitId, currentActivityNumber, totalActivities } =
    useLessonRuntime();

  const isPracticeRuntime =
    typeof unitId === "string" && unitId.startsWith("practice:");

  useEffect(() => {
    if (!userId) return;
    if (isPracticeRuntime) return;

    updateUserProgress({
      userId,
      unitId,
      currentActivityNumber,
      totalActivities,
    }).catch((e) => console.warn("Failed to send progress", e));
  }, [
    userId,
    unitId,
    currentActivityNumber,
    totalActivities,
    isPracticeRuntime,
  ]);
}

export function useCompletionXP(amount: number, sourcePrefix: string) {
  const { userId, unitId, currentActivityNumber, totalActivities } =
    useLessonRuntime();
  const awardedRef = useRef(false);

  const isPracticeRuntime =
    typeof unitId === "string" && unitId.startsWith("practice:");

  const award = async (metadata?: Record<string, any>) => {
    if (!userId) return;
    if (isPracticeRuntime) return;
    if (awardedRef.current) return;

    const result = await awardXP({
      userId,
      amount,
      sourceType: "activity_completion",
      sourceId: `${sourcePrefix}-${unitId}-${currentActivityNumber}`,
      metadata: {
        unitId,
        currentActivityNumber,
        totalActivities,
        ...metadata,
      },
    });

    if (!result.success) {
      console.warn("XP award failed", result.message);
      return;
    }

    awardedRef.current = true;
  };

  return { award };
}
