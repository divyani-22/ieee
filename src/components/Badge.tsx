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
    default: 'bg-lightBlue-50 text-navy dark:bg-navy-800 dark:text-lightBlue-200 border-lightBlue-200/60 dark:border-navy-700',
    primary: 'bg-lightBlue-100 text-navy dark:bg-navy-700 dark:text-lightBlue-200 border-lightBlue-300/70',
    success: 'bg-lightBlue-50 text-navy dark:bg-navy-700 dark:text-lightBlue-200 border-lightBlue-200/60',
    warning: 'bg-yellowPastel-100 text-navy dark:bg-yellowPastel-900/40 dark:text-yellowPastel-200 border-yellowPastel-200',
    danger: 'bg-coral-100 text-coral-600 dark:bg-coral-950/60 dark:text-coral-300 border-coral-200',
    purple: 'bg-lightBlue-100 text-navy dark:bg-navy-700 dark:text-lightBlue-200 border-lightBlue-200',
    outline: 'border border-lightBlue-200 dark:border-navy-700 text-navy dark:text-lightBlue-200 bg-white/60 dark:bg-navy-800/60',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 font-bold tracking-wide',
    md: 'text-xs px-3 py-1 font-bold tracking-wide',
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
      return <Badge variant="warning" size="sm">Cloze</Badge>;
    case 'mcq':
      return <Badge variant="default" size="sm">Multiple Choice</Badge>;
    case 'true-false':
      return <Badge variant="danger" size="sm">True / False</Badge>;
    default:
      return <Badge size="sm">{type}</Badge>;
  }
};

export const DifficultyBadge: React.FC<{ difficulty: CardDifficulty }> = ({ difficulty }) => {
  switch (difficulty) {
    case 'easy':
      return <Badge variant="primary" size="sm">Simple</Badge>;
    case 'medium':
      return <Badge variant="warning" size="sm">Intermediate</Badge>;
    case 'hard':
      return <Badge variant="danger" size="sm">Hard</Badge>;
  }
};
