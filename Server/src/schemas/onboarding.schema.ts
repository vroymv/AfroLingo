import { z } from "zod";

/**
 * Schema for validating onboarding data
 */
export const onboardingDataSchema = z.object({
  selectedLanguage: z
    .string()
    .min(1, "Language is required")
    .refine(
      (val) => ["sw", "zu", "ln", "xh"].includes(val),
      "Invalid language selection"
    ),
  selectedLevel: z
    .string()
    .min(1, "Level is required")
    .refine(
      (val) => ["absolute-beginner", "beginner", "refresher"].includes(val),
      "Invalid level selection"
    ),
  placementTestScore: z.number().min(0).max(100).nullable().optional(),
  personalization: z
    .object({
      reasons: z.array(z.string()).min(1, "At least one reason is required"),
      timeCommitment: z
        .string()
        .refine(
          (val) => ["5min", "15min", "30min", "60min"].includes(val),
          "Invalid time commitment"
        ),
    })
    .nullable()
    .optional(),
});

export type OnboardingData = z.infer<typeof onboardingDataSchema>;
