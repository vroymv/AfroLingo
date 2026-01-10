export type CommunityPostCategory =
  | "discussion"
  | "question"
  | "cultural"
  | "pronunciation";

export type CommunityUserType = "learner" | "native" | "tutor";

export type CommunityAuthor = {
  id: string;
  name: string;
  avatar: string;
  userType: CommunityUserType;
  country?: string;
  languages: string[];
  xp: number;
  badges: string[];
};

export type CommunityPost = {
  id: string;
  title: string;
  content: string;
  author: CommunityAuthor;
  tags: string[];
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  language: string;
  category: CommunityPostCategory;
  reactions: Record<string, number>;
  trending?: boolean;
};
