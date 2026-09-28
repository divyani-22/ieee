import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Star,
  CheckCircle,
  Flame,
  Volume2,
  ChevronRight,
  ChevronLeft,
  Layers,
  HelpCircle,
  Keyboard,
  Bookmark,
  Check,
  X
} from 'lucide-react';
import { Card, Deck } from '../../types';
import { Button } from '../../components/Button';
import { GlassCard } from '../../components/GlassCard';
import { calculateNextReview, Rating, formatInterval } from '../../services/spacedRepetition';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { Flashcard } from '../../components/Flashcard';


export interface FlashcardViewerProps {
  deck: Deck;
  cards: Card[];
  onFinishSession: (stats: {
    totalReviewed: number;
    againCount: number;
    hardCount: number;
    goodCount: number;
    easyCount: number;
  }) => void;
  onUpdateCardSchedule: (card: Card) => Promise<void>;
  onToggleBookmark?: (card: Card, bookmarked: boolean) => Promise<void>;
  onBack: () => void;
  showToast?: (message: string) => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  deck,
  cards,
  onFinishSession,
  onUpdateCardSchedule,
  onToggleBookmark,
  onBack,
  showToast,
}) => {
  const [queue, setQueue] = useState<Card[]>(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [bookmarkNotification, setBookmarkNotification] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalReviewed: 0,
    againCount: 0,
    hardCount: 0,
    goodCount: 0,
    easyCount: 0,
  });
  const [isCompleted, setIsCompleted] = useState(false);


  const currentCard = queue[currentIndex];

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  const triggerBookmarkNotification = (text: string) => {
    setBookmarkNotification(text);
    if (showToast) showToast(text);
    setTimeout(() => setBookmarkNotification(null), 3500);
  };

  const handleManualToggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    const nextState = !currentCard.bookmarked;
    const updated: Card = {
      ...currentCard,
      bookmarked: nextState,
      bookmarkedAt: nextState ? new Date().toISOString() : undefined,
    };
    if (onToggleBookmark) {
      await onToggleBookmark(currentCard, nextState);
    } else {
      await onUpdateCardSchedule(updated);
    }
    setQueue(prev => prev.map((c, i) => (i === currentIndex ? updated : c)));
    triggerBookmarkNotification(
      nextState
        ? '🔖 Concept added to My Bookmarks'
        : 'Bookmark removed from concept'
    );
  };

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const handleRating = async (rating: Rating) => {
    if (!currentCard) return;

    const nextSchedule = calculateNextReview(
      currentCard.repetitions,
      currentCard.interval,
      currentCard.easeFactor,
      rating
    );

    const updatedCard: Card = {
      ...currentCard,
      ...nextSchedule,
      lastReviewed: new Date().toISOString(),
    };

    await onUpdateCardSchedule(updatedCard);

    // Update session metrics
    setSessionStats(prev => ({
      ...prev,
      totalReviewed: prev.totalReviewed + 1,
      againCount: rating === 1 ? prev.againCount + 1 : prev.againCount,
      hardCount: rating === 2 ? prev.hardCount + 1 : prev.hardCount,
      goodCount: rating === 3 ? prev.goodCount + 1 : prev.goodCount,
      easyCount: rating === 4 ? prev.easyCount + 1 : prev.easyCount,
    }));

    // If rated Again, add back to queue tail for reinforcement
    if (rating === 1) {
      setQueue(prev => [...prev, currentCard]);
    }

    // Advance queue
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      onFinishSession({
        ...sessionStats,
        totalReviewed: sessionStats.totalReviewed + 1,
        againCount: rating === 1 ? sessionStats.againCount + 1 : sessionStats.againCount,
        hardCount: rating === 2 ? sessionStats.hardCount + 1 : sessionStats.hardCount,
        goodCount: rating === 3 ? sessionStats.goodCount + 1 : sessionStats.goodCount,
        easyCount: rating === 4 ? sessionStats.easyCount + 1 : sessionStats.easyCount,
      });
    }
  };

  const handleDontRemember = async () => {
    if (!currentCard) return;
    // Automatically add to Bookmarks
    if (onToggleBookmark) {
      await onToggleBookmark(currentCard, true);
    }
    const updated: Card = {
      ...currentCard,
      bookmarked: true,
      bookmarkedAt: new Date().toISOString(),
    };
    setQueue(prev => prev.map((c, i) => (i === currentIndex ? updated : c)));
    triggerBookmarkNotification('🔖 "I Don\'t Remember" marked — Automatically saved to My Bookmarks');
    await handleRating(1); // 1 = Again
  };

  const handleRemembered = async () => {
    await handleRating(3); // 3 = Good
  };


  // Keyboard controls
  useKeyboardShortcuts({
    ' ': (e) => {
      e.preventDefault();
      handleFlip();
    },
    'enter': (e) => {
      e.preventDefault();
      handleFlip();
    },
    '1': () => {
      if (isFlipped) handleRating(1);
    },
    '2': () => {
      if (isFlipped) handleRating(2);
    },
    '3': () => {
      if (isFlipped) handleRating(3);
    },
    '4': () => {
      if (isFlipped) handleRating(4);
    },
  }, !isCompleted);

  if (queue.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-4 animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Deck is All Caught Up!</h2>
        <p className="text-zinc-500 text-sm">No cards currently due for review in this deck.</p>
        <Button variant="primary" onClick={onBack}>Back to Deck</Button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-6 animate-scale-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/25">
          <Flame className="w-10 h-10 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            Session Completed!
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Great job! You reviewed {sessionStats.totalReviewed} cards today. Your memory traces have been reinforced.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 p-4 rounded-2xl glass-panel border border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="text-sm font-bold text-rose-500">{sessionStats.againCount}</div>
            <div className="text-[10px] text-zinc-400 uppercase font-semibold">Again</div>
          </div>
          <div>
            <div className="text-sm font-bold text-amber-500">{sessionStats.hardCount}</div>
            <div className="text-[10px] text-zinc-400 uppercase font-semibold">Hard</div>
          </div>
          <div>
            <div className="text-sm font-bold text-indigo-500">{sessionStats.goodCount}</div>
            <div className="text-[10px] text-zinc-400 uppercase font-semibold">Good</div>
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-500">{sessionStats.easyCount}</div>
            <div className="text-[10px] text-zinc-400 uppercase font-semibold">Easy</div>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          <Button variant="secondary" onClick={() => {
            setCurrentIndex(0);
            setIsCompleted(false);
          }}>
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Review Again
          </Button>
          <Button variant="primary" onClick={onBack}>
            Return to Deck
          </Button>
        </div>
      </div>
    );
  }

  // Pre-calculate next intervals for rating buttons
  const againInt = formatInterval(calculateNextReview(currentCard.repetitions, currentCard.interval, currentCard.easeFactor, 1).interval);
  const hardInt = formatInterval(calculateNextReview(currentCard.repetitions, currentCard.interval, currentCard.easeFactor, 2).interval);
  const goodInt = formatInterval(calculateNextReview(currentCard.repetitions, currentCard.interval, currentCard.easeFactor, 3).interval);
  const easyInt = formatInterval(calculateNextReview(currentCard.repetitions, currentCard.interval, currentCard.easeFactor, 4).interval);

  const progressPercent = Math.round(((currentIndex + 1) / queue.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-20 select-none">
      {/* Top Bar with Progress */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Progress & Deck info */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            {currentIndex + 1} <span className="text-zinc-400 font-normal">/ {queue.length}</span>
          </span>
          <div className="w-28 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
          <Flame className="w-4 h-4 fill-amber-500" />
          <span>Active Streak</span>
        </div>
      </div>

      {/* Bookmark notification toast / alert */}
      <AnimatePresence>
        {bookmarkNotification && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-center justify-between gap-2 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
              <span>{bookmarkNotification}</span>
            </div>
            <button
              onClick={() => setBookmarkNotification(null)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reusable Tactile 3D Flip Card */}
      <Flashcard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        onToggleBookmark={() => {
          const fakeEvent = { stopPropagation: () => {} } as React.MouseEvent;
          handleManualToggleBookmark(fakeEvent);
        }}
        topicTitle={deck.title}
      />


      {/* Answer Evaluation Controls */}
      <AnimatePresence>
        {isFlipped ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-4"
          >
            {/* PRIMARY DECISION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* I Don't Remember -> Auto Bookmarks + Again */}
              <button
                type="button"
                onClick={handleDontRemember}
                className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-amber-500/15 hover:from-rose-500/25 hover:to-amber-500/25 border-2 border-rose-500/40 text-left transition-all duration-200 group shadow-md"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <X className="w-5 h-5 text-rose-500" />
                    I Don't Remember
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Bookmark className="w-3 h-3 fill-amber-500" /> Auto-Bookmark
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Saves this concept to My Bookmarks for later revision & resets review schedule.
                </p>
              </button>

              {/* I Remembered -> Schedules as Good */}
              <button
                type="button"
                onClick={handleRemembered}
                className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-indigo-500/15 hover:from-emerald-500/25 hover:to-indigo-500/25 border-2 border-emerald-500/40 text-left transition-all duration-200 group shadow-md"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                    I Remembered
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    Next: {goodInt}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Reinforces this concept into long-term memory via spaced repetition.
                </p>
              </button>
            </div>

            {/* Granular SM-2 Rating Controls */}
            <div className="pt-2 border-t border-zinc-200/50 dark:border-zinc-800/60">
              <div className="text-[11px] font-semibold text-zinc-400 mb-2 text-center">
                Or choose exact recall interval:
              </div>
              <div className="grid grid-cols-4 gap-2">
                {/* Again */}
                <button
                  onClick={() => handleRating(1)}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 text-rose-600 hover:text-white transition-all flex flex-col items-center justify-center text-xs font-bold"
                >
                  <span>Again</span>
                  <span className="text-[10px] opacity-75 font-mono">{againInt}</span>
                </button>

                {/* Hard */}
                <button
                  onClick={() => handleRating(2)}
                  className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/20 hover:border-amber-500 text-amber-600 hover:text-white transition-all flex flex-col items-center justify-center text-xs font-bold"
                >
                  <span>Hard</span>
                  <span className="text-[10px] opacity-75 font-mono">{hardInt}</span>
                </button>

                {/* Good */}
                <button
                  onClick={() => handleRating(3)}
                  className="p-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-600 border border-indigo-500/20 hover:border-indigo-600 text-indigo-600 hover:text-white transition-all flex flex-col items-center justify-center text-xs font-bold"
                >
                  <span>Good</span>
                  <span className="text-[10px] opacity-75 font-mono">{goodInt}</span>
                </button>

                {/* Easy */}
                <button
                  onClick={() => handleRating(4)}
                  className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-600 text-emerald-600 hover:text-white transition-all flex flex-col items-center justify-center text-xs font-bold"
                >
                  <span>Easy</span>
                  <span className="text-[10px] opacity-75 font-mono">{easyInt}</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex justify-center">
            <Button
              size="lg"
              variant="primary"
              onClick={handleFlip}
              className="w-full sm:w-64 shadow-lg shadow-indigo-500/20"
            >
              Reveal Answer (Space)
            </Button>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
