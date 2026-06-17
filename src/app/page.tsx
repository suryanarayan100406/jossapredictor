'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, Target, Shield, BarChart3, Zap, Search, GraduationCap, MapPin, TrendingUp
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ChanceBadge } from '@/components/ChanceBadge';
import { ProbabilityMeter } from '@/components/ProbabilityMeter';

// Mock cycling preview states for the hero section
const PREVIEW_STATES = [
  {
    rank: '11,850',
    type: 'Main',
    category: 'OPEN',
    college: 'National Institute of Technology Tiruchirappalli',
    branch: 'Mechanical Engineering (4 Years, B.Tech)',
    closing: '12,940',
    chance: 'safe',
    probability: 91,
  },
  {
    rank: '4,120',
    type: 'Advanced',
    category: 'OPEN',
    college: 'Indian Institute of Technology Bombay',
    branch: 'Aerospace Engineering (4 Years, B.Tech)',
    closing: '4,380',
    chance: 'moderate',
    probability: 78,
  },
  {
    rank: '8,400',
    type: 'Advanced',
    category: 'OBC-NCL',
    college: 'Indian Institute of Technology Kanpur',
    branch: 'Computer Science and Engineering (4 Years, B.Tech)',
    closing: '7,950',
    chance: 'ambitious',
    probability: 45,
  },
];

