'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, ArrowRight, Menu, X, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/predict', label: 'Predict' },
  { href: '/trends', label: 'Trends' },
  { href: '/compare', label: 'Compare' },
];

const navSpring = { type: 'spring', stiffness: 380, damping: 30 } as const;
const mobileMenuMotion = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
};

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navClass =
    'sticky top-0 left-0 right-0 z-50 w-full transition-all duration-300 ' +
    (scrolled
      ? 'bg-bg-base/80 backdrop-blur-xl border-b border-border-default shadow-[0_6px_24px_-18px_rgba(24,33,58,0.5)]'
      : 'bg-transparent border-b border-transparent');

  const isActiveHref = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand to-accent-cyan flex items-center justify-center shadow-[0_8px_18px_-8px_var(--brand-glow)] transition-transform duration-200 group-hover:scale-105 group-hover:rotate-3">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-extrabold text-[1.15rem] tracking-tight text-text-primary">
            Rank<span className="text-brand">Scope</span>
          </span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isActiveHref(item.href);
            const linkClass =
              'relative px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ' +
              (active ? 'text-brand' : 'text-text-secondary hover:text-text-primary');
            return (
              <Link key={item.href} href={item.href} className={linkClass}>
                {active ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-brand-dim"
                    transition={navSpring}
                  />
                ) : null}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <Link href="/predict" className="btn-brand hidden sm:inline-flex">
            <Sparkles className="w-4 h-4" /> Find my colleges
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-full border border-border-default text-text-secondary hover:text-brand hover:border-border-strong transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            {...mobileMenuMotion}
            className="md:hidden overflow-hidden border-b border-border-default bg-bg-elevated/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isActiveHref(item.href);
                const mClass =
                  'px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ' +
                  (active
                    ? 'bg-brand-dim text-brand'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-base');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={mClass}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/predict"
                onClick={() => setMobileOpen(false)}
                className="btn-brand justify-center mt-2"
              >
                <Sparkles className="w-4 h-4" /> Find my colleges
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
