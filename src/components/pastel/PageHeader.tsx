import React from 'react';
import { Bell, Search, BookOpen, ArrowLeft } from 'lucide-react';

export interface PageHeaderProps {
  userName?: string;
  progressPercent?: number; // 0-100
  titleLine1?: string;
  titleLine2?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenNotifications?: () => void;
  onOpenSearch?: () => void;
  searchPlaceholder?: string;
  onSearchChange?: (val: string) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  userName = 'Alex',
  progressPercent = 68,
  titleLine1 = 'Your Progress',
  titleLine2 = 'Today',
  showBack = false,
  onBack,
  onOpenNotifications,
  onOpenSearch,
}) => {
  return (
    <div className="space-y-4 pt-2 pb-4">
      {/* Top Greeting Row */}
      <div className="flex items-center justify-between">
        {/* Left: Greeting + Balanced Lavender Progress Bar */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              aria-label="Back"
              className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center text-[#16161D] hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="space-y-1">
            <span className="text-sm sm:text-base font-bold text-[#16161D]">
              Hello {userName}
            </span>
            {/* Book icon + thin lavender progress bar filling available width */}
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-[#7D64B5] shrink-0" />
              <div className="w-44 sm:w-64 h-2 bg-white/80 rounded-full overflow-hidden shadow-xs border border-white">
                <div
                  className="h-full bg-[#B9A6E3] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-black text-[#6B6B7B]">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Right: Circular White Bell Icon Button */}
        <button
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center text-[#16161D] hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-coral-500 ring-2 ring-white" />
        </button>
      </div>

      {/* Main Big Bold Two-Line Title with Search Button */}
      <div className="flex items-end justify-between pt-1">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#16161D] leading-[1.08] tracking-tight">
          {titleLine1}
          {titleLine2 && (
            <>
              <br />
              <span>{titleLine2}</span>
            </>
          )}
        </h1>

        <button
          onClick={onOpenSearch}
          aria-label="Search"
          className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center text-[#16161D] hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Search className="w-5 h-5 text-[#16161D]" />
        </button>
      </div>
    </div>
  );
};
