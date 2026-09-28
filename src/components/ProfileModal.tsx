import React from 'react';
import {
  User,
  Flame,
  Award,
  BookOpen,
  Bookmark,
  Sun,
  Moon,
  Keyboard,
  CheckCircle2,
  X,
  Settings,
  Sparkles
} from 'lucide-react';
import { Button } from './Button';

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  totalCards: number;
  bookmarkedCount: number;
  onOpenShortcuts: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  totalCards,
  bookmarkedCount,
  onOpenShortcuts,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-navy-800 rounded-4xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-soft-lg border border-lightBlue-100 dark:border-navy-700 relative animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close profile modal"
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-lightBlue-50 dark:hover:bg-navy-700 text-navy/60 dark:text-white/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 pt-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-coral to-yellowPastel flex items-center justify-center text-white text-2xl font-black shadow-coral-soft">
            AC
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lightBlue-100 text-navy text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-coral" />
              Pro Student
            </div>
            <h3 className="text-xl font-extrabold text-navy dark:text-white mt-0.5">
              Alex Chen
            </h3>
            <p className="text-xs text-navy/60 dark:text-lightBlue-200">
              alex.chen@student.edu
            </p>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-lightBlue-50 dark:bg-navy-700/60 border border-lightBlue-100 dark:border-navy-600 text-center space-y-1">
            <Flame className="w-4 h-4 mx-auto text-coral fill-coral" />
            <div className="text-base font-black text-navy dark:text-white">7 Days</div>
            <div className="text-[10px] font-bold text-navy/50 dark:text-lightBlue-200 uppercase">Streak</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-yellowPastel-50 dark:bg-navy-700/60 border border-yellowPastel-100 dark:border-navy-600 text-center space-y-1">
            <BookOpen className="w-4 h-4 mx-auto text-yellowPastel-500" />
            <div className="text-base font-black text-navy dark:text-white">{totalCards}</div>
            <div className="text-[10px] font-bold text-navy/50 dark:text-lightBlue-200 uppercase">Cards</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-coral-50 dark:bg-navy-700/60 border border-coral-100 dark:border-navy-600 text-center space-y-1">
            <Bookmark className="w-4 h-4 mx-auto text-coral fill-coral" />
            <div className="text-base font-black text-navy dark:text-white">{bookmarkedCount}</div>
            <div className="text-[10px] font-bold text-navy/50 dark:text-lightBlue-200 uppercase">Saved</div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-3 pt-1 border-t border-lightBlue-100/70 dark:border-navy-700">
          <div className="text-xs font-bold text-navy/60 dark:text-lightBlue-200 uppercase tracking-wider">
            App Settings
          </div>

          {/* Theme toggle row */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-pageBg dark:bg-navy-900 border border-lightBlue-100/60 dark:border-navy-700">
            <div className="flex items-center gap-2.5 text-xs font-bold text-navy dark:text-white">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-lightBlue" /> : <Sun className="w-4 h-4 text-yellowPastel-500" />}
              <span>Appearance Mode</span>
            </div>
            <button
              onClick={onToggleTheme}
              className="px-3 py-1 rounded-xl text-xs font-extrabold bg-white dark:bg-navy-800 text-navy dark:text-white border border-lightBlue-200 dark:border-navy-600 shadow-sm transition-all"
            >
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>

          {/* Shortcuts trigger */}
          <button
            onClick={() => {
              onClose();
              onOpenShortcuts();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-pageBg dark:bg-navy-900 border border-lightBlue-100/60 dark:border-navy-700 text-xs font-bold text-navy dark:text-white hover:bg-lightBlue-50 dark:hover:bg-navy-850 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Keyboard className="w-4 h-4 text-navy/60 dark:text-lightBlue-200" />
              <span>Keyboard Shortcuts</span>
            </div>
            <kbd className="px-2 py-0.5 rounded-md bg-white dark:bg-navy-800 border border-lightBlue-200 dark:border-navy-600 text-[10px] font-mono">?</kbd>
          </button>
        </div>

        {/* Close action */}
        <Button
          size="md"
          variant="primary"
          onClick={onClose}
          className="w-full font-bold shadow-soft"
        >
          Done
        </Button>
      </div>
    </div>
  );
};
