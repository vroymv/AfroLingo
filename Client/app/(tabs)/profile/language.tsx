import ProfileSubscreenLayout from "@/components/profile/ProfileSubscreenLayout";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const AVAILABLE_LANGUAGES = [
  { code: "sw", name: "Swahili", flag: "🇹🇿", color: "#27AE60" },
  { code: "zu", name: "Zulu", flag: "🇿🇦", color: "#3498DB" },
  { code: "ln", name: "Lingala", flag: "🇨🇩", color: "#E74C3C" },
  { code: "xh", name: "Xhosa", flag: "🇿🇦", color: "#F39C12" },
  { code: "yo", name: "Yoruba", flag: "🇳🇬", color: "#9B59B6" },
  { code: "ig", name: "Igbo", flag: "🇳🇬", color: "#1ABC9C" },
];

const UI_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

export default function LanguageSettingsScreen() {
  const [currentLanguage] = React.useState("sw");
  const [uiLanguage] = React.useState("en");

  const currentLang = AVAILABLE_LANGUAGES.find(
    (lang) => lang.code === currentLanguage
  );

  return (
    <ProfileSubscreenLayout
      title="Language Settings"
      subtitle="Learning language and app language"
    >
      {/* Current Learning Language */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Learning Language</ThemedText>
        <ThemedView style={styles.currentCard}>
          <View style={styles.currentLanguageContent}>
            <View
              style={[
                styles.currentIcon,
                { backgroundColor: `${currentLang?.color}20` },
              ]}
            >
              <ThemedText style={styles.flag}>{currentLang?.flag}</ThemedText>
            </View>
            <View style={styles.currentInfo}>
              <ThemedText style={styles.currentLabel}>
                Currently Learning
              </ThemedText>
              <ThemedText style={styles.currentName}>
                {currentLang?.name}
              </ThemedText>
            </View>
          </View>
        </ThemedView>
        <TouchableOpacity style={styles.changeButton} activeOpacity={0.7}>
          <Ionicons name="swap-horizontal" size={18} color="#4A90E2" />
          <ThemedText style={styles.changeButtonText}>
            Change Learning Language
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Available Languages */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Available Languages</ThemedText>
        <ThemedView style={styles.card}>
          {AVAILABLE_LANGUAGES.map((lang, index) => (
            <LanguageRow
              key={lang.code}
              flag={lang.flag}
              name={lang.name}
              color={lang.color}
              isActive={lang.code === currentLanguage}
              showDivider={index < AVAILABLE_LANGUAGES.length - 1}
            />
          ))}
        </ThemedView>
      </View>

      {/* App Language */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>App Language</ThemedText>
        <ThemedView style={styles.card}>
          {UI_LANGUAGES.map((lang, index) => (
            <UILanguageRow
              key={lang.code}
              flag={lang.flag}
              name={lang.name}
              isActive={lang.code === uiLanguage}
              showDivider={index < UI_LANGUAGES.length - 1}
            />
          ))}
        </ThemedView>
      </View>
    </ProfileSubscreenLayout>
  );
}

type LanguageRowProps = {
  flag: string;
  name: string;
  color: string;
  isActive: boolean;
  showDivider?: boolean;
};

function LanguageRow({
  flag,
  name,
  color,
  isActive,
  showDivider,
}: LanguageRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, showDivider && styles.rowWithDivider]}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}>
        <ThemedText style={styles.languageFlag}>{flag}</ThemedText>
      </View>
      <ThemedText style={styles.languageName}>{name}</ThemedText>
      {isActive && <Ionicons name="checkmark-circle" size={22} color={color} />}
    </TouchableOpacity>
  );
}

type UILanguageRowProps = {
  flag: string;
  name: string;
  isActive: boolean;
  showDivider?: boolean;
};

function UILanguageRow({
  flag,
  name,
  isActive,
  showDivider,
}: UILanguageRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, showDivider && styles.rowWithDivider]}
      activeOpacity={0.7}
    >
      <ThemedText style={styles.uiFlag}>{flag}</ThemedText>
      <ThemedText style={styles.languageName}>{name}</ThemedText>
      {isActive && (
        <Ionicons name="checkmark-circle" size={22} color="#4A90E2" />
      )}
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
  currentCard: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    borderWidth: 2,
    borderColor: "rgba(74, 144, 226, 0.3)",
  },
  currentLanguageContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  flag: {
    fontSize: 32,
  },
  currentInfo: {
    marginLeft: 16,
  },
  currentLabel: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 4,
  },
  currentName: {
    fontSize: 20,
    fontWeight: "700",
  },
  changeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(74, 144, 226, 0.3)",
  },
  changeButtonText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
    color: "#4A90E2",
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
    width: 44,
    height: 44,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  languageFlag: {
    fontSize: 24,
  },
  uiFlag: {
    fontSize: 28,
    marginRight: 12,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
});
