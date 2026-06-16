'use client';
import React from 'react';
import Link from 'next/link';
import { Target, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-5xl"
         style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', padding: '10px 20px' }}>
      <div className="flex items-center justify-between">
        {/* Logo — Space Grotesk, NOT GraduationCap icon */}
        <Link href="/" className="flex items-center gap-2">
          {/* Brand mark: a small arc/scope icon made from a div, NOT GraduationCap */}
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target className="w-4 h-4 text-white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Rank<span style={{ color: 'var(--brand)' }}>Scope</span>
          </span>
        </Link>
        
        {/* Center: nav links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { href: '/predict', label: 'Predict' },
            { href: '/trends', label: 'Trends' },
            { href: '/compare', label: 'Compare' },
          ].map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                style={{ 
                  padding: '6px 14px', 
                  borderRadius: 'var(--radius-sm)', 
                  fontSize: '0.875rem', 
                  fontWeight: 500, 
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-active)' : 'transparent',
                  transition: 'all 0.15s' 
                }}
                className="hover:text-white transition-colors">
                {item.label}
              </Link>
            );
          })}
        </div>
        
        {/* CTA */}
        <Link href="/predict" className="btn-brand" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
          Start Predicting <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </nav>
  );
}
