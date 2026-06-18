'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Info, Loader2, AlertTriangle } from 'lucide-react';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { Navbar } from '@/components/Navbar';
import dynamic from 'next/dynamic';

// Import Recharts dynamically to prevent SSR hydration mismatches
const LineChartComponent = dynamic(
  () => import('./LineChartComponent').then(mod => mod.LineChartComponent),
  { ssr: false, loading: () => (
    <div className="h-[400px] flex items-center justify-center bg-[var(--bg-elevated)] rounded-md border border-[var(--border-default)]">
      <Loader2 className="w-6 h-6 animate-spin text-[var(--text-secondary)]" />
    </div>
  ) }
);

interface TrendRecord {
  year: number;
  round: number;
  closingRank: number;
  openingRank: number;
}

function TrendsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const instituteName = searchParams.get('instituteName') || '';
  const branch = searchParams.get('branch') || '';
  const category = searchParams.get('category') || 'OPEN';
  const gender = searchParams.get('gender') || 'Gender-Neutral';
  const quota = searchParams.get('quota') || 'AI';

  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState<TrendRecord[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!instituteName || !branch) {
      setError('Missing parameters: instituteName and branch are required.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const params = new URLSearchParams({
      instituteName,
      branch,
      category,
      gender,
      quota,
    });

    fetch(`/api/trends?${params.toString()}`)
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to fetch trend data');
        }
        return res.json();
      })
      .then(data => {
        setTrends(data.trends || []);
      })
      .catch(err => {
        setError(err.message || 'Something went wrong.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [instituteName, branch, category, gender, quota]);

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    } else {
      router.push('/predict');
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] relative pb-20">
      <div className="premium-grid" />
      {/* Navigation */}
      <Navbar />

      {/* Header */}
      <header className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wider mb-2 font-mono">
          <TrendingUp className="w-4 h-4" />
          <span>Cutoff Trend Analysis</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white leading-tight font-display">
          {instituteName}
        </h1>
        <p className="text-xs font-medium text-[var(--text-secondary)] mt-1">
          {branch}
        </p>
        <div className="flex flex-wrap gap-2 mt-4 text-[10px] font-bold text-[var(--text-secondary)] font-mono uppercase tracking-wide">
          <span className="bg-brand-dim border border-brand/35 text-brand px-2.5 py-1">[QUOTA: {quota}]</span>
          <span className="bg-brand-dim border border-brand/35 text-brand px-2.5 py-1">[CATEGORY: {category}]</span>
          <span className="bg-brand-dim border border-brand/35 text-brand px-2.5 py-1">[GENDER: {gender}]</span>
        </div>
      </header>

      {/* Chart Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--text-secondary)]" />
            <p className="text-[var(--text-secondary)] font-mono text-xs">Generating trend charts...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-20 space-y-4 surface-elevated p-8">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
            <h3 className="font-semibold text-white text-base font-display">Trend Fetch Failed</h3>
            <p className="text-xs text-[var(--text-secondary)]">{error}</p>
            <button
              onClick={handleBack}
              className="btn-brand"
            >
              Go Back
            </button>
          </div>
        ) : trends.length === 0 ? (
          <div className="text-center py-20 surface-elevated p-8 space-y-4 max-w-lg mx-auto">
            <TrendingUp className="w-8 h-8 text-[var(--text-secondary)] mx-auto" />
            <h3 className="font-semibold text-white text-base font-display">No historical trend data</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              We couldn't find cutoff records for this combination across multiple years/rounds in the database.
            </p>
            <button
              onClick={handleBack}
              className="btn-brand"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Chart Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="console-card">
                <div className="console-header">
                  <span className="font-mono text-[9px] text-slate-300 font-semibold tracking-wider">CHART_ANALYTICS_YOY</span>
                  <span className="font-mono text-[9px] text-brand font-bold">MODE: INTERACTIVE</span>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-white text-base mb-6 font-display">Closing Rank YoY Comparison</h3>
                  <LineChartComponent data={trends} />
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-white/[0.02] border border-white/10 p-4 text-xs text-text-secondary">
                <Info className="w-4 h-4 text-text-secondary shrink-0 mt-0.5" />
                <p>
                  This chart shows the Closing Rank (CRL) cutoffs for previous counselling years. Lower closing ranks indicate higher demand / competition for that specific college branch.
                </p>
              </div>
            </div>

            {/* Stats Summary Column */}
            <div className="space-y-6">
              <div className="console-card">
                <div className="console-header">
                  <span className="font-mono text-[9px] text-slate-300 font-semibold tracking-wider">TRENDS_DATATABLE</span>
                  <span className="font-mono text-[9px] text-brand font-bold">R6_FINAL</span>
                </div>
                <div className="p-6 space-y-6">
                  <h3 className="font-semibold text-white text-base font-display">Trend Summary</h3>
                
                <div className="divide-y divide-white/10 text-sm">
                  {trends.map((t, idx) => (
                    <div key={idx} className="py-3.5 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-white font-display">Year {t.year}</span>
                        <span className="text-xs text-text-secondary block font-mono">Round {t.round}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-medium text-white block">{t.closingRank.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-text-secondary block font-mono">Closing Rank</span>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </section>

      <FeedbackWidget />
    </main>
  );
}

export default function TrendsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-[var(--bg-base)] min-h-screen text-[var(--text-primary)]">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--text-secondary)]" />
        <p className="font-mono text-xs text-[var(--text-secondary)]">Loading trends page...</p>
      </div>
    }>
      <TrendsContent />
    </Suspense>
  );
}
