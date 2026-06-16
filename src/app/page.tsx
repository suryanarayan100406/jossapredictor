'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  GraduationCap, Search, BarChart3, ArrowRight, Shield, 
  Zap, Target, ChevronRight, Sparkles, Globe, 
  Check
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

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
    color: 'from-emerald-500/20 to-teal-500/20',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
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
    color: 'from-amber-500/20 to-orange-500/20',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
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
    color: 'from-rose-500/20 to-red-500/20',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
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
    <main className="min-h-screen bg-[#030306] text-gray-100 relative overflow-hidden select-none">
      {/* Background Grid & Ambient Blobs */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-950/10 via-transparent to-transparent pointer-events-none" />

      {/* Floating Ambient Blobs */}
      <div className="absolute top-[10%] left-[5%] w-[350px] h-[350px] bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none animate-[pulse_12s_infinite]" />
      <div className="absolute top-[35%] right-[5%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none animate-[pulse_15s_infinite_2s]" />
      <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[90px] pointer-events-none animate-[pulse_10s_infinite_4s]" />

      {/* Top Floating Glass Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-2xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-white text-base">
            College Predictor <span className="text-indigo-400 font-semibold text-xs ml-1 px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">JoSAA</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/predict"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
          >
            Predict Now
          </Link>
          <Link
            href="/admin/login"
            className="text-xs font-semibold px-4 py-1.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white transition-all duration-200"
          >
            Admin Portal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-16 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-8 min-h-[92vh]">
        {/* Left: Headline & Description */}
        <div className="flex-1 text-left space-y-6 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/25 bg-indigo-500/5 text-indigo-400 text-xs font-semibold tracking-wide shadow-inner">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Free Prediction · No Account Required · 2026 Edition</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] font-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Find your dream engineering college,{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              without the guesswork.
            </span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-gray-400 max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Harnessing historical cutoff analytics covering <span className="text-white font-semibold">12,274 rounds</span> of JoSAA admissions. Instantly evaluate your admission chances for IITs, NITs, IIITs, and GFTIs.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 pt-2 items-start sm:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link
              href="/predict"
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold text-base shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all duration-300 hover:-translate-y-0.5 active:scale-98"
            >
              <Search className="w-4 h-4" />
              Predict My Colleges
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center gap-3 text-xs text-gray-400 pl-1">
              <div className="flex -space-x-1.5">
                {['bg-emerald-500', 'bg-amber-500', 'bg-red-500'].map((bg, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full ${bg} border-2 border-[#030306] flex items-center justify-center text-[10px] text-white font-bold`}>
                    {['S', 'M', 'A'][i]}
                  </div>
                ))}
              </div>
              <span className="font-medium">Safe · Moderate · Ambitious Bands</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Interactive Live Simulation */}
        <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center items-center z-10 relative">
          {/* Card container glow */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl opacity-80" />
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl relative"
          >
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-[11px] font-mono tracking-widest text-gray-500 uppercase">Live Simulation</span>
            </div>

            {/* Input fields visualizer */}
            <div className="space-y-3.5">
              <div className="flex justify-between gap-3">
                <div className="flex-1 bg-white/5 rounded-lg p-2.5 border border-white/5">
                  <div className="text-[10px] text-gray-500 font-mono uppercase mb-0.5">JEE Rank</div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPreview.rank}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="text-sm font-bold text-white font-mono"
                    >
                      {currentPreview.rank}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg p-2.5 border border-white/5">
                  <div className="text-[10px] text-gray-500 font-mono uppercase mb-0.5">Rank Type</div>
                  <div className="text-sm font-bold text-indigo-400 font-mono">
                    JEE {currentPreview.type}
                  </div>
                </div>
              </div>

              {/* Prediction result block */}
              <div className="bg-white/5 rounded-lg p-3.5 border border-white/5 space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-gray-500 uppercase">Predicted Cutoff Match</span>
                  
                  {/* Badge */}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentPreview.chance}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-white/5 border ${currentPreview.borderColor} ${currentPreview.textColor}`}
                    >
                      {currentPreview.chance}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPreview.college}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-semibold text-white line-clamp-1"
                    >
                      {currentPreview.college}
                    </motion.div>
                  </AnimatePresence>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPreview.branch}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] text-gray-400 line-clamp-1"
                    >
                      {currentPreview.branch}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Progress bar / Probability dial */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>Admission Probability</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentPreview.probability}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-bold text-white"
                      >
                        {currentPreview.probability}%
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentPreview.probability}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${
                        currentPreview.chance === 'safe'
                          ? 'from-emerald-500 to-teal-400'
                          : currentPreview.chance === 'moderate'
                          ? 'from-amber-500 to-orange-400'
                          : 'from-rose-500 to-red-400'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Micro-insights snippet */}
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-mono">
              <span>Round 6 Cutoff:</span>
              <AnimatePresence mode="wait">
                <motion.span key={currentPreview.closing} className="text-gray-300 font-bold">
                  {currentPreview.closing}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid: How It Works */}
      <section className="py-24 px-6 lg:px-8 max-w-6xl mx-auto relative">
        <motion.div
          className="text-center mb-16 space-y-2"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
            Fast, Simple, and Rigorous.
          </h2>
          <p className="text-gray-400 text-base max-w-lg mx-auto">
            Discover how we parse raw cutoffs and match your parameters in four steps.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Step 1: Rank (Wide Bento Card) */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-2 rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-950/20 via-white/[0.02] to-transparent p-6 flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300 group"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg text-indigo-400 mb-5 group-hover:scale-105 transition-transform duration-300">
                📊
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Input Your CRL Rank</h3>
              <p className="text-sm text-gray-400 max-w-md">
                Enter your exact JEE Advanced Common Rank List (CRL) for IITs or JEE Main CRL for NITs, IIITs, and GFTIs.
              </p>
            </div>
            
            {/* Visual element */}
            <div className="mt-6 border border-white/5 bg-white/5 rounded-xl p-3.5 space-y-2.5 max-w-sm">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-mono">RANK METRIC SELECTOR</span>
                <span className="text-[10px] font-bold text-indigo-400 font-mono">Main / CRL</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full relative flex items-center">
                <div className="absolute left-[40%] w-3 h-3 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 cursor-pointer" />
              </div>
              <div className="text-[10px] text-gray-500 font-mono text-center">Drag slider to test limits</div>
            </div>
          </motion.div>

          {/* Step 2: Category (Tall Bento Card) */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-white/5 bg-gradient-to-br from-purple-950/20 via-white/[0.02] to-transparent p-6 flex flex-col justify-between hover:border-purple-500/20 transition-all duration-300 group"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-lg text-purple-400 mb-5 group-hover:scale-105 transition-transform duration-300">
                🏷️
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Seat Category</h3>
              <p className="text-sm text-gray-400">
                Choose your seat pool (OPEN, EWS, OBC-NCL, SC, ST) along with gender details to trigger precise matching.
              </p>
            </div>
            
            {/* Visual element */}
            <div className="mt-6 flex flex-col gap-1.5">
              {['OPEN', 'OBC-NCL', 'SC/ST'].map((cat, i) => (
                <div key={i} className={`px-3 py-1.5 rounded-lg border text-[11px] flex justify-between items-center ${i === 0 ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : 'bg-white/5 border-white/5 text-gray-500'}`}>
                  <span>{cat}</span>
                  {i === 0 && <Check className="w-3 h-3 text-purple-400" />}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Step 3: State (Tall Bento Card) */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-white/5 bg-gradient-to-br from-amber-950/20 via-white/[0.02] to-transparent p-6 flex flex-col justify-between hover:border-amber-500/20 transition-all duration-300 group"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg text-amber-400 mb-5 group-hover:scale-105 transition-transform duration-300">
                📍
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. Home State</h3>
              <p className="text-sm text-gray-400">
                Select your Home State to automatically resolve the 50% Home State (HS) vs Other State (OS) quota allocations.
              </p>
            </div>

            {/* Visual element */}
            <div className="mt-6 bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
              <Globe className="w-5 h-5 text-amber-500 animate-spin-slow" />
              <div className="text-[10px] font-mono text-gray-400">
                <div className="font-bold text-white uppercase">Quota Resolver</div>
                <span>HS vs OS Active</span>
              </div>
            </div>
          </motion.div>

          {/* Step 4: Predictions (Wide Bento Card) */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-2 rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-950/20 via-white/[0.02] to-transparent p-6 flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300 group"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg text-emerald-400 mb-5 group-hover:scale-105 transition-transform duration-300">
                🎯
              </div>
              <h3 className="text-lg font-bold text-white mb-2">4. Get Accurate Results</h3>
              <p className="text-sm text-gray-400 max-w-md">
                Instantly explore color-coded results classifying your choices into Safe, Moderate, and Ambitious options.
              </p>
            </div>

            {/* Visual element */}
            <div className="mt-6 flex gap-2">
              {['Safe', 'Moderate', 'Ambitious'].map((label, i) => (
                <div key={i} className={`flex-1 p-2 rounded-lg border text-center ${
                  i === 0 ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-400' :
                  i === 1 ? 'bg-amber-500/5 border-amber-500/15 text-amber-400' :
                  'bg-rose-500/5 border-rose-500/15 text-rose-400'
                } text-[11px] font-bold uppercase`}>
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid: Professional & Minimal */}
      <section className="py-24 px-6 lg:px-8 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16 space-y-2"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
              Everything You Need
            </h2>
            <p className="text-gray-400 text-base max-w-lg mx-auto">
              Equipped with deep comparative metrics, period-over-period trends, and smart algorithms.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { 
                icon: <Shield className="w-5 h-5" />, 
                title: 'Chance Prediction', 
                desc: 'Know if a college is Safe, Moderate, or Ambitious based on your rank vs cutoff.', 
                color: 'text-emerald-400',
                bgColor: 'bg-emerald-500/10 border-emerald-500/15'
              },
              { 
                icon: <BarChart3 className="w-5 h-5" />, 
                title: 'Cutoff Trends', 
                desc: 'See how cutoffs changed from 2024 to 2025. Know if a branch is getting harder.', 
                color: 'text-blue-400',
                bgColor: 'bg-blue-500/10 border-blue-500/15'
              },
              { 
                icon: <Target className="w-5 h-5" />, 
                title: 'Compare Colleges', 
                desc: 'Compare up to 4 colleges side-by-side — ranks, location, trends, and more.', 
                color: 'text-purple-400',
                bgColor: 'bg-purple-500/10 border-purple-500/15'
              },
              { 
                icon: <Zap className="w-5 h-5" />, 
                title: 'Smart Alternatives', 
                desc: 'Get suggestions for similar branches and colleges near your rank.', 
                color: 'text-amber-400',
                bgColor: 'bg-amber-500/10 border-amber-500/15'
              },
              { 
                icon: <Search className="w-5 h-5" />, 
                title: 'Powerful Filters', 
                desc: 'Filter by institute type, branch, state, category, and rank range instantly.', 
                color: 'text-pink-400',
                bgColor: 'bg-pink-500/10 border-pink-500/15'
              },
              { 
                icon: <GraduationCap className="w-5 h-5" />, 
                title: 'All Institutes', 
                desc: 'Complete data for 100+ IITs, NITs, IIITs, and GFTIs with 2024–2025 cutoffs.', 
                color: 'text-indigo-400',
                bgColor: 'bg-indigo-500/10 border-indigo-500/15'
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${feature.bgColor} ${feature.color} group-hover:scale-105 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section: High-Fidelity Capsule */}
      <section className="py-24 px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/20 via-white/[0.02] to-transparent p-12 text-center relative overflow-hidden"
        >
          {/* Internal Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
              Ready to find your college?
            </h2>
            <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
              Stop guessing. Get your personalized college list and explore your opportunities in under 60 seconds.
            </p>
            <Link
              href="/predict"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold text-base shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all duration-300 hover:-translate-y-0.5 active:scale-98"
            >
              Start Predicting
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer: Minimal & Sleek */}
      <footer className="border-t border-white/5 py-12 px-6 lg:px-8 bg-black/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-white">2026 College Predictor (JoSAA)</span>
          </div>
          
          <p className="text-xs text-gray-500 max-w-sm text-center md:text-left">
            Disclaimer: Predictions are based strictly on previous years' JoSAA data (2024 & 2025) and do not guarantee actual placement.
          </p>

          <div className="flex gap-6 text-xs text-gray-400">
            <Link href="/predict" className="hover:text-white transition-colors duration-200">Predict</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors duration-200">Admin</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
