import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";

export default function SafetyScreen() {
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  const safetyFeatures = [
    {
      id: "1",
      icon: "🛡️",
      title: "Content Moderation",
      description: "AI-powered detection of inappropriate content",
      status: "Active",
    },
    {
      id: "2",
      icon: "🚫",
      title: "Block Users",
      description: "Manage your blocked users list",
      status: "Available",
    },
    {
      id: "3",
      icon: "📢",
      title: "Report Content",
      description: "Flag inappropriate posts or behavior",
      status: "Available",
    },
    {
      id: "4",
      icon: "🔒",
      title: "Privacy Controls",
      description: "Control who can see your profile and activity",
      status: "Active",
    },
  ];

  const communityGuidelines = [
    {
      id: "1",
      emoji: "🤝",
      title: "Be Respectful",
      description:
        "Treat all community members with kindness and respect. No harassment, hate speech, or discrimination.",
    },
    {
      id: "2",
      emoji: "📚",
      title: "Stay On Topic",
      description:
        "Keep discussions relevant to language learning and cultural exchange.",
    },
    {
      id: "3",
      emoji: "🚫",
      title: "No Spam",
      description:
        "Avoid posting repetitive content, advertisements, or irrelevant links.",
    },
    {
      id: "4",
      emoji: "🔒",
      title: "Protect Privacy",
      description:
        "Don't share personal information of yourself or others without consent.",
    },
    {
      id: "5",
      emoji: "✅",
      title: "Be Authentic",
      description:
        "Use your real learning journey. No cheating or misrepresenting your progress.",
    },
    {
      id: "6",
      emoji: "💬",
      title: "Use Appropriate Language",
      description:
        "Keep conversations family-friendly and professional. No profanity or explicit content.",
    },
  ];

  const reportReasons = [
    "Harassment or Bullying",
    "Inappropriate Content",
    "Spam or Advertising",
    "Hate Speech",
    "False Information",
    "Privacy Violation",
    "Other",
  ];

  const trustedMembers = [
    {
      id: "1",
      name: "Sarah Community Manager",
      avatar: "👩🏽‍💼",
      role: "Community Manager",
      badge: "🛡️",
    },
    {
      id: "2",
      name: "David Moderator",
      avatar: "👨🏿‍🏫",
      role: "Moderator",
      badge: "⚖️",
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title">Safety & Trust 🛡️</ThemedText>
          <ThemedText type="subtitle">
            Your security is our priority
          </ThemedText>
        </ThemedView>

        {/* Safety Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <ThemedText style={styles.statusIcon}>✅</ThemedText>
            <View style={styles.statusInfo}>
              <ThemedText type="defaultSemiBold" style={styles.statusTitle}>
                Community Status: Safe
              </ThemedText>
              <ThemedText style={styles.statusDescription}>
                All systems are monitoring and active
              </ThemedText>
            </View>
          </View>
          <View style={styles.statusStats}>
            <View style={styles.statusStat}>
              <ThemedText style={styles.statusNumber}>99.8%</ThemedText>
              <ThemedText style={styles.statusLabel}>Safety Score</ThemedText>
            </View>
            <View style={styles.statusStat}>
              <ThemedText style={styles.statusNumber}>24/7</ThemedText>
              <ThemedText style={styles.statusLabel}>Monitoring</ThemedText>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowReportModal(true)}
            >
              <ThemedText style={styles.actionIcon}>📢</ThemedText>
              <ThemedText style={styles.actionText}>
                Report Content
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <ThemedText style={styles.actionIcon}>🚫</ThemedText>
              <ThemedText style={styles.actionText}>
                Blocked Users
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowGuidelinesModal(true)}
            >
              <ThemedText style={styles.actionIcon}>📖</ThemedText>
              <ThemedText style={styles.actionText}>Guidelines</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety Features */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Safety Features
          </ThemedText>
          {safetyFeatures.map((feature) => (
            <TouchableOpacity key={feature.id} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <ThemedText style={styles.featureEmoji}>
                  {feature.icon}
                </ThemedText>
              </View>
              <View style={styles.featureInfo}>
                <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
                  {feature.title}
                </ThemedText>
                <ThemedText style={styles.featureDescription}>
                  {feature.description}
                </ThemedText>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  feature.status === "Active" && styles.activeBadge,
                ]}
              >
                <ThemedText
                  style={[
                    styles.statusBadgeText,
                    feature.status === "Active" && styles.activeBadgeText,
                  ]}
                >
                  {feature.status}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Community Guidelines Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Community Guidelines
            </ThemedText>
            <TouchableOpacity onPress={() => setShowGuidelinesModal(true)}>
              <ThemedText style={styles.viewAllText}>View All</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.guidelinesPreview}>
            {communityGuidelines.slice(0, 3).map((guideline) => (
              <View key={guideline.id} style={styles.guidelineItem}>
                <ThemedText style={styles.guidelineEmoji}>
                  {guideline.emoji}
                </ThemedText>
                <View style={styles.guidelineContent}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.guidelineTitle}
                  >
                    {guideline.title}
                  </ThemedText>
                  <ThemedText style={styles.guidelineDescription}>
                    {guideline.description}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Trusted Members */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Trusted Community Team
          </ThemedText>
          {trustedMembers.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <ThemedText style={styles.memberAvatar}>
                {member.avatar}
              </ThemedText>
              <View style={styles.memberInfo}>
                <View style={styles.memberNameRow}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.memberName}
                  >
                    {member.name}
                  </ThemedText>
                  <ThemedText style={styles.memberBadge}>
                    {member.badge}
                  </ThemedText>
                </View>
                <ThemedText style={styles.memberRole}>{member.role}</ThemedText>
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <ThemedText style={styles.contactButtonText}>
                  Contact
                </ThemedText>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* AI Moderation Info */}
        <View style={styles.aiCard}>
          <ThemedText style={styles.aiIcon}>🤖</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.aiTitle}>
            AI-Powered Moderation
          </ThemedText>
          <ThemedText style={styles.aiDescription}>
            Our advanced AI system monitors content 24/7 to detect and prevent
            inappropriate behavior, ensuring a safe learning environment for
            everyone.
          </ThemedText>
          <View style={styles.aiStats}>
            <View style={styles.aiStat}>
              <ThemedText style={styles.aiStatNumber}>95%</ThemedText>
              <ThemedText style={styles.aiStatLabel}>Accuracy</ThemedText>
            </View>
            <View style={styles.aiStat}>
              <ThemedText style={styles.aiStatNumber}>&lt;1s</ThemedText>
              <ThemedText style={styles.aiStatLabel}>Response Time</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Community Guidelines Modal */}
      <Modal
        visible={showGuidelinesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGuidelinesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText type="title">Community Guidelines 📖</ThemedText>
              <TouchableOpacity
                onPress={() => setShowGuidelinesModal(false)}
              >
                <ThemedText style={styles.closeButton}>✕</ThemedText>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {communityGuidelines.map((guideline) => (
                <View key={guideline.id} style={styles.modalGuidelineItem}>
                  <ThemedText style={styles.modalGuidelineEmoji}>
                    {guideline.emoji}
                  </ThemedText>
                  <View style={styles.modalGuidelineContent}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.modalGuidelineTitle}
                    >
                      {guideline.title}
                    </ThemedText>
                    <ThemedText style={styles.modalGuidelineDescription}>
                      {guideline.description}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowGuidelinesModal(false)}
            >
              <ThemedText style={styles.modalButtonText}>
                I Understand
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Report Modal */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText type="title">Report Content 📢</ThemedText>
              <TouchableOpacity onPress={() => setShowReportModal(false)}>
                <ThemedText style={styles.closeButton}>✕</ThemedText>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <ThemedText style={styles.modalLabel}>
                Reason for Report
              </ThemedText>
              {reportReasons.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reasonOption,
                    reportReason === reason && styles.reasonOptionSelected,
                  ]}
                  onPress={() => setReportReason(reason)}
                >
                  <ThemedText
                    style={[
                      styles.reasonText,
                      reportReason === reason && styles.reasonTextSelected,
                    ]}
                  >
                    {reason}
                  </ThemedText>
                  {reportReason === reason && (
                    <ThemedText style={styles.checkmark}>✓</ThemedText>
                  )}
                </TouchableOpacity>
              ))}
              <ThemedText style={styles.modalLabel}>
                Additional Details (Optional)
              </ThemedText>
              <TextInput
                style={styles.textArea}
                placeholder="Describe the issue..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                multiline
                numberOfLines={4}
                value={reportDescription}
                onChangeText={setReportDescription}
              />
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowReportModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !reportReason && styles.submitButtonDisabled,
                ]}
                disabled={!reportReason}
                onPress={() => {
                  // Simulated report submission
                  setShowReportModal(false);
                  setReportReason("");
                  setReportDescription("");
                }}
              >
                <ThemedText style={styles.submitButtonText}>
                  Submit Report
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  statusCard: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statusIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 13,
    opacity: 0.8,
  },
  statusStats: {
    flexDirection: "row",
    gap: 20,
  },
  statusStat: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
    borderRadius: 12,
  },
  statusNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#22c55e",
  },
  statusLabel: {
    fontSize: 11,
    opacity: 0.7,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: "#0096FF",
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(156, 163, 175, 0.2)",
  },
  activeBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  activeBadgeText: {
    color: "#22c55e",
  },
  guidelinesPreview: {
    gap: 12,
  },
  guidelineItem: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  guidelineEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  guidelineContent: {
    flex: 1,
  },
  guidelineTitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  guidelineDescription: {
    fontSize: 13,
    opacity: 0.8,
    lineHeight: 18,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  memberAvatar: {
    fontSize: 40,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  memberName: {
    fontSize: 16,
    marginRight: 8,
  },
  memberBadge: {
    fontSize: 16,
  },
  memberRole: {
    fontSize: 13,
    opacity: 0.7,
  },
  contactButton: {
    backgroundColor: "#0096FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "white",
  },
  aiCard: {
    backgroundColor: "rgba(0, 150, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 150, 255, 0.3)",
    alignItems: "center",
  },
  aiIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  aiDescription: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  aiStats: {
    flexDirection: "row",
    gap: 20,
    width: "100%",
  },
  aiStat: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
    borderRadius: 12,
  },
  aiStatNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0096FF",
  },
  aiStatLabel: {
    fontSize: 11,
    opacity: 0.7,
    marginTop: 4,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  closeButton: {
    fontSize: 28,
    color: "#999",
    fontWeight: "300",
  },
  modalBody: {
    padding: 20,
  },
  modalGuidelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  modalGuidelineEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  modalGuidelineContent: {
    flex: 1,
  },
  modalGuidelineTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  modalGuidelineDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  modalButton: {
    margin: 20,
    backgroundColor: "#0096FF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
  reasonOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  reasonOptionSelected: {
    backgroundColor: "rgba(0, 150, 255, 0.2)",
    borderColor: "#0096FF",
  },
  reasonText: {
    fontSize: 15,
  },
  reasonTextSelected: {
    fontWeight: "600",
    color: "#0096FF",
  },
  checkmark: {
    fontSize: 18,
    color: "#0096FF",
  },
  textArea: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: "white",
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#0096FF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "rgba(0, 150, 255, 0.3)",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
