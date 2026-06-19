export interface VocabularyItem {
  word: string;
  definition: string;
}

export interface SessionRecord {
  date: string;
  duration: number;
  score: number;
  total: number;
}

export interface ProgressState {
  completedWords: string[];
  sessions: SessionRecord[];
}

export interface QuizQuestion {
  word: string;
  correctDefinition: string;
  choices: string[];
}

export interface SessionStats {
  totalWords: number;
  completedWords: number;
  remainingWords: number;
  completionPercentage: number;
  sessions: SessionRecord[];
}
