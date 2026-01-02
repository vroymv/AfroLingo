import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import {
  FEATURED_MODES,
  PRACTICE_ACTIVITIES,
  PracticeActivitiesSection,
  PracticeFeaturedSection,
  PracticeSearchCard,
  filterPracticeActivities,
  kindLabel,
  type PracticeActivity,
  type PracticeKind,
} from "./practice";

export const PracticeTab: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () => filterPracticeActivities(PRACTICE_ACTIVITIES, normalizedQuery),
    [normalizedQuery]
  );

  const handlePressMode = (kind: PracticeKind) => {
    setQuery(kindLabel(kind));
  };

  const handlePressActivity = (activity: PracticeActivity) => {
    // Intentionally no navigation yet — this tab is the discovery surface.
    // Hook this into your practice routes/lesson launcher when ready.
    console.log("Selected practice activity:", activity.id);
  };

  const backgroundColor = Colors[colorScheme].background;
  const dividerColor =
    colorScheme === "dark"
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(0, 0, 0, 0.06)";

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={[styles.scrollView, { backgroundColor }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <PracticeSearchCard
            query={query}
            onChangeQuery={setQuery}
            onClear={() => setQuery("")}
          />

          <PracticeFeaturedSection
            modes={FEATURED_MODES}
            onSelectKind={handlePressMode}
          />

          <PracticeActivitiesSection
            activities={filtered}
            dividerColor={dividerColor}
            onPressActivity={handlePressActivity}
          />

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bottomPadding: {
    height: 100,
  },
});
