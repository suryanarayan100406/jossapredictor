'use client';
import React from 'react';
import Link from 'next/link';
import { Target, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{
      background: 'rgba(9, 9, 11, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-default)',
    }} className="sticky top-0 left-0 right-0 z-50 w-full">
      {/* Telemetry Status Bar */}
      <div className="border-b border-white/5 bg-black/40 py-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[9px] font-mono text-text-secondary tracking-widest uppercase">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM_ONLINE: v2.26
            </span>
            <span className="hidden sm:inline text-text-muted">|</span>
            <span className="hidden sm:inline">DATABASE: 65,086_RECORDS</span>
          </div>
          <div className="flex items-center gap-4">
            <span>UPTIME: 99.99%</span>
            <span className="hidden sm:inline text-text-muted">|</span>
            <span className="hidden sm:inline text-brand">MODE: ANALYTICAL_DECK</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo — Space Grotesk, NOT GraduationCap icon */}
        <Link href="/" className="flex items-center gap-2">
          {/* Brand mark: a small clean monochrome mark */}
          <div style={{ width: 26, height: 26, borderRadius: 4, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target className="w-3.5 h-3.5 text-black" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            RankScope
          </span>
        </Link>
        
        {/* Center: nav links */}
        <div className="hidden md:flex items-center gap-2 font-mono text-[11px] font-bold">
          {[
            { href: '/predict', label: '01_PREDICT' },
            { href: '/trends', label: '02_TRENDS' },
            { href: '/compare', label: '03_COMPARE' },
          ].map(item => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={`px-3 py-1 border transition-all duration-150 ${
                  isActive 
                    ? 'text-brand border-brand/35 bg-brand-dim' 
                    : 'text-text-secondary border-transparent hover:text-white hover:bg-white/5'
                }`}>
                [{item.label}]
              </Link>
            );
          })}
        </div>
        
        {/* CTA */}
        <Link href="/predict" className="btn-brand" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
          Predict My Colleges <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </nav>
  );
}
