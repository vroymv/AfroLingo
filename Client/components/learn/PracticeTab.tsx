import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getPracticeActivitiesFeatured } from "@/services/practice";
import { getKaraokeExercises } from "@/services/karaoke";
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
  const [selectedKaraokeId, setSelectedKaraokeId] = useState<string | null>(
    null
  );

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
        const [practiceResult, karaokeResult] = await Promise.all([
          getPracticeActivitiesFeatured(),
          getKaraokeExercises(),
        ]);

        const mappedPractice: PracticeActivity[] = (
          practiceResult.data ?? []
        ).map((a) => {
          const kind = kindFromType(a.type);
          const tags = [a.type, kind, a.componentKey].filter((t): t is string =>
            Boolean(t)
          );

          const isKaraoke =
            a.type.trim().toLowerCase() === "karaoke" ||
            a.componentKey?.toLowerCase().includes("karaoke") === true;

          if (isKaraoke) {
            tags.push("karaoke");
            if (a.contentRef) tags.push(`karaokeRef:${a.contentRef}`);
          }

          return {
            id: a.id,
            title: titleFromId(a.id),
            description: a.type,
            kind,
            emoji: emojiFromKind(kind),
            durationLabel: "",
            xpLabel: "",
            tags,
          };
        });

        const mappedKaraoke: PracticeActivity[] = (
          karaokeResult.data ?? []
        ).map((e) => {
          const kind: PracticeActivity["kind"] = "listening";
          return {
            id: e.id,
            title: e.title || titleFromId(e.id),
            description: e.subtitle || "Karaoke",
            kind,
            emoji: "🎵",
            durationLabel: "",
            xpLabel: "",
            tags: ["karaoke", kind, ...(e.language ? [e.language] : [])],
          };
        });

        if (!practiceResult.success && !karaokeResult.success) {
          setLoadError(
            practiceResult.message ||
              karaokeResult.message ||
              "Failed to load practice activities"
          );
          setActivities([]);
          return;
        }

        setActivities([...mappedPractice, ...mappedKaraoke]);
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
    if (activity.tags.includes("karaoke") || activity.id === "karaoke-lyrics") {
      const contentRefTag = activity.tags.find((t) =>
        t.startsWith("karaokeRef:")
      );
      const ref = contentRefTag?.slice("karaokeRef:".length) || null;

      // If this is a direct karaoke exercise card, its id is the exercise id.
      // If this is a seeded activity row, prefer the contentRef.
      setSelectedKaraokeId(
        ref ?? (activity.id === "karaoke-lyrics" ? null : activity.id)
      );
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
        exerciseId={selectedKaraokeId}
        onClose={() => {
          setShowKaraoke(false);
          setSelectedKaraokeId(null);
        }}
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
