export interface User {
  id: string;
  name: string;
  avatar: string;
  userType: "learner" | "native" | "tutor";
  country?: string;
  languages: string[];
  xp: number;
  badges: string[];
  nativeLanguage?: string;
  targetLanguage?: string;
  level?: "beginner" | "intermediate" | "advanced";
  bio?: string;
  streak?: number;
  followers?: number;
  following?: number;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  tags: string[];
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  language: string;
  category: "discussion" | "question" | "cultural" | "pronunciation";
  reactions: {
    [emoji: string]: number;
  };
  trending?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  timestamp: Date;
  likes: number;
  replies: Comment[];
  audioUrl?: string;
  videoUrl?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "speaking" | "writing" | "translation" | "cultural";
  language: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  deadline: Date;
  participants: number;
  submissions: ChallengeSubmission[];
  xpReward: number;
  badge?: string;
  isActive: boolean;
}

export interface ChallengeSubmission {
  id: string;
  user: User;
  content?: string;
  audioUrl?: string;
  videoUrl?: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "podcast" | "video" | "pdf" | "article" | "playlist" | "study_group";
  language: string;
  url: string;
  thumbnail?: string;
  author?: User;
  tags: string[];
  bookmarks: number;
  isBookmarked: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration?: string;
  rating: number;
  reviews: number;
}

// Mock data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Learns",
    avatar: "👩🏽‍🎓",
    userType: "learner",
    country: "US",
    languages: ["Yoruba", "English"],
    xp: 1250,
    badges: ["First Post", "Weekly Challenger"],
  },
  {
    id: "2",
    name: "Kwame Asante",
    avatar: "👨🏿‍🏫",
    userType: "native",
    country: "GH",
    languages: ["Akan", "English"],
    xp: 3500,
    badges: ["Native Helper", "Community Star", "Mentor"],
  },
  {
    id: "3",
    name: "Amina Hassan",
    avatar: "👩🏿‍💼",
    userType: "tutor",
    country: "KE",
    languages: ["Swahili", "English"],
    xp: 2800,
    badges: ["Tutor", "Challenge Creator", "Audio Master"],
  },
];

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Pronunciation tips for beginners",
    content:
      "I've been struggling with certain sounds in Yoruba. Any native speakers willing to help with the tones?",
    author: mockUsers[0],
    tags: ["Yoruba", "Pronunciation", "Beginner"],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 45,
    comments: 24,
    isLiked: false,
    language: "Yoruba",
    category: "pronunciation",
    reactions: { "👍": 45, "🔥": 12, "👏": 8 },
    trending: true,
  },
  {
    id: "2",
    title: "Best resources for intermediate level",
    content:
      "Looking for recommendations beyond the basic courses. What helped you progress from intermediate to advanced?",
    author: mockUsers[1],
    tags: ["Resources", "Intermediate", "Study Tips"],
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    likes: 32,
    comments: 18,
    isLiked: true,
    language: "General",
    category: "discussion",
    reactions: { "👍": 32, "💡": 15, "📚": 9 },
  },
  {
    id: "3",
    title: "Weekly Challenge: Cultural phrases",
    content:
      "This week's challenge: Share common cultural expressions from your target language and explain their meaning!",
    author: mockUsers[2],
    tags: ["Challenge", "Culture", "Weekly"],
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    likes: 89,
    comments: 67,
    isLiked: false,
    language: "General",
    category: "cultural",
    reactions: { "👍": 89, "🎯": 25, "🌍": 18 },
  },
];

export const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Record Three Zulu Greetings",
    description:
      'Practice your pronunciation by recording yourself saying "Sawubona", "Unjani", and "Ngiyaphila" in Zulu.',
    type: "speaking",
    language: "Zulu",
    difficulty: "beginner",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    participants: 127,
    submissions: [],
    xpReward: 50,
    badge: "Zulu Speaker",
    isActive: true,
  },
  {
    id: "2",
    title: "Family Description in Swahili",
    description:
      "Write a short paragraph (5-7 sentences) describing your family members using Swahili vocabulary.",
    type: "writing",
    language: "Swahili",
    difficulty: "intermediate",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    participants: 89,
    submissions: [],
    xpReward: 75,
    badge: "Family Storyteller",
    isActive: true,
  },
  {
    id: "3",
    title: "Translate Yoruba Proverb",
    description:
      'Translate this proverb: "Ọmọ tí kò gbọ́n tó bá gbọ́n, yóó ní ìyá ẹ lọ́gbọ́n" and explain its cultural significance.',
    type: "translation",
    language: "Yoruba",
    difficulty: "advanced",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    participants: 45,
    submissions: [],
    xpReward: 100,
    badge: "Wisdom Keeper",
    isActive: true,
  },
];

