import React from 'react';

export function ChanceBadge({ chance }: { chance: string }) {
  const map = {
    safe:      { label: 'Safe',      dotColor: 'var(--safe)',      className: 'badge-safe' },
    moderate:  { label: 'Moderate',  dotColor: 'var(--moderate)',  className: 'badge-moderate' },
    ambitious: { label: 'Ambitious', dotColor: 'var(--ambitious)', className: 'badge-ambitious' },
    longshot:  { label: 'Longshot',  dotColor: 'var(--ambitious)', className: 'badge-ambitious' },
  };
  const config = map[chance as keyof typeof map] ?? { label: chance, dotColor: 'var(--text-muted)', className: '' };
  
  return (
    <span className={config.className} style={{
      padding: '3px 8px',
      borderRadius: 'var(--radius-xs)',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.625rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: config.dotColor }} />
      {config.label}
    </span>
  );
}
