import React, { useState, useEffect } from 'react';
import { Bookmark, RotateCw, Check, Sparkles, BookOpen } from 'lucide-react';
import { Card } from '../types';

export interface FlashcardProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
  onToggleBookmark?: (card: Card, bookmarked: boolean) => void;
  topicTitle?: string;
  className?: string;
}

function getAutoscaleClass(text: string): string {
  if (!text) return 'text-xl font-bold';
  const len = text.length;
  if (len < 60) return 'text-2xl sm:text-3xl font-black';
  if (len < 140) return 'text-lg sm:text-2xl font-extrabold';
  if (len < 220) return 'text-base sm:text-xl font-bold';
  return 'text-sm sm:text-base font-semibold';
}

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  onToggleBookmark,
  topicTitle,
  className = '',
}) => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduceMotion(media.matches);
      const listener = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onFlip();
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark(card, !card.bookmarked);
    }
  };

  const questionFontClass = getAutoscaleClass(card.question);
  const answerFontClass = getAutoscaleClass(card.answer);

  return (
    <div
      className={`w-full max-w-2xl mx-auto perspective-1200 cursor-pointer select-none h-[440px] sm:h-[480px] min-h-[440px] focus:outline-none ${className}`}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={
        isFlipped
          ? 'Flashcard back showing answer. Tap anywhere to flip back to question.'
          : 'Flashcard front showing question. Tap anywhere to reveal answer.'
      }
    >
      {/* 3D Rotating Wrapper */}
      <div
        className="w-full h-full relative rounded-4xl transform-style-preserve-3d"
        style={{
          height: '100%',
          minHeight: '100%',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: reduceMotion
            ? 'transform 0.1s ease'
            : 'transform 600ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }}
      >
        {/* ========================================================================= */}
        {/* FRONT OF FLASHCARD */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 backface-hidden rounded-4xl p-6 sm:p-10 flex flex-col justify-between 
                     bg-white dark:bg-navy-800 text-navy dark:text-white 
                     border-2 border-lightBlue-200/90 dark:border-navy-700 
                     shadow-soft-lg transition-shadow"
        >
          {/* Top Bar: Topic / Category & Bookmark Indicator */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-lightBlue-100 dark:bg-navy-700 text-navy dark:text-lightBlue-200">
                {card.type === 'mcq' ? 'Multiple Choice' : card.type === 'cloze' ? 'Cloze' : 'Concept'}
              </span>
              {topicTitle && (
                <span className="text-xs font-bold text-navy/60 dark:text-lightBlue-200 truncate max-w-[200px]">
                  {topicTitle}
                </span>
              )}
            </div>

            {/* Bookmark button */}
            <button
              type="button"
              onClick={handleBookmarkClick}
              title={card.bookmarked ? 'Remove from Bookmarks' : 'Bookmark concept'}
              aria-label={card.bookmarked ? 'Remove bookmark' : 'Bookmark this concept'}
              className={`p-2 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                card.bookmarked
                  ? 'bg-yellowPastel text-navy border-yellowPastel-400 shadow-soft'
                  : 'bg-pageBg dark:bg-navy-700 text-navy/60 dark:text-lightBlue-200 border-lightBlue-200 dark:border-navy-600 hover:border-yellowPastel-400 hover:text-navy'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${card.bookmarked ? 'fill-navy' : ''}`} />
              <span className="hidden sm:inline">{card.bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
          </div>

          {/* Center: Question / Concept Statement */}
          <div className="my-auto py-4 text-center space-y-3 max-w-[60ch] mx-auto overflow-y-auto max-h-[260px] px-1">
            <span className="text-[11px] font-black tracking-widest uppercase text-coral bg-coral-50 dark:bg-coral-950/60 px-3 py-1 rounded-full border border-coral-200 inline-block">
              Question / Concept
            </span>
            <p className={`${questionFontClass} leading-snug tracking-tight text-navy dark:text-white whitespace-pre-line`}>
              {card.question}
            </p>

            {/* MCQ Options Display */}
            {card.options && card.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-2 max-w-lg mx-auto">
                {card.options.map((opt, i) => (
                  <div
                    key={i}
                    className="px-3.5 py-2 rounded-2xl bg-pageBg dark:bg-navy-900 border border-lightBlue-200 dark:border-navy-700 text-xs font-bold text-navy dark:text-lightBlue-100 flex items-center gap-2.5 shadow-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-lightBlue-200 dark:bg-navy-700 text-navy dark:text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="truncate">{opt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Tap Indicator */}
          <div className="pt-3 border-t border-lightBlue-100 dark:border-navy-700 flex items-center justify-between text-xs text-navy/60 dark:text-lightBlue-200 font-semibold">
            <span className="flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-coral" />
              <span>Tap card to reveal answer</span>
            </span>
            <kbd className="hidden sm:inline-block px-2.5 py-0.5 rounded-lg bg-pageBg dark:bg-navy-700 text-[10px] font-mono border border-lightBlue-200 dark:border-navy-600 text-navy dark:text-lightBlue-200">
              Space / Enter
            </kbd>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BACK OF FLASHCARD (Rotated 180deg) */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-4xl p-6 sm:p-10 flex flex-col justify-between 
                     bg-white dark:bg-navy-800 text-navy dark:text-white 
                     border-2 border-lightBlue-200/90 dark:border-navy-700 
                     shadow-soft-lg transition-shadow"
        >
          {/* Top Bar: Answer Label & Bookmark */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-lightBlue-100 text-navy dark:bg-navy-700 dark:text-lightBlue-200 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-coral" />
              Answer & Context
            </span>

            {/* Bookmark button */}
            <button
              type="button"
              onClick={handleBookmarkClick}
              title={card.bookmarked ? 'Remove from Bookmarks' : 'Bookmark concept'}
              aria-label={card.bookmarked ? 'Remove bookmark' : 'Bookmark this concept'}
              className={`p-2 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                card.bookmarked
                  ? 'bg-yellowPastel text-navy border-yellowPastel-400 shadow-soft'
                  : 'bg-pageBg dark:bg-navy-700 text-navy/60 dark:text-lightBlue-200 border-lightBlue-200 dark:border-navy-600 hover:border-yellowPastel-400 hover:text-navy'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${card.bookmarked ? 'fill-navy' : ''}`} />
              <span className="hidden sm:inline">{card.bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
          </div>

          {/* Center: Answer & Explanation Context */}
          <div className="my-auto py-4 text-center space-y-4 max-w-[60ch] mx-auto overflow-y-auto max-h-[260px] px-1">
            <p className={`${answerFontClass} text-navy dark:text-white leading-snug tracking-tight whitespace-pre-line font-black`}>
              {card.answer}
            </p>

            {card.explanation && (
              <div className="p-4 rounded-3xl bg-pageBg dark:bg-navy-900 border border-lightBlue-100 dark:border-navy-700 text-xs sm:text-sm text-navy/80 dark:text-lightBlue-100 leading-relaxed text-left">
                <span className="font-extrabold text-coral">Context / Explanation: </span>
                {card.explanation}
              </div>
            )}
          </div>

          {/* Bottom Flip Back Indicator */}
          <div className="pt-3 border-t border-lightBlue-100 dark:border-navy-700 flex items-center justify-between text-xs text-navy/60 dark:text-lightBlue-200 font-semibold">
            <span className="flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-coral" />
              <span>Tap anywhere to flip back</span>
            </span>
            <span className="text-[11px] font-bold text-navy/50 dark:text-lightBlue-300">
              Reviews: {card.repetitions}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
