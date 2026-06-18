'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [previewIdx, setPreviewIdx] = useState(0);

  // Quick Predictor Widget state variables
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

    // Save wizard data to localStorage to prefill the main wizard flow
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

    // Construct query parameters for the results page
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

  return (
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] relative flex flex-col">
      {/* Premium Grid Background */}
      <div className="premium-grid" />
      
      {/* Shared Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-18 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 w-full z-10 items-center">
        {/* Ambient background blur auroras */}
        <div className="ambient-glow top-[10%] left-[-5%] opacity-60" />
        <div className="ambient-glow bottom-[20%] right-[5%] opacity-40 bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_70%)]" />

        {/* Left Column: Text + Predictor Widget */}
        <div className="lg:col-span-7 text-left space-y-6 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.03] border border-white/10 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block animate-pulse" />
            <span className="font-mono text-[10px] font-bold text-slate-300 tracking-wider">JOSAA INTELLIGENCE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium font-display text-white leading-[1.15] tracking-tight">
            Know your exact<br />
            <span className="text-gradient-primary">admission chances.</span>
          </h1>

          <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
            Parsed from 65,086+ historical cutoff records across 6 rounds. Evaluate your chances for IITs, NITs, IIITs, and GFTIs with zero friction.
          </p>

          {/* Compact Predictor Widget */}
          <form onSubmit={handleQuickPredict} className="console-card p-4 sm:p-5 w-full max-w-xl space-y-4 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Rank Input */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-slate-300 font-bold uppercase tracking-wider">CRL Rank</label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  required
                  min="1"
                  className="bg-bg-base border border-white/10 rounded-xs px-2.5 py-1.5 text-xs text-white font-mono focus:border-brand focus:outline-none w-full"
                  value={quickRank}
                  onChange={e => setQuickRank(e.target.value)}
                />
              </div>

              {/* Exam Select */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-slate-300 font-bold uppercase tracking-wider">Exam</label>
                <select
                  className="bg-bg-base border border-white/10 rounded-xs px-2 py-1.5 text-xs text-white focus:border-brand focus:outline-none w-full cursor-pointer"
                  value={quickExam}
                  onChange={e => setQuickExam(e.target.value as 'main' | 'advanced')}
                >
                  <option value="main">JEE Main</option>
                  <option value="advanced">JEE Advanced</option>
                </select>
              </div>

              {/* Category Select */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-slate-300 font-bold uppercase tracking-wider">Category</label>
                <select
                  className="bg-bg-base border border-white/10 rounded-xs px-2 py-1.5 text-xs text-white focus:border-brand focus:outline-none w-full cursor-pointer"
                  value={quickCategory}
                  onChange={e => setQuickCategory(e.target.value)}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="OBC-NCL">OBC-NCL</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              {/* Gender Select */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-slate-300 font-bold uppercase tracking-wider">Gender</label>
                <select
                  className="bg-bg-base border border-white/10 rounded-xs px-2 py-1.5 text-xs text-white focus:border-brand focus:outline-none w-full cursor-pointer"
                  value={quickGender}
                  onChange={e => setQuickGender(e.target.value)}
                >
                  <option value="Gender-Neutral">Gender-Neutral</option>
                  <option value="Female-only (including Supernumerary)">Female-only</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button
                type="submit"
                className="btn-brand w-full sm:w-auto text-xs font-semibold py-2.5 px-6 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Predict My Colleges <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link href="/trends" className="btn-ghost w-full sm:w-auto text-xs font-medium py-2.5 px-5 text-center">
                Explore Cutoff Trends
              </Link>
            </div>
          </form>

          {/* Explanation of prediction logic */}
          <p className="text-[10px] text-text-secondary leading-normal font-mono max-w-xl">
            * Predictions are generated using historical cutoff movements, category-specific trends, and round-wise admission data.
          </p>
        </div>

        {/* Right Column: Terminal Visualization Card */}
        <div className="lg:col-span-5 w-full flex justify-center lg:justify-end items-center z-10 relative">
          <div className="console-card max-w-[330px] w-full">
            {/* Header row */}
            <div className="console-header">
              <span className="font-mono text-[9px] text-slate-300 font-semibold tracking-wider">SYSTEM_READOUT</span>
              <span className="font-mono text-[9px] text-brand font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block animate-pulse" />
                LIVE PREVIEW
              </span>
            </div>
            
            <div className="p-5 space-y-4">
              {/* Rank + Type row */}
              <div className="flex gap-3">
                <div className="flex-1 bg-bg-base rounded-xs p-2.5 border border-white/10">
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
                <div className="flex-1 bg-bg-base rounded-xs p-2.5 border border-white/10">
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
              <div className="bg-bg-base rounded-xs p-3.5 border border-white/10">
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
                      <div className="text-[11px] text-text-secondary font-medium">
                        {currentPreview.branch}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Arc probability gauge */}
              <div className="flex justify-center my-1">
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
              <div className="flex justify-between pt-3 border-t border-white/10">
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

              {/* Explanatory description below preview card */}
              <div className="text-[10px] text-text-secondary leading-normal border-t border-white/10 pt-2.5 text-center">
                Admission probability estimated from historical JoSAA closing ranks and recent cutoff trends.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="z-10 relative border-t border-b border-white/10 bg-bg-surface/60 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-start">
            {[
              { value: '65,086+', label: 'Cutoff Records' },
              { value: '127+', label: 'Institutes' },
              { value: '6', label: 'JoSAA Rounds' },
              { value: '2024–2025', label: 'Data Coverage' },
            ].map((stat, i) => (
              <div key={i} className="text-left space-y-1 w-full">
                <div className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">{stat.value}</div>
                <div className="text-xs text-text-secondary font-medium tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-4 mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono text-text-secondary">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Built using official JoSAA round-wise cutoff data.</span>
            </div>
            <div>
              <span>Updated through JoSAA Round 6 (2025)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-left mb-16 space-y-2">
          <h2 className="text-3xl font-display text-white font-medium">
            Built for serious aspirants.
          </h2>
          <p className="text-text-secondary text-sm max-w-md">
            Equipped with deep comparative metrics, period-over-period trends, and smart algorithms.
          </p>
        </div>

        {/* Minimal Grid Board layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              icon: <Shield className="w-4 h-4" />, 
              title: 'Chance Prediction', 
              desc: 'Know which colleges are Safe, Moderate, and Ambitious.' 
            },
            { 
              icon: <BarChart3 className="w-4 h-4" />, 
              title: 'Cutoff Trends', 
              desc: "Track branch cutoff movements between 2024 and 2025." 
            },
            { 
              icon: <Target className="w-4 h-4" />, 
              title: 'Compare Colleges', 
              desc: 'Compare up to 4 programs side-by-side on metrics that matter.' 
            },
            { 
              icon: <Zap className="w-4 h-4" />, 
              title: 'Smart Alternatives', 
              desc: 'Discover backup colleges with similar outcomes.' 
            },
            { 
              icon: <Search className="w-4 h-4" />, 
              title: 'Deep Filters', 
              desc: 'Filter by branch, state, quota, and rank range.' 
            },
            { 
              icon: <GraduationCap className="w-4 h-4" />, 
              title: 'Complete Data', 
              desc: 'Access exhaustive round-wise cutoffs for IITs, NITs, and IIITs.' 
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="console-card flex flex-col justify-between h-full"
            >
              <div className="console-header">
                <span className="font-mono text-[9px] text-slate-300 font-semibold tracking-wider">MODULE_0{i + 1}</span>
                <span className="font-mono text-[9px] text-text-muted font-bold">READY</span>
              </div>
              
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-sm bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4 text-brand">
                    {feature.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2 font-display">{feature.title}</h3>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mt-2">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="console-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
          
          {/* Left Column: Heading + button */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <h2 className="text-2xl font-display text-white font-medium">
              Your list is 60 seconds away.
            </h2>
            <p className="text-text-secondary text-xs leading-relaxed">
              Stop guessing. Get your customized college list based on verified historical cutoff trends and your specific categories.
            </p>
            <div className="pt-2">
              <Link href="/predict" className="btn-brand">
                Predict My Colleges <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Flat Result Card rows */}
          <div className="lg:col-span-5 w-full space-y-3">
            {[
              { college: 'IIT Bombay', branch: 'Computer Science', chance: 'ambitious' },
              { college: 'IIT Madras', branch: 'Electrical Engineering', chance: 'moderate' },
              { college: 'NIT Trichy', branch: 'Computer Science', chance: 'safe' },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between gap-3 bg-bg-base border border-white/10 rounded-xs px-3.5 py-2.5">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-text-primary">{row.college}</div>
                  <div className="text-[11px] text-text-secondary font-medium">{row.branch}</div>
                </div>
                <ChanceBadge chance={row.chance} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full z-10 border-t border-white/10 bg-bg-surface py-6">
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
