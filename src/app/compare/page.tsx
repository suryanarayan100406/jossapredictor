'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, GitCompare, Globe, Landmark, MapPin, Trophy, X, Loader2,
  AlertTriangle
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FeedbackWidget } from '@/components/FeedbackWidget';

interface CompareRecord {
  id: number;
  year: number;
  round: number;
  instituteType: string;
  instituteName: string;
  branch: string;
  quota: string;
  category: string;
  gender: string;
  openingRank: number;
  closingRank: number;
  state: string;
  city: string;
  website: string;
  nirfRank: number | null;
  logoUrl: string;
}

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsStr = searchParams.get('ids') || '';

  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<CompareRecord[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!idsStr) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    fetch(`/api/compare?ids=${idsStr}`)
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to fetch comparison');
        }
        return res.json();
      })
      .then(data => {
        setRecords(data.records || []);
      })
      .catch(err => {
        setError(err.message || 'Something went wrong.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idsStr]);

  const handleRemove = (id: number) => {
    const nextIds = records.filter(r => r.id !== id).map(r => r.id).join(',');
    if (nextIds) {
      router.push(`/compare?ids=${nextIds}`);
    } else {
      router.push('/predict');
    }
  };

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
          <GitCompare className="w-4 h-4" />
          <span>College Comparison</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Compare JoSAA Colleges Side-by-Side
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Review opening/closing ranks, locations, and details for up to 4 selected colleges.
        </p>
      </header>

      {/* Comparison Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <p className="text-gray-400 font-semibold">Comparing selected colleges...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-20 space-y-4 bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="font-bold text-white text-lg">Comparison Failed</h3>
            <p className="text-sm text-gray-400">{error}</p>
            <button
              onClick={() => router.push('/predict')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm cursor-pointer"
            >
              Start Prediction
            </button>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl p-8 space-y-4 max-w-lg mx-auto">
            <GitCompare className="w-12 h-12 text-indigo-400 mx-auto" />
            <h3 className="font-bold text-white text-lg">No colleges selected</h3>
            <p className="text-sm text-gray-400">
              Select colleges to compare from the prediction results page.
            </p>
            <button
              onClick={() => router.push('/predict')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm cursor-pointer"
            >
              Start Prediction
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#12121a]/60 backdrop-blur-md">
            <div className="min-w-[800px] divide-y divide-white/5">
              
              {/* Row 1: Cards with Delete option */}
              <div className="grid grid-cols-5 bg-white/5">
                <div className="p-6 flex items-center font-bold text-white border-r border-white/5 text-sm uppercase tracking-wider bg-white/[0.02]">
                  Colleges
                </div>
                {records.map(record => (
                  <div key={record.id} className="p-6 relative border-r border-white/5 space-y-3">
                    <button
                      onClick={() => handleRemove(record.id)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider bg-indigo-500/10 text-indigo-400 uppercase">
                      {record.instituteType}
                    </span>
                    <h3 className="font-extrabold text-white text-sm leading-snug pr-6">
                      {record.instituteName}
                    </h3>
                  </div>
                ))}
                {/* Empty columns if comparing less than 4 */}
                {Array.from({ length: 4 - records.length }).map((_, idx) => (
                  <div key={`empty-header-${idx}`} className="p-6 border-r border-white/5 text-gray-600 italic text-xs flex items-center justify-center">
                    Add another college to compare
                  </div>
                ))}
              </div>

              {/* Row 2: Branch */}
              <div className="grid grid-cols-5">
                <div className="p-6 font-semibold text-gray-400 text-xs uppercase tracking-wider border-r border-white/5 bg-white/[0.01]">
                  Branch / Academic Program
                </div>
                {records.map(record => (
                  <div key={record.id} className="p-6 text-sm font-semibold text-white border-r border-white/5 leading-relaxed">
                    {record.branch}
                  </div>
                ))}
                {Array.from({ length: 4 - records.length }).map((_, idx) => (
                  <div key={`empty-branch-${idx}`} className="p-6 border-r border-white/5" />
                ))}
              </div>

              {/* Row 3: Quota */}
              <div className="grid grid-cols-5">
                <div className="p-6 font-semibold text-gray-400 text-xs uppercase tracking-wider border-r border-white/5 bg-white/[0.01]">
                  Counselling Quota
                </div>
                {records.map(record => (
                  <div key={record.id} className="p-6 text-sm text-gray-300 font-semibold border-r border-white/5">
                    {record.quota} Quota
                  </div>
                ))}
                {Array.from({ length: 4 - records.length }).map((_, idx) => (
                  <div key={`empty-quota-${idx}`} className="p-6 border-r border-white/5" />
                ))}
              </div>

              {/* Row 4: Cutoffs */}
              <div className="grid grid-cols-5">
                <div className="p-6 font-semibold text-gray-400 text-xs uppercase tracking-wider border-r border-white/5 bg-white/[0.01]">
                  Cutoffs (CRL)
                </div>
                {records.map(record => (
                  <div key={record.id} className="p-6 border-r border-white/5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium">Opening Rank:</span>
                      <span className="font-bold text-gray-300">{record.openingRank.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium">Closing Rank:</span>
                      <span className="font-bold text-white">{record.closingRank.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg text-center font-bold">
                      Round {record.round} | {record.year} Data
                    </div>
                  </div>
                ))}
                {Array.from({ length: 4 - records.length }).map((_, idx) => (
                  <div key={`empty-cutoffs-${idx}`} className="p-6 border-r border-white/5" />
                ))}
              </div>

              {/* Row 5: Location */}
              <div className="grid grid-cols-5">
                <div className="p-6 font-semibold text-gray-400 text-xs uppercase tracking-wider border-r border-white/5 bg-white/[0.01]">
                  Location
                </div>
                {records.map(record => (
                  <div key={record.id} className="p-6 text-sm text-gray-300 border-r border-white/5 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                    <span>
                      {record.city ? `${record.city}, ` : ''}
                      {record.state}
                    </span>
                  </div>
                ))}
                {Array.from({ length: 4 - records.length }).map((_, idx) => (
                  <div key={`empty-loc-${idx}`} className="p-6 border-r border-white/5" />
                ))}
              </div>

              {/* Row 6: NIRF Rank */}
              <div className="grid grid-cols-5">
                <div className="p-6 font-semibold text-gray-400 text-xs uppercase tracking-wider border-r border-white/5 bg-white/[0.01]">
                  NIRF Rank
                </div>
                {records.map(record => (
                  <div key={record.id} className="p-6 text-sm border-r border-white/5 flex items-center gap-1.5 font-bold">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    {record.nirfRank ? (
                      <span className="text-amber-400">#{record.nirfRank} in Engineering</span>
                    ) : (
                      <span className="text-gray-500 font-normal italic">Not seeded</span>
                    )}
                  </div>
                ))}
                {Array.from({ length: 4 - records.length }).map((_, idx) => (
                  <div key={`empty-nirf-${idx}`} className="p-6 border-r border-white/5" />
                ))}
              </div>

              {/* Row 7: Website */}
              <div className="grid grid-cols-5">
                <div className="p-6 font-semibold text-gray-400 text-xs uppercase tracking-wider border-r border-white/5 bg-white/[0.01]">
                  Official Links
                </div>
                {records.map(record => (
                  <div key={record.id} className="p-6 border-r border-white/5">
                    {record.website ? (
                      <a
                        href={record.website.startsWith('http') ? record.website : `https://${record.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold hover:underline"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Visit Website</span>
                      </a>
                    ) : (
                      <span className="text-xs text-gray-500 italic">No website available</span>
                    )}
                  </div>
                ))}
                {Array.from({ length: 4 - records.length }).map((_, idx) => (
                  <div key={`empty-web-${idx}`} className="p-6 border-r border-white/5" />
                ))}
              </div>

            </div>
          </div>
        )}
      </section>

      <FeedbackWidget />
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-gray-400 font-semibold">Loading comparison details...</p>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
