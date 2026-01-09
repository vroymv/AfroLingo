import LessonHeader from "@/components/learn/lesson/LessonHeader";
import LessonTitleCard from "@/components/learn/lesson/LessonTitleCard";
import PracticeActivityRenderer from "@/components/learn/practicePlayer/PracticeActivityRenderer";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { LessonRuntimeProvider } from "@/contexts/LessonRuntimeContext";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PracticeActivityScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    activityId?: string;
    componentKey?: string;
    type?: string;
    contentRef?: string;
    title?: string;
    subtitle?: string;
  }>();

  const activityId = params.activityId ? String(params.activityId) : null;

  const activity = useMemo(() => {
    if (!activityId) return null;
    return {
      id: activityId,
      componentKey: params.componentKey
        ? String(params.componentKey)
        : undefined,
      type: params.type ? String(params.type) : undefined,
      contentRef: params.contentRef ? String(params.contentRef) : undefined,
    };
  }, [activityId, params.componentKey, params.contentRef, params.type]);

  const title = params.title ? String(params.title) : "Practice";
  const subtitle = params.subtitle ? String(params.subtitle) : "";

  if (!activityId || !activity) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>No practice activity selected.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <LessonHeader
        unitTitle={"Practice"}
        currentActivity={1}
        totalActivities={1}
        onClose={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LessonTitleCard phrase={title} meaning={subtitle} />

        <View style={styles.body}>
          <LessonRuntimeProvider
            value={{
              userId: user?.id ?? null,
              unitId: `practice:${activity.id}`,
              currentActivityNumber: 1,
              totalActivities: 1,
            }}
          >
            <PracticeActivityRenderer
              activity={activity}
              title={title}
              onActivityComplete={() => router.back()}
            />
          </LessonRuntimeProvider>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  body: {
    paddingHorizontal: 20,
    minHeight: 400,
  },
});
