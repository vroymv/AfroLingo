import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { mockStoriesData, Story } from "@/data/stories";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StoryPlayer } from "./StoryPlayerRouter";
import { StoryCard } from "./StoryCard";
import { StoryProgress } from "./StoryProgress";

export const StoriesTab: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const stories = mockStoriesData;

  const handleStoryPress = (story: Story) => {
    setSelectedStory(story);
    setShowPlayer(true);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <StoryProgress stories={stories} />

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

          {stories.length > 0 ? (
            stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onPress={() => handleStoryPress(story)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>🔍</Text>
              <ThemedText type="defaultSemiBold" style={styles.emptyStateTitle}>
                No Stories Available
              </ThemedText>
              <ThemedText type="default" style={styles.emptyStateText}>
                Check back soon for new stories.
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Story Player Modal */}
      {selectedStory && (
        <StoryPlayer
          story={selectedStory}
          visible={showPlayer}
          onClose={() => setShowPlayer(false)}
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
