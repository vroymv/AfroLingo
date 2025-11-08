import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface DailyGoalCardProps {
  onContinueLesson: () => void;
}

export default function DailyGoalCard({
  onContinueLesson,
}: DailyGoalCardProps) {
  return (
    <ThemedView style={styles.dailyGoalCard}>
      <View style={styles.goalHeader}>
        <ThemedText type="subtitle">Daily Goal Tracker</ThemedText>
        <View style={styles.streakBadge}>
          <ThemedText style={styles.streakIcon}>🔥</ThemedText>
          <ThemedText style={styles.streakNumber}>7</ThemedText>
        </View>
      </View>

      <View style={styles.progressRingContainer}>
        <View style={styles.progressRing}>
          <View
            style={[
              styles.progressRingFill,
              { transform: [{ rotate: "234deg" }] },
            ]}
          />
          <View style={styles.progressRingInner}>
            <ThemedText style={styles.progressPercentage}>65%</ThemedText>
            <ThemedText style={styles.progressLabel}>Daily Goal</ThemedText>
          </View>
        </View>
        <View style={styles.goalDetails}>
          <ThemedText style={styles.goalText}>
            2 of 3 lessons completed today
          </ThemedText>
          <ThemedText style={styles.xpText}>
            +45 XP earned • 15 XP to goal
          </ThemedText>
        </View>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={onContinueLesson}
      >
        <ThemedText style={styles.continueButtonText}>
          Continue Lesson
        </ThemedText>
        <ThemedText style={styles.continueButtonIcon}>▶️</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  dailyGoalCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 69, 0, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF4500",
  },
  progressRingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  progressRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    position: "relative",
  },
  progressRingFill: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#007AFF",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
  progressRingInner: {
    alignItems: "center",
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  progressLabel: {
    fontSize: 10,
    opacity: 0.6,
  },
  goalDetails: {
    flex: 1,
  },
  goalText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  xpText: {
    fontSize: 14,
    opacity: 0.7,
  },
  continueButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  continueButtonIcon: {
    color: "white",
    fontSize: 18,
  },
});
