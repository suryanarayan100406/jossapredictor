'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, GitCompare, Globe, MapPin, Trophy, X, Loader2,
  AlertTriangle
} from 'lucide-react';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { Navbar } from '@/components/Navbar';

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
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] pb-20 pt-28">
      {/* Navigation */}
      <Navbar />

      {/* Header */}
      <header className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 text-[var(--brand)] text-xs font-extrabold uppercase tracking-wider mb-2 font-mono">
          <GitCompare className="w-4 h-4" />
          <span>College Comparison</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-display">
          Compare JoSAA Colleges Side-by-Side
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Review opening/closing ranks, locations, and details for up to 4 selected colleges.
        </p>
      </header>

      {/* Comparison Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
            <p className="text-[var(--text-secondary)] font-mono text-sm">Comparing selected colleges...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-20 space-y-4 surface-elevated p-8">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="font-bold text-white text-lg font-display">Comparison Failed</h3>
            <p className="text-sm text-[var(--text-secondary)]">{error}</p>
            <button
              onClick={() => router.push('/predict')}
              className="btn-brand"
            >
              Start Prediction
            </button>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20 surface-elevated p-8 space-y-4 max-w-lg mx-auto">
            <GitCompare className="w-12 h-12 text-[var(--brand)] mx-auto" />
            <h3 className="font-bold text-white text-lg font-display">No colleges selected</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Select colleges to compare from the prediction results page.
            </p>
            <button
              onClick={() => router.push('/predict')}
              className="btn-brand"
            >
              Start Prediction
            </button>
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
          }} className="overflow-x-auto">
            <div className="min-w-[800px] divide-y divide-[var(--border-subtle)]">
              
              {/* Row 1: Cards with Delete option */}
              <div style={{ background: 'var(--bg-elevated)' }} className="grid grid-cols-5">
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }} className="p-6 flex items-center text-white border-r border-[var(--border-subtle)] text-sm uppercase tracking-wider">
                  Colleges
                </div>
                {records.map(record => (
                  <div key={record.id} className="p-6 relative border-r border-[var(--border-subtle)] space-y-3">
                    <button
                      onClick={() => handleRemove(record.id)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600, background: 'var(--brand-dim)', border: '1px solid var(--border-accent)', color: 'var(--brand)' }} className="px-2 py-0.5 rounded uppercase">
                      {record.instituteType}
                    </span>
                    <h3 className="font-bold text-white text-sm leading-snug pr-6 font-display">
                      {record.instituteName}
                    </h3>
                  </div>
                ))}
                {/* Empty columns if comparing less than 4 */}
                {Array.from({ length: 4 - records.length }).map((_, idx) => (
                  <div key={`empty-header-${idx}`} className="p-6 border-r border-[var(--border-subtle)] text-[var(--text-muted)] italic text-xs flex items-center justify-center font-mono">
                    Add another college to compare
                  </div>
                ))}
              </div>

              {/* Row 2: Branch */}
              <div className="grid grid-cols-5">
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }} className="p-6 text-gray-400 text-xs uppercase tracking-wider border-r border-[var(--border-subtle)] bg-white/[0.01]">
                  Branch / Academic Program
                </div>
                {records.map(record => (
                  <div key={record.id} className="p-6 text-sm font-semibold text-white border-r border-[var(--border-subtle)] leading-relaxed">
                    {record.branch}
                  </div>
                ))}
                {Array.from({ length: 4 - records.length }).map((_, idx) => (
                  <div key={`empty-branch-${idx}`} className="p-6 border-r border-[var(--border-subtle)]" />
                ))}
              </div>

              {/* Row 3: Quota */}
              <div className="grid grid-cols-5">
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }} className="p-6 text-gray-400 text-xs uppercase tracking-wider border-r border-[var(--border-subtle)] bg-white/[0.01]">
                  Counselling Quota
                </div>
                {records.map(record => (
                  <div key={record.id} className="p-6 text-sm text-[var(--text-secondary)] font-semibold border-r border-[var(--border-subtle)]">
                    {record.quota} Quota
                  </div>
                ))}
                {Array.from({ length: 4 - records.length }).map((_, idx) => (
                  <div key={`empty-quota-${idx}`} className="p-6 border-r border-[var(--border-subtle)]" />
                ))}
              </div>

              {/* Row 4: Cutoffs */}
              <div className="grid grid-cols-5">
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }} className="p-6 text-gray-400 text-xs uppercase tracking-wider border-r border-[var(--border-subtle)] bg-white/[0.01]">
                  Cutoffs (CRL)
                </div>
                {records.map(record => (
                  <div key={record.id} className="p-6 border-r border-[var(--border-subtle)] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--text-muted)] font-medium font-mono">Opening Rank:</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }} className="font-bold text-gray-300">{record.openingRank.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--text-muted)] font-medium font-mono">Closing Rank:</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }} className="font-bold text-white">{record.closingRank.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }} className="text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg text-center font-bold">
                      Round {record.round} | {record.year} Data
                    </div>
                  </div>
                ))}
                {Array.from({ length: 4 - records.length }).map((_, idx) => (
                  <div key={`empty-cutoffs-${idx}`} className="p-6 border-r border-[var(--border-subtle)]" />
                ))}
              </div>

              {/* Row 5: Location */}
              <div className="grid grid-cols-5">
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }} className="p-6 text-gray-400 text-xs uppercase tracking-wider border-r border-[var(--border-subtle)] bg-white/[0.01]">
                  Location
                </div>
                {records.map(record => (
                  <div key={record.id} className="p-6 text-sm text-[var(--text-secondary)] border-r border-[var(--border-subtle)] flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                    <span>
                      {record.city ? `${record.city}, ` : ''}
                      {record.state}
                    </span>
                  </div>
                ))}
                {Array.from({ length: 4 - records.length }).map((_, idx) => (
                  <div key={`empty-loc-${idx}`} className="p-6 border-r border-[var(--border-subtle)]" />
                ))}
              </div>

              {/* Row 6: NIRF Rank */}
              <div className="grid grid-cols-5">
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }} className="p-6 text-gray-400 text-xs uppercase tracking-wider border-r border-[var(--border-subtle)] bg-white/[0.01]">
                  NIRF Rank
                </div>
                {records.map(record => (
                  <div key={record.id} className="p-6 text-sm border-r border-[var(--border-subtle)] flex items-center gap-1.5 font-bold">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    {record.nirfRank ? (
                      <span className="text-amber-400">#{record.nirfRank} in Engineering</span>
                    ) : (
                      <span className="text-[var(--text-muted)] font-normal italic">Not seeded</span>
                    )}
                  </div>
                ))}
                {Array.from({ length: 4 - records.length }).map((_, idx) => (
                  <div key={`empty-nirf-${idx}`} className="p-6 border-r border-[var(--border-subtle)]" />
                ))}
              </div>

              {/* Row 7: Website */}
              <div className="grid grid-cols-5">
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }} className="p-6 text-gray-400 text-xs uppercase tracking-wider border-r border-[var(--border-subtle)] bg-white/[0.01]">
                  Official Links
                </div>
                {records.map(record => (
                  <div key={record.id} className="p-6 border-r border-[var(--border-subtle)]">
                    {record.website ? (
                      <a
                        href={record.website.startsWith('http') ? record.website : `https://${record.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[var(--brand)] hover:text-[var(--brand-hover)] font-bold hover:underline"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Visit Website</span>
                      </a>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)] italic">No website available</span>
                    )}
                  </div>
                ))}
                {Array.from({ length: 4 - records.length }).map((_, idx) => (
                  <div key={`empty-web-${idx}`} className="p-6 border-r border-[var(--border-subtle)]" />
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
      <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-[var(--bg-base)] min-h-screen text-[var(--text-primary)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
        <p className="font-mono text-sm text-[var(--text-secondary)]">Loading comparison details...</p>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
