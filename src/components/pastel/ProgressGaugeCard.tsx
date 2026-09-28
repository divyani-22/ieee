import React from 'react';
import { Target, MoreHorizontal } from 'lucide-react';

export interface ProgressGaugeCardProps {
  score?: number | string;
  maxScore?: number;
  label?: string;
  title?: string;
  percent?: number; // 0 to 100
  onMenuClick?: () => void;
  className?: string;
}

export const ProgressGaugeCard: React.FC<ProgressGaugeCardProps> = ({
  score = 200,
  maxScore = 250,
  label = 'Score',
  title = 'Progress',
  percent = 80,
  onMenuClick,
  className = '',
}) => {
  // Complete 360-degree circular progress calculation
  const radius = 58;
  const circumference = 2 * Math.PI * radius; // ~364.42
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  return (
    <div className={`card-pillowy bg-[#D9CDEE] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden text-[#16161D] shadow-pillowy ${className}`}>
      {/* Top Header: Icon chip + "Progress" + "..." circular menu button */}
      <div className="flex items-center justify-between relative z-10 w-full mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center text-[#16161D]">
            <Target className="w-4 h-4 text-[#7D64B5]" />
          </div>
          <span className="text-base font-bold text-[#16161D]">
            {title}
          </span>
        </div>

        <button
          onClick={onMenuClick}
          aria-label="Options"
          className="w-9 h-9 rounded-full bg-white/70 hover:bg-white shadow-soft flex items-center justify-center text-[#16161D] transition-transform active:scale-95"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Complete 360-degree Circular Progress Area (Centered, No Cut-offs) */}
      <div className="relative flex items-center justify-center w-full py-3 my-auto">
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            {/* Complete White Background Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="13"
              className="opacity-90"
            />

            {/* Filled Animated Progress Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#FCE6A6"
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out drop-shadow-xs"
            />
          </svg>

          {/* Centered Big Score & Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <span className="text-4xl sm:text-5xl font-black text-[#16161D] tracking-tight leading-none">
              {score}
            </span>
            <span className="text-xs font-extrabold text-[#6B6B7B] mt-1.5 uppercase tracking-wider">
              {label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