export const mockResources: Resource[] = [
  {
    id: "1",
    title: "Afrobeats & Language Learning Podcast",
    description:
      "Learn Yoruba through music! Each episode breaks down popular Afrobeats songs.",
    type: "podcast",
    language: "Yoruba",
    url: "https://example.com/podcast",
    thumbnail: "🎧",
    author: mockUsers[1],
    tags: ["Music", "Yoruba", "Culture", "Intermediate"],
    bookmarks: 234,
    isBookmarked: false,
    difficulty: "intermediate",
    duration: "45 min",
    rating: 4.8,
    reviews: 67,
  },
  {
    id: "2",
    title: "Swahili Market Conversations",
    description:
      "Real conversations recorded at markets in Dar es Salaam. Perfect for practical vocabulary.",
    type: "video",
    language: "Swahili",
    url: "https://example.com/video",
    thumbnail: "🎥",
    author: mockUsers[2],
    tags: ["Practical", "Swahili", "Beginner", "Conversation"],
    bookmarks: 189,
    isBookmarked: true,
    difficulty: "beginner",
    duration: "12 min",
    rating: 4.6,
    reviews: 43,
  },
  {
    id: "3",
    title: "Complete Zulu Grammar Guide",
    description:
      "Comprehensive PDF covering all aspects of Zulu grammar with examples and exercises.",
    type: "pdf",
    language: "Zulu",
    url: "https://example.com/pdf",
    thumbnail: "📄",
    tags: ["Grammar", "Zulu", "Reference", "Advanced"],
    bookmarks: 156,
    isBookmarked: false,
    difficulty: "advanced",
    rating: 4.9,
    reviews: 28,
  },
  {
    id: "4",
    title: "Akan Learning Circle - WhatsApp",
    description:
      "Join our active WhatsApp group for daily Akan practice with native speakers.",
    type: "study_group",
    language: "Akan",
    url: "https://chat.whatsapp.com/example",
    thumbnail: "👥",
    tags: ["Community", "Akan", "Practice", "Native Speakers"],
    bookmarks: 92,
    isBookmarked: false,
    difficulty: "beginner",
    rating: 4.7,
    reviews: 15,
  },
];

// New interfaces for additional features
export interface PracticePartner {
  id: string;
  user: User;
  nativeLanguage: string;
  targetLanguage: string;
  level: "beginner" | "intermediate" | "advanced";
  interests: string[];
  availability: string;
  matchScore: number;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: "text" | "voice" | "image";
  isRead: boolean;
}

