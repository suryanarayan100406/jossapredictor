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
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] relative overflow-hidden select-none flex flex-col justify-between">
      {/* Premium Grid Background */}
      <div className="premium-grid" />
      
      {/* Shared Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 lg:px-8 max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full flex-grow">
        {/* Left Column: Text + CTA */}
        <div className="flex-1 text-left space-y-6 z-10">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--brand-dim)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-sm)', marginBottom: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 500, color: 'var(--brand)', letterSpacing: '0.08em' }}>JOSAA INTELLIGENCE TOOL</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] font-display">
            Know your exact<br />
            <span style={{ color: 'var(--brand)' }}>admission chances.</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
            Based on 12,274 historical cutoff records across 6 JoSAA rounds.
            Enter your rank to see Safe, Moderate, and Ambitious options for
            every IIT, NIT, IIIT, and GFTI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2 items-start sm:items-center">
            <Link href="/predict" className="btn-brand">
              Predict My Colleges <ArrowRight className="w-4 h-4" />
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
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-xl)',
            borderTop: '1px solid var(--brand)',
            padding: '20px',
            boxShadow: 'var(--shadow-elevated)',
            maxWidth: 380,
            width: '100%',
          }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--brand)', fontWeight: 500, letterSpacing: '0.1em' }}>RANK ANALYSIS</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>LIVE PREVIEW</span>
            </div>
            
            {/* Rank + Type row */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, background: 'var(--bg-overlay)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', border: '1px solid var(--border-default)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.06em' }}>CRL RANK</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPreview.rank}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--data-highlight)' }}
                  >
                    {currentPreview.rank}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div style={{ flex: 1, background: 'var(--bg-overlay)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', border: '1px solid var(--border-default)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.06em' }}>EXAM</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPreview.type}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--brand)' }}
                    className="mt-1"
                  >
                    JEE {currentPreview.type}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            {/* Institute block */}
            <div style={{ background: 'var(--bg-overlay)', borderRadius: 'var(--radius-md)', padding: '14px', border: '1px solid var(--border-default)', marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>PREDICTED MATCH</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPreview.chance}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChanceBadge chance={currentPreview.chance} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div style={{ minHeight: '66px' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPreview.college}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 2, lineHeight: 1.3 }}>
                      {currentPreview.college}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProbabilityMeter probability={currentPreview.probability} size={90} />
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>CLOSING RANK</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPreview.closing}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}
                >
                  {currentPreview.closing}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', padding: '14px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {[
            { value: '12,274+', label: 'Cutoff Records' },
            { value: '120+', label: 'Institutes' },
            { value: '6', label: 'JoSAA Rounds' },
            { value: '2024–2025', label: 'Data Coverage' },
            { value: 'IITs · NITs · IIITs · GFTIs', label: 'Institute Types' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--data-highlight)' }}>{stat.value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.06em', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Built for serious aspirants.
          </h2>
          <p className="text-[var(--text-secondary)] text-base max-w-lg mx-auto">
            Equipped with deep comparative metrics, period-over-period trends, and smart algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              icon: <Shield className="w-5 h-5 text-white" />, 
              title: 'Chance Prediction', 
              desc: 'Safe, Moderate, or Ambitious — ranked by your exact cutoff proximity.' 
            },
            { 
              icon: <BarChart3 className="w-5 h-5 text-white" />, 
              title: 'Cutoff Trends', 
              desc: "Track how each branch's cutoff moved from 2024 to 2025." 
            },
            { 
              icon: <Target className="w-5 h-5 text-white" />, 
              title: 'Compare Colleges', 
              desc: 'Put up to 4 programs side-by-side on every metric that matters.' 
            },
            { 
              icon: <Zap className="w-5 h-5 text-white" />, 
              title: 'Smart Alternatives', 
              desc: 'Discover similar programs within your striking range.' 
            },
            { 
              icon: <Search className="w-5 h-5 text-white" />, 
              title: 'Deep Filters', 
              desc: 'Filter by institute type, branch, state, category, quota, and rank window.' 
            },
            { 
              icon: <GraduationCap className="w-5 h-5 text-white" />, 
              title: 'Complete Data', 
              desc: 'Every IIT, NIT, IIIT, and GFTI with 2024 and 2025 Round 6 data.' 
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 hover:border-[var(--border-strong)] transition-all duration-300 group"
            >
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--brand-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2 font-display">{feature.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 48px',
        }} className="flex flex-col md:flex-row items-center gap-12 justify-between">
          
          {/* Left Column: Heading + button */}
          <div className="space-y-6 max-w-md">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Your list is 60 seconds away.
            </h2>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Stop guessing. Get your customized college list based on verified historical cutoff trends and your specific categories.
            </p>
            <Link href="/predict" className="btn-brand">
              Predict My Colleges <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Column: Fake Result Card rows */}
          <div className="w-full max-w-sm space-y-3">
            {[
              { college: 'IIT Bombay', branch: 'Computer Science', chance: 'ambitious', label: 'Ambitious' },
              { college: 'IIT Madras', branch: 'Electrical Engineering', chance: 'moderate', label: 'Moderate' },
              { college: 'NIT Trichy', branch: 'Computer Science', chance: 'safe', label: 'Safe' },
            ].map((row, i) => (
              <div key={i} style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'between',
                gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{row.college}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{row.branch}</div>
                </div>
                <ChanceBadge chance={row.chance} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', padding: '32px 24px' }} className="w-full">
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>
              Rank<span style={{ color: 'var(--brand)' }}>Scope</span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>v2026</span>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', maxWidth: 420, textAlign: 'center', lineHeight: 1.6 }}>
            Predictions are computed from 2024–2025 JoSAA historical cutoff data and do not guarantee actual seat allotment.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Predict', 'Trends', 'Compare'].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }} className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
