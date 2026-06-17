'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Check, Search,
  Loader2, ChevronDown, GraduationCap, Target
} from 'lucide-react';
import { INDIAN_STATES, CATEGORIES, WIZARD_STEPS, INSTITUTE_TYPES, PREFERENCE_PRESETS } from '@/lib/constants';
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
  preferences: {
    placementWeight: number;
    codingCultureWeight: number;
    campusLifeWeight: number;
    hostelWeight: number;
    researchWeight: number;
    startupWeight: number;
    sportsWeight: number;
    technicalClubsWeight: number;
  };
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
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
    preferences: {
      placementWeight: 5,
      codingCultureWeight: 5,
      campusLifeWeight: 5,
      hostelWeight: 5,
      researchWeight: 5,
      startupWeight: 5,
      sportsWeight: 5,
      technicalClubsWeight: 5,
    },
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rankscope_wizard_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        setData(prev => ({
          ...prev,
          ...parsed,
          preferences: parsed.preferences || prev.preferences
        }));
      }
    } catch (e) {}
  }, []);

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
    setData(prev => {
      const updated = { ...prev, [field]: value };
      try {
        localStorage.setItem('rankscope_wizard_data', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updatePreference = (key: keyof WizardData['preferences'], val: number) => {
    setData(prev => {
      const updated = {
        ...prev,
        preferences: {
          ...prev.preferences,
          [key]: val
        }
      };
      try {
        localStorage.setItem('rankscope_wizard_data', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const applyPreset = (preset: typeof PREFERENCE_PRESETS[number]) => {
    setData(prev => {
      const updated = {
        ...prev,
        preferences: { ...preset.weights }
      };
      try {
        localStorage.setItem('rankscope_wizard_data', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1: return data.rank && parseInt(data.rank) > 0;
      case 2: return data.category && data.gender;
      case 3: return data.homeState;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (step < 5) { setDirection(1); setStep(s => s + 1); }
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
      preferences: JSON.stringify(data.preferences),
    });
    if (data.branches.length > 0) params.set('branches', data.branches.join(','));
    if (data.instituteTypes.length > 0) params.set('instituteTypes', data.instituteTypes.join(','));

    router.push(`/predict/results?${params.toString()}`);
  };

  const filteredBranches = availableBranches.filter(b =>
    b.toLowerCase().includes(branchSearch.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] relative flex flex-col">
      <div className="premium-grid" />
      {/* Navigation Header */}
      <Navbar />

      <div className="flex-grow flex flex-col items-center pt-10 pb-16 px-4 z-10">
        <div className="w-full max-w-xl">
          {/* Progress indicator */}
          <div className="flex items-center justify-between w-full max-w-xl mx-auto mb-10 gap-2">
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
            <p className="text-xs font-semibold mb-1 uppercase tracking-wider font-mono text-[var(--text-secondary)]">
              Step {step} of 5 — {WIZARD_STEPS[step - 1].label}
            </p>
            <p className="text-xs text-[var(--text-muted)]">{WIZARD_STEPS[step - 1].description}</p>
          </div>

          {/* Step content */}
          <div className="surface p-6 sm:p-8 min-h-[360px] relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {/* Step 1: Rank */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium font-display text-white">Enter Your Rank</h2>
                    <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                      Select your exam type and enter your Common Rank List (CRL) rank.
                    </p>

                    {/* Rank type toggle */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'advanced' as const, label: 'JEE Advanced', desc: 'For IIT admissions', icon: <Target className="w-3.5 h-3.5" /> },
                        { value: 'main' as const, label: 'JEE Main', desc: 'For NIT/IIIT/GFTI', icon: <GraduationCap className="w-3.5 h-3.5" /> },
                      ].map(rt => {
                        const isSelected = data.rankType === rt.value;
                        return (
                          <button
                            key={rt.value}
                            type="button"
                            onClick={() => updateData('rankType', rt.value)}
                            style={{
                              border: isSelected ? '1px solid var(--brand)' : '1px solid var(--border-default)',
                              background: isSelected ? 'var(--brand-dim)' : 'var(--bg-base)',
                              color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                              padding: '14px',
                              borderRadius: 'var(--radius-sm)',
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                            className="hover:border-[var(--border-strong)] text-left"
                          >
                            <div style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)', marginBottom: 8 }}>
                              {rt.icon}
                            </div>
                            <div className="font-semibold text-xs font-display text-white">{rt.label}</div>
                            <div className="text-[10px] text-[var(--text-muted)] mt-1">{rt.desc}</div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Rank input */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2 font-mono uppercase tracking-wider">
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
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: 8 }}>
                          {parseInt(data.rank) < 500 ? 'Top 0.04% nationally'
                           : parseInt(data.rank) < 2000 ? 'Elite band — IIT range'
                           : parseInt(data.rank) < 10000 ? 'NIT top-branch range'
                           : 'NIT/IIIT qualifying range'}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Demographics */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium font-display text-white">Select Category & Gender</h2>
                    <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                      Choose your seat category and gender pool for accurate predictions.
                    </p>

                    {/* Category cards */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2 font-mono uppercase tracking-wider">Category</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {CATEGORIES.filter(c => !c.includes('PwD')).map(c => {
                          const isSelected = data.category === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => updateData('category', c)}
                              style={{
                                border: isSelected ? '1px solid var(--brand)' : '1px solid var(--border-default)',
                                background: isSelected ? 'var(--brand-dim)' : 'var(--bg-base)',
                                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                                padding: '10px',
                                borderRadius: 'var(--radius-xs)',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
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
                        className={`w-10 h-5 rounded-full transition-all relative ${
                          data.pwdStatus ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-default)]'
                        }`}
                      >
                        <div style={{ background: data.pwdStatus ? 'var(--bg-base)' : 'var(--text-secondary)' }} className={`w-4 h-4 rounded-full absolute top-0.5 transition-all ${
                          data.pwdStatus ? 'left-5' : 'left-0.5'
                        }`} />
                      </button>
                      <span className="text-xs text-[var(--text-secondary)] font-mono">Person with Disability (PwD)</span>
                    </div>

                    {/* Gender pool */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2 font-mono uppercase tracking-wider">Gender Pool</label>
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
                                border: isSelected ? '1px solid var(--brand)' : '1px solid var(--border-default)',
                                background: isSelected ? 'var(--brand-dim)' : 'var(--bg-base)',
                                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                                padding: '10px',
                                borderRadius: 'var(--radius-xs)',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
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
                    <h2 className="text-lg font-medium font-display text-white">Your Home State</h2>
                    <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                      This determines your Home State (HS) vs Other State (OS) quota for NITs and GFTIs.
                      IITs use All India quota only.
                    </p>

                    <div className="relative">
                      <select
                        value={data.homeState}
                        onChange={e => updateData('homeState', e.target.value)}
                        style={{
                          background: 'var(--bg-base)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-primary)',
                          borderRadius: 'var(--radius-xs)',
                        }}
                        className="w-full px-4 py-3 focus:outline-none focus:border-[var(--border-strong)] appearance-none cursor-pointer text-sm"
                      >
                        <option value="" className="bg-[#09090b]">Select your state...</option>
                        {INDIAN_STATES.map(state => (
                          <option key={state} value={state} className="bg-[#09090b]">{state}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
                    </div>

                    {data.homeState && (
                      <div className="p-3 rounded border border-[var(--border-default)] bg-[rgba(255,255,255,0.02)] text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
                        Matches Home State quota for NITs in {data.homeState} and Other State quota elsewhere.
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Personalization Slider Preferences */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium font-display text-white">Configure Your Preferences</h2>
                    <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                      We use these weights to customize and sort your top recommendations.
                    </p>

                    {/* Presets */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-[var(--text-secondary)] font-mono uppercase tracking-wider">Presets</label>
                      <div className="grid grid-cols-2 gap-2">
                        {PREFERENCE_PRESETS.map(preset => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => applyPreset(preset)}
                            className="p-2 border border-[var(--border-default)] hover:border-[var(--border-strong)] rounded text-left transition-all bg-[var(--bg-base)] text-[10px]"
                          >
                            <span className="font-semibold block text-[11px] text-white">{preset.name}</span>
                            <span className="text-[var(--text-muted)] line-clamp-1 mt-0.5">{preset.description}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sliders grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-2 max-h-56 overflow-y-auto pr-1">
                      {[
                        { key: 'placementWeight' as const, label: '💼 Placements & Packages' },
                        { key: 'codingCultureWeight' as const, label: '💻 Coding & Hackathons' },
                        { key: 'campusLifeWeight' as const, label: '🌴 Campus Life & Culture' },
                        { key: 'hostelWeight' as const, label: '🏠 Hostel & Food Quality' },
                        { key: 'researchWeight' as const, label: '🔬 Research Opportunities' },
                        { key: 'startupWeight' as const, label: '🚀 Startup Ecosystem' },
                        { key: 'sportsWeight' as const, label: '⚽ Sports Infrastructure' },
                        { key: 'technicalClubsWeight' as const, label: '⚙️ Technical Societies' },
                      ].map(slider => (
                        <div key={slider.key} className="space-y-1.5">
                          <div className="flex justify-between items-center text-[11px] font-medium text-[var(--text-secondary)]">
                            <span>{slider.label}</span>
                            <span className="font-mono text-white font-semibold">{data.preferences[slider.key]}/10</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={data.preferences[slider.key]}
                            onChange={e => updatePreference(slider.key, parseInt(e.target.value))}
                            className="w-full accent-[var(--brand)] bg-[var(--border-default)] h-1.5 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: Branches & Types Filter */}
                {step === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium font-display text-white">Filter Branches & Institutes</h2>
                    <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                      Optionally narrow down choices by program branch and college type. Leave blank to see all matches.
                    </p>

                    {/* Institute types */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2 font-mono uppercase tracking-wider">Institute Types</label>
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
                                background: isSelected ? 'var(--brand-dim)' : 'var(--bg-base)',
                                border: isSelected ? '1px solid var(--brand)' : '1px solid var(--border-default)',
                                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                                borderRadius: 'var(--radius-xs)',
                              }}
                              className="px-4 py-2 text-xs font-semibold transition-all hover:border-[var(--border-strong)] cursor-pointer"
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Branch search & select */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2 font-mono uppercase tracking-wider">
                        Branches ({data.branches.length} selected)
                      </label>
                      <input
                        type="text"
                        value={branchSearch}
                        onChange={e => setBranchSearch(e.target.value)}
                        placeholder="Search branches..."
                        style={{
                          background: 'var(--bg-base)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                        className="w-full px-4 py-2 rounded focus:outline-none focus:border-[var(--border-strong)] text-xs mb-2"
                      />
                      <div className="max-h-40 overflow-y-auto space-y-1 rounded border border-[var(--border-default)] p-2 bg-[var(--bg-base)]">
                        {filteredBranches.length === 0 && availableBranches.length === 0 && (
                          <p className="text-xs text-[var(--text-muted)] p-2">Upload data via admin panel first to see branches</p>
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
                                background: isSelected ? 'rgba(255,255,255,0.04)' : 'transparent',
                                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                              }}
                              className="w-full text-left px-3 py-1.5 rounded text-xs transition-all hover:bg-white/5 cursor-pointer"
                            >
                              {isSelected && <Check className="w-3 h-3 inline mr-2 text-[var(--text-primary)]" />}
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
              className={`btn-ghost ${step === 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {step < 5 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`btn-brand ${!canProceed() ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-brand"
                style={{ background: 'var(--brand)', color: 'var(--text-inverse)' }}
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
