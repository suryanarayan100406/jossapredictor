import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format rank with Indian number system */
export function formatRank(rank: number): string {
  return rank.toLocaleString('en-IN');
}

/** Get text color class for chance level */
export function getChanceColor(chance: string): string {
  switch (chance) {
    case 'safe': return 'text-emerald-400';
    case 'moderate': return 'text-amber-400';
    case 'ambitious': return 'text-red-400';
    case 'longshot': return 'text-gray-400';
    default: return 'text-gray-400';
  }
}

/** Get background color class for chance badge */
export function getChanceBgColor(chance: string): string {
  switch (chance) {
    case 'safe': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    case 'moderate': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    case 'ambitious': return 'bg-red-500/10 border-red-500/20 text-red-400';
    case 'longshot': return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    default: return 'bg-gray-500/10 text-gray-400';
  }
}

/** Get display label for chance level */
export function getChanceLabel(chance: string): string {
  switch (chance) {
    case 'safe': return '✅ Safe';
    case 'moderate': return '⚡ Moderate';
    case 'ambitious': return '🔥 Ambitious';
    case 'longshot': return '🎯 Long Shot';
    default: return chance;
  }
}

/** Get emoji for chance level */
export function getChanceEmoji(chance: string): string {
  switch (chance) {
    case 'safe': return '✅';
    case 'moderate': return '⚡';
    case 'ambitious': return '🔥';
    case 'longshot': return '🎯';
    default: return '❓';
  }
}

/** Calculate admission probability (0-99) based on rank vs closing rank */
export function calculateProbability(rank: number, closingRank: number): number {
  if (closingRank === 0) return 0;
  const ratio = rank / closingRank;
  if (ratio <= 0.7) return 99;
  if (ratio >= 1.3) return 5;
  return Math.round(Math.max(5, Math.min(99, 100 * (1 - (ratio - 0.7) / 0.6))));
}

/** Get badge class for institute type */
export function getTypeBadgeClass(type: string): string {
  switch (type) {
    case 'IIT': return 'bg-blue-500/15 text-blue-400 border-blue-500/25';
    case 'NIT': return 'bg-purple-500/15 text-purple-400 border-purple-500/25';
    case 'IIIT': return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25';
    case 'GFTI': return 'bg-orange-500/15 text-orange-400 border-orange-500/25';
    default: return 'bg-gray-500/15 text-gray-400 border-gray-500/25';
  }
}

/** Debounce function */
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/** Truncate text with ellipsis */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
