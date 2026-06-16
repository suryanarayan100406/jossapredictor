'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap, Search, BarChart3, ArrowRight, Shield, Zap, Target, ChevronRight, Sparkles } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#0a0a0f]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block">College Predictor</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/predict"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Predict Now
            </Link>
            <Link
              href="/admin/login"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Glowing orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Free · No Login · Official JoSAA Data</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              2026 College{' '}
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Predictor
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Predict your JoSAA college admissions based on your JEE rank, category, and preferences.
            Know your chances for <span className="text-white font-medium">IITs</span>,{' '}
            <span className="text-white font-medium">NITs</span>,{' '}
            <span className="text-white font-medium">IIITs</span> &{' '}
            <span className="text-white font-medium">GFTIs</span>.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link
              href="/predict"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Search className="w-5 h-5" />
              Predict My Colleges
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {['bg-emerald-500', 'bg-amber-500', 'bg-red-500'].map((bg, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-[#0a0a0f] flex items-center justify-center text-xs text-white font-bold`}>
                    {['S', 'M', 'A'][i]}
                  </div>
                ))}
              </div>
              <span>Safe · Moderate · Ambitious</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Four simple steps to find your best-fit colleges</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { step: 1, icon: '📊', title: 'Enter Your Rank', desc: 'JEE Advanced or JEE Main CRL rank', color: 'from-blue-500/20 to-indigo-500/20' },
              { step: 2, icon: '🏷️', title: 'Select Category', desc: 'Category, PwD status & gender pool', color: 'from-purple-500/20 to-pink-500/20' },
              { step: 3, icon: '📍', title: 'Choose State', desc: 'Home state for HS/OS quota matching', color: 'from-amber-500/20 to-orange-500/20' },
              { step: 4, icon: '🎯', title: 'Get Predictions', desc: 'Instant color-coded college results', color: 'from-emerald-500/20 to-teal-500/20' },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                className="relative group"
              >
                <div className={`glass-card p-6 rounded-2xl h-full bg-gradient-to-br ${item.color} border border-white/5`}>
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <div className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wider">Step {item.step}</div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-gray-400 text-lg">Make informed decisions, not guesses</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { icon: <Shield className="w-6 h-6" />, title: 'Chance Prediction', desc: 'Know if a college is Safe, Moderate, or Ambitious based on your rank vs cutoff.', gradient: 'from-emerald-500 to-emerald-600' },
              { icon: <BarChart3 className="w-6 h-6" />, title: 'Cutoff Trends', desc: 'See how cutoffs changed from 2024 to 2025. Know if a branch is getting harder.', gradient: 'from-blue-500 to-blue-600' },
              { icon: <Target className="w-6 h-6" />, title: 'Compare Colleges', desc: 'Compare up to 4 colleges side-by-side — ranks, location, trends, and more.', gradient: 'from-purple-500 to-purple-600' },
              { icon: <Zap className="w-6 h-6" />, title: 'Smart Alternatives', desc: 'Get suggestions for similar branches and colleges near your rank.', gradient: 'from-amber-500 to-amber-600' },
              { icon: <Search className="w-6 h-6" />, title: 'Powerful Filters', desc: 'Filter by institute type, branch, state, category, and rank range instantly.', gradient: 'from-pink-500 to-pink-600' },
              { icon: <GraduationCap className="w-6 h-6" />, title: 'All Institutes', desc: 'Complete data for 100+ IITs, NITs, IIITs, and GFTIs with 2024–2025 cutoffs.', gradient: 'from-indigo-500 to-indigo-600' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="glass-card p-6 rounded-2xl group hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="glass-card p-12 rounded-3xl relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Find Your College?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Stop guessing. Start predicting. Get your personalized college list in under 60 seconds.
              </p>
              <Link
                href="/predict"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                Start Predicting
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">2026 College Predictor (JoSAA)</span>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Predictions are estimates based on previous-year JoSAA cutoffs and are not guarantees.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <Link href="/predict" className="hover:text-white transition-colors">Predict</Link>
              <Link href="/admin/login" className="hover:text-white transition-colors">Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
