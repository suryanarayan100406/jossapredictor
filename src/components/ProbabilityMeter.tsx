'use client';
import React from 'react';

interface ProbabilityMeterProps {
  probability: number;
  size?: number;
}

export function ProbabilityMeter({ probability, size = 80 }: ProbabilityMeterProps) {
  const strokeWidth = 7;
  const cx = size / 2;
  const cy = size * 0.7;
  const r = size * 0.42;

  const bgStart = polarToCartesian(cx, cy, r, 180);
  const bgEnd = polarToCartesian(cx, cy, r, 0);
  const bgPath = `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 0 1 ${bgEnd.x} ${bgEnd.y}`;

  const fillDeg = 180 - (probability / 100) * 180;
  const fillEnd = polarToCartesian(cx, cy, r, fillDeg);
  const largeArc = probability > 50 ? 1 : 0;
  const fillPath = `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${largeArc} 1 ${fillEnd.x} ${fillEnd.y}`;

  let color = '#16a34a';
  if (probability < 40) color = '#ef4444';
  else if (probability < 75) color = '#ea9209';

  const label = probability >= 75 ? 'High' : probability >= 40 ? 'Fair' : 'Tough';

  const arcStyle = { transition: 'stroke 0.4s ease' } as const;
  const valueTextStyle = {
    fontSize: size * 0.26,
    fontWeight: 800,
    fontFamily: 'var(--font-display)',
  } as const;
  const labelTextStyle = {
    fontSize: size * 0.13,
    fontWeight: 700,
    letterSpacing: '0.04em',
    fontFamily: 'var(--font-display)',
  } as const;

  return (
    <svg width={size} height={size * 0.9} viewBox={`0 0 ${size} ${size * 0.9}`}>
      <path d={bgPath} fill="none" stroke="#e7edf6" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d={fillPath} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" style={arcStyle} />
      <text x={cx} y={cy - 2} textAnchor="middle" fill="var(--text-primary)" style={valueTextStyle}>
        {probability}%
      </text>
      <text x={cx} y={cy + size * 0.14} textAnchor="middle" fill={color} style={labelTextStyle}>
        {label}
      </text>
    </svg>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad),
  };
}
