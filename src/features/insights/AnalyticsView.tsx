import React from 'react';
import {
  BarChart3,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Brain
} from 'lucide-react';
import { Deck, Card, StudySessionLog } from '../../types';
import { GlassCard } from '../../components/GlassCard';

export interface AnalyticsViewProps {
  decks: Deck[];
  allCards: Card[];
  studyLogs: StudySessionLog[];
  onSelectDeck: (deckId: number) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  decks,
  allCards,
  studyLogs,
  onSelectDeck,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const dueCards = allCards.filter(c => c.dueDate <= todayStr);
  const masteredCards = allCards.filter(c => c.repetitions >= 3);
  const overallMastery = allCards.length > 0 ? Math.round((masteredCards.length / allCards.length) * 100) : 0;

  // Total study time
  const totalSeconds = studyLogs.reduce((acc, log) => acc + (log.durationSeconds || 0), 0);
  const studyHours = (totalSeconds / 3600).toFixed(1);

  // Cards by difficulty breakdown
  const easyCount = allCards.filter(c => c.difficulty === 'easy').length;
  const medCount = allCards.filter(c => c.difficulty === 'medium').length;
  const hardCount = allCards.filter(c => c.difficulty === 'hard').length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-indigo-500" />
          Study Insights & Retention
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Spaced repetition mastery metrics, daily streaks, and topic performance.
        </p>
      </div>

      {/* Top 4 Stat Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 space-y-2 border border-zinc-200/60 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Total Cards</span>
            <Brain className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{allCards.length}</div>
          <p className="text-[11px] text-zinc-400">Across {decks.length} lecture decks</p>
        </GlassCard>

        <GlassCard className="p-5 space-y-2 border border-zinc-200/60 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Mastery Rate</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{overallMastery}%</div>
          <p className="text-[11px] text-zinc-400">{masteredCards.length} cards consolidated</p>
        </GlassCard>

        <GlassCard className="p-5 space-y-2 border border-zinc-200/60 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Due Today</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-500">{dueCards.length}</div>
          <p className="text-[11px] text-zinc-400">Scheduled for review</p>
        </GlassCard>

        <GlassCard className="p-5 space-y-2 border border-zinc-200/60 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Study Streak</span>
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-500">
            {studyLogs.length > 0 ? '1 Day' : '0 Days'}
          </div>
          <p className="text-[11px] text-zinc-400">{studyLogs.length} sessions logged</p>
        </GlassCard>
      </div>

      {/* Progress & Difficulty Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard elevated className="p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Knowledge Retention Distribution
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                <span>Mastered (Reps &ge; 3)</span>
                <span className="text-emerald-500">{masteredCards.length}</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${allCards.length > 0 ? (masteredCards.length / allCards.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                <span>Learning (Reps 1-2)</span>
                <span className="text-indigo-500">
                  {allCards.filter(c => c.repetitions > 0 && c.repetitions < 3).length}
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{
                    width: `${
                      allCards.length > 0
                        ? (allCards.filter(c => c.repetitions > 0 && c.repetitions < 3).length / allCards.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                <span>New / Unreviewed (Reps 0)</span>
                <span className="text-zinc-400">
                  {allCards.filter(c => c.repetitions === 0).length}
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-400 rounded-full"
                  style={{
                    width: `${
                      allCards.length > 0
                        ? (allCards.filter(c => c.repetitions === 0).length / allCards.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Difficulty Distribution */}
        <GlassCard elevated className="p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-500" />
            Synthesized Question Complexity
          </h3>

          <div className="grid grid-cols-3 gap-3 text-center pt-2">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{easyCount}</div>
              <div className="text-xs text-zinc-500 mt-1 font-medium">Easy</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{medCount}</div>
              <div className="text-xs text-zinc-500 mt-1 font-medium">Medium</div>
            </div>
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{hardCount}</div>
              <div className="text-xs text-zinc-500 mt-1 font-medium">Challenging</div>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed pt-2">
            Recall evaluates sentence syntax, domain terminology rarity, and concept length to dynamically balance card difficulty.
          </p>
        </GlassCard>
      </div>

      {/* Study History Session Log */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Recent Study Activity Log
        </h3>

        {studyLogs.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-400 border border-dashed rounded-2xl border-zinc-200 dark:border-zinc-800">
            No study sessions logged yet. Complete flashcard reviews or a quiz to see your analytics.
          </div>
        ) : (
          <div className="space-y-2">
            {studyLogs.slice(-5).reverse().map((log, idx) => (
              <div
                key={log.id || idx}
                className="p-4 rounded-xl glass-panel border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    {log.mode === 'flashcards' ? (
                      <BookOpen className="w-4 h-4" />
                    ) : (
                      <HelpCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white capitalize">
                      {log.mode} Session
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      {new Date(log.date).toLocaleDateString()} at{' '}
                      {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {log.totalReviewed} cards reviewed
                  </p>
                  <p className="text-[11px] text-emerald-500 font-medium">
                    {log.correctCount} correct
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
