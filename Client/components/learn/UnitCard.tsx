import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Unit } from "@/data/lessons";
import React, { useCallback, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
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

export const UnitCard = React.memo<UnitCardProps>(
  ({ unit, onPress, onActionPress }) => {
    const progressWidth = (unit.progress / 100) * (width - 64);
    const scaleAnim = useRef(new Animated.Value(1)).current;

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

const styles = StyleSheet.create({
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
});
