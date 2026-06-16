'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, RefreshCcw, Loader2, Play, Settings, Eye } from 'lucide-react';
import Papa from 'papaparse';

interface ColumnMapping {
  year: string;
  round: string;
  instituteType: string;
  instituteName: string;
  branch: string;
  quota: string;
  category: string;
  gender: string;
  openingRank: string;
  closingRank: string;
}

const DEFAULT_MAPPING: ColumnMapping = {
  year: 'year',
  round: 'round',
  instituteType: 'type',
  instituteName: 'institute',
  branch: 'program',
  quota: 'quota',
  category: 'category',
  gender: 'gender',
  openingRank: 'orank',
  closingRank: 'crank',
};

export default function AdminImport() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // File states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);
  
  // Mapping & Config
  const [mapping, setMapping] = useState<ColumnMapping>({ ...DEFAULT_MAPPING });
  const [mode, setMode] = useState<'append' | 'replaceByYear' | 'replaceAll'>('append');
  const [forceYear, setForceYear] = useState('');
  
  // Transaction states
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    imported: number;
    skipped: number;
    total: number;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setError('');
    setResult(null);

    // Read first few lines for header detection and preview
    Papa.parse(file, {
      header: true,
      preview: 5,
      complete: (results) => {
        const fileHeaders = results.meta.fields || [];
        setHeaders(fileHeaders);
        setPreviewRows(results.data as Record<string, string>[]);
        
        // Auto map columns
        const autoMapped = autoMapHeaders(fileHeaders);
        setMapping(autoMapped);
      },
      error: (err) => {
        setError(`Failed to parse CSV file: ${err.message}`);
      }
    });
  };

  const autoMapHeaders = (fileHeaders: string[]): ColumnMapping => {
    const localMapping = { ...DEFAULT_MAPPING };
    const lowerHeaders = fileHeaders.map(h => h.toLowerCase().trim());

    const mappingRules: Record<keyof ColumnMapping, string[]> = {
      year: ['year', 'yr', 'counselling year'],
      round: ['round', 'rnd', 'counselling round'],
      instituteType: ['type', 'institute_type', 'inst_type', 'institutetype', 'institute type'],
      instituteName: ['institute', 'institute_name', 'institutename', 'college', 'college_name', 'institute name'],
      branch: ['program', 'branch', 'course', 'academic_program', 'programme', 'academic program'],
      quota: ['quota', 'seat_type', 'seat quota'],
      category: ['category', 'cat', 'seat_category', 'seat category'],
      gender: ['gender', 'gender_pool', 'sex', 'gender pool'],
      openingRank: ['orank', 'opening_rank', 'openingrank', 'open_rank', 'or', 'opening rank'],
      closingRank: ['crank', 'closing_rank', 'closingrank', 'close_rank', 'cr', 'closing rank'],
    };

    for (const [field, aliases] of Object.entries(mappingRules)) {
      for (const alias of aliases) {
        const foundIdx = lowerHeaders.indexOf(alias);
        if (foundIdx !== -1) {
          (localMapping as any)[field] = fileHeaders[foundIdx];
          break;
        }
      }
    }

    return localMapping;
  };

  const handleMappingChange = (field: keyof ColumnMapping, value: string) => {
    setMapping(prev => ({ ...prev, [field]: value }));
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setImporting(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('mode', mode);
    if (forceYear) {
      formData.append('forceYear', forceYear);
    }
    formData.append('mapping', JSON.stringify(mapping));

    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Import transaction failed');
      }

      const data = await res.json();
      setResult({
        imported: data.imported,
        skipped: data.skipped,
        total: data.total,
      });
      
      // Clear file selection
      setSelectedFile(null);
      setHeaders([]);
      setPreviewRows([]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong during import.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-white">Import Cutoff Data</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Upload JoSAA/CSAB counselling cutoff CSV files and map them to the database schema.
        </p>
      </div>

      {result && (
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <CheckCircle2 className="w-5 h-5" />
            <span>CSV Import Completed Successfully!</span>
          </div>
          <div className="grid grid-cols-3 gap-6 pt-3 border-t border-emerald-500/10 text-xs">
            <div>
              <span className="text-gray-400 font-semibold block">Total Rows Analyzed</span>
              <span className="text-base font-extrabold text-white">{result.total.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-emerald-400 font-semibold block">Rows Inserted</span>
              <span className="text-base font-extrabold text-emerald-300">{result.imported.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-amber-400 font-semibold block">Rows Skipped (Duplicates)</span>
              <span className="text-base font-extrabold text-amber-300">{result.skipped.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2.5 rounded-3xl bg-red-500/10 border border-red-500/20 p-5 text-xs text-red-400 font-bold">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Drag zone */}
      {!selectedFile && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/10 hover:border-indigo-500/40 rounded-3xl p-12 text-center bg-[#12121a]/30 hover:bg-[#12121a]/60 transition-all cursor-pointer group flex flex-col items-center justify-center space-y-4"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Click to upload CSV dataset</p>
            <p className="text-xs text-gray-500 font-semibold mt-1">Supports standard JoSAA CSV format (~12k rows)</p>
          </div>
        </div>
      )}

      {/* Mapping & Preview Config */}
      {selectedFile && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#12121a]/60 p-6 backdrop-blur-md space-y-6">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="font-bold text-white text-sm">{selectedFile.name}</h4>
                <p className="text-xs text-gray-500 font-semibold">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>

            {/* Mode & Year Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/5 pt-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Import Mode</label>
                <select
                  value={mode}
                  onChange={e => setMode(e.target.value as any)}
                  className="w-full text-sm rounded-xl border border-white/10 bg-[#0a0a0f] px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="append">Append (Skip duplicates)</option>
                  <option value="replaceByYear">Replace overlapping years</option>
                  <option value="replaceAll">Replace entire database</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Force Year Override</label>
                <input
                  type="number"
                  placeholder="e.g. 2026 (Optional)"
                  value={forceYear}
                  onChange={e => setForceYear(e.target.value)}
                  className="w-full text-sm rounded-xl border border-white/10 bg-[#0a0a0f] px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Column Mapping Selectors */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <h5 className="font-bold text-white text-sm flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                <span>Verify CSV Column Mapping</span>
              </h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(mapping).map(field => {
                  const label = field.replace(/([A-Z])/g, ' $1');
                  return (
                    <div key={field} className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider capitalize">
                        {label}
                      </label>
                      <select
                        value={(mapping as any)[field]}
                        onChange={e => handleMappingChange(field as any, e.target.value)}
                        className="w-full text-xs rounded-lg border border-white/5 bg-[#0a0a0f] px-2.5 py-2 text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                      >
                        <option value="">-- Skip Column --</option>
                        {headers.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Import Trigger */}
            <div className="border-t border-white/5 pt-6 flex items-center gap-4">
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-sm font-bold text-white hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all cursor-pointer shadow-lg"
              >
                {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Start Data Import</span>
              </button>
              <button
                onClick={() => { setSelectedFile(null); setHeaders([]); setPreviewRows([]); }}
                disabled={importing}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* File Row Preview */}
          {previewRows.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-[#12121a]/60 p-6 backdrop-blur-md space-y-4 overflow-hidden">
              <h5 className="font-bold text-white text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span>File Content Preview (First 5 rows)</span>
              </h5>
              
              <div className="overflow-x-auto rounded-xl border border-white/5">
                <table className="w-full text-left text-xs text-gray-400">
                  <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-wider text-white">
                    <tr>
                      {headers.map(h => (
                        <th key={h} className="px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {previewRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        {headers.map(h => (
                          <td key={h} className="px-4 py-2 truncate max-w-[120px]" title={row[h]}>
                            {row[h]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
