import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Story } from "@/data/stories";
import { fetchStories, fetchStoryById } from "@/services/stories";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StoryPlayer } from "./StoryPlayerRouter";
import { StoryCard } from "./StoryCard";
import { StoryProgress } from "./StoryProgress";

export const StoriesTab: React.FC = () => {
  const { user } = useAuth();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchStories(user?.id);
        if (!isMounted) return;
        setStories(data);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message ?? "Failed to load stories");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleStoryPress = async (story: Story) => {
    try {
      setError(null);
      const full = await fetchStoryById(story.id, user?.id);
      setSelectedStory(full);
      setShowPlayer(true);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load story");
    }
  };

  const handleMarkedComplete = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, isCompleted: true } : s))
    );

    setSelectedStory((prev) =>
      prev && prev.id === storyId ? { ...prev, isCompleted: true } : prev
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <StoryProgress stories={stories} />

        {isLoading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>⏳</Text>
            <ThemedText type="defaultSemiBold" style={styles.emptyStateTitle}>
              Loading stories...
            </ThemedText>
          </View>
        )}

        {error && !isLoading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>⚠️</Text>
            <ThemedText type="defaultSemiBold" style={styles.emptyStateTitle}>
              Couldn’t load stories
            </ThemedText>
            <ThemedText type="default" style={styles.emptyStateText}>
              {error}
            </ThemedText>
          </View>
        )}

        {/* Stories Section */}
        <View style={styles.storiesSection}>
          <View style={styles.storiesHeader}>
            <ThemedText type="subtitle" style={styles.storiesTitle}>
              📖 Browse Stories
            </ThemedText>
            <ThemedText type="default" style={styles.storiesCount}>
              {stories.length} {stories.length === 1 ? "story" : "stories"}
            </ThemedText>
          </View>

          {!isLoading && !error && stories.length > 0 ? (
            stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onPress={() => handleStoryPress(story)}
              />
            ))
          ) : !isLoading && !error ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>🔍</Text>
              <ThemedText type="defaultSemiBold" style={styles.emptyStateTitle}>
                No Stories Available
              </ThemedText>
              <ThemedText type="default" style={styles.emptyStateText}>
                Check back soon for new stories.
              </ThemedText>
            </View>
          ) : null}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Story Player Modal */}
      {selectedStory && (
        <StoryPlayer
          story={selectedStory}
          visible={showPlayer}
          onClose={() => setShowPlayer(false)}
          onMarkedComplete={handleMarkedComplete}
        />
      )}
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
  // Stories Section
  storiesSection: {
    marginBottom: 24,
  },
  storiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  storiesTitle: {
    fontSize: 18,
  },
  storiesCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
  bottomPadding: {
    height: 100,
  },
});
