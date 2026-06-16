import React from 'react';

export function ChanceBadge({ chance }: { chance: string }) {
  const map = {
    safe:      { label: 'Safe',      className: 'badge-safe' },
    moderate:  { label: 'Moderate',  className: 'badge-moderate' },
    ambitious: { label: 'Ambitious', className: 'badge-ambitious' },
    longshot:  { label: 'Longshot',  className: 'badge-ambitious' },
  };
  const config = map[chance as keyof typeof map] ?? { label: chance, className: '' };
  return (
    <span className={config.className} style={{
      padding: '2px 8px',
      borderRadius: 4,
      fontFamily: 'var(--font-mono)',
      fontSize: '0.65rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      display: 'inline-block',
    }}>
      {config.label}
    </span>
  );
}
