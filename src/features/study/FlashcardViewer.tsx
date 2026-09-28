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
  X,
  RotateCw
} from 'lucide-react';
import { Card, Deck } from '../../types';
import { Button } from '../../components/Button';
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
        ? 'Added to Bookmarks'
        : 'Removed from Bookmarks'
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

    setSessionStats(prev => ({
      ...prev,
      totalReviewed: prev.totalReviewed + 1,
      againCount: rating === 1 ? prev.againCount + 1 : prev.againCount,
      hardCount: rating === 2 ? prev.hardCount + 1 : prev.hardCount,
      goodCount: rating === 3 ? prev.goodCount + 1 : prev.goodCount,
      easyCount: rating === 4 ? prev.easyCount + 1 : prev.easyCount,
    }));

    if (rating === 1) {
      setQueue(prev => [...prev, currentCard]);
    }

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

  // "I Don't Remember": Automatically add to Bookmarks without duplicates, show alert, reset schedule
  const handleDontRemember = async () => {
    if (!currentCard) return;
    if (onToggleBookmark) {
      await onToggleBookmark(currentCard, true);
    }
    const updated: Card = {
      ...currentCard,
      bookmarked: true,
      bookmarkedAt: new Date().toISOString(),
    };
    setQueue(prev => prev.map((c, i) => (i === currentIndex ? updated : c)));
    triggerBookmarkNotification('Added to Bookmarks');
    await handleRating(1); // 1 = Again
  };

  // "I Remember": Continues to next card via Good rating
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
    'd': () => {
      if (isFlipped) {
        handleDontRemember();
      } else {
        handleFlip();
      }
    },
    'r': () => {
      if (isFlipped) {
        handleRemembered();
      }
    },
    'b': () => {
      const fakeEvent = { stopPropagation: () => {} } as React.MouseEvent;
      handleManualToggleBookmark(fakeEvent);
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
        <div className="w-16 h-16 mx-auto rounded-3xl bg-lightBlue-100 text-navy flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-coral" />
        </div>
        <h2 className="text-2xl font-black text-navy dark:text-white">Deck is All Caught Up!</h2>
        <p className="text-navy/60 dark:text-lightBlue-200 text-sm">No cards currently due for review in this deck.</p>
        <Button variant="primary" onClick={onBack}>Back to Deck</Button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-6 animate-scale-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-coral text-white flex items-center justify-center shadow-coral-soft">
          <Flame className="w-10 h-10 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-navy dark:text-white">
            Session Completed!
          </h2>
          <p className="text-sm font-semibold text-navy/60 dark:text-lightBlue-200">
            Great job! You reviewed {sessionStats.totalReviewed} cards today. Your memory traces have been reinforced.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 p-5 rounded-4xl bg-white dark:bg-navy-800 border border-lightBlue-100 dark:border-navy-700 shadow-soft">
          <div>
            <div className="text-base font-black text-coral">{sessionStats.againCount}</div>
            <div className="text-[10px] text-navy/50 dark:text-lightBlue-200 uppercase font-black">Again</div>
          </div>
          <div>
            <div className="text-base font-black text-yellowPastel-500">{sessionStats.hardCount}</div>
            <div className="text-[10px] text-navy/50 dark:text-lightBlue-200 uppercase font-black">Hard</div>
          </div>
          <div>
            <div className="text-base font-black text-navy dark:text-white">{sessionStats.goodCount}</div>
            <div className="text-[10px] text-navy/50 dark:text-lightBlue-200 uppercase font-black">Good</div>
          </div>
          <div>
            <div className="text-base font-black text-coral">{sessionStats.easyCount}</div>
            <div className="text-[10px] text-navy/50 dark:text-lightBlue-200 uppercase font-black">Easy</div>
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

  const againInt = formatInterval(calculateNextReview(currentCard.repetitions, currentCard.interval, currentCard.easeFactor, 1).interval);
  const hardInt = formatInterval(calculateNextReview(currentCard.repetitions, currentCard.interval, currentCard.easeFactor, 2).interval);
  const goodInt = formatInterval(calculateNextReview(currentCard.repetitions, currentCard.interval, currentCard.easeFactor, 3).interval);
  const easyInt = formatInterval(calculateNextReview(currentCard.repetitions, currentCard.interval, currentCard.easeFactor, 4).interval);

  const progressPercent = Math.round(((currentIndex + 1) / queue.length) * 100);
  const formattedIndex = String(currentIndex + 1).padStart(2, '0');
  const formattedTotal = String(queue.length).padStart(2, '0');

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleNextCard = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-20 select-none">
      {/* Top Bar with Thin Lavender Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B6B7B] hover:text-[#16161D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Deck
          </button>

          {/* Progress & Deck info */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#16161D]">
              {formattedIndex} <span className="text-[#6B6B7B] font-semibold">/ {formattedTotal}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#16161D] px-3.5 py-1.5 rounded-full bg-white shadow-soft">
            <Flame className="w-4 h-4 text-[#F58D87] fill-[#F58D87]" />
            <span>Active Streak</span>
          </div>
        </div>

        {/* Thin rounded progress bar in lavender #B9A6E3 */}
        <div className="w-full h-2 bg-white/70 rounded-full overflow-hidden shadow-xs">
          <div
            className="h-full bg-[#B9A6E3] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Bookmark notification toast / alert */}
      <AnimatePresence>
        {bookmarkNotification && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3.5 rounded-2xl bg-white shadow-soft border border-[#FCE6A6] text-[#16161D] text-xs font-bold flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#16161D] fill-[#16161D] shrink-0" />
              <span>{bookmarkNotification}</span>
            </div>
            <button
              onClick={() => setBookmarkNotification(null)}
              className="text-[#6B6B7B] hover:text-[#16161D] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reusable Tactile 3D Flip Card with Rotating Pastel Color */}
      <Flashcard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        cardIndex={currentIndex}
        totalCards={queue.length}
        onToggleBookmark={() => {
          const fakeEvent = { stopPropagation: () => {} } as React.MouseEvent;
          handleManualToggleBookmark(fakeEvent);
        }}
        topicTitle={deck.title}
      />

      {/* Circular Arrow Buttons for Previous / Next Navigation with a white ring, lifting on hover */}
      <div className="flex items-center justify-between px-2 pt-1">
        <button
          type="button"
          onClick={handlePrevCard}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full bg-white ring-4 ring-white/60 shadow-pillowy flex items-center justify-center text-[#16161D] hover:-translate-y-1 hover:shadow-pillowy-hover transition-all disabled:opacity-40 disabled:hover:translate-y-0 active:scale-95"
          title="Previous Card (Left Arrow)"
          aria-label="Previous Flashcard"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <span className="text-xs font-bold text-[#6B6B7B]">
          Card {formattedIndex} of {formattedTotal}
        </span>

        <button
          type="button"
          onClick={handleNextCard}
          disabled={currentIndex >= queue.length - 1}
          className="w-12 h-12 rounded-full bg-white ring-4 ring-white/60 shadow-pillowy flex items-center justify-center text-[#16161D] hover:-translate-y-1 hover:shadow-pillowy-hover transition-all disabled:opacity-40 disabled:hover:translate-y-0 active:scale-95"
          title="Next Card (Right Arrow)"
          aria-label="Next Flashcard"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Interaction Controls below the card */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {isFlipped ? (
            <motion.div
              key="evaluation-buttons"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="space-y-4"
            >
              {/* PRIMARY DECISION BUTTONS: "I Don't Remember" vs "I Remember" */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* I Don't Remember (Butter Yellow #FCE6A6) */}
                <button
                  type="button"
                  onClick={handleDontRemember}
                  className="p-5 rounded-4xl bg-[#FCE6A6] text-[#16161D] hover:bg-[#E5CB82] shadow-pillowy transition-all duration-200 text-left group flex flex-col justify-between space-y-2 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold flex items-center gap-2">
                      <X className="w-5 h-5 text-[#16161D] stroke-[2.5]" />
                      I Don't Remember
                    </span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white/70 text-[#16161D]">
                      Auto-Bookmark
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6B7B] font-semibold leading-relaxed">
                    Saves this concept to Bookmarks & resets review schedule for practice.
                  </p>
                </button>

                {/* I Remember (Mint #D6EAE1) */}
                <button
                  type="button"
                  onClick={handleRemembered}
                  className="p-5 rounded-4xl bg-[#D6EAE1] hover:bg-[#A8D5C2] text-[#16161D] shadow-pillowy transition-all duration-200 text-left group flex flex-col justify-between space-y-2 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold flex items-center gap-2">
                      <Check className="w-5 h-5 text-[#589A80] stroke-[2.5]" />
                      I Remember
                    </span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white text-[#16161D] shadow-xs">
                      Next: {goodInt}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6B7B] font-semibold leading-relaxed">
                    Advances to the next card and reinforces long-term retention.
                  </p>
                </button>
              </div>

              {/* Granular SM-2 Rating Controls */}
              <div className="pt-2 border-t border-black/5">
                <div className="text-[11px] font-bold text-[#6B6B7B] mb-2 text-center">
                  Or select exact recall interval:
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleRating(1)}
                    className="p-2.5 rounded-full bg-white hover:bg-slate-50 text-[#16161D] shadow-xs transition-all flex flex-col items-center justify-center text-xs font-bold"
                  >
                    <span>Again (1)</span>
                    <span className="text-[10px] opacity-75 font-mono">{againInt}</span>
                  </button>

                  <button
                    onClick={() => handleRating(2)}
                    className="p-2.5 rounded-full bg-[#FCE6A6] text-[#16161D] shadow-xs transition-all flex flex-col items-center justify-center text-xs font-bold"
                  >
                    <span>Hard (2)</span>
                    <span className="text-[10px] opacity-75 font-mono">{hardInt}</span>
                  </button>

                  <button
                    onClick={() => handleRating(3)}
                    className="p-2.5 rounded-full bg-[#D6EAE1] text-[#16161D] shadow-xs transition-all flex flex-col items-center justify-center text-xs font-bold"
                  >
                    <span>Good (3)</span>
                    <span className="text-[10px] opacity-75 font-mono">{goodInt}</span>
                  </button>

                  <button
                    onClick={() => handleRating(4)}
                    className="p-2.5 rounded-full bg-[#D9CDEE] text-[#16161D] shadow-xs transition-all flex flex-col items-center justify-center text-xs font-bold"
                  >
                    <span>Easy (4)</span>
                    <span className="text-[10px] opacity-75 font-mono">{easyInt}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reveal-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <Button
                size="lg"
                variant="coral"
                onClick={handleFlip}
                className="w-full sm:w-72 font-black py-4 shadow-coral-soft text-base"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Tap to Reveal Answer (Space)
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
