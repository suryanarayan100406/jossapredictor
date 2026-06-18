'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Share2, LayoutGrid, Table2,
  Edit2, Info, AlertTriangle, Check, SlidersHorizontal, X, Loader2, Compass, Sparkles,
} from 'lucide-react';
import { PredictionResult, FilterState } from '@/types';
import { ChanceCard } from '@/components/ChanceCard';
import { CompareDrawer } from '@/components/CompareDrawer';
import { FilterSidebar } from '@/components/FilterSidebar';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { Navbar } from '@/components/Navbar';
import { jsPDF } from 'jspdf';
import { RecommendationCard } from '@/components/RecommendationCard';
import { AIGuidancePanel } from '@/components/AIGuidancePanel';

const overlayMotion = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
const drawerMotion = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { type: 'spring', stiffness: 320, damping: 32 },
};

const GROUPS: Array<{ key: PredictionResult['chance']; label: string; dot: string }> = [
  { key: 'safe', label: 'Safe bets', dot: 'bg-safe' },
  { key: 'moderate', label: 'Worth a shot', dot: 'bg-moderate' },
  { key: 'ambitious', label: 'Reach colleges', dot: 'bg-ambitious' },
  { key: 'longshot', label: 'Long shots', dot: 'bg-ambitious' },
];

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rankStr = searchParams.get('rank') || '';
  const rankType = (searchParams.get('rankType') as 'advanced' | 'main') || 'main';
  const category = searchParams.get('category') || 'OPEN';
  const pwdStatus = searchParams.get('pwdStatus') === 'true';
  const gender = searchParams.get('gender') || 'Gender-Neutral';
  const homeState = searchParams.get('homeState') || '';
  const yearStr = searchParams.get('year') || '2025';
  const branchesParam = searchParams.get('branches') || '';
  const instituteTypesParam = searchParams.get('instituteTypes') || '';

  const branches = branchesParam ? branchesParam.split(',') : [];
  const instituteTypes = instituteTypesParam ? instituteTypesParam.split(',') : [];
  const year = parseInt(yearStr) || 2025;
  const rank = parseInt(rankStr) || 0;

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [alternatives, setAlternatives] = useState<PredictionResult[]>([]);
  const [disclaimer, setDisclaimer] = useState('');
  const [error, setError] = useState('');

  const preferencesStr = searchParams.get('preferences') || '';
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [guidance, setGuidance] = useState<any | null>(null);
  const [recLoading, setRecLoading] = useState(false);
  const [showClassic, setShowClassic] = useState(!preferencesStr);

  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');
  const [compareList, setCompareList] = useState<any[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    instituteTypes: [],
    states: [],
    chances: [],
    branches: [],
    sortBy: 'probability',
    sortOrder: 'desc',
  });

  useEffect(() => {
    if (!rank || !category || !gender || !homeState) {
      setError('Some details are missing. Please start over.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const payload = { rank, rankType, category, pwdStatus, gender, homeState, branches, instituteTypes, year };

    const fetchClassic = fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to predict colleges');
      }
      return res.json();
    });

    if (preferencesStr) {
      setRecLoading(true);
      let parsedPrefs;
      try {
        parsedPrefs = JSON.parse(preferencesStr);
      } catch (e) {
        setError('Invalid preferences format.');
        setLoading(false);
        return;
      }

      const fetchRecs = fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, preferences: parsedPrefs }),
      }).then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to generate recommendations');
        }
        return res.json();
      });

      Promise.all([fetchRecs, fetchClassic])
        .then(([recData, classicData]) => {
          setRecommendations(recData.recommendations || []);
          setResults(classicData.results || []);
          setAlternatives(classicData.alternatives || []);
          setDisclaimer(recData.disclaimer || classicData.disclaimer || '');

          return fetch('/api/guidance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              rank, rankType, category, homeState,
              preferences: parsedPrefs,
              recommendations: recData.recommendations || [],
            }),
          });
        })
        .then(async (res) => {
          if (res && res.ok) {
            const guidanceData = await res.json();
            setGuidance(guidanceData);
          }
        })
        .catch((err) => {
          setError(err.message || 'Something went wrong while fetching recommendations.');
        })
        .finally(() => {
          setLoading(false);
          setRecLoading(false);
        });
    } else {
      fetchClassic
        .then((data) => {
          setResults(data.results || []);
          setAlternatives(data.alternatives || []);
          setDisclaimer(data.disclaimer || '');
        })
        .catch((err) => {
          setError(err.message || 'Something went wrong while fetching predictions.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [rank, rankType, category, pwdStatus, gender, homeState, branchesParam, instituteTypesParam, year, preferencesStr]);

  const allStates = Array.from(new Set(results.map((r) => r.instituteState))).sort();
  const allBranches = Array.from(new Set(results.map((r) => r.branch))).sort();

  const handleResetFilters = () => {
    setFilters({
      search: '', instituteTypes: [], states: [], chances: [], branches: [],
      sortBy: 'probability', sortOrder: 'desc',
    });
  };

  const handleCompareToggle = (result: PredictionResult) => {
    setCompareList((prev) => {
      const exists = prev.find((item) => item.id === result.id);
      if (exists) return prev.filter((item) => item.id !== result.id);
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 colleges at a time.');
        return prev;
      }
      return [...prev, result];
    });
  };

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont('Helvetica', 'normal');

    doc.setFontSize(22);
    doc.setTextColor(24, 33, 58);
    doc.text('RankScope JoSAA Admission Report 2026', 14, 24);

    doc.setFontSize(10);
    doc.setTextColor(110, 119, 140);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}  |  Target Year: ${year}`, 14, 30);
    doc.line(14, 34, 196, 34);

    doc.setFontSize(11);
    doc.setTextColor(24, 33, 58);
    doc.setFont('Helvetica', 'bold');
    doc.text('Student Profile:', 14, 42);

    doc.setFont('Helvetica', 'normal');
    doc.text(`Rank: ${rank.toLocaleString('en-IN')} (${rankType === 'advanced' ? 'JEE Advanced' : 'JEE Main'})`, 14, 48);
    doc.text(`Category: ${category} ${pwdStatus ? '(PwD)' : ''}`, 14, 54);
    doc.text(`Gender: ${gender}  |  Home State: ${homeState}`, 14, 60);

    doc.line(14, 66, 196, 66);

    doc.setFont('Helvetica', 'bold');
    doc.text(`Predicted Matches (Total: ${filteredResults.length})`, 14, 74);

    let y = 82;
    doc.setFontSize(9);

    const visibleResults = filteredResults.slice(0, 30);
    visibleResults.forEach((item, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFillColor(243, 246, 252);
      doc.rect(14, y, 182, 22, 'F');

      doc.setTextColor(24, 33, 58);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${index + 1}. ${item.instituteName}`, 16, y + 6);

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(110, 119, 140);
      doc.text(`${item.branch} | Quota: ${item.quota}`, 16, y + 12);
      doc.text(`Closing Cutoff: ${item.closingRank.toLocaleString('en-IN')} | Probability: ${item.probability}%`, 16, y + 18);

      doc.setFont('Helvetica', 'bold');
      if (item.chance === 'safe') {
        doc.setTextColor(22, 163, 74);
        doc.text('SAFE', 165, y + 12);
      } else if (item.chance === 'moderate') {
        doc.setTextColor(234, 146, 9);
        doc.text('MODERATE', 160, y + 12);
      } else if (item.chance === 'ambitious') {
        doc.setTextColor(239, 68, 68);
        doc.text('AMBITIOUS', 160, y + 12);
      } else {
        doc.setTextColor(239, 68, 68);
        doc.text('LONG SHOT', 160, y + 12);
      }

      y += 26;
    });

    if (filteredResults.length > 30) {
      doc.setTextColor(140, 148, 168);
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(9);
      doc.text(`* Showing top 30 of ${filteredResults.length} predicted matches.`, 14, y + 4);
    }

    doc.save(`rankscope-predictions-${rank}.pdf`);
  };

  const filteredResults = results
    .filter((item) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const instMatch = item.instituteName.toLowerCase().includes(query);
        const branchMatch = item.branch.toLowerCase().includes(query);
        if (!instMatch && !branchMatch) return false;
      }
      if (filters.instituteTypes.length > 0 && !filters.instituteTypes.includes(item.instituteType)) return false;
      if (filters.states.length > 0 && !filters.states.includes(item.instituteState)) return false;
      if (filters.chances.length > 0 && !filters.chances.includes(item.chance)) return false;
      if (filters.branches.length > 0 && !filters.branches.includes(item.branch)) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'probability') comparison = a.probability - b.probability;
      else if (filters.sortBy === 'closingRank') comparison = a.closingRank - b.closingRank;
      else if (filters.sortBy === 'instituteName') comparison = a.instituteName.localeCompare(b.instituteName);
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

  const grouped: Record<string, PredictionResult[]> = {
    safe: filteredResults.filter((r) => r.chance === 'safe'),
    moderate: filteredResults.filter((r) => r.chance === 'moderate'),
    ambitious: filteredResults.filter((r) => r.chance === 'ambitious'),
    longshot: filteredResults.filter((r) => r.chance === 'longshot'),
  };

  const tierCount = (k: string) => grouped[k]?.length || 0;

  const chanceTextClass = (chance: string) =>
    chance === 'safe' ? 'text-safe-text bg-safe-bg'
      : chance === 'moderate' ? 'text-moderate-text bg-moderate-bg'
        : 'text-ambitious-text bg-ambitious-bg';

  return (
    <main className="min-h-screen bg-bg-base text-text-primary relative pb-32">
      <div className="premium-grid" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative pt-8">

        {/* Friendly summary header */}
        <header className="w-full surface-elevated mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-border-subtle">
            <div className="space-y-3 pb-5 md:pb-0 md:pr-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand">
                <Sparkles className="w-3.5 h-3.5" /> Your profile
              </div>
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-text-primary leading-none font-display">
                  {rank.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-text-muted uppercase font-bold">
                  {rankType === 'advanced' ? 'Advanced' : 'Main'} CRL
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[`${category}${pwdStatus ? ' (PwD)' : ''}`, gender.split(' ')[0], `${homeState} (home)`].map((chip) => (
                  <span key={chip} className="bg-bg-base border border-border-default text-text-secondary px-2.5 py-1 rounded-full font-semibold">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-3 py-5 md:py-0 md:px-6">
              <span className="text-xs font-bold text-brand">Colleges matched</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-text-primary leading-none font-display">
                  {filteredResults.length}
                </span>
                <span className="text-sm text-text-secondary">programs</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-semibold">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-safe" /><span className="text-text-secondary">Safe {tierCount('safe')}</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-moderate" /><span className="text-text-secondary">Worth a shot {tierCount('moderate')}</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-ambitious" /><span className="text-text-secondary">Reach {tierCount('ambitious')}</span></div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-2 pt-5 md:pt-0 md:pl-6">
              <button onClick={handleShare}
                className={`btn-ghost justify-center w-full ${shareCopied ? 'text-safe-text border-safe-border bg-safe-bg' : ''}`}>
                {shareCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{shareCopied ? 'Link copied!' : 'Share'}</span>
              </button>
              <button onClick={handleDownloadPDF} className="btn-ghost justify-center w-full">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <button onClick={() => router.push('/predict')} className="btn-brand justify-center w-full">
                <Edit2 className="w-4 h-4" />
                <span>Edit details</span>
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3 justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-brand" />
              <span className="text-sm text-text-secondary">Crunching the latest cutoffs...</span>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="surface-elevated p-5 flex justify-between items-center">
                <div className="space-y-3 flex-1">
                  <div className="skeleton h-3 w-1/4" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-3 w-1/3" />
                </div>
                <div className="skeleton w-20 h-12" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-20 space-y-4 surface-elevated p-8">
            <AlertTriangle className="w-9 h-9 text-ambitious mx-auto" />
            <h3 className="font-bold text-text-primary text-lg font-display">Something went wrong</h3>
            <p className="text-sm text-text-secondary">{error}</p>
            <button onClick={() => router.push('/predict')} className="btn-brand mx-auto">Go back</button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Recommendations */}
            {preferencesStr && (
              <div className="space-y-6">
                {recLoading ? (
                  <div className="flex items-center gap-3 justify-center py-12 surface-elevated">
                    <Loader2 className="w-5 h-5 animate-spin text-brand" />
                    <span className="text-sm text-text-secondary">Personalizing your matches...</span>
                  </div>
                ) : (
                  <>
                    {guidance && <AIGuidancePanel guidance={guidance} />}

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-border-default pb-2">
                        <Compass className="w-5 h-5 text-brand" />
                        <h3 className="text-lg font-bold text-text-primary font-display">Your top matches</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {recommendations.map((rec, idx) => (
                          <RecommendationCard
                            key={`rec-${rec.id}`}
                            recommendation={rec}
                            index={idx}
                            onCompareToggle={handleCompareToggle}
                            isCompared={!!compareList.find((c) => c.id === rec.id)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center pt-2">
                      <button onClick={() => setShowClassic(!showClassic)} className="btn-ghost">
                        {showClassic ? 'Hide all seat options' : `Explore all ${results.length} matching seats`}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Classic view */}
            {showClassic && (
              <div className="flex flex-col lg:flex-row gap-8 items-start pt-6 border-t border-border-default border-dashed">
                <div className="hidden lg:block">
                  <FilterSidebar
                    filters={filters}
                    onChange={setFilters}
                    availableStates={allStates}
                    availableBranches={allBranches}
                    onReset={handleResetFilters}
                  />
                </div>

                <div className="lg:hidden w-full flex items-center justify-between gap-4 border-b border-border-default pb-4 mb-2">
                  <button onClick={() => setShowMobileFilters(true)} className="btn-ghost w-full justify-center">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filter & sort</span>
                  </button>
                </div>

                <AnimatePresence>
                  {showMobileFilters && (
                    <motion.div {...overlayMotion}
                      className="fixed inset-0 z-50 bg-text-primary/30 backdrop-blur-sm lg:hidden flex justify-end">
                      <motion.div {...drawerMotion}
                        className="w-full max-w-sm bg-bg-surface border-l border-border-default p-6 overflow-y-auto h-full flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-text-primary text-lg font-display">Filter & sort</h2>
                            <button onClick={() => setShowMobileFilters(false)} className="text-text-muted hover:text-text-primary p-1 cursor-pointer">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <FilterSidebar
                            filters={filters}
                            onChange={setFilters}
                            availableStates={allStates}
                            availableBranches={allBranches}
                            onReset={handleResetFilters}
                          />
                        </div>
                        <button onClick={() => setShowMobileFilters(false)} className="w-full mt-6 btn-brand justify-center">
                          Apply filters
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex-1 w-full space-y-6">
                  {disclaimer && (
                    <div className="flex items-start gap-3 rounded-2xl bg-brand-dim border border-border-default p-4 text-sm text-text-secondary">
                      <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                      <p>{disclaimer}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-secondary">
                      <span className="text-text-primary font-bold">{filteredResults.length}</span> matches
                    </p>
                    <div className="flex items-center gap-1 bg-bg-elevated border border-border-default rounded-full p-1">
                      <button onClick={() => setViewMode('grouped')}
                        className={`p-2 rounded-full transition-colors cursor-pointer ${viewMode === 'grouped' ? 'bg-brand text-white' : 'text-text-muted hover:text-text-primary'}`}
                        title="Grouped cards">
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button onClick={() => setViewMode('table')}
                        className={`p-2 rounded-full transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-brand text-white' : 'text-text-muted hover:text-text-primary'}`}
                        title="Table">
                        <Table2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {filteredResults.length === 0 ? (
                    <div className="text-center py-20 surface-elevated p-8 space-y-4">
                      <AlertTriangle className="w-9 h-9 text-moderate mx-auto" />
                      <h3 className="font-bold text-text-primary text-lg font-display">No matches found</h3>
                      <p className="text-sm text-text-secondary max-w-sm mx-auto">
                        Try widening your institute types or branches in the filters, or tweak your rank details.
                      </p>
                      <button onClick={handleResetFilters} className="btn-ghost mx-auto">Clear all filters</button>
                    </div>
                  ) : viewMode === 'grouped' ? (
                    <div className="space-y-8">
                      {GROUPS.map((group) => {
                        const items = grouped[group.key];
                        if (!items || items.length === 0) return null;
                        return (
                          <div key={group.key} className="space-y-4">
                            <div className="flex items-center gap-2.5 mb-1">
                              <span className={`w-2.5 h-2.5 rounded-full ${group.dot}`} />
                              <span className="font-display font-bold text-base text-text-primary">{group.label}</span>
                              <span className="text-sm text-text-muted font-semibold">({items.length})</span>
                              <div className="flex-1 h-px bg-border-default" />
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              {items.map((item) => (
                                <ChanceCard
                                  key={item.id}
                                  result={item}
                                  isCompared={!!compareList.find((c) => c.id === item.id)}
                                  onCompareToggle={() => handleCompareToggle(item)}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="surface-elevated overflow-x-auto">
                      <div className="p-2 sm:p-4">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-border-default text-xs font-bold text-text-muted uppercase tracking-wide">
                              <th className="px-5 py-3.5">College & branch</th>
                              <th className="px-4 py-3.5 text-center">Type</th>
                              <th className="px-4 py-3.5 text-center">Quota</th>
                              <th className="px-4 py-3.5 text-right">Closing rank</th>
                              <th className="px-4 py-3.5 text-center">Chance</th>
                              <th className="px-4 py-3.5 text-center">Probability</th>
                              <th className="px-5 py-3.5 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-subtle">
                            {filteredResults.map((item) => {
                              const isCompared = !!compareList.find((c) => c.id === item.id);
                              return (
                                <tr key={item.id} className="hover:bg-bg-base transition-colors">
                                  <td className="px-5 py-4">
                                    <span className="font-bold text-text-primary block">{item.instituteName}</span>
                                    <span className="text-xs text-text-secondary block mt-0.5">{item.branch}</span>
                                    <span className="text-[11px] text-text-muted block mt-0.5">{item.instituteCity ? `${item.instituteCity}, ` : ''}{item.instituteState}</span>
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <span className="inline-block text-xs font-bold text-text-secondary bg-bg-base border border-border-default rounded-full px-2.5 py-1">{item.instituteType}</span>
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <span className="inline-block text-xs font-semibold text-text-secondary bg-bg-base border border-border-default rounded-full px-2.5 py-1">{item.quota}</span>
                                  </td>
                                  <td className="px-4 py-4 text-right font-bold text-text-primary">
                                    {item.closingRank.toLocaleString('en-IN')}
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <span className={`inline-block text-xs font-bold capitalize rounded-full px-2.5 py-1 ${chanceTextClass(item.chance)}`}>
                                      {item.chance}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 text-center font-bold text-text-primary">
                                    {item.probability}%
                                  </td>
                                  <td className="px-5 py-4 text-center">
                                    <button onClick={() => handleCompareToggle(item)}
                                      className={`text-xs font-bold rounded-full px-3 py-1.5 border transition-all cursor-pointer ${isCompared ? 'bg-brand-dim border-brand text-brand' : 'bg-bg-elevated border-border-default text-text-secondary hover:border-brand hover:text-brand'}`}>
                                      {isCompared ? 'Added' : 'Compare'}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {alternatives.length > 0 && (
                    <div className="mt-12 space-y-4 pt-8 border-t border-border-default">
                      <h3 className="font-bold text-text-primary text-lg flex items-center gap-2 font-display">
                        <span>💡 Nearby options worth a look</span>
                      </h3>
                      <p className="text-sm text-text-secondary">
                        These sit just outside your filters or branches but have similar cutoffs.
                      </p>
                      <div className="grid grid-cols-1 gap-4">
                        {alternatives.map((item) => (
                          <ChanceCard
                            key={`alt-${item.id}`}
                            result={item}
                            isCompared={!!compareList.find((c) => c.id === item.id)}
                            onCompareToggle={() => handleCompareToggle(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <CompareDrawer
        selectedItems={compareList}
        onRemove={(id) => setCompareList((prev) => prev.filter((c) => c.id !== id))}
        onClear={() => setCompareList([])}
      />

      <FeedbackWidget />
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-bg-base min-h-screen text-text-primary">
        <Loader2 className="w-7 h-7 animate-spin text-brand" />
        <p className="text-sm text-text-secondary">Loading your results...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
