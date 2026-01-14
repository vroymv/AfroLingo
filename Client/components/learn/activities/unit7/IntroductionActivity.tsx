import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Activity } from "@/data/lessons";
import { getUnit7ActivityByRef } from "@/data/unit7/colorsContent";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  useCompletionXP,
  useLessonProgressReporter,
} from "@/components/learn/activities/unit3/useLessonProgressXP";
import { UNIT_7_THEME } from "./constants";

interface Props {
  activity: Activity & { contentRef?: string };
  onComplete: () => void;
}

export default function Unit7IntroductionActivity({
  activity,
  onComplete,
}: Props) {
  useLessonProgressReporter();
  const { award } = useCompletionXP(10, "unit7-intro");

  const content = useMemo(
    () => getUnit7ActivityByRef(activity.contentRef || activity.id),
    [activity.contentRef, activity.id]
  );

  const title = "Colors";
  const subtitle = "Rangi";

  const message =
    (content as any)?.question?.toString?.() ||
    activity.question ||
    "Let’s learn colors you’ll use every day.";

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconRing}>
          <Ionicons
            name="color-palette"
            size={56}
            color={UNIT_7_THEME.primary}
          />
        </View>

        <ThemedText type="title" style={styles.heading}>
          {title}
        </ThemedText>
        <ThemedText style={styles.subheading}>{subtitle}</ThemedText>

        <ThemedText style={styles.message}>{message}</ThemedText>

        <View style={styles.bullets}>
          <View style={styles.bulletRow}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={UNIT_7_THEME.primary}
            />
            <ThemedText style={styles.bulletText}>
              Learn the core color words
            </ThemedText>
          </View>
          <View style={styles.bulletRow}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={UNIT_7_THEME.primary}
            />
            <ThemedText style={styles.bulletText}>
              Practice with quizzes, matching, and spelling
            </ThemedText>
          </View>
          <View style={styles.bulletRow}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={UNIT_7_THEME.primary}
            />
            <ThemedText style={styles.bulletText}>
              Use colors in short conversations
            </ThemedText>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Ionicons
            name="sparkles"
            size={18}
            color={UNIT_7_THEME.primaryDark}
          />
          <ThemedText style={styles.tipText}>
            Tip: “Rangi ya …” means “the color of …”.
          </ThemedText>
        </View>
      </View>

      <TouchableOpacity
        style={styles.cta}
        onPress={async () => {
          await award({
            screen: "Unit7IntroductionActivity",
            reason: "start_lesson",
            contentRef: activity.contentRef,
          });
          onComplete();
        }}
        activeOpacity={0.9}
      >
        <ThemedText style={styles.ctaText}>Let’s start</ThemedText>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

export const componentKey = "unit7-introduction";

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingVertical: 24,
    minHeight: 440,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12,
  },
  iconRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: UNIT_7_THEME.tint,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(233, 30, 99, 0.28)",
  },
  heading: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "800",
  },
  subheading: {
    opacity: 0.75,
    fontWeight: "700",
  },
  message: {
    fontSize: 17,
    textAlign: "center",
    lineHeight: 25,
    opacity: 0.85,
    paddingHorizontal: 6,
  },
  bullets: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 10,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    opacity: 0.82,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFF1F2",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(233, 30, 99, 0.25)",
  },
  tipText: {
    fontSize: 14,
    opacity: 0.85,
    flex: 1,
  },
  cta: {
    backgroundColor: UNIT_7_THEME.primary,
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    shadowColor: UNIT_7_THEME.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaText: {
    color: "white",
    fontSize: 17,
    fontWeight: "800",
  },
});
