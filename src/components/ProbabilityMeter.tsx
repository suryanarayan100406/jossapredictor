'use client';
import React from 'react';

interface ProbabilityMeterProps {
  probability: number;
  size?: number;
}

export function ProbabilityMeter({ probability, size = 80 }: ProbabilityMeterProps) {
  // SVG arc parameters
  const strokeWidth = 7;
  const cx = size / 2;
  const cy = size * 0.7;        // arc is in the bottom 70% of the SVG
  const r = size * 0.42;

  // Background arc
  const bgStart = polarToCartesian(cx, cy, r, 180);
  const bgEnd   = polarToCartesian(cx, cy, r, 0);
  const bgPath  = `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 0 1 ${bgEnd.x} ${bgEnd.y}`;

  // Filled arc — from 180° to (180 - probability*1.8)°
  const fillDeg   = 180 - (probability / 100) * 180;
  const fillEnd   = polarToCartesian(cx, cy, r, fillDeg);
  const largeArc  = probability > 50 ? 1 : 0;
  const fillPath  = `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${largeArc} 1 ${fillEnd.x} ${fillEnd.y}`;

  // Color by tier
  let color = '#16A34A';      // safe
  if (probability < 40) color = '#DC2626';        // ambitious
  else if (probability < 75) color = '#D97706';   // moderate

  const label = probability >= 75 ? 'HIGH' : probability >= 40 ? 'MED' : 'LOW';

  return (
    <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.72}`}>
      {/* Background track */}
      <path d={bgPath} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} strokeLinecap="round" />
      
      {/* Filled arc */}
      <path d={fillPath} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}60)`, transition: 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}
      />
      
      {/* Tick marks at 0%, 50%, 100% */}
      {[0, 50, 100].map(t => {
        const deg = 180 - t * 1.8;
        const inner = polarToCartesian(cx, cy, r - 9, deg);
        const outer = polarToCartesian(cx, cy, r + 1, deg);
        return <line key={t} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />;
      })}
      
      {/* Center text */}
      <text x={cx} y={cy - 4} textAnchor="middle" fill={color}
        style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: size * 0.22 }}>
        {probability}%
      </text>
      <text x={cx} y={cy + size * 0.14} textAnchor="middle" fill="rgba(255,255,255,0.3)"
        style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: size * 0.12, letterSpacing: '0.08em' }}>
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
