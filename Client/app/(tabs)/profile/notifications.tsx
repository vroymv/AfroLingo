import ProfileSubscreenLayout from "@/components/profile/ProfileSubscreenLayout";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";

export default function NotificationsScreen() {
  const [dailyReminder, setDailyReminder] = React.useState(true);
  const [streakAlerts, setStreakAlerts] = React.useState(true);
  const [weeklySummary, setWeeklySummary] = React.useState(false);
  const [achievementUnlocked, setAchievementUnlocked] = React.useState(true);
  const [communityActivity, setCommunityActivity] = React.useState(false);

  return (
    <ProfileSubscreenLayout
      title="Notifications"
      subtitle="Manage reminders and learning nudges"
    >
      {/* Learning Reminders */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Learning Reminders</ThemedText>
        <ThemedView style={styles.card}>
          <NotificationRow
            icon="alarm"
            iconColor="#F39C12"
            label="Daily Reminder"
            description="Get reminded to practice every day"
            value={dailyReminder}
            onValueChange={setDailyReminder}
            showDivider
          />
          <NotificationRow
            icon="flame"
            iconColor="#E74C3C"
            label="Streak Protection"
            description="Alert when your streak is at risk"
            value={streakAlerts}
            onValueChange={setStreakAlerts}
          />
        </ThemedView>
        {dailyReminder && (
          <TouchableOpacity style={styles.timeButton} activeOpacity={0.7}>
            <ThemedText style={styles.timeButtonText}>
              ⏰ Remind me at 9:00 AM
            </ThemedText>
            <Ionicons name="chevron-forward" size={16} color="#4A90E2" />
          </TouchableOpacity>
        )}
      </View>

      {/* Progress Updates */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Progress Updates</ThemedText>
        <ThemedView style={styles.card}>
          <NotificationRow
            icon="trophy"
            iconColor="#F1C40F"
            label="Achievement Unlocked"
            description="Celebrate your milestones"
            value={achievementUnlocked}
            onValueChange={setAchievementUnlocked}
            showDivider
          />
          <NotificationRow
            icon="stats-chart"
            iconColor="#3498DB"
            label="Weekly Summary"
            description="Review your progress every Sunday"
            value={weeklySummary}
            onValueChange={setWeeklySummary}
          />
        </ThemedView>
      </View>

      {/* Social */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Social</ThemedText>
        <ThemedView style={styles.card}>
          <NotificationRow
            icon="people"
            iconColor="#9B59B6"
            label="Community Activity"
            description="Replies, mentions, and friend updates"
            value={communityActivity}
            onValueChange={setCommunityActivity}
          />
        </ThemedView>
      </View>
    </ProfileSubscreenLayout>
  );
}

type NotificationRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  showDivider?: boolean;
};

function NotificationRow({
  icon,
  iconColor,
  label,
  description,
  value,
  onValueChange,
  showDivider,
}: NotificationRowProps) {
  return (
    <View style={[styles.row, showDivider && styles.rowWithDivider]}>
      <View style={[styles.iconBox, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.rowContent}>
        <ThemedText style={styles.rowLabel}>{label}</ThemedText>
        <ThemedText style={styles.rowDescription}>{description}</ThemedText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#767577", true: iconColor }}
        thumbColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    opacity: 0.6,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  rowWithDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rowContent: {
    flex: 1,
    marginLeft: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  rowDescription: {
    fontSize: 13,
    opacity: 0.6,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(74, 144, 226, 0.3)",
  },
  timeButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4A90E2",
  },
});
