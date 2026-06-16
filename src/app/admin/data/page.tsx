'use client';

import React, { useState, useEffect } from 'react';
import {
  Database, Search, Trash2, Plus, Edit2, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, Save, X, Filter, RefreshCcw, Download
} from 'lucide-react';
import { CutoffRecord } from '@/types';
import { INDIAN_STATES, CATEGORIES, QUOTAS, INSTITUTE_TYPES, GENDER_POOLS } from '@/lib/constants';

export default function AdminData() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<CutoffRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');

  // Table criteria
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [quotaFilter, setQuotaFilter] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Multi-select actions
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkFilterDeleteYear, setBulkFilterDeleteYear] = useState('');
  const [bulkFilterDeleteType, setBulkFilterDeleteType] = useState('');

  // Editing / Creating modals
  const [editingRecord, setEditingRecord] = useState<Partial<CutoffRecord> | null>(null);
  const [creatingRecord, setCreatingRecord] = useState<Partial<CutoffRecord> | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [page, search, yearFilter, typeFilter, categoryFilter, quotaFilter, sortBy, sortOrder]);

  // Handle page resets on filter change
  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setPage(1);
  };

  const fetchRecords = () => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams({
      page: page.toString(),
      limit: '50',
      search,
      sortBy,
      sortOrder,
    });
    if (yearFilter) params.append('year', yearFilter);
    if (typeFilter) params.append('instituteType', typeFilter);
    if (categoryFilter) params.append('category', categoryFilter);
    if (quotaFilter) params.append('quota', quotaFilter);

    fetch(`/api/admin/cutoffs?${params.toString()}`)
      .then(async res => {
        if (!res.ok) throw new Error('Failed to load cutoff records');
        return res.json();
      })
      .then(data => {
        setRecords(data.records || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      })
      .catch(err => {
        setError(err.message || 'Something went wrong.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteSingle = async (id: number) => {
    if (!confirm('Are you sure you want to delete this cutoff record?')) return;

    try {
      const res = await fetch(`/api/admin/cutoffs/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete record');
      fetchRecords();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedIds.length} selected cutoff records?`)) return;

    try {
      const res = await fetch('/api/admin/cutoffs/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!res.ok) throw new Error('Bulk delete failed');
      setSelectedIds([]);
      fetchRecords();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const handleDeleteByFilter = async () => {
    if (!bulkFilterDeleteYear && !bulkFilterDeleteType) {
      alert('Please select at least one criteria (Year or Institute Type) to perform bulk deletion.');
      return;
    }

    const desc = [
      bulkFilterDeleteYear ? `Year: ${bulkFilterDeleteYear}` : '',
      bulkFilterDeleteType ? `Type: ${bulkFilterDeleteType}` : '',
    ].filter(Boolean).join(' and ');

    if (!confirm(`⚠️ CRITICAL WARNING!\nYou are about to delete ALL cutoff records matching: ${desc}.\nThis action CANNOT be undone. Are you sure you want to proceed?`)) return;

    try {
      const res = await fetch('/api/admin/cutoffs/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filter: {
            year: bulkFilterDeleteYear ? parseInt(bulkFilterDeleteYear) : undefined,
            instituteType: bulkFilterDeleteType || undefined,
          }
        }),
      });
      if (!res.ok) throw new Error('Bulk delete by filter failed');
      
      const data = await res.json();
      alert(`Successfully deleted ${data.deleted} records.`);
      setBulkFilterDeleteYear('');
      setBulkFilterDeleteType('');
      fetchRecords();
    } catch (err: any) {
      alert(err.message || 'Bulk delete failed');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatingRecord) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/cutoffs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creatingRecord),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create cutoff record');
      }

      setCreatingRecord(null);
      fetchRecords();
    } catch (err: any) {
      alert(err.message || 'Create failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/cutoffs/${editingRecord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRecord),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update cutoff record');
      }

      setEditingRecord(null);
      fetchRecords();
    } catch (err: any) {
      alert(err.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === records.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(records.map(x => x.id));
    }
  };

  const handleExportCSV = () => {
    const params = new URLSearchParams({
      search,
    });
    if (yearFilter) params.append('year', yearFilter);
    if (typeFilter) params.append('instituteType', typeFilter);
    if (categoryFilter) params.append('category', categoryFilter);
    if (quotaFilter) params.append('quota', quotaFilter);

    window.open(`/api/admin/cutoffs/export?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Cutoffs Database Management</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Modify or delete cutoff ranks. Add individual cutoff rows manually.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setCreatingRecord({
              year: 2025,
              round: 1,
              instituteType: 'IIT',
              instituteName: '',
              branch: '',
              quota: 'AI',
              category: 'OPEN',
              gender: 'Gender-Neutral',
              openingRank: 0,
              closingRank: 0,
            })}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:from-indigo-600 hover:to-purple-700 transition-all cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Record</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Advanced Bulk Delete section */}
      <div className="rounded-3xl border border-red-500/10 bg-red-500/[0.02] p-5 space-y-4">
        <h4 className="font-bold text-red-400 text-sm flex items-center gap-1.5">
          <AlertCircle className="w-4.5 h-4.5" />
          <span>Advanced Bulk Delete Tools</span>
        </h4>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <select
            value={bulkFilterDeleteYear}
            onChange={e => setBulkFilterDeleteYear(e.target.value)}
            className="rounded-lg border border-white/5 bg-[#0a0a0f] px-3 py-2 text-white cursor-pointer"
          >
            <option value="">Choose Year</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
          <select
            value={bulkFilterDeleteType}
            onChange={e => setBulkFilterDeleteType(e.target.value)}
            className="rounded-lg border border-white/5 bg-[#0a0a0f] px-3 py-2 text-white cursor-pointer"
          >
            <option value="">Choose Type</option>
            <option value="IIT">IIT</option>
            <option value="NIT">NIT</option>
            <option value="IIIT">IIIT</option>
            <option value="GFTI">GFTI</option>
          </select>
          <button
            onClick={handleDeleteByFilter}
            disabled={!bulkFilterDeleteYear && !bulkFilterDeleteType}
            className="bg-red-500/15 border border-red-500/20 text-red-400 hover:bg-red-500/25 px-4 py-2 rounded-lg font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            Delete matching records
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search college name, program..."
            value={search}
            onChange={e => handleFilterChange(setSearch, e.target.value)}
            className="w-full text-xs rounded-xl border border-white/10 bg-[#12121a]/60 pl-9 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <select
          value={yearFilter}
          onChange={e => handleFilterChange(setYearFilter, e.target.value)}
          className="text-xs rounded-xl border border-white/10 bg-[#12121a]/60 px-3.5 py-2.5 text-white focus:border-indigo-500 cursor-pointer"
        >
          <option value="">All Years</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
        <select
          value={typeFilter}
          onChange={e => handleFilterChange(setTypeFilter, e.target.value)}
          className="text-xs rounded-xl border border-white/10 bg-[#12121a]/60 px-3.5 py-2.5 text-white focus:border-indigo-500 cursor-pointer"
        >
          <option value="">All Types</option>
          {INSTITUTE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={categoryFilter}
          onChange={e => handleFilterChange(setCategoryFilter, e.target.value)}
          className="text-xs rounded-xl border border-white/10 bg-[#12121a]/60 px-3.5 py-2.5 text-white focus:border-indigo-500 cursor-pointer"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Bulk Delete Selected trigger */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-2xl animate-fade-in">
          <span className="text-xs text-gray-400 font-semibold">{selectedIds.length} cutoff rows selected.</span>
          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/25 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Selected ({selectedIds.length})</span>
          </button>
        </div>
      )}

      {/* Main Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="text-gray-400 font-semibold text-xs">Loading cutoff records from server...</p>
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto text-center py-20 space-y-4 bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <h3 className="font-bold text-white text-lg">Load Failed</h3>
          <p className="text-sm text-gray-400">{error}</p>
          <button
            onClick={fetchRecords}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm cursor-pointer mx-auto"
          >
            Retry
          </button>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl p-8 space-y-4 max-w-lg mx-auto">
          <Database className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="font-bold text-white text-lg">No records found</h3>
          <p className="text-sm text-gray-400">
            Check your search filters or upload a CSV dataset to seed the database.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-[#12121a]/60 backdrop-blur-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs text-gray-300">
                <thead className="border-b border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-white">
                  <tr>
                    <th className="px-4 py-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === records.length && records.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="px-4 py-3.5">Counselling</th>
                    <th className="px-4 py-3.5">College & Program</th>
                    <th className="px-4 py-3.5">Quota</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Gender</th>
                    <th className="px-4 py-3.5 text-right">Cutoffs</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {records.map(rec => {
                    const isSelected = selectedIds.includes(rec.id);
                    return (
                      <tr key={rec.id} className={`hover:bg-white/5 transition-colors ${isSelected ? 'bg-indigo-500/5' : ''}`}>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(rec.id)}
                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-white block">Year {rec.year}</span>
                          <span className="text-gray-500 block">Round {rec.round}</span>
                        </td>
                        <td className="px-4 py-3 max-w-sm">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-white/10 text-white uppercase shrink-0">
                              {rec.instituteType}
                            </span>
                            <span className="font-bold text-white truncate block max-w-[240px]" title={rec.instituteName}>
                              {rec.instituteName}
                            </span>
                          </div>
                          <span className="text-gray-400 block mt-0.5 truncate max-w-[240px]" title={rec.branch}>
                            {rec.branch}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-300">{rec.quota}</td>
                        <td className="px-4 py-3 text-gray-400 font-medium">{rec.category}</td>
                        <td className="px-4 py-3 text-gray-500 font-medium">{rec.gender}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="text-gray-500">O: <span className="font-bold text-gray-400">{rec.openingRank.toLocaleString('en-IN')}</span></div>
                          <div className="text-gray-400">C: <span className="font-bold text-white">{rec.closingRank.toLocaleString('en-IN')}</span></div>
                        </td>
                        <td className="px-6 py-3 text-right space-x-1 shrink-0">
                          <button
                            onClick={() => setEditingRecord({ ...rec })}
                            className="text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                            title="Edit record"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSingle(rec.id)}
                            className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination bar */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-xs text-gray-400 font-semibold">
              Showing page {page} of {totalPages} ({total} records total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-1 border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold disabled:opacity-30 cursor-pointer transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-1 border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold disabled:opacity-30 cursor-pointer transition-all"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Dialog Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0a0a0f] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingRecord(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-white text-lg flex items-center gap-2 mb-6 pr-6">
              <Edit2 className="w-5 h-5 text-indigo-400" />
              <span>Modify Cutoff Record</span>
            </h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Year</label>
                  <input
                    type="number"
                    value={editingRecord.year || 2025}
                    onChange={e => setEditingRecord({ ...editingRecord, year: parseInt(e.target.value) })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Round</label>
                  <input
                    type="number"
                    value={editingRecord.round || 1}
                    onChange={e => setEditingRecord({ ...editingRecord, round: parseInt(e.target.value) })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Institute Type</label>
                  <select
                    value={editingRecord.instituteType || 'IIT'}
                    onChange={e => setEditingRecord({ ...editingRecord, instituteType: e.target.value })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-[#0a0a0f] px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {INSTITUTE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Quota</label>
                  <select
                    value={editingRecord.quota || 'AI'}
                    onChange={e => setEditingRecord({ ...editingRecord, quota: e.target.value })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-[#0a0a0f] px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {QUOTAS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">College Name</label>
                <input
                  type="text"
                  value={editingRecord.instituteName || ''}
                  onChange={e => setEditingRecord({ ...editingRecord, instituteName: e.target.value })}
                  className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Academic Program / Branch</label>
                <input
                  type="text"
                  value={editingRecord.branch || ''}
                  onChange={e => setEditingRecord({ ...editingRecord, branch: e.target.value })}
                  className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={editingRecord.category || 'OPEN'}
                    onChange={e => setEditingRecord({ ...editingRecord, category: e.target.value })}
                    className="w-full text-xs rounded-xl border border-white/10 bg-[#0a0a0f] px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Gender Pool</label>
                  <select
                    value={editingRecord.gender || 'Gender-Neutral'}
                    onChange={e => setEditingRecord({ ...editingRecord, gender: e.target.value })}
                    className="w-full text-xs rounded-xl border border-white/10 bg-[#0a0a0f] px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {GENDER_POOLS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Opening Rank</label>
                  <input
                    type="number"
                    value={editingRecord.openingRank || 0}
                    onChange={e => setEditingRecord({ ...editingRecord, openingRank: parseInt(e.target.value) })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Closing Rank</label>
                  <input
                    type="number"
                    value={editingRecord.closingRank || 0}
                    onChange={e => setEditingRecord({ ...editingRecord, closingRank: parseInt(e.target.value) })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-sm font-bold text-white hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all cursor-pointer shadow-lg"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Record Dialog Modal */}
      {creatingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0a0a0f] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCreatingRecord(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-white text-lg flex items-center gap-2 mb-6 pr-6">
              <Plus className="w-5 h-5 text-indigo-400" />
              <span>Add Single Cutoff Record</span>
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Year</label>
                  <input
                    type="number"
                    value={creatingRecord.year || 2025}
                    onChange={e => setCreatingRecord({ ...creatingRecord, year: parseInt(e.target.value) })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Round</label>
                  <input
                    type="number"
                    value={creatingRecord.round || 1}
                    onChange={e => setCreatingRecord({ ...creatingRecord, round: parseInt(e.target.value) })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Institute Type</label>
                  <select
                    value={creatingRecord.instituteType || 'IIT'}
                    onChange={e => setCreatingRecord({ ...creatingRecord, instituteType: e.target.value })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-[#0a0a0f] px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {INSTITUTE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Quota</label>
                  <select
                    value={creatingRecord.quota || 'AI'}
                    onChange={e => setCreatingRecord({ ...creatingRecord, quota: e.target.value })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-[#0a0a0f] px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {QUOTAS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">College Name</label>
                <input
                  type="text"
                  placeholder="e.g. Indian Institute of Technology Bombay"
                  value={creatingRecord.instituteName || ''}
                  onChange={e => setCreatingRecord({ ...creatingRecord, instituteName: e.target.value })}
                  className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Academic Program / Branch</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science and Engineering"
                  value={creatingRecord.branch || ''}
                  onChange={e => setCreatingRecord({ ...creatingRecord, branch: e.target.value })}
                  className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={creatingRecord.category || 'OPEN'}
                    onChange={e => setCreatingRecord({ ...creatingRecord, category: e.target.value })}
                    className="w-full text-xs rounded-xl border border-white/10 bg-[#0a0a0f] px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Gender Pool</label>
                  <select
                    value={creatingRecord.gender || 'Gender-Neutral'}
                    onChange={e => setCreatingRecord({ ...creatingRecord, gender: e.target.value })}
                    className="w-full text-xs rounded-xl border border-white/10 bg-[#0a0a0f] px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {GENDER_POOLS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Opening Rank</label>
                  <input
                    type="number"
                    value={creatingRecord.openingRank || 0}
                    onChange={e => setCreatingRecord({ ...creatingRecord, openingRank: parseInt(e.target.value) })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Closing Rank</label>
                  <input
                    type="number"
                    value={creatingRecord.closingRank || 0}
                    onChange={e => setCreatingRecord({ ...creatingRecord, closingRank: parseInt(e.target.value) })}
                    className="w-full text-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-sm font-bold text-white hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all cursor-pointer shadow-lg"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Add Cutoff Record</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCreatingRecord(null)}
                  disabled={submitting}
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
