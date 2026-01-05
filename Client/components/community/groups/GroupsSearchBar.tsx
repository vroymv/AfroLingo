import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  value: string;
  onChangeText: (next: string) => void;
  onClear: () => void;
  placeholder?: string;
};

export function GroupsSearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = "Search groups",
}: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={styles.searchWrap}>
      <View style={[styles.searchBar, { backgroundColor: `${colors.icon}12` }]}>
        <ThemedText style={styles.searchIcon}>🔍</ThemedText>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.icon}
          style={[styles.searchInput, { color: colors.text }]}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {value.length > 0 ? (
          <TouchableOpacity
            onPress={onClear}
            style={styles.clearButton}
            hitSlop={10}
          >
            <ThemedText style={styles.clearText}>✕</ThemedText>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
