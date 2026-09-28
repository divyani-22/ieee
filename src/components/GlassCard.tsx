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
        rounded-2xl transition-all duration-300 relative overflow-hidden
        ${elevated ? 'glass-panel-elevated' : 'glass-panel'}
        ${interactive ? 'hover:-translate-y-1 hover:shadow-xl dark:hover:border-zinc-600/60 cursor-pointer' : ''}
        ${gradientBorder ? 'before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r before:from-indigo-500/20 before:via-violet-500/20 before:to-pink-500/20 before:-z-10 before:rounded-2xl' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
