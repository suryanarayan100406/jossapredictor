import React from 'react';

interface ProbabilityMeterProps {
  probability: number;
  size?: number;
  strokeWidth?: number;
}

export function ProbabilityMeter({ probability, size = 48, strokeWidth = 4 }: ProbabilityMeterProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (probability / 100) * circumference;

  let color = 'stroke-emerald-500';
  let textColor = 'text-emerald-400';
  if (probability < 40) {
    color = 'stroke-red-500';
    textColor = 'text-red-400';
  } else if (probability < 75) {
    color = 'stroke-amber-500';
    textColor = 'text-amber-400';
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="stroke-white/5"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${color} transition-all duration-500 ease-out`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className={`absolute text-[11px] font-bold ${textColor}`}>{probability}%</span>
    </div>
  );
}
