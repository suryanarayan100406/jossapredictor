'use client';
import React from 'react';

interface ProbabilityMeterProps {
  probability: number;
  size?: number;
}

export function ProbabilityMeter({ probability, size = 80 }: ProbabilityMeterProps) {
  // SVG arc parameters
  const strokeWidth = 3;
  const cx = size / 2;
  const cy = size * 0.7;        // arc is in the bottom 70% of the SVG
  const r = size * 0.44;

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
  let color = '#10b981';      // safe (emerald-500)
  if (probability < 40) color = '#ef4444';        // ambitious (red-500)
  else if (probability < 75) color = '#f59e0b';   // moderate (amber-500)

  const label = probability >= 75 ? 'HIGH' : probability >= 40 ? 'MED' : 'LOW';

  return (
    <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.72}`}>
      {/* Background track */}
      <path d={bgPath} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} strokeLinecap="round" />
      
      {/* Filled arc */}
      <path d={fillPath} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        style={{ transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
      
      {/* Tick marks at 0%, 50%, 100% */}
      {[0, 50, 100].map(t => {
        const deg = 180 - t * 1.8;
        const inner = polarToCartesian(cx, cy, r - 5, deg);
        const outer = polarToCartesian(cx, cy, r + 2, deg);
        return <line key={t} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />;
      })}
      
      {/* Center text */}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text-primary)"
        style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: size * 0.20 }}>
        {probability}%
      </text>
      <text x={cx} y={cy + size * 0.12} textAnchor="middle" fill="var(--text-secondary)"
        style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: size * 0.11, letterSpacing: '0.04em' }}>
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
