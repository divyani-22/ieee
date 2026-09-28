import React, { useState, useEffect } from 'react';
import { Bookmark, Sparkles, RotateCw, Check, X, HelpCircle, Star } from 'lucide-react';
import { Card, CardDifficulty } from '../types';

export interface FlashcardProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
  onToggleBookmark?: (card: Card, bookmarked: boolean) => void;
  topicTitle?: string;
  className?: string;
}

/**
 * Autoscales typography based on character length so questions and explanations
 * never overflow and stay legible on small mobile screens.
 */
function getAutoscaleClass(text: string): string {
  if (!text) return 'text-lg font-bold';
  const len = text.length;
  if (len < 60) return 'text-xl sm:text-2xl font-extrabold';
  if (len < 140) return 'text-base sm:text-xl font-bold';
  if (len < 220) return 'text-sm sm:text-lg font-semibold';
  return 'text-xs sm:text-sm font-medium';
}

/**
 * Reusable physical-feel 3D Flashcard component matching the tactile graph-paper reference aesthetic.
 * True CSS 3D rotation around the Y-axis (rotateY(180deg)) with preserve-3d and backface-visibility: hidden.
 */
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

  // Pastel accent color mapping based on card difficulty / type
  const accentColor =
    card.difficulty === 'easy'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
      : card.difficulty === 'medium'
      ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
      : 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';

  const questionFontClass = getAutoscaleClass(card.question);
  const answerFontClass = getAutoscaleClass(card.answer);

  return (
    <div
      className={`w-full max-w-2xl mx-auto perspective-1200 cursor-pointer select-none h-[420px] sm:h-[460px] min-h-[420px] focus:outline-none ${className}`}
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
        className="w-full h-full relative rounded-3xl transform-style-preserve-3d"
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
          className="absolute inset-0 backface-hidden rounded-3xl p-6 sm:p-10 flex flex-col justify-between 
                     bg-[#faf8f4] dark:bg-[#1a1917] text-stone-900 dark:text-stone-100 
                     border-[2.5px] border-stone-800 dark:border-stone-300/80 
                     shadow-[4px_6px_0px_0px_rgba(28,25,23,0.9)] dark:shadow-[4px_6px_0px_0px_rgba(214,211,209,0.8)]
                     graph-paper-pattern overflow-hidden transition-shadow"
        >
          {/* Subtle Top Paper Tape / Pin Aesthetic Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-amber-200/70 dark:bg-amber-500/30 rounded-b-md border-x border-b border-stone-800/30 dark:border-stone-600 pointer-events-none" />

          {/* Top Bar: Topic / Category & Bookmark Indicator */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border-2 ${accentColor}`}>
                {card.type.toUpperCase()}
              </span>
              {topicTitle && (
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400 truncate max-w-[200px]">
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
              className={`p-2 rounded-xl border-2 transition-all flex items-center gap-1 text-xs font-bold ${
                card.bookmarked
                  ? 'bg-amber-300 dark:bg-amber-500 text-stone-900 border-stone-800 shadow-[2px_2px_0px_0px_rgba(28,25,23,0.9)]'
                  : 'bg-white/80 dark:bg-stone-800/80 text-stone-500 border-stone-300 dark:border-stone-700 hover:border-stone-800 hover:text-amber-500'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${card.bookmarked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{card.bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
          </div>

          {/* Center: Question / Concept Statement */}
          <div className="my-auto py-4 text-center space-y-3 max-w-[65ch] mx-auto overflow-y-auto max-h-[260px] px-1">
            <span className="text-[11px] font-black tracking-widest uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 inline-block">
              {card.type === 'mcq' ? 'Multiple Choice Question' : card.type === 'true-false' ? 'True / False Prompt' : 'Question / Concept'}
            </span>
            <p className={`${questionFontClass} leading-snug tracking-tight text-stone-900 dark:text-stone-50 whitespace-pre-line`}>
              {card.question}
            </p>

            {card.options && card.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-1 max-w-lg mx-auto">
                {card.options.map((opt, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-stone-850/80 border border-stone-300/80 dark:border-stone-700/80 text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2 shadow-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="truncate">{opt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Tap Indicator */}
          <div className="pt-3 border-t border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
            <span className="flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-indigo-500" />
              <span>Tap card to reveal answer</span>
            </span>
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-800 text-[10px] font-mono border border-stone-300 dark:border-stone-700">
              Space / Enter
            </kbd>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BACK OF FLASHCARD (Rotated 180deg so it flips realistically without mirroring) */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-6 sm:p-10 flex flex-col justify-between 
                     bg-[#fbf9f5] dark:bg-[#1c1b18] text-stone-900 dark:text-stone-100 
                     border-[2.5px] border-stone-800 dark:border-stone-300/80 
                     shadow-[4px_6px_0px_0px_rgba(28,25,23,0.9)] dark:shadow-[4px_6px_0px_0px_rgba(214,211,209,0.8)]
                     graph-paper-pattern overflow-hidden transition-shadow"
        >
          {/* Subtle Top Paper Tape / Pin Aesthetic Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-emerald-200/70 dark:bg-emerald-500/30 rounded-b-md border-x border-b border-stone-800/30 dark:border-stone-600 pointer-events-none" />

          {/* Top Bar: Answer Label & Bookmark */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border-2 bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700 flex items-center gap-1">
              <Check className="w-3 h-3" /> Answer
            </span>

            {/* Bookmark button */}
            <button
              type="button"
              onClick={handleBookmarkClick}
              title={card.bookmarked ? 'Remove from Bookmarks' : 'Bookmark concept'}
              aria-label={card.bookmarked ? 'Remove bookmark' : 'Bookmark this concept'}
              className={`p-2 rounded-xl border-2 transition-all flex items-center gap-1 text-xs font-bold ${
                card.bookmarked
                  ? 'bg-amber-300 dark:bg-amber-500 text-stone-900 border-stone-800 shadow-[2px_2px_0px_0px_rgba(28,25,23,0.9)]'
                  : 'bg-white/80 dark:bg-stone-800/80 text-stone-500 border-stone-300 dark:border-stone-700 hover:border-stone-800 hover:text-amber-500'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${card.bookmarked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{card.bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
          </div>

          {/* Center: Answer & Explanation Context */}
          <div className="my-auto py-4 text-center space-y-4 max-w-[65ch] mx-auto overflow-y-auto max-h-[260px] px-1">
            <p className={`${answerFontClass} text-stone-900 dark:text-stone-50 leading-snug tracking-tight whitespace-pre-line font-black`}>
              {card.answer}
            </p>

            {card.explanation && (
              <div className="p-3.5 rounded-2xl bg-stone-100/90 dark:bg-stone-850/90 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed text-left">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Context / Explanation: </span>
                {card.explanation}
              </div>
            )}
          </div>

          {/* Bottom Flip Back Indicator */}
          <div className="pt-3 border-t border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
            <span className="flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tap anywhere to flip back to question</span>
            </span>
            <span className="text-[11px] font-semibold text-stone-400">
              Reps: {card.repetitions}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
