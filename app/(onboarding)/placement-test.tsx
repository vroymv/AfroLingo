import { OnboardingProgress } from "@/components/OnboardingProgress";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface PlacementQuestion {
  id: number;
  question: string;
  type: "recognition" | "recall" | "cultural";
  options: string[];
  correctAnswer: number;
}

const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: 1,
    question: "Which greeting is used to show respect to elders?",
    type: "cultural",
    options: ["Hujambo", "Shikamoo", "Habari", "Mambo"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "What does 'Asante' mean?",
    type: "recognition",
    options: ["Hello", "Thank you", "Goodbye", "Please"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "How do you say 'water' in Swahili?",
    type: "recall",
    options: ["Maji", "Chakula", "Nyama", "Maziwa"],
    correctAnswer: 0,
  },
  {
    id: 4,
    question: "Which phrase means 'I don't understand'?",
    type: "recognition",
    options: ["Ninaelewa", "Sielewi", "Ninataka", "Sinahitaji"],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "In African culture, what's important when greeting someone?",
    type: "cultural",
    options: ["Speed", "Eye contact and respect", "Loudness", "Brevity"],
    correctAnswer: 1,
  },
  {
    id: 6,
    question: "Your grandmother asks 'Habari za nyumbani?' She wants to know:",
    type: "cultural",
    options: ["Your age", "News from home/family", "Your job", "The time"],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: "How would you introduce yourself saying 'My name is...'?",
    type: "recall",
    options: ["Jina langu ni...", "Mimi ni...", "Ninataka...", "Nina..."],
    correctAnswer: 0,
  },
  {
    id: 8,
    question: "If someone says 'Karibu', they are:",
    type: "recognition",
    options: [
      "Saying goodbye",
      "Welcoming you",
      "Asking for help",
      "Introducing themselves",
    ],
    correctAnswer: 1,
  },
];

export default function PlacementTestScreen() {
  const router = useRouter();
  const { dispatch } = useOnboarding();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  // Set current step on mount
  useEffect(() => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 5 });
  }, [dispatch]);

  const currentQ = PLACEMENT_QUESTIONS[currentQuestion];
  const progress = (currentQuestion + 1) / PLACEMENT_QUESTIONS.length;

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      const newAnswers = [...selectedAnswers, selectedOption];
      setSelectedAnswers(newAnswers);

      if (currentQuestion < PLACEMENT_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // Test completed
        setIsCompleted(true);
      }
    }
  };

  const calculateLevel = () => {
    const correctAnswers = selectedAnswers.reduce((score, answer, index) => {
      return (
        score + (answer === PLACEMENT_QUESTIONS[index].correctAnswer ? 1 : 0)
      );
    }, 0);

    // Updated scoring for 8 questions
    if (correctAnswers <= 2) return "absolute-beginner";
    if (correctAnswers <= 5) return "beginner";
    return "refresher";
  };

  const handleFinish = () => {
    const level = calculateLevel();
    const score = selectedAnswers.reduce((score, answer, index) => {
      return (
        score + (answer === PLACEMENT_QUESTIONS[index].correctAnswer ? 1 : 0)
      );
    }, 0);

    // Save results to context
    dispatch({ type: "SET_LEVEL", payload: level });
    dispatch({ type: "SET_PLACEMENT_SCORE", payload: score });

    // Navigate to personalization
    router.push("./personalization");
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(selectedAnswers[currentQuestion - 1]);
      setSelectedAnswers(selectedAnswers.slice(0, -1));
    } else {
      router.back();
    }
  };

  const getLevelDisplayName = (level: string) => {
    const levelNames = {
      "absolute-beginner": "Absolute Beginner",
      beginner: "Beginner",
      refresher: "Refresher",
    };
    return levelNames[level as keyof typeof levelNames] || level;
  };

  if (isCompleted) {
    const level = calculateLevel();
    const score = selectedAnswers.reduce((score, answer, index) => {
      return (
        score + (answer === PLACEMENT_QUESTIONS[index].correctAnswer ? 1 : 0)
      );
    }, 0);

    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <StatusBar style="auto" />

        <View style={styles.completedContainer}>
          <View style={styles.resultHeader}>
            <View style={[styles.resultIcon, { backgroundColor: tintColor }]}>
              <ThemedText style={styles.resultIconText}>🎉</ThemedText>
            </View>

            <ThemedText type="title" style={styles.resultTitle}>
              Test Complete!
            </ThemedText>

            <ThemedText style={styles.resultSubtitle}>
              Based on your answers, we recommend starting at:
            </ThemedText>
          </View>

          <View style={[styles.levelCard, { borderColor: tintColor }]}>
            <ThemedText
              type="subtitle"
              style={[styles.levelText, { color: tintColor }]}
            >
              {getLevelDisplayName(level)}
            </ThemedText>
            <ThemedText style={styles.scoreText}>
              You got {score} out of {PLACEMENT_QUESTIONS.length} questions
              correct
            </ThemedText>
          </View>

          <View style={styles.levelDescription}>
            <ThemedText style={styles.descriptionText}>
              {level === "absolute-beginner" &&
                "Perfect! We'll start with the basics - greetings, simple words, and pronunciation fundamentals."}
              {level === "beginner" &&
                "Great! We'll build on what you know with vocabulary, basic conversations, and cultural context."}
              {level === "refresher" &&
                "Excellent! We'll help you restore and expand your existing knowledge with advanced topics."}
            </ThemedText>
          </View>

          <TouchableOpacity
            style={[styles.finishButton, { backgroundColor: tintColor }]}
            onPress={handleFinish}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.finishButtonText}>
              Start Learning
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ThemedText style={[styles.backButtonText, { color: tintColor }]}>
            ← Back
          </ThemedText>
        </TouchableOpacity>

        <OnboardingProgress currentStep={5} totalSteps={5} />

        <View style={styles.progressContainer}>
          <ThemedText style={styles.progressText}>
            {currentQuestion + 1} of {PLACEMENT_QUESTIONS.length}
          </ThemedText>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: tintColor, width: `${progress * 100}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Question */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionContainer}>
          <ThemedText type="subtitle" style={styles.questionText}>
            {currentQ.question}
          </ThemedText>

          <View style={styles.optionsContainer}>
            {currentQ.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOption === index && {
                    backgroundColor: tintColor + "20",
                    borderColor: tintColor,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => handleOptionSelect(index)}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.optionText}>{option}</ThemedText>
                {selectedOption === index && (
                  <View
                    style={[
                      styles.optionCheckmark,
                      { backgroundColor: tintColor },
                    ]}
                  >
                    <ThemedText style={styles.checkmarkText}>✓</ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Next Button */}
      {selectedOption !== null && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: tintColor }]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.nextButtonText}>
              {currentQuestion === PLACEMENT_QUESTIONS.length - 1
                ? "Finish"
                : "Next"}
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
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  progressContainer: {
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  questionContainer: {
    marginBottom: 32,
  },
  questionText: {
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  optionCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  completedContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  resultHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  resultIconText: {
    fontSize: 32,
  },
  resultTitle: {
    textAlign: "center",
    marginBottom: 12,
  },
  resultSubtitle: {
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 22,
  },
  levelCard: {
    padding: 24,
    borderWidth: 2,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  levelText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 14,
    opacity: 0.7,
  },
  levelDescription: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  descriptionText: {
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.8,
  },
  finishButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
  },
  finishButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
