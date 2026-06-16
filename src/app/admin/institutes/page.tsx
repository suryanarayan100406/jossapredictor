'use client';

import React, { useState, useEffect } from 'react';
import { Landmark, Search, Edit2, Globe, MapPin, Trophy, RefreshCcw, Loader2, AlertCircle, Save, X } from 'lucide-react';

interface Institute {
  id: number;
  name: string;
  type: string;
  state: string;
  city: string;
  website: string;
  nirfRank: number | null;
  logoUrl: string;
}

export default function AdminInstitutes() {
  const [loading, setLoading] = useState(true);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [error, setError] = useState('');
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Editing state
  const [editingInst, setEditingInst] = useState<Institute | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = () => {
    setLoading(true);
    setError('');

    fetch('/api/admin/institutes')
      .then(async res => {
        if (!res.ok) throw new Error('Failed to load institutes');
        return res.json();
      })
      .then(data => {
        setInstitutes(data.institutes || []);
      })
      .catch(err => {
        setError(err.message || 'Something went wrong.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEditClick = (inst: Institute) => {
    setEditingInst({ ...inst });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInst) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/institutes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingInst.id,
          state: editingInst.state,
          city: editingInst.city,
          website: editingInst.website,
          nirfRank: editingInst.nirfRank ? parseInt(editingInst.nirfRank.toString()) : null,
          logoUrl: editingInst.logoUrl,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update institute');
      }

      setInstitutes(prev => prev.map(inst => inst.id === editingInst.id ? editingInst : inst));
      setEditingInst(null);
    } catch (err: any) {
      alert(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const filtered = institutes.filter(inst => {
    const query = search.toLowerCase();
    const matchesSearch = inst.name.toLowerCase().includes(query) || inst.city.toLowerCase().includes(query) || inst.state.toLowerCase().includes(query);
    const matchesType = typeFilter ? inst.type === typeFilter : true;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-gray-400 font-semibold text-sm">Loading institutes database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Institute Metadata Directory</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage enrichments like NIRF rank, official websites, states, and cities for JoSAA colleges.
          </p>
        </div>
        <button
          onClick={fetchInstitutes}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by college name, city or state..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-sm rounded-xl border border-white/10 bg-[#12121a]/60 pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="text-sm rounded-xl border border-white/10 bg-[#12121a]/60 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none transition-colors cursor-pointer"
        >
          <option value="">All Institute Types</option>
          <option value="IIT">IITs</option>
          <option value="NIT">NITs</option>
          <option value="IIIT">IIITs</option>
          <option value="GFTI">GFTIs</option>
        </select>
      </div>

      {error ? (
        <div className="max-w-md mx-auto text-center py-20 space-y-4 bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <h3 className="font-bold text-white text-lg">Load Failed</h3>
          <p className="text-sm text-gray-400">{error}</p>
          <button
            onClick={fetchInstitutes}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm cursor-pointer mx-auto"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#12121a]/60 backdrop-blur-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-300">
              <thead className="border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-white">
                <tr>
                  <th className="px-6 py-4">College Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">NIRF Rank</th>
                  <th className="px-6 py-4">Website</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(inst => (
                  <tr key={inst.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider bg-white/10 text-white uppercase shrink-0">
                          {inst.type}
                        </span>
                        <span className="font-bold text-white">{inst.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                        <span>{inst.city ? `${inst.city}, ` : ''}{inst.state}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {inst.nirfRank ? (
                        <div className="flex items-center gap-1 font-bold text-amber-400">
                          <Trophy className="w-4 h-4" />
                          <span>#{inst.nirfRank}</span>
                        </div>
                      ) : (
                        <span className="text-gray-600 italic">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {inst.website ? (
                        <a
                          href={inst.website.startsWith('http') ? inst.website : `https://${inst.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[150px]">{inst.website}</span>
                        </a>
                      ) : (
                        <span className="text-gray-600 italic">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEditClick(inst)}
                        className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        title="Edit metadata"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal Dialog */}
      {editingInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0a0a0f] p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingInst(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-white text-lg flex items-center gap-2 mb-2 pr-6">
              <Landmark className="w-5 h-5 text-indigo-400" />
              <span>Edit Institute Metadata</span>
            </h3>
            <p className="text-xs text-gray-400 mb-6">{editingInst.name}</p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inst-city" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    City
                  </label>
                  <input
                    id="inst-city"
                    type="text"
                    value={editingInst.city}
                    onChange={e => setEditingInst({ ...editingInst, city: e.target.value })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="inst-state" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    State
                  </label>
                  <input
                    id="inst-state"
                    type="text"
                    value={editingInst.state}
                    onChange={e => setEditingInst({ ...editingInst, state: e.target.value })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inst-website" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Official Website
                </label>
                <input
                  id="inst-website"
                  type="text"
                  placeholder="e.g. www.iitb.ac.in"
                  value={editingInst.website}
                  onChange={e => setEditingInst({ ...editingInst, website: e.target.value })}
                  className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inst-nirf" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    NIRF Engineering Rank
                  </label>
                  <input
                    id="inst-nirf"
                    type="number"
                    placeholder="e.g. 3"
                    value={editingInst.nirfRank || ''}
                    onChange={e => setEditingInst({ ...editingInst, nirfRank: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="inst-logo" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Logo Image URL
                  </label>
                  <input
                    id="inst-logo"
                    type="text"
                    placeholder="e.g. /images/logo.png"
                    value={editingInst.logoUrl}
                    onChange={e => setEditingInst({ ...editingInst, logoUrl: e.target.value })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-sm font-bold text-white hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all cursor-pointer shadow-lg"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingInst(null)}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
