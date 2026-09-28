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
      <header className="sticky top-0 z-40 w-full bg-[#F3F1F8]/85 backdrop-blur-md border-b border-white/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo on the left */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center border border-white/80 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-[#7D64B5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-[#16161D]">
                  Recall
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D9CDEE] text-[#16161D]">
                  Study App
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Items: Home, Quizzes, Flashcards, Bookmarks, Pathway */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/80 shadow-soft">
            <button
              onClick={() => onNavigate('home')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                currentView === 'home'
                  ? 'bg-[#22222B] text-white shadow-sm'
                  : 'text-[#6B6B7B] hover:text-[#16161D] hover:bg-white'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('quiz')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'quiz'
                  ? 'bg-[#22222B] text-white shadow-sm'
                  : 'text-[#6B6B7B] hover:text-[#16161D] hover:bg-white'
              }`}
            >
              Quizzes
            </button>

            <button
              onClick={() => onNavigate('study')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'study' || currentView === 'deck-detail'
                  ? 'bg-[#22222B] text-white shadow-sm'
                  : 'text-[#6B6B7B] hover:text-[#16161D] hover:bg-white'
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
                  ? 'bg-[#22222B] text-white shadow-sm'
                  : 'text-[#6B6B7B] hover:text-[#16161D] hover:bg-white'
              }`}
            >
              Bookmarks
              {bookmarkedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-butterYellow text-[#16161D] font-extrabold">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('insights')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                currentView === 'insights'
                  ? 'bg-[#22222B] text-white shadow-sm'
                  : 'text-[#6B6B7B] hover:text-[#16161D] hover:bg-white'
              }`}
            >
              Pathway
            </button>
          </nav>

          {/* Right Action Icons: Keyboard Shortcuts */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsShortcutsOpen(true)}
              aria-label="View keyboard shortcuts"
              title="Keyboard shortcuts (?)"
              className="w-10 h-10 rounded-full bg-white text-[#16161D] shadow-soft flex items-center justify-center hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Rounded Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-3 inset-x-4 z-40 flex flex-col items-center gap-1.5">
        <nav className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/80 rounded-full p-2 shadow-soft-lg flex items-center justify-around">
          <button
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3.5 rounded-full text-[11px] font-bold transition-all ${
              currentView === 'home'
                ? 'bg-[#22222B] text-white shadow-sm'
                : 'text-[#6B6B7B]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onNavigate('quiz')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3.5 rounded-full text-[11px] font-bold transition-all ${
              currentView === 'quiz'
                ? 'bg-[#22222B] text-white shadow-sm'
                : 'text-[#6B6B7B]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quiz</span>
          </button>

          <button
            onClick={() => onNavigate('study')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3.5 rounded-full text-[11px] font-bold transition-all relative ${
              currentView === 'study' || currentView === 'deck-detail'
                ? 'bg-[#22222B] text-white shadow-sm'
                : 'text-[#6B6B7B]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Flashcards</span>
            {dueCardsCount > 0 && (
              <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => onNavigate('bookmarks')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3.5 rounded-full text-[11px] font-bold transition-all relative ${
              currentView === 'bookmarks'
                ? 'bg-[#22222B] text-white shadow-sm'
                : 'text-[#6B6B7B]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Bookmarks</span>
            {bookmarkedCount > 0 && (
              <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-butterYellow-400" />
            )}
          </button>

          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex flex-col items-center gap-1 py-1.5 px-3.5 rounded-full text-[11px] font-bold text-[#6B6B7B]"
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </nav>

        {/* Small Home-Indicator Bar */}
        <div className="w-32 h-1 bg-[#16161D]/20 rounded-full" />
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
