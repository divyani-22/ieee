import React, { useState } from 'react';
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
  Sparkles,
  Phone,
  LogOut,
  Edit2,
  Check
} from 'lucide-react';
import { Button } from './Button';
import { UserProfile } from '../types';

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  onUpdateName: (name: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  totalCards: number;
  bookmarkedCount: number;
  onOpenShortcuts: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onOpenAuth,
  onUpdateName,
  theme,
  onToggleTheme,
  totalCards,
  bookmarkedCount,
  onOpenShortcuts,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');

  if (!isOpen) return null;

  const handleSaveName = () => {
    if (editedName.trim()) {
      onUpdateName(editedName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/45 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white rounded-4xl w-full max-w-md p-7 sm:p-8 space-y-6 shadow-pillowy border border-white relative animate-scale-in overflow-hidden text-[#16161D]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close profile modal"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#16161D] flex items-center justify-center transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Header */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="px-3.5 py-1 rounded-full bg-[#D6EAE1] text-xs font-black text-[#16161D] inline-flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#3A7560]" />
              {user ? (user.provider === 'google' ? 'Google Account' : 'Phone Account') : 'Guest Scholar'}
            </span>

            {user && (
              <span className="text-[11px] font-bold text-[#6B6B7B]">
                Active Session
              </span>
            )}
          </div>

          <div>
            {isEditingName ? (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Your Name"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-base font-extrabold text-[#16161D] focus:outline-none focus:ring-2 focus:ring-[#B9A6E3]"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-2 rounded-xl bg-[#22222B] text-white hover:bg-black"
                  title="Save name"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-[#16161D] tracking-tight">
                  {user?.name || 'Guest Scholar'}
                </h3>
                {user && (
                  <button
                    onClick={() => {
                      setEditedName(user.name);
                      setIsEditingName(true);
                    }}
                    className="p-1 text-[#6B6B7B] hover:text-[#16161D] transition-colors"
                    title="Edit Name"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <p className="text-xs font-semibold text-[#6B6B7B] mt-0.5">
              {user
                ? user.email || user.phone
                : 'Sign in with Google or Phone to sync progress'}
            </p>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#D6EAE1] text-center space-y-1 shadow-xs">
            <Flame className="w-4 h-4 mx-auto text-[#16161D]" />
            <div className="text-base font-black text-[#16161D]">7 Days</div>
            <div className="text-[10px] font-bold text-[#6B6B7B] uppercase">Streak</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FCE6A6] text-center space-y-1 shadow-xs">
            <BookOpen className="w-4 h-4 mx-auto text-[#16161D]" />
            <div className="text-base font-black text-[#16161D]">{totalCards}</div>
            <div className="text-[10px] font-bold text-[#6B6B7B] uppercase">Cards</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#D9CDEE] text-center space-y-1 shadow-xs">
            <Bookmark className="w-4 h-4 mx-auto text-[#16161D]" />
            <div className="text-base font-black text-[#16161D]">{bookmarkedCount}</div>
            <div className="text-[10px] font-bold text-[#6B6B7B] uppercase">Saved</div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="text-xs font-extrabold text-[#6B6B7B] uppercase tracking-wider">
            Settings & Shortuts
          </div>

          {/* Theme toggle row */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5 text-xs font-bold text-[#16161D]">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-[#7D64B5]" /> : <Sun className="w-4 h-4 text-[#B89431]" />}
              <span>Appearance</span>
            </div>
            <button
              onClick={onToggleTheme}
              className="px-3.5 py-1 rounded-full text-xs font-black bg-white text-[#16161D] shadow-xs hover:bg-slate-50 transition-all"
            >
              {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>

          {/* Shortcuts trigger */}
          <button
            onClick={() => {
              onClose();
              onOpenShortcuts();
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-[#16161D] hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Keyboard className="w-4 h-4 text-[#6B6B7B]" />
              <span>Keyboard Shortcuts</span>
            </div>
            <kbd className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono shadow-xs">?</kbd>
          </button>
        </div>

        {/* Action Button: Sign In / Out */}
        <div className="pt-2">
          {user ? (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-3 rounded-full bg-slate-100 hover:bg-rose-50 text-rose-600 text-xs font-black transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="w-full py-3.5 rounded-full bg-[#22222B] text-white text-xs font-black shadow-pillowy hover:bg-black transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Sign In with Google or Phone</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
