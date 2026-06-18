'use client';

import React from 'react';
import { Compass, GitCompare, Info, Award, Lightbulb } from 'lucide-react';
import { AlgorithmicAdvisorGuidance } from '@/types';

interface AIGuidancePanelProps {
  guidance: AlgorithmicAdvisorGuidance;
}

const makeHtml = (s: string) => ({ __html: s });

export function AIGuidancePanel({ guidance }: AIGuidancePanelProps) {
  const { overview, branchVsCollege, highlights, tips } = guidance;

  return (
    <div className="console-card">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border-subtle bg-gradient-to-r from-brand-dim to-transparent">
        <span className="w-10 h-10 rounded-2xl bg-brand text-white flex items-center justify-center shadow-[0_8px_18px_-8px_var(--brand-glow)]">
          <Compass className="w-5 h-5 animate-spin-slow" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-text-primary font-display">Your counselling guide</h3>
          <p className="text-xs text-text-secondary">Friendly, personalised advice for your choices</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <Info className="w-4 h-4 text-brand" />
              The big picture
            </span>
            <p className="text-sm text-text-secondary leading-relaxed" dangerouslySetInnerHTML={makeHtml(overview)} />
          </div>

          <div className="p-4 rounded-2xl border border-border-default bg-bg-base space-y-2">
            <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <GitCompare className="w-4 h-4 text-amber-500" />
              Branch vs college
            </span>
            <p className="text-sm text-text-secondary leading-relaxed" dangerouslySetInnerHTML={makeHtml(branchVsCollege)} />
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <Award className="w-4 h-4 text-safe" />
              What stands out
            </span>
            <ul className="space-y-1.5 pl-1">
              {highlights.map((h, i) => (
                <li key={i} className="text-sm text-text-secondary flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={makeHtml(h)} />
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-orange-500" />
              Tips to remember
            </span>
            <ul className="space-y-2 pl-1">
              {tips.map((tip, i) => (
                <li key={i} className="text-sm text-text-secondary flex items-start gap-2 leading-relaxed">
                  <span className="text-[11px] font-bold text-brand bg-brand-dim w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span dangerouslySetInnerHTML={makeHtml(tip)} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
