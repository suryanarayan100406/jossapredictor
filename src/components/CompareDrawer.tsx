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
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 sm:px-6 py-4 bg-bg-overlay border-t border-border-default shadow-elevated">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Count & Actions */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-[30px] h-[30px] rounded-xs bg-white/[0.03] border border-border-default flex items-center justify-center text-text-primary">
              <GitCompare className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="font-medium text-white text-sm font-display">Compare Colleges</h4>
              <p className="text-xs text-[var(--text-secondary)] font-mono">
                {selectedItems.length} of 4 selected
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-xs)] text-xs font-medium text-[var(--text-secondary)] hover:text-white border border-transparent hover:border-zinc-800 hover:bg-white/5 transition-all cursor-pointer font-mono"
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
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-white max-w-[240px] shrink-0 bg-bg-surface border border-border-default rounded-xs"
            >
              <div className="truncate">
                <span className="font-semibold block text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-mono">
                  {item.instituteType}
                </span>
                <span className="font-medium truncate block max-w-[180px] font-display">
                  {item.instituteName.replace('Indian Institute of Technology', 'IIT').replace('National Institute of Technology', 'NIT')}
                </span>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-white rounded-[var(--radius-xs)] p-0.5 hover:bg-white/10 transition-colors cursor-pointer"
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
            className="w-full md:w-auto btn-brand justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare Side-by-Side</span>
          </button>
        </div>
      </div>
    </div>
  );
}
