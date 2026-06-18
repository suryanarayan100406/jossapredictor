'use client';
import React from 'react';
import { MapPin, TrendingUp } from 'lucide-react';
import { PredictionResult } from '@/types';
import { ChanceBadge } from './ChanceBadge';
import { ProbabilityMeter } from './ProbabilityMeter';
import { formatRank } from '@/lib/utils';
import Link from 'next/link';

interface ChanceCardProps {
  result: PredictionResult;
  isCompared: boolean;
  onCompareToggle: () => void;
}

export function ChanceCard({ result, isCompared, onCompareToggle }: ChanceCardProps) {
  // Generate a trend slug for the specific combination
  const trendParams = new URLSearchParams({
    instituteName: result.instituteName,
    branch: result.branch,
    category: result.category,
    gender: result.gender,
    quota: result.quota,
  });

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] hover:border-[var(--border-strong)] transition-colors cursor-default">
      
      {/* Left: All text info */}
      <div className="flex-1 min-w-0">
        
        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 items-center mb-2.5">
          <span className="font-mono text-[10px] font-semibold text-[var(--text-secondary)] bg-white/5 border border-[var(--border-default)] rounded px-1.5 py-0.5 tracking-wider">
            {result.instituteType}
          </span>
          <span className="font-mono text-[10px] font-semibold text-[var(--text-secondary)] bg-white/5 border border-[var(--border-default)] rounded px-1.5 py-0.5 tracking-wider">
            {result.quota}
          </span>
          <ChanceBadge chance={result.chance} />
        </div>
        
        {/* Institute name */}
        <h3 className="font-display font-medium text-[0.9rem] sm:text-base text-white mb-1.5 leading-snug">
          {result.instituteName}
        </h3>
        
        {/* Branch */}
        <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
          {result.branch}
        </p>
        
        {/* Location + Trend link */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1 text-[var(--text-muted)]">
            <MapPin className="w-3.5 h-3.5" />
            <span>{result.instituteCity ? `${result.instituteCity}, ` : ''}{result.instituteState}</span>
          </div>
          <Link href={`/trends?${trendParams.toString()}`} className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-white font-mono text-[10px] uppercase tracking-wider transition-colors">
            <TrendingUp className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>Trend</span>
          </Link>
        </div>
      </div>
      
      {/* Right: Probability arc + rank data */}
      <div className="flex flex-row sm:flex-col sm:items-end justify-between shrink-0 w-full sm:w-[130px] border-t sm:border-t-0 border-[var(--border-default)] pt-4 sm:pt-0 mt-4 sm:mt-0 gap-4">
        
        {/* Arc gauge */}
        <div className="shrink-0 flex items-center justify-center">
          <ProbabilityMeter probability={result.probability} size={68} />
        </div>
        
        <div className="flex flex-col sm:items-end gap-3 flex-1 sm:w-auto">
          {/* Opening / Closing ranks */}
          <div className="flex gap-4 sm:justify-end">
            <div className="text-left sm:text-right">
              <div className="font-mono text-[9px] text-[var(--text-muted)] tracking-wider">OPEN</div>
              <div className="font-mono text-xs font-medium text-[var(--text-secondary)]">{formatRank(result.openingRank)}</div>
            </div>
            <div className="text-left sm:text-right">
              <div className="font-mono text-[9px] text-[var(--text-muted)] tracking-wider">CLOSE</div>
              <div className="font-mono text-xs font-semibold text-white">{formatRank(result.closingRank)}</div>
            </div>
          </div>
          
          {/* Compare toggle */}
          <button
            onClick={onCompareToggle}
            className={`w-full sm:w-auto px-2.5 py-1 text-[10px] font-mono font-medium border border-[var(--border-default)] rounded hover:border-[var(--border-strong)] hover:text-white transition-all cursor-pointer ${
              isCompared ? 'bg-white/5 text-white' : 'bg-transparent text-[var(--text-secondary)]'
            }`}
          >
            {isCompared ? '✓ Added' : '+ Compare'}
          </button>
        </div>
      </div>
    </div>
  );
}
