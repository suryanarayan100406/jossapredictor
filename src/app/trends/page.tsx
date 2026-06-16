'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Info, HelpCircle, Loader2, AlertTriangle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import dynamic from 'next/dynamic';

// Import Recharts dynamically to prevent SSR hydration mismatches
const LineChartComponent = dynamic(
  () => import('./LineChartComponent').then(mod => mod.LineChartComponent),
  { ssr: false, loading: () => (
    <div className="h-[400px] flex items-center justify-center bg-white/5 rounded-3xl border border-white/10">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
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
    <main className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Results</span>
          </button>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 text-indigo-400 text-xs font-extrabold uppercase tracking-wider mb-2">
          <TrendingUp className="w-4 h-4" />
          <span>Cutoff Trend Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
          {instituteName}
        </h1>
        <p className="text-base font-semibold text-gray-400 mt-1">
          {branch}
        </p>
        <div className="flex flex-wrap gap-2 mt-4 text-xs font-bold text-gray-400">
          <span className="bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">Quota: {quota}</span>
          <span className="bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">Category: {category}</span>
          <span className="bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">Gender: {gender}</span>
        </div>
      </header>

      {/* Chart Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <p className="text-gray-400 font-semibold">Generating trend charts...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-20 space-y-4 bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="font-bold text-white text-lg">Trend Fetch Failed</h3>
            <p className="text-sm text-gray-400">{error}</p>
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm cursor-pointer"
            >
              Go Back
            </button>
          </div>
        ) : trends.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl p-8 space-y-4 max-w-lg mx-auto">
            <TrendingUp className="w-12 h-12 text-indigo-400 mx-auto" />
            <h3 className="font-bold text-white text-lg">No historical trend data</h3>
            <p className="text-sm text-gray-400">
              We couldn't find cutoff records for this specific combination across multiple years/rounds in the database.
            </p>
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm cursor-pointer"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Chart Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-[#12121a]/60 p-6 backdrop-blur-md">
                <h3 className="font-bold text-white text-base mb-6">Closing Rank YoY Comparison</h3>
                <LineChartComponent data={trends} />
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/5 p-4 text-xs text-gray-400">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p>
                  This chart shows the Closing Rank (CRL) cutoffs for previous counselling years. Lower closing ranks indicate higher demand / competition for that specific college branch.
                </p>
              </div>
            </div>

            {/* Stats Summary Column */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#12121a] to-[#1a1a25] p-6 backdrop-blur-md space-y-6">
                <h3 className="font-bold text-white text-base">Trend Summary</h3>
                
                <div className="divide-y divide-white/5 text-sm">
                  {trends.map((t, idx) => (
                    <div key={idx} className="py-3.5 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white">Year {t.year}</span>
                        <span className="text-xs text-gray-500 block">Round {t.round}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white block">{t.closingRank.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-gray-500 block">Closing Rank</span>
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
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-gray-400 font-semibold">Loading trends page...</p>
      </div>
    }>
      <TrendsContent />
    </Suspense>
  );
}
