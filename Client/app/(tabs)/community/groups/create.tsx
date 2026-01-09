import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useGroupsStore } from "@/contexts/community/GroupsContext";
import { useAuth } from "@/contexts/AuthContext";
import { PeopleSearchBar } from "@/components/community/people/PeopleSearchBar";
import {
  fetchDiscoverPeople,
  type DiscoverPeopleUser,
} from "@/services/communityPeople";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type GroupType = "public" | "private";

type Step = "participants" | "details";

type PickUser = {
  id: string;
  name: string;
  avatar: string;
  subtitle: string;
};

function mapDiscoverPersonToPickUser(u: DiscoverPeopleUser): PickUser {
  const avatarStr = u.profileImageUrl ?? "";
  const avatarFallback =
    avatarStr.trim().length > 0
      ? avatarStr
      : u.name?.trim().length > 0
      ? u.name.trim().charAt(0).toUpperCase()
      : "👤";

  const subtitleParts: string[] = [];
  if (u.languages?.length)
    subtitleParts.push(u.languages.slice(0, 3).join(" • "));
  if (u.countryCode) subtitleParts.push(u.countryCode);

  return {
    id: u.id,
    name: u.name,
    avatar: avatarFallback,
    subtitle: subtitleParts.join("  ·  "),
  };
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

export default function CreateGroupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const { createGroup } = useGroupsStore();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>("participants");

  const [peopleQuery, setPeopleQuery] = useState("");
  const [people, setPeople] = useState<PickUser[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [peopleError, setPeopleError] = useState<string | null>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedUsersById, setSelectedUsersById] = useState<
    Record<string, PickUser>
  >({});

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<GroupType>("private");

  const [touchedDetails, setTouchedDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return name.trim().length > 1;
  }, [name]);

  const selectedUsers = useMemo(() => {
    return selectedIds
      .map((id) => selectedUsersById[id])
      .filter(Boolean) as PickUser[];
  }, [selectedIds, selectedUsersById]);

  const subtleBg = `${colors.icon}10`;
  const borderColor = `${colors.icon}20`;

  const loadPeople = useCallback(
    async (q: string) => {
      if (!user?.id) return;
      setPeopleLoading(true);
      setPeopleError(null);
      try {
        const res = await fetchDiscoverPeople(user.id, {
          q: q.trim() || undefined,
          limit: 50,
        });
        if (!res.success) {
          setPeople([]);
          setPeopleError(res.message || "Failed to load people");
          return;
        }
        setPeople(res.data.map(mapDiscoverPersonToPickUser));
      } catch (e: any) {
        setPeople([]);
        setPeopleError(e?.message || "Failed to load people");
      } finally {
        setPeopleLoading(false);
      }
    },
    [user?.id]
  );

  useEffect(() => {
    if (!user?.id) return;
    void loadPeople("");
  }, [loadPeople, user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
    searchTimerRef.current = setTimeout(() => {
      void loadPeople(peopleQuery);
    }, 250);
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
        searchTimerRef.current = null;
      }
    };
  }, [loadPeople, peopleQuery, user?.id]);

  const removeSelected = (id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
    setSelectedUsersById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const toggleSelected = (person: PickUser) => {
    setSelectedIds((prev) => {
      if (prev.includes(person.id)) return prev.filter((x) => x !== person.id);
      return [...prev, person.id];
    });

    setSelectedUsersById((prev) => {
      if (prev[person.id]) return prev;
      return { ...prev, [person.id]: person };
    });
  };

  const onCreate = async () => {
    setTouchedDetails(true);
    if (!canSubmit) return;
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      const createdId = await createGroup({
        name: name.trim(),
        description:
          description.trim() || "A new group created by the community.",
        language: language.trim(),
        type,
        category: category.trim() || "Study Group",
        invitedUserIds: selectedIds,
      });

      if (!createdId) return;

      router.replace({
        pathname: "/community/groups/[groupId]",
        params: { groupId: createdId },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onHeaderBack = () => {
    if (step === "details") {
      setStep("participants");
      return;
    }
    router.back();
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
          onPress={onHeaderBack}
          activeOpacity={0.85}
        >
          <ThemedText style={styles.headerIconText}>←</ThemedText>
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <ThemedText style={styles.headerTitle}>New Group</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            {step === "participants"
              ? `${selectedIds.length} selected`
              : "Add details"}
          </ThemedText>
        </View>

        <View style={styles.headerIcon} />
      </View>

      {step === "participants" ? (
        <View style={styles.stepWrap}>
          {!user?.id ? (
            <View style={styles.centered}>
              <ThemedText style={styles.errorText}>
                Sign in to invite people.
              </ThemedText>
            </View>
          ) : (
            <>
              <PeopleSearchBar
                value={peopleQuery}
                onChangeText={setPeopleQuery}
                onClear={() => setPeopleQuery("")}
                placeholder="Search people to invite"
              />

              {selectedUsers.length > 0 ? (
                <View style={styles.chipsWrap}>
                  <FlatList
                    data={selectedUsers}
                    horizontal
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsContent}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => removeSelected(item.id)}
                        activeOpacity={0.85}
                        style={[
                          styles.chip,
                          { backgroundColor: `${colors.icon}12` },
                        ]}
                      >
                        <ThemedText style={styles.chipText} numberOfLines={1}>
                          {item.name}
                        </ThemedText>
                        <ThemedText style={styles.chipX}>✕</ThemedText>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              ) : null}

              {peopleError ? (
                <View style={styles.errorWrap}>
                  <ThemedText
                    style={[styles.errorText, { color: colors.tint }]}
                  >
                    {peopleError}
                  </ThemedText>
                </View>
              ) : null}

              <FlatList
                data={people}
                keyExtractor={(item) => item.id}
                refreshing={peopleLoading}
                onRefresh={() => loadPeople(peopleQuery)}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                  const selected = selectedIds.includes(item.id);
                  const avatarIsUrl = isHttpUrl(item.avatar);
                  return (
                    <TouchableOpacity
                      onPress={() => toggleSelected(item)}
                      activeOpacity={0.85}
                      style={[
                        styles.personRow,
                        { borderBottomColor: `${colors.icon}20` },
                      ]}
                    >
                      <View
                        style={[
                          styles.personAvatar,
                          { backgroundColor: `${colors.icon}12` },
                        ]}
                      >
                        {avatarIsUrl ? (
                          <Image
                            source={{ uri: item.avatar }}
                            style={styles.personAvatarImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <ThemedText style={styles.personAvatarText}>
                            {item.avatar}
                          </ThemedText>
                        )}
                      </View>

                      <View style={styles.personBody}>
                        <ThemedText style={styles.personName} numberOfLines={1}>
                          {item.name}
                        </ThemedText>
                        {item.subtitle ? (
                          <ThemedText
                            style={styles.personSubtitle}
                            numberOfLines={1}
                          >
                            {item.subtitle}
                          </ThemedText>
                        ) : null}
                      </View>

                      <View
                        style={[
                          styles.checkbox,
                          {
                            backgroundColor: selected
                              ? `${colors.tint}22`
                              : "transparent",
                            borderColor: selected
                              ? `${colors.tint}88`
                              : `${colors.icon}35`,
                          },
                        ]}
                      >
                        {selected ? (
                          <ThemedText
                            style={[
                              styles.checkboxText,
                              { color: colors.tint },
                            ]}
                          >
                            ✓
                          </ThemedText>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />

              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={() => setStep("details")}
                  activeOpacity={0.85}
                  style={[styles.primaryCta, { backgroundColor: colors.tint }]}
                >
                  <ThemedText
                    style={[
                      styles.primaryCtaText,
                      { color: colors.background },
                    ]}
                  >
                    Next
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setStep("details")}
                  activeOpacity={0.85}
                  style={[
                    styles.secondaryCta,
                    { backgroundColor: `${colors.icon}12` },
                  ]}
                >
                  <ThemedText style={styles.secondaryCtaText}>
                    Skip for now
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      ) : (
        <View style={styles.content}>
          <View
            style={[styles.card, { backgroundColor: subtleBg, borderColor }]}
          >
            <ThemedText style={styles.label}>Group Name</ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Yoruba Warriors"
              placeholderTextColor={colors.icon}
              style={[styles.input, { color: colors.text }]}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>

          <View
            style={[styles.card, { backgroundColor: subtleBg, borderColor }]}
          >
            <ThemedText style={styles.label}>Language (optional)</ThemedText>
            <TextInput
              value={language}
              onChangeText={setLanguage}
              placeholder="e.g. Yoruba"
              placeholderTextColor={colors.icon}
              style={[styles.input, { color: colors.text }]}
              autoCapitalize="words"
            />
          </View>

          <View
            style={[styles.card, { backgroundColor: subtleBg, borderColor }]}
          >
            <ThemedText style={styles.label}>Category (optional)</ThemedText>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. Study Group"
              placeholderTextColor={colors.icon}
              style={[styles.input, { color: colors.text }]}
              autoCapitalize="words"
            />
          </View>

          <View
            style={[styles.card, { backgroundColor: subtleBg, borderColor }]}
          >
            <ThemedText style={styles.label}>Description (optional)</ThemedText>
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
            <ThemedText style={styles.typeLabel}>Privacy</ThemedText>
            <View style={styles.typePills}>
              {(
                [
                  { key: "private" as const, label: "🔒 Private" },
                  { key: "public" as const, label: "🔓 Public" },
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
                        borderColor: active
                          ? `${colors.tint}55`
                          : "transparent",
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

          {touchedDetails && !canSubmit ? (
            <ThemedText style={styles.errorText}>
              Please add a group name.
            </ThemedText>
          ) : null}

          <TouchableOpacity
            onPress={onCreate}
            activeOpacity={0.85}
            disabled={!canSubmit || isSubmitting || !user?.id}
            style={[
              styles.submit,
              {
                backgroundColor:
                  canSubmit && !isSubmitting && user?.id
                    ? colors.tint
                    : `${colors.icon}22`,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.submitText,
                {
                  color:
                    canSubmit && !isSubmitting && user?.id
                      ? colors.background
                      : colors.text,
                  opacity: canSubmit && !isSubmitting && user?.id ? 1 : 0.5,
                },
              ]}
            >
              {isSubmitting ? "Creating…" : "Create"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
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
  headerTitleWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    opacity: 0.65,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  stepWrap: {
    flex: 1,
  },
  centered: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  errorWrap: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  listContent: {
    paddingBottom: 140,
  },
  chipsWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  chipsContent: {
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    maxWidth: 220,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "800",
    opacity: 0.85,
    maxWidth: 170,
  },
  chipX: {
    fontSize: 12,
    opacity: 0.7,
    fontWeight: "800",
  },
  personRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  personAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  personAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  personAvatarText: {
    fontSize: 18,
    fontWeight: "800",
  },
  personBody: {
    flex: 1,
    paddingRight: 10,
  },
  personName: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 2,
  },
  personSubtitle: {
    fontSize: 12,
    opacity: 0.65,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxText: {
    fontSize: 14,
    fontWeight: "900",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 18,
    paddingTop: 10,
    gap: 10,
    backgroundColor: "transparent",
  },
  primaryCta: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryCtaText: {
    fontSize: 14,
    fontWeight: "900",
  },
  secondaryCta: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryCtaText: {
    fontSize: 14,
    fontWeight: "800",
    opacity: 0.8,
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
