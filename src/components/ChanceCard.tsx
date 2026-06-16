import React from 'react';
import { MapPin, ArrowUpRight, Plus, Check, TrendingUp } from 'lucide-react';
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
    <div className="relative group rounded-2xl border border-white/10 bg-gradient-to-br from-[#12121a]/80 to-[#1a1a25]/60 p-5 hover:border-indigo-500/30 hover:shadow-glow transition-all duration-300 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        {/* Left Side: Institute Info */}
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider bg-white/10 text-white uppercase">
              {result.instituteType}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider bg-indigo-500/10 text-indigo-400 uppercase">
              {result.quota} Quota
            </span>
            <ChanceBadge chance={result.chance} />
          </div>

          <div>
            <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-indigo-400 transition-colors">
              {result.instituteName}
            </h3>
            <p className="text-sm text-gray-300 font-medium mt-0.5">{result.branch}</p>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-500" />
              <span>
                {result.instituteCity ? `${result.instituteCity}, ` : ''}
                {result.instituteState}
              </span>
            </div>
            <Link
              href={`/trends?${trendParams.toString()}`}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>View Trend</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Probability & Ranks */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0 gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Admission Chance
              </div>
              <div className="text-xs text-gray-500 font-medium">Probability Estimate</div>
            </div>
            <ProbabilityMeter probability={result.probability} />
          </div>

          <div className="flex gap-6 text-right">
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Opening</div>
              <div className="text-sm font-bold text-gray-300">{formatRank(result.openingRank)}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Closing</div>
              <div className="text-sm font-bold text-white">{formatRank(result.closingRank)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Compare Button */}
      <div className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 sm:flex sm:justify-end sm:mt-4 border-t border-white/5 pt-3 w-full sm:w-auto">
        <button
          onClick={onCompareToggle}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isCompared
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          {isCompared ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Compare</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Compare</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
