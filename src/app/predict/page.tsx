'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Check, Search,
  Loader2, ChevronDown, GraduationCap, Target
} from 'lucide-react';
import { INDIAN_STATES, CATEGORIES, WIZARD_STEPS, INSTITUTE_TYPES } from '@/lib/constants';
import { Navbar } from '@/components/Navbar';

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
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
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

    router.push(`/predict/results?${params.toString()}`);
  };

  const filteredBranches = availableBranches.filter(b =>
    b.toLowerCase().includes(branchSearch.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col pt-28 pb-16">
      {/* Navigation Header */}
      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-xl">
          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-10 gap-2">
            {WIZARD_STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={`step-node ${step > s.id ? 'done' : step === s.id ? 'active' : 'idle'}`}>
                  {step > s.id ? <Check className="w-3.5 h-3.5" /> : s.id}
                </div>
                {i < WIZARD_STEPS.length - 1 && (
                  <div className={`step-track ${step > s.id ? 'done' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step label */}
          <div className="text-center mb-8">
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--brand)' }}>
              Step {step} of 4 — {WIZARD_STEPS[step - 1].label}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">{WIZARD_STEPS[step - 1].description}</p>
          </div>

          {/* Step content */}
          <div className="surface-elevated p-6 sm:p-8 min-h-[320px] relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {/* Step 1: Rank */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold font-display">Enter Your Rank</h2>
                    <p className="text-[var(--text-secondary)] text-sm">
                      Select your exam type and enter your Common Rank List (CRL) rank.
                    </p>

                    {/* Rank type toggle */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'advanced' as const, label: 'JEE Advanced', desc: 'For IIT admissions', icon: <Target className="w-4 h-4" /> },
                        { value: 'main' as const, label: 'JEE Main', desc: 'For NIT/IIIT/GFTI', icon: <GraduationCap className="w-4 h-4" /> },
                      ].map(rt => {
                        const isSelected = data.rankType === rt.value;
                        return (
                          <button
                            key={rt.value}
                            type="button"
                            onClick={() => updateData('rankType', rt.value)}
                            style={{
                              border: isSelected ? '1.5px solid var(--brand)' : '1px solid var(--border-default)',
                              background: isSelected ? 'var(--brand-dim)' : 'var(--bg-elevated)',
                              color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                              padding: '16px',
                              borderRadius: 'var(--radius-lg)',
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            className="hover:border-[var(--border-strong)]"
                          >
                            <div style={{ color: isSelected ? 'var(--brand)' : 'var(--text-muted)', marginBottom: 8 }}>
                              {rt.icon}
                            </div>
                            <div className="font-semibold text-sm font-display text-white">{rt.label}</div>
                            <div className="text-xs text-[var(--text-secondary)] mt-1">{rt.desc}</div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Rank input */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Your CRL Rank
                      </label>
                      <input
                        type="number"
                        value={data.rank}
                        onChange={e => updateData('rank', e.target.value)}
                        placeholder="e.g., 15000"
                        className="rank-input"
                        min={1}
                        autoFocus
                      />

                      {data.rank && parseInt(data.rank) > 0 && (
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 8 }}>
                          {parseInt(data.rank) < 500 ? '🎯 Top 0.04% nationally'
                           : parseInt(data.rank) < 2000 ? '🎯 Elite band — IIT range'
                           : parseInt(data.rank) < 10000 ? '📊 NIT top-branch range'
                           : '📊 NIT/IIIT qualifying range'}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Category */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold font-display">Select Your Category</h2>
                    <p className="text-[var(--text-secondary)] text-sm">
                      Choose your seat category and gender pool for accurate predictions.
                    </p>

                    {/* Category cards */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Category</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {CATEGORIES.filter(c => !c.includes('PwD')).map(c => {
                          const isSelected = data.category === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => updateData('category', c)}
                              style={{
                                border: isSelected ? '1.5px solid var(--brand)' : '1px solid var(--border-default)',
                                background: isSelected ? 'var(--brand-dim)' : 'var(--bg-elevated)',
                                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              className="text-center hover:border-[var(--border-strong)]"
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* PwD toggle */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateData('pwdStatus', !data.pwdStatus)}
                        className={`w-12 h-6 rounded-full transition-all relative ${
                          data.pwdStatus ? 'bg-[var(--brand)]' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                          data.pwdStatus ? 'left-6' : 'left-0.5'
                        }`} />
                      </button>
                      <span className="text-sm text-[var(--text-secondary)]">Person with Disability (PwD)</span>
                    </div>

                    {/* Gender pool */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Gender Pool</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'Gender-Neutral', label: 'Gender-Neutral' },
                          { value: 'Female-only (including Supernumerary)', label: 'Female-only' }
                        ].map(g => {
                          const isSelected = data.gender === g.value;
                          return (
                            <button
                              key={g.value}
                              type="button"
                              onClick={() => updateData('gender', g.value)}
                              style={{
                                border: isSelected ? '1.5px solid var(--brand)' : '1px solid var(--border-default)',
                                background: isSelected ? 'var(--brand-dim)' : 'var(--bg-elevated)',
                                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              className="text-center hover:border-[var(--border-strong)]"
                            >
                              {g.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: State */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold font-display">Your Home State</h2>
                    <p className="text-[var(--text-secondary)] text-sm">
                      This determines your Home State (HS) vs Other State (OS) quota for NITs and GFTIs.
                      IITs use All India quota only.
                    </p>

                    <div className="relative">
                      <select
                        value={data.homeState}
                        onChange={e => updateData('homeState', e.target.value)}
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-primary)',
                          borderRadius: 'var(--radius-md)',
                        }}
                        className="w-full px-4 py-3 focus:outline-none focus:border-[var(--border-strong)] appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#0d1525]">Select your state...</option>
                        {INDIAN_STATES.map(state => (
                          <option key={state} value={state} className="bg-[#0d1525]">{state}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                    </div>

                    {data.homeState && (
                      <div className="p-3 rounded-xl border border-[var(--border-accent)] bg-[var(--brand-dim)] text-sm text-[var(--brand-hover)]">
                        📍 You&apos;ll see Home State quota for NITs in {data.homeState} and Other State quota elsewhere.
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Preferences */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold font-display">Your Preferences</h2>
                    <p className="text-[var(--text-secondary)] text-sm">
                      Select branches and institute types. Leave empty to see everything.
                    </p>

                    {/* Institute types */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Institute Types</label>
                      <div className="flex flex-wrap gap-2">
                        {INSTITUTE_TYPES.map(type => {
                          const isSelected = data.instituteTypes.includes(type);
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                const current = data.instituteTypes;
                                updateData('instituteTypes',
                                  current.includes(type)
                                    ? current.filter(t => t !== type)
                                    : [...current, type]
                                );
                              }}
                              style={{
                                background: isSelected ? 'var(--brand-dim)' : 'var(--bg-elevated)',
                                border: isSelected ? '1px solid var(--border-accent)' : '1px solid var(--border-default)',
                                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                                borderRadius: 'var(--radius-sm)',
                              }}
                              className="px-4 py-2 text-sm font-medium transition-all hover:border-[var(--border-strong)] cursor-pointer"
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Branch search & select */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Branches ({data.branches.length} selected)
                      </label>
                      <input
                        type="text"
                        value={branchSearch}
                        onChange={e => setBranchSearch(e.target.value)}
                        placeholder="Search branches..."
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                        className="w-full px-4 py-2 rounded-xl focus:outline-none focus:border-[var(--border-strong)] text-sm mb-2"
                      />
                      <div className="max-h-40 overflow-y-auto space-y-1 rounded-xl border border-[var(--border-default)] p-2">
                        {filteredBranches.length === 0 && availableBranches.length === 0 && (
                          <p className="text-sm text-[var(--text-muted)] p-2">Upload data via admin panel first to see branches</p>
                        )}
                        {filteredBranches.map(branch => {
                          const isSelected = data.branches.includes(branch);
                          return (
                            <button
                              key={branch}
                              type="button"
                              onClick={() => {
                                const current = data.branches;
                                updateData('branches',
                                  current.includes(branch)
                                    ? current.filter(b => b !== branch)
                                    : [...current, branch]
                                );
                              }}
                              style={{
                                background: isSelected ? 'var(--brand-dim)' : 'transparent',
                                color: isSelected ? 'var(--brand-hover)' : 'var(--text-secondary)',
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5 cursor-pointer"
                            >
                              {isSelected && <Check className="w-3 h-3 inline mr-2 text-[var(--brand)]" />}
                              {branch}
                            </button>
                          );
                        })}
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
              className={`btn-ghost ${step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`btn-brand ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-brand"
                style={{ background: 'var(--safe)', boxShadow: 'var(--glow-safe)' }}
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
