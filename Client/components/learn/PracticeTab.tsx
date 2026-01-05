import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getPracticeActivitiesFeatured } from "@/services/practice";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { KaraokeLyricsModal } from "./practice/KaraokeLyricsModal";

import {
  PracticeActivitiesSection,
  PracticeEmptyState,
  PracticeSearchCard,
  filterPracticeActivities,
  type PracticeActivity,
} from "./practice";

function titleFromId(id: string) {
  return id
    .split(/[-_]/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function kindFromType(type: string): PracticeActivity["kind"] {
  const normalized = type.trim().toLowerCase();
  if (normalized.includes("pronun") || normalized.includes("speak")) {
    return "pronunciation";
  }
  if (normalized.includes("listen") || normalized.includes("dictation")) {
    return "listening";
  }
  if (normalized.includes("quiz") || normalized.includes("daily")) {
    return "daily-quiz";
  }
  if (normalized.includes("vocab") || normalized.includes("word")) {
    return "vocabulary";
  }
  return "conversation";
}

function emojiFromKind(kind: PracticeActivity["kind"]) {
  switch (kind) {
    case "listening":
      return "🎧";
    case "pronunciation":
      return "🗣️";
    case "daily-quiz":
      return "🧠";
    case "vocabulary":
      return "⚡";
    case "conversation":
      return "💬";
  }
}

export const PracticeTab: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const [query, setQuery] = useState("");
  const [showKaraoke, setShowKaraoke] = useState(false);

  const [activities, setActivities] = useState<PracticeActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadActivities = React.useCallback(
    async (options?: { showLoading?: boolean }) => {
      const showLoading = options?.showLoading ?? false;

      if (showLoading) setLoading(true);
      setLoadError(null);

      try {
        const result = await getPracticeActivitiesFeatured();

        if (!result.success || !result.data) {
          setLoadError(result.message || "Failed to load practice activities");
          setActivities([]);
          return;
        }

        const mapped: PracticeActivity[] = result.data.map((a) => {
          const kind = kindFromType(a.type);
          return {
            id: a.id,
            title: titleFromId(a.id),
            description: a.type,
            kind,
            emoji: emojiFromKind(kind),
            durationLabel: "",
            xpLabel: "",
            tags: [a.type, kind, a.componentKey].filter(Boolean),
          };
        });

        setActivities(mapped);
      } catch (e: any) {
        setLoadError(e?.message || "Failed to load practice activities");
        setActivities([]);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    let canceled = false;

    (async () => {
      if (canceled) return;
      await loadActivities({ showLoading: true });
    })();

    return () => {
      canceled = true;
    };
  }, [loadActivities]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await loadActivities();
    } finally {
      setRefreshing(false);
    }
  }, [loadActivities]);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () => filterPracticeActivities(activities, normalizedQuery),
    [activities, normalizedQuery]
  );

  const handlePressActivity = (activity: PracticeActivity) => {
    if (activity.id === "karaoke-lyrics") {
      setShowKaraoke(true);
      return;
    }

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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <PracticeSearchCard
            query={query}
            onChangeQuery={setQuery}
            onClear={() => setQuery("")}
          />

          {loading ? (
            <PracticeEmptyState
              emoji="⏳"
              title="Loading"
              message="Fetching practice activities…"
            />
          ) : loadError ? (
            <PracticeEmptyState
              emoji="⚠️"
              title="Couldn’t load"
              message={loadError}
            />
          ) : (
            <PracticeActivitiesSection
              activities={filtered}
              dividerColor={dividerColor}
              onPressActivity={handlePressActivity}
            />
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>

      <KaraokeLyricsModal
        visible={showKaraoke}
        onClose={() => setShowKaraoke(false)}
      />
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
