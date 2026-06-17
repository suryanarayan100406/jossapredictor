import React from 'react';

export function ChanceBadge({ chance }: { chance: string }) {
  const map = {
    safe:      { label: 'Safe',      dotClass: 'bg-safe',      className: 'badge-safe' },
    moderate:  { label: 'Moderate',  dotClass: 'bg-moderate',  className: 'badge-moderate' },
    ambitious: { label: 'Ambitious', dotClass: 'bg-ambitious', className: 'badge-ambitious' },
    longshot:  { label: 'Longshot',  dotClass: 'bg-ambitious', className: 'badge-ambitious' },
  };
  const config = map[chance as keyof typeof map] ?? { label: chance, dotClass: 'bg-text-muted', className: '' };
  
  return (
    <span className={`${config.className} px-2 py-0.5 rounded-xs font-mono text-[10px] font-semibold uppercase tracking-wider inline-flex items-center gap-1.25`}>
      <span className={`w-1.25 h-1.25 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}
