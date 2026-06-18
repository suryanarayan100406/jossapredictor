'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, ShieldCheck, BarChart3, Zap, Search, GraduationCap, Target, Sparkles, Heart,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ChanceBadge } from '@/components/ChanceBadge';
import { ProbabilityMeter } from '@/components/ProbabilityMeter';

const PREVIEW_STATES = [
  {
    rank: '11,850', type: 'Main', category: 'OPEN',
    college: 'NIT Tiruchirappalli',
    branch: 'Mechanical Engineering (B.Tech)',
    closing: '12,940', chance: 'safe', probability: 91,
  },
  {
    rank: '4,120', type: 'Advanced', category: 'OPEN',
    college: 'IIT Bombay',
    branch: 'Aerospace Engineering (B.Tech)',
    closing: '4,380', chance: 'moderate', probability: 78,
  },
  {
    rank: '8,400', type: 'Advanced', category: 'OBC-NCL',
    college: 'IIT Kanpur',
    branch: 'Computer Science & Engineering (B.Tech)',
    closing: '7,950', chance: 'ambitious', probability: 45,
  },
];

const swap = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

const FEATURES = [
  { icon: ShieldCheck, title: 'Honest chances', desc: 'See which colleges are safe bets, worth a go, or a stretch — in plain language.', tint: 'bg-safe-bg text-safe-text' },
  { icon: BarChart3, title: 'Cutoff trends', desc: 'Watch how branch cutoffs moved across recent years and rounds.', tint: 'bg-brand-dim text-brand' },
  { icon: Target, title: 'Compare colleges', desc: 'Line up to 4 programs side by side on the things that matter to you.', tint: 'bg-moderate-bg text-moderate-text' },
  { icon: Zap, title: 'Smart backups', desc: 'Discover similar colleges so you always have a plan B you love.', tint: 'bg-ambitious-bg text-ambitious-text' },
  { icon: Search, title: 'Friendly filters', desc: 'Narrow by branch, state, quota and rank without any clutter.', tint: 'bg-brand-dim text-brand' },
  { icon: GraduationCap, title: 'Real JoSAA data', desc: 'Built on round-wise cutoffs for IITs, NITs, IIITs and GFTIs.', tint: 'bg-safe-bg text-safe-text' },
];

