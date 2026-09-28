import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, BookOpen, BarChart3, Sun, Moon, Plus, Bookmark, Star, Keyboard } from 'lucide-react';
import { ViewMode } from '../types';
import { Button } from './Button';
import { ShortcutsModal } from './ShortcutsModal';

export interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  dueCardsCount: number;
  bookmarkedCount?: number;
  onOpenUpload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  theme,
  onToggleTheme,
  dueCardsCount,
  bookmarkedCount = 0,
  onOpenUpload,
}) => {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-200/50 dark:border-zinc-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-700 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                Recall
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                100% Offline
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/60 p-1 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 backdrop-blur-md">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentView === 'home'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Upload & Create
          </button>

          <button
            onClick={() => onNavigate('decks')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentView === 'decks' || currentView === 'deck-detail'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Deck Library
            {dueCardsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-600 text-white font-bold animate-pulse">
                {dueCardsCount} due
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('bookmarks')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentView === 'bookmarks'
                ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-400/40 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-300'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            My Bookmarks
            {bookmarkedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-extrabold shadow-sm">
                {bookmarkedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('insights')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentView === 'insights'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
            Insights & Stats
          </button>
        </nav>


        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onOpenUpload}
            size="sm"
            variant="primary"
            className="hidden sm:inline-flex shadow-sm"
          >
            <Plus className="w-4 h-4 mr-0.5" />
            New Deck
          </Button>

          {/* Keyboard Shortcuts Trigger */}
          <button
            onClick={() => setIsShortcutsOpen(true)}
            aria-label="View keyboard shortcuts"
            title="Keyboard shortcuts (?)"
            className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>

      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />


      {/* Mobile Nav Bar */}
      <div className="flex md:hidden items-center justify-around border-t border-zinc-200/50 dark:border-zinc-800/60 px-2 py-2">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium ${
            currentView === 'home' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-zinc-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Create
        </button>
        <button
          onClick={() => onNavigate('decks')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium relative ${
            currentView === 'decks' || currentView === 'deck-detail' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-zinc-500'
          }`}
        >
          <Layers className="w-4 h-4" />
          Decks
          {dueCardsCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-zinc-900" />
          )}
        </button>
        <button
          onClick={() => onNavigate('bookmarks')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium relative ${
            currentView === 'bookmarks' ? 'text-amber-500 font-bold' : 'text-zinc-500'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Bookmarks
          {bookmarkedCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-zinc-900" />
          )}
        </button>
        <button
          onClick={() => onNavigate('insights')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium ${
            currentView === 'insights' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-zinc-500'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Stats
        </button>
      </div>
    </header>
  );
};
