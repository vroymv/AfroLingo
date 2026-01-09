import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useGroupsStore } from "@/contexts/community/GroupsContext";
import {
  acceptGroupInvite,
  declineGroupInvite,
  fetchGroupInvites,
  type GroupInviteRow,
} from "@/services/communityGroups";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function groupAvatarFallback(name: string) {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : "👥";
}

export default function GroupInvitesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const { user } = useAuth();
  const { refreshGroups } = useGroupsStore();

  const [invites, setInvites] = useState<GroupInviteRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionInviteId, setActionInviteId] = useState<string | null>(null);

  const loadInvites = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetchGroupInvites({ userId: user.id, limit: 50 });
      if (!res.success) {
        setInvites([]);
        setError(res.message || "Failed to load invites");
        return;
      }

      setInvites(res.data);
    } catch (e: any) {
      setInvites([]);
      setError(e?.message || "Failed to load invites");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      void loadInvites();
    }, [loadInvites])
  );

  const headerBorder = `${colors.icon}20`;

  const onAccept = useCallback(
    async (inviteId: string) => {
      if (!user?.id) return;

      setActionInviteId(inviteId);
      try {
        const res = await acceptGroupInvite({ userId: user.id, inviteId });
        if (!res.success) return;

        await refreshGroups();

        const groupId = res.data?.groupId;
        if (groupId) {
          router.replace({
            pathname: "/community/groups/[groupId]",
            params: { groupId },
          });
          return;
        }

        await loadInvites();
      } finally {
        setActionInviteId(null);
      }
    },
    [loadInvites, refreshGroups, router, user?.id]
  );

  const onDecline = useCallback(
    async (inviteId: string) => {
      if (!user?.id) return;

      setActionInviteId(inviteId);
      try {
        const res = await declineGroupInvite({ userId: user.id, inviteId });
        if (!res.success) return;

        await loadInvites();
      } finally {
        setActionInviteId(null);
      }
    },
    [loadInvites, user?.id]
  );

  const emptyState = useMemo(() => {
    if (!user?.id) {
      return {
        title: "Sign in required",
        subtitle: "Sign in to view group invites.",
      };
    }
    if (loading) {
      return { title: "Loading…", subtitle: "Fetching your invites" };
    }
    if (error) {
      return { title: "Couldn’t load invites", subtitle: error };
    }
    return {
      title: "No pending invites",
      subtitle: "When someone invites you to a group, it will show up here.",
    };
  }, [error, loading, user?.id]);

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            borderBottomColor: headerBorder,
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

        <View style={styles.headerTitleWrap}>
          <ThemedText style={styles.headerTitle}>Invites</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Review invitations to join groups
          </ThemedText>
        </View>

        <View style={styles.headerIcon} />
      </View>

      <FlatList
        data={invites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          invites.length > 0
            ? styles.listContent
            : [styles.listContent, styles.emptyListContent]
        }
        renderItem={({ item }) => {
          const groupName = item.group.name;
          const avatarUrl = item.group.avatarUrl ?? "";
          const avatar = isHttpUrl(avatarUrl)
            ? avatarUrl
            : groupAvatarFallback(groupName);

          const isActing = actionInviteId === item.id;

          return (
            <View
              style={[
                styles.card,
                {
                  borderColor: `${colors.icon}15`,
                  backgroundColor: `${colors.icon}08`,
                },
              ]}
            >
              <View style={styles.rowTop}>
                {isHttpUrl(avatar) ? (
                  <Image source={{ uri: avatar }} style={styles.avatarImg} />
                ) : (
                  <View
                    style={[
                      styles.avatarFallback,
                      { backgroundColor: `${colors.tint}20` },
                    ]}
                  >
                    <ThemedText style={styles.avatarFallbackText}>
                      {avatar}
                    </ThemedText>
                  </View>
                )}

                <View style={styles.rowText}>
                  <ThemedText style={styles.groupName}>{groupName}</ThemedText>
                  <ThemedText style={styles.invitedBy}>
                    Invited by {item.invitedByUser.name}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  disabled={isActing}
                  onPress={() => onDecline(item.id)}
                  style={[
                    styles.secondaryBtn,
                    { borderColor: `${colors.icon}25` },
                    isActing && styles.disabledBtn,
                  ]}
                >
                  <ThemedText style={styles.secondaryBtnText}>
                    Decline
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  disabled={isActing}
                  onPress={() => onAccept(item.id)}
                  style={[
                    styles.primaryBtn,
                    { backgroundColor: colors.tint },
                    isActing && styles.disabledBtn,
                  ]}
                >
                  <ThemedText style={styles.primaryBtnText}>Accept</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <ThemedText style={styles.emptyTitle}>
              {emptyState.title}
            </ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              {emptyState.subtitle}
            </ThemedText>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconText: {
    fontSize: 20,
    fontWeight: "700",
  },
  headerTitleWrap: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyWrap: {
    alignItems: "center",
    paddingHorizontal: 18,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    opacity: 0.65,
    textAlign: "center",
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    fontSize: 18,
    fontWeight: "800",
  },
  rowText: {
    flex: 1,
    marginLeft: 12,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
  },
  invitedBy: {
    fontSize: 13,
    opacity: 0.65,
  },
  actionsRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
  },
  primaryBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "white",
    fontWeight: "800",
  },
  secondaryBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontWeight: "800",
  },
  disabledBtn: {
    opacity: 0.6,
  },
});
