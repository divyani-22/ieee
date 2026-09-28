import { useEffect } from 'react';

export interface ShortcutMap {
  [key: string]: (e: KeyboardEvent) => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input, textarea, or contentEditable element
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (shortcuts[key]) {
        shortcuts[key](e);
      } else if (shortcuts[e.code]) {
        shortcuts[e.code](e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}
