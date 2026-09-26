import React from 'react';

interface AdPlaceholderProps {
  slot?: string;
  format?: 'banner' | 'rectangle' | 'inline';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  format = 'banner',
  className = ''
}) => {
  return (
    <div
      className={`my-6 mx-auto flex flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50/60 rounded-xl p-4 text-center select-none transition-all ${className}`}
      aria-label="Advertisement Placement"
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Advertisement
      </span>
      <div
        className={`w-full flex items-center justify-center text-xs text-slate-400 font-medium ${
          format === 'banner'
            ? 'h-20 sm:h-24 max-w-3xl'
            : format === 'rectangle'
            ? 'h-60 max-w-sm'
            : 'h-16 max-w-xl'
        }`}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="inline-block w-8 h-8 rounded-lg bg-slate-200/70 text-slate-500 font-mono text-xs flex items-center justify-center">
            Ad
          </span>
          <span className="text-[11px] text-slate-400">
            {format === 'banner'
              ? 'Leaderboard Ad Slot (728x90)'
              : format === 'rectangle'
              ? 'Medium Rectangle Ad Slot (300x250)'
              : 'Responsive Inline Ad Slot'}
          </span>
        </div>
      </div>
    </div>
  );
};
