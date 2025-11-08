import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export interface PathOption {
  id: "know-level" | "find-level";
  title: string;
  description: string;
  icon: string;
  subtitle: string;
  benefits: string[];
  imagePrompt?: string; // For image placeholder description
  disabled?: boolean; // To disable option
  image?: ImageSourcePropType; // Actual image to display
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
  const isDisabled = option.disabled || false;

  return (
    <TouchableOpacity
      style={[
        styles.pathCard,
        {
          backgroundColor: enhancedColors.background,
          borderColor: enhancedColors.border,
          opacity: isDisabled ? 0.5 : 1,
        },
        isSelected && {
          borderWidth: 3,
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
      onPress={() => !isDisabled && onSelect(option.id)}
      activeOpacity={isDisabled ? 1 : 0.8}
      disabled={isDisabled}
    >
      {/* Image Placeholder Area */}
      <View
        style={[
          styles.imageContainer,
          {
            backgroundColor: option.image
              ? "transparent"
              : enhancedColors.icon + "15",
          },
        ]}
      >
        {option.image ? (
          <Image
            source={option.image}
            style={styles.cardImage}
            resizeMode="contain"
          />
        ) : (
          <ThemedText style={styles.largeIcon}>{option.icon}</ThemedText>
        )}
        {/* Coming Soon Badge for disabled options */}
        {isDisabled && (
          <View style={styles.comingSoonBadge}>
            <ThemedText style={styles.comingSoonText}>Coming Soon</ThemedText>
          </View>
        )}
        {/* Image placeholder text for developer */}
        {option.imagePrompt && !isDisabled && !option.image && (
          <View style={styles.imagePlaceholderNote}>
            <ThemedText style={styles.placeholderText}>
              📸 {option.imagePrompt}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        <View style={styles.pathHeader}>
          <View style={styles.pathTitleContainer}>
            <ThemedText type="defaultSemiBold" style={styles.pathTitle}>
              {option.title}
            </ThemedText>
            <ThemedText style={styles.pathSubtitle}>
              {option.subtitle}
            </ThemedText>
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

        {/* Icon-based Benefits */}
        <View style={styles.benefitsContainer}>
          {option.benefits.map((benefit, index) => {
            const icons = ["⚡", "🎯", "✨"];
            return (
              <View key={index} style={styles.benefitItem}>
                <View
                  style={[
                    styles.benefitIconBox,
                    { backgroundColor: enhancedColors.icon + "20" },
                  ]}
                >
                  <ThemedText style={styles.benefitIcon}>
                    {icons[index]}
                  </ThemedText>
                </View>
                <ThemedText style={styles.benefitText}>{benefit}</ThemedText>
              </View>
            );
          })}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pathCard: {
    backgroundColor: "white",
    borderRadius: 24,
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
    overflow: "hidden",
  },
  imageContainer: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  cardImage: {
    width: "95%",
    height: "95%",
  },
  largeIcon: {
    fontSize: 72,
  },
  comingSoonBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  comingSoonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
  },
  imagePlaceholderNote: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 8,
    borderRadius: 8,
  },
  placeholderText: {
    color: "white",
    fontSize: 11,
    textAlign: "center",
  },
  cardContent: {
    padding: 20,
  },
  pathHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  pathTitleContainer: {
    flex: 1,
  },
  pathTitle: {
    fontSize: 22,
    marginBottom: 4,
    fontWeight: "700",
  },
  pathSubtitle: {
    fontSize: 14,
    opacity: 0.65,
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
  benefitsContainer: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  benefitIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  benefitIcon: {
    fontSize: 16,
  },
  benefitText: {
    fontSize: 14,
    opacity: 0.8,
    flex: 1,
    fontWeight: "500",
  },
});
