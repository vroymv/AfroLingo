// Activity content loader
// Maps activity IDs to their content data

import activityCounting3 from "./activity-counting-3.json";
import activityCounting4 from "./activity-counting-4.json";
import activityCounting5 from "./activity-counting-5.json";

export const activityContentMap: Record<string, any> = {
  "activity-counting-3": activityCounting3,
  "activity-counting-4": activityCounting4,
  "activity-counting-5": activityCounting5,
};

// Log available content on module load
console.log("Activity content map loaded:", {
  availableIds: Object.keys(activityContentMap),
  sampleContent: activityCounting3,
});

/**
 * Get activity content by ID or contentRef
 * @param activityId - The activity ID or contentRef
 * @returns The activity content or null if not found
 */
export function getActivityContent(activityId: string): any | null {
  return activityContentMap[activityId] || null;
}

/**
 * Merge activity metadata with content data
 * @param activity - Activity metadata from API
 * @returns Complete activity with content
 */
export function mergeActivityWithContent(activity: any): any {
  const content = getActivityContent(activity.id);

  console.log("Merging activity content:", {
    activityId: activity.id,
    hasContent: !!content,
    contentKeys: content ? Object.keys(content) : [],
  });

  if (!content) {
    console.warn(`No content found for activity: ${activity.id}`);
    return activity;
  }

  const merged = {
    ...activity,
    ...content,
  };

  console.log("Merged activity result:", {
    id: merged.id,
    type: merged.type,
    hasOptions: !!merged.options,
    hasCorrectAnswer: merged.correctAnswer !== undefined,
  });

  return merged;
}
