import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLessonProgress } from "@/contexts/LessonProgressContext";
import { mockLessonsData, Unit } from "@/data/lessons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface UnitCardProps {
  unit: Unit;
  onPress: () => void;
  onActionPress: () => void;
}

// Add display names for memo components
const UnitCard = React.memo<UnitCardProps>(
  ({ unit, onPress, onActionPress }) => {
    const progressWidth = (unit.progress / 100) * (width - 64);
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = useCallback(() => {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }, [scaleAnim]);

    const handlePressOut = useCallback(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }, [scaleAnim]);

    const progressColor = useMemo(() => {
      if (unit.progress >= 100) return "#4CAF50"; // Green for completed
      if (unit.progress >= 70) return "#FF9800"; // Orange for near completion
      return unit.color; // Original color
    }, [unit.progress, unit.color]);

    const completionStatus = useMemo(() => {
      if (unit.progress === 100) return "Completed";
      if (unit.progress > 0) return "In Progress";
      return "Not Started";
    }, [unit.progress]);

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.unitCard}
          accessibilityRole="button"
          accessibilityLabel={`${unit.title} unit, ${completionStatus}, ${unit.progress}% complete`}
          accessibilityHint="Tap to open this learning unit"
          activeOpacity={0.9}
        >
          <ThemedView
            style={[styles.unitCardContent, { borderLeftColor: progressColor }]}
          >
            <View style={styles.unitHeader}>
              <View style={styles.iconContainer}>
                <Text style={styles.unitIcon}>{unit.icon}</Text>
                {unit.progress === 100 && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedBadgeText}>✓</Text>
                  </View>
                )}
              </View>
              <View style={styles.unitInfo}>
                <ThemedText type="defaultSemiBold" style={styles.unitTitle}>
                  {unit.title}
                </ThemedText>
                <ThemedText type="default" style={styles.unitLevel}>
                  {unit.level}
                </ThemedText>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: progressColor },
                    ]}
                  />
                  <ThemedText type="default" style={styles.statusText}>
                    {completionStatus}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.unitStats}>
                <ThemedText type="default" style={styles.progressText}>
                  {unit.completedLessons}/{unit.totalLessons}
                </ThemedText>
                <ThemedText type="default" style={styles.lessonsLabel}>
                  lessons
                </ThemedText>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressWidth,
                      backgroundColor: progressColor,
                      shadowColor: progressColor,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 4,
                      elevation: 4,
                    },
                  ]}
                />
              </View>
              <ThemedText type="default" style={styles.progressPercentage}>
                {unit.progress}%
              </ThemedText>
            </View>

            <View style={styles.bottomRow}>
              <View style={[styles.xpBadge, { borderColor: progressColor }]}>
                <Text style={styles.xpIcon}>⭐</Text>
                <ThemedText
                  type="default"
                  style={[styles.xpText, { color: progressColor }]}
                >
                  +{unit.xpReward} XP
                </ThemedText>
              </View>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: progressColor },
                ]}
                onPress={onActionPress}
                accessibilityLabel={
                  unit.progress > 0 ? "Continue learning" : "Start learning"
                }
              >
                <ThemedText type="default" style={styles.actionButtonText}>
                  {unit.progress > 0 ? "Continue" : "Start"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);
UnitCard.displayName = "UnitCard";

const ProgressTracker = React.memo(() => {
  const totalUnits = mockLessonsData.units.length;
  const completedUnits = mockLessonsData.units.filter(
    (unit) => unit.progress === 100
  ).length;
  const overallProgress = Math.round((completedUnits / totalUnits) * 100);
  const inProgressUnits = mockLessonsData.units.filter(
    (unit) => unit.progress > 0 && unit.progress < 100
  ).length;

  const streakDays = 7; // This would come from user data
  const totalXP = mockLessonsData.units.reduce(
    (acc, unit) =>
      acc + (unit.completedLessons / unit.totalLessons) * unit.xpReward,
    0
  );

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
            {completedUnits}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            Completed
          </ThemedText>
        </View>
      </View>

      {/* Milestone Progress */}
      <View style={styles.milestoneContainer}>
        {mockLessonsData.units.map((unit, index) => (
          <View key={unit.id} style={styles.milestone}>
            <TouchableOpacity
              style={[
                styles.milestoneCircle,
                {
                  backgroundColor: unit.progress > 0 ? unit.color : "#333",
                  borderColor: unit.color,
                  borderWidth: unit.progress === 100 ? 3 : 2,
                },
              ]}
              accessibilityLabel={`${unit.title}, ${unit.progress}% complete`}
            >
              <Text
                style={[
                  styles.milestoneIcon,
                  { opacity: unit.progress > 0 ? 1 : 0.5 },
                ]}
              >
                {unit.icon}
              </Text>
              {unit.progress === 100 && (
                <View style={styles.milestoneCheck}>
                  <Text style={styles.milestoneCheckText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
            {index < mockLessonsData.units.length - 1 && (
              <View
                style={[
                  styles.milestoneLine,
                  {
                    backgroundColor:
                      unit.progress === 100 ? unit.color : "#333",
                  },
                ]}
              />
            )}
          </View>
        ))}
      </View>

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

export const LessonsTab: React.FC = () => {
  const router = useRouter();
  const { startLesson, activeLesson } = useLessonProgress();

  const getNextLessonInUnit = useCallback(
    (unit: Unit) => {
      // If there's an active lesson in this unit, return it
      if (
        activeLesson &&
        activeLesson.unitId === unit.id &&
        !activeLesson.completed
      ) {
        return activeLesson.lessonId;
      }

      // Otherwise, find the first incomplete lesson in the unit
      // For now, just return the first lesson since we don't have completion tracking per lesson
      return unit.lessons[0]?.id;
    },
    [activeLesson]
  );

  const handleUnitPress = useCallback(
    (unit: Unit) => {
      const lessonId = getNextLessonInUnit(unit);

      if (lessonId) {
        // Start the lesson in context
        startLesson(lessonId);
        // Navigate to the lesson player
        router.push(`/learn/lesson/${lessonId}` as any);

        const lesson = unit.lessons.find((l) => l.id === lessonId);
        if (Platform.OS === "ios") {
          AccessibilityInfo.announceForAccessibility(
            `Starting ${unit.title} - ${lesson?.phrase || "lesson"}`
          );
        }
      } else {
        console.log("No lessons available in unit:", unit.title);
      }
    },
    [router, startLesson, getNextLessonInUnit]
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProgressTracker />

        <View style={styles.unitsSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Learning Units
          </ThemedText>

          {mockLessonsData.units.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              onPress={() => handleUnitPress(unit)}
              onActionPress={() => handleUnitPress(unit)}
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
  scrollContent: {
    paddingBottom: 20,
  },
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
  milestoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
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
  unitsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
  },
  unitCard: {
    marginBottom: 16,
  },
  unitCardContent: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderLeftWidth: 4,
  },
  unitHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    position: "relative",
    marginRight: 12,
  },
  unitIcon: {
    fontSize: 32,
  },
  completedBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  completedBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  unitInfo: {
    flex: 1,
  },
  unitTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  unitLevel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    opacity: 0.8,
  },
  unitStats: {
    alignItems: "flex-end",
  },
  progressText: {
    fontSize: 12,
    opacity: 0.8,
    fontWeight: "600",
  },
  lessonsLabel: {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    marginRight: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    opacity: 0.8,
    minWidth: 32,
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  xpIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  xpText: {
    fontSize: 12,
    fontWeight: "600",
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 100,
  },
});
