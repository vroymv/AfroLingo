export type TutorAvailability = "online" | "away" | "offline";

export type Tutor = {
  id: string;
  name: string;
  language: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  specialties: string[];
  bio: string;
  avatar: string;
  availability: TutorAvailability;
  lessonsCompleted: number;
};
