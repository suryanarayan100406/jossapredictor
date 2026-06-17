'use client';

import React from 'react';
import { Compass, GitCompare, Info, Award, Lightbulb } from 'lucide-react';
import { AlgorithmicAdvisorGuidance } from '@/types';

interface AIGuidancePanelProps {
  guidance: AlgorithmicAdvisorGuidance;
}

export function AIGuidancePanel({ guidance }: AIGuidancePanelProps) {
  const { overview, branchVsCollege, highlights, tips } = guidance;

  return (
    <div className="surface border border-[var(--border-default)] p-6 space-y-6 bg-[rgba(255,255,255,0.01)] backdrop-blur-md relative overflow-hidden">
      {/* Visual background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand)] rounded-full filter blur-[80px] opacity-[0.05] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-[var(--border-default)]">
        <Compass className="w-5 h-5 text-[var(--brand)]" />
        <div>
          <h3 className="text-sm font-bold text-white font-display">RankScope Counselling Advisor</h3>
          <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">Algorithmic Seat Guidance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Overview & Branch vs College */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-white font-mono uppercase tracking-widest flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[var(--brand)]" />
              Counselling Overview
            </span>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans" dangerouslySetInnerHTML={{
              __html: overview.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
            }} />
          </div>

          <div className="p-4 rounded border border-[var(--border-default)] bg-[rgba(255,255,255,0.02)] space-y-2">
            <span className="text-[10px] font-bold text-white font-mono uppercase tracking-widest flex items-center gap-1">
              <GitCompare className="w-3.5 h-3.5 text-yellow-400" />
              Branch vs College Trade-off
            </span>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed" dangerouslySetInnerHTML={{
              __html: branchVsCollege.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
            }} />
          </div>
        </div>

        {/* Right column: Highlights & Actionable Tips */}
        <div className="space-y-4">
          {/* Highlights */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-white font-mono uppercase tracking-widest flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-green-400" />
              Key Match Highlights
            </span>
            <ul className="space-y-1.5 pl-1">
              {highlights.map((h, i) => (
                <li
                  key={i}
                  className="text-xs text-[var(--text-secondary)] flex items-start gap-2 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] mt-1.5 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{
                    __html: h.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                  }} />
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Tips */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold text-white font-mono uppercase tracking-widest flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-orange-400" />
              Counselling Tips
            </span>
            <ul className="space-y-2 pl-1">
              {tips.map((tip, i) => (
                <li
                  key={i}
                  className="text-xs text-[var(--text-secondary)] flex items-start gap-2 leading-relaxed"
                >
                  <span className="font-mono text-[10px] font-bold text-brand bg-brand-dim border border-white/20 w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span dangerouslySetInnerHTML={{
                    __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                  }} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
