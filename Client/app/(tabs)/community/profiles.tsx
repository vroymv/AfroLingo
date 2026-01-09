import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PeopleEmptyState } from "@/components/community/people/PeopleEmptyState";
import { PeopleListItem } from "@/components/community/people/PeopleListItem";
import { PeopleSearchBar } from "@/components/community/people/PeopleSearchBar";
import { useDiscoverUsers } from "@/hooks/community/useDiscoverUsers";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { FlatList, StyleSheet, useColorScheme, View } from "react-native";

export default function UserProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const { user } = useAuth();

  const {
    query,
    setQuery,
    clearQuery,
    filteredUsers,
    toggleConnect,
    isLoading,
    error,
    refresh,
  } = useDiscoverUsers(user?.id);

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
        <ThemedText style={styles.headerTitle}>Find People</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Search and connect with other learners
        </ThemedText>
      </View>

      <PeopleSearchBar
        value={query}
        onChangeText={setQuery}
        onClear={clearQuery}
      />

      {error ? (
        <View style={styles.errorWrap}>
          <ThemedText
            style={[styles.errorText, { color: colors.tint }]}
            numberOfLines={2}
          >
            {error}
          </ThemedText>
        </View>
      ) : null}

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PeopleListItem
            user={item}
            isConnected={item.isConnected}
            onToggleConnect={() => toggleConnect(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={refresh}
        ListEmptyComponent={
          user?.id ? (
            <PeopleEmptyState />
          ) : (
            <PeopleEmptyState
              title="Sign in to find people"
              message="Create an account or sign in to discover and connect with other learners."
            />
          )
        }
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    opacity: 0.6,
  },
  listContent: {
    paddingBottom: 16,
  },
  errorWrap: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  errorText: {
    fontSize: 12,
    opacity: 0.9,
  },
});
