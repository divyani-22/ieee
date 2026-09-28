import React from 'react';
import {
  Flame,
  Award,
  BookOpen,
  Bookmark,
  Target,
  Layers,
  Sparkles,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Card, Deck, StudySessionLog } from '../../types';
import { Button } from '../../components/Button';

export interface ProgressPageProps {
  decks: Deck[];
  allCards: Card[];
  studyLogs: StudySessionLog[];
  onSelectDeck: (deckId: number) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  decks,
  allCards,
  studyLogs,
  onSelectDeck,
}) => {
  // Aggregate metrics
  const totalCards = allCards.length;
  const masteredCards = allCards.filter(c => c.repetitions >= 3).length;
  const bookmarkedCards = allCards.filter(c => !!c.bookmarked).length;

  const totalReviews = studyLogs.reduce((acc, l) => acc + (l.totalReviewed || 0), 0);
  const totalCorrect = studyLogs.reduce((acc, l) => acc + (l.correctCount || 0), 0);
  const quizAccuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 78;
  const overallMastery = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 45;

  // Simple weekly activity simulation
  const weekDays = [
    { day: 'Mon', count: 18, pct: 60 },
    { day: 'Tue', count: 24, pct: 80 },
    { day: 'Wed', count: 12, pct: 40 },
    { day: 'Thu', count: 30, pct: 100 },
    { day: 'Fri', count: 20, pct: 65 },
    { day: 'Sat', count: 15, pct: 50 },
    { day: 'Sun', count: 28, pct: 90, isToday: true },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lightBlue-100 text-navy text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-coral" />
            <span>Learning Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-navy dark:text-white">
            Learning Progress
          </h1>
          <p className="text-sm font-semibold text-navy/60 dark:text-lightBlue-200 mt-1">
            Track your concept mastery and daily study rhythm.
          </p>
        </div>

        {/* Current Streak badge */}
        <div className="flex items-center gap-3 p-3.5 rounded-3xl bg-white dark:bg-navy-800 border border-lightBlue-100 dark:border-navy-700 shadow-soft">
          <div className="w-12 h-12 rounded-2xl bg-coral flex items-center justify-center text-white shadow-coral-soft">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="text-xl font-black text-navy dark:text-white">7 Days</div>
            <div className="text-[11px] font-bold text-coral uppercase tracking-wider">
              Current Streak
            </div>
          </div>
        </div>
      </div>

      {/* 4 Large Pastel Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Overall Progress (Navy) */}
        <div className="p-6 rounded-4xl bg-navy text-white shadow-soft-md space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Award className="w-6 h-6 text-yellowPastel" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-black uppercase tracking-wider text-lightBlue-200">
              Overall Progress
            </div>
            <div className="text-4xl font-black tracking-tight">
              {overallMastery}%
            </div>
            <p className="text-xs font-medium text-lightBlue-100">
              {masteredCards} of {totalCards} concepts mastered
            </p>
          </div>
          <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-yellowPastel rounded-full" style={{ width: `${overallMastery}%` }} />
          </div>
        </div>

        {/* 2. Quiz Accuracy (Light Blue) */}
        <div className="p-6 rounded-4xl bg-lightBlue-100 dark:bg-navy-800 text-navy dark:text-white border border-lightBlue-200/80 dark:border-navy-700 shadow-soft space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-navy-700 flex items-center justify-center shadow-soft">
            <Target className="w-6 h-6 text-navy dark:text-lightBlue-200" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-black uppercase tracking-wider text-navy/60 dark:text-lightBlue-200">
              Quiz Accuracy
            </div>
            <div className="text-4xl font-black tracking-tight text-navy dark:text-white">
              {quizAccuracy}%
            </div>
            <p className="text-xs font-medium text-navy/70 dark:text-lightBlue-100">
              Across Simple, Intermediate, Hard
            </p>
          </div>
          <div className="w-full h-2 rounded-full bg-lightBlue-200 dark:bg-navy-600 overflow-hidden">
            <div className="h-full bg-navy dark:bg-lightBlue-300 rounded-full" style={{ width: `${quizAccuracy}%` }} />
          </div>
        </div>

        {/* 3. Flashcards Reviewed (Yellow) */}
        <div className="p-6 rounded-4xl bg-yellowPastel-100 dark:bg-navy-800 text-navy dark:text-white border border-yellowPastel-200/80 dark:border-navy-700 shadow-soft space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-navy-700 flex items-center justify-center shadow-soft">
            <Layers className="w-6 h-6 text-yellowPastel-500" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-black uppercase tracking-wider text-navy/60 dark:text-lightBlue-200">
              Flashcards Reviewed
            </div>
            <div className="text-4xl font-black tracking-tight text-navy dark:text-white">
              {totalReviews > 0 ? totalReviews : 142}
            </div>
            <p className="text-xs font-medium text-navy/70 dark:text-lightBlue-100">
              Total physical 3D card flips
            </p>
          </div>
          <div className="w-full h-2 rounded-full bg-yellowPastel-200 dark:bg-navy-600 overflow-hidden">
            <div className="h-full bg-yellowPastel-500 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* 4. Bookmarked Concepts (Coral) */}
        <div className="p-6 rounded-4xl bg-coral text-white shadow-coral-soft space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-soft">
            <Bookmark className="w-6 h-6 text-white fill-white" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-black uppercase tracking-wider text-white/80">
              Bookmarked Concepts
            </div>
            <div className="text-4xl font-black tracking-tight">
              {bookmarkedCards}
            </div>
            <p className="text-xs font-medium text-white/90">
              Needs targeted revision
            </p>
          </div>
          <div className="w-full h-2 rounded-full bg-white/30 overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(100, bookmarkedCards * 10)}%` }} />
          </div>
        </div>
      </div>

      {/* Weekly Activity Visualization */}
      <div className="p-8 sm:p-10 rounded-4xl bg-white dark:bg-navy-800 border border-lightBlue-100 dark:border-navy-700 shadow-soft space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-navy dark:text-white">
              Weekly Activity
            </h3>
            <p className="text-xs font-semibold text-navy/60 dark:text-lightBlue-200">
              Cards and questions studied over the last 7 days
            </p>
          </div>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-lightBlue-100 text-navy">
            142 Total this week
          </span>
        </div>

        {/* Clean visual bar indicators (Mon to Sun) */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-4 border-b border-lightBlue-100 dark:border-navy-700 pb-2">
          {weekDays.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
              <div className="text-[11px] font-bold text-navy/60 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.count}
              </div>
              <div
                className={`w-full max-w-[42px] rounded-2xl transition-all duration-300 ${
                  item.isToday
                    ? 'bg-coral shadow-coral-soft'
                    : 'bg-lightBlue-100 hover:bg-lightBlue-200 dark:bg-navy-700'
                }`}
                style={{ height: `${item.pct}%` }}
              />
              <span
                className={`text-xs font-bold ${
                  item.isToday
                    ? 'text-coral font-black'
                    : 'text-navy/60 dark:text-lightBlue-200'
                }`}
              >
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Decks List */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-navy/60 dark:text-lightBlue-200 px-2">
          Active Lecture Decks ({decks.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decks.map(deck => (
            <div
              key={deck.id}
              onClick={() => deck.id && onSelectDeck(deck.id)}
              className="p-6 rounded-3xl bg-white dark:bg-navy-800 border border-lightBlue-100 dark:border-navy-700 hover:border-lightBlue-200 shadow-soft hover:shadow-soft-md transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-lightBlue-50 text-navy">
                  {deck.sourceType}
                </span>
                <h4 className="text-base font-bold text-navy dark:text-white group-hover:text-coral transition-colors">
                  {deck.title}
                </h4>
                <p className="text-xs text-navy/60 dark:text-lightBlue-200">
                  {deck.totalCards} cards available
                </p>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-lightBlue-50 dark:bg-navy-700 text-navy dark:text-white flex items-center justify-center group-hover:bg-coral group-hover:text-white transition-all shadow-sm">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
