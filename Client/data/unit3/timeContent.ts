import type { Activity } from "@/data/lessons";

export type VocabularyItem = {
  swahili: string;
  english: string;
  pronunciation: string;
  image?: string;
  audio?: string;
};

export type SpellingItem = {
  partial: string;
  complete: string;
  hint: string;
  image?: string;
};

export type MatchPair = {
  left: string;
  right: string;
};

export type ConversationLine = {
  speaker: string;
  text: string;
  translation: string;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  translation: string;
  audio: string;
};

export type ListeningDictationContent = {
  question: string;
  description?: string;
  audio?: string;
  sampleAnswer?: string;
};

type ActivityContent = Partial<Activity> & {
  items?: any[];
  pairs?: MatchPair[];
  conversation?: ConversationLine[];
  dialogue?: DialogueLine[];
};

const vocabularyTables: Record<
  string,
  {
    question: string;
    description?: string;
    audio?: string;
    items: VocabularyItem[];
  }
> = {
  "activity-time-2": {
    question: "Days of the Week",
    description: "Learn the seven days",
    audio: "/assets/audio/Karaoke-type-test-audio.mp3",
    items: [
      {
        swahili: "Jumatatu",
        english: "Monday",
        pronunciation: "joo-mah-tah-too",
      },
      { swahili: "Jumanne", english: "Tuesday", pronunciation: "joo-mah-neh" },
      {
        swahili: "Jumatano",
        english: "Wednesday",
        pronunciation: "joo-mah-tah-no",
      },
      {
        swahili: "Alhamisi",
        english: "Thursday",
        pronunciation: "al-hah-mee-see",
      },
      { swahili: "Ijumaa", english: "Friday", pronunciation: "ee-joo-mah" },
      {
        swahili: "Jumamosi",
        english: "Saturday",
        pronunciation: "joo-mah-mo-see",
      },
      {
        swahili: "Jumapili",
        english: "Sunday",
        pronunciation: "joo-mah-pee-lee",
      },
    ],
  },
  "activity-time-3": {
    question: "Months of the Year",
    description: "Learn all twelve months",
    audio: "/assets/audio/Karaoke-type-test-audio.mp3",
    items: [
      {
        swahili: "Januari",
        english: "January",
        pronunciation: "jah-noo-ah-ree",
      },
      {
        swahili: "Februari",
        english: "February",
        pronunciation: "feh-broo-ah-ree",
      },
      { swahili: "Machi", english: "March", pronunciation: "mah-chee" },
      { swahili: "Aprili", english: "April", pronunciation: "ah-pree-lee" },
      { swahili: "Mei", english: "May", pronunciation: "meh-ee" },
      { swahili: "Juni", english: "June", pronunciation: "joo-nee" },
      { swahili: "Julai", english: "July", pronunciation: "joo-lah-ee" },
      { swahili: "Agosti", english: "August", pronunciation: "ah-go-stee" },
      {
        swahili: "Septemba",
        english: "September",
        pronunciation: "seh-ptem-bah",
      },
      { swahili: "Oktoba", english: "October", pronunciation: "ok-to-bah" },
      { swahili: "Novemba", english: "November", pronunciation: "no-vem-bah" },
      { swahili: "Desemba", english: "December", pronunciation: "deh-sem-bah" },
    ],
  },
  "activity-time-4": {
    question: "Seasons",
    description: "Learn about the seasons",
    audio: "/assets/audio/Karaoke-type-test-audio.mp3",
    items: [
      {
        swahili: "Kiangazi",
        english: "Summer/Dry Season",
        pronunciation: "kee-ah-ngah-zee",
      },
      {
        swahili: "Masika",
        english: "Rainy Season",
        pronunciation: "mah-see-kah",
      },
      {
        swahili: "Kipupwe",
        english: "Cool Season",
        pronunciation: "kee-poo-pweh",
      },
      {
        swahili: "Majira",
        english: "Seasons (general)",
        pronunciation: "mah-jee-rah",
      },
    ],
  },
};

const spellingSets: Record<
  string,
  { question: string; description?: string; items: SpellingItem[] }
> = {
  "activity-time-8": {
    question: "Complete the Days of the Week",
    description: "Fill in the missing letters to complete each day",
    items: [
      { complete: "Jumatatu", partial: "Juma_a_u", hint: "Monday" },
      { complete: "Jumanne", partial: "Juma__e", hint: "Tuesday" },
      { complete: "Jumatano", partial: "Juma_an_", hint: "Wednesday" },
      { complete: "Alhamisi", partial: "Al_ami_i", hint: "Thursday" },
      { complete: "Ijumaa", partial: "I_um_a", hint: "Friday" },
      { complete: "Jumamosi", partial: "Juma_o_i", hint: "Saturday" },
      { complete: "Jumapili", partial: "Juma_i_i", hint: "Sunday" },
    ],
  },
  "activity-time-9": {
    question: "Complete the Months of the Year",
    description: "Fill in the missing letters to complete each month",
    items: [
      { complete: "Januari", partial: "Jan_a_i", hint: "January" },
      { complete: "Februari", partial: "Feb_ua_i", hint: "February" },
      { complete: "Machi", partial: "Ma_h_", hint: "March" },
      { complete: "Aprili", partial: "Ap_i_i", hint: "April" },
      { complete: "Mei", partial: "M_i", hint: "May" },
      { complete: "Juni", partial: "Ju_i", hint: "June" },
      { complete: "Julai", partial: "Jul_i", hint: "July" },
      { complete: "Agosti", partial: "Ago_t_", hint: "August" },
      { complete: "Septemba", partial: "Sep_em_a", hint: "September" },
      { complete: "Oktoba", partial: "Ok_o_a", hint: "October" },
      { complete: "Novemba", partial: "Nov_m_a", hint: "November" },
      { complete: "Desemba", partial: "Des_m_a", hint: "December" },
    ],
  },
};

