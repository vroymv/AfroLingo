import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Story } from "@/data/stories";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface StoryPlayerProps {
  story: Story;
  visible: boolean;
  onClose: () => void;
}

export const StoryPlayer: React.FC<StoryPlayerProps> = ({
  story,
  visible,
  onClose,
}) => {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  const currentSegment = story.segments[currentSegmentIndex];
  const isLastSegment = currentSegmentIndex === story.segments.length - 1;
  const hasQuestions = story.questions && story.questions.length > 0;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  const handleNext = () => {
    if (isLastSegment && hasQuestions && !showQuestions) {
      setShowQuestions(true);
      setCurrentQuestionIndex(0);
    } else if (!isLastSegment) {
      setCurrentSegmentIndex(currentSegmentIndex + 1);
      setShowTranslation(false);
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePrevious = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(currentSegmentIndex - 1);
      setShowTranslation(false);
    }
  };

  const handleQuestionAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);

    if (
      story.questions &&
      optionIndex === story.questions[currentQuestionIndex].correctAnswer
    ) {
      if (!completedQuestions.includes(currentQuestionIndex)) {
        setCompletedQuestions([...completedQuestions, currentQuestionIndex]);
      }
    }
  };

  const handleNextQuestion = () => {
    if (story.questions && currentQuestionIndex < story.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // All done
      setShowQuestions(false);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleClose = () => {
    setCurrentSegmentIndex(0);
    setShowTranslation(false);
    setShowQuestions(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCompletedQuestions([]);
    onClose();
  };

  const getDifficultyColor = (): [string, string] => {
    switch (story.difficulty) {
      case "Beginner":
        return ["#4CAF50", "#66BB6A"];
      case "Intermediate":
        return ["#FF9800", "#FFA726"];
      case "Advanced":
        return ["#F44336", "#EF5350"];
      default:
        return ["#4CAF50", "#66BB6A"];
    }
  };

  const renderProgressDots = () => (
    <View style={styles.progressDots}>
      {story.segments.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentSegmentIndex && styles.activeDot,
            index < currentSegmentIndex && styles.completedDot,
          ]}
        />
      ))}
    </View>
  );

  const renderStoryContent = () => (
    <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.coverLarge}>{story.cover}</Text>
          <ThemedText type="defaultSemiBold" style={styles.storyTitleHeader}>
            {story.title}
          </ThemedText>
        </View>
      </View>

      {renderProgressDots()}

      <ScrollView
        style={styles.storyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Speaker Badge */}
        {currentSegment.speaker && (
          <View style={styles.speakerBadge}>
            <Text style={styles.speakerEmoji}>💬</Text>
            <ThemedText type="defaultSemiBold" style={styles.speakerName}>
              {currentSegment.speaker}
            </ThemedText>
          </View>
        )}

        {/* Main Text */}
        <View style={styles.textContainer}>
          <ThemedText type="title" style={styles.mainText}>
            {currentSegment.text}
          </ThemedText>

          {/* Audio Button */}
          <TouchableOpacity style={styles.audioButton}>
            <Text style={styles.audioIcon}>🔊</Text>
            <ThemedText type="default" style={styles.audioLabel}>
              Listen
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Translation Toggle */}
        <TouchableOpacity
          style={styles.translationToggle}
          onPress={() => setShowTranslation(!showTranslation)}
        >
          <Text style={styles.toggleIcon}>{showTranslation ? "👁️" : "👁️‍🗨️"}</Text>
          <ThemedText type="default" style={styles.toggleText}>
            {showTranslation ? "Hide" : "Show"} Translation
          </ThemedText>
        </TouchableOpacity>

        {/* Translation */}
        {showTranslation && (
          <View style={styles.translationBox}>
            <ThemedText type="default" style={styles.translationText}>
              {currentSegment.translation}
            </ThemedText>
          </View>
        )}

        {/* Highlighted Words */}
        {currentSegment.highlightedWords.length > 0 && (
          <View style={styles.highlightedSection}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              📝 Key Words
            </ThemedText>
            <View style={styles.wordChips}>
              {currentSegment.highlightedWords.map((word, idx) => (
                <View key={idx} style={styles.wordChip}>
                  <ThemedText type="default" style={styles.wordChipText}>
                    {word}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Story Context */}
        <View style={styles.contextBox}>
          <Text style={styles.contextEmoji}>💡</Text>
          <ThemedText type="default" style={styles.contextText}>
            Segment {currentSegmentIndex + 1} of {story.segments.length}
          </ThemedText>
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentSegmentIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePrevious}
          disabled={currentSegmentIndex === 0}
        >
          <Text style={styles.navIcon}>←</Text>
          <ThemedText type="default" style={styles.navText}>
            Previous
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButtonPrimary} onPress={handleNext}>
          <ThemedText type="defaultSemiBold" style={styles.navTextPrimary}>
            {isLastSegment ? (hasQuestions ? "Take Quiz" : "Complete") : "Next"}
          </ThemedText>
          <Text style={styles.navIconPrimary}>→</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderQuestionContent = () => {
    if (!story.questions || story.questions.length === 0) return null;

    const currentQuestion = story.questions[currentQuestionIndex];
    const isCorrect =
      selectedAnswer !== null &&
      selectedAnswer === currentQuestion.correctAnswer;

    return (
      <View style={styles.questionContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.quizEmoji}>📝</Text>
            <ThemedText type="defaultSemiBold" style={styles.storyTitleHeader}>
              Story Quiz
            </ThemedText>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.questionProgress}>
          <ThemedText type="default" style={styles.questionProgressText}>
            Question {currentQuestionIndex + 1} of {story.questions.length}
          </ThemedText>
          <View style={styles.questionProgressBar}>
            <View
              style={[
                styles.questionProgressFill,
                {
                  width: `${
                    ((currentQuestionIndex + 1) / story.questions.length) * 100
                  }%`,
                },
              ]}
            />
          </View>
        </View>

        <ScrollView
          style={styles.questionContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Question */}
          <View style={styles.questionBox}>
            <ThemedText type="title" style={styles.questionText}>
              {currentQuestion.question}
            </ThemedText>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === currentQuestion.correctAnswer;
              const showCorrect = showExplanation && isCorrectOption;
              const showIncorrect = showExplanation && isSelected && !isCorrect;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                    showCorrect && styles.optionButtonCorrect,
                    showIncorrect && styles.optionButtonIncorrect,
                  ]}
                  onPress={() => handleQuestionAnswer(index)}
                  disabled={showExplanation}
                >
                  <View style={styles.optionContent}>
                    <View
                      style={[
                        styles.optionCircle,
                        isSelected && styles.optionCircleSelected,
                        showCorrect && styles.optionCircleCorrect,
                        showIncorrect && styles.optionCircleIncorrect,
                      ]}
                    >
                      {showCorrect && <Text style={styles.checkmark}>✓</Text>}
                      {showIncorrect && <Text style={styles.crossmark}>✕</Text>}
                    </View>
                    <ThemedText type="default" style={styles.optionText}>
                      {option}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Explanation */}
          {showExplanation && (
            <View
              style={[
                styles.explanationBox,
                isCorrect
                  ? styles.explanationBoxCorrect
                  : styles.explanationBoxIncorrect,
              ]}
            >
              <View style={styles.explanationHeader}>
                <Text style={styles.explanationEmoji}>
                  {isCorrect ? "🎉" : "💡"}
                </Text>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.explanationTitle}
                >
                  {isCorrect ? "Correct!" : "Not quite!"}
                </ThemedText>
              </View>
              <ThemedText type="default" style={styles.explanationText}>
                {currentQuestion.explanation}
              </ThemedText>
            </View>
          )}
        </ScrollView>

        {/* Navigation */}
        {showExplanation && (
          <View style={styles.questionNavigation}>
            <TouchableOpacity
              style={styles.navButtonPrimary}
              onPress={handleNextQuestion}
            >
              <ThemedText type="defaultSemiBold" style={styles.navTextPrimary}>
                {currentQuestionIndex < story.questions.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </ThemedText>
              <Text style={styles.navIconPrimary}>→</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <LinearGradient
        colors={getDifficultyColor()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ThemedView style={styles.container}>
          {showQuestions ? renderQuestionContent() : renderStoryContent()}
        </ThemedView>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coverLarge: {
    fontSize: 40,
  },
  quizEmoji: {
    fontSize: 40,
  },
  storyTitleHeader: {
    fontSize: 20,
    flex: 1,
  },
  progressDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 24,
  },
  completedDot: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  storyContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  speakerBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    gap: 8,
  },
  speakerEmoji: {
    fontSize: 16,
  },
  speakerName: {
    fontSize: 14,
  },
  textContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  mainText: {
    fontSize: 24,
    lineHeight: 36,
    marginBottom: 16,
    color: "#1a1a1a",
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74, 144, 226, 0.15)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  audioIcon: {
    fontSize: 20,
  },
  audioLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A90E2",
  },
  translationToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  toggleIcon: {
    fontSize: 20,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
  },
  translationBox: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  translationText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#555",
    fontStyle: "italic",
  },
  highlightedSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  wordChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  wordChip: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  wordChipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  contextBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    marginBottom: 20,
  },
  contextEmoji: {
    fontSize: 16,
  },
  contextText: {
    fontSize: 14,
    opacity: 0.8,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  navIcon: {
    fontSize: 18,
    color: "#fff",
  },
  navText: {
    fontSize: 16,
    fontWeight: "600",
  },
  navIconPrimary: {
    fontSize: 18,
    color: "#1a1a1a",
  },
  navTextPrimary: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  // Question styles
  questionContainer: {
    flex: 1,
  },
  questionProgress: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  questionProgressText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
    opacity: 0.8,
  },
  questionProgressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  questionProgressFill: {
    height: "100%",
    backgroundColor: "#fff",
  },
  questionContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionBox: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  questionText: {
    fontSize: 22,
    lineHeight: 32,
    color: "#1a1a1a",
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionButtonSelected: {
    borderColor: "#4A90E2",
    backgroundColor: "rgba(74, 144, 226, 0.1)",
  },
  optionButtonCorrect: {
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  optionButtonIncorrect: {
    borderColor: "#F44336",
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  optionCircleSelected: {
    borderColor: "#4A90E2",
    backgroundColor: "#4A90E2",
  },
  optionCircleCorrect: {
    borderColor: "#4CAF50",
    backgroundColor: "#4CAF50",
  },
  optionCircleIncorrect: {
    borderColor: "#F44336",
    backgroundColor: "#F44336",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  crossmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    color: "#1a1a1a",
  },
  explanationBox: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  explanationBoxCorrect: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  explanationBoxIncorrect: {
    backgroundColor: "rgba(244, 67, 54, 0.2)",
  },
  explanationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  explanationEmoji: {
    fontSize: 24,
  },
  explanationTitle: {
    fontSize: 18,
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 24,
  },
  questionNavigation: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
