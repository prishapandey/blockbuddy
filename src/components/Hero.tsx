import React, { useState } from 'react';
import { ArrowRight, ChevronDown, MapPin, Search } from 'lucide-react';

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
    { id: 'H-12 & 14', label: 'H-12 & H-14' },
    { id: 'H-12', label: 'Hostel 12' },
    { id: 'H-13', label: 'Hostel 13' },
    { id: 'H-14', label: 'Hostel 14' },
    { id: 'H-15', label: 'Hostel 15' },
    { id: 'H-16', label: 'Hostel 16' },
  ];

  const currentHostelLabel =
    hostelOptions.find((o) => o.id === selectedHostelFilter)?.label || 'All Campus Hostels';

  const quickFilters = [
    { label: 'Scientific Calculators', target: 'Scientific Calculators', section: 'rent-gear' },
    { label: 'Electric Kettles', target: 'Electric Kettles', section: 'rent-gear' },
    { label: 'Exam Stationery', target: 'Exam Stationery', section: 'need-it-now' },
    { label: 'Midnight Snacks', target: 'Midnight Snacks', section: 'need-it-now' },
  ];

  // Floating hero product cards
  const heroProducts = [
    {
      id: 'hero-1',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD12UeXydACFaEn82qPO_LLwle0B7ilTqdbbwgvbBEOJy7y46TaZ_69Qf8kajaTHnSEfjvXQTWrzFHRO1DpX91vws_mmAE56GFzqU_fJXxi0ajXc0oOBhyOCEflMK8epxgRvGcA08OWI7AFNF7AcDLu2h2E3wLT-ITIgqsMxL20ssq85RojxR7gSnNRhGW1a0AyLDgTlEBx5R07TqFcFzf0hefhwLZFs1SH_qnkhHmdJ4ek3vquwazI2w',
      brand: 'Casio fx-991EX',
    },
    {
      id: 'hero-2',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDllvskdLkt9jCBso5ZEn27Zu2YH5gwBoMU_ttrC5pOewNorongGSLu4KKZSCVkE8AoP4kOuumKb4DLLLwYFWjbMlPl-ktE4QF2NtLewa9ipDw9c9oGOrqtyaemX8Q3hGNgNImMAKb9jfFdcwiiTVfC3aDhoQ0DjFlk7FS6BRM_cZ3SDFYlYsh8kxbHkeRAMvq4pDD_MCLwQ7cxNbDHeA2ij1K0kua60JHsQGU1oHBbyOP_UdnKOD6gAg',
      brand: 'Prestige Kettle',
    },
    {
      id: 'hero-3',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqV-Ikqb--YqUb6xdnlIPD6u9wHIGOvZc2rhsAim5m2GaTK9cqpyoV7qbzfzLrFfgoD0EVDziugV7KgZFWXWMydDcoZ-fXeOf-noN1hYdmp6U4xaRZooEvZ_MddYjkiO_O5z7FhETyOliBIeqVuTx3tp5ScSFcHrM9V_10wTKpmAN0-ygoJw5j4p7mXAndHoKa8Jh1_PS_Oc4TxAQF-3GV0yTI7sF23q9-v-JxUs1EQOJO8mrnsFfWxw',
      brand: 'Philips Iron',
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const el = document.getElementById('rent-gear');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-10 pb-4 text-center max-w-3xl mx-auto space-y-8 px-6">
      {/* Floating Hero Product Cards */}
      <div className="hero-floating-cards" role="img" aria-label="Featured campus products">
        {heroProducts.map((product) => (
          <article key={product.id} className="hero-floating-card">
            <img
              src={product.image}
              alt={product.brand}
              className="hero-floating-card-image product-image"
              loading="lazy"
            />
            <div className="hero-floating-card-content">
              <h3 className="hero-floating-card-brand">{product.brand}</h3>
              <div className="hero-floating-card-rating">
                <span className="text-muted">Campus essentials</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Wordmark */}
      <div className="wordmark justify-center">
        <span className="wordmark-dot" aria-hidden="true" />
        <span>BlockBuddy<span className="wordmark-accent">.</span></span>
      </div>

      {/* Hero Copy */}
      <div className="space-y-3">
        <h1 className="text-[28px] sm:text-[36px] md:text-[44px] text-ink tracking-tight-xl leading-[1.1] font-medium">
          Your campus. Buy, sell, or rent in minutes.
        </h1>
        <p className="text-body text-muted leading-relaxed max-w-2xl mx-auto">
          A student-to-student marketplace for everyday hostel essentials. Find nearby listings, arrange a handoff, and keep exchanges on campus.
        </p>
      </div>

      {/* Main Search Box — pill with circular violet submit */}
      <div className="pt-2">
        <form
          onSubmit={handleSearchSubmit}
          className="search-pill shadow-card relative mx-auto max-w-2xl"
        >
          {/* Hostel Location Selector */}
          <div className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowHostelDropdown(!showHostelDropdown)}
              className="flex items-center justify-between gap-2 px-4 py-3 text-caption text-muted w-full sm:w-auto border-b sm:border-b-0 sm:border-r border-faint hover:text-ink transition-colors cursor-pointer bg-transparent rounded-full"
              aria-haspopup="listbox"
              aria-expanded={showHostelDropdown}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span className="text-ink whitespace-nowrap">{currentHostelLabel}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted transition-transform" style={{ transform: showHostelDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {/* Dropdown Menu */}
            {showHostelDropdown && (
              <div className="hostel-dropdown" role="listbox">
                {hostelOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    role="option"
                    aria-selected={selectedHostelFilter === opt.id}
                    onClick={() => {
                      onHostelFilterChange(opt.id);
                      setShowHostelDropdown(false);
                    }}
                    className={`hostel-option ${selectedHostelFilter === opt.id ? 'hostel-option-active' : ''}`}
                  >
                    <span>{opt.label}</span>
                    {selectedHostelFilter === opt.id && <span className="hostel-option-dot" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Query Input */}
          <div className="flex-1 flex items-center w-full px-3">
            <Search className="w-4 h-4 text-muted mr-3 shrink-0" />
            <input
              id="hero-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search calculators, kettles, drafters, snacks..."
              className="input-pill flex-1 min-w-0"
            />
          </div>

          {/* Circular violet submit */}
          <button
            type="submit"
            className="search-submit ml-1"
            aria-label="Search"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Quick filter category pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-caption">
          <span className="text-muted">Quick find:</span>
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
                className={`quick-chip ${isActive ? 'quick-chip-active' : ''}`}
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