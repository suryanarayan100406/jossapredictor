'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCcw, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [safeMultiplier, setSafeMultiplier] = useState(0.90);
  const [moderateMultiplier, setModerateMultiplier] = useState(1.10);
  const [ambitiousMultiplier, setAmbitiousMultiplier] = useState(1.30);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    fetch('/api/admin/settings')
      .then(async res => {
        if (!res.ok) throw new Error('Failed to load settings');
        return res.json();
      })
      .then(data => {
        if (data && data.settings) {
          setSafeMultiplier(data.settings.safeMultiplier ?? 0.90);
          setModerateMultiplier(data.settings.moderateMultiplier ?? 1.10);
          setAmbitiousMultiplier(data.settings.ambitiousMultiplier ?? 1.30);
        }
      })
      .catch(err => {
        setError(err.message || 'Something went wrong.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          safeMultiplier,
          moderateMultiplier,
          ambitiousMultiplier,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update settings');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-gray-400 font-semibold text-sm">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-white">Prediction Settings</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Tune the thresholds used to calculate college admission chances.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#12121a]/60 p-8 backdrop-blur-md">
        <form onSubmit={handleSave} className="space-y-8">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-400 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-3.5 text-xs text-emerald-400 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          {/* Safe Threshold */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="block text-sm font-bold text-white">Safe Admission Multiplier</label>
                <span className="text-xs text-gray-400">Green zone limit. Closing cutoff is scaled by this multiplier.</span>
              </div>
              <span className="text-lg font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl">
                {safeMultiplier.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.50"
              max="1.50"
              step="0.05"
              value={safeMultiplier}
              onChange={e => setSafeMultiplier(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg bg-gray-800 accent-indigo-500 cursor-pointer"
            />
            <div className="text-[10px] text-gray-500 font-semibold italic">
              Example: If closing rank is 10,000, student rank must be {Math.round(10000 * safeMultiplier).toLocaleString()} or lower to be Safe.
            </div>
          </div>

          {/* Moderate Threshold */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="block text-sm font-bold text-white">Moderate Admission Multiplier</label>
                <span className="text-xs text-gray-400">Amber zone limit. Matches above Safe but below this threshold.</span>
              </div>
              <span className="text-lg font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl">
                {moderateMultiplier.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.80"
              max="1.80"
              step="0.05"
              value={moderateMultiplier}
              onChange={e => setModerateMultiplier(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg bg-gray-800 accent-indigo-500 cursor-pointer"
            />
            <div className="text-[10px] text-gray-500 font-semibold italic">
              Example: If closing rank is 10,000, student rank must be {Math.round(10000 * moderateMultiplier).toLocaleString()} or lower to be Moderate.
            </div>
          </div>

          {/* Ambitious Threshold */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="block text-sm font-bold text-white">Ambitious Admission Multiplier</label>
                <span className="text-xs text-gray-400">Red zone limit. Anything above this is categorized as a Long Shot.</span>
              </div>
              <span className="text-lg font-extrabold text-red-400 bg-red-500/10 px-3 py-1 rounded-xl">
                {ambitiousMultiplier.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="1.00"
              max="2.00"
              step="0.05"
              value={ambitiousMultiplier}
              onChange={e => setAmbitiousMultiplier(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg bg-gray-800 accent-indigo-500 cursor-pointer"
            />
            <div className="text-[10px] text-gray-500 font-semibold italic">
              Example: If closing rank is 10,000, student rank must be {Math.round(10000 * ambitiousMultiplier).toLocaleString()} or lower to be Ambitious.
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-sm font-bold text-white hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-indigo-500/10"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
            <button
              type="button"
              onClick={fetchSettings}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
