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
    const ids = selectedItems.map((item) => item.id).join(',');
    router.push(`/compare?ids=${ids}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 sm:px-6 pb-4 pt-0">
      <div className="max-w-6xl mx-auto bg-bg-elevated border border-border-default rounded-3xl shadow-elevated px-4 sm:px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: count & clear */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-dim flex items-center justify-center text-brand">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-text-primary text-sm font-display">Compare colleges</h4>
              <p className="text-xs text-text-secondary">{selectedItems.length} of 4 picked</p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-text-secondary hover:text-ambitious-text border border-border-default hover:border-ambitious-border hover:bg-ambitious-bg transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear all</span>
          </button>
        </div>

        {/* Middle: chips */}
        <div className="flex flex-nowrap items-center gap-2 max-w-full md:max-w-xl overflow-x-auto py-1 w-full md:w-auto">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 text-xs max-w-[240px] shrink-0 bg-bg-base border border-border-default rounded-full"
            >
              <div className="truncate">
                <span className="font-bold block text-[10px] text-brand uppercase tracking-wide">
                  {item.instituteType}
                </span>
                <span className="font-semibold truncate block max-w-[170px] text-text-primary">
                  {item.instituteName
                    .replace('Indian Institute of Technology', 'IIT')
                    .replace('National Institute of Technology', 'NIT')}
                </span>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-text-muted hover:text-text-primary rounded-full p-0.5 hover:bg-border-default transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Right: compare button */}
        <div className="w-full md:w-auto">
          <button
            onClick={handleCompareClick}
            disabled={selectedItems.length < 2}
            className="w-full md:w-auto btn-brand justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare side by side</span>
          </button>
        </div>
      </div>
    </div>
  );
}
