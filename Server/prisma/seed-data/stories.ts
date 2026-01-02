export type SeedStoryDifficulty = "Beginner" | "Intermediate" | "Advanced";
export type SeedStoryType = "dialogue" | "narrative" | "cultural";
export type SeedStoryCategory =
  | "greeting"
  | "dialogue"
  | "culture"
  | "everyday";

export interface SeedStorySegment {
  id: string;
  text: string;
  translation: string;
  audio?: string;
  highlightedWords: string[];
  speaker?: string;
}

export interface SeedStoryQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface SeedStory {
  id: string;
  title: string;
  description: string;
  cover: string;
  difficulty: SeedStoryDifficulty;
  estimatedTime: string;
  type: SeedStoryType;
  segments: SeedStorySegment[];
  questions?: SeedStoryQuestion[];
  totalWords: number;
  category: SeedStoryCategory;
}

export const STORIES: SeedStory[] = [
  {
    id: "story-1",
    title: "Daily Greetings",
    description: "Learn how to greet people in different situations",
    cover: "👋",
    difficulty: "Beginner",
    estimatedTime: "2 min",
    type: "dialogue",
    totalWords: 12,
    category: "greeting",
    segments: [
      {
        id: "seg-1",
        text: "Molo!",
        translation: "Hello!",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["molo"],
        speaker: "Person 1",
      },
      {
        id: "seg-2",
        text: "Molo! Unjani?",
        translation: "Hello! How are you?",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["unjani"],
        speaker: "Person 2",
      },
      {
        id: "seg-3",
        text: "Ndiphilile, enkosi. Wena unjani?",
        translation: "I am well, thank you. And you?",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["ndiphilile", "enkosi"],
        speaker: "Person 1",
      },
      {
        id: "seg-4",
        text: "Nam ndiphilile. Usale kakuhle!",
        translation: "I am also well. Stay well!",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["usale kakuhle"],
        speaker: "Person 2",
      },
    ],
    questions: [
      {
        id: "q-1",
        question: "How do you say 'Hello' in isiXhosa?",
        options: ["Molo", "Enkosi", "Unjani", "Ndiphilile"],
        correctAnswer: 0,
        explanation: "'Molo' is the most common way to say hello in isiXhosa.",
      },
      {
        id: "q-2",
        question: "What does 'Unjani?' mean?",
        options: ["Thank you", "How are you?", "Goodbye", "Hello"],
        correctAnswer: 1,
        explanation: "'Unjani?' is used to ask 'How are you?' in isiXhosa.",
      },
    ],
  },
  {
    id: "story-2",
    title: "Meeting a Friend",
    description: "A warm conversation between two old friends",
    cover: "🤝",
    difficulty: "Beginner",
    estimatedTime: "3 min",
    type: "dialogue",
    totalWords: 18,
    category: "dialogue",
    segments: [
      {
        id: "seg-5",
        text: "Molo Sipho! Udibene njani?",
        translation: "Hello Sipho! How have you been?",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["udibene"],
        speaker: "Thandi",
      },
      {
        id: "seg-6",
        text: "Ndiphilile, Thandi. Kudala ndingakubonanga!",
        translation: "I'm well, Thandi. I haven't seen you in a long time!",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["kudala"],
        speaker: "Sipho",
      },
      {
        id: "seg-7",
        text: "Ewe, kudala! Kumnandi ukukubona.",
        translation: "Yes, it's been long! Nice to see you.",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["kumnandi"],
        speaker: "Thandi",
      },
      {
        id: "seg-8",
        text: "Nam ndiyavuya. Masenze iplani yokuhlangana.",
        translation: "I'm also happy. Let's make a plan to meet.",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["masenze", "iplani"],
        speaker: "Sipho",
      },
    ],
    questions: [
      {
        id: "q-3",
        question: "What does 'Kudala' mean?",
        options: ["Yesterday", "Long time", "Today", "Tomorrow"],
        correctAnswer: 1,
        explanation: "'Kudala' means 'long time' or 'a long time ago'.",
      },
    ],
  },
  {
    id: "story-3",
    title: "At the Market",
    description: "Shopping for fresh produce at a local market",
    cover: "🍎",
    difficulty: "Intermediate",
    estimatedTime: "4 min",
    type: "narrative",
    totalWords: 28,
    category: "everyday",
    segments: [
      {
        id: "seg-9",
        text: "Molo mama, mingaphi iiapile?",
        translation: "Hello mother, how much are the apples?",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["mingaphi", "iiapile"],
        speaker: "Customer",
      },
      {
        id: "seg-10",
        text: "Zimalini ezintlanu, mntwana.",
        translation: "Five rands each, my child.",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["zimalini"],
        speaker: "Seller",
      },
      {
        id: "seg-11",
        text: "Ndifuna ezintathu. Namabhanana?",
        translation: "I want three. And bananas?",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["ezintathu", "amabhanana"],
        speaker: "Customer",
      },
      {
        id: "seg-12",
        text: "Awu, namhlanje azikho. Kodwa sinetomato ezimnandi.",
        translation: "Oh, today we don't have any. But we have nice tomatoes.",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["azikho", "iitomato"],
        speaker: "Seller",
      },
      {
        id: "seg-13",
        text: "Kulungile. Ndithenga iiapile ezintathu.",
        translation: "Okay. I'll buy three apples.",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["ndithenga"],
        speaker: "Customer",
      },
    ],
    questions: [
      {
        id: "q-4",
        question: "What does 'Mingaphi' mean?",
        options: ["How many?", "How much?", "Where?", "When?"],
        correctAnswer: 1,
        explanation:
          "'Mingaphi' is used to ask 'How much?' when asking for prices.",
      },
      {
        id: "q-5",
        question: "How do you say 'I want' in isiXhosa?",
        options: ["Ndithenga", "Ndifuna", "Mingaphi", "Kulungile"],
        correctAnswer: 1,
        explanation: "'Ndifuna' means 'I want' in isiXhosa.",
      },
    ],
  },
  {
    id: "story-4",
    title: "Family Introduction",
    description: "Introducing family members to a friend",
    cover: "👨‍👩‍👧‍👦",
    difficulty: "Intermediate",
    estimatedTime: "4 min",
    type: "dialogue",
    totalWords: 25,
    category: "dialogue",
    segments: [
      {
        id: "seg-14",
        text: "Le nguThabo, umntwan' am.",
        translation: "This is Thabo, my child.",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["umntwan'am"],
        speaker: "Parent",
      },
      {
        id: "seg-15",
        text: "Molo Thabo! Uneminyaka emingaphi?",
        translation: "Hello Thabo! How old are you?",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["uneminyaka emingaphi"],
        speaker: "Friend",
      },
      {
        id: "seg-16",
        text: "Ndineminyaka esixhenxe.",
        translation: "I am seven years old.",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["ndineminyaka", "esixhenxe"],
        speaker: "Thabo",
      },
      {
        id: "seg-17",
        text: "Hayi! Uyakhula kakhulu!",
        translation: "Wow! You're growing so much!",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["uyakhula"],
        speaker: "Friend",
      },
    ],
    questions: [
      {
        id: "q-6",
        question: "How do you ask someone's age in isiXhosa?",
        options: [
          "Ngubani igama lakho?",
          "Uneminyaka emingaphi?",
          "Uhlala phi?",
          "Unjani?",
        ],
        correctAnswer: 1,
        explanation:
          "'Uneminyaka emingaphi?' literally means 'How many years do you have?'",
      },
    ],
  },
  {
    id: "story-5",
    title: "Traditional Celebration",
    description: "Experience a joyful traditional African celebration",
    cover: "🎉",
    difficulty: "Advanced",
    estimatedTime: "6 min",
    type: "cultural",
    totalWords: 35,
    category: "culture",
    segments: [
      {
        id: "seg-18",
        text: "Namhlanje siyathokoza! Yinto enkulu le.",
        translation: "Today we are celebrating! This is a big thing.",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["siyathokoza", "yinto enkulu"],
        speaker: "Host",
      },
      {
        id: "seg-19",
        text: "Yonke indlu iyavuya. Makudlalwe umculo!",
        translation: "The whole family is happy. Let the music play!",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["indlu", "umculo"],
        speaker: "Elder",
      },
      {
        id: "seg-20",
        text: "Sisidlo esihle namhlanje. Enkosi kuni nonke.",
        translation: "We have good food today. Thank you all.",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["isidlo", "nonke"],
        speaker: "Cook",
      },
      {
        id: "seg-21",
        text: "Masenze ingoma yesizwe sethu!",
        translation: "Let's sing the song of our nation!",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["ingoma", "isizwe"],
        speaker: "Youth",
      },
      {
        id: "seg-22",
        text: "Ewe! Yizani, masikuhlabele sonke!",
        translation: "Yes! Come, let's all sing together!",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["yizani", "masikuhlabele"],
        speaker: "All",
      },
    ],
    questions: [
      {
        id: "q-7",
        question: "What does 'Siyathokoza' mean?",
        options: [
          "We are sad",
          "We are celebrating",
          "We are working",
          "We are sleeping",
        ],
        correctAnswer: 1,
        explanation:
          "'Siyathokoza' means 'we are celebrating' or 'we are happy'.",
      },
      {
        id: "q-8",
        question: "What is 'umculo'?",
        options: ["Food", "Dance", "Music", "Family"],
        correctAnswer: 2,
        explanation: "'Umculo' means 'music' in isiXhosa.",
      },
    ],
  },
  {
    id: "story-6",
    title: "Morning Routine",
    description: "A typical morning conversation in a household",
    cover: "☀️",
    difficulty: "Beginner",
    estimatedTime: "3 min",
    type: "narrative",
    totalWords: 15,
    category: "everyday",
    segments: [
      {
        id: "seg-23",
        text: "Vuka! Kusasa namhlanje.",
        translation: "Wake up! It's morning today.",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["vuka", "kusasa"],
        speaker: "Mother",
      },
      {
        id: "seg-24",
        text: "Molo mama. Ndifuna ukuphumla.",
        translation: "Hello mother. I want to rest.",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["ndifuna", "ukuphumla"],
        speaker: "Child",
      },
      {
        id: "seg-25",
        text: "Hayi! Kufuneka uye esikolweni.",
        translation: "No! You need to go to school.",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["kufuneka", "esikolweni"],
        speaker: "Mother",
      },
      {
        id: "seg-26",
        text: "Kulungile mama. Ndiyavuka.",
        translation: "Okay mother. I'm waking up.",
        audio:
          "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
        highlightedWords: ["ndiyavuka"],
        speaker: "Child",
      },
    ],
    questions: [
      {
        id: "q-9",
        question: "What does 'Vuka' mean?",
        options: ["Sleep", "Wake up", "Eat", "Play"],
        correctAnswer: 1,
        explanation: "'Vuka' is a command meaning 'wake up' in isiXhosa.",
      },
    ],
  },
];
