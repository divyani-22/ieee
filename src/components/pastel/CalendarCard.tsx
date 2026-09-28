import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from 'lucide-react';

export interface CalendarCardProps {
  initialMonth?: string;
  selectedDay?: number;
  activeDays?: number[]; // days that have study activity
  onSelectDate?: (day: number) => void;
  className?: string;
}

export const CalendarCard: React.FC<CalendarCardProps> = ({
  initialMonth = 'July 2025',
  selectedDay = 12,
  activeDays = [3, 4, 10, 11, 12, 18, 19, 25, 26],
  onSelectDate,
  className = '',
}) => {
  const [currentDay, setCurrentDay] = useState(selectedDay);

  const daysOfWeek = ['W', 'T', 'F', 'S', 'S'];
  const dates = [
    2, 3, 4, 5, 6,
    10, 11, 12, 13, 14,
    18, 19, 20, 21, 22,
    25, 26, 27, 28, 29,
  ];

  const handleSelect = (day: number) => {
    setCurrentDay(day);
    if (onSelectDate) onSelectDate(day);
  };

  return (
    <div className={`card-pillowy bg-[#D6EAE1] p-6 sm:p-7 flex flex-col justify-between text-[#16161D] ${className}`}>
      {/* Month Title & Prev/Next Circular Buttons */}
      <div className="flex items-center justify-between">
        <h4 className="text-base sm:text-lg font-extrabold text-[#16161D]">
          {initialMonth}
        </h4>

        <div className="flex items-center gap-1.5">
          <button
            aria-label="Previous month"
            className="w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow-xs flex items-center justify-center text-[#16161D] transition-transform active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            aria-label="Next month"
            className="w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow-xs flex items-center justify-center text-[#16161D] transition-transform active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold text-[#6B6B7B] pt-4 pb-2">
        {daysOfWeek.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* Circular Date Bubbles Grid */}
      <div className="grid grid-cols-5 gap-2 text-center">
        {dates.map((day) => {
          const isSelected = day === currentDay;
          const hasActivity = activeDays.includes(day);

          return (
            <button
              key={day}
              onClick={() => handleSelect(day)}
              className={`w-9 h-9 mx-auto rounded-full text-xs font-extrabold flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-[#22222B] text-white shadow-soft scale-105'
                  : hasActivity
                  ? 'bg-white text-[#16161D] shadow-xs hover:scale-105'
                  : 'bg-white/40 text-[#6B6B7B] hover:bg-white/70'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Bottom Summary Pill */}
      <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-[#16161D]">
        <span>Study Days Streak:</span>
        <span className="px-2.5 py-0.5 rounded-full bg-white text-[#16161D] font-extrabold shadow-xs">
          7 Days 🔥
        </span>
      </div>
    </div>
  );
};
