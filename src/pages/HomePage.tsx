import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Boxes,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Plus,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { SellListModal } from '../components/modals/SellListModal';
import { SafetyModal } from '../components/modals/SafetyModal';
import { Toast } from '../components/Toast';
import { addListingItem } from '../lib/supabase';
import { ListingItem } from '../types';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { student } = useAuth();
  const [sellOpen, setSellOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3200);
  };

  const handleList = async (newItem: ListingItem) => {
    const res = await addListingItem(newItem);
    showToast(res.savedToSupabase ? 'Listing published to Supabase database!' : 'Listing saved locally.');
  };

  const guestStudent = student || {
    name: 'Student',
    email: 'student@srmist.edu.in',
    hostel: 'A Block',
    room: 'Room 101',
    wing: 'Floor 1',
    department: 'Computer Science & Engineering',
  };

  const zones = [
    {
      id: 'rentals',
      title: 'Rentals Zone',
      subtitle: 'Short-Term Gear & Exam Utility',
      description:
        'Borrow scientific calculators, electric kettles, irons, lab aprons, and drafting supplies for mid-sems or project weeks with automated security deposits.',
      href: '/rentals',
      icon: Calendar,
      badge: 'Escrow Protected',
      badgeColor: '#D96846',
      tags: ['Casio 991CW/EX', 'Electric Kettles', '₹20–₹50 / exam'],
      stats: '12 active rentals available',
      actionText: 'Enter Rentals Zone',
    },
    {
      id: 'need-it-now',
      title: 'Need It Now Zone',
      subtitle: 'Corridor Express (5–15 Min Handoffs)',
      description:
        'Urgent corridor essentials available right on your floor. Midnight study snacks, laptop power bricks, HDMI cables, pens, and emergency relief.',
      href: '/need-it-now',
      icon: Zap,
      badge: 'Live Corridor Handoff',
      badgeColor: '#D96846',
      tags: ['Midnight Snacks', 'Type-C Chargers', 'Doorstep in 10 mins'],
      stats: 'Live floor pings active',
      actionText: 'Enter Urgent Zone',
    },
    {
      id: 'marketplace',
      title: 'Marketplace Zone',
      subtitle: 'Second-Hand Campus Exchanges',
      description:
        'Permanent buy and sell of pre-loved semester textbooks, bicycles, mattresses, study lamps, and displays from graduating seniors and wingmates.',
      href: '/marketplace',
      icon: ShoppingBag,
      badge: '0% Commission',
      badgeColor: '#596235',
      tags: ['Engineering Textbooks', 'Cycle / Gear', 'Direct UPI'],
      stats: '16 marketplace listings',
      actionText: 'Enter Marketplace Zone',
    },
    {
      id: 'blockchain',
      title: 'On-Chain Trust Zone',
      subtitle: 'Smart Contract Escrow & Live Ledger',
      description:
        'Real-time verification of security deposits locked in RentalEscrow, live contract events, wallet reputation scores, and transparent campus volume.',
      href: '/blockchain',
      icon: Activity,
      badge: 'Live Block Ledger',
      badgeColor: '#596235',
      tags: ['RentalEscrow.sol', 'DepositVault', 'Deterministic LCG'],
      stats: 'Real-time activity stream',
      actionText: 'View On-Chain Ledger',
    },
  ];

  return (
    <div className="space-y-12 text-[#CDCBD6]">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#242519] via-[#2F3020] to-[#26271a] border border-[#434630] rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D96846]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#596235]/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#596235]/40 border border-[#596235] text-xs font-semibold text-[#CDCBD6]">
            <span className="w-2 h-2 rounded-full bg-[#D96846] animate-pulse" />
            Verified Student Complex · SRM &amp; IITB Residential Hostels
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Welcome, <span className="text-[#D96846]">{student?.name?.split(' ')[0] || 'Scholar'}</span>.
            <br />
            Select a campus zone to begin.
          </h1>

          <p className="text-sm sm:text-base text-[#CDCBD6]/80 leading-relaxed max-w-2xl">
            BlockBuddy connects roommates and wingmates for instant equipment rentals, corridor emergency handoffs, and peer marketplace trades — with 0% platform commissions and blockchain-backed security deposits.
          </p>

          {/* Quick Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSellOpen(true)}
              className="flex items-center gap-2 bg-[#D96846] hover:bg-[#c45735] text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              List an Item (Rent or Sell)
            </button>
            <button
              type="button"
              onClick={() => setSafetyOpen(true)}
              className="flex items-center gap-2 bg-[#202115] hover:bg-[#2a2c1b] border border-[#434630] text-[#CDCBD6] hover:text-white text-xs sm:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4 text-[#596235]" />
              Campus Escrow Guidelines
            </button>
          </div>
        </div>

        {/* Live metric chips */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 pt-8 border-t border-[#434630]/60">
          {[
            { label: 'Verified Campus Peers', value: '800+', icon: Users, color: '#D96846' },
            { label: 'Hostel Corridors Covered', value: '6 Blocks', icon: Layers, color: '#596235' },
            { label: 'Platform Commission', value: '₹0 / 0%', icon: ShieldCheck, color: '#D96846' },
            { label: 'Avg Corridor Handoff', value: '5–15 mins', icon: Clock, color: '#596235' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-[#202115]/80 border border-[#434630] rounded-xl p-3.5 flex items-center gap-3">
                <Icon className="w-5 h-5 shrink-0" style={{ color: item.color }} />
                <div>
                  <p className="text-base font-bold text-white">{item.value}</p>
                  <p className="text-[10px] text-[#9fa293]">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Campus Exchange Zones Launchpad */}
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D96846] tracking-wide uppercase">
            <Boxes className="w-4 h-4" />
            <span>Dedicated Campus Zones</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Choose Your Destination
          </h2>
          <p className="text-xs sm:text-sm text-[#9fa293] mt-1">
            Browse specialized zones tailored for hourly utility gear, late-night necessities, second-hand items, or on-chain escrow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones.map((zone) => {
            const Icon = zone.icon;
            return (
              <Link
                key={zone.id}
                to={zone.href}
                className="group relative bg-[#26271a] hover:bg-[#2e3020] border border-[#434630] hover:border-[#D96846] rounded-2xl p-7 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#202115] border border-[#434630] group-hover:border-[#D96846] flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6 text-[#D96846]" />
                    </div>
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border"
                      style={{
                        backgroundColor: `${zone.badgeColor}15`,
                        borderColor: `${zone.badgeColor}40`,
                        color: zone.badgeColor,
                      }}
                    >
                      {zone.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mt-5">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#D96846] transition-colors">
                      {zone.title}
                    </h3>
                    <p className="text-xs font-medium text-[#D96846] mt-0.5">{zone.subtitle}</p>
                    <p className="text-xs text-[#CDCBD6]/80 leading-relaxed mt-2.5">
                      {zone.description}
                    </p>
                  </div>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {zone.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2.5 py-1 rounded-md bg-[#202115] border border-[#434630] text-[#CDCBD6]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-6 pt-4 border-t border-[#434630] flex items-center justify-between">
                  <span className="text-[11px] text-[#9fa293] font-medium">{zone.stats}</span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#D96846] group-hover:translate-x-1 transition-transform">
                    {zone.actionText}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Campus Trust and Security Panel */}
      <section className="bg-[#242519] border border-[#434630] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#596235] tracking-wide uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#596235]" />
              Safe Campus Trading Protocol
            </span>
            <h3 className="text-lg font-bold text-white">
              Every trade is protected by campus physical proximity &amp; smart escrow
            </h3>
            <p className="text-xs text-[#9fa293] max-w-2xl leading-relaxed">
              No strangers, no remote shipping scams, and no middleman cuts. All users are authenticated through official student email addresses, and security deposits are governed on-chain by the RentalEscrow smart contract.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSafetyOpen(true)}
            className="shrink-0 bg-[#2b2d1e] hover:bg-[#343725] border border-[#434630] text-xs font-semibold text-white px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Review Safety Guidelines
          </button>
        </div>
      </section>

      {/* Modals */}
      <SellListModal
        isOpen={sellOpen}
        onClose={() => setSellOpen(false)}
        onSubmit={handleList}
        currentStudent={guestStudent}
      />
      <SafetyModal isOpen={safetyOpen} onClose={() => setSafetyOpen(false)} />
      <Toast message={toast} />
    </div>
  );
};
