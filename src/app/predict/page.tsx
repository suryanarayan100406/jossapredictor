'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap, ArrowLeft, ArrowRight, Check, Search,
  Loader2, ChevronDown
} from 'lucide-react';
import { INDIAN_STATES, CATEGORIES, RANK_TYPES, WIZARD_STEPS, INSTITUTE_TYPES } from '@/lib/constants';

interface WizardData {
  rank: string;
  rankType: 'advanced' | 'main';
  category: string;
  pwdStatus: boolean;
  gender: string;
  homeState: string;
  branches: string[];
  instituteTypes: string[];
  year: number;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function PredictPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const [branchSearch, setBranchSearch] = useState('');
  const [data, setData] = useState<WizardData>({
    rank: '',
    rankType: 'main',
    category: 'OPEN',
    pwdStatus: false,
    gender: 'Gender-Neutral',
    homeState: '',
    branches: [],
    instituteTypes: [],
    year: 2025,
  });

  // Fetch available branches from API
  useEffect(() => {
    fetch('/api/filters')
      .then(res => res.json())
      .then(d => {
        if (d.branches) setAvailableBranches(d.branches);
      })
      .catch(() => {});
  }, []);

  const updateData = (field: keyof WizardData, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return data.rank && parseInt(data.rank) > 0;
      case 2: return data.category && data.gender;
      case 3: return data.homeState;
      case 4: return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (step < 4) { setDirection(1); setStep(s => s + 1); }
  };

  const prevStep = () => {
    if (step > 1) { setDirection(-1); setStep(s => s - 1); }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Encode data as query params for the results page
    const params = new URLSearchParams({
      rank: data.rank,
      rankType: data.rankType,
      category: data.category,
      pwdStatus: data.pwdStatus.toString(),
      gender: data.gender,
      homeState: data.homeState,
      year: data.year.toString(),
    });
    if (data.branches.length > 0) params.set('branches', data.branches.join(','));
    if (data.instituteTypes.length > 0) params.set('instituteTypes', data.instituteTypes.join(','));

    router.push(`/results?${params.toString()}`);
  };

  const filteredBranches = availableBranches.filter(b =>
    b.toLowerCase().includes(branchSearch.toLowerCase())
  );

