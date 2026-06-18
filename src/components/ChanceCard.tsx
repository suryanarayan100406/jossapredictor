'use client';
import React from 'react';
import { MapPin, TrendingUp, Plus, Check } from 'lucide-react';
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

const chanceBorder: Record<string, string> = {
  safe: 'chance-card-safe',
  moderate: 'chance-card-moderate',
  ambitious: 'chance-card-ambitious',
  longshot: 'chance-card-longshot',
};

export function ChanceCard({ result, isCompared, onCompareToggle }: ChanceCardProps) {
  const trendParams = new URLSearchParams({
    instituteName: result.instituteName,
    branch: result.branch,
    category: result.category,
    gender: result.gender,
    quota: result.quota,
  });

  return (
    <div className={`console-card hover-lift ${chanceBorder[result.chance] ?? ''}`}>
      <div className="p-5 flex flex-col sm:flex-row gap-5">
        {/* Left: info */}
        <div className="flex-grow min-w-0">
          <div className="flex flex-wrap gap-1.5 items-center mb-2.5">
            <span className="text-[11px] font-bold text-brand bg-brand-dim rounded-full px-2.5 py-0.5">
              {result.instituteType}
            </span>
            <span className="text-[11px] font-semibold text-text-secondary bg-bg-base border border-border-default rounded-full px-2.5 py-0.5">
              {result.quota}
            </span>
            <ChanceBadge chance={result.chance} />
          </div>

          <h3 className="font-display font-bold text-[0.95rem] sm:text-base text-text-primary mb-1 leading-snug">
            {result.instituteName}
          </h3>

          <p className="text-sm text-text-secondary mb-3 leading-relaxed">{result.branch}</p>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-text-muted">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {result.instituteCity ? `${result.instituteCity}, ` : ''}
                {result.instituteState}
              </span>
            </div>
            <Link
              href={`/trends?${trendParams.toString()}`}
              className="flex items-center gap-1 text-brand hover:text-brand-hover font-semibold transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>See trend</span>
            </Link>
          </div>
        </div>

        {/* Right: gauge + ranks */}
        <div className="flex flex-row sm:flex-col sm:items-end justify-between shrink-0 w-full sm:w-[140px] border-t sm:border-t-0 border-border-default pt-4 sm:pt-0 mt-1 sm:mt-0 gap-4">
          <div className="shrink-0 flex items-center justify-center">
            <ProbabilityMeter probability={result.probability} size={76} />
          </div>

          <div className="flex flex-col sm:items-end gap-3 flex-1 sm:w-auto">
            <div className="flex gap-4 sm:justify-end">
              <div className="text-left sm:text-right">
                <div className="text-[10px] text-text-muted font-semibold uppercase tracking-wide">Opens</div>
                <div className="text-sm font-bold text-text-secondary">{formatRank(result.openingRank)}</div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-[10px] text-text-muted font-semibold uppercase tracking-wide">Closes</div>
                <div className="text-sm font-bold text-text-primary">{formatRank(result.closingRank)}</div>
              </div>
            </div>

            <button
              onClick={onCompareToggle}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                isCompared
                  ? 'bg-brand-dim text-brand border-brand'
                  : 'bg-bg-elevated text-text-secondary border-border-default hover:border-border-strong hover:text-brand'
              }`}
            >
              {isCompared ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {isCompared ? 'Added' : 'Compare'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
