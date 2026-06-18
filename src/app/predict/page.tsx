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
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 30 : -30,
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

      <div className="flex-grow flex flex-col items-center pt-8 pb-16 px-4 z-10">
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          
          {/* Left Side: Technical Info & Telemetry indicators */}
          <div className="lg:col-span-4 min-w-0 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/[0.03] border border-white/10 rounded-xs">
              <span className="font-mono text-[9px] font-bold text-slate-300 tracking-wider">CONFIG_WIZARD</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-display font-medium text-white leading-tight">
              Prefill parameters to optimize matches.
            </h1>
            <p className="text-xs text-text-secondary leading-relaxed">
              Define CRL ranks, counselling quotas, categories, and relative campus preferences to generate the prediction list.
            </p>

            {/* Stepper Status Readout */}
            <div className="console-card p-4 space-y-3 font-mono text-[10px] text-text-secondary bg-black/20">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-text-muted">STAGE_RUNNER:</span>
                <span className="text-brand font-bold">WIZD_SYS_OK</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-text-muted">TARGET_CRL:</span>
                <span className="text-white font-medium">{data.rank || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-text-muted">CATEGORY_POOL:</span>
                <span className="text-white font-medium">{data.category || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">GENDER_POOL:</span>
                <span className="text-white font-medium truncate max-w-[120px]">{data.gender.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          {/* Right Side: The Main Wizard Console Card */}
          <div className="lg:col-span-8 min-w-0 w-full space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-between w-full mb-2 gap-2">
              {WIZARD_STEPS.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div className={`step-node ${step > s.id ? 'done' : step === s.id ? 'active' : 'idle'}`}>
                    {step > s.id ? <Check className="w-3 h-3" /> : s.id}
                  </div>
                  {i < WIZARD_STEPS.length - 1 && (
                    <div className={`step-track ${step > s.id ? 'done' : ''}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step label header */}
            <div className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-3">
              <span className="text-text-secondary">WIZARD_STAGE: 0{step}_of_05</span>
              <span className="text-white font-bold uppercase tracking-wider">{WIZARD_STEPS[step - 1].label}</span>
            </div>

            {/* Main Console Box */}
            <div className="relative">
              {/* Brackets */}
              <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-brand" />
              <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-brand" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-brand" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-brand" />

              <div className="console-card min-h-[350px]">
                <div className="console-header">
                  <span className="font-mono text-[9px] text-slate-300 font-semibold tracking-wider">PARAMETERS_SETUP_DECK</span>
                  <span className="font-mono text-[9px] text-brand font-bold uppercase tracking-wider">
                    {WIZARD_STEPS[step - 1].label}
                  </span>
                </div>

                <div className="p-6 sm:p-8">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                      {/* Step 1: Rank */}
                      {step === 1 && (
                        <div className="space-y-6">
                          <h2 className="text-base font-semibold font-display text-white">Enter Your Rank</h2>
                          <p className="text-text-secondary text-xs leading-relaxed">
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
                                  className={`p-3.5 rounded-xs text-left transition-all duration-150 border cursor-pointer hover:border-brand/40 text-left ${
                                    isSelected
                                      ? 'border-brand bg-brand-dim text-brand'
                                      : 'border-white/10 bg-bg-base/60 text-text-secondary'
                                  }`}
                                >
                                  <div className="mb-2">{rt.icon}</div>
                                  <div className="font-semibold text-xs font-display text-white">{rt.label}</div>
                                  <div className="text-[10px] text-text-muted mt-1">{rt.desc}</div>
                                </button>
                              );
                            })}
                          </div>

                          {/* Rank input */}
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-[var(--text-secondary)] font-mono uppercase tracking-wider">
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
                              <p className="font-mono text-[9px] text-brand tracking-wide mt-1">
                                {parseInt(data.rank) < 500 ? 'STATUS: Top 0.04% nationally'
                                 : parseInt(data.rank) < 2000 ? 'STATUS: Elite band — IIT range'
                                 : parseInt(data.rank) < 10000 ? 'STATUS: NIT top-branch range'
                                 : 'STATUS: NIT/IIIT qualifying range'}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Step 2: Demographics */}
                      {step === 2 && (
                        <div className="space-y-6">
                          <h2 className="text-base font-semibold font-display text-white">Select Category & Gender</h2>
                          <p className="text-text-secondary text-xs leading-relaxed">
                            Choose your seat category and gender pool for accurate predictions.
                          </p>

                          {/* Category cards */}
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-[var(--text-secondary)] font-mono uppercase tracking-wider">Category</label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                              {CATEGORIES.filter(c => !c.includes('PwD')).map(c => {
                                const isSelected = data.category === c;
                                return (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => updateData('category', c)}
                                    className={`p-2.5 rounded-xs text-center font-mono text-[10px] transition-all duration-150 border cursor-pointer hover:border-brand/40 ${
                                      isSelected
                                        ? 'border-brand bg-brand-dim text-brand'
                                        : 'border-white/10 bg-bg-base/60 text-text-secondary'
                                    }`}
                                  >
                                    {c}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* PwD toggle */}
                          <div className="flex items-center gap-3 bg-bg-base/40 border border-white/5 p-3 rounded-xs">
                            <button
                              type="button"
                              onClick={() => updateData('pwdStatus', !data.pwdStatus)}
                              className={`w-10 h-5 rounded-full transition-all duration-150 relative cursor-pointer ${
                                data.pwdStatus ? 'bg-brand' : 'bg-white/10'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full absolute top-0.5 transition-all duration-150 ${
                                data.pwdStatus ? 'bg-bg-base left-5' : 'bg-text-secondary left-0.5'
                              }`} />
                            </button>
                            <span className="text-xs text-[var(--text-secondary)] font-mono">Person with Disability (PwD) Status</span>
                          </div>

                          {/* Gender pool */}
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-[var(--text-secondary)] font-mono uppercase tracking-wider">Gender Pool</label>
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
                                    className={`p-3 rounded-xs text-center font-mono text-[10px] transition-all duration-150 border cursor-pointer hover:border-brand/40 ${
                                      isSelected
                                        ? 'border-brand bg-brand-dim text-brand'
                                        : 'border-white/10 bg-bg-base/60 text-text-secondary'
                                    }`}
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
                          <h2 className="text-base font-semibold font-display text-white">Your Home State</h2>
                          <p className="text-text-secondary text-xs leading-relaxed">
                            This determines your Home State (HS) vs Other State (OS) quota for NITs and GFTIs. IITs use All India quota only.
                          </p>

                          <div className="relative">
                            <select
                              value={data.homeState}
                              onChange={e => updateData('homeState', e.target.value)}
                              className="w-full px-4 py-3 bg-bg-base border border-white/10 text-text-primary rounded-xs focus:outline-none focus:border-brand appearance-none cursor-pointer text-xs font-mono"
                            >
                              <option value="" className="bg-[#09090b]">SELECT STATE...</option>
                              {INDIAN_STATES.map(state => (
                                <option key={state} value={state} className="bg-[#09090b]">{state.toUpperCase()}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                          </div>

                          {data.homeState && (
                            <div className="p-3.5 rounded-xs border border-white/5 bg-white/[0.01] text-[10px] text-text-secondary font-mono leading-relaxed">
                              HS_QUOTA_APPLIED: NITs in {data.homeState} / OS_QUOTA_APPLIED: NITs elsewhere
                            </div>
                          )}
                        </div>
                      )}

                      {/* Step 4: Personalization Slider Preferences */}
                      {step === 4 && (
                        <div className="space-y-6">
                          <h2 className="text-base font-semibold font-display text-white">Configure Your Preferences</h2>
                          <p className="text-text-secondary text-xs leading-relaxed">
                            We use these weights to customize and sort your top recommendations.
                          </p>

                          {/* Presets */}
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-[var(--text-secondary)] font-mono uppercase tracking-wider">Presets</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {PREFERENCE_PRESETS.map(preset => (
                                <button
                                  key={preset.name}
                                  type="button"
                                  onClick={() => applyPreset(preset)}
                                  className="p-2.5 border border-white/10 hover:border-brand/40 rounded-xs text-left transition-all bg-bg-base/60 text-[10px] cursor-pointer"
                                >
                                  <span className="font-semibold block text-[11px] text-white font-display">{preset.name}</span>
                                  <span className="text-text-secondary line-clamp-1 mt-0.5 text-[9px]">{preset.description}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Sliders grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-2 max-h-52 overflow-y-auto pr-1">
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
                                <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-secondary)]">
                                  <span>{slider.label}</span>
                                  <span className="text-white font-semibold">{data.preferences[slider.key]}/10</span>
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
                          <h2 className="text-base font-semibold font-display text-white">Filter Branches & Institutes</h2>
                          <p className="text-text-secondary text-xs leading-relaxed">
                            Optionally narrow down choices by program branch and college type. Leave blank to see all matches.
                          </p>

                          {/* Institute types */}
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-[var(--text-secondary)] font-mono uppercase tracking-wider">Institute Types</label>
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
                                    className={`px-4 py-2 text-xs font-semibold transition-all border rounded-xs hover:border-brand/40 cursor-pointer ${
                                      isSelected
                                        ? 'border-brand bg-brand-dim text-brand'
                                        : 'border-white/10 bg-bg-base/60 text-text-secondary'
                                    }`}
                                  >
                                    {type}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Branch search & select */}
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-[var(--text-secondary)] font-mono uppercase tracking-wider">
                              Branches ({data.branches.length} selected)
                            </label>
                            <input
                              type="text"
                              value={branchSearch}
                              onChange={e => setBranchSearch(e.target.value)}
                              placeholder="Search branches..."
                              className="w-full px-4 py-2 bg-bg-base border border-white/10 text-text-primary rounded-xs focus:outline-none focus:border-brand text-xs font-mono"
                            />
                            <div className="max-h-36 overflow-y-auto space-y-1 rounded-xs border border-white/10 p-2 bg-bg-base/70">
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
                                    className={`w-full text-left px-3 py-1.5 rounded-xs text-xs transition-all hover:bg-white/5 cursor-pointer flex items-center justify-between ${
                                      isSelected
                                        ? 'bg-white/5 text-brand font-medium'
                                        : 'bg-transparent text-text-secondary'
                                    }`}
                                  >
                                    <span>{branch}</span>
                                    {isSelected && <Check className="w-3 h-3 text-brand" />}
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
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`btn-ghost ${step === 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>[ BACK ]</span>
              </button>

              {step < 5 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`btn-brand ${!canProceed() ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <span>[ NEXT_STEP ]</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-brand"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>COMPILE_RESULTS...</span>
                    </>
                  ) : (
                    <>
                      <span>[ RUN_PREDICTOR ]</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
