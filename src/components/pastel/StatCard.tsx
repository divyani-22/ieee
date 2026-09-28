import React from 'react';
import { ArrowUpRight, CheckCircle2, Award, Target, Flame } from 'lucide-react';

export interface StatCardProps {
  variant?: 'mint' | 'yellow' | 'lavender';
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  variant = 'mint',
  title,
  value,
  icon,
  onClick,
  className = '',
}) => {
  const bgStyles = {
    mint: 'bg-[#D6EAE1] text-[#16161D]',
    yellow: 'bg-[#FCE6A6] text-[#16161D]',
    lavender: 'bg-[#D9CDEE] text-[#16161D]',
  };

  return (
    <div
      onClick={onClick}
      className={`card-pillowy p-5 sm:p-6 flex flex-col justify-between cursor-pointer group ${bgStyles[variant]} ${className}`}
    >
      {/* Top Header: Small icon chip + Title */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-[#16161D]">
          {icon || <CheckCircle2 className="w-4 h-4" />}
        </div>
        <span className="text-xs sm:text-sm font-semibold text-[#16161D]/80">
          {title}
        </span>
      </div>

      {/* Bottom Row: Big Bold Number + Circular White Arrow Button */}
      <div className="flex items-baseline justify-between pt-4">
        <span className="text-3xl sm:text-4xl font-extrabold text-[#16161D] tracking-tight">
          {value}
        </span>

        {/* Circular White Arrow Button */}
        <div className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center text-[#16161D] transition-transform group-hover:scale-110 group-hover:bg-[#16161D] group-hover:text-white">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
