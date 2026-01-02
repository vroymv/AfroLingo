import ProfileSubscreenLayout from "@/components/profile/ProfileSubscreenLayout";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";

export default function PrivacySecurityScreen() {
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(true);
  const [profileVisible, setProfileVisible] = React.useState(true);
  const [activityVisible, setActivityVisible] = React.useState(false);

  return (
    <ProfileSubscreenLayout
      title="Privacy & Security"
      subtitle="Control your data and account safety"
    >
      {/* Security Actions */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Security</ThemedText>
        <ThemedView style={styles.card}>
          <ActionRow
            icon="lock-closed"
            iconColor="#E74C3C"
            label="Change Password"
            description="Update your account password"
            showDivider
          />
          <ActionRow
            icon="shield-checkmark"
            iconColor="#27AE60"
            label="Two-Factor Authentication"
            description="Add an extra layer of security"
            showDivider
          />
          <ActionRow
            icon="phone-portrait"
            iconColor="#3498DB"
            label="Active Sessions"
            description="Manage devices with access"
          />
        </ThemedView>
      </View>

      {/* Privacy Controls */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Privacy</ThemedText>
        <ThemedView style={styles.card}>
          <PrivacyRow
            icon="analytics"
            iconColor="#9B59B6"
            label="Analytics"
            description="Help us improve with usage data"
            value={analyticsEnabled}
            onValueChange={setAnalyticsEnabled}
            showDivider
          />
          <PrivacyRow
            icon="eye"
            iconColor="#F39C12"
            label="Public Profile"
            description="Let others see your profile"
            value={profileVisible}
            onValueChange={setProfileVisible}
            showDivider
          />
          <PrivacyRow
            icon="stats-chart"
            iconColor="#1ABC9C"
            label="Activity Status"
            description="Show when you're learning"
            value={activityVisible}
            onValueChange={setActivityVisible}
          />
        </ThemedView>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Data Management</ThemedText>
        <ThemedView style={styles.card}>
          <ActionRow
            icon="download-outline"
            iconColor="#3498DB"
            label="Export My Data"
            description="Download all your learning data"
            showDivider
          />
          <ActionRow
            icon="trash-outline"
            iconColor="#E74C3C"
            label="Delete Account"
            description="Permanently remove your account"
            isDanger
          />
        </ThemedView>
      </View>

      {/* Last Updated */}
      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Privacy Policy · Terms of Service
        </ThemedText>
        <ThemedText style={styles.footerText}>Updated Jan 2026</ThemedText>
      </View>
    </ProfileSubscreenLayout>
  );
}

type ActionRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  description: string;
  showDivider?: boolean;
  isDanger?: boolean;
};

function ActionRow({
  icon,
  iconColor,
  label,
  description,
  showDivider,
  isDanger,
}: ActionRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, showDivider && styles.rowWithDivider]}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.rowContent}>
        <ThemedText style={[styles.rowLabel, isDanger && styles.dangerLabel]}>
          {label}
        </ThemedText>
        <ThemedText style={styles.rowDescription}>{description}</ThemedText>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color="rgba(255, 255, 255, 0.3)"
      />
    </TouchableOpacity>
  );
}

type PrivacyRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  showDivider?: boolean;
};

function PrivacyRow({
  icon,
  iconColor,
  label,
  description,
  value,
  onValueChange,
  showDivider,
}: PrivacyRowProps) {
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
  dangerLabel: {
    color: "#E74C3C",
  },
  rowDescription: {
    fontSize: 13,
    opacity: 0.6,
  },
  footer: {
    marginTop: 8,
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.5,
  },
});