export default function HomePage() {
  const [previewIdx, setPreviewIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPreviewIdx((prev) => (prev + 1) % PREVIEW_STATES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const currentPreview = PREVIEW_STATES[previewIdx];

  return (
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] relative flex flex-col justify-between">
      {/* Premium Grid Background */}
      <div className="premium-grid" />
      
      {/* Shared Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full flex-grow z-10">
        {/* Left Column: Text + CTA */}
        <div className="flex-1 text-left space-y-6 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.03] border border-border-default rounded-xs">
            <span className="w-1.25 h-1.25 rounded-full bg-text-secondary inline-block" />
            <span className="font-mono text-[0.65rem] font-medium text-text-secondary tracking-widest">JOSAA INTELLIGENCE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium font-display text-white leading-[1.1]">
            Know your exact<br />
            <span className="text-text-secondary">admission chances.</span>
          </h1>

          <p className="text-sm text-[var(--text-secondary)] max-w-lg leading-relaxed">
            Parsed from 12,274 historical cutoff records across 6 rounds. Evaluate your chances for IITs, NITs, IIITs, and GFTIs with zero friction.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 items-center">
            <Link href="/predict" className="btn-brand">
              Predict My Colleges <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/trends" className="btn-ghost">
              View Cutoff Trends
            </Link>
          </div>
        </div>

        {/* Right Column: Terminal Visualization Card */}
        <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center items-center z-10 relative">
          <div className="bg-bg-elevated border border-border-default rounded-md p-5 shadow-card max-w-[380px] w-full">
            {/* Header row */}
            <div className="flex justify-between items-center mb-5 pb-3.5 border-b border-border-default">
              <span className="font-mono text-[10px] text-text-secondary font-medium tracking-widest">SYSTEM_READOUT</span>
              <span className="font-mono text-[10px] text-text-muted tracking-wider">LIVE PREVIEW</span>
            </div>
            
            {/* Rank + Type row */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 bg-bg-base rounded-xs p-2.5 border border-border-default">
                <div className="font-mono text-[9px] text-text-muted mb-1 tracking-wider">CRL RANK</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPreview.rank}
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 2 }}
                    transition={{ duration: 0.15 }}
                    className="font-mono text-xl font-medium text-text-primary"
                  >
                    {currentPreview.rank}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex-1 bg-bg-base rounded-xs p-2.5 border border-border-default">
                <div className="font-mono text-[9px] text-text-muted mb-1 tracking-wider">EXAM</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPreview.type}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="font-mono text-[13px] font-medium text-text-primary mt-1"
                  >
                    JEE {currentPreview.type}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            {/* Institute block */}
            <div className="bg-bg-base rounded-xs p-3.5 border border-border-default mb-3.5">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[9px] text-text-muted tracking-wider">MATCH</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPreview.chance}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ChanceBadge chance={currentPreview.chance} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="min-h-[60px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPreview.college}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="font-medium text-[13px] text-text-primary mb-0.5 leading-snug">
                      {currentPreview.college}
                    </div>
                    <div className="text-[11px] text-text-secondary">
                      {currentPreview.branch}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            {/* Arc probability gauge */}
            <div className="flex justify-center my-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPreview.probability}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProbabilityMeter probability={currentPreview.probability} size={80} />
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Footer */}
            <div className="flex justify-between mt-3.5 pt-3 border-t border-border-default">
              <span className="font-mono text-[9px] text-text-muted">CLOSING_THRESHOLD</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPreview.closing}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="font-mono text-xs font-medium text-text-primary"
                >
                  {currentPreview.closing}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="z-10 relative border-t border-b border-border-default bg-bg-surface py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between gap-6 flex-wrap">
          {[
            { value: '12,274+', label: 'Cutoff Records' },
            { value: '120+', label: 'Institutes' },
            { value: '6', label: 'JoSAA Rounds' },
            { value: '2024–2025', label: 'Data Coverage' },
            { value: 'IITs · NITs · IIITs · GFTIs', label: 'Institute Types' },
          ].map((stat, i) => (
            <div key={i} className="text-left">
              <div className="font-display font-medium text-sm sm:text-base text-text-primary">{stat.value}</div>
              <div className="font-mono text-[10px] text-text-muted tracking-wider mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-left mb-16 space-y-2">
          <h2 className="text-3xl font-display text-white font-medium">
            Built for serious aspirants.
          </h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md">
            Equipped with deep comparative metrics, period-over-period trends, and smart algorithms.
          </p>
        </div>

        {/* Minimal Grid Board layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-hidden border border-[var(--border-default)]">
          {[
            { 
              icon: <Shield className="w-4 h-4 text-white" />, 
              title: 'Chance Prediction', 
              desc: 'Safe, Moderate, or Ambitious — ranked by your exact cutoff proximity.' 
            },
            { 
              icon: <BarChart3 className="w-4 h-4 text-white" />, 
              title: 'Cutoff Trends', 
              desc: "Track how each branch's cutoff moved from 2024 to 2025." 
            },
            { 
              icon: <Target className="w-4 h-4 text-white" />, 
              title: 'Compare Colleges', 
              desc: 'Put up to 4 programs side-by-side on every metric that matters.' 
            },
            { 
              icon: <Zap className="w-4 h-4 text-white" />, 
              title: 'Smart Alternatives', 
              desc: 'Discover similar programs within your striking range.' 
            },
            { 
              icon: <Search className="w-4 h-4 text-white" />, 
              title: 'Deep Filters', 
              desc: 'Filter by institute type, branch, state, category, quota, and rank window.' 
            },
            { 
              icon: <GraduationCap className="w-4 h-4 text-white" />, 
              title: 'Complete Data', 
              desc: 'Every IIT, NIT, IIIT, and GFTI with 2024 and 2025 Round 6 data.' 
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-[var(--bg-surface)] hover:bg-[rgba(255,255,255,0.01)] transition-colors border border-[var(--border-default)] -ml-[1px] -mt-[1px]"
            >
              <div className="w-8 h-8 rounded-xs bg-white/[0.03] border border-border-default flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-white mb-2 font-display">{feature.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 justify-between bg-bg-elevated border border-border-default rounded-md px-10 py-9">
          
          {/* Left Column: Heading + button */}
          <div className="space-y-4 max-w-md">
            <h2 className="text-2xl font-display text-white font-medium">
              Your list is 60 seconds away.
            </h2>
            <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
              Stop guessing. Get your customized college list based on verified historical cutoff trends and your specific categories.
            </p>
            <div className="pt-2">
              <Link href="/predict" className="btn-brand">
                Predict My Colleges <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Flat Result Card rows */}
          <div className="w-full max-w-sm space-y-2">
            {[
              { college: 'IIT Bombay', branch: 'Computer Science', chance: 'ambitious' },
              { college: 'IIT Madras', branch: 'Electrical Engineering', chance: 'moderate' },
              { college: 'NIT Trichy', branch: 'Computer Science', chance: 'safe' },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between gap-3 bg-bg-base border border-border-default rounded-xs px-3.5 py-2.5">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-text-primary">{row.college}</div>
                  <div className="text-[11px] text-text-secondary">{row.branch}</div>
                </div>
                <ChanceBadge chance={row.chance} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full z-10 border-t border-border-default bg-bg-surface py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-[0.85rem]">
              RankScope
            </span>
            <span className="font-mono text-[10px] text-text-muted">v2026</span>
          </div>
          <p className="font-mono text-[10px] text-text-muted max-w-[420px] text-center leading-relaxed">
            Predictions are computed from 2024–2025 JoSAA historical cutoff data and do not guarantee actual seat allotment.
          </p>
          <div className="flex gap-4">
            {['Predict', 'Trends', 'Compare'].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} className="font-mono text-[11px] text-text-muted hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
