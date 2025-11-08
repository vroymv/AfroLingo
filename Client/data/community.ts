export interface User {
  id: string;
  name: string;
  avatar: string;
  userType: "learner" | "native" | "tutor";
  country?: string;
  languages: string[];
  xp: number;
  badges: string[];
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
