export type TutorChatUserSummary = {
  id: string;
  name: string;
  profileImageUrl?: string | null;
};

export type TutorChatMessage = {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  clientMessageId: string;
  createdAt: string;
};

export type TutorChatThread = {
  id: string;
  learnerId: string;
  tutorId: string;

  learnerLastReadAt?: string | null;
  tutorLastReadAt?: string | null;
  lastMessageAt?: string | null;

  otherUser?: TutorChatUserSummary;
  lastMessage?: {
    id: string;
    body: string;
    senderId: string;
    createdAt: string;
  } | null;

  createdAt?: string;
  updatedAt?: string;
};

export type Paginated<T> = {
  items: T[];
  nextCursor: string | null;
};
