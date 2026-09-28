import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Layers,
  Star,
  BarChart3,
  Bookmark,
  Sun,
  Moon,
  Keyboard,
  User,
  Search,
  HelpCircle,
  Bell
} from 'lucide-react';
import { ViewMode } from '../types';
import { ShortcutsModal } from './ShortcutsModal';
import { ProfileModal } from './ProfileModal';

export interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  dueCardsCount: number;
  bookmarkedCount?: number;
  totalCardsCount?: number;
  onOpenUpload?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  theme,
  onToggleTheme,
  dueCardsCount,
  bookmarkedCount = 0,
  totalCardsCount = 0,
}) => {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        setIsShortcutsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  return (
    <>
      {/* Top Desktop & Tablet Navigation */}
      <header className="sticky top-0 z-40 w-full bg-pageBg/90 dark:bg-navy-900/90 backdrop-blur-md border-b border-lightBlue-100/80 dark:border-navy-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo on the left */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-11 h-11 rounded-2xl bg-navy text-white flex items-center justify-center shadow-navy-soft group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-yellowPastel" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-navy dark:text-white">
                  Recall
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-lightBlue-100 text-navy dark:bg-navy-700 dark:text-lightBlue-200">
                  Study App
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Items: Home, Quizzes, Flashcards, Bookmarks, Progress */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-white dark:bg-navy-800 border border-lightBlue-100/70 dark:border-navy-700 shadow-soft">
            <button
              onClick={() => onNavigate('home')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                currentView === 'home'
                  ? 'bg-navy text-white shadow-soft'
                  : 'text-navy/70 dark:text-lightBlue-100 hover:text-navy dark:hover:text-white hover:bg-lightBlue-50/70 dark:hover:bg-navy-700'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('quiz')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'quiz'
                  ? 'bg-navy text-white shadow-soft'
                  : 'text-navy/70 dark:text-lightBlue-100 hover:text-navy dark:hover:text-white hover:bg-lightBlue-50/70 dark:hover:bg-navy-700'
              }`}
            >
              Quizzes
            </button>

            <button
              onClick={() => onNavigate('study')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'study' || currentView === 'deck-detail'
                  ? 'bg-navy text-white shadow-soft'
                  : 'text-navy/70 dark:text-lightBlue-100 hover:text-navy dark:hover:text-white hover:bg-lightBlue-50/70 dark:hover:bg-navy-700'
              }`}
            >
              Flashcards
              {dueCardsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-coral text-white font-extrabold animate-pulse">
                  {dueCardsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('bookmarks')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'bookmarks'
                  ? 'bg-navy text-white shadow-soft'
                  : 'text-navy/70 dark:text-lightBlue-100 hover:text-navy dark:hover:text-white hover:bg-lightBlue-50/70 dark:hover:bg-navy-700'
              }`}
            >
              Bookmarks
              {bookmarkedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-yellowPastel text-navy font-extrabold">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('insights')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                currentView === 'insights'
                  ? 'bg-navy text-white shadow-soft'
                  : 'text-navy/70 dark:text-lightBlue-100 hover:text-navy dark:hover:text-white hover:bg-lightBlue-50/70 dark:hover:bg-navy-700'
              }`}
            >
              Progress
            </button>
          </nav>

          {/* Right Action Icons: Keyboard Shortcuts & Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsShortcutsOpen(true)}
              aria-label="View keyboard shortcuts"
              title="Keyboard shortcuts (?)"
              className="p-2.5 rounded-2xl bg-white dark:bg-navy-800 text-navy/70 dark:text-lightBlue-100 hover:text-navy dark:hover:text-white border border-lightBlue-100/70 dark:border-navy-700 shadow-soft transition-all"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-2xl bg-white dark:bg-navy-800 text-navy/70 dark:text-lightBlue-100 hover:text-navy dark:hover:text-white border border-lightBlue-100/70 dark:border-navy-700 shadow-soft transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-yellowPastel-500" /> : <Moon className="w-4 h-4 text-navy" />}
            </button>

            {/* Profile Avatar on Right */}
            <button
              onClick={() => setIsProfileOpen(true)}
              aria-label="User Profile"
              className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-white dark:bg-navy-800 border border-lightBlue-100/70 dark:border-navy-700 shadow-soft hover:shadow-soft-md transition-all select-none"
            >
              <span className="text-xs font-bold text-navy dark:text-white hidden sm:inline">
                Alex
              </span>
              <div className="w-8 h-8 rounded-full bg-coral text-white flex items-center justify-center font-bold text-xs shadow-coral-soft">
                A
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Rounded Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-40">
        <nav className="bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl border border-lightBlue-100 dark:border-navy-700 rounded-3xl p-2 shadow-soft-lg flex items-center justify-around">
          <button
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-[11px] font-bold transition-all ${
              currentView === 'home'
                ? 'bg-navy text-white shadow-soft'
                : 'text-navy/60 dark:text-lightBlue-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onNavigate('quiz')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-[11px] font-bold transition-all ${
              currentView === 'quiz'
                ? 'bg-navy text-white shadow-soft'
                : 'text-navy/60 dark:text-lightBlue-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quiz</span>
          </button>

          <button
            onClick={() => onNavigate('study')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-[11px] font-bold transition-all relative ${
              currentView === 'study' || currentView === 'deck-detail'
                ? 'bg-navy text-white shadow-soft'
                : 'text-navy/60 dark:text-lightBlue-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Flashcards</span>
            {dueCardsCount > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-coral" />
            )}
          </button>

          <button
            onClick={() => onNavigate('bookmarks')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-[11px] font-bold transition-all relative ${
              currentView === 'bookmarks'
                ? 'bg-navy text-white shadow-soft'
                : 'text-navy/60 dark:text-lightBlue-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Bookmarks</span>
            {bookmarkedCount > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-yellowPastel" />
            )}
          </button>

          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-[11px] font-bold text-navy/60 dark:text-lightBlue-200"
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </nav>
      </div>

      {/* Modals */}
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        theme={theme}
        onToggleTheme={onToggleTheme}
        totalCards={totalCardsCount}
        bookmarkedCount={bookmarkedCount}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />
    </>
  );
};
