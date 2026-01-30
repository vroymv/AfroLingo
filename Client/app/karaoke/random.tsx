import { KaraokeLyricsModal } from "@/components/learn/practice/KaraokeLyricsModal";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function RandomKaraokeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ language?: string }>();

  const language = params.language ? String(params.language) : null;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <KaraokeLyricsModal
        visible
        mode="random"
        language={language}
        onClose={() => router.back()}
      />
    </View>
  );
}
