import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0f]/95 border-t border-white/10 shadow-2xl backdrop-blur-xl px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Count & Actions */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Compare Colleges</h4>
              <p className="text-xs text-gray-400">
                {selectedItems.length} of 4 selected
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
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
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-white max-w-[240px] shrink-0"
            >
              <div className="truncate">
                <span className="font-bold block text-[10px] text-gray-400 uppercase tracking-wider">
                  {item.instituteType}
                </span>
                <span className="font-semibold truncate block max-w-[180px]">
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
            className="w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-sm font-bold text-white hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all cursor-pointer shadow-lg"
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare Side-by-Side</span>
          </button>
        </div>
      </div>
    </div>
  );
}
