'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Info, Loader2, AlertTriangle } from 'lucide-react';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { Navbar } from '@/components/Navbar';
import dynamic from 'next/dynamic';

// Import Recharts dynamically to prevent SSR hydration mismatches
const LineChartComponent = dynamic(
  () => import('./LineChartComponent').then(mod => mod.LineChartComponent),
  { ssr: false, loading: () => (
    <div className="h-[400px] flex items-center justify-center bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-default)]">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
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
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] relative overflow-hidden select-none pb-20 pt-10">
      <div className="premium-grid" />
      {/* Navigation */}
      <Navbar />

      {/* Header */}
      <header className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 text-[var(--brand)] text-xs font-extrabold uppercase tracking-wider mb-2 font-mono">
          <TrendingUp className="w-4 h-4" />
          <span>Cutoff Trend Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-display">
          {instituteName}
        </h1>
        <p className="text-base font-semibold text-[var(--text-secondary)] mt-1">
          {branch}
        </p>
        <div className="flex flex-wrap gap-2 mt-4 text-xs font-bold text-[var(--text-secondary)] font-mono">
          <span style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', padding: '4px 10px', borderRadius: 'var(--radius-sm)' }}>Quota: {quota}</span>
          <span style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', padding: '4px 10px', borderRadius: 'var(--radius-sm)' }}>Category: {category}</span>
          <span style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', padding: '4px 10px', borderRadius: 'var(--radius-sm)' }}>Gender: {gender}</span>
        </div>
      </header>

      {/* Chart Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
            <p className="text-[var(--text-secondary)] font-mono text-sm">Generating trend charts...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-20 space-y-4 surface-elevated p-8">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="font-bold text-white text-lg font-display">Trend Fetch Failed</h3>
            <p className="text-sm text-[var(--text-secondary)]">{error}</p>
            <button
              onClick={handleBack}
              className="btn-brand"
            >
              Go Back
            </button>
          </div>
        ) : trends.length === 0 ? (
          <div className="text-center py-20 surface-elevated p-8 space-y-4 max-w-lg mx-auto">
            <TrendingUp className="w-12 h-12 text-[var(--brand)] mx-auto" />
            <h3 className="font-bold text-white text-lg font-display">No historical trend data</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              We couldn't find cutoff records for this specific combination across multiple years/rounds in the database.
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
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
              }}>
                <h3 className="font-bold text-white text-base mb-6 font-display">Closing Rank YoY Comparison</h3>
                <LineChartComponent data={trends} />
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] p-4 text-xs text-[var(--text-secondary)]">
                <Info className="w-4 h-4 text-[var(--brand)] shrink-0 mt-0.5" />
                <p>
                  This chart shows the Closing Rank (CRL) cutoffs for previous counselling years. Lower closing ranks indicate higher demand / competition for that specific college branch.
                </p>
              </div>
            </div>

            {/* Stats Summary Column */}
            <div className="space-y-6">
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
              }} className="space-y-6">
                <h3 className="font-bold text-white text-base font-display">Trend Summary</h3>
                
                <div className="divide-y divide-[var(--border-subtle)] text-sm">
                  {trends.map((t, idx) => (
                    <div key={idx} className="py-3.5 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white font-display">Year {t.year}</span>
                        <span className="text-xs text-[var(--text-secondary)] block font-mono">Round {t.round}</span>
                      </div>
                      <div className="text-right">
                        <span style={{ fontFamily: 'var(--font-mono)' }} className="font-bold text-white block">{t.closingRank.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-[var(--text-secondary)] block font-mono">Closing Rank</span>
                      </div>
                    </div>
                  ))}
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
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
        <p className="font-mono text-sm text-[var(--text-secondary)]">Loading trends page...</p>
      </div>
    }>
      <TrendsContent />
    </Suspense>
  );
}
