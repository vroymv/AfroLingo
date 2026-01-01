export interface Activity {
  id: string;
  type:
    | "introduction"
    | "alphabet"
    | "flashcard"
    | "multiple-choice"
    | "listening"
    | "listening-dictation"
    | "vocabulary-fill-in"
    | "vocabulary-table"
    | "alphabet-vocabulary-table"
    | "numbers-introduction"
    | "numbers-table"
    | "numbers-listening"
    | "numbers-translation"
    | "matching"
    | "spelling-completion"
    | "conversation-practice"
    | "dialogue"
    | "speaking";
  question?: string;
  description?: string;
  audio?: string;
  options?: any;
  correctAnswer?: any;
  explanation?: string;
  items?: any;
  pairs?: any;
  conversation?: any;
  dialogue?: any;
  alphabetImage?: string;
  image?: string;
}
