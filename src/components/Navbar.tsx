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
        <div className="hidden md:flex items-center gap-1">
          {[
            { href: '/predict', label: 'Predict' },
            { href: '/trends', label: 'Trends' },
            { href: '/compare', label: 'Compare' },
          ].map(item => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={`px-3.5 py-1.5 rounded-sm text-[0.85rem] font-medium transition-all duration-150 ${
                  isActive 
                    ? 'text-text-primary bg-bg-active' 
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}>
                {item.label}
              </Link>
            );
          })}
        </div>
        
        {/* CTA */}
        <Link href="/predict" className="btn-brand" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
          Start Predicting <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </nav>
  );
}
