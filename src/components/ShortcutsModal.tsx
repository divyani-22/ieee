import React from 'react';
import { Keyboard, X } from 'lucide-react';
import { Modal } from './Modal';

export interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: 'Space / Enter', action: 'Flip flashcard between question and answer' },
    { key: '1 or D', action: 'I Don\'t Remember (resets review & auto-bookmarks)' },
    { key: '3 or R', action: 'I Remembered (reinforces memory trace)' },
    { key: 'B', action: 'Toggle Bookmark on current flashcard' },
    { key: '1 – 4', action: 'Choose exact SM-2 interval: Again (1), Hard (2), Good (3), Easy (4)' },
    { key: '?', action: 'Open this keyboard shortcuts cheat-sheet' },
    { key: 'Esc', action: 'Close dialogs, menus, and return' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" maxWidth="md">
      <div className="space-y-4 pt-1">
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Supercharge your study sessions with physical keyboard controls:
        </p>

        <div className="divide-y divide-stone-200/70 dark:divide-stone-800">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-stone-700 dark:text-stone-300 font-medium">
                {s.action}
              </span>
              <kbd className="px-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono font-bold text-[11px] shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </Modal>
  );
};
