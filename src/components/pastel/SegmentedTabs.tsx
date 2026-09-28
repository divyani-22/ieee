import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface SegmentedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-1.5 p-1.5 rounded-full bg-white/70 backdrop-blur-md shadow-soft border border-white/60 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 select-none ${
              isActive
                ? 'bg-[#22222B] text-white shadow-sm'
                : 'text-[#6B6B7B] hover:text-[#16161D] hover:bg-white/80'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-1.5 text-[11px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-[#E9E1F5] text-[#6B6B7B]'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
