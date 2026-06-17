'use client';

import React, { useState, useEffect } from 'react';
import { Database, Landmark, GitFork, Calendar, RefreshCcw, AlertCircle, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const DashboardCharts = dynamic(
  () => import('./DashboardCharts').then(mod => mod.DashboardCharts),
  { ssr: false, loading: () => (
    <div className="h-[400px] flex items-center justify-center bg-white/5 rounded-3xl border border-white/10">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
    </div>
  ) }
);

interface DashboardStats {
  totalRecords: number;
  totalInstitutes: number;
  totalBranches: number;
  yearsAvailable: number[];
  lastImport: string | null;
  recordsByType: { name: string; value: number }[];
  recordsByYear: { name: string; value: number }[];
  topBranches: { name: string; count: number }[];
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = () => {
    setLoading(true);
    setError('');

    fetch('/api/admin/dashboard')
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to fetch dashboard statistics');
        }
        return res.json();
      })
      .then(data => {
        setStats(data);
      })
      .catch(err => {
        setError(err.message || 'Something went wrong.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-gray-400 font-semibold text-sm">Loading admin dashboard statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4 bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <h3 className="font-bold text-white text-lg">Load Failed</h3>
        <p className="text-sm text-gray-400">{error}</p>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm cursor-pointer mx-auto"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Cutoff Records',
      value: stats?.totalRecords.toLocaleString('en-IN') || '0',
      description: 'Counselling rows stored',
      icon: Database,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Unique Colleges',
      value: stats?.totalInstitutes.toLocaleString('en-IN') || '0',
      description: 'IITs, NITs, IIITs, GFTIs',
      icon: Landmark,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Academic Branches',
      value: stats?.totalBranches.toLocaleString('en-IN') || '0',
      description: 'Engineering programs',
      icon: GitFork,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    },
    {
      title: 'Counselling Years',
      value: stats?.yearsAvailable.join(', ') || 'None',
      description: 'Active database years',
      icon: Calendar,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Overview Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">System Status</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {stats?.lastImport
              ? `Last database update: ${new Date(stats.lastImport).toLocaleString()}`
              : 'No imports completed yet'}
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Refresh Stats</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="glass-panel border border-white/10 rounded-xl p-6 flex items-center justify-between group hover:border-indigo-500/30 transition-all duration-300 shadow-card"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400">{kpi.title}</span>
                <span className="text-2xl font-extrabold text-white block">{kpi.value}</span>
                <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">{kpi.description}</span>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Graphs */}
      {stats && (
        <DashboardCharts
          recordsByType={stats.recordsByType}
          recordsByYear={stats.recordsByYear}
          topBranches={stats.topBranches}
        />
      )}
    </div>
  );
}
