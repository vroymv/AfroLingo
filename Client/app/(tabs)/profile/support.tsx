import ProfileSubscreenLayout from "@/components/profile/ProfileSubscreenLayout";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";

const SUPPORT_EMAIL = "support@afrolingo.com";
const FAQ_URL = "https://afrolingo.com/faq";
const COMMUNITY_URL = "https://community.afrolingo.com";

export default function HelpSupportScreen() {
  const handleEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  };

  const handleFAQ = () => {
    Linking.openURL(FAQ_URL);
  };

  const handleCommunity = () => {
    Linking.openURL(COMMUNITY_URL);
  };

  return (
    <ProfileSubscreenLayout title="Help & Support" subtitle="Get help quickly">
      {/* Quick Actions */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Quick Help</ThemedText>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionCard}
            activeOpacity={0.7}
            onPress={handleFAQ}
          >
            <View style={[styles.quickIcon, { backgroundColor: "#3498DB20" }]}>
              <Ionicons name="help-circle" size={28} color="#3498DB" />
            </View>
            <ThemedText style={styles.quickActionLabel}>FAQ</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            activeOpacity={0.7}
            onPress={handleEmail}
          >
            <View style={[styles.quickIcon, { backgroundColor: "#E74C3C20" }]}>
              <Ionicons name="mail" size={28} color="#E74C3C" />
            </View>
            <ThemedText style={styles.quickActionLabel}>Email Us</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            activeOpacity={0.7}
            onPress={handleCommunity}
          >
            <View style={[styles.quickIcon, { backgroundColor: "#9B59B620" }]}>
              <Ionicons name="people" size={28} color="#9B59B6" />
            </View>
            <ThemedText style={styles.quickActionLabel}>Community</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Help Resources */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Help Resources</ThemedText>
        <ThemedView style={styles.card}>
          <HelpRow
            icon="book"
            iconColor="#27AE60"
            label="Getting Started Guide"
            description="Learn the basics of AfroLingo"
            showDivider
          />
          <HelpRow
            icon="school"
            iconColor="#F39C12"
            label="Learning Tips"
            description="Make the most of your lessons"
            showDivider
          />
          <HelpRow
            icon="videocam"
            iconColor="#E74C3C"
            label="Video Tutorials"
            description="Watch how-to videos"
          />
        </ThemedView>
      </View>

      {/* Contact & Feedback */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Contact & Feedback</ThemedText>
        <ThemedView style={styles.card}>
          <HelpRow
            icon="chatbubbles"
            iconColor="#3498DB"
            label="Live Chat"
            description="Chat with our support team"
            showDivider
          />
          <HelpRow
            icon="bug"
            iconColor="#E74C3C"
            label="Report a Bug"
            description="Help us fix issues"
            showDivider
          />
          <HelpRow
            icon="bulb"
            iconColor="#F1C40F"
            label="Feature Request"
            description="Suggest new features"
          />
        </ThemedView>
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>AfroLingo v1.0.0</ThemedText>
        <ThemedText style={styles.footerText}>
          Made with ❤️ for language learners
        </ThemedText>
      </View>
    </ProfileSubscreenLayout>
  );
}

type HelpRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  description: string;
  showDivider?: boolean;
};

function HelpRow({
  icon,
  iconColor,
  label,
  description,
  showDivider,
}: HelpRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, showDivider && styles.rowWithDivider]}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.rowContent}>
        <ThemedText style={styles.rowLabel}>{label}</ThemedText>
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
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: "600",
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
