import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Activity, LogOut, Menu, Plus, Search, Settings, ShoppingBag, User, X, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SellListModal } from './modals/SellListModal';
import { addListingItem } from '../lib/supabase';
import { ListingItem } from '../types';

export const AppNavbar: React.FC = () => {
  const { student, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleList = async (item: ListingItem) => {
    await addListingItem(item);
    setSellOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/rentals', label: 'Rentals' },
    { to: '/need-it-now', label: 'Need It Now' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/blockchain', label: 'On-Chain' },
  ];

  const activeClass = 'text-white bg-[#1a1c22]';
  const inactiveClass = 'text-[#94a3b8] hover:text-white hover:bg-[#121316]';

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-[#22252b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="w-8 h-8 rounded-lg bg-[#4d8eff] flex items-center justify-center text-white font-bold text-sm shadow-sm">BB</span>
            <span className="text-white font-semibold text-lg tracking-tight">BlockBuddy</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 text-sm font-medium">
            {navLinks.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md transition-colors ${isActive ? activeClass : inactiveClass}`
                }>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSellOpen(true)}
              className="hidden sm:flex bg-[#4d8eff] hover:bg-[#3b7cee] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>Sell / List</span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button type="button" onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 bg-[#121316] border border-[#22252b] hover:border-[#353945] rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer">
                <div className="w-6 h-6 rounded-full bg-[#4d8eff]/20 flex items-center justify-center text-[#4d8eff] text-[11px] font-bold">
                  {(student?.name || 'U')[0].toUpperCase()}
                </div>
                <span className="hidden sm:block text-xs font-medium text-white max-w-[100px] truncate">
                  {student?.name?.split(' ')[0]}
                </span>
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#121316] border border-[#22252b] rounded-xl shadow-2xl py-1.5 z-20">
                    <div className="px-3 py-2 border-b border-[#22252b]">
                      <p className="text-xs font-medium text-white">{student?.name}</p>
                      <p className="text-[11px] text-[#64748b]">{student?.hostel} · {student?.room}</p>
                    </div>
                    <Link to="/settings" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#94a3b8] hover:text-white hover:bg-[#1a1c22] transition-colors">
                      <Settings className="w-3.5 h-3.5" /> Settings
                    </Link>
                    <button type="button" onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#94a3b8] hover:text-red-400 hover:bg-[#1a1c22] transition-colors cursor-pointer">
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button type="button" onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden w-8 h-8 flex items-center justify-center text-[#94a3b8] hover:text-white cursor-pointer">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#22252b] bg-[#0a0a0c] px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-white bg-[#1a1c22]' : 'text-[#94a3b8] hover:text-white'}`
                }>
                {label}
              </NavLink>
            ))}
            <button type="button" onClick={() => { setSellOpen(true); setMobileOpen(false); }}
              className="w-full flex items-center gap-2 bg-[#4d8eff] text-white text-sm font-semibold px-3 py-2 rounded-lg mt-2 cursor-pointer">
              <Plus className="w-4 h-4" /> Sell / List an Item
            </button>
          </div>
        )}
      </header>

      <SellListModal isOpen={sellOpen} onClose={() => setSellOpen(false)} onSubmit={handleList}
        currentStudent={student || { name: '', email: '', hostel: 'H-12', room: '', wing: '', department: '' }} />
    </>
  );
};
