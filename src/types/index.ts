export type CardType = 'cloze' | 'definition' | 'mcq' | 'true-false';

export type CardDifficulty = 'easy' | 'medium' | 'hard';

export interface Card {
  id?: number;
  deckId: number;
  type: CardType;
  question: string; // The prompt, question, cloze phrase, or definition prompt
  answer: string;   // The correct answer or completed cloze
  options?: string[]; // Distractors + correct answer for MCQ
  explanation?: string; // Deep context, source citation, or memory cue
  sourceSentence?: string; // Exact sentence in the original document
  difficulty: CardDifficulty;
  starred?: boolean;
  bookmarked?: boolean;
  bookmarkedAt?: string; // ISO date string when added to bookmarks
  
  // Spaced Repetition (SM-2 / FSRS) fields:
  repetitions: number; // consecutive correct reviews
  interval: number;    // in days
  easeFactor: number;  // starts at 2.5
  dueDate: string;     // ISO timestamp string YYYY-MM-DD
  lastReviewed?: string; // ISO timestamp string
  reviewHistory?: {
    date: string;
    rating: 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy
    interval: number;
  }[];
}

export interface Deck {
  id?: number;
  title: string;
  description: string;
  sourceType: 'pdf' | 'image' | 'text' | 'markdown' | 'multi' | 'manual';
  sourceFileNames?: string[];
  createdAt: string;
  updatedAt: string;
  totalCards: number;
  tags?: string[];
  color?: string; // gradient / theme accent
}

export interface StudySessionLog {
  id?: number;
  deckId: number;
  mode: 'flashcards' | 'quiz';
  date: string;
  totalReviewed: number;
  correctCount: number;
  againCount?: number;
  hardCount?: number;
  goodCount?: number;
  easyCount?: number;
  durationSeconds: number;
  weakTopics?: string[];
}

export interface IngestionFileProgress {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'queued' | 'extracting' | 'ocr' | 'cleaning' | 'done' | 'error';
  progress: number; // 0 to 100
  extractedText: string;
  error?: string;
  pageCount?: number;
  scannedPagesDetected?: number;
}

export interface GenerationConfig {
  density: number; // cards per page / chunk (e.g. 3, 5, 8)
  cardTypes: CardType[];
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  useSmartMode: boolean; // Optional WebLLM
}

export type QuizDifficultyLevel = 'simple' | 'intermediate' | 'hard';

export type ViewMode = 'home' | 'decks' | 'deck-detail' | 'study' | 'quiz' | 'insights' | 'bookmarks';
