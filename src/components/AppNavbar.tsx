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

  const activeClass = 'text-white bg-[#D96846] font-semibold';
  const inactiveClass = 'text-[#CDCBD6] hover:text-white hover:bg-[#353826]';

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#242519]/95 backdrop-blur-md border-b border-[#434630]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="w-8 h-8 rounded-lg bg-[#D96846] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              BB
            </span>
            <span className="text-white font-semibold text-lg tracking-tight">BlockBuddy</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg transition-colors ${isActive ? activeClass : inactiveClass}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSellOpen(true)}
              className="hidden sm:flex bg-[#D96846] hover:bg-[#c45735] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors items-center gap-1.5 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Sell / List</span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 bg-[#26271a] border border-[#434630] hover:border-[#D96846]/60 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#596235]/40 flex items-center justify-center text-[#D96846] text-[11px] font-bold">
                  {(student?.name || 'U')[0].toUpperCase()}
                </div>
                <span className="hidden sm:block text-xs font-medium text-[#CDCBD6] max-w-[100px] truncate">
                  {student?.name?.split(' ')[0]}
                </span>
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#26271a] border border-[#434630] rounded-xl shadow-2xl py-1.5 z-20">
                    <div className="px-3 py-2 border-b border-[#434630]">
                      <p className="text-xs font-medium text-white">{student?.name}</p>
                      <p className="text-[11px] text-[#9fa293]">
                        {student?.hostel} · {student?.room}
                      </p>
                    </div>
                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#CDCBD6] hover:text-white hover:bg-[#353826] transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#D96846]" /> Settings
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#CDCBD6] hover:text-red-400 hover:bg-[#353826] transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden p-2 text-[#CDCBD6] hover:text-white bg-[#26271a] border border-[#434630] rounded-lg cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#242519] border-t border-[#434630] px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? activeClass : inactiveClass
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-[#434630]">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSellOpen(true);
                }}
                className="w-full flex items-center justify-center gap-1.5 bg-[#D96846] text-white text-xs font-semibold py-2 rounded-lg"
              >
                <Plus className="w-4 h-4" /> Sell / List
              </button>
            </div>
          </div>
        )}
      </header>

      <SellListModal
        isOpen={sellOpen}
        onClose={() => setSellOpen(false)}
        onSubmit={handleList}
        currentStudent={
          student || {
            name: '',
            email: '',
            hostel: 'A Block',
            room: '',
            wing: '',
            department: '',
          }
        }
      />
    </>
  );
};
