import React from 'react';
import { Star, ArrowRight, BookOpen, Monitor, BarChart2, Layers } from 'lucide-react';

import { PastelColorKey, PASTEL_PALETTE } from '../../utils/pastelColors';

export type PastelCardVariant = PastelColorKey;

export interface CourseCardProps {
  variant?: PastelCardVariant;
  icon?: React.ReactNode;
  rating?: string | number;
  category: string;
  title: string;
  studentCountText?: string;
  totalCards?: number;
  onClick?: () => void;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  variant = 'mint',
  icon,
  rating = '3.5',
  category,
  title,
  studentCountText = '5+',
  totalCards,
  onClick,
  className = '',
}) => {
  // Variant theme mapping
  const bgStyles: Record<PastelCardVariant, string> = {
    mint: 'bg-[#D6EAE1] text-[#16161D]',
    lavender: 'bg-[#D9CDEE] text-[#16161D]',
    yellow: 'bg-[#FCE6A6] text-[#16161D]',
    periwinkle: 'bg-[#CFD3F0] text-[#16161D]',
    peach: 'bg-[#F9D9CF] text-[#16161D]',
    pink: 'bg-[#F5D3E3] text-[#16161D]',
  };

  const arrowRingStyles: Record<PastelCardVariant, string> = {
    mint: 'group-hover:border-[#A8D5C2]',
    lavender: 'group-hover:border-[#B9A6E3]',
    yellow: 'group-hover:border-[#E5CB82]',
    periwinkle: 'group-hover:border-[#B2B9E4]',
    peach: 'group-hover:border-[#F2B8A8]',
    pink: 'group-hover:border-[#E8ADC5]',
  };

  return (
    <div
      onClick={onClick}
      className={`card-pillowy relative p-6 sm:p-7 flex flex-col justify-between overflow-hidden cursor-pointer group ${bgStyles[variant]} ${className}`}
    >
      {/* =================================================================== */}
      {/* FAINT WATERMARK & SPARKLE STARS (In background) */}
      {/* =================================================================== */}
      <div className="absolute right-2 bottom-2 pointer-events-none opacity-[0.09] select-none">
        <BookOpen className="w-36 h-36" strokeWidth={1} />
      </div>

      {/* Decorative Sparkle Stars */}
      <svg className="absolute top-8 right-20 w-4 h-4 text-white/70 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg className="absolute bottom-12 right-28 w-3 h-3 text-white/60 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>

      {/* =================================================================== */}
      {/* TOP ROW: White circular icon chip + White pill rating chip */}
      {/* =================================================================== */}
      <div className="flex items-center justify-between relative z-10">
        {/* White circular icon chip */}
        <div className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center text-[#16161D] group-hover:scale-105 transition-transform">
          {icon || <Monitor className="w-5 h-5" />}
        </div>

        {/* White pill rating chip */}
        <div className="px-3 py-1 rounded-full bg-white shadow-soft flex items-center gap-1 text-xs font-bold text-[#16161D]">
          <Star className="w-3.5 h-3.5 fill-[#16161D] text-[#16161D]" />
          <span>{rating}</span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MIDDLE: Category + Semibold 2-line title */}
      {/* =================================================================== */}
      <div className="my-5 relative z-10 space-y-1">
        <span className="text-xs font-semibold text-[#6B6B7B] tracking-wide block">
          {category}
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-[#16161D] leading-snug line-clamp-2">
          {title}
        </h3>
        {totalCards !== undefined && (
          <span className="text-[11px] font-semibold text-[#6B6B7B] block pt-0.5">
            {totalCards} interactive cards
          </span>
        )}
      </div>

      {/* =================================================================== */}
      {/* BOTTOM ROW: Clean Metadata Pill + Circular Arrow Button */}
      {/* =================================================================== */}
      <div className="flex items-center justify-between pt-2 relative z-10">
        {/* Clean status / card count pill */}
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-white shadow-soft text-xs font-black text-[#16161D]">
            {totalCards !== undefined ? `${totalCards} Cards` : 'Ready to Study'}
          </span>
        </div>

        {/* Circular Arrow Button with white ring */}
        <div className={`w-11 h-11 rounded-full bg-white ring-4 ring-white/50 border border-transparent shadow-soft flex items-center justify-center text-[#16161D] transition-all group-hover:scale-110 group-hover:bg-[#16161D] group-hover:text-white ${arrowRingStyles[variant]}`}>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
};
