'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, GitCompare, Globe, MapPin, Trophy, X, Loader2, AlertTriangle,
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

const rowLabelClass =
  'p-5 text-text-secondary text-xs uppercase tracking-wide border-r border-border-default bg-bg-base font-display font-bold sticky left-0';

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
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to fetch comparison');
        }
        return res.json();
      })
      .then((data) => {
        setRecords(data.records || []);
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idsStr]);

  const handleRemove = (id: number) => {
    const nextIds = records.filter((r) => r.id !== id).map((r) => r.id).join(',');
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

  const emptyCols = Math.max(0, 4 - records.length);

  return (
    <main className="min-h-screen bg-bg-base text-text-primary relative pb-20">
      <div className="premium-grid" />
      <Navbar />

      <header className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <button onClick={handleBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-brand transition-colors mb-5 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2 text-brand text-sm font-bold mb-2">
          <GitCompare className="w-4 h-4" />
          <span>Compare colleges</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary font-display">
          Your colleges, side by side
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Ranks, locations and details for up to 4 colleges — all in one place.
        </p>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-7 h-7 animate-spin text-brand" />
            <p className="text-text-secondary text-sm">Lining up your colleges...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-16 space-y-4 surface-elevated p-8">
            <AlertTriangle className="w-9 h-9 text-ambitious mx-auto" />
            <h3 className="font-bold text-text-primary text-lg font-display">Comparison failed</h3>
            <p className="text-sm text-text-secondary">{error}</p>
            <button onClick={() => router.push('/predict')} className="btn-brand mx-auto">Start predicting</button>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-16 surface-elevated p-8 space-y-4 max-w-lg mx-auto">
            <GitCompare className="w-9 h-9 text-text-muted mx-auto" />
            <h3 className="font-bold text-text-primary text-lg font-display">Nothing to compare yet</h3>
            <p className="text-sm text-text-secondary">Pick a few colleges from your results page and they&apos;ll show up here.</p>
            <button onClick={() => router.push('/predict')} className="btn-brand mx-auto">Start predicting</button>
          </div>
        ) : (
          <div className="overflow-x-auto surface-elevated">
            <div className="min-w-[800px] divide-y divide-border-default">

              {/* Colleges */}
              <div className="grid grid-cols-5 bg-bg-base">
                <div className={`${rowLabelClass} flex items-center text-text-primary`}>Colleges</div>
                {records.map((record) => (
                  <div key={record.id} className="p-5 relative border-r border-border-default space-y-2.5 bg-bg-elevated">
                    <button onClick={() => handleRemove(record.id)}
                      className="absolute top-4 right-4 text-text-muted hover:text-ambitious p-1 hover:bg-bg-base rounded-full transition-colors cursor-pointer"
                      title="Remove from comparison">
                      <X className="w-4 h-4" />
                    </button>
                    <span className="inline-block px-2 py-0.5 font-bold text-[10px] rounded-full bg-brand-dim text-brand">
                      {record.instituteType}
                    </span>
                    <h3 className="font-bold text-text-primary text-sm leading-snug pr-6 font-display">
                      {record.instituteName}
                    </h3>
                  </div>
                ))}
                {Array.from({ length: emptyCols }).map((_, idx) => (
                  <div key={`empty-header-${idx}`} className="p-5 border-r border-border-default text-text-muted italic text-xs flex items-center justify-center bg-bg-elevated">
                    Add another
                  </div>
                ))}
              </div>

              {/* Branch */}
              <div className="grid grid-cols-5">
                <div className={rowLabelClass}>Branch / program</div>
                {records.map((record) => (
                  <div key={record.id} className="p-5 text-sm font-semibold text-text-primary border-r border-border-default leading-relaxed">
                    {record.branch}
                  </div>
                ))}
                {Array.from({ length: emptyCols }).map((_, idx) => (
                  <div key={`empty-branch-${idx}`} className="p-5 border-r border-border-default" />
                ))}
              </div>

              {/* Quota */}
              <div className="grid grid-cols-5">
                <div className={rowLabelClass}>Counselling quota</div>
                {records.map((record) => (
                  <div key={record.id} className="p-5 text-sm text-text-secondary font-medium border-r border-border-default">
                    {record.quota} quota
                  </div>
                ))}
                {Array.from({ length: emptyCols }).map((_, idx) => (
                  <div key={`empty-quota-${idx}`} className="p-5 border-r border-border-default" />
                ))}
              </div>

              {/* Cutoffs */}
              <div className="grid grid-cols-5">
                <div className={rowLabelClass}>Cutoffs (CRL)</div>
                {records.map((record) => (
                  <div key={record.id} className="p-5 border-r border-border-default space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-muted font-medium">Opens</span>
                      <span className="font-semibold text-text-secondary">{record.openingRank.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-muted font-medium">Closes</span>
                      <span className="font-bold text-text-primary">{record.closingRank.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[11px] text-text-secondary bg-bg-base px-2 py-1 rounded-full text-center font-semibold">
                      Round {record.round} · {record.year}
                    </div>
                  </div>
                ))}
                {Array.from({ length: emptyCols }).map((_, idx) => (
                  <div key={`empty-cutoffs-${idx}`} className="p-5 border-r border-border-default" />
                ))}
              </div>

              {/* Location */}
              <div className="grid grid-cols-5">
                <div className={rowLabelClass}>Location</div>
                {records.map((record) => (
                  <div key={record.id} className="p-5 text-sm text-text-secondary border-r border-border-default flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-text-muted shrink-0" />
                    <span>{record.city ? `${record.city}, ` : ''}{record.state}</span>
                  </div>
                ))}
                {Array.from({ length: emptyCols }).map((_, idx) => (
                  <div key={`empty-loc-${idx}`} className="p-5 border-r border-border-default" />
                ))}
              </div>

              {/* NIRF */}
              <div className="grid grid-cols-5">
                <div className={rowLabelClass}>NIRF rank</div>
                {records.map((record) => (
                  <div key={record.id} className="p-5 text-sm border-r border-border-default flex items-center gap-1.5 font-medium">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    {record.nirfRank ? (
                      <span className="text-text-primary font-semibold">#{record.nirfRank} in Engineering</span>
                    ) : (
                      <span className="text-text-muted italic font-normal">Not listed</span>
                    )}
                  </div>
                ))}
                {Array.from({ length: emptyCols }).map((_, idx) => (
                  <div key={`empty-nirf-${idx}`} className="p-5 border-r border-border-default" />
                ))}
              </div>

              {/* Website */}
              <div className="grid grid-cols-5">
                <div className={rowLabelClass}>Official site</div>
                {records.map((record) => (
                  <div key={record.id} className="p-5 border-r border-border-default">
                    {record.website ? (
                      <a href={record.website.startsWith('http') ? record.website : `https://${record.website}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-brand font-semibold hover:underline">
                        <Globe className="w-4 h-4" />
                        <span>Visit website</span>
                      </a>
                    ) : (
                      <span className="text-sm text-text-muted italic">No website</span>
                    )}
                  </div>
                ))}
                {Array.from({ length: emptyCols }).map((_, idx) => (
                  <div key={`empty-web-${idx}`} className="p-5 border-r border-border-default" />
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
      <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-bg-base min-h-screen text-text-primary">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
        <p className="text-sm text-text-secondary">Loading comparison...</p>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
