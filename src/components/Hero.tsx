import React, { useState } from 'react';
import { ChevronDown, MapPin, Search } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedHostelFilter: string;
  onHostelFilterChange: (h: string) => void;
  onQuickFilter: (tag: string) => void;
  activeQuickTag: string;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedHostelFilter,
  onHostelFilterChange,
  onQuickFilter,
  activeQuickTag,
}) => {
  const [showHostelDropdown, setShowHostelDropdown] = useState(false);

  const hostelOptions = [
    { id: 'all', label: 'All Campus Hostels' },
    { id: 'H-12 & 14', label: 'IITB · H-12 & 14' },
    { id: 'H-12', label: 'Hostel 12' },
    { id: 'H-13', label: 'Hostel 13' },
    { id: 'H-14', label: 'Hostel 14' },
    { id: 'H-15', label: 'Hostel 15' },
    { id: 'H-16', label: 'Hostel 16' },
  ];

  const currentHostelLabel =
    hostelOptions.find((o) => o.id === selectedHostelFilter)?.label || 'IITB · H-12 & 14';

  const quickFilters = [
    { label: 'Scientific Calculators', target: 'Scientific Calculators', section: 'rent-gear' },
    { label: 'Electric Kettles', target: 'Electric Kettles', section: 'rent-gear' },
    { label: 'Exam Stationery', target: 'Exam Stationery', section: 'need-it-now' },
    { label: 'Midnight Snacks', target: 'Midnight Snacks', section: 'need-it-now' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // scroll to results if on page
      const el = document.getElementById('rent-gear');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-6 pb-2 text-center max-w-3xl mx-auto space-y-5">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
        Your campus. Buy, sell, or rent in minutes.
      </h1>
      <p className="text-[#94a3b8] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
        Direct room-to-room exchange across Hostels 12, 13, 14, 15 &amp; 16. Zero couriers, verified students, 0% fees.
      </p>

      {/* Main Search Box */}
      <div className="pt-2">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-[#121316] border border-[#22252b] rounded-lg p-2 flex flex-col sm:flex-row items-center gap-2 shadow-lg relative"
        >
          {/* Hostel Location Selector */}
          <div className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowHostelDropdown(!showHostelDropdown)}
              className="flex items-center justify-between gap-2 px-3 py-1.5 text-xs text-[#94a3b8] w-full sm:w-auto border-b sm:border-b-0 sm:border-r border-[#22252b] hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#4d8eff] shrink-0" />
                <span className="text-white font-medium whitespace-nowrap">
                  {currentHostelLabel}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
            </button>

            {/* Dropdown Menu */}
            {showHostelDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#121316] border border-[#22252b] rounded-md shadow-xl py-1 z-30 text-left">
                {hostelOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onHostelFilterChange(opt.id);
                      setShowHostelDropdown(false);
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left transition-colors flex items-center justify-between ${
                      selectedHostelFilter === opt.id
                        ? 'bg-[#1a1c22] text-[#4d8eff] font-medium'
                        : 'text-[#94a3b8] hover:bg-[#1a1c22] hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selectedHostelFilter === opt.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4d8eff]"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Query Input */}
          <div className="flex-1 flex items-center w-full px-2">
            <Search className="w-4 h-4 text-[#64748b] mr-2 shrink-0" />
            <input
              id="hero-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search calculators, kettles, drafters, snacks..."
              className="w-full bg-transparent border-0 text-sm text-white placeholder-[#64748b] p-1 focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#4d8eff] hover:bg-[#3b7cee] text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-colors whitespace-nowrap shadow-sm active:scale-95 cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Quick filter categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
          <span className="text-[#64748b]">Quick find:</span>
          {quickFilters.map((q) => {
            const isActive = activeQuickTag === q.target;
            return (
              <button
                key={q.label}
                type="button"
                onClick={() => {
                  onQuickFilter(isActive ? '' : q.target);
                  const el = document.getElementById(q.section);
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`border rounded px-2.5 py-1 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#4d8eff]/15 border-[#4d8eff] text-[#4d8eff] font-medium'
                    : 'bg-[#121316] hover:bg-[#1a1c22] border-[#22252b] text-[#94a3b8] hover:text-white'
                }`}
              >
                {q.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
