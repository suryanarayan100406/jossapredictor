'use client';
import React from 'react';
import { MapPin, TrendingUp } from 'lucide-react';
import { PredictionResult } from '@/types';
import { ChanceBadge } from './ChanceBadge';
import { ProbabilityMeter } from './ProbabilityMeter';
import { formatRank } from '@/lib/utils';
import Link from 'next/link';

interface ChanceCardProps {
  result: PredictionResult;
  isCompared: boolean;
  onCompareToggle: () => void;
}

export function ChanceCard({ result, isCompared, onCompareToggle }: ChanceCardProps) {
  // Generate a trend slug for the specific combination
  const trendParams = new URLSearchParams({
    instituteName: result.instituteName,
    branch: result.branch,
    category: result.category,
    gender: result.gender,
    quota: result.quota,
  });

  return (
    <div className={`chance-card-${result.chance}`} style={{
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)',
      padding: '16px 18px',
      display: 'flex',
      gap: 16,
      transition: 'border-color 0.2s, box-shadow 0.2s',
      cursor: 'default',
    }} onMouseEnter={e => e.currentTarget.style.boxShadow = `var(--glow-${result.chance})`}
       onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
      
      {/* Left: All text info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        
        {/* Badges row */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 3, padding: '1px 6px', letterSpacing: '0.05em' }}>
            {result.instituteType}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 600, color: 'var(--brand)', background: 'var(--brand-dim)', border: '1px solid var(--border-accent)', borderRadius: 3, padding: '1px 6px', letterSpacing: '0.05em' }}>
            {result.quota}
          </span>
          <ChanceBadge chance={result.chance} />
        </div>
        
        {/* Institute name */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 3, lineHeight: 1.3 }}>
          {result.instituteName}
        </h3>
        
        {/* Branch */}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.4 }}>
          {result.branch}
        </p>
        
        {/* Location + Trend link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <MapPin className="w-3 h-3" />
            <span>{result.instituteCity ? `${result.instituteCity}, ` : ''}{result.instituteState}</span>
          </div>
          <Link href={`/trends?${trendParams.toString()}`} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--brand)', fontSize: '0.75rem', fontWeight: 500 }} className="hover:text-brand-hover">
            <TrendingUp className="w-3 h-3" />
            <span>Trend</span>
          </Link>
        </div>
      </div>
      
      {/* Right: Probability arc + rank data */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', flexShrink: 0, width: 110 }}>
        
        {/* Arc gauge */}
        <ProbabilityMeter probability={result.probability} size={72} />
        
        {/* Opening / Closing ranks */}
        <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 2 }}>OPEN</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{formatRank(result.openingRank)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 2 }}>CLOSE</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatRank(result.closingRank)}</div>
          </div>
        </div>
        
        {/* Compare toggle */}
        <button onClick={onCompareToggle} style={{
          marginTop: 8,
          padding: '4px 10px',
          borderRadius: 'var(--radius-xs)',
          fontSize: '0.7rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          border: `1px solid ${isCompared ? 'var(--safe-border)' : 'var(--border-default)'}`,
          background: isCompared ? 'var(--safe-bg)' : 'transparent',
          color: isCompared ? 'var(--safe-text)' : 'var(--text-muted)',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}>
          {isCompared ? '✓ Added' : '+ Compare'}
        </button>
      </div>
    </div>
  );
}