export default function HomePage() {
  const router = useRouter();
  const [previewIdx, setPreviewIdx] = useState(0);

  const [quickRank, setQuickRank] = useState('');
  const [quickExam, setQuickExam] = useState<'main' | 'advanced'>('main');
  const [quickCategory, setQuickCategory] = useState('OPEN');
  const [quickGender, setQuickGender] = useState('Gender-Neutral');

  useEffect(() => {
    const interval = setInterval(() => {
      setPreviewIdx((prev) => (prev + 1) % PREVIEW_STATES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const currentPreview = PREVIEW_STATES[previewIdx];

  const handleQuickPredict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickRank || parseInt(quickRank) <= 0) return;

    const defaultPrefs = {
      placementWeight: 5,
      codingCultureWeight: 5,
      campusLifeWeight: 5,
      hostelWeight: 5,
      researchWeight: 5,
      startupWeight: 5,
      sportsWeight: 5,
      technicalClubsWeight: 5,
    };

    const wizardData = {
      rank: quickRank,
      rankType: quickExam,
      category: quickCategory,
      pwdStatus: false,
      gender: quickGender,
      homeState: '',
      branches: [],
      instituteTypes: [],
      year: 2025,
      preferences: defaultPrefs,
    };
    localStorage.setItem('rankscope_wizard_data', JSON.stringify(wizardData));

    const params = new URLSearchParams({
      rank: quickRank,
      rankType: quickExam,
      category: quickCategory,
      pwdStatus: 'false',
      gender: quickGender,
      homeState: '',
      year: '2025',
      preferences: JSON.stringify(defaultPrefs),
    });

    router.push(`/predict/results?${params.toString()}`);
  };

  const fieldClass =
    'bg-bg-base border border-border-default rounded-xl px-3 py-2.5 text-sm text-text-primary font-semibold focus:border-brand focus:ring-4 focus:ring-brand-dim focus:outline-none w-full transition-all';
  const labelClass = 'text-[11px] text-text-secondary font-bold';

  return (
    <main className="min-h-screen bg-bg-base text-text-primary relative flex flex-col overflow-x-hidden">
      <div className="premium-grid" />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-10 pb-14 sm:pt-14 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-y-12 gap-x-8 xl:gap-x-12 w-full z-10 items-center">
        <div className="ambient-glow top-[6%] left-[-6%] w-72 h-72" />

        {/* Left */}
        <div className="lg:col-span-7 min-w-0 text-left space-y-7 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-elevated border border-border-default rounded-full shadow-card">
            <span className="text-base" aria-hidden>🎓</span>
            <span className="text-xs font-bold text-text-secondary">Made for JEE 2026 aspirants</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-extrabold font-display text-text-primary leading-[1.08] tracking-tight text-balance break-words">
            Find colleges where{' '}
            <span className="aurora-text">you&apos;ll actually get in.</span>
          </h1>

          <p className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed">
            Pop in your rank and we&apos;ll show you honest, friendly predictions for IITs, NITs, IIITs and GFTIs — built from 65,000+ real JoSAA cutoffs.
          </p>

          {/* Quick predictor */}
          <form onSubmit={handleQuickPredict} className="surface-elevated glow-ring p-5 sm:p-6 space-y-4 max-w-xl">
            <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
              <Sparkles className="w-4 h-4 text-brand" /> Quick predictor
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Your rank</label>
                <input type="number" placeholder="e.g. 15000" required min="1" className={fieldClass} value={quickRank} onChange={(e) => setQuickRank(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Exam</label>
                <select className={`${fieldClass} cursor-pointer`} value={quickExam} onChange={(e) => setQuickExam(e.target.value as 'main' | 'advanced')}>
                  <option value="main">JEE Main</option>
                  <option value="advanced">JEE Advanced</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Category</label>
                <select className={`${fieldClass} cursor-pointer`} value={quickCategory} onChange={(e) => setQuickCategory(e.target.value)}>
                  <option value="OPEN">OPEN</option>
                  <option value="OBC-NCL">OBC-NCL</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Pool</label>
                <select className={`${fieldClass} cursor-pointer`} value={quickGender} onChange={(e) => setQuickGender(e.target.value)}>
                  <option value="Gender-Neutral">Gender-Neutral</option>
                  <option value="Female-only (including Supernumerary)">Female-only</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button type="submit" className="btn-brand w-full sm:w-auto">
                Show my colleges <ArrowRight className="w-4 h-4" />
              </button>
              <Link href="/trends" className="btn-ghost w-full sm:w-auto">Explore cutoff trends</Link>
            </div>
          </form>

          <p className="text-xs text-text-muted leading-relaxed max-w-xl">
            Predictions use historical cutoff movements, category trends and round-wise data. They&apos;re a friendly guide — not a guarantee.
          </p>
        </div>

        {/* Right: live preview card */}
        <div className="lg:col-span-5 min-w-0 w-full flex justify-center lg:justify-end items-center z-10 relative">
          <div className="surface-overlay max-w-[360px] w-full overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle bg-gradient-to-r from-brand-dim to-transparent">
              <span className="text-xs font-bold text-text-secondary">Live preview</span>
              <span className="text-xs font-bold text-brand flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block animate-pulse" /> Updating
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg-base rounded-2xl p-3 border border-border-default">
                  <div className="text-[10px] text-text-muted mb-1 font-bold uppercase tracking-wide">Rank</div>
                  <AnimatePresence mode="wait">
                    <motion.div key={currentPreview.rank} {...swap} className="text-xl font-extrabold text-text-primary font-display">
                      {currentPreview.rank}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="bg-bg-base rounded-2xl p-3 border border-border-default">
                  <div className="text-[10px] text-text-muted mb-1 font-bold uppercase tracking-wide">Exam</div>
                  <AnimatePresence mode="wait">
                    <motion.div key={currentPreview.type} {...swap} className="text-[15px] font-bold text-text-primary mt-1">
                      JEE {currentPreview.type}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="bg-bg-base rounded-2xl p-4 border border-border-default">
                <div className="flex justify-between items-start mb-2.5">
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wide">Your match</span>
                  <AnimatePresence mode="wait">
                    <motion.div key={currentPreview.chance} {...swap}>
                      <ChanceBadge chance={currentPreview.chance} />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="min-h-[60px]">
                  <AnimatePresence mode="wait">
                    <motion.div key={currentPreview.college} {...swap}>
                      <div className="font-bold text-[15px] text-text-primary mb-1 leading-snug font-display">{currentPreview.college}</div>
                      <div className="text-xs text-text-secondary leading-normal">{currentPreview.branch}</div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex justify-center my-1">
                <AnimatePresence mode="wait">
                  <motion.div key={currentPreview.probability} {...swap}>
                    <ProbabilityMeter probability={currentPreview.probability} size={92} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-between items-center pt-3.5 border-t border-border-subtle">
                <span className="text-[11px] text-text-muted font-semibold">Last year&apos;s closing rank</span>
                <AnimatePresence mode="wait">
                  <motion.span key={currentPreview.closing} {...swap} className="text-sm font-bold text-text-primary">
                    {currentPreview.closing}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="z-10 relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="surface-elevated px-6 py-7 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '65,086+', label: 'Cutoff records' },
            { value: '127+', label: 'Institutes' },
            { value: '6', label: 'JoSAA rounds' },
            { value: '2024–25', label: 'Data coverage' },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight">{stat.value}</div>
              <div className="text-xs text-text-secondary font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-display text-text-primary font-extrabold">Everything you need, nothing scary</h2>
          <p className="text-text-secondary text-base max-w-xl mx-auto">Clear answers, helpful comparisons and friendly guidance — so picking a college feels exciting, not stressful.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="surface-elevated hover-lift p-6 flex flex-col gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feature.tint}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-text-primary font-display">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-brand to-accent-cyan p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-8 items-center shadow-elevated">
          <div className="lg:col-span-7 min-w-0 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full">
              <Heart className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-bold text-white">Takes about a minute</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display text-white font-extrabold leading-tight">
              Your personalised college list is one step away.
            </h2>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-lg">
              Stop guessing. Answer a few friendly questions and get a tailored list based on your rank, category and what you care about most.
            </p>
            <div className="pt-2">
              <Link href="/predict" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-bg-elevated text-brand font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-transform">
                Start predicting <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 min-w-0 w-full space-y-3">
            {[
              { college: 'IIT Bombay', branch: 'Computer Science', chance: 'ambitious' },
              { college: 'IIT Madras', branch: 'Electrical Engineering', chance: 'moderate' },
              { college: 'NIT Trichy', branch: 'Computer Science', chance: 'safe' },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between gap-3 bg-bg-elevated rounded-2xl px-4 py-3 shadow-card">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-text-primary font-display">{row.college}</div>
                  <div className="text-xs text-text-secondary mt-0.5">{row.branch}</div>
                </div>
                <ChanceBadge chance={row.chance} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full z-10 border-t border-border-default bg-bg-elevated py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand to-accent-cyan flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-extrabold text-text-primary">Rank<span className="text-brand">Scope</span></span>
          </div>
          <p className="text-xs text-text-muted max-w-[420px] text-center leading-relaxed">
            Predictions are computed from 2024–25 JoSAA historical cutoff data and don&apos;t guarantee actual seat allotment.
          </p>
          <div className="flex gap-5">
            {['Predict', 'Trends', 'Compare'].map((l) => (
              <Link key={l} href={`/${l.toLowerCase()}`} className="text-sm font-semibold text-text-muted hover:text-brand transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
