import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { mockStoriesData, Story } from "@/data/stories";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface StoryCardProps {
  story: Story;
  onPress: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onPress }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "#4CAF50";
      case "Intermediate":
        return "#FF9800";
      case "Advanced":
        return "#F44336";
      default:
        return "#4CAF50";
    }
  };

  const wordsLearned = story.completedWords.length;
  const progressPercentage = Math.round(
    (wordsLearned / story.totalWords) * 100
  );

  return (
    <TouchableOpacity onPress={onPress} style={styles.storyCard}>
      <ThemedView style={styles.storyCardContent}>
        <View style={styles.storyHeader}>
          <Text style={styles.storyCover}>{story.cover}</Text>
          <View style={styles.storyInfo}>
            <ThemedText type="defaultSemiBold" style={styles.storyTitle}>
              {story.title}
            </ThemedText>
            <ThemedText type="default" style={styles.storyDescription}>
              {story.description}
            </ThemedText>
          </View>
        </View>

        <View style={styles.storyMeta}>
          <View style={styles.difficultyTimeContainer}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(story.difficulty) },
              ]}
            >
              <ThemedText type="default" style={styles.difficultyText}>
                {story.difficulty}
              </ThemedText>
            </View>
            <ThemedText type="default" style={styles.estimatedTime}>
              📖 {story.estimatedTime}
            </ThemedText>
          </View>

          <View style={styles.progressInfo}>
            <ThemedText type="default" style={styles.wordsProgress}>
              {wordsLearned}/{story.totalWords} words learned
            </ThemedText>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercentage}%`,
                    backgroundColor: getDifficultyColor(story.difficulty),
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

const StoryProgress: React.FC = () => {
  const totalStories = mockStoriesData.length;
  const unlockedStories = mockStoriesData.filter(
    (story) => story.completedWords.length > 0
  ).length;

  return (
    <ThemedView style={styles.progressContainer}>
      <ThemedText type="defaultSemiBold" style={styles.progressTitle}>
        Cultural Stories Journey
      </ThemedText>

      <View style={styles.progressStats}>
        <View style={styles.progressStat}>
          <Text style={styles.progressEmoji}>📚</Text>
          <ThemedText type="defaultSemiBold" style={styles.progressValue}>
            {totalStories}
          </ThemedText>
          <ThemedText type="default" style={styles.progressLabel}>
            Total Stories
          </ThemedText>
        </View>

        <View style={styles.progressStat}>
          <Text style={styles.progressEmoji}>🔓</Text>
          <ThemedText type="defaultSemiBold" style={styles.progressValue}>
            {unlockedStories}
          </ThemedText>
          <ThemedText type="default" style={styles.progressLabel}>
            Unlocked
          </ThemedText>
        </View>

        <View style={styles.progressStat}>
          <Text style={styles.progressEmoji}>✨</Text>
          <ThemedText type="defaultSemiBold" style={styles.progressValue}>
            {Math.round((unlockedStories / totalStories) * 100)}%
          </ThemedText>
          <ThemedText type="default" style={styles.progressLabel}>
            Complete
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
};

const FeaturedStory: React.FC = () => {
  const featuredStory = mockStoriesData[0]; // First story as featured

  const handlePlayAudio = () => {
    console.log("Playing audio for featured story");
  };

  return (
    <ThemedView style={styles.featuredContainer}>
      <ThemedText type="defaultSemiBold" style={styles.featuredTitle}>
        Continue Reading
      </ThemedText>

      <ThemedView style={styles.featuredStory}>
        <View style={styles.featuredHeader}>
          <Text style={styles.featuredCover}>{featuredStory.cover}</Text>
          <View style={styles.featuredInfo}>
            <ThemedText type="defaultSemiBold">
              {featuredStory.title}
            </ThemedText>
            <ThemedText type="default" style={styles.featuredDescription}>
              {featuredStory.description}
            </ThemedText>
          </View>
        </View>

        <View style={styles.featuredContent}>
          <ThemedText type="default" style={styles.currentSegment}>
            &quot;{featuredStory.segments[0].text}&quot;
          </ThemedText>
          <ThemedText type="default" style={styles.currentTranslation}>
            {featuredStory.segments[0].translation}
          </ThemedText>
        </View>

        <View style={styles.featuredActions}>
          <TouchableOpacity
            style={styles.audioButton}
            onPress={handlePlayAudio}
          >
            <Text style={styles.audioIcon}>🔊</Text>
            <ThemedText type="default" style={styles.audioText}>
              Listen
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.continueButton}>
            <ThemedText type="default" style={styles.continueText}>
              Continue Reading →
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ThemedView>
  );
};

export const StoriesTab: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredStories =
    selectedDifficulty === "All"
      ? mockStoriesData
      : mockStoriesData.filter(
          (story) => story.difficulty === selectedDifficulty
        );

  const handleStoryPress = (story: Story) => {
    // TODO: Navigate to story reading screen
    console.log("Opening story:", story.title);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <StoryProgress />
        <FeaturedStory />

        <View style={styles.filtersContainer}>
          <ThemedText type="defaultSemiBold" style={styles.filtersTitle}>
            Browse Stories
          </ThemedText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersScroll}
          >
            {difficulties.map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.filterButton,
                  selectedDifficulty === difficulty &&
                    styles.filterButtonActive,
                ]}
                onPress={() => setSelectedDifficulty(difficulty)}
              >
                <ThemedText
                  type="default"
                  style={[
                    styles.filterText,
                    selectedDifficulty === difficulty &&
                      styles.filterTextActive,
                  ]}
                >
                  {difficulty}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.storiesSection}>
          {filteredStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onPress={() => handleStoryPress(story)}
            />
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  progressContainer: {
    marginTop: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  progressTitle: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 18,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  progressStat: {
    alignItems: "center",
  },
  progressEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 20,
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  featuredContainer: {
    marginBottom: 24,
  },
  featuredTitle: {
    marginBottom: 16,
    fontSize: 18,
  },
  featuredStory: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  featuredHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featuredCover: {
    fontSize: 40,
    marginRight: 16,
  },
  featuredInfo: {
    flex: 1,
  },
  featuredDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  featuredContent: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
  },
  currentSegment: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    fontStyle: "italic",
  },
  currentTranslation: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  featuredActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  audioIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  audioText: {
    fontSize: 12,
  },
  continueButton: {
    backgroundColor: "rgba(74, 144, 226, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  continueText: {
    color: "#4A90E2",
    fontSize: 12,
    fontWeight: "600",
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filtersTitle: {
    marginBottom: 12,
    fontSize: 18,
  },
  filtersScroll: {
    flexDirection: "row",
  },
  filterButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: "rgba(74, 144, 226, 0.3)",
  },
  filterText: {
    fontSize: 12,
  },
  filterTextActive: {
    color: "#4A90E2",
    fontWeight: "600",
  },
  storiesSection: {
    marginBottom: 24,
  },
  storyCard: {
    marginBottom: 16,
  },
  storyCardContent: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  storyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  storyCover: {
    fontSize: 32,
    marginRight: 12,
  },
  storyInfo: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  storyDescription: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 16,
  },
  storyMeta: {
    gap: 12,
  },
  difficultyTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  estimatedTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  progressInfo: {
    gap: 8,
  },
  wordsProgress: {
    fontSize: 12,
    opacity: 0.8,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  bottomPadding: {
    height: 100,
  },
});
