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
  Keyboard
} from 'lucide-react';
import { Card, Deck } from '../../types';
import { Button } from '../../components/Button';
import { GlassCard } from '../../components/GlassCard';
import { CardTypeBadge, DifficultyBadge } from '../../components/Badge';
import { calculateNextReview, Rating, formatInterval } from '../../services/spacedRepetition';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

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
  onBack: () => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  deck,
  cards,
  onFinishSession,
  onUpdateCardSchedule,
  onBack,
}) => {
  const [queue, setQueue] = useState<Card[]>(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
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

      {/* 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        className="w-full min-h-[380px] sm:min-h-[420px] cursor-pointer perspective-1000 group relative"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full h-full transform-style-preserve-3d relative rounded-3xl"
        >
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 backface-hidden glass-panel-elevated rounded-3xl p-8 sm:p-10 flex flex-col justify-between border border-white/40 dark:border-zinc-750 shadow-xl group-hover:border-indigo-400/50 transition-colors">
            {/* Top metadata */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTypeBadge type={currentCard.type} />
                <DifficultyBadge difficulty={currentCard.difficulty} />
              </div>
              <span className="text-xs text-zinc-400 font-medium">Click or Space to Flip</span>
            </div>

            {/* Prompt */}
            <div className="my-auto py-6 text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                Question
              </span>
              <p className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-white leading-relaxed">
                {currentCard.question}
              </p>
            </div>

            {/* Bottom hint */}
            <div className="text-center pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <span className="text-xs text-zinc-400 font-medium flex items-center justify-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5" /> Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] font-mono">Space</kbd> to reveal answer
              </span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 glass-panel-elevated rounded-3xl p-8 sm:p-10 flex flex-col justify-between border border-indigo-500/30 dark:border-indigo-500/30 shadow-2xl bg-gradient-to-b from-white/95 to-indigo-50/20 dark:from-zinc-900/95 dark:to-indigo-950/20">
            {/* Top metadata */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Answer
                </span>
                <CardTypeBadge type={currentCard.type} />
              </div>
              <span className="text-xs text-zinc-400">Repetitions: {currentCard.repetitions}</span>
            </div>

            {/* Answer & Context */}
            <div className="my-auto py-6 space-y-4 text-center">
              <p className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white leading-relaxed">
                {currentCard.answer}
              </p>

              {currentCard.explanation && (
                <div className="p-3 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/70 text-xs text-zinc-600 dark:text-zinc-300 max-w-lg mx-auto text-left leading-relaxed">
                  <span className="font-bold text-indigo-500">Context: </span>
                  {currentCard.explanation}
                </div>
              )}
            </div>

            {/* Bottom cue */}
            <div className="text-center pt-2">
              <span className="text-xs text-zinc-400">Rate your recall below to schedule next review</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Spaced Repetition Rating Buttons */}
      <AnimatePresence>
        {isFlipped ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-2"
          >
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {/* Again */}
              <button
                onClick={() => handleRating(1)}
                className="group p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 text-rose-600 hover:text-white transition-all duration-150 flex flex-col items-center justify-center shadow-sm"
              >
                <span className="text-xs font-bold uppercase">Again</span>
                <span className="text-[11px] opacity-80 mt-0.5 font-mono">{againInt}</span>
                <kbd className="hidden sm:inline-block text-[9px] font-mono px-1 py-0.2 mt-1 rounded bg-black/10 dark:bg-white/10">1</kbd>
              </button>

              {/* Hard */}
              <button
                onClick={() => handleRating(2)}
                className="group p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/20 hover:border-amber-500 text-amber-600 hover:text-white transition-all duration-150 flex flex-col items-center justify-center shadow-sm"
              >
                <span className="text-xs font-bold uppercase">Hard</span>
                <span className="text-[11px] opacity-80 mt-0.5 font-mono">{hardInt}</span>
                <kbd className="hidden sm:inline-block text-[9px] font-mono px-1 py-0.2 mt-1 rounded bg-black/10 dark:bg-white/10">2</kbd>
              </button>

              {/* Good */}
              <button
                onClick={() => handleRating(3)}
                className="group p-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-600 border border-indigo-500/20 hover:border-indigo-600 text-indigo-600 hover:text-white transition-all duration-150 flex flex-col items-center justify-center shadow-sm"
              >
                <span className="text-xs font-bold uppercase">Good</span>
                <span className="text-[11px] opacity-80 mt-0.5 font-mono">{goodInt}</span>
                <kbd className="hidden sm:inline-block text-[9px] font-mono px-1 py-0.2 mt-1 rounded bg-black/10 dark:bg-white/10">3</kbd>
              </button>

              {/* Easy */}
              <button
                onClick={() => handleRating(4)}
                className="group p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-600 text-emerald-600 hover:text-white transition-all duration-150 flex flex-col items-center justify-center shadow-sm"
              >
                <span className="text-xs font-bold uppercase">Easy</span>
                <span className="text-[11px] opacity-80 mt-0.5 font-mono">{easyInt}</span>
                <kbd className="hidden sm:inline-block text-[9px] font-mono px-1 py-0.2 mt-1 rounded bg-black/10 dark:bg-white/10">4</kbd>
              </button>
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
