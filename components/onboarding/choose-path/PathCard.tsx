import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface PathOption {
  id: "know-level" | "find-level";
  title: string;
  description: string;
  icon: string;
  subtitle: string;
  benefits: string[];
}

interface PathCardProps {
  option: PathOption;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
}

// Enhanced color palette for better visual appeal
const getEnhancedColors = (
  tintColor: string,
  option: PathOption,
  isSelected: boolean
) => {
  const colors = {
    "know-level": {
      background: isSelected ? "#E8F4FD" : "#F8FCFF",
      border: isSelected ? "#0EA5E9" : "#E0F2FE",
      icon: isSelected ? "#0EA5E9" : "#0284C7",
      accent: "#0EA5E9",
    },
    "find-level": {
      background: isSelected ? "#F0F9FF" : "#FEFBFF",
      border: isSelected ? "#8B5CF6" : "#E5E7EB",
      icon: isSelected ? "#8B5CF6" : "#7C3AED",
      accent: "#8B5CF6",
    },
  };

  return (
    colors[option.id] || {
      background: isSelected ? tintColor + "15" : "#FFFFFF",
      border: isSelected ? tintColor : "#E5E7EB",
      icon: isSelected ? tintColor : tintColor + "80",
      accent: tintColor,
    }
  );
};

export function PathCard({ option, isSelected, onSelect }: PathCardProps) {
  const tintColor = useThemeColor({}, "tint");
  const enhancedColors = getEnhancedColors(tintColor, option, isSelected);

  return (
    <TouchableOpacity
      style={[
        styles.pathCard,
        {
          backgroundColor: enhancedColors.background,
          borderColor: enhancedColors.border,
        },
        isSelected && {
          borderWidth: 3,
          transform: [{ scale: 1.02 }],
          shadowColor: enhancedColors.accent,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 12,
        },
      ]}
      onPress={() => onSelect(option.id)}
      activeOpacity={0.8}
    >
      {/* Card Header */}
      <View style={styles.pathHeader}>
        <View
          style={[
            styles.pathIcon,
            {
              backgroundColor: enhancedColors.icon + "20",
            },
          ]}
        >
          <ThemedText style={styles.pathIconText}>{option.icon}</ThemedText>
        </View>

        <View style={styles.pathTitleContainer}>
          <ThemedText type="defaultSemiBold" style={styles.pathTitle}>
            {option.title}
          </ThemedText>
          <ThemedText style={styles.pathSubtitle}>{option.subtitle}</ThemedText>
        </View>

        {isSelected && (
          <View
            style={[
              styles.checkmark,
              { backgroundColor: enhancedColors.accent },
            ]}
          >
            <ThemedText style={styles.checkmarkText}>✓</ThemedText>
          </View>
        )}
      </View>

      {/* Description */}
      <ThemedText style={styles.pathDescription}>
        {option.description}
      </ThemedText>

      {/* Benefits */}
      <View style={styles.benefitsContainer}>
        {option.benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <ThemedText
              style={[styles.benefitDot, { color: enhancedColors.accent }]}
            >
              •
            </ThemedText>
            <ThemedText style={styles.benefitText}>{benefit}</ThemedText>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pathCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 28,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  pathHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  pathIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  pathIconText: {
    fontSize: 28,
  },
  pathTitleContainer: {
    flex: 1,
  },
  pathTitle: {
    fontSize: 20,
    marginBottom: 4,
    fontWeight: "700",
  },
  pathSubtitle: {
    fontSize: 15,
    opacity: 0.65,
    fontStyle: "italic",
    fontWeight: "500",
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  checkmarkText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  pathDescription: {
    fontSize: 16,
    opacity: 0.75,
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: "500",
  },
  benefitsContainer: {
    gap: 12,
    paddingLeft: 4,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  benefitDot: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 1,
    fontWeight: "bold",
  },
  benefitText: {
    fontSize: 15,
    opacity: 0.75,
    lineHeight: 22,
    flex: 1,
    fontWeight: "500",
  },
});
