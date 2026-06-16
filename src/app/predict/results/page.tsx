'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, Share2, LayoutGrid, Table2,
  Edit2, Info, AlertTriangle, Check, SlidersHorizontal, X, Loader2
} from 'lucide-react';
import { PredictionResult, FilterState } from '@/types';
import { ChanceCard } from '@/components/ChanceCard';
import { CompareDrawer } from '@/components/CompareDrawer';
import { FilterSidebar } from '@/components/FilterSidebar';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { Navbar } from '@/components/Navbar';
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
    doc.setTextColor(244, 244, 245); 
    doc.text('RankScope JoSAA Admission Report 2026', 14, 24);

    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(161, 161, 170);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}  |  Target Year: ${year}`, 14, 30);
    doc.line(14, 34, 196, 34);

    // Student details
    doc.setFontSize(11);
    doc.setTextColor(244, 244, 245);
    doc.setFont('Helvetica', 'bold');
    doc.text('Student Profile:', 14, 42);
    
    doc.setFont('Helvetica', 'normal');
    doc.text(`Rank: ${rank.toLocaleString('en-IN')} (${rankType === 'advanced' ? 'JEE Advanced' : 'JEE Main'})`, 14, 48);
    doc.text(`Category: ${category} ${pwdStatus ? '(PwD)' : ''}`, 14, 54);
    doc.text(`Gender: ${gender}  |  Home State: ${homeState}`, 14, 60);

    doc.line(14, 66, 196, 66);

    // Predictions Header
    doc.setFont('Helvetica', 'bold');
    doc.text(`Predicted Matches (Total: ${filteredResults.length})`, 14, 74);

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
      doc.setFillColor(24, 24, 27);
      doc.rect(14, y, 182, 22, 'F');
      
      // Text drawing
      doc.setTextColor(244, 244, 245);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${index + 1}. ${item.instituteName}`, 16, y + 6);
      
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(161, 161, 170);
      doc.text(`${item.branch} | Quota: ${item.quota}`, 16, y + 12);
      doc.text(`Closing Cutoff: ${item.closingRank.toLocaleString('en-IN')} | Probability: ${item.probability}%`, 16, y + 18);

      // Chance label in right side box
      doc.setFont('Helvetica', 'bold');
      if (item.chance === 'safe') {
        doc.setTextColor(16, 185, 129);
        doc.text('SAFE', 165, y + 12);
      } else if (item.chance === 'moderate') {
        doc.setTextColor(245, 158, 11);
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
      doc.setTextColor(82, 82, 91);
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(9);
      doc.text(`* Showing top 30 of ${filteredResults.length} predicted matches.`, 14, y + 4);
    }

    doc.save(`rankscope-predictions-${rank}.pdf`);
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
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] relative pb-32">
      <div className="premium-grid" />
      {/* Navbar Branding */}
      <Navbar />

      {/* Results Center Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative pt-10">
        
        {/* Command-center style header */}
        <header style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          marginBottom: '24px',
        }} className="w-full">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            {/* Left Block: Profile Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-muted)] tracking-wider">
                <span>PROFILE_READOUT</span>
              </div>
              
              <div className="flex flex-wrap items-baseline gap-x-4">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2.2rem', fontWeight: 500, color: 'var(--data-highlight)', lineHeight: 1 }}>
                  {rank.toLocaleString('en-IN')}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {rankType === 'advanced' ? 'JEE Advanced' : 'JEE Main'} CRL
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-[var(--text-secondary)]">
                <span style={{ background: 'var(--bg-base)', border: '1px solid var(--border-default)', padding: '3px 8px', borderRadius: 'var(--radius-xs)' }}>
                  {category} {pwdStatus ? '(PwD)' : ''}
                </span>
                <span style={{ background: 'var(--bg-base)', border: '1px solid var(--border-default)', padding: '3px 8px', borderRadius: 'var(--radius-xs)' }}>
                  {gender}
                </span>
                <span style={{ background: 'var(--bg-base)', border: '1px solid var(--border-default)', padding: '3px 8px', borderRadius: 'var(--radius-xs)' }}>
                  {homeState} (HS)
                </span>
              </div>
            </div>
            
            {/* Middle Block: Count & Tier Breakdown */}
            <div className="flex flex-col justify-center space-y-4 border-t md:border-t-0 md:border-l border-[var(--border-default)] pt-6 md:pt-0 md:pl-8">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-muted)] tracking-wider">
                <span>ADMISSION_MATCHES</span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 500, color: 'white', lineHeight: 1 }}>
                  {filteredResults.length}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>programs matched</span>
              </div>
              
              <div className="flex flex-wrap gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--safe)' }} />
                  <span className="text-[var(--text-secondary)]">Safe: {safeColleges.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--moderate)' }} />
                  <span className="text-[var(--text-secondary)]">Moderate: {moderateColleges.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ambitious)' }} />
                  <span className="text-[var(--text-secondary)]">Ambitious: {ambitiousColleges.length}</span>
                </div>
              </div>
            </div>

            {/* Right Block: Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch justify-center gap-2 border-t md:border-t-0 md:border-l border-[var(--border-default)] pt-6 md:pt-0 md:pl-8">
              <button
                onClick={handleShare}
                className={`btn-ghost text-xs justify-center ${shareCopied ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : ''}`}
              >
                <Check className={`w-3.5 h-3.5 transition-transform ${shareCopied ? 'scale-100' : 'scale-0'}`} />
                <span>{shareCopied ? 'Link Copied!' : 'Share Results'}</span>
                {!shareCopied && <Share2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="btn-ghost text-xs justify-center"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => router.push('/predict')}
                className="btn-brand text-xs justify-center"
                style={{ padding: '8px 16px' }}
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Modify Details</span>
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 justify-center py-6">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--text-secondary)]" />
              <span className="font-mono text-xs text-[var(--text-secondary)]">COMPILING_CUTOFF_DATA...</span>
            </div>
            
            {/* Minimal flat skeleton cards */}
            {[1, 2, 3].map(i => (
              <div key={i} className="surface p-5 flex justify-between items-center opacity-40 animate-pulse">
                <div className="space-y-3 flex-1">
                  <div className="h-3 bg-[var(--border-default)] rounded w-1/4" />
                  <div className="h-4 bg-[var(--border-default)] rounded w-1/2" />
                  <div className="h-3 bg-[var(--border-default)] rounded w-1/3" />
                </div>
                <div className="w-20 h-12 bg-[var(--border-default)] rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-20 space-y-4 surface p-8">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
            <h3 className="font-bold text-white text-base font-display">Execution Failed</h3>
            <p className="text-xs text-[var(--text-secondary)]">{error}</p>
            <button
              onClick={() => router.push('/predict')}
              className="btn-brand"
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
            <div className="lg:hidden w-full flex items-center justify-between gap-4 border-b border-[var(--border-default)] pb-4 mb-2">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="btn-ghost w-full justify-center"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter & Sort</span>
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
                    initial={{ x: 200 }}
                    animate={{ x: 0 }}
                    exit={{ x: 200 }}
                    className="w-full max-w-sm bg-[var(--bg-elevated)] border-l border-[var(--border-default)] p-6 overflow-y-auto h-full flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-white text-base font-display">Filters & Sort</h2>
                        <button
                          onClick={() => setShowMobileFilters(false)}
                          className="text-gray-400 hover:text-white p-1 cursor-pointer"
                        >
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
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full mt-6 btn-brand justify-center"
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
                <div className="flex items-start gap-3 rounded bg-[var(--bg-elevated)] border border-[var(--border-default)] p-4 text-xs text-[var(--text-secondary)]">
                  <Info className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
                  <p>{disclaimer}</p>
                </div>
              )}

              {/* View toggle & match count */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-[var(--text-secondary)] font-mono">
                  MATCHES: <span className="text-white font-bold">{filteredResults.length}</span>
                </p>
                <div className="flex items-center gap-1 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded p-1">
                  <button
                    onClick={() => setViewMode('grouped')}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      viewMode === 'grouped' ? 'bg-[var(--bg-active)] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Grouped Cards"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      viewMode === 'table' ? 'bg-[var(--bg-active)] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Data Table"
                  >
                    <Table2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {filteredResults.length === 0 ? (
                <div className="text-center py-20 surface p-8 space-y-4">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                  <h3 className="font-semibold text-white text-base font-display">No matches found</h3>
                  <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                    Try checking other institute types or adding more branches in the filters. Alternatively, try modifying your rank search parameters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="btn-ghost"
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--safe)' }} />
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-primary)' }}>Safe Admits</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>({safeColleges.length})</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--moderate)' }} />
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-primary)' }}>Moderate Admits</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>({moderateColleges.length})</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ambitious)' }} />
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-primary)' }}>Ambitious Admits</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>({ambitiousColleges.length})</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)' }} />
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-primary)' }}>Long Shot Admits</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>({longshotsColleges.length})</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
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
                <div style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                }} className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-[var(--text-secondary)]">
                    <thead style={{
                      background: 'rgba(255,255,255,0.015)',
                      borderBottom: '1px solid var(--border-default)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                    }} className="uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5">College Details</th>
                        <th className="px-4 py-3.5 text-center">Type</th>
                        <th className="px-4 py-3.5 text-center">Quota</th>
                        <th className="px-4 py-3.5 text-right">Closing Cutoff</th>
                        <th className="px-4 py-3.5 text-center">Chance</th>
                        <th className="px-4 py-3.5 text-center">Probability</th>
                        <th className="px-5 py-3.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-default)]">
                      {filteredResults.map(item => {
                        const isCompared = !!compareList.find(c => c.id === item.id);
                        return (
                          <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="px-5 py-4">
                              <span className="font-semibold text-white block">{item.instituteName}</span>
                              <span className="text-[10px] text-[var(--text-secondary)] block mt-0.5">{item.branch}</span>
                              <span className="text-[9px] text-[var(--text-muted)] block mt-0.5">{item.instituteCity ? `${item.instituteCity}, ` : ''}{item.instituteState}</span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 500, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-default)', padding: '2px 5px', borderRadius: '2px' }}>
                                {item.instituteType}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 500, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-default)', padding: '2px 5px', borderRadius: '2px' }}>
                                {item.quota}
                              </span>
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)' }} className="px-4 py-4 text-right font-medium text-white">
                              {item.closingRank.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className={`text-[10px] font-semibold uppercase ${
                                item.chance === 'safe'
                                  ? 'text-[var(--safe-text)]'
                                  : item.chance === 'moderate'
                                  ? 'text-[var(--moderate-text)]'
                                  : 'text-[var(--ambitious-text)]'
                              }`}>
                                {item.chance}
                              </span>
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)' }} className="px-4 py-4 text-center font-medium text-white">
                              {item.probability}%
                            </td>
                            <td className="px-5 py-4 text-center">
                              <button
                                onClick={() => handleCompareToggle(item)}
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: 'var(--radius-xs)',
                                  fontSize: '0.65rem',
                                  fontFamily: 'var(--font-mono)',
                                  fontWeight: 500,
                                  border: '1px solid var(--border-default)',
                                  background: isCompared ? 'rgba(255,255,255,0.06)' : 'transparent',
                                  color: isCompared ? 'var(--text-primary)' : 'var(--text-secondary)',
                                  cursor: 'pointer',
                                  transition: 'all 0.1s',
                                }}
                                className="hover:border-[var(--border-strong)] hover:text-white"
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
                <div className="mt-12 space-y-4 pt-8 border-t border-[var(--border-default)]">
                  <h3 className="font-semibold text-white text-base flex items-center gap-2 font-display">
                    <span>💡 Alternative Options Nearby (Outside Preference Filters)</span>
                  </h3>
                  <p className="text-[10px] text-[var(--text-secondary)]">
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
      </div>

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
      <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-[var(--bg-base)] min-h-screen text-[var(--text-primary)]">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--text-secondary)]" />
        <p className="font-mono text-xs text-[var(--text-secondary)]">LOADING_RESULTS...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
