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

export function RecommendationCard({
  recommendation,
  index,
  onCompareToggle,
  isCompared,
}: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { score, scoreBreakdown, profile, chance, probability, closingRank, openingRank } = recommendation;

  // Formatting values
  const avgPkg = profile?.avgPackage ? `${profile.avgPackage.toFixed(1)} LPA` : 'N/A';
  const highestPkg = profile?.highestPackage ? `${profile.highestPackage.toFixed(1)} LPA` : 'N/A';
  const placementRate = profile?.placementRate ? `${profile.placementRate.toFixed(1)}%` : 'N/A';

  // Badge styling for chances
  const chanceStyles = {
    safe: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.2)' },
    moderate: { bg: 'rgba(234, 179, 8, 0.1)', text: '#eab308', border: 'rgba(234, 179, 8, 0.2)' },
    ambitious: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' },
    longshot: { bg: 'rgba(156, 163, 175, 0.1)', text: '#9ca3af', border: 'rgba(156, 163, 175, 0.2)' },
  };

  const currentChanceStyle = chanceStyles[chance] || chanceStyles.moderate;

  // Custom rank indicators (Gold, Silver, Bronze for top 3)
  const rankColors = [
    { text: 'text-yellow-400', bg: 'rgba(250, 204, 21, 0.1)', border: 'border-yellow-400/30', label: '🥇 Top Pick' },
    { text: 'text-slate-300', bg: 'rgba(203, 213, 225, 0.1)', border: 'border-slate-300/30', label: '🥈 Highly Recommended' },
    { text: 'text-amber-600', bg: 'rgba(217, 119, 6, 0.1)', border: 'border-amber-600/30', label: '🥉 Strong Match' },
  ];

  const rankStyle = rankColors[index] || { text: 'text-[var(--text-secondary)]', bg: 'rgba(255,255,255,0.03)', border: 'border-[var(--border-default)]', label: `#${index + 1} Recommendation` };

  return (
    <div className="surface transition-all duration-300 hover:shadow-lg hover:shadow-brand/5 border border-[var(--border-default)] overflow-hidden">
      {/* Top Highlight strip */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-[var(--border-default)] bg-[rgba(255,255,255,0.01)] text-[10px] font-mono">
        <span className={`flex items-center gap-1 font-semibold ${rankStyle.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full bg-current mr-0.5`} />
          {rankStyle.label}
        </span>
        <span className="text-[var(--text-muted)]">Score: {score}/100</span>
      </div>

      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* College logo & Name details */}
        <div className="flex items-start gap-4 flex-grow">
          {profile?.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt={recommendation.instituteName}
              className="w-12 h-12 rounded object-contain p-1 border border-[var(--border-default)] bg-white flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = ''; // Fallback if image fails
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded bg-[var(--brand-dim)] text-[var(--brand)] font-bold text-xs flex items-center justify-center flex-shrink-0 border border-[var(--border-default)]">
              {recommendation.instituteType}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-[var(--border-default)] bg-[var(--bg-base)] text-white">
                {recommendation.instituteType}
              </span>
              {profile?.nirfRank && (
                <span className="text-[10px] font-semibold flex items-center gap-1 text-yellow-400 font-mono">
                  <Award className="w-3 h-3" />
                  NIRF #{profile.nirfRank}
                </span>
              )}
              <span className="text-[10px] text-[var(--text-secondary)] font-mono flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {recommendation.instituteCity ? `${recommendation.instituteCity}, ` : ''}{recommendation.instituteState}
              </span>
            </div>
            <h3 className="text-sm font-semibold font-display text-white mt-1 leading-tight">
              {recommendation.instituteName}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-medium">
              {recommendation.branch}
            </p>
          </div>
        </div>

        {/* Stats and Placement Info */}
        <div className="flex items-center gap-4 justify-between md:justify-end flex-wrap w-full md:w-auto border-t md:border-t-0 border-[var(--border-default)] pt-4 md:pt-0">
          {profile?.avgPackage && (
            <div className="text-right">
              <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider block">Avg Package</span>
              <span className="text-xs font-bold font-mono text-white flex items-center gap-1 justify-end">
                <Briefcase className="w-3 h-3 text-[var(--brand)]" />
                {avgPkg}
              </span>
            </div>
          )}

          <div className="text-right">
            <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider block">Cutoff (CR)</span>
            <span className="text-xs font-bold font-mono text-white">
              {closingRank}
            </span>
          </div>

          {/* Admission probability badge */}
          <div
            style={{
              backgroundColor: currentChanceStyle.bg,
              color: currentChanceStyle.text,
              border: `1px solid ${currentChanceStyle.border}`,
            }}
            className="px-2.5 py-1 rounded text-xs font-semibold capitalize font-mono text-center min-w-[75px]"
          >
            {chance}
            <span className="block text-[8px] opacity-75 font-mono">{Math.round(probability * 100)}% Match</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onCompareToggle(recommendation)}
              className={`p-1.5 rounded border transition-all ${
                isCompared
                  ? 'border-brand bg-brand-dim text-brand'
                  : 'border-border-default hover:border-border-strong text-text-secondary'
              }`}
              title="Compare College"
            >
              {isCompared ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded border border-[var(--border-default)] hover:border-[var(--border-strong)] text-[var(--text-secondary)] flex items-center justify-center"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded ratings and details section */}
      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-[var(--border-default)] bg-[rgba(255,255,255,0.01)] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-3">
            {/* Score Breakdown Gauge List */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-white font-mono">Compatibility breakdown</h4>
              <div className="space-y-2">
                {[
                  { label: '🎫 Admission probability', value: scoreBreakdown.admission, max: 30, color: 'bg-green-500' },
                  { label: '⚙️ Preference alignment', value: scoreBreakdown.preference, max: 50, color: 'bg-brand' },
                  { label: '🏛️ College Prestige', value: scoreBreakdown.prestige, max: 20, color: 'bg-blue-500' },
                ].map(bar => (
                  <div key={bar.label} className="space-y-1">
                    <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
                      <span>{bar.label}</span>
                      <span className="font-mono text-white font-semibold">{bar.value}/{bar.max}</span>
                    </div>
                    <div className="w-full bg-[var(--border-default)] h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${bar.color}`} style={{ width: `${(bar.value / bar.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Placement Info detail */}
            <div className="space-y-3 border-t sm:border-t-0 sm:border-x border-[var(--border-default)] px-0 sm:px-6">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-white font-mono">Placement Metrics</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded border border-[var(--border-default)] bg-[var(--bg-base)]">
                  <span className="text-[10px] text-[var(--text-muted)] font-mono block">Average Package</span>
                  <span className="font-bold text-white font-mono mt-0.5 block">{avgPkg}</span>
                </div>
                <div className="p-2.5 rounded border border-[var(--border-default)] bg-[var(--bg-base)]">
                  <span className="text-[10px] text-[var(--text-muted)] font-mono block">Highest Package</span>
                  <span className="font-bold text-white font-mono mt-0.5 block">{highestPkg}</span>
                </div>
                <div className="p-2.5 rounded border border-[var(--border-default)] bg-[var(--bg-base)] col-span-2">
                  <span className="text-[10px] text-[var(--text-muted)] font-mono block">Placement Rate</span>
                  <span className="font-bold text-white font-mono mt-0.5 block">{placementRate}</span>
                </div>
              </div>
            </div>

            {/* Campus Quality Ratings */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-white font-mono">Campus Ratings (1-10)</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-[var(--text-secondary)]">
                {[
                  { label: '💻 Coding Culture', val: profile?.codingCulture ?? 5 },
                  { label: '🚀 Startup Ecosystem', val: profile?.startupEcosystem ?? 5 },
                  { label: '🔬 Research Focus', val: profile?.researchFocus ?? 5 },
                  { label: '🌴 Campus Life', val: profile?.campusLife ?? 5 },
                  { label: '🏠 Hostel Quality', val: profile?.hostelQuality ?? 5 },
                  { label: '⚽ Sports Facilities', val: profile?.sportsFacilities ?? 5 },
                ].map(rating => (
                  <div key={rating.label} className="flex justify-between items-center">
                    <span>{rating.label}</span>
                    <span className="font-semibold text-white flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {rating.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description & Website */}
          {profile?.description && (
            <div className="pt-2 border-t border-[var(--border-default)] text-xs text-[var(--text-secondary)] leading-relaxed">
              <p className="line-clamp-2">{profile.description}</p>
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--brand)] hover:underline mt-1 inline-block font-mono text-[10px]"
                >
                  Visit Official Website →
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
