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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-secondary)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>JOSAA INTELLIGENCE</span>
          </div>

          <h1 style={{ fontWeight: 500, fontSize: '3rem' }} className="sm:text-4xl lg:text-5xl font-display text-white leading-[1.1]">
            Know your exact<br />
            <span style={{ color: 'var(--text-secondary)' }}>admission chances.</span>
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
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
            maxWidth: 380,
            width: '100%',
          }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border-default)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.08em' }}>SYSTEM_READOUT</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>LIVE PREVIEW</span>
            </div>
            
            {/* Rank + Type row */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, background: 'var(--bg-base)', borderRadius: 'var(--radius-xs)', padding: '10px 14px', border: '1px solid var(--border-default)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.04em' }}>CRL RANK</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPreview.rank}
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 2 }}
                    transition={{ duration: 0.15 }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-primary)' }}
                  >
                    {currentPreview.rank}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div style={{ flex: 1, background: 'var(--bg-base)', borderRadius: 'var(--radius-xs)', padding: '10px 14px', border: '1px solid var(--border-default)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.04em' }}>EXAM</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPreview.type}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)' }}
                    className="mt-1"
                  >
                    JEE {currentPreview.type}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            {/* Institute block */}
            <div style={{ background: 'var(--bg-base)', borderRadius: 'var(--radius-xs)', padding: '14px', border: '1px solid var(--border-default)', marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>MATCH</span>
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
              <div style={{ minHeight: '60px' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPreview.college}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div style={{ fontWeight: 500, fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: 2, lineHeight: 1.3 }}>
                      {currentPreview.college}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      {currentPreview.branch}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            {/* Arc probability gauge */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-default)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)' }}>CLOSING_THRESHOLD</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPreview.closing}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-primary)' }}
                >
                  {currentPreview.closing}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section style={{ borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface)', padding: '14px 0' }} className="z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between gap-6 flex-wrap">
          {[
            { value: '12,274+', label: 'Cutoff Records' },
            { value: '120+', label: 'Institutes' },
            { value: '6', label: 'JoSAA Rounds' },
            { value: '2024–2025', label: 'Data Coverage' },
            { value: 'IITs · NITs · IIITs · GFTIs', label: 'Institute Types' },
          ].map((stat, i) => (
            <div key={i} className="text-left">
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: 'var(--text-primary)' }}>{stat.value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.04em', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-left mb-16 space-y-2">
          <h2 style={{ fontWeight: 500 }} className="text-3xl font-display text-white">
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
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-xs)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-white mb-2 font-display">{feature.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '36px 40px',
        }} className="flex flex-col md:flex-row items-center gap-12 justify-between">
          
          {/* Left Column: Heading + button */}
          <div className="space-y-4 max-w-md">
            <h2 style={{ fontWeight: 500 }} className="text-2xl font-display text-white">
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
              <div key={i} style={{
                background: 'var(--bg-base)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xs)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)' }}>{row.college}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{row.branch}</div>
                </div>
                <ChanceBadge chance={row.chance} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface)', padding: '24px 0' }} className="w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem' }}>
              RankScope
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>v2026</span>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', maxWidth: 420, textAlign: 'center', lineHeight: 1.6 }}>
            Predictions are computed from 2024–2025 JoSAA historical cutoff data and do not guarantee actual seat allotment.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Predict', 'Trends', 'Compare'].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }} className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