export interface ConversationPrompt {
  id: string;
  category: string;
  prompt: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface Group {
  id: string;
  name: string;
  description: string;
  language: string;
  avatar: string;
  memberCount: number;
  weeklyXpGoal: number;
  currentXp: number;
  groupStreak: number;
  type: "public" | "private";
  category: string;
  isMember: boolean;
  topMembers: User[];
}

export interface UserProfile extends User {
  joinedDate: Date;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  achievements: Achievement[];
  recentActivity: Activity[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Activity {
  id: string;
  type: "lesson" | "challenge" | "streak" | "achievement" | "post";
  description: string;
  timestamp: Date;
  xpEarned?: number;
}

// Mock data for new features
export const mockPracticePartners: PracticePartner[] = [
  {
    id: "1",
    user: {
      id: "p1",
      name: "Chioma Okafor",
      avatar: "👩🏿‍💼",
      userType: "native",
      country: "NG",
      languages: ["Yoruba", "Igbo", "English"],
      xp: 2400,
      badges: ["Native Speaker", "Helpful Partner"],
      nativeLanguage: "Yoruba",
      targetLanguage: "French",
      level: "intermediate",
      bio: "Native Yoruba speaker looking to practice French",
      streak: 45,
    },
    nativeLanguage: "Yoruba",
    targetLanguage: "French",
    level: "intermediate",
    interests: ["Culture", "Music", "Food"],
    availability: "Evenings (GMT+1)",
    matchScore: 95,
    isOnline: true,
  },
  {
    id: "2",
    user: {
      id: "p2",
      name: "Themba Ndlovu",
      avatar: "👨🏿‍🎓",
      userType: "learner",
      country: "ZA",
      languages: ["Zulu", "English"],
      xp: 1800,
      badges: ["Fast Learner", "Weekly Challenger"],
      nativeLanguage: "English",
      targetLanguage: "Zulu",
      level: "beginner",
      bio: "Learning Zulu to connect with my roots",
      streak: 28,
    },
    nativeLanguage: "English",
    targetLanguage: "Zulu",
    level: "beginner",
    interests: ["History", "Travel", "Sports"],
    availability: "Weekends",
    matchScore: 88,
    isOnline: false,
  },
  {
    id: "3",
    user: {
      id: "p3",
      name: "Fatima Diallo",
      avatar: "👩🏾‍🏫",
      userType: "tutor",
      country: "SN",
      languages: ["Wolof", "French", "English"],
      xp: 3200,
      badges: ["Master Tutor", "Community Star"],
      nativeLanguage: "Wolof",
      targetLanguage: "English",
      level: "advanced",
      bio: "Teaching Wolof and practicing English conversation",
      streak: 67,
    },
    nativeLanguage: "Wolof",
    targetLanguage: "English",
    level: "advanced",
    interests: ["Teaching", "Literature", "Culture"],
    availability: "Flexible",
    matchScore: 92,
    isOnline: true,
  },
];

export const mockConversationPrompts: ConversationPrompt[] = [
  {
    id: "1",
    category: "Greetings",
    prompt: "Introduce yourself and ask about their day",
    difficulty: "beginner",
  },
  {
    id: "2",
    category: "Food",
    prompt: "Discuss your favorite traditional dishes and recipes",
    difficulty: "intermediate",
  },
  {
    id: "3",
    category: "Culture",
    prompt: "Share a story about an important cultural celebration in your community",
    difficulty: "advanced",
  },
  {
    id: "4",
    category: "Travel",
    prompt: "Describe a place you'd like to visit and why",
    difficulty: "intermediate",
  },
  {
    id: "5",
    category: "Family",
    prompt: "Talk about your family traditions and customs",
    difficulty: "beginner",
  },
];

export const mockGroups: Group[] = [
  {
    id: "1",
    name: "Yoruba Warriors 🦁",
    description: "Daily practice group for dedicated Yoruba learners. Join us for weekly challenges and cultural discussions!",
    language: "Yoruba",
    avatar: "🦁",
    memberCount: 156,
    weeklyXpGoal: 5000,
    currentXp: 4230,
    groupStreak: 23,
    type: "public",
    category: "Study Group",
    isMember: true,
    topMembers: [mockUsers[0], mockUsers[1]],
  },
  {
    id: "2",
    name: "Swahili Circle",
    description: "Practice conversational Swahili with native speakers and learners from East Africa.",
    language: "Swahili",
    avatar: "🌍",
    memberCount: 203,
    weeklyXpGoal: 7500,
    currentXp: 6890,
    groupStreak: 45,
    type: "public",
    category: "Conversation",
    isMember: false,
    topMembers: [mockUsers[2]],
  },
  {
    id: "3",
    name: "Zulu Beginners Hub",
    description: "Supportive community for those just starting their Zulu journey. We help each other learn!",
    language: "Zulu",
    avatar: "🌱",
    memberCount: 89,
    weeklyXpGoal: 3000,
    currentXp: 2100,
    groupStreak: 12,
    type: "public",
    category: "Beginners",
    isMember: true,
    topMembers: [mockUsers[0]],
  },
  {
    id: "4",
    name: "Akan Culture & Language",
    description: "Explore Akan language alongside its rich cultural heritage. Storytelling, proverbs, and more!",
    language: "Akan",
    avatar: "👑",
    memberCount: 127,
    weeklyXpGoal: 4500,
    currentXp: 3800,
    groupStreak: 34,
    type: "public",
    category: "Culture",
    isMember: false,
    topMembers: [mockUsers[1]],
  },
  {
    id: "5",
    name: "Wolof Advanced Learners",
    description: "For advanced learners ready to dive deep into complex grammar and literature.",
    language: "Wolof",
    avatar: "📚",
    memberCount: 45,
    weeklyXpGoal: 6000,
    currentXp: 5200,
    groupStreak: 18,
    type: "private",
    category: "Advanced",
    isMember: false,
    topMembers: [],
  },
];

export const mockUserProfile: UserProfile = {
  id: "current_user",
  name: "Alex Johnson",
  avatar: "👤",
  userType: "learner",
  country: "US",
  languages: ["Yoruba", "Swahili"],
  xp: 2450,
  badges: ["First Post", "Weekly Challenger", "7-Day Streak"],
  nativeLanguage: "English",
  targetLanguage: "Yoruba",
  level: "intermediate",
  bio: "Passionate about learning African languages and connecting with native speakers!",
  streak: 15,
  followers: 48,
  following: 32,
  joinedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  totalXp: 2450,
  currentStreak: 15,
  longestStreak: 21,
  lessonsCompleted: 67,
  achievements: [
    {
      id: "1",
      title: "First Steps",
      description: "Complete your first lesson",
      icon: "🎯",
      earnedDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
      rarity: "common",
    },
    {
      id: "2",
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      earnedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      rarity: "rare",
    },
    {
      id: "3",
      title: "Social Butterfly",
      description: "Make your first post in the community",
      icon: "🦋",
      earnedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      rarity: "common",
    },
    {
      id: "4",
      title: "Challenge Champion",
      description: "Complete 5 community challenges",
      icon: "🏆",
      earnedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      rarity: "epic",
    },
  ],
  recentActivity: [
    {
      id: "1",
      type: "lesson",
      description: "Completed 'Yoruba Greetings' lesson",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      xpEarned: 50,
    },
    {
      id: "2",
      type: "challenge",
      description: "Joined 'Record Three Zulu Greetings' challenge",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: "3",
      type: "streak",
      description: "Achieved 15-day streak!",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      xpEarned: 25,
    },
    {
      id: "4",
      type: "post",
      description: "Posted in Yoruba Discussion Hub",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ],
};
