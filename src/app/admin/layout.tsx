'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GraduationCap, LayoutDashboard, Database, Upload, HelpCircle, Settings,
  History, LogOut, Menu, X, Landmark, Shield, User, Loader2
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current admin info to verify session
  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    fetch('/api/auth/me')
      .then(async res => {
        if (!res.ok) {
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then(data => {
        setAdminUser(data.admin);
      })
      .catch(() => {
        // Redirection should be handled by middleware, but fallback redirect:
        router.push(`/admin/login?from=${pathname}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-gray-400 font-semibold text-sm">Verifying administrator session...</p>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Import CSV', href: '/admin/import', icon: Upload },
    { name: 'Cutoffs Data', href: '/admin/data', icon: Database },
    { name: 'Institutes', href: '/admin/institutes', icon: Landmark },
    { name: 'Import History', href: '/admin/history', icon: History },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'User Feedback', href: '/admin/feedback', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col md:flex-row">
      {/* Mobile Nav Bar */}
      <nav className="md:hidden flex items-center justify-between border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl px-4 py-3 sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <GraduationCap className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold text-sm text-white">College Predictor</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#0c0c14]/80 backdrop-blur-md shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <GraduationCap className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white block">College Predictor</span>
            <span className="text-[10px] text-indigo-400 font-extrabold block uppercase tracking-wider">Control Panel</span>
          </div>
        </div>

        {/* User profile brief */}
        <div className="px-6 py-4 flex items-center gap-3 border-b border-white/5 bg-white/[0.01]">
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <User className="w-4.5 h-4.5 text-indigo-400" />
          </div>
          <div className="truncate">
            <span className="font-semibold text-xs text-white block truncate">{adminUser?.email || 'Administrator'}</span>
            <span className="text-[9px] text-gray-500 font-bold block uppercase">Super Admin</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all border group ${
                  active
                    ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold shadow-[0_0_15px_rgba(99,102,241,0.05)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 ${active ? 'text-indigo-400' : 'text-gray-500 group-hover:text-white'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer group"
          >
            <LogOut className="w-4.5 h-4.5 text-red-400 group-hover:translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Nav Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden flex"
          >
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              className="w-64 bg-[#0a0a0f] border-r border-white/10 flex flex-col justify-between h-full"
            >
              <div>
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <GraduationCap className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="font-extrabold text-sm text-white">Admin Control</span>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="text-gray-400 hover:text-white p-1 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="px-4 py-6 space-y-1.5">
                  {menuItems.map(item => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border ${
                          active
                            ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold'
                            : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="p-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar - Desktop only */}
        <header className="hidden md:flex h-16 items-center justify-between border-b border-white/5 bg-[#0a0a0f]/50 px-8 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>College Predictor System Administration</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
      </div>
      <FeedbackWidget />
    </div>
  );
}
