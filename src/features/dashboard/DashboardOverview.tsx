import React from 'react';
import {
  CheckCircle2,
  Target,
  Layers,
  Bookmark,
  Sparkles,
  ArrowRight,
  Flame,
  Zap,
  BookOpen,
  Plus
} from 'lucide-react';
import { Button } from '../../components/Button';

export interface DashboardOverviewProps {
  studentName?: string;
  totalCards: number;
  bookmarkedCount: number;
  dueCardsCount: number;
  onOpenQuiz: () => void;
  onOpenFlashcards: () => void;
  onOpenBookmarks: () => void;
  onReviewAllBookmarks: () => void;
  onOpenUpload: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  studentName = 'Alex',
  totalCards,
  bookmarkedCount,
  dueCardsCount,
  onOpenQuiz,
  onOpenFlashcards,
  onOpenBookmarks,
  onReviewAllBookmarks,
  onOpenUpload,
}) => {
  return (
    <div className="space-y-8 pt-4 pb-8">
      {/* Hero Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lightBlue-100 text-navy text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-coral fill-coral" />
            <span>Daily Learning Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy dark:text-white tracking-tight">
            Hello, {studentName} 👋
          </h2>
          <p className="text-sm font-semibold text-navy/60 dark:text-lightBlue-200">
            Ready to continue learning today?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="md"
            variant="navy"
            onClick={onOpenUpload}
            className="font-bold shadow-soft"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Lecture Deck
          </Button>
        </div>
      </div>

      {/* 4 Large Pastel Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Today's Progress (Navy) */}
        <div
          onClick={onOpenQuiz}
          className="p-6 rounded-4xl bg-navy text-white shadow-soft-md hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4 cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-yellowPastel" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/15 text-lightBlue-200">
              Active Today
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-black uppercase tracking-wider text-lightBlue-200">
              Today's Progress
            </div>
            <div className="text-4xl font-black tracking-tight">
              12
            </div>
            <p className="text-xs font-medium text-lightBlue-100">
              Questions Completed
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-yellowPastel group-hover:translate-x-1 transition-transform">
            <span>Keep your streak</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Quiz Progress (Light Blue) */}
        <div
          onClick={onOpenQuiz}
          className="p-6 rounded-4xl bg-lightBlue-100 dark:bg-navy-800 text-navy dark:text-white border border-lightBlue-200/80 dark:border-navy-700 shadow-soft hover:shadow-soft-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-navy-700 flex items-center justify-center shadow-soft">
              <Target className="w-6 h-6 text-navy dark:text-lightBlue-200" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white dark:bg-navy-700 text-navy dark:text-white">
              Accuracy
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-black uppercase tracking-wider text-navy/60 dark:text-lightBlue-200">
              Quiz Progress
            </div>
            <div className="text-4xl font-black tracking-tight text-navy dark:text-white">
              78%
            </div>
            <p className="text-xs font-medium text-navy/70 dark:text-lightBlue-100">
              3 Difficulty Levels Available
            </p>
          </div>

          <div className="pt-2 border-t border-navy/10 dark:border-navy-700 flex items-center justify-between text-xs font-bold text-navy dark:text-lightBlue-200 group-hover:translate-x-1 transition-transform">
            <span>Take a Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Flashcards (Yellow) */}
        <div
          onClick={onOpenFlashcards}
          className="p-6 rounded-4xl bg-yellowPastel-100 dark:bg-navy-800 text-navy dark:text-white border border-yellowPastel-200/80 dark:border-navy-700 shadow-soft hover:shadow-soft-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-navy-700 flex items-center justify-center shadow-soft">
              <Layers className="w-6 h-6 text-yellowPastel-500" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white dark:bg-navy-700 text-navy dark:text-white">
              Spaced Review
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-black uppercase tracking-wider text-navy/60 dark:text-lightBlue-200">
              Flashcards
            </div>
            <div className="text-4xl font-black tracking-tight text-navy dark:text-white">
              {totalCards > 0 ? totalCards : 24}
            </div>
            <p className="text-xs font-medium text-navy/70 dark:text-lightBlue-100">
              Cards in Your Active Library
            </p>
          </div>

          <div className="pt-2 border-t border-navy/10 dark:border-navy-700 flex items-center justify-between text-xs font-bold text-navy dark:text-yellowPastel-300 group-hover:translate-x-1 transition-transform">
            <span>Study 3D Flashcards</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Bookmarks (Coral) */}
        <div
          onClick={onOpenBookmarks}
          className="p-6 rounded-4xl bg-coral text-white shadow-coral-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-soft">
              <Bookmark className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white">
              Targeted
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-black uppercase tracking-wider text-white/80">
              Bookmarks
            </div>
            <div className="text-4xl font-black tracking-tight">
              {bookmarkedCount}
            </div>
            <p className="text-xs font-medium text-white/90">
              Concepts to Review
            </p>
          </div>

          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
            <span>Review All Bookmarks</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
