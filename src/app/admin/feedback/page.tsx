'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, Trash2, Mail, Calendar, RefreshCcw, Loader2, AlertCircle } from 'lucide-react';

interface FeedbackItem {
  id: number;
  message: string;
  email: string;
  createdAt: string;
}

export default function AdminFeedback() {
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = () => {
    setLoading(true);
    setError('');
    setSelectedIds([]);

    fetch('/api/admin/feedback')
      .then(async res => {
        if (!res.ok) throw new Error('Failed to load feedback');
        return res.json();
      })
      .then(data => {
        setFeedback(data.feedback || []);
      })
      .catch(err => {
        setError(err.message || 'Something went wrong.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteSingle = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Failed to delete feedback');

      setFeedback(prev => prev.filter(item => item.id !== id));
      setSelectedIds(prev => prev.filter(x => x !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleDeleteBulk = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedIds.length} selected feedback items?`)) return;

    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!res.ok) throw new Error('Failed to delete feedback');

      setFeedback(prev => prev.filter(item => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === feedback.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(feedback.map(x => x.id));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-gray-400 font-semibold text-sm">Loading feedback messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">User Feedback Inbox</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Read comments, feature requests, and reports sent by students.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteBulk}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer animate-fade-in"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}
          <button
            onClick={fetchFeedback}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Refresh Inbox</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="max-w-md mx-auto text-center py-20 space-y-4 bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <h3 className="font-bold text-white text-lg">Load Failed</h3>
          <p className="text-sm text-gray-400">{error}</p>
          <button
            onClick={fetchFeedback}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm cursor-pointer mx-auto"
          >
            Retry
          </button>
        </div>
      ) : feedback.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl p-8 space-y-4 max-w-lg mx-auto">
          <HelpCircle className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="font-bold text-white text-lg">Your inbox is empty</h3>
          <p className="text-sm text-gray-400">
            Any feedback submitted by users from the Predictor widget will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#12121a]/60 backdrop-blur-md overflow-hidden">
          <table className="w-full border-collapse text-left text-sm text-gray-300">
            <thead className="border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-white">
              <tr>
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === feedback.length && feedback.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-6 py-4">Sender Details</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {feedback.map(item => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr key={item.id} className={`hover:bg-white/5 transition-colors ${isSelected ? 'bg-indigo-500/5' : ''}`}>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      {item.email ? (
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                          <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                          <span>{item.email}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 italic">Anonymous User</span>
                      )}
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-600" />
                        <span>{new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 max-w-md break-words leading-relaxed">
                      {item.message}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteSingle(item.id)}
                        className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        title="Delete message"
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
      )}
    </div>
  );
}
