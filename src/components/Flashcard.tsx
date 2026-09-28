import React, { useState, useEffect } from 'react';
import { Bookmark, RotateCw, Check, Sparkles, BookOpen, HelpCircle } from 'lucide-react';
import { Card } from '../types';
import { PastelColorKey, getPastelByIndex, getPastelConfig } from '../utils/pastelColors';

export interface FlashcardProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
  onToggleBookmark?: (card: Card, bookmarked: boolean) => void;
  topicTitle?: string;
  cardIndex?: number;
  totalCards?: number;
  colorKey?: PastelColorKey;
  className?: string;
}

function getAutoscaleClass(text: string): string {
  if (!text) return 'text-xl font-black';
  const len = text.length;
  if (len < 60) return 'text-2xl sm:text-3xl font-black';
  if (len < 140) return 'text-xl sm:text-2xl font-extrabold';
  if (len < 220) return 'text-lg sm:text-xl font-bold';
  return 'text-base sm:text-lg font-semibold';
}

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  onToggleBookmark,
  topicTitle,
  cardIndex = 0,
  totalCards,
  colorKey,
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

  // Determine consistent pastel color for this card
  const selectedKey = colorKey || getPastelByIndex(cardIndex !== undefined ? cardIndex : (card.id ?? 0));
  const pastel = getPastelConfig(selectedKey);

  const questionFontClass = getAutoscaleClass(card.question);
  const answerFontClass = getAutoscaleClass(card.answer);

  const numberLabel = totalCards !== undefined ? `Q ${cardIndex + 1}/${totalCards}` : `Q ${cardIndex + 1}`;

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
      {/* 3D Rotating Wrapper with 500ms ease */}
      <div
        className="w-full h-full relative rounded-4xl transform-style-preserve-3d"
        style={{
          height: '100%',
          minHeight: '100%',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: reduceMotion
            ? 'transform 0.1s ease'
            : 'transform 500ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }}
      >
        {/* ========================================================================= */}
        {/* FRONT OF FLASHCARD */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 backface-hidden rounded-4xl p-7 sm:p-9 flex flex-col justify-between overflow-hidden shadow-pillowy"
          style={{
            backgroundColor: pastel.front,
            color: '#16161D',
          }}
        >
          {/* Low-opacity open-book watermark */}
          <div className="absolute right-2 bottom-2 pointer-events-none opacity-[0.08] select-none text-[#16161D]">
            <BookOpen className="w-40 h-40" strokeWidth={1} />
          </div>

          {/* Faint decorative sparkle stars */}
          <svg className="absolute top-8 right-24 w-4 h-4 text-white/70 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
          <svg className="absolute bottom-12 right-28 w-3 h-3 text-white/60 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>

          {/* Top Bar: White circular icon chip + White pill chips */}
          <div className="flex items-center justify-between gap-2 relative z-10">
            {/* Top-left: White circular icon chip */}
            <div className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center text-[#16161D] shrink-0">
              <HelpCircle className="w-5 h-5 text-[#16161D]" />
            </div>

            {/* Top-right: White pill chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Question / Concept Number Pill */}
              <span className="px-3.5 py-1.5 rounded-full bg-white shadow-soft text-xs font-black text-[#16161D]">
                {numberLabel}
              </span>

              {topicTitle && (
                <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-xs text-xs font-bold text-[#16161D]/80 truncate max-w-[160px]">
                  {topicTitle}
                </span>
              )}

              {/* Bookmark Toggle Button */}
              <button
                type="button"
                onClick={handleBookmarkClick}
                title={card.bookmarked ? 'Remove from Bookmarks' : 'Bookmark concept'}
                aria-label={card.bookmarked ? 'Remove bookmark' : 'Bookmark this concept'}
                className={`p-2 rounded-full shadow-soft transition-all flex items-center justify-center ${
                  card.bookmarked
                    ? 'bg-[#16161D] text-white hover:bg-black'
                    : 'bg-white text-[#16161D] hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${card.bookmarked ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* Center: Question / Concept Statement (bold, dark #16161D, 20-24px, tight leading) */}
          <div className="my-auto py-3 text-center space-y-3 max-w-[56ch] mx-auto overflow-y-auto max-h-[240px] px-2 relative z-10">
            <span className="text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-white/80 shadow-xs inline-block text-[#16161D]">
              {card.type === 'mcq' ? 'Multiple Choice' : card.type === 'cloze' ? 'Fill In Blank' : 'Concept Question'}
            </span>
            <p className={`${questionFontClass} leading-tight tracking-tight text-[#16161D] whitespace-pre-line`}>
              {card.question}
            </p>

            {/* Optional MCQ Options Preview on front */}
            {card.options && card.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-2 max-w-lg mx-auto">
                {card.options.map((opt, i) => (
                  <div
                    key={i}
                    className="px-3.5 py-2 rounded-xl bg-white/80 backdrop-blur-xs text-xs font-bold text-[#16161D] flex items-center gap-2 shadow-xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#16161D] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="truncate">{opt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Tap Indicator */}
          <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs text-[#6B6B7B] font-bold relative z-10">
            <span className="flex items-center gap-1.5 text-[#16161D]">
              <RotateCw className="w-3.5 h-3.5 text-[#16161D]" />
              <span>Tap card to reveal answer</span>
            </span>
            <kbd className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/80 text-[10px] font-mono shadow-xs text-[#16161D]">
              Space / Enter
            </kbd>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BACK OF FLASHCARD (Rotated 180deg, deeper shade of same color) */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-4xl p-7 sm:p-9 flex flex-col justify-between overflow-hidden shadow-pillowy"
          style={{
            backgroundColor: pastel.back,
            color: '#16161D',
          }}
        >
          {/* Low-opacity open-book watermark */}
          <div className="absolute right-2 bottom-2 pointer-events-none opacity-[0.09] select-none text-[#16161D]">
            <BookOpen className="w-40 h-40" strokeWidth={1} />
          </div>

          {/* Faint decorative sparkle stars */}
          <svg className="absolute top-8 right-24 w-4 h-4 text-white/70 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
          <svg className="absolute bottom-12 right-28 w-3 h-3 text-white/60 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>

          {/* Top Bar: White circular icon chip + Answer chip */}
          <div className="flex items-center justify-between gap-2 relative z-10">
            {/* Top-left: White circular icon chip */}
            <div className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center text-[#16161D] shrink-0">
              <Check className="w-5 h-5 text-[#16161D] stroke-[2.5]" />
            </div>

            {/* Top-right: Pill chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1.5 rounded-full bg-white shadow-soft text-xs font-black text-[#16161D] flex items-center gap-1.5">
                <span>Answer</span>
                <span className="text-[#6B6B7B]">•</span>
                <span>{numberLabel}</span>
              </span>

              {/* Bookmark Toggle Button */}
              <button
                type="button"
                onClick={handleBookmarkClick}
                title={card.bookmarked ? 'Remove from Bookmarks' : 'Bookmark concept'}
                aria-label={card.bookmarked ? 'Remove bookmark' : 'Bookmark this concept'}
                className={`p-2 rounded-full shadow-soft transition-all flex items-center justify-center ${
                  card.bookmarked
                    ? 'bg-[#16161D] text-white hover:bg-black'
                    : 'bg-white text-[#16161D] hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${card.bookmarked ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* Center: Answer & Context */}
          <div className="my-auto py-3 text-center space-y-3 max-w-[56ch] mx-auto overflow-y-auto max-h-[240px] px-2 relative z-10">
            <p className={`${answerFontClass} text-[#16161D] leading-tight tracking-tight whitespace-pre-line font-black`}>
              {card.answer}
            </p>

            {card.explanation && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/85 backdrop-blur-xs text-xs sm:text-sm text-[#16161D] leading-relaxed text-left shadow-soft">
                <span className="font-extrabold text-[#16161D] block mb-0.5">Key Insight / Context:</span>
                {card.explanation}
              </div>
            )}
          </div>

          {/* Bottom Flip Back Indicator */}
          <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs text-[#6B6B7B] font-bold relative z-10">
            <span className="flex items-center gap-1.5 text-[#16161D]">
              <RotateCw className="w-3.5 h-3.5 text-[#16161D]" />
              <span>Tap anywhere to flip back</span>
            </span>
            <span className="text-[11px] font-bold text-[#6B6B7B] px-2.5 py-0.5 rounded-full bg-white/70">
              Reviews: {card.repetitions}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
