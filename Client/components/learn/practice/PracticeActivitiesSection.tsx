import React from "react";
import { View } from "react-native";
import type { PracticeActivity } from "./practiceTypes";
import { PracticeActivityCard } from "./PracticeActivityCard";
import { PracticeEmptyState } from "./PracticeEmptyState";
import { PracticeSectionHeader } from "./PracticeSectionHeader";

export function PracticeActivitiesSection({
  activities,
  dividerColor,
  onPressActivity,
}: {
  activities: PracticeActivity[];
  dividerColor: string;
  onPressActivity: (activity: PracticeActivity) => void;
}) {
  const resultLabel = `${activities.length} ${
    activities.length === 1 ? "result" : "results"
  }`;

  return (
    <View>
      <PracticeSectionHeader title="Practice Activities" meta={resultLabel} />

      {activities.length === 0 ? (
        <PracticeEmptyState
          emoji="🔎"
          title="No matches"
          message="Try a shorter search like “quiz” or “audio”."
        />
      ) : (
        activities.map((activity) => (
          <PracticeActivityCard
            key={activity.id}
            activity={activity}
            dividerColor={dividerColor}
            onPress={() => onPressActivity(activity)}
          />
        ))
      )}
    </View>
  );
}
