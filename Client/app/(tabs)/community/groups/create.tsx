import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useGroupsStore } from "@/contexts/community/GroupsContext";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type GroupType = "public" | "private";

export default function CreateGroupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const { createGroup } = useGroupsStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<GroupType>("public");
  const [touched, setTouched] = useState(false);

  const canSubmit = useMemo(() => {
    return name.trim().length > 1 && language.trim().length > 1;
  }, [language, name]);

  const subtleBg = `${colors.icon}10`;
  const borderColor = `${colors.icon}20`;

  const onSubmit = () => {
    setTouched(true);
    if (!canSubmit) return;

    const id = createGroup({
      name: name.trim(),
      description:
        description.trim() || "A new group created by the community.",
      language: language.trim(),
      type,
      category: category.trim() || "Study Group",
    });

    router.replace({
      pathname: "/community/groups/[groupId]",
      params: { groupId: id },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            borderBottomColor: `${colors.icon}20`,
            backgroundColor: colors.background,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <ThemedText style={styles.headerIconText}>←</ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.headerTitle}>Create Group</ThemedText>

        <View style={styles.headerIcon} />
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: subtleBg, borderColor }]}>
          <ThemedText style={styles.label}>Name</ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Yoruba Warriors"
            placeholderTextColor={colors.icon}
            style={[styles.input, { color: colors.text }]}
            autoCapitalize="words"
          />
        </View>

        <View style={[styles.card, { backgroundColor: subtleBg, borderColor }]}>
          <ThemedText style={styles.label}>Language</ThemedText>
          <TextInput
            value={language}
            onChangeText={setLanguage}
            placeholder="e.g. Yoruba"
            placeholderTextColor={colors.icon}
            style={[styles.input, { color: colors.text }]}
            autoCapitalize="words"
          />
        </View>

        <View style={[styles.card, { backgroundColor: subtleBg, borderColor }]}>
          <ThemedText style={styles.label}>Category</ThemedText>
          <TextInput
            value={category}
            onChangeText={setCategory}
            placeholder="e.g. Study Group"
            placeholderTextColor={colors.icon}
            style={[styles.input, { color: colors.text }]}
            autoCapitalize="words"
          />
        </View>

        <View style={[styles.card, { backgroundColor: subtleBg, borderColor }]}>
          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What is this group about?"
            placeholderTextColor={colors.icon}
            style={[styles.input, styles.textArea, { color: colors.text }]}
            multiline
          />
        </View>

        <View style={styles.typeRow}>
          <ThemedText style={styles.typeLabel}>Type</ThemedText>
          <View style={styles.typePills}>
            {(
              [
                { key: "public" as const, label: "🔓 Public" },
                { key: "private" as const, label: "🔒 Private" },
              ] as const
            ).map((opt) => {
              const active = opt.key === type;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setType(opt.key)}
                  activeOpacity={0.85}
                  style={[
                    styles.typePill,
                    {
                      backgroundColor: active
                        ? `${colors.tint}22`
                        : `${colors.icon}12`,
                      borderColor: active ? `${colors.tint}55` : "transparent",
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.typePillText,
                      active
                        ? { color: colors.tint, opacity: 1 }
                        : { opacity: 0.75 },
                    ]}
                  >
                    {opt.label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {touched && !canSubmit ? (
          <ThemedText style={styles.errorText}>
            Please add a group name and language.
          </ThemedText>
        ) : null}

        <TouchableOpacity
          onPress={onSubmit}
          activeOpacity={0.85}
          style={[
            styles.submit,
            {
              backgroundColor: canSubmit ? colors.tint : `${colors.icon}22`,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.submitText,
              {
                color: canSubmit ? colors.background : colors.text,
                opacity: canSubmit ? 1 : 0.5,
              },
            ]}
          >
            Create
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconText: {
    fontSize: 18,
    fontWeight: "800",
    opacity: 0.8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    opacity: 0.7,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  input: {
    fontSize: 16,
    paddingVertical: 0,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  typeRow: {
    paddingTop: 4,
    gap: 8,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: "800",
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  typePills: {
    flexDirection: "row",
    gap: 10,
  },
  typePill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  typePillText: {
    fontSize: 12,
    fontWeight: "800",
  },
  errorText: {
    fontSize: 13,
    opacity: 0.75,
  },
  submit: {
    marginTop: 6,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitText: {
    fontSize: 14,
    fontWeight: "900",
  },
});
