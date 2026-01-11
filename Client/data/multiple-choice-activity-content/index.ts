// Multiple Choice Activity Content Loader
// Groups multiple choice activities by their parent activity ID

const activityCounting3 = {
  id: "activity-counting-3",
  type: "multiple-choice",
  question: "What is 'tano' in English?",
  options: ["Three", "Four", "Five", "Six"],
  correctAnswer: 2,
  explanation: "Tano means five in Swahili",
};

const activityCounting4 = {
  id: "activity-counting-4",
  type: "multiple-choice",
  question: "How do you say '15' in Swahili?",
  options: ["kumi na tano", "kumi na nne", "ishirini", "thelathini"],
  correctAnswer: 0,
  explanation: "15 is 'kumi na tano' (ten and five)",
};

const activityCounting5 = {
  id: "activity-counting-5",
  type: "multiple-choice",
  question: "What is 'hamsini'?",
  options: ["30", "40", "50", "60"],
  correctAnswer: 2,
  explanation: "Hamsini means fifty",
};

// Map activity IDs to their grouped content
export const multipleChoiceActivityMap: Record<string, any[]> = {
  "6685769b-634a-4272-81fb-78e8fe8b6c5e": [activityCounting3],
  "0776b018-17b7-4707-9327-1da43cc56970": [activityCounting4],
  "cba0a4c1-b074-471e-9927-d5ade63f14b0": [activityCounting5],
};

/**
 * Get multiple choice activities by parent activity ID
 * @param activityId - The parent activity ID
 * @returns Array of multiple choice activities or empty array if not found
 */
export function getMultipleChoiceActivities(activityId: string): any[] {
  // Primary lookup: parent activity UUID used by the lesson runtime.
  const direct = multipleChoiceActivityMap[activityId];
  if (direct) return direct;

  // Fallback lookup: practice often passes a content id like "activity-counting-5".
  // Search all grouped activities for a matching child id.
  for (const group of Object.values(multipleChoiceActivityMap)) {
    const match = group.find((a) => a?.id === activityId);
    if (match) return [match];
  }

  return [];
}