  return (
    <main className="min-h-screen flex flex-col">
      {/* Top bar */}
      <nav className="border-b border-white/5 backdrop-blur-xl bg-[#0a0a0f]/80 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-semibold text-sm">College Predictor</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-10">
            {WIZARD_STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={`step-dot ${step > s.id ? 'completed' : step === s.id ? 'active' : 'inactive'}`}>
                  {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                </div>
                {i < WIZARD_STEPS.length - 1 && (
                  <div className={`step-line w-12 sm:w-20 ${step > s.id ? 'completed' : ''}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step label */}
          <div className="text-center mb-8">
            <p className="text-sm text-indigo-400 font-medium mb-1">
              Step {step} of 4 — {WIZARD_STEPS[step - 1].label}
            </p>
            <p className="text-sm text-gray-500">{WIZARD_STEPS[step - 1].description}</p>
          </div>

          {/* Step content */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 min-h-[320px] relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Step 1: Rank */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Enter Your Rank</h2>
                    <p className="text-gray-400 text-sm">
                      Select your exam type and enter your Common Rank List (CRL) rank.
                    </p>

                    {/* Rank type toggle */}
                    <div className="grid grid-cols-2 gap-3">
                      {RANK_TYPES.map(rt => (
                        <button
                          key={rt.value}
                          onClick={() => updateData('rankType', rt.value)}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            data.rankType === rt.value
                              ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="text-lg mb-1">{rt.icon}</div>
                          <div className="font-semibold text-sm">{rt.label}</div>
                          <div className="text-xs text-gray-400 mt-1">{rt.description}</div>
                        </button>
                      ))}
                    </div>

                    {/* Rank input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your CRL Rank
                      </label>
                      <input
                        type="number"
                        value={data.rank}
                        onChange={e => updateData('rank', e.target.value)}
                        placeholder="e.g., 15000"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-lg"
                        min={1}
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Category */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Select Your Category</h2>
                    <p className="text-gray-400 text-sm">
                      Choose your seat category and gender pool for accurate predictions.
                    </p>

                    {/* Category selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                      <div className="relative">
                        <select
                          value={data.category}
                          onChange={e => updateData('category', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                        >
                          {CATEGORIES.filter(c => !c.includes('PwD')).map(c => (
                            <option key={c} value={c} className="bg-[#1a1a25]">{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* PwD toggle */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateData('pwdStatus', !data.pwdStatus)}
                        className={`w-12 h-6 rounded-full transition-all relative ${
                          data.pwdStatus ? 'bg-indigo-500' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                          data.pwdStatus ? 'left-6' : 'left-0.5'
                        }`} />
                      </button>
                      <span className="text-sm text-gray-300">Person with Disability (PwD)</span>
                    </div>

                    {/* Gender pool */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Gender Pool</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Gender-Neutral', 'Female-only (including Supernumerary)'].map(g => (
                          <button
                            key={g}
                            onClick={() => updateData('gender', g)}
                            className={`p-3 rounded-xl border text-sm text-center transition-all ${
                              data.gender === g
                                ? 'border-indigo-500 bg-indigo-500/10'
                                : 'border-white/10 bg-white/5 hover:border-white/20'
                            }`}
                          >
                            {g === 'Gender-Neutral' ? '👤 Gender-Neutral' : '👩 Female-only'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: State */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Your Home State</h2>
                    <p className="text-gray-400 text-sm">
                      This determines your Home State (HS) vs Other State (OS) quota for NITs and GFTIs.
                      IITs use All India quota only.
                    </p>

                    <div className="relative">
                      <select
                        value={data.homeState}
                        onChange={e => updateData('homeState', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#1a1a25]">Select your state...</option>
                        {INDIAN_STATES.map(state => (
                          <option key={state} value={state} className="bg-[#1a1a25]">{state}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>

                    {data.homeState && (
                      <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-sm text-indigo-300">
                        📍 You&apos;ll see Home State quota for NITs in {data.homeState} and Other State quota elsewhere.
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Preferences */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Your Preferences</h2>
                    <p className="text-gray-400 text-sm">
                      Select branches and institute types. Leave empty to see everything.
                    </p>

                    {/* Institute types */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Institute Types</label>
                      <div className="flex flex-wrap gap-2">
                        {INSTITUTE_TYPES.map(type => (
                          <button
                            key={type}
                            onClick={() => {
                              const current = data.instituteTypes;
                              updateData('instituteTypes',
                                current.includes(type)
                                  ? current.filter(t => t !== type)
                                  : [...current, type]
                              );
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              data.instituteTypes.includes(type)
                                ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                                : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Branch search & select */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Branches ({data.branches.length} selected)
                      </label>
                      <input
                        type="text"
                        value={branchSearch}
                        onChange={e => setBranchSearch(e.target.value)}
                        placeholder="Search branches..."
                        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm mb-2"
                      />
                      <div className="max-h-40 overflow-y-auto space-y-1 rounded-xl border border-white/5 p-2">
                        {filteredBranches.length === 0 && availableBranches.length === 0 && (
                          <p className="text-sm text-gray-500 p-2">Upload data via admin panel first to see branches</p>
                        )}
                        {filteredBranches.map(branch => (
                          <button
                            key={branch}
                            onClick={() => {
                              const current = data.branches;
                              updateData('branches',
                                current.includes(branch)
                                  ? current.filter(b => b !== branch)
                                  : [...current, branch]
                              );
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                              data.branches.includes(branch)
                                ? 'bg-indigo-500/15 text-indigo-300'
                                : 'text-gray-400 hover:bg-white/5'
                            }`}
                          >
                            {data.branches.includes(branch) && <Check className="w-3 h-3 inline mr-2" />}
                            {branch}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                step === 1
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  canProceed()
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Predict Colleges
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
