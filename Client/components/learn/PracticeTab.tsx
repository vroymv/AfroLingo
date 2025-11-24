import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { mockPracticeData, PracticeSession } from "@/data/practice";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface PracticeCardProps {
  session: PracticeSession;
  onPress: () => void;
}

const PracticeCard: React.FC<PracticeCardProps> = ({ session, onPress }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#4CAF50";
      case "Medium":
        return "#FF9800";
      case "Hard":
        return "#F44336";
      default:
        return "#4CAF50";
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.practiceCard}>
      <ThemedView style={styles.practiceCardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.practiceIcon}>{session.icon}</Text>
          <View style={styles.difficultyBadge}>
            <View
              style={[
                styles.difficultyDot,
                { backgroundColor: getDifficultyColor(session.difficulty) },
              ]}
            />
            <ThemedText type="default" style={styles.difficultyText}>
              {session.difficulty}
            </ThemedText>
          </View>
        </View>

        <ThemedText type="defaultSemiBold" style={styles.practiceTitle}>
          {session.title}
        </ThemedText>

        <ThemedText type="default" style={styles.practiceDescription}>
          {session.description}
        </ThemedText>

        <View style={styles.cardFooter}>
          <ThemedText type="default" style={styles.timeEstimate}>
            ⏱️ {session.timeEstimate}
          </ThemedText>
          <ThemedText type="default" style={styles.exerciseCount}>
            {session.exercises.length} exercises
          </ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

const StatsOverview: React.FC = () => {
  const currentStreak = 0; // Replace with actual current streak
  const todayXP = 85; // This would be calculated based on today's activities

  return (
    <ThemedView style={styles.statsContainer}>
      <ThemedText type="defaultSemiBold" style={styles.statsTitle}>
        Today&apos;s Progress
      </ThemedText>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>🔥</Text>
          <ThemedText type="defaultSemiBold" style={styles.statValue}>
            {currentStreak}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            Day Streak
          </ThemedText>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>⭐</Text>
          <ThemedText type="defaultSemiBold" style={styles.statValue}>
            {1000}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            Total XP
          </ThemedText>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>🎯</Text>
          <ThemedText type="defaultSemiBold" style={styles.statValue}>
            {todayXP}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            Today&apos;s XP
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
};

const QuickActions: React.FC = () => {
  const quickActionTypes = [
    { id: "daily", title: "Daily Challenge", icon: "⚡", color: "#FF6B35" },
    { id: "review", title: "Review Mistakes", icon: "🔄", color: "#4ECDC4" },
    { id: "speed", title: "Speed Round", icon: "💨", color: "#45B7D1" },
    { id: "audio", title: "Audio Focus", icon: "🎧", color: "#96CEB4" },
  ];

  const handleQuickAction = (actionId: string) => {
    console.log("Quick action:", actionId);
  };

  return (
    <ThemedView style={styles.quickActionsContainer}>
      <ThemedText type="defaultSemiBold" style={styles.quickActionsTitle}>
        Quick Practice
      </ThemedText>

      <View style={styles.quickActionsGrid}>
        {quickActionTypes.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.quickActionCard, { borderColor: action.color }]}
            onPress={() => handleQuickAction(action.id)}
          >
            <Text style={styles.quickActionIcon}>{action.icon}</Text>
            <ThemedText type="default" style={styles.quickActionTitle}>
              {action.title}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </ThemedView>
  );
};

export const PracticeTab: React.FC = () => {
  const handlePracticePress = (session: PracticeSession) => {
    // TODO: Navigate to practice session screen
    console.log("Starting practice session:", session.title);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <StatsOverview />
        <QuickActions />

        <View style={styles.practiceSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Practice Sessions
          </ThemedText>

          {mockPracticeData.map((session) => (
            <PracticeCard
              key={session.id}
              session={session}
              onPress={() => handlePracticePress(session)}
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
  statsContainer: {
    marginTop: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  statsTitle: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 18,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  quickActionsTitle: {
    marginBottom: 16,
    fontSize: 18,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: (width - 48) / 2,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    alignItems: "center",
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    textAlign: "center",
  },
  practiceSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
  },
  practiceCard: {
    marginBottom: 16,
  },
  practiceCardContent: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  practiceIcon: {
    fontSize: 32,
  },
  difficultyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  difficultyText: {
    fontSize: 12,
  },
  practiceTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  practiceDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeEstimate: {
    fontSize: 12,
    opacity: 0.7,
  },
  exerciseCount: {
    fontSize: 12,
    opacity: 0.7,
  },
  bottomPadding: {
    height: 100,
  },
});
