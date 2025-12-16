// Multiple Choice Activity Content Loader
// Groups multiple choice activities by their parent activity ID

import activityCounting3 from "./activity-counting-3.json";
import activityCounting4 from "./activity-counting-4.json";
import activityCounting5 from "./activity-counting-5.json";

// Map activity IDs to their grouped content
export const multipleChoiceActivityMap: Record<string, any[]> = {
  "6685769b-634a-4272-81fb-78e8fe8b6c5e": [
    activityCounting3,
    activityCounting4,
    activityCounting5,
  ],
};

/**
 * Get multiple choice activities by parent activity ID
 * @param activityId - The parent activity ID
 * @returns Array of multiple choice activities or empty array if not found
 */
export function getMultipleChoiceActivities(activityId: string): any[] {
  return multipleChoiceActivityMap[activityId] || [];
}
