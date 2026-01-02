import ProfileSubscreenLayout from "@/components/profile/ProfileSubscreenLayout";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, View } from "react-native";

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
      <View style={styles.screenContent}>
        <View>
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
                disabled
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
                disabled
              />
              <SettingRow
                icon="phone-portrait"
                iconColor="#E74C3C"
                label="Haptic Feedback"
                description="Vibrate on interactions"
                value={haptics}
                onValueChange={setHaptics}
                disabled
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
                disabled
              />
            </ThemedView>
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.section, styles.aboutSection]}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          <ThemedView style={styles.card}>
            <InfoRow label="Version" value="1.0.0" />
            <InfoRow label="Build" value="2026.01" showDivider />
            <InfoRow label="Made with" value="❤️ for language learners" />
          </ThemedView>
        </View>
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
  disabled?: boolean;
};

function SettingRow({
  icon,
  iconColor,
  label,
  description,
  value,
  onValueChange,
  showDivider,
  disabled,
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
        disabled={disabled}
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
  screenContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  section: {
    marginBottom: 4,
  },
  aboutSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 10,
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
    padding: 12,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});
