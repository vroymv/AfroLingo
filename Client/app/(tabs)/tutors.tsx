import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import type { Tutor } from "@/types/Tutor";
import { BecomeTutorCTA } from "@/components/tutors/BecomeTutorCTA";
import { TutorSearchBar } from "@/components/tutors/TutorSearchBar";
import { TutorLanguageFilter } from "@/components/tutors/TutorLanguageFilter";
import { TutorCard } from "@/components/tutors/TutorCard";
import { BecomeTutorModal } from "@/components/tutors/BecomeTutorModal";
import { useAuth } from "@/contexts/AuthContext";
import { fetchTutors } from "@/services/tutors";

export default function TutorsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const { user } = useAuth();

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isBecomeTutorModalVisible, setIsBecomeTutorModalVisible] =
    useState(false);

  const loadTutors = useCallback(async () => {
    setError(null);
    const res = await fetchTutors();

    if (!res.success) {
      setTutors([]);
      setError(res.message ?? "Failed to fetch tutors");
      return;
    }

    setTutors(res.data ?? []);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        await loadTutors();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadTutors]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadTutors();
    } finally {
      setRefreshing(false);
    }
  }, [loadTutors]);

  const languages = useMemo(
    () => Array.from(new Set(tutors.map((t) => t.language))).sort(),
    [tutors]
  );

  const filteredTutors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tutors.filter((tutor) => {
      if (selectedLanguage && tutor.language !== selectedLanguage) return false;

      if (!normalizedQuery) return true;
      return (
        tutor.name.toLowerCase().includes(normalizedQuery) ||
        tutor.language.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, selectedLanguage, tutors]);

  const handleChat = (tutor: Tutor) => {
    console.log(`Starting chat with ${tutor.name}`);
    // Navigate to chat screen
  };

  const handleBecomeTutor = () => {
    setIsBecomeTutorModalVisible(true);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Find a Tutor 👨‍🏫</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Connect with native speakers and expert teachers
        </ThemedText>
      </View>

      <BecomeTutorCTA colorScheme={colorScheme} onPress={handleBecomeTutor} />

      <BecomeTutorModal
        visible={isBecomeTutorModalVisible}
        onClose={() => setIsBecomeTutorModalVisible(false)}
        initialDraft={`Hi Customer Service, I'd like to become a tutor. My user id is ${
          user?.id ?? "guest"
        }.`}
      />

      <TutorSearchBar
        value={query}
        onChangeText={setQuery}
        onClear={() => setQuery("")}
      />

      <TutorLanguageFilter
        colorScheme={colorScheme}
        languages={languages}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
      />

      {/* Tutors List */}
      <ScrollView
        style={styles.tutorsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tutorsListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ThemedText style={styles.stateText}>Loading tutors…</ThemedText>
        ) : error ? (
          <ThemedText style={styles.stateText}>{error}</ThemedText>
        ) : filteredTutors.length === 0 ? (
          <ThemedText style={styles.stateText}>No tutors found.</ThemedText>
        ) : (
          filteredTutors.map((tutor) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              colorScheme={colorScheme}
              onChat={handleChat}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.7,
  },
  tutorsList: {
    flex: 1,
  },
  tutorsListContent: {
    padding: 20,
    paddingTop: 8,
  },
  stateText: {
    paddingVertical: 12,
    opacity: 0.7,
  },
});
