import React, { HTMLAttributes } from 'react';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  interactive?: boolean;
  gradientBorder?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  elevated = false,
  interactive = false,
  gradientBorder = false,
  ...props
}) => {
  return (
    <div
      className={`
        rounded-3xl transition-all duration-300 relative
        bg-white dark:bg-navy-800/90
        border border-lightBlue-100/70 dark:border-navy-700/50
        ${elevated ? 'shadow-soft-md' : 'shadow-soft'}
        ${interactive ? 'hover:-translate-y-1 hover:shadow-soft-lg cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
