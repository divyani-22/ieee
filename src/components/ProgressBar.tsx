import React from 'react';

export const ProgressBar: React.FC<{
  progress: number; // 0 to 100
  color?: string;
  className?: string;
  showLabel?: boolean;
}> = ({ progress, color = 'bg-indigo-600', className = '', showLabel = false }) => {
  const clamped = Math.max(0, Math.min(100, progress));
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-1.5">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-zinc-200/60 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-200/40 dark:border-zinc-700/40">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${color}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`animate-pulse bg-zinc-200/80 dark:bg-zinc-800/80 rounded-xl ${className}`}
    />
  );
};
