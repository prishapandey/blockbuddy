import React, { useState, useEffect } from 'react';
import { Database, Plus, Search, User, Menu, X, ShoppingBag, Zap, Tag } from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  onOpenSellModal: () => void;
  onOpenProfileModal: () => void;
  onOpenSupabaseModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeNavTab: string;
  onNavTabChange: (tab: string) => void;
  currentStudent: StudentProfile;
  selectedHostelFilter: string;
  onHostelFilterChange: (hostel: string) => void;
  supabaseConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSellModal,
  onOpenProfileModal,
  onOpenSupabaseModal,
  searchQuery,
  onSearchChange,
  activeNavTab,
  onNavTabChange,
  currentStudent,
  selectedHostelFilter,
  onHostelFilterChange,
  supabaseConnected,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHostelDropdown, setShowHostelDropdown] = useState(false);

  const hostelOptions = [
    { id: 'all', label: 'All Campus Hostels' },
    { id: 'H-12 & 14', label: 'H-12–H-15 cluster' },
    { id: 'H-12', label: 'Hostel 12' },
    { id: 'H-13', label: 'Hostel 13' },
    { id: 'H-14', label: 'Hostel 14' },
    { id: 'H-15', label: 'Hostel 15' },
    { id: 'H-16', label: 'Hostel 16' },
  ];

  const currentHostelLabel =
    hostelOptions.find((o) => o.id === selectedHostelFilter)?.label || 'All Campus Hostels';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const el = document.getElementById('rent-gear');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string, tab: string) => {
    onNavTabChange(tab);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* App Download Banner */}
      <div className="app-banner" role="banner">
        <svg className="app-banner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="4" />
          <path d="M12 6v12M8 10h8" />
        </svg>
        <span>BlockBuddy</span>
        <span className="text-[11px] text-white/60">Campus peer-to-peer marketplace demo</span>
        <svg className="app-banner-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>

      {/* Desktop Sidebar Nav Rail */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 nav-rail z-40" aria-label="Main navigation">
        <button
          onClick={() => scrollToSection('home', 'home')}
          className={`nav-item ${activeNavTab === 'home' ? 'nav-item-active' : ''}`}
          aria-label="Home"
          title="Home"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
        <button
          onClick={() => scrollToSection('rent-gear', 'rent-gear')}
          className={`nav-item ${activeNavTab === 'rent-gear' ? 'nav-item-active' : ''}`}
          aria-label="Rent Gear"
          title="Rent Gear"
        >
          <ShoppingBag className="w-5 h-5" />
        </button>
        <button
          onClick={() => scrollToSection('need-it-now', 'need-it-now')}
          className={`nav-item ${activeNavTab === 'need-it-now' ? 'nav-item-active' : ''}`}
          aria-label="Need It Now"
          title="Need It Now"
        >
          <Zap className="w-5 h-5" />
        </button>
        <button
          onClick={() => scrollToSection('marketplace', 'marketplace')}
          className={`nav-item ${activeNavTab === 'marketplace' ? 'nav-item-active' : ''}`}
          aria-label="Marketplace"
          title="Marketplace"
        >
          <Tag className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <button
          onClick={onOpenProfileModal}
          className="nav-avatar mb-6"
          aria-label={`${currentStudent.hostel} · ${currentStudent.name}`}
          title={`${currentStudent.hostel} · ${currentStudent.name}`}
        >
          <User className="w-5 h-5 text-ink" />
        </button>
      </aside>

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-faint">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-muted hover:text-ink transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Zone */}
          <button
            onClick={() => scrollToSection('home', 'home')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer flex-shrink-0"
            aria-label="BlockBuddy Home"
          >
            <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm tracking-tight shadow-accent transition-transform group-hover:scale-105">
              BB
            </span>
            <span className="text-ink tracking-tight text-base hidden sm:inline">
              BlockBuddy<span className="text-accent">.</span>
            </span>
          </button>

          {/* Desktop Search & Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-4 flex-1 max-w-3xl">
            {/* Hostel Selector Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowHostelDropdown(!showHostelDropdown)}
                className="flex items-center justify-between gap-2 px-4 py-2 text-caption text-muted w-full min-w-[200px] border-b-0 border-r border-faint hover:text-ink transition-colors cursor-pointer bg-transparent rounded-full"
                aria-haspopup="listbox"
                aria-expanded={showHostelDropdown}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-ink whitespace-nowrap">{currentHostelLabel}</span>
                </div>
                <svg className="w-3.5 h-3.5 text-muted transition-transform" style={{ transform: showHostelDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
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

            {/* Search Pill */}
            <form onSubmit={handleSearchSubmit} className="search-pill flex-1 max-w-xl">
              <svg className="w-4 h-4 text-muted mr-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search calculators, kettles, drafters, snacks..."
                className="input-pill flex-1 min-w-0"
                id="header-search"
              />
              <button type="submit" className="search-submit ml-1" aria-label="Search">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            {/* Supabase status / config button */}
            <button
              onClick={onOpenSupabaseModal}
              title={supabaseConnected ? 'Supabase Sync Active' : 'Supabase Config'}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-caption bg-surface border border-faint text-muted hover:text-ink hover:border-stone transition-colors shadow-sm"
            >
              <Database className="w-3.5 h-3.5 text-accent" />
              <span className="text-ink font-mono text-[10px]">Supabase</span>
            </button>

            {/* Sell / List CTA */}
            <button
              onClick={onOpenSellModal}
              type="button"
              className="btn-pill btn-pill-primary hidden sm:flex"
            >
              <Plus className="w-4 h-4" />
              <span>Sell / List</span>
            </button>

            {/* User profile button - desktop */}
            <button
              onClick={onOpenProfileModal}
              className="hidden sm:flex w-8 h-8 rounded-full bg-surface border border-faint flex items-center justify-center text-muted hover:text-ink hover:border-accent/50 transition-colors cursor-pointer shadow-sm"
              title={`${currentStudent.hostel} · ${currentStudent.name}`}
              type="button"
              aria-label={`${currentStudent.hostel} · ${currentStudent.name}`}
            >
              <User className="w-4 h-4" />
            </button>

            {/* Mobile actions */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={onOpenSellModal}
                type="button"
                className="btn-pill btn-pill-primary"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenProfileModal}
                className="w-8 h-8 rounded-full bg-surface border border-faint flex items-center justify-center text-muted hover:text-ink hover:border-accent/50 transition-colors cursor-pointer shadow-sm"
                title={`${currentStudent.hostel} · ${currentStudent.name}`}
                type="button"
              >
                <User className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-faint bg-surface py-4 px-6 space-y-3">
            <nav className="space-y-2" role="navigation" aria-label="Mobile navigation">
              <button
                onClick={() => scrollToSection('home', 'home')}
                className={`w-full text-left px-4 py-3 rounded-full transition-colors ${activeNavTab === 'home' ? 'text-ink bg-canvas' : 'text-muted hover:text-ink hover:bg-canvas'}`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('rent-gear', 'rent-gear')}
                className={`w-full text-left px-4 py-3 rounded-full transition-colors flex items-center gap-2 ${activeNavTab === 'rent-gear' ? 'text-ink bg-canvas' : 'text-muted hover:text-ink hover:bg-canvas'}`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Rent Gear</span>
                <span className="text-[10px] bg-accent-wash/60 text-accent px-1.5 py-0.5 rounded-full">NEW</span>
              </button>
              <button
                onClick={() => scrollToSection('need-it-now', 'need-it-now')}
                className={`w-full text-left px-4 py-3 rounded-full transition-colors ${activeNavTab === 'need-it-now' ? 'text-ink bg-canvas' : 'text-muted hover:text-ink hover:bg-canvas'}`}
              >
                <Zap className="w-4 h-4" />
                <span>Need It Now</span>
              </button>
              <button
                onClick={() => scrollToSection('marketplace', 'marketplace')}
                className={`w-full text-left px-4 py-3 rounded-full transition-colors ${activeNavTab === 'marketplace' ? 'text-ink bg-canvas' : 'text-muted hover:text-ink hover:bg-canvas'}`}
              >
                <Tag className="w-4 h-4" />
                <span>Marketplace</span>
              </button>
            </nav>
            <div className="border-t border-faint pt-3 space-y-2">
              <button
                onClick={onOpenSellModal}
                className="btn-pill btn-pill-primary w-full justify-center"
              >
                <Plus className="w-4 h-4" />
                <span>Sell / List Item</span>
              </button>
              <button
                onClick={onOpenSupabaseModal}
                className="btn-pill btn-pill-secondary w-full justify-center"
              >
                <Database className="w-4 h-4" />
                <span>Supabase Settings</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Close dropdown when clicking outside */}
      <div
        className={showHostelDropdown ? 'fixed inset-0 z-30 lg:hidden' : 'hidden'}
        onClick={() => setShowHostelDropdown(false)}
        aria-hidden="true"
      />
    </>
  );
};