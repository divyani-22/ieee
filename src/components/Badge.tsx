import React from 'react';
import { CardDifficulty, CardType } from '../types';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
    primary: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/60',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/60',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60',
    outline: 'border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 bg-transparent',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const CardTypeBadge: React.FC<{ type: CardType }> = ({ type }) => {
  switch (type) {
    case 'definition':
      return <Badge variant="primary" size="sm">Definition</Badge>;
    case 'cloze':
      return <Badge variant="purple" size="sm">Cloze Fill</Badge>;
    case 'mcq':
      return <Badge variant="success" size="sm">MCQ 4-Choice</Badge>;
    case 'true-false':
      return <Badge variant="warning" size="sm">True / False</Badge>;
    default:
      return <Badge size="sm">{type}</Badge>;
  }
};

export const DifficultyBadge: React.FC<{ difficulty: CardDifficulty }> = ({ difficulty }) => {
  switch (difficulty) {
    case 'easy':
      return <Badge variant="success" size="sm">Easy</Badge>;
    case 'medium':
      return <Badge variant="warning" size="sm">Medium</Badge>;
    case 'hard':
      return <Badge variant="danger" size="sm">Challenging</Badge>;
  }
};
