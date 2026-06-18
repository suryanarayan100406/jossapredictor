import React from 'react';

export function ChanceBadge({ chance }: { chance: string }) {
  const map = {
    safe:      { label: 'Safe bet',   emoji: '✅', className: 'badge-safe' },
    moderate:  { label: 'Worth a go', emoji: '⚡', className: 'badge-moderate' },
    ambitious: { label: 'A stretch',  emoji: '🔥', className: 'badge-ambitious' },
    longshot:  { label: 'Long shot',  emoji: '🎯', className: 'badge-ambitious' },
  };
  const config = map[chance as keyof typeof map] ?? { label: chance, emoji: '✨', className: 'badge-moderate' };

  return (
    <span className={`${config.className} px-2.5 py-1 font-display text-[11px] font-bold inline-flex items-center gap-1.5`}>
      <span aria-hidden>{config.emoji}</span>
      {config.label}
    </span>
  );
}
