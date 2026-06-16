import React from 'react';
import { X, GitCompare, Trash2 } from 'lucide-react';
import { PredictionResult } from '@/types';
import { useRouter } from 'next/navigation';

interface CompareDrawerProps {
  selectedItems: PredictionResult[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export function CompareDrawer({ selectedItems, onRemove, onClear }: CompareDrawerProps) {
  const router = useRouter();

  if (selectedItems.length === 0) return null;

  const handleCompareClick = () => {
    const ids = selectedItems.map(item => item.id).join(',');
    router.push(`/compare?ids=${ids}`);
  };

  return (
    <div style={{
      background: 'var(--bg-overlay)',
      borderTop: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-elevated)',
    }} className="fixed bottom-0 left-0 right-0 z-40 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Count & Actions */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--brand-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand)' }}>
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm font-display">Compare Colleges</h4>
              <p className="text-xs text-[var(--text-secondary)] font-mono">
                {selectedItems.length} of 4 selected
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--ambitious-text)] hover:bg-white/5 transition-all cursor-pointer font-mono"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>

        {/* Middle: Horizontal list of items */}
        <div className="flex flex-wrap items-center gap-2 max-w-full md:max-w-2xl overflow-x-auto py-1 w-full md:w-auto">
          {selectedItems.map(item => (
            <div
              key={item.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-white max-w-[240px] shrink-0"
            >
              <div className="truncate">
                <span className="font-bold block text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-mono">
                  {item.instituteType}
                </span>
                <span className="font-semibold truncate block max-w-[180px] font-display">
                  {item.instituteName.replace('Indian Institute of Technology', 'IIT').replace('National Institute of Technology', 'NIT')}
                </span>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-white rounded-full p-0.5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Side: Compare Button */}
        <div className="w-full md:w-auto">
          <button
            onClick={handleCompareClick}
            disabled={selectedItems.length < 2}
            className="w-full md:w-auto btn-brand justify-center disabled:opacity-50"
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare Side-by-Side</span>
          </button>
        </div>
      </div>
    </div>
  );
}
