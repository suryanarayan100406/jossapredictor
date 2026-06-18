'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Info, Loader2, AlertTriangle } from 'lucide-react';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { Navbar } from '@/components/Navbar';
import dynamic from 'next/dynamic';

const LineChartComponent = dynamic(
  () => import('./LineChartComponent').then((mod) => mod.LineChartComponent),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] flex items-center justify-center bg-bg-base rounded-2xl border border-border-default">
        <Loader2 className="w-6 h-6 animate-spin text-brand" />
      </div>
    ),
  },
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
      setError('We need a college and branch to show trends.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const params = new URLSearchParams({ instituteName, branch, category, gender, quota });

    fetch(`/api/trends?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to fetch trend data');
        }
        return res.json();
      })
      .then((data) => {
        setTrends(data.trends || []);
      })
      .catch((err) => {
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

  const chips = [
    { label: 'Quota', value: quota },
    { label: 'Category', value: category },
    { label: 'Pool', value: gender },
  ];

  return (
    <main className="min-h-screen bg-bg-base text-text-primary relative pb-20">
      <div className="premium-grid" />
      <Navbar />

      <header className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <button onClick={handleBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-brand transition-colors mb-5 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2 text-brand text-sm font-bold mb-2">
          <TrendingUp className="w-4 h-4" />
          <span>Cutoff trends</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary leading-tight font-display">
          {instituteName}
        </h1>
        <p className="text-sm font-medium text-text-secondary mt-1">{branch}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {chips.map((chip) => (
            <span key={chip.label} className="text-xs font-semibold text-text-secondary bg-bg-elevated border border-border-default rounded-full px-3 py-1">
              {chip.label}: <span className="text-text-primary font-bold">{chip.value}</span>
            </span>
          ))}
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-7 h-7 animate-spin text-brand" />
            <p className="text-text-secondary text-sm">Drawing your trend charts...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-16 space-y-4 surface-elevated p-8">
            <AlertTriangle className="w-9 h-9 text-ambitious mx-auto" />
            <h3 className="font-bold text-text-primary text-lg font-display">We couldn&apos;t load trends</h3>
            <p className="text-sm text-text-secondary">{error}</p>
            <button onClick={handleBack} className="btn-brand mx-auto">Go back</button>
          </div>
        ) : trends.length === 0 ? (
          <div className="text-center py-16 surface-elevated p-8 space-y-4 max-w-lg mx-auto">
            <TrendingUp className="w-9 h-9 text-text-muted mx-auto" />
            <h3 className="font-bold text-text-primary text-lg font-display">No history just yet</h3>
            <p className="text-sm text-text-secondary">
              We couldn&apos;t find cutoff records for this exact combination across years and rounds.
            </p>
            <button onClick={handleBack} className="btn-brand mx-auto">Go back</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start min-w-0">
            <div className="lg:col-span-2 min-w-0 space-y-5">
              <div className="surface-elevated p-6">
                <h3 className="font-bold text-text-primary text-lg mb-5 font-display">Closing rank, year over year</h3>
                <LineChartComponent data={trends} />
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-brand-dim border border-border-default p-4 text-sm text-text-secondary">
                <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <p>A lower closing rank means tougher competition for that college and branch. Watch the line to see if it&apos;s getting harder or easier to get in.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="surface-elevated p-6 space-y-4">
                <h3 className="font-bold text-text-primary text-lg font-display">Year-by-year</h3>
                <div className="divide-y divide-border-subtle text-sm">
                  {trends.map((t, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-text-primary font-display">Year {t.year}</span>
                        <span className="text-xs text-text-muted block">Round {t.round}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-text-primary block">{t.closingRank.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-text-muted block">Closing rank</span>
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
      <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-bg-base min-h-screen text-text-primary">
        <Loader2 className="w-7 h-7 animate-spin text-brand" />
        <p className="text-sm text-text-secondary">Loading trends...</p>
      </div>
    }>
      <TrendsContent />
    </Suspense>
  );
}
