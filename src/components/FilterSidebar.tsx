import React, { useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { FilterState } from '@/types';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableStates: string[];
  availableBranches: string[];
  onReset: () => void;
}

export function FilterSidebar({
  filters,
  onChange,
  availableStates,
  availableBranches,
  onReset,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    type: true,
    chance: true,
    state: true,
    branch: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleTypeToggle = (type: string) => {
    const nextTypes = filters.instituteTypes.includes(type)
      ? filters.instituteTypes.filter(t => t !== type)
      : [...filters.instituteTypes, type];
    onChange({ ...filters, instituteTypes: nextTypes });
  };

  const handleChanceToggle = (chance: 'safe' | 'moderate' | 'ambitious' | 'longshot') => {
    const nextChances = filters.chances.includes(chance)
      ? filters.chances.filter(c => c !== chance)
      : [...filters.chances, chance];
    onChange({ ...filters, chances: nextChances });
  };

  const handleStateToggle = (state: string) => {
    const nextStates = filters.states.includes(state)
      ? filters.states.filter(s => s !== state)
      : [...filters.states, state];
    onChange({ ...filters, states: nextStates });
  };

  const handleBranchToggle = (branch: string) => {
    const nextBranches = filters.branches.includes(branch)
      ? filters.branches.filter(b => b !== branch)
      : [...filters.branches, branch];
    onChange({ ...filters, branches: nextBranches });
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 text-white font-bold">
          <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Smart Search */}
      <div className="space-y-2">
        <label htmlFor="filter-search" className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
          Search College
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            id="filter-search"
            type="text"
            placeholder="Type college name..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full text-sm rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Sorting */}
      <div className="space-y-2">
        <label htmlFor="filter-sort" className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
          Sort Results By
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            id="filter-sort"
            value={filters.sortBy}
            onChange={e => onChange({ ...filters, sortBy: e.target.value as any })}
            className="col-span-2 text-sm rounded-xl border border-white/10 bg-[#0a0a0f] px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="probability">Probability Estimate</option>
            <option value="closingRank">Closing Cutoff Rank</option>
            <option value="instituteName">College Name</option>
          </select>
          <button
            onClick={() => onChange({ ...filters, sortOrder: 'asc' })}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              filters.sortOrder === 'asc'
                ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            Ascending
          </button>
          <button
            onClick={() => onChange({ ...filters, sortOrder: 'desc' })}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              filters.sortOrder === 'desc'
                ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            Descending
          </button>
        </div>
      </div>

      <div className="border-t border-white/5 my-4" />

      {/* Collapsible Sections */}
      <div className="space-y-5">
        {/* Institute Type */}
        <div className="space-y-2.5">
          <button
            onClick={() => toggleSection('type')}
            className="flex items-center justify-between w-full text-left cursor-pointer"
          >
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Institute Type</span>
            {openSections.type ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </button>
          {openSections.type && (
            <div className="space-y-2 pl-1">
              {['IIT', 'NIT', 'IIIT', 'GFTI'].map(type => (
                <label key={type} className="flex items-center gap-2.5 text-sm font-semibold text-gray-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.instituteTypes.includes(type)}
                    onChange={() => handleTypeToggle(type)}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span>{type}s</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Chances */}
        <div className="space-y-2.5">
          <button
            onClick={() => toggleSection('chance')}
            className="flex items-center justify-between w-full text-left cursor-pointer"
          >
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chance Level</span>
            {openSections.chance ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </button>
          {openSections.chance && (
            <div className="space-y-2 pl-1">
              {[
                { val: 'safe', label: '✅ Safe' },
                { val: 'moderate', label: '⚡ Moderate' },
                { val: 'ambitious', label: '🔥 Ambitious' },
                { val: 'longshot', label: '🎯 Long Shots' },
              ].map(({ val, label }) => (
                <label key={val} className="flex items-center gap-2.5 text-sm font-semibold text-gray-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.chances.includes(val as any)}
                    onChange={() => handleChanceToggle(val as any)}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* States */}
        <div className="space-y-2.5">
          <button
            onClick={() => toggleSection('state')}
            className="flex items-center justify-between w-full text-left cursor-pointer"
          >
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">State Preference</span>
            {openSections.state ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </button>
          {openSections.state && (
            <div className="space-y-2 pl-1 max-h-48 overflow-y-auto pr-1">
              {availableStates.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No states available</p>
              ) : (
                availableStates.map(state => (
                  <label key={state} className="flex items-center gap-2.5 text-sm font-semibold text-gray-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filters.states.includes(state)}
                      onChange={() => handleStateToggle(state)}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{state}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        {/* Branches */}
        <div className="space-y-2.5">
          <button
            onClick={() => toggleSection('branch')}
            className="flex items-center justify-between w-full text-left cursor-pointer"
          >
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Branch Filter</span>
            {openSections.branch ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </button>
          {openSections.branch && (
            <div className="space-y-2 pl-1 max-h-48 overflow-y-auto pr-1">
              {availableBranches.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No branches available</p>
              ) : (
                availableBranches.map(branch => (
                  <label key={branch} className="flex items-center gap-2.5 text-sm font-semibold text-gray-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filters.branches.includes(branch)}
                      onChange={() => handleBranchToggle(branch)}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="truncate" title={branch}>{branch}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
