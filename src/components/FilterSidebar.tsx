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

const sectionLabel =
  'text-xs font-bold uppercase tracking-wide text-text-primary';
const checkboxClass =
  'w-4 h-4 rounded-md border border-border-strong bg-bg-elevated accent-brand shrink-0 cursor-pointer m-0';
const rowClass =
  'flex items-center gap-2.5 text-sm font-medium text-text-secondary hover:text-text-primary cursor-pointer select-none transition-colors';

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
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleTypeToggle = (type: string) => {
    const nextTypes = filters.instituteTypes.includes(type)
      ? filters.instituteTypes.filter((t) => t !== type)
      : [...filters.instituteTypes, type];
    onChange({ ...filters, instituteTypes: nextTypes });
  };

  const handleChanceToggle = (chance: 'safe' | 'moderate' | 'ambitious' | 'longshot') => {
    const nextChances = filters.chances.includes(chance)
      ? filters.chances.filter((c) => c !== chance)
      : [...filters.chances, chance];
    onChange({ ...filters, chances: nextChances });
  };

  const handleStateToggle = (state: string) => {
    const nextStates = filters.states.includes(state)
      ? filters.states.filter((s) => s !== state)
      : [...filters.states, state];
    onChange({ ...filters, states: nextStates });
  };

  const handleBranchToggle = (branch: string) => {
    const nextBranches = filters.branches.includes(branch)
      ? filters.branches.filter((b) => b !== branch)
      : [...filters.branches, branch];
    onChange({ ...filters, branches: nextBranches });
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6 bg-bg-elevated border border-border-default rounded-3xl p-5 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default pb-4">
        <div className="flex items-center gap-2 text-text-primary">
          <span className="w-8 h-8 rounded-full bg-brand-dim flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-brand" />
          </span>
          <span className="font-display font-bold text-sm">Filters</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-brand transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label htmlFor="filter-search" className={sectionLabel}>Search college</label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            id="filter-search"
            type="text"
            placeholder="Type a college name..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full text-sm bg-bg-base border border-border-default text-text-primary rounded-xl pl-10 pr-4 py-2.5 placeholder-text-muted focus:border-brand focus:ring-4 focus:ring-brand-dim focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label htmlFor="filter-sort" className={sectionLabel}>Sort by</label>
        <select
          id="filter-sort"
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
          className="w-full text-sm bg-bg-base border border-border-default text-text-primary rounded-xl px-3 py-2.5 focus:border-brand focus:ring-4 focus:ring-brand-dim focus:outline-none transition-all cursor-pointer"
        >
          <option value="probability">Best chances first</option>
          <option value="closingRank">Closing cutoff rank</option>
          <option value="instituteName">College name</option>
        </select>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onChange({ ...filters, sortOrder: 'asc' })}
            className={`px-3 py-2 text-xs font-semibold transition-all cursor-pointer border rounded-xl ${
              filters.sortOrder === 'asc'
                ? 'bg-brand-dim border-brand text-brand'
                : 'bg-bg-elevated border-border-default text-text-secondary hover:border-border-strong'
            }`}
          >
            Ascending
          </button>
          <button
            onClick={() => onChange({ ...filters, sortOrder: 'desc' })}
            className={`px-3 py-2 text-xs font-semibold transition-all cursor-pointer border rounded-xl ${
              filters.sortOrder === 'desc'
                ? 'bg-brand-dim border-brand text-brand'
                : 'bg-bg-elevated border-border-default text-text-secondary hover:border-border-strong'
            }`}
          >
            Descending
          </button>
        </div>
      </div>

      <div className="border-t border-border-default" />

      {/* Sections */}
      <div className="space-y-5">
        {/* Type */}
        <div className="space-y-2.5">
          <button onClick={() => toggleSection('type')} className="flex items-center justify-between w-full text-left cursor-pointer">
            <span className={sectionLabel}>Institute type</span>
            {openSections.type ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
          </button>
          {openSections.type && (
            <div className="space-y-2.5 pl-1">
              {['IIT', 'NIT', 'IIIT', 'GFTI'].map((type) => (
                <label key={type} className={rowClass}>
                  <input type="checkbox" checked={filters.instituteTypes.includes(type)} onChange={() => handleTypeToggle(type)} className={checkboxClass} />
                  <span>{type}s</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Chance */}
        <div className="space-y-2.5">
          <button onClick={() => toggleSection('chance')} className="flex items-center justify-between w-full text-left cursor-pointer">
            <span className={sectionLabel}>How likely</span>
            {openSections.chance ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
          </button>
          {openSections.chance && (
            <div className="space-y-2.5 pl-1">
              {[
                { val: 'safe', label: 'Safe bets' },
                { val: 'moderate', label: 'Worth a go' },
                { val: 'ambitious', label: 'A stretch' },
                { val: 'longshot', label: 'Long shots' },
              ].map(({ val, label }) => (
                <label key={val} className={rowClass}>
                  <input type="checkbox" checked={filters.chances.includes(val as any)} onChange={() => handleChanceToggle(val as any)} className={checkboxClass} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* States */}
        <div className="space-y-2.5">
          <button onClick={() => toggleSection('state')} className="flex items-center justify-between w-full text-left cursor-pointer">
            <span className={sectionLabel}>State</span>
            {openSections.state ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
          </button>
          {openSections.state && (
            <div className="space-y-2.5 pl-1 max-h-48 overflow-y-auto pr-1">
              {availableStates.length === 0 ? (
                <p className="text-xs text-text-muted italic">No states available</p>
              ) : (
                availableStates.map((state) => (
                  <label key={state} className={rowClass}>
                    <input type="checkbox" checked={filters.states.includes(state)} onChange={() => handleStateToggle(state)} className={checkboxClass} />
                    <span>{state}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        {/* Branches */}
        <div className="space-y-2.5">
          <button onClick={() => toggleSection('branch')} className="flex items-center justify-between w-full text-left cursor-pointer">
            <span className={sectionLabel}>Branch</span>
            {openSections.branch ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
          </button>
          {openSections.branch && (
            <div className="space-y-2.5 pl-1 max-h-48 overflow-y-auto pr-1">
              {availableBranches.length === 0 ? (
                <p className="text-xs text-text-muted italic">No branches available</p>
              ) : (
                availableBranches.map((branch) => (
                  <label key={branch} className={rowClass}>
                    <input type="checkbox" checked={filters.branches.includes(branch)} onChange={() => handleBranchToggle(branch)} className={checkboxClass} />
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
