import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import type { Story } from "@/data/stories";

type ImmersiveStoryPlayerProps = {
  story: Story;
  visible: boolean;
  onClose: () => void;
};

const { height } = Dimensions.get("window");

export const ImmersiveStoryPlayer: React.FC<ImmersiveStoryPlayerProps> = ({
  story,
  visible,
  onClose,
}) => {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const [currentAudioSource, setCurrentAudioSource] = useState<string | null>(
    null
  );

  const player = useAudioPlayer(currentAudioSource || "");
  const status = useAudioPlayerStatus(player);

  const currentSegment = story.segments[currentSegmentIndex];
  const isLastSegment = currentSegmentIndex === story.segments.length - 1;
  const isFirstSegment = currentSegmentIndex === 0;

  const progress = ((currentSegmentIndex + 1) / story.segments.length) * 100;

  const handleNext = () => {
    if (!isLastSegment) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        setCurrentSegmentIndex(currentSegmentIndex + 1);
        setShowTranslation(false);
      }, 200);
    }
  };

  const handlePrevious = () => {
    if (!isFirstSegment) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        setCurrentSegmentIndex(currentSegmentIndex - 1);
        setShowTranslation(false);
      }, 200);
    }
  };

  const getGradientColors = (): [string, string, string] => {
    switch (story.type) {
      case "cultural":
        return ["#8B4789", "#D946A6", "#F97316"];
      case "narrative":
        return ["#3B82F6", "#8B5CF6", "#EC4899"];
      default:
        return ["#4A90E2", "#6366F1", "#8B5CF6"];
    }
  };

  const playAudio = (audioUrl?: string) => {
    if (!audioUrl) return;

    try {
      // If same audio is already playing, pause it
      if (currentAudioSource === audioUrl && status.playing) {
        player.pause();
        return;
      }

      // Set the new audio source and play
      setCurrentAudioSource(audioUrl);
      player.replace(audioUrl);
      player.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            accessibilityRole="button"
            accessibilityLabel="Close story"
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.coverEmoji}>{story.cover}</Text>
            <View style={styles.headerText}>
              <Text style={styles.title}>{story.title}</Text>
              <Text style={styles.segmentCounter}>
                {currentSegmentIndex + 1} / {story.segments.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Story Content */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.storyCard}>
            {/* Main Text */}
            <View style={styles.textContainer}>
              <Text style={styles.mainText}>{currentSegment.text}</Text>
            </View>

            {/* Controls Row */}
            <View style={styles.controlsRow}>
              {/* Audio Play Button */}
              {currentSegment.audio && (
                <TouchableOpacity
                  style={styles.audioButton}
                  onPress={() => playAudio(currentSegment.audio)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.audioButtonIcon}>
                    {currentAudioSource === currentSegment.audio &&
                    status.playing
                      ? "⏸"
                      : "▶️"}
                  </Text>
                  <Text style={styles.audioButtonText}>
                    {currentAudioSource === currentSegment.audio &&
                    status.playing
                      ? "Pause"
                      : "Play Audio"}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Translation Toggle */}
              <TouchableOpacity
                style={styles.translationToggle}
                onPress={() => setShowTranslation(!showTranslation)}
                activeOpacity={0.7}
              >
                <Text style={styles.translationToggleIcon}>
                  {showTranslation ? "👁️" : "🔤"}
                </Text>
                <Text style={styles.translationToggleText}>
                  {showTranslation ? "Hide" : "Show"} Translation
                </Text>
              </TouchableOpacity>
            </View>

            {/* Translation */}
            {showTranslation && (
              <Animated.View style={styles.translationContainer}>
                <Text style={styles.translationText}>
                  {currentSegment.translation}
                </Text>
              </Animated.View>
            )}

            {/* Highlighted Words */}
            {currentSegment.highlightedWords.length > 0 && (
              <View style={styles.wordsContainer}>
                <Text style={styles.wordsLabel}>Key Words:</Text>
                <View style={styles.wordsList}>
                  {currentSegment.highlightedWords.map((word, index) => (
                    <View key={index} style={styles.wordBadge}>
                      <Text style={styles.wordText}>{word}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Navigation Controls */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              isFirstSegment && styles.navButtonDisabled,
            ]}
            onPress={handlePrevious}
            disabled={isFirstSegment}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.navButtonText,
                isFirstSegment && styles.navButtonTextDisabled,
              ]}
            >
              ← Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.navButtonPrimary]}
            onPress={isLastSegment ? onClose : handleNext}
            activeOpacity={0.7}
          >
            <Text style={[styles.navButtonText, styles.navButtonPrimaryText]}>
              {isLastSegment ? "Complete ✓" : "Next →"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  closeIcon: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  coverEmoji: {
    fontSize: 42,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  segmentCounter: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
  },
  progressBarContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
    zIndex: 10,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    zIndex: 5,
  },
  storyCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 32,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  textContainer: {
    marginBottom: 24,
  },
  mainText: {
    fontSize: 28,
    lineHeight: 42,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "rgba(74, 144, 226, 0.15)",
    borderRadius: 24,
    gap: 8,
  },
  audioButtonIcon: {
    fontSize: 16,
  },
  audioButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  translationToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
    gap: 10,
  },
  translationToggleIcon: {
    fontSize: 18,
  },
  translationToggleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4A90E2",
  },
  translationContainer: {
    backgroundColor: "rgba(74, 144, 226, 0.08)",
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  translationText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#374151",
    textAlign: "center",
    fontStyle: "italic",
  },
  wordsContainer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.08)",
    paddingTop: 20,
  },
  wordsLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  wordsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  wordBadge: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  wordText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  navigationContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
    zIndex: 10,
  },
  navButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonPrimary: {
    backgroundColor: "#fff",
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  navButtonPrimaryText: {
    color: "#4A90E2",
  },
  navButtonTextDisabled: {
    opacity: 0.5,
  },
  // Decorative elements
  decorativeCircle1: {
    position: "absolute",
    top: -100,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -120,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  decorativeCircle3: {
    position: "absolute",
    top: height * 0.4,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
});
