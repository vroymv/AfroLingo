import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Type for milestone item
interface ProgressMilestone {
  id: string | number;
  title: string;
  icon: string;
  color: string;
  progress: number; // 0-100
}

// Main stats type
interface ProgressTrackerStats {
  totalXP: number;
  streakDays: number;
  completedActivities: number;
  completedUnits: number;
  inProgressUnits: number;
  totalUnits: number;
  milestones: ProgressMilestone[];
}

interface ProgressTrackerProps {
  stats: ProgressTrackerStats;
}

export const ProgressTracker = React.memo<ProgressTrackerProps>(({ stats }) => {
  const {
    totalXP,
    streakDays,
    completedActivities,
    completedUnits,
    inProgressUnits,
    totalUnits,
    milestones,
  } = stats;
  const overallProgress =
    totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  // console.log("Rendering ProgressTracker with stats:", stats);

  return (
    <ThemedView style={styles.progressTracker}>
      <ThemedText type="subtitle" style={styles.progressTitle}>
        Your Learning Journey
      </ThemedText>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <ThemedText type="defaultSemiBold" style={styles.statNumber}>
            {Math.round(totalXP)}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            Total XP
          </ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText type="defaultSemiBold" style={styles.statNumber}>
            {streakDays}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            Day Streak
          </ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText type="defaultSemiBold" style={styles.statNumber}>
            {completedActivities}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            Activities
          </ThemedText>
        </View>
      </View>

      {/* Milestone Progress - Horizontally Scrollable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.milestoneScrollContent}
        style={styles.milestoneScrollView}
      >
        <View style={styles.milestoneContainer}>
          {milestones.map((milestone, index) => (
            <View key={milestone.id} style={styles.milestone}>
              <TouchableOpacity
                style={[
                  styles.milestoneCircle,
                  {
                    backgroundColor:
                      milestone.progress > 0 ? milestone.color : "#333",
                    borderColor: milestone.color,
                    borderWidth: milestone.progress === 100 ? 3 : 2,
                  },
                ]}
                accessibilityLabel={`${milestone.title}, ${milestone.progress}% complete`}
              >
                <Text
                  style={[
                    styles.milestoneIcon,
                    { opacity: milestone.progress > 0 ? 1 : 0.5 },
                  ]}
                >
                  {milestone.icon}
                </Text>
                {milestone.progress === 100 && (
                  <View style={styles.milestoneCheck}>
                    <Text style={styles.milestoneCheckText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
              {index < milestones.length - 1 && (
                <View
                  style={[
                    styles.milestoneLine,
                    {
                      backgroundColor:
                        milestone.progress === 100 ? milestone.color : "#333",
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Overall Progress */}
      <View style={styles.overallProgressContainer}>
        <View style={styles.progressSummary}>
          <ThemedText type="default" style={styles.overallProgress}>
            {overallProgress}% Complete • {completedUnits}/{totalUnits} Units
          </ThemedText>
          {inProgressUnits > 0 && (
            <ThemedText type="default" style={styles.inProgressText}>
              {inProgressUnits} in progress
            </ThemedText>
          )}
        </View>
        <View style={styles.overallProgressTrack}>
          <View
            style={[
              styles.overallProgressFill,
              { width: `${overallProgress}%` },
            ]}
          />
        </View>
      </View>
    </ThemedView>
  );
});

ProgressTracker.displayName = "ProgressTracker";

const styles = StyleSheet.create({
  progressTracker: {
    marginTop: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  progressTitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  milestoneScrollView: {
    marginBottom: 16,
  },
  milestoneScrollContent: {
    paddingHorizontal: 10,
  },
  milestoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  milestone: {
    alignItems: "center",
    flexDirection: "row",
  },
  milestoneCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  milestoneIcon: {
    fontSize: 18,
  },
  milestoneCheck: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  milestoneCheckText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  milestoneLine: {
    width: 24,
    height: 2,
    marginHorizontal: 4,
  },
  overallProgressContainer: {
    marginTop: 12,
  },
  progressSummary: {
    marginBottom: 8,
  },
  overallProgress: {
    textAlign: "center",
    opacity: 0.8,
    fontSize: 14,
  },
  inProgressText: {
    textAlign: "center",
    opacity: 0.6,
    fontSize: 12,
    marginTop: 4,
  },
  overallProgressTrack: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  overallProgressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
});
