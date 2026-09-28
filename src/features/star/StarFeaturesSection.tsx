import React from 'react';
import {
  Star,
  Zap,
  Target,
  BrainCircuit,
  Bookmark,
  BookOpen,
  ArrowRight,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { Button } from '../../components/Button';
import { QuizDifficultyLevel } from '../../types';

export interface StarFeaturesSectionProps {
  bookmarkedCount: number;
  onStartQuiz: (difficulty: QuizDifficultyLevel) => void;
  onStudyFlashcards: () => void;
  onOpenBookmarks: () => void;
  onReviewAllBookmarks: () => void;
}

export const StarFeaturesSection: React.FC<StarFeaturesSectionProps> = ({
  bookmarkedCount,
  onStartQuiz,
  onStudyFlashcards,
  onOpenBookmarks,
  onReviewAllBookmarks,
}) => {
  return (
    <div className="space-y-6 pt-2 pb-6">
      {/* Star Themed Banner Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500/15 via-indigo-600/15 to-purple-600/15 border border-amber-400/40 dark:border-amber-500/30 shadow-xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span>Recall Star Features</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Master Tough Concepts with{' '}
              <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 bg-clip-text text-transparent">
                Star Capabilities
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
              Tailor your knowledge retention with three quiz difficulty tiers, study with responsive flashcards, and automatically bookmark forgotten concepts for targeted one-click revision.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              size="md"
              variant="primary"
              onClick={onOpenBookmarks}
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold border-amber-400/50 shadow-md shadow-amber-500/20"
            >
              <Bookmark className="w-4 h-4 mr-1.5 fill-white" />
              My Bookmarks ({bookmarkedCount})
            </Button>
          </div>
        </div>

        {/* Subtle Decorative Star Icon in Background */}
        <Star className="absolute -bottom-8 -right-8 w-44 h-44 text-amber-500/5 -rotate-12 pointer-events-none" />
      </div>

      {/* 3 Main Star Feature Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Feature 1: Three Quiz Difficulty Levels */}
        <GlassCard
          elevated
          className="p-6 flex flex-col justify-between space-y-4 border border-zinc-200/80 dark:border-zinc-800 hover:border-amber-400/50 transition-all group"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-sm">
              <Award className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Star Feature 1
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                3 Quiz Difficulty Levels
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Choose between Simple, Intermediate, and Hard to calibrate the question complexity to your exact learning stage.
              </p>
            </div>

            {/* Quick Level Launch Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => onStartQuiz('simple')}
                className="w-full p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                  Simple (Beginners)
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onStartQuiz('intermediate')}
                className="w-full p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-500" />
                  Intermediate (Moderate)
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onStartQuiz('hard')}
                className="w-full p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <BrainCircuit className="w-3.5 h-3.5 text-rose-500" />
                  Hard (Challenging)
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Feature 2: Interactive Flashcards with Recall Feedback */}
        <GlassCard
          elevated
          className="p-6 flex flex-col justify-between space-y-4 border border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-400/50 transition-all group"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Star Feature 2
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Interactive Flashcards
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Flip cards in 3D, reveal answers with Space or click, and indicate "I Remembered" or "I Don't Remember" with ease.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-850/80 border border-zinc-200/60 dark:border-zinc-800 space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><b className="text-emerald-600 dark:text-emerald-400">I Remembered:</b> Schedules spaced review</span>
              </div>
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500" />
                <span><b className="text-amber-600 dark:text-amber-400">I Don't Remember:</b> Auto-saves to Bookmarks</span>
              </div>
            </div>
          </div>

          <Button
            size="md"
            variant="secondary"
            onClick={onStudyFlashcards}
            className="w-full text-xs font-bold"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Launch Flashcards
          </Button>
        </GlassCard>

        {/* Feature 3: Bookmarks & Revision Page */}
        <GlassCard
          elevated
          className="p-6 flex flex-col justify-between space-y-4 border border-zinc-200/80 dark:border-zinc-800 hover:border-amber-400/50 transition-all group"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-sm">
              <Bookmark className="w-6 h-6 fill-amber-500" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Star Feature 3 & 4
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                My Bookmarks & Review All
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Dedicated revision sanctuary. Review difficult concepts together, inspect question context, and unbookmark once mastered.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Bookmarked Concepts:</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[11px]">
                  {bookmarkedCount}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Retains all unremembered concepts until you explicitly remove them.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={onOpenBookmarks}
              className="text-xs font-semibold"
            >
              View List
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={bookmarkedCount === 0}
              onClick={onReviewAllBookmarks}
              className="text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm"
            >
              Review All
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* User Flow Roadmap */}
      <GlassCard className="p-5 border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3 text-center sm:text-left flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Recommended Student Mastery Flow
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 shadow-sm">
            <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Choose Quiz Level</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 shadow-sm">
            <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px]">2</span>
            <span>Take Quiz</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 shadow-sm">
            <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px]">3</span>
            <span>Study Flashcards</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-700/60 text-amber-800 dark:text-amber-200 shadow-sm">
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">4</span>
            <span>Mark "I Don't Remember"</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 shadow-sm">
            <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px]">5</span>
            <span>Open "My Bookmarks"</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300/60 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-200 shadow-sm">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">6</span>
            <span>Review All Bookmarks</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
