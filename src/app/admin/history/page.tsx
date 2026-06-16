'use client';

import React, { useState, useEffect } from 'react';
import { History, FileText, CheckCircle2, AlertTriangle, User, Calendar, Loader2 } from 'lucide-react';

interface ImportLogItem {
  id: number;
  filename: string;
  rowsTotal: number;
  rowsImported: number;
  rowsSkipped: number;
  errors: string; // JSON string array
  importedAt: string;
  admin: {
    email: string;
  };
}

export default function AdminHistory() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ImportLogItem[]>([]);
  const [error, setError] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    setLoading(true);
    setError('');

    fetch('/api/admin/import/history')
      .then(async res => {
        if (!res.ok) throw new Error('Failed to load history');
        return res.json();
      })
      .then(data => {
        setLogs(data.logs || []);
      })
      .catch(err => {
        setError(err.message || 'Something went wrong.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const parseErrors = (errorsJson: string): string[] => {
    try {
      return JSON.parse(errorsJson) || [];
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-gray-400 font-semibold text-sm">Loading import history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-white">Import History & Audit Log</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Audit trail of all JoSAA CSV cutoff files imported by the administration.
        </p>
      </div>

      {error ? (
        <div className="max-w-md mx-auto text-center py-20 space-y-4 bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
          <h3 className="font-bold text-white text-lg">Load Failed</h3>
          <p className="text-sm text-gray-400">{error}</p>
          <button
            onClick={fetchLogs}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm cursor-pointer mx-auto"
          >
            Retry
          </button>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl p-8 space-y-4 max-w-lg mx-auto">
          <History className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="font-bold text-white text-lg">No history logs</h3>
          <p className="text-sm text-gray-400">
            Once you import a CSV cutoff dataset, details of the import transaction will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map(log => {
            const parsedErrors = parseErrors(log.errors);
            const isExpanded = expandedLogId === log.id;

            return (
              <div
                key={log.id}
                className="rounded-3xl border border-white/10 bg-[#12121a]/60 p-6 backdrop-blur-md space-y-4 hover:border-indigo-500/25 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* File & Creator */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{log.filename}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-gray-500" />
                          <span>{log.admin.email}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          <span>{new Date(log.importedAt).toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="flex gap-8 text-xs">
                    <div>
                      <span className="text-gray-500 font-semibold block uppercase">Total Rows</span>
                      <span className="text-sm font-extrabold text-white">{log.rowsTotal.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-emerald-500 font-semibold block uppercase">Imported</span>
                      <span className="text-sm font-extrabold text-emerald-400">{log.rowsImported.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-amber-500 font-semibold block uppercase">Skipped / Dupes</span>
                      <span className="text-sm font-extrabold text-amber-400">{log.rowsSkipped.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Error log details */}
                {parsedErrors.length > 0 && (
                  <div className="border-t border-white/5 pt-4 mt-2">
                    <button
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Hide' : 'View'} Import Warnings ({parsedErrors.length})</span>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 p-4 max-h-48 overflow-y-auto space-y-1.5">
                        {parsedErrors.map((err, idx) => (
                          <div key={idx} className="text-xs text-amber-300 font-semibold">
                            ⚠️ {err}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
