import { Card } from '../types';

export type Rating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy

export interface ScheduleResult {
  repetitions: number;
  interval: number; // in days
  easeFactor: number;
  dueDate: string; // YYYY-MM-DD
}

/**
 * Enhanced SuperMemo-2 / FSRS hybrid scheduling algorithm.
 * Rating:
 * 1 = Again: Failed recall. Restart learning step.
 * 2 = Hard: Difficult recall. Slight interval advance, ease decreased.
 * 3 = Good: Standard successful recall. Normal interval leap.
 * 4 = Easy: Effortless recall. Enhanced interval leap, ease increased.
 */
export function calculateNextReview(
  currentRepetitions: number,
  currentInterval: number,
  currentEaseFactor: number,
  rating: Rating
): ScheduleResult {
  let repetitions = currentRepetitions;
  let interval = currentInterval;
  let easeFactor = currentEaseFactor || 2.5;

  if (rating === 1) {
    // Again
    repetitions = 0;
    interval = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else if (rating === 2) {
    // Hard
    repetitions = repetitions + 1;
    if (repetitions === 1) {
      interval = 1;
    } else {
      interval = Math.max(2, Math.round(interval * 1.2));
    }
    easeFactor = Math.max(1.3, easeFactor - 0.15);
  } else if (rating === 3) {
    // Good
    repetitions = repetitions + 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 4;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    // Ease factor remains stable on standard good recall
  } else if (rating === 4) {
    // Easy
    repetitions = repetitions + 1;
    if (repetitions === 1) {
      interval = 3;
    } else if (repetitions === 2) {
      interval = 7;
    } else {
      interval = Math.round(interval * easeFactor * 1.35);
    }
    easeFactor = Math.min(3.0, easeFactor + 0.15);
  }

  // Calculate target due date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);
  const dueDate = nextDate.toISOString().slice(0, 10);

  return {
    repetitions,
    interval,
    easeFactor: Number(easeFactor.toFixed(2)),
    dueDate,
  };
}

export function formatInterval(days: number): string {
  if (days <= 1) return '1d';
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${(days / 365).toFixed(1)}y`;
}
