'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, ArrowLeft, Download, Share2, Grid, Table,
  Edit2, Info, AlertTriangle, Check, SlidersHorizontal, ArrowUpDown, X
} from 'lucide-react';
import { PredictionResult, FilterState } from '@/types';
import { ChanceCard } from '@/components/ChanceCard';
import { CompareDrawer } from '@/components/CompareDrawer';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { jsPDF } from 'jspdf';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Query parameters
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

  // Prediction State
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [alternatives, setAlternatives] = useState<PredictionResult[]>([]);
  const [disclaimer, setDisclaimer] = useState('');
  const [error, setError] = useState('');

  // UI state
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');
  const [compareList, setCompareList] = useState<PredictionResult[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Filter & Sort State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    instituteTypes: [],
    states: [],
    chances: [],
    branches: [],
    sortBy: 'probability',
    sortOrder: 'desc',
  });

  // Fetch results from API
  useEffect(() => {
    if (!rank || !category || !gender || !homeState) {
      setError('Missing search parameters. Please start over.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rank,
        rankType,
        category,
        pwdStatus,
        gender,
        homeState,
        branches,
        instituteTypes,
        year,
      }),
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to predict colleges');
        }
        return res.json();
      })
      .then(data => {
        setResults(data.results || []);
        setAlternatives(data.alternatives || []);
        setDisclaimer(data.disclaimer || '');
      })
      .catch(err => {
        setError(err.message || 'Something went wrong while fetching predictions.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rank, rankType, category, pwdStatus, gender, homeState, branchesParam, instituteTypesParam, year]);

  // Derived filter list options
  const allStates = Array.from(new Set(results.map(r => r.instituteState))).sort();
  const allBranches = Array.from(new Set(results.map(r => r.branch))).sort();

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      instituteTypes: [],
      states: [],
      chances: [],
      branches: [],
      sortBy: 'probability',
      sortOrder: 'desc',
    });
  };

  // Compare functions
  const handleCompareToggle = (result: PredictionResult) => {
    setCompareList(prev => {
      const exists = prev.find(item => item.id === result.id);
      if (exists) {
        return prev.filter(item => item.id !== result.id);
      }
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

  // PDF Export
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont('Helvetica', 'normal');

    // Title
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241); // Indigo color
    doc.text('2026 College Predictor (JoSAA) Report', 14, 24);

    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}  |  Target Year: ${year}`, 14, 30);
    doc.line(14, 34, 196, 34);

    // Student details
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.text('Student Profile:', 14, 42);
    
    doc.setFont('Helvetica', 'normal');
    doc.text(`Rank: ${rank.toLocaleString('en-IN')} (${rankType === 'advanced' ? 'JEE Advanced' : 'JEE Main'})`, 14, 48);
    doc.text(`Category: ${category} ${pwdStatus ? '(PwD)' : ''}`, 14, 54);
    doc.text(`Gender: ${gender}  |  Home State: ${homeState}`, 14, 60);

    doc.line(14, 66, 196, 66);

    // Predictions Header
    doc.setFont('Helvetica', 'bold');
    doc.text(`Admission Predictions (Total Matches: ${filteredResults.length})`, 14, 74);

    let y = 82;
    doc.setFontSize(9);

    // Draw prediction items
    const visibleResults = filteredResults.slice(0, 30); // limit to 30 for PDF length safety
    visibleResults.forEach((item, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      // Border box background
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 22, 'F');
      
      // Text drawing
      doc.setTextColor(15, 23, 42);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${index + 1}. ${item.instituteName}`, 16, y + 6);
      
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`${item.branch} | Quota: ${item.quota}`, 16, y + 12);
      doc.text(`Closing Cutoff: ${item.closingRank.toLocaleString('en-IN')} | Probability: ${item.probability}%`, 16, y + 18);

      // Chance label in right side box
      doc.setFont('Helvetica', 'bold');
      if (item.chance === 'safe') {
        doc.setTextColor(16, 185, 129);
        doc.text('✅ SAFE', 165, y + 12);
      } else if (item.chance === 'moderate') {
        doc.setTextColor(245, 158, 11);
        doc.text('⚡ MODERATE', 160, y + 12);
      } else if (item.chance === 'ambitious') {
        doc.setTextColor(239, 68, 68);
        doc.text('🔥 AMBITIOUS', 160, y + 12);
      } else {
        doc.setTextColor(107, 114, 128);
        doc.text('🎯 LONG SHOT', 160, y + 12);
      }

      y += 26;
    });

    if (filteredResults.length > 30) {
      doc.setTextColor(100, 116, 139);
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(9);
      doc.text(`* Showing top 30 of ${filteredResults.length} predicted matches.`, 14, y + 4);
    }

    doc.save(`college-predictions-${rank}.pdf`);
  };

  // Filter and sort computation
  const filteredResults = results
    .filter(item => {
      // Search term match
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const instMatch = item.instituteName.toLowerCase().includes(query);
        const branchMatch = item.branch.toLowerCase().includes(query);
        if (!instMatch && !branchMatch) return false;
      }

      // Institute Type match
      if (filters.instituteTypes.length > 0) {
        if (!filters.instituteTypes.includes(item.instituteType)) return false;
      }

      // State match
      if (filters.states.length > 0) {
        if (!filters.states.includes(item.instituteState)) return false;
      }

      // Chance band match
      if (filters.chances.length > 0) {
        if (!filters.chances.includes(item.chance)) return false;
      }

      // Branch match
      if (filters.branches.length > 0) {
        if (!filters.branches.includes(item.branch)) return false;
      }

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'probability') {
        comparison = a.probability - b.probability;
      } else if (filters.sortBy === 'closingRank') {
        comparison = a.closingRank - b.closingRank;
      } else if (filters.sortBy === 'instituteName') {
        comparison = a.instituteName.localeCompare(b.instituteName);
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

  // Split results for grouped view
  const safeColleges = filteredResults.filter(r => r.chance === 'safe');
  const moderateColleges = filteredResults.filter(r => r.chance === 'moderate');
  const ambitiousColleges = filteredResults.filter(r => r.chance === 'ambitious');
  const longshotsColleges = filteredResults.filter(r => r.chance === 'longshot');

  return (
    <main className="min-h-screen pb-32">
      {/* Navigation Header */}
      <nav className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push('/predict')}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Edit Search</span>
          </button>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={handleShare}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                shareCopied
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <Check className={`w-3.5 h-3.5 transition-transform ${shareCopied ? 'scale-100' : 'scale-0'}`} />
              <span>{shareCopied ? 'Link Copied!' : 'Share Results'}</span>
              {!shareCopied && <Share2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all cursor-pointer shadow-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Top Banner showing profile summary */}
      <header className="bg-gradient-to-r from-[#0f0f1b] via-[#15152a] to-[#0f0f1b] border-b border-white/5 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-extrabold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>JEE Admission Predictions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Predictions for Rank <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{rank.toLocaleString('en-IN')}</span>
            </h1>
            <div className="flex flex-wrap gap-2 text-sm text-gray-400">
              <span className="bg-white/5 border border-white/5 px-3 py-1 rounded-xl font-bold">
                {rankType === 'advanced' ? 'JEE Advanced' : 'JEE Main'} (CRL)
              </span>
              <span className="bg-white/5 border border-white/5 px-3 py-1 rounded-xl font-bold">
                Category: {category} {pwdStatus ? '(PwD)' : ''}
              </span>
              <span className="bg-white/5 border border-white/5 px-3 py-1 rounded-xl font-bold">
                Pool: {gender}
              </span>
              <span className="bg-white/5 border border-white/5 px-3 py-1 rounded-xl font-bold">
                Home State: {homeState}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/predict')}
              className="flex items-center gap-2 border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
              <span>Modify Ranks</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main predictions section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"
            />
            <p className="text-gray-400 font-semibold">Analyzing cutoffs and computing admission chances...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-20 space-y-4 bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
            <h3 className="font-bold text-white text-lg">Failed to predict</h3>
            <p className="text-sm text-gray-400">{error}</p>
            <button
              onClick={() => router.push('/predict')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm cursor-pointer"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block">
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                availableStates={allStates}
                availableBranches={allBranches}
                onReset={handleResetFilters}
              />
            </div>

            {/* Mobile filters toggler */}
            <div className="lg:hidden w-full flex items-center justify-between gap-4 border-b border-white/5 pb-4 mb-2">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 border border-white/10 bg-white/5 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold w-full justify-center cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                <span>Filter & Sort Predictions</span>
              </button>
            </div>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end"
                >
                  <motion.div
                    initial={{ x: 300 }}
                    animate={{ x: 0 }}
                    exit={{ x: 300 }}
                    className="w-full max-w-sm bg-[#0a0a0f] border-l border-white/10 p-6 overflow-y-auto h-full flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-white text-lg">Filters & Sort</h2>
                        <button
                          onClick={() => setShowMobileFilters(false)}
                          className="text-gray-400 hover:text-white p-1 cursor-pointer"
                        >
                          <X className="w-6 h-6" />
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
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 rounded-xl text-sm cursor-pointer"
                    >
                      Apply Filters
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Grid / Table */}
            <div className="flex-1 w-full space-y-6">
              
              {/* Disclaimer */}
              {disclaimer && (
                <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/5 p-4 text-xs text-gray-400">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p>{disclaimer}</p>
                </div>
              )}

              {/* View toggle & match count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400 font-semibold">
                  Found <span className="text-white font-bold">{filteredResults.length}</span> matching option(s)
                </p>
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grouped')}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'grouped' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Grouped Cards"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'table' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Data Table"
                  >
                    <Table className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {filteredResults.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl p-8 space-y-4">
                  <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
                  <h3 className="font-bold text-white text-lg">No matches found</h3>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto">
                    Try checking other institute types or adding more branches in the filters. Alternatively, try modifying your rank search parameters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-lg bg-indigo-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : viewMode === 'grouped' ? (
                /* Grouped Card View */
                <div className="space-y-8">
                  {/* Safe Colleges */}
                  {safeColleges.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <h2 className="font-bold text-white text-lg">Safe Options ({safeColleges.length})</h2>
                        <span className="text-xs text-gray-400 font-semibold">— High probability of admission</span>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {safeColleges.map(item => (
                          <ChanceCard
                            key={item.id}
                            result={item}
                            isCompared={!!compareList.find(c => c.id === item.id)}
                            onCompareToggle={() => handleCompareToggle(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Moderate Colleges */}
                  {moderateColleges.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <h2 className="font-bold text-white text-lg">Moderate Options ({moderateColleges.length})</h2>
                        <span className="text-xs text-gray-400 font-semibold">— Fairly good probability of admission</span>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {moderateColleges.map(item => (
                          <ChanceCard
                            key={item.id}
                            result={item}
                            isCompared={!!compareList.find(c => c.id === item.id)}
                            onCompareToggle={() => handleCompareToggle(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ambitious Colleges */}
                  {ambitiousColleges.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <h2 className="font-bold text-white text-lg">Ambitious Options ({ambitiousColleges.length})</h2>
                        <span className="text-xs text-gray-400 font-semibold">— High stretch, low probability</span>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {ambitiousColleges.map(item => (
                          <ChanceCard
                            key={item.id}
                            result={item}
                            isCompared={!!compareList.find(c => c.id === item.id)}
                            onCompareToggle={() => handleCompareToggle(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Long Shot Colleges */}
                  {longshotsColleges.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                        <h2 className="font-bold text-white text-lg">Long Shot Options ({longshotsColleges.length})</h2>
                        <span className="text-xs text-gray-400 font-semibold">— Highly unlikely, but close to cutoff thresholds</span>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {longshotsColleges.map(item => (
                          <ChanceCard
                            key={item.id}
                            result={item}
                            isCompared={!!compareList.find(c => c.id === item.id)}
                            onCompareToggle={() => handleCompareToggle(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Table View */
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#12121a]/60 backdrop-blur-md">
                  <table className="w-full border-collapse text-left text-sm text-gray-300">
                    <thead className="border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-white">
                      <tr>
                        <th className="px-6 py-4">College Details</th>
                        <th className="px-4 py-4 text-center">Type</th>
                        <th className="px-4 py-4 text-center">Quota</th>
                        <th className="px-4 py-4 text-right">Closing Cutoff</th>
                        <th className="px-4 py-4 text-center">Chance</th>
                        <th className="px-4 py-4 text-center">Probability</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredResults.map(item => {
                        const isCompared = !!compareList.find(c => c.id === item.id);
                        return (
                          <tr key={item.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-bold text-white block">{item.instituteName}</span>
                              <span className="text-xs text-gray-400 block mt-0.5">{item.branch}</span>
                              <span className="text-[10px] text-gray-500 block mt-0.5">{item.instituteCity ? `${item.instituteCity}, ` : ''}{item.instituteState}</span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-white/10 text-white uppercase">
                                {item.instituteType}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/10 text-indigo-400 uppercase">
                                {item.quota}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right font-bold text-white">
                              {item.closingRank.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className={`text-xs font-bold uppercase ${
                                item.chance === 'safe'
                                  ? 'text-emerald-400'
                                  : item.chance === 'moderate'
                                  ? 'text-amber-400'
                                  : item.chance === 'ambitious'
                                  ? 'text-red-400'
                                  : 'text-gray-400'
                              }`}>
                                {item.chance}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center font-bold text-white">
                              {item.probability}%
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleCompareToggle(item)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  isCompared
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                {isCompared ? 'Added' : 'Compare'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Alternatives Section (if user didn't get many safe options) */}
              {alternatives.length > 0 && (
                <div className="mt-12 space-y-4 pt-8 border-t border-white/5">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <span>💡 Alternative Options Nearby (Outside Preference Filters)</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    These are colleges just outside your rank filters or branches that might interest you with nearby cutoffs.
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {alternatives.map(item => (
                      <ChanceCard
                        key={`alt-${item.id}`}
                        result={item}
                        isCompared={!!compareList.find(c => c.id === item.id)}
                        onCompareToggle={() => handleCompareToggle(item)}
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </section>

      {/* Compare Drawer */}
      <CompareDrawer
        selectedItems={compareList}
        onRemove={(id) => setCompareList(prev => prev.filter(c => c.id !== id))}
        onClear={() => setCompareList([])}
      />

      <FeedbackWidget />
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 font-semibold">Loading prediction details...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
