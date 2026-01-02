import ProfileSubscreenLayout from "@/components/profile/ProfileSubscreenLayout";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";

export default function AppPreferencesScreen() {
  const [darkMode, setDarkMode] = React.useState(true);
  const [soundEffects, setSoundEffects] = React.useState(true);
  const [haptics, setHaptics] = React.useState(true);
  const [offlineDownload, setOfflineDownload] = React.useState(false);

  return (
    <ProfileSubscreenLayout
      title="App Preferences"
      subtitle="Personalize how AfroLingo looks and behaves"
    >
      {/* Appearance Section */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
        <ThemedView style={styles.card}>
          <SettingRow
            icon="moon"
            iconColor="#9B59B6"
            label="Dark Mode"
            description="Use dark theme throughout the app"
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </ThemedView>
      </View>

      {/* Experience Section */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Experience</ThemedText>
        <ThemedView style={styles.card}>
          <SettingRow
            icon="volume-high"
            iconColor="#3498DB"
            label="Sound Effects"
            description="Play sounds for correct/incorrect answers"
            value={soundEffects}
            onValueChange={setSoundEffects}
            showDivider
          />
          <SettingRow
            icon="phone-portrait"
            iconColor="#E74C3C"
            label="Haptic Feedback"
            description="Vibrate on interactions"
            value={haptics}
            onValueChange={setHaptics}
          />
        </ThemedView>
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Data & Storage</ThemedText>
        <ThemedView style={styles.card}>
          <SettingRow
            icon="download"
            iconColor="#27AE60"
            label="Offline Downloads"
            description="Download lessons for offline use"
            value={offlineDownload}
            onValueChange={setOfflineDownload}
          />
        </ThemedView>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={18} color="#E74C3C" />
          <ThemedText style={styles.actionButtonText}>Clear Cache</ThemedText>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>About</ThemedText>
        <ThemedView style={styles.card}>
          <InfoRow label="Version" value="1.0.0" />
          <InfoRow label="Build" value="2026.01" showDivider />
          <InfoRow label="Made with" value="❤️ for language learners" />
        </ThemedView>
      </View>
    </ProfileSubscreenLayout>
  );
}

type SettingRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  showDivider?: boolean;
};

function SettingRow({
  icon,
  iconColor,
  label,
  description,
  value,
  onValueChange,
  showDivider,
}: SettingRowProps) {
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

type InfoRowProps = {
  label: string;
  value: string;
  showDivider?: boolean;
};

function InfoRow({ label, value, showDivider }: InfoRowProps) {
  return (
    <View style={[styles.infoRow, showDivider && styles.rowWithDivider]}>
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
      <ThemedText style={styles.infoValue}>{value}</ThemedText>
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  infoLabel: {
    fontSize: 15,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(231, 76, 60, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(231, 76, 60, 0.3)",
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
    color: "#E74C3C",
  },
});
