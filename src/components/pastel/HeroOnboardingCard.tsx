import React from 'react';
import { BooksIllustration } from './BooksIllustration';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface HeroOnboardingCardProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const HeroOnboardingCard: React.FC<HeroOnboardingCardProps> = ({
  title = 'Start Learning Today',
  description = 'Unlock knowledge anytime with expert-led lessons and personalized AI flashcards.',
  buttonText = 'Get Started Now',
  onCtaClick,
  className = '',
}) => {
  return (
    <div className={`card-pillowy bg-gradient-to-b from-[#D9CDEE] to-[#CFD3F0] p-0 flex flex-col justify-between overflow-hidden relative shadow-pillowy ${className}`}>
      {/* Top Half: Blue Books Flat Vector Illustration with Sparkle Stars */}
      <div className="pt-8 pb-4 px-6 flex items-center justify-center relative">
        <BooksIllustration className="w-full h-44" />
      </div>

      {/* Bottom Sheet: White rounded panel */}
      <div className="bg-white rounded-t-[32px] p-6 sm:p-8 space-y-4 shadow-[0_-8px_30px_rgba(120,100,170,0.06)] relative z-10 text-center sm:text-left">
        {/* Floating Sparkle Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E1F5] text-xs font-bold text-[#16161D]">
          <Sparkles className="w-3.5 h-3.5 text-[#7D64B5]" />
          <span>Interactive Lecture Learning</span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16161D] leading-tight tracking-tight">
          {title}
        </h2>

        {/* Muted description */}
        <p className="text-sm font-medium text-[#6B6B7B] leading-relaxed max-w-lg">
          {description}
        </p>

        {/* Dark Pill CTA Button */}
        <div className="pt-2">
          <button
            onClick={onCtaClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#22222B] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-soft hover:bg-black transition-all hover:scale-[1.02] active:scale-98"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
