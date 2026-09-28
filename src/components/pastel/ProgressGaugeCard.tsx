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
  // Semicircle gauge calculation
  // Radius = 68, circumference = Math.PI * 68 = ~213.6
  const radius = 68;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className={`card-pillowy bg-[#D9CDEE] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden text-[#16161D] ${className}`}>
      {/* Top Header: Icon chip + "Progress" + "..." circular menu button */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-[#16161D]">
            <Target className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-[#16161D]">
            {title}
          </span>
        </div>

        <button
          onClick={onMenuClick}
          aria-label="Options"
          className="w-8 h-8 rounded-full bg-white/70 hover:bg-white shadow-xs flex items-center justify-center text-[#16161D] transition-transform active:scale-95"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Semicircular Gauge Area */}
      <div className="relative flex flex-col items-center justify-center pt-4 pb-2">
        <div className="relative w-48 h-28 flex items-center justify-center overflow-hidden">
          <svg className="w-48 h-48 -rotate-180 transform" viewBox="0 0 160 160">
            {/* White Dashed Background Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="4 6"
              className="opacity-95"
            />

            {/* Filled Yellow Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#FCE6A6"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out drop-shadow-xs"
            />
          </svg>

          {/* Centered Big Score & Label */}
          <div className="absolute bottom-2 inset-x-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#16161D] tracking-tight leading-none">
              {score}
            </span>
            <span className="text-xs font-semibold text-[#6B6B7B] mt-1 uppercase tracking-wider">
              {label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
