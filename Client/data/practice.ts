export interface PracticeExercise {
  id: string;
  type: "flashcard" | "word-match" | "listening" | "quiz";
  question: string;
  options?: string[];
  correctAnswer: string;
  audio?: string;
  points: number;
}

export interface PracticeSession {
  id: string;
  title: string;
  description: string;
  icon: string;
  exercises: PracticeExercise[];
  timeEstimate: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export const mockPracticeData: PracticeSession[] = [
  {
    id: "flashcards-1",
    title: "Greeting Flashcards",
    description: "Practice basic greetings with interactive flashcards",
    icon: "📚",
    timeEstimate: "5 min",
    difficulty: "Easy",
    exercises: [
      {
        id: "flash-1",
        type: "flashcard",
        question: "Molo",
        correctAnswer: "Hello",
        points: 5,
      },
      {
        id: "flash-2",
        type: "flashcard",
        question: "Sawubona",
        correctAnswer: "Hello (Zulu)",
        points: 5,
      },
    ],
  },
  {
    id: "word-match-1",
    title: "Word Matching",
    description: "Match words with their meanings",
    icon: "🎯",
    timeEstimate: "10 min",
    difficulty: "Medium",
    exercises: [
      {
        id: "match-1",
        type: "word-match",
        question: "Match: Dumela",
        options: ["Goodbye", "Hello", "Thank you", "Please"],
        correctAnswer: "Hello",
        points: 10,
      },
    ],
  },
  {
    id: "listening-1",
    title: "Listening Practice",
    description: "Listen and choose the correct meaning",
    icon: "👂",
    timeEstimate: "8 min",
    difficulty: "Medium",
    exercises: [
      {
        id: "listen-1",
        type: "listening",
        question: "What does this mean?",
        options: ["Hello", "Goodbye", "Thank you", "Yes"],
        correctAnswer: "Hello",
        audio: "molo.mp3",
        points: 15,
      },
    ],
  },
  {
    id: "daily-quiz",
    title: "Daily Quick Quiz",
    description: "5 random questions from your lessons",
    icon: "⚡",
    timeEstimate: "3 min",
    difficulty: "Easy",
    exercises: [
      {
        id: "quiz-1",
        type: "quiz",
        question: 'How do you say "Hello" in Xhosa?',
        options: ["Molo", "Sawubona", "Dumela", "Sanibonani"],
        correctAnswer: "Molo",
        points: 20,
      },
    ],
  },
];
