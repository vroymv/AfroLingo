export type SeedTutorAvailability = "online" | "offline" | "away";

export type SeedTutor = {
  id: string;
  name: string;
  language: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  specialties: string[];
  bio: string;
  avatar: string;
  availability: SeedTutorAvailability;
  lessonsCompleted: number;
};

// Mirrors Client/data/tutors.ts (MOCK_TUTORS)
export const TUTORS: SeedTutor[] = [
  {
    id: "1",
    name: "Amina Kamau",
    language: "Swahili",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 25,
    specialties: ["Conversational", "Business"],
    bio: "Native Swahili speaker with 8 years teaching experience. Specialized in helping professionals.",
    avatar: "https://i.pravatar.cc/150?img=5",
    availability: "online",
    lessonsCompleted: 340,
  },
  {
    id: "2",
    name: "Kofi Mensah",
    language: "Akan (Twi)",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 22,
    specialties: ["Beginner Friendly", "Cultural Context"],
    bio: "Passionate about sharing Ghanaian culture and language. Patient with beginners.",
    avatar: "https://i.pravatar.cc/150?img=12",
    availability: "online",
    lessonsCompleted: 256,
  },
  {
    id: "3",
    name: "Zuri Okafor",
    language: "Igbo",
    rating: 5.0,
    reviewCount: 203,
    hourlyRate: 28,
    specialties: ["Advanced", "Literature"],
    bio: "PhD in African Languages. Specializing in advanced learners and Igbo literature.",
    avatar: "https://i.pravatar.cc/150?img=9",
    availability: "away",
    lessonsCompleted: 512,
  },
  {
    id: "4",
    name: "Kwame Asante",
    language: "Swahili",
    rating: 4.7,
    reviewCount: 64,
    hourlyRate: 20,
    specialties: ["Grammar", "Writing"],
    bio: "Focus on grammar fundamentals and written communication. Clear and structured lessons.",
    avatar: "https://i.pravatar.cc/150?img=15",
    availability: "offline",
    lessonsCompleted: 178,
  },
  {
    id: "5",
    name: "Fatima Ndiaye",
    language: "Wolof",
    rating: 4.9,
    reviewCount: 145,
    hourlyRate: 24,
    specialties: ["Pronunciation", "Kids & Teens"],
    bio: "Energetic tutor specializing in pronunciation and teaching young learners.",
    avatar: "https://i.pravatar.cc/150?img=20",
    availability: "online",
    lessonsCompleted: 389,
  },
];
