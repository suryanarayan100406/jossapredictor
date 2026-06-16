import React from 'react';
import { getChanceColor, getChanceBgColor, getChanceLabel } from '@/lib/utils';

interface ChanceBadgeProps {
  chance: 'safe' | 'moderate' | 'ambitious' | 'longshot';
}

export function ChanceBadge({ chance }: ChanceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getChanceBgColor(
        chance
      )} ${getChanceColor(chance)}`}
    >
      {getChanceLabel(chance)}
    </span>
  );
}
