import React from 'react';
import { Database, Plus, Search, User } from 'lucide-react';
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
  supabaseConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-[#22252b]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <button
          onClick={() => {
            onNavTabChange('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-[#4d8eff] flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-sm transition-transform group-hover:scale-105">
            BB
          </span>
          <span className="text-white font-semibold text-lg tracking-tight">BlockBuddy</span>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => {
              onNavTabChange('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeNavTab === 'home'
                ? 'text-white bg-[#121316]'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#121316]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavTabChange('marketplace');
              const el = document.getElementById('marketplace');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeNavTab === 'marketplace'
                ? 'text-white bg-[#121316]'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#121316]'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => {
              onNavTabChange('rent-gear');
              const el = document.getElementById('rent-gear');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-[#4d8eff] hover:text-white px-3 py-1.5 rounded-md hover:bg-[#121316] transition-colors flex items-center gap-1.5"
          >
            <span>Rent Gear</span>
            <span className="text-[10px] font-semibold bg-[#4d8eff]/20 text-[#4d8eff] px-1.5 py-0.5 rounded">
              NEW
            </span>
          </button>
          <button
            onClick={() => {
              onNavTabChange('need-it-now');
              const el = document.getElementById('need-it-now');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeNavTab === 'need-it-now'
                ? 'text-white bg-[#121316]'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#121316]'
            }`}
          >
            Need It Now
          </button>
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden sm:block w-48 lg:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748b] w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search hostels, gear..."
              className="w-full bg-[#121316] border border-[#22252b] rounded-md text-xs text-white placeholder-[#64748b] pl-8 pr-3 py-2 focus:outline-none focus:border-[#4d8eff] transition-colors"
            />
          </div>

          {/* Supabase status / config button */}
          <button
            onClick={onOpenSupabaseModal}
            title={supabaseConnected ? 'Supabase Sync Active' : 'Supabase Config'}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium bg-[#121316] border border-[#22252b] text-[#94a3b8] hover:text-white hover:border-[#353945] transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-[#3ecf8e]" />
            <span className="text-white font-mono text-[10px]">Supabase</span>
          </button>

          {/* Sell / List CTA */}
          <button
            onClick={onOpenSellModal}
            type="button"
            className="bg-[#4d8eff] hover:bg-[#3b7cee] text-white text-xs font-semibold px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Sell / List</span>
          </button>

          {/* User profile button */}
          <button
            onClick={onOpenProfileModal}
            className="w-8 h-8 rounded-md bg-[#121316] border border-[#22252b] flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-[#4d8eff]/50 transition-colors cursor-pointer"
            title={`${currentStudent.hostel} · ${currentStudent.name}`}
            type="button"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
