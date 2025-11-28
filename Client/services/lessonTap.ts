import { Unit } from "@/data/lessons";

// Map API level slug to display title
export const toTitleCaseLevel = (lvl?: string) => {
  if (!lvl) return "Beginner";
  // Handle known slug formats like "absolute-beginner"
  return lvl
    .split(/[\s-_]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(" ");
};

// Select a single user progress entry (server may return an array)
export const selectUserProgress = (upRaw: any) =>
  Array.isArray(upRaw) ? upRaw[0] : upRaw || {};

// Convert API units to UI units expected by UnitCard/UnitsList
export const mapUnitsToUi = (units: any[]): Unit[] => {
  return (units || []).map((u: any) => {
    const up = selectUserProgress(u?.userProgress);

    const totalLessons: number =
      up.totalLessons ??
      u.totalLessons ??
      (Array.isArray(u?.lessons) ? u.lessons.length : 0);

    const completedLessonsExplicit: number | undefined =
      typeof up.completedLessons === "number"
        ? up.completedLessons
        : typeof up.lessonsCompleted === "number"
        ? up.lessonsCompleted
        : undefined;

    const explicitProgress: number | undefined =
      typeof up.progress === "number"
        ? up.progress
        : typeof up.progressPercent === "number"
        ? up.progressPercent
        : typeof up.percent === "number"
        ? up.percent
        : undefined;

    const completedLessons: number = (() => {
      if (typeof completedLessonsExplicit === "number")
        return completedLessonsExplicit;
      if (typeof explicitProgress === "number" && totalLessons > 0)
        return Math.round((explicitProgress / 100) * totalLessons);
      return 0;
    })();

    const progress: number = (() => {
      if (typeof explicitProgress === "number")
        return Math.max(0, Math.min(100, Math.round(explicitProgress)));
      if (totalLessons > 0)
        return Math.round((completedLessons / totalLessons) * 100);
      return 0;
    })();

    return {
      id: u.id,
      title: u.title,
      level: toTitleCaseLevel(u.level) as any,
      progress,
      totalLessons,
      completedLessons,
      icon: u.icon || "📘",
      color: u.color || "#2196F3",
      lessons: Array.isArray(u.lessons) ? u.lessons : [],
      xpReward: u.xpReward ?? up.xpReward ?? 0,
    } as Unit;
  });
};

// Build milestones from mapped units
export const computeMilestones = (mappedUnits: Unit[]) =>
  mappedUnits.map((u) => ({
    id: u.id,
    title: u.title,
    icon: u.icon,
    color: u.color,
    progress: u.progress,
  }));

// Aggregate stats for ProgressTracker
export const computeProgressStats = (mappedUnits: Unit[], rawUnits: any[]) => {
  const completedUnits = mappedUnits.filter((u) => u.progress === 100).length;
  const inProgressUnits = mappedUnits.filter(
    (u) => u.progress > 0 && u.progress < 100
  ).length;
  const totalUnits = mappedUnits.length;
  const milestones = computeMilestones(mappedUnits);

  const totalXP = (rawUnits || []).reduce((sum: number, u: any) => {
    const up = selectUserProgress(u?.userProgress);
    const unitXP =
      up.xpEarned ?? up.totalXP ?? up.totalXp ?? up.xp ?? up.earnedXP ?? 0;
    return sum + (typeof unitXP === "number" ? unitXP : 0);
  }, 0);

  return {
    totalXP,
    streakDays: 0, // TODO: replace with real streak from context/API
    completedUnits,
    inProgressUnits,
    totalUnits,
    milestones,
  };
};
