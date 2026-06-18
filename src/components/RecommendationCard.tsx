'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Award, Briefcase, Star, Plus, Check } from 'lucide-react';
import { RecommendationResult } from '@/types';

interface RecommendationCardProps {
  recommendation: RecommendationResult;
  index: number;
  onCompareToggle: (record: any) => void;
  isCompared: boolean;
}

const chanceMeta: Record<string, { cls: string; label: string }> = {
  safe: { cls: 'bg-safe-bg text-safe-text border-safe-border', label: 'Safe bet' },
  moderate: { cls: 'bg-moderate-bg text-moderate-text border-moderate-border', label: 'Worth a go' },
  ambitious: { cls: 'bg-ambitious-bg text-ambitious-text border-ambitious-border', label: 'A stretch' },
  longshot: { cls: 'bg-bg-base text-text-muted border-border-default', label: 'Long shot' },
};

const rankRibbons = [
  { cls: 'bg-[rgba(245,158,11,0.16)] text-amber-300', label: '🥇 Top pick for you' },
  { cls: 'bg-white/10 text-slate-300', label: '🥈 Highly recommended' },
  { cls: 'bg-[rgba(234,88,12,0.16)] text-orange-300', label: '🥉 Strong match' },
];

export function RecommendationCard({
  recommendation,
  index,
  onCompareToggle,
  isCompared,
}: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { score, scoreBreakdown, profile, chance, probability, closingRank } = recommendation;

  const avgPkg = profile?.avgPackage ? `${profile.avgPackage.toFixed(1)} LPA` : 'N/A';
  const highestPkg = profile?.highestPackage ? `${profile.highestPackage.toFixed(1)} LPA` : 'N/A';
  const placementRate = profile?.placementRate ? `${profile.placementRate.toFixed(1)}%` : 'N/A';

  const cm = chanceMeta[chance] || chanceMeta.moderate;
  const ribbon = rankRibbons[index] || { cls: 'bg-brand-dim text-brand', label: `#${index + 1} recommendation` };

  const bars = [
    { label: '🎟️ Admission chance', value: scoreBreakdown.admission, max: 30, color: 'bg-safe' },
    { label: '⚙️ Fits your preferences', value: scoreBreakdown.preference, max: 50, color: 'bg-brand' },
    { label: '🏛️ College prestige', value: scoreBreakdown.prestige, max: 20, color: 'bg-accent-cyan' },
  ];

  const ratings = [
    { label: '💻 Coding culture', val: profile?.codingCulture ?? 5 },
    { label: '🚀 Startup scene', val: profile?.startupEcosystem ?? 5 },
    { label: '🔬 Research focus', val: profile?.researchFocus ?? 5 },
    { label: '🌴 Campus life', val: profile?.campusLife ?? 5 },
    { label: '🏠 Hostel quality', val: profile?.hostelQuality ?? 5 },
    { label: '⚽ Sports', val: profile?.sportsFacilities ?? 5 },
  ];

  return (
    <div className="console-card hover-lift">
      {/* Ribbon header */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-border-subtle bg-gradient-to-r from-[#fbfcff] to-[#f5f7fd]">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${ribbon.cls}`}>
          {ribbon.label}
        </span>
        <span className="text-xs font-bold text-text-secondary">
          Match score <span className="text-brand">{score}/100</span>
        </span>
      </div>

      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* College info */}
        <div className="flex items-start gap-4 flex-grow">
          {profile?.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt={recommendation.instituteName}
              className="w-14 h-14 rounded-2xl object-contain p-1.5 border border-border-default bg-bg-elevated flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-brand-dim text-brand font-extrabold text-xs flex items-center justify-center flex-shrink-0">
              {recommendation.instituteType}
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-dim text-brand">
                {recommendation.instituteType}
              </span>
              {profile?.nirfRank && (
                <span className="text-[11px] font-bold flex items-center gap-1 text-amber-600">
                  <Award className="w-3.5 h-3.5" />
                  NIRF #{profile.nirfRank}
                </span>
              )}
              <span className="text-[11px] text-text-secondary flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {recommendation.instituteCity ? `${recommendation.instituteCity}, ` : ''}
                {recommendation.instituteState}
              </span>
            </div>
            <h3 className="text-base font-bold font-display text-text-primary leading-tight">
              {recommendation.instituteName}
            </h3>
            <p className="text-sm text-text-secondary font-medium">{recommendation.branch}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-5 justify-between md:justify-end flex-wrap w-full md:w-auto border-t md:border-t-0 border-border-default pt-4 md:pt-0">
          {profile?.avgPackage && (
            <div className="text-right">
              <span className="text-[10px] text-text-muted uppercase tracking-wide block mb-0.5 font-semibold">Avg package</span>
              <span className="text-sm font-bold text-text-primary flex items-center gap-1 justify-end">
                <Briefcase className="w-3.5 h-3.5 text-brand" />
                {avgPkg}
              </span>
            </div>
          )}

          <div className="text-right">
            <span className="text-[10px] text-text-muted uppercase tracking-wide block mb-0.5 font-semibold">Cutoff</span>
            <span className="text-sm font-bold text-text-primary">{closingRank.toLocaleString('en-IN')}</span>
          </div>

          <div className={`px-3 py-1.5 rounded-2xl text-xs font-bold border text-center min-w-[88px] leading-tight ${cm.cls}`}>
            {cm.label}
            <span className="block text-[10px] opacity-80 mt-0.5">{Math.round(probability)}% match</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onCompareToggle(recommendation)}
              className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                isCompared
                  ? 'border-brand bg-brand-dim text-brand'
                  : 'border-border-default hover:border-border-strong text-text-secondary'
              }`}
              title="Compare college"
            >
              {isCompared ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2.5 rounded-full border border-border-default hover:border-border-strong text-text-secondary flex items-center justify-center cursor-pointer"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-6 pt-1 border-t border-border-default bg-bg-base space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            {/* Score breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wide text-text-primary">Why it&apos;s a match</h4>
              <div className="space-y-2.5">
                {bars.map((bar) => {
                  const barStyle = { width: `${(bar.value / bar.max) * 100}%` };
                  return (
                    <div key={bar.label} className="space-y-1">
                      <div className="flex justify-between text-[11px] text-text-secondary">
                        <span>{bar.label}</span>
                        <span className="text-text-primary font-bold">{bar.value}/{bar.max}</span>
                      </div>
                      <div className="w-full bg-border-default h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${bar.color}`} style={barStyle} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Placement */}
            <div className="space-y-3 border-t sm:border-t-0 sm:border-x border-border-default px-0 sm:px-6">
              <h4 className="text-xs font-bold uppercase tracking-wide text-text-primary">Placements</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl border border-border-default bg-bg-elevated">
                  <span className="text-[10px] text-text-muted block font-semibold">Average</span>
                  <span className="font-bold text-text-primary mt-0.5 block">{avgPkg}</span>
                </div>
                <div className="p-3 rounded-2xl border border-border-default bg-bg-elevated">
                  <span className="text-[10px] text-text-muted block font-semibold">Highest</span>
                  <span className="font-bold text-text-primary mt-0.5 block">{highestPkg}</span>
                </div>
                <div className="p-3 rounded-2xl border border-border-default bg-bg-elevated col-span-2">
                  <span className="text-[10px] text-text-muted block font-semibold">Placement rate</span>
                  <span className="font-bold text-text-primary mt-0.5 block">{placementRate}</span>
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wide text-text-primary">Campus vibe (1–10)</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] text-text-secondary">
                {ratings.map((rating) => (
                  <div key={rating.label} className="flex justify-between items-center">
                    <span>{rating.label}</span>
                    <span className="font-bold text-text-primary flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {rating.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {profile?.description && (
            <div className="pt-3 border-t border-border-default text-sm text-text-secondary leading-relaxed">
              <p className="line-clamp-2">{profile.description}</p>
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline mt-1.5 inline-block font-semibold text-xs"
                >
                  Visit official website →
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