const matchingSets: Record<
  string,
  { question: string; description?: string; pairs: MatchPair[] }
> = {
  "activity-time-12": {
    question: "Match Days to English",
    description: "Connect the Swahili days with their English translations",
    pairs: [
      { left: "Jumatatu", right: "Monday" },
      { left: "Jumanne", right: "Tuesday" },
      { left: "Jumatano", right: "Wednesday" },
      { left: "Alhamisi", right: "Thursday" },
      { left: "Ijumaa", right: "Friday" },
      { left: "Jumamosi", right: "Saturday" },
      { left: "Jumapili", right: "Sunday" },
    ],
  },
  "activity-time-13": {
    question: "Match Months to English",
    description: "Connect the Swahili months with their English translations",
    pairs: [
      { left: "Januari", right: "January" },
      { left: "Februari", right: "February" },
      { left: "Machi", right: "March" },
      { left: "Aprili", right: "April" },
      { left: "Mei", right: "May" },
      { left: "Juni", right: "June" },
    ],
  },
};

const listeningDictations: Record<string, ListeningDictationContent> = {
  "activity-time-14": {
    question: "Listening Exercise: Days and Months",
    description: "Write the days and months you hear",
    audio: "/assets/audio/Karaoke-type-test-audio.mp3",
    sampleAnswer:
      "Jumatatu, Jumanne, Jumatano, Alhamisi, Ijumaa, Jumamosi, Jumapili; Januari, Februari, Machi, Aprili, Mei, Juni",
  },
};

const conversations: Record<
  string,
  { question: string; description?: string; conversation: ConversationLine[] }
> = {
  "activity-time-15": {
    question: "Practice Talking About Days",
    description: "Practice asking and answering about days of the week",
    conversation: [
      {
        speaker: "Person A",
        text: "Leo ni siku gani?",
        translation: "What day is it today?",
      },
      {
        speaker: "Person B",
        text: "Leo ni Jumatatu",
        translation: "Today is Monday",
      },
      {
        speaker: "Person A",
        text: "Kesho ni siku gani?",
        translation: "What day is tomorrow?",
      },
      {
        speaker: "Person B",
        text: "Kesho ni Jumanne",
        translation: "Tomorrow is Tuesday",
      },
    ],
  },
};

const dialogues: Record<
  string,
  {
    question: string;
    description?: string;
    audio?: string;
    dialogue: DialogueLine[];
  }
> = {
  "activity-time-16": {
    question: "Planning a Meeting",
    description: "Listen to people planning when to meet",
    audio: "/assets/audio/Karaoke-type-test-audio.mp3",
    dialogue: [
      {
        speaker: "Amina",
        text: "Tutakutana siku gani?",
        translation: "What day shall we meet?",
        audio: "/assets/audio/Karaoke-type-test-audio.mp3",
      },
      {
        speaker: "Juma",
        text: "Tutakutana Ijumaa",
        translation: "We'll meet on Friday",
        audio: "/assets/audio/Karaoke-type-test-audio.mp3",
      },
      {
        speaker: "Amina",
        text: "Mwezi gani?",
        translation: "Which month?",
        audio: "/assets/audio/Karaoke-type-test-audio.mp3",
      },
      {
        speaker: "Juma",
        text: "Mwezi wa Machi",
        translation: "The month of March",
        audio: "/assets/audio/Karaoke-type-test-audio.mp3",
      },
      {
        speaker: "Amina",
        text: "Sawa, nitakuona Ijumaa",
        translation: "Okay, I'll see you on Friday",
        audio: "/assets/audio/Karaoke-type-test-audio.mp3",
      },
    ],
  },
};

export function getTimeActivityContent(
  contentRefOrId: string | undefined
): ActivityContent | null {
  const key =
    typeof contentRefOrId === "string" && contentRefOrId.trim()
      ? contentRefOrId.trim()
      : "";
  if (!key) return null;

  if (key in vocabularyTables) return vocabularyTables[key];
  if (key in spellingSets) return spellingSets[key];
  if (key in matchingSets) return matchingSets[key];
  if (key in listeningDictations) return listeningDictations[key] as any;
  if (key in conversations) return conversations[key];
  if (key in dialogues) return dialogues[key];

  return null;
}

export function getTimeVocabularyTable(contentRefOrId: string | undefined) {
  const key = typeof contentRefOrId === "string" ? contentRefOrId.trim() : "";
  return key ? vocabularyTables[key] ?? null : null;
}

export function getTimeSpellingSet(contentRefOrId: string | undefined) {
  const key = typeof contentRefOrId === "string" ? contentRefOrId.trim() : "";
  return key ? spellingSets[key] ?? null : null;
}

export function getTimeMatchingSet(contentRefOrId: string | undefined) {
  const key = typeof contentRefOrId === "string" ? contentRefOrId.trim() : "";
  return key ? matchingSets[key] ?? null : null;
}

export function getTimeListeningDictation(contentRefOrId: string | undefined) {
  const key = typeof contentRefOrId === "string" ? contentRefOrId.trim() : "";
  return key ? listeningDictations[key] ?? null : null;
}

export function getTimeConversation(contentRefOrId: string | undefined) {
  const key = typeof contentRefOrId === "string" ? contentRefOrId.trim() : "";
  return key ? conversations[key] ?? null : null;
}

export function getTimeDialogue(contentRefOrId: string | undefined) {
  const key = typeof contentRefOrId === "string" ? contentRefOrId.trim() : "";
  return key ? dialogues[key] ?? null : null;
}
