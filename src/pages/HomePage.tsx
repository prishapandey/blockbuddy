import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MessageSquare, Send, ShieldCheck, TrendingUp, Users, Zap } from 'lucide-react';
import { RentModal } from '../components/modals/RentModal';
import { ChatModal } from '../components/modals/ChatModal';
import { SellListModal } from '../components/modals/SellListModal';
import { Toast } from '../components/Toast';
import { getLocalItems, addListingItem, saveRentalBooking, saveCorridorPing } from '../lib/supabase';
import { ListingItem, RentalBooking, CorridorPing } from '../types';
import { useAuth } from '../context/AuthContext';
import { Hero } from '../components/Hero';

export const HomePage: React.FC = () => {
  const { student } = useAuth();
  const [items, setItems] = useState<ListingItem[]>(getLocalItems);
  const [search, setSearch] = useState('');
  const [hostelFilter, setHostelFilter] = useState('AB');
  const [quickTag, setQuickTag] = useState('');
  const [rentItem, setRentItem] = useState<ListingItem | null>(null);
  const [chatItem, setChatItem] = useState<ListingItem | null>(null);
  const [sellOpen, setSellOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3200); };

  const featured = {
    rentals: items.filter((i) => i.category === 'rental').slice(0, 4),
    urgent: items.filter((i) => i.category === 'urgent').slice(0, 4),
    marketplace: items.filter((i) => i.category === 'marketplace').slice(0, 4),
  };

  const handleRent = async (data: any) => {
    const booking: RentalBooking = {
      id: `booking-${Date.now()}`, itemId: data.item.id, itemTitle: data.item.title,
      renterName: student?.name || '', renterHostel: student?.hostel || 'A Block', renterRoom: student?.room || '',
      durationType: data.durationType, durationCount: data.durationCount,
      totalAmount: data.totalAmount, depositAmount: 150,
      pickupTime: data.pickupTime, status: 'confirmed', createdAt: new Date().toISOString(),
    };
    await saveRentalBooking(booking);
    setRentItem(null);
    showToast(`Rent request sent to ${data.item.sellerName.split(' ')[0]}!`);
  };

  const handleChat = async (data: any) => {
    const ping: CorridorPing = {
      id: `ping-${Date.now()}`, itemId: data.item.id, itemTitle: data.item.title,
      sellerName: data.item.sellerName, senderName: student?.name || '',
      senderHostel: student?.hostel || 'A Block', message: data.message,
      timestamp: new Date().toISOString(), status: 'sent',
    };
    await saveCorridorPing(ping);
    setChatItem(null);
    showToast(`Message sent to ${data.item.sellerName.split(' ')[0]}!`);
  };

  const handleList = async (newItem: ListingItem) => {
    setItems((p) => [newItem, ...p]);
    const res = await addListingItem(newItem);
    showToast(res.savedToSupabase ? 'Listing published to shared database.' : 'Listing saved locally only.');
  };

  const guestStudent = student || { name: '', email: '', hostel: 'A Block', room: '', wing: '', department: '' };

  return (
    <div className="space-y-14">
      {/* Hero */}
      <Hero searchQuery={search} onSearchChange={setSearch}
        selectedHostelFilter={hostelFilter} onHostelFilterChange={setHostelFilter}
        onQuickFilter={setQuickTag} activeQuickTag={quickTag} />

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Users, value: '800+', label: 'Students', color: '#4d8eff' },
          { icon: TrendingUp, value: '40+', label: 'Active Listings', color: '#3ecf8e' },
          { icon: ShieldCheck, value: '₹0', label: 'Platform fees', color: '#a78bfa' },
        ].map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="bg-[#121316] border border-[#22252b] rounded-xl p-4 flex items-center gap-3">
            <Icon className="w-5 h-5 shrink-0" style={{ color }} />
            <div>
              <p className="text-base font-bold text-white">{value}</p>
              <p className="text-[11px] text-[#64748b]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Rentals */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold text-[#4d8eff] tracking-wide uppercase">Short-Term Utility</span>
            <h2 className="text-xl font-bold text-white mt-0.5">Rent Campus Equipment</h2>
          </div>
          <Link to="/rentals" className="text-xs text-[#4d8eff] hover:underline flex items-center gap-1 font-medium">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.rentals.map((item) => (
            <div key={item.id} className="bg-[#121316] border border-[#22252b] rounded-xl overflow-hidden flex flex-col group hover:border-[#4d8eff]/40 transition-colors">
              <div className="aspect-[16/10] bg-[#1a1c22] relative overflow-hidden">
                <img src={item.imageUrl} alt={item.title} referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="absolute top-2 left-2 bg-[#0a0a0c]/80 backdrop-blur text-[10px] text-white px-1.5 py-0.5 rounded border border-[#22252b]/60">{item.locationTag}</span>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-sm font-semibold text-white line-clamp-1">{item.title}</h3>
                <p className="text-xs text-[#94a3b8] mt-1 line-clamp-2 flex-1">{item.description}</p>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-sm font-bold text-[#4d8eff]">{item.priceDisplay}</span>
                  <span className="text-xs text-[#94a3b8]">{item.priceUnit}</span>
                </div>
                <button type="button" onClick={() => setRentItem(item)}
                  className="mt-2 w-full bg-[#1e2128] hover:bg-[#4d8eff] text-white text-xs font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  <Calendar className="w-3 h-3" /> Rent Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Urgent */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 tracking-wide uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Immediate Corridor Handoff
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">Need It Now</h2>
          </div>
          <Link to="/need-it-now" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.urgent.map((item) => (
            <div key={item.id} className="bg-[#121316] border border-[#22252b] rounded-xl overflow-hidden flex flex-col hover:border-amber-500/30 transition-colors">
              <div className="aspect-[16/10] bg-[#1a1c22] relative overflow-hidden">
                <img src={item.imageUrl} alt={item.title} referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="absolute top-2 left-2 bg-[#0a0a0c]/80 backdrop-blur text-[10px] text-white px-1.5 py-0.5 rounded border border-[#22252b]/60">{item.locationTag}</span>
                <span className="absolute top-2 right-2 bg-[#3ecf8e]/90 text-[9px] text-black font-bold px-1.5 py-0.5 rounded">LIVE</span>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <div className="flex justify-between gap-1">
                  <h3 className="text-sm font-semibold text-white line-clamp-1">{item.title}</h3>
                  <span className="text-sm font-bold text-white whitespace-nowrap">{item.priceDisplay}</span>
                </div>
                <p className="text-xs text-[#94a3b8] mt-1 line-clamp-2 flex-1">{item.description}</p>
                <button type="button" onClick={() => setChatItem(item)}
                  className="mt-2 w-full bg-[#1a1c22] hover:bg-amber-500/20 hover:text-amber-400 border border-[#22252b] text-white text-xs font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  <Send className="w-3 h-3" /> Ping
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Marketplace */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold text-[#3ecf8e] tracking-wide uppercase">Second-Hand</span>
            <h2 className="text-xl font-bold text-white mt-0.5">Fresh on Marketplace</h2>
          </div>
          <Link to="/marketplace" className="text-xs text-[#3ecf8e] hover:underline flex items-center gap-1 font-medium">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.marketplace.map((item) => (
            <div key={item.id} className="bg-[#121316] border border-[#22252b] rounded-xl overflow-hidden flex flex-col hover:border-[#353945] transition-colors">
              <div className="aspect-[16/10] bg-[#1a1c22] relative overflow-hidden">
                <img src={item.imageUrl} alt={item.title} referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="absolute top-2 left-2 bg-[#0a0a0c]/80 backdrop-blur text-[10px] text-white px-1.5 py-0.5 rounded border border-[#22252b]/60">{item.locationTag}</span>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <div className="flex justify-between gap-1">
                  <h3 className="text-sm font-semibold text-white line-clamp-1">{item.title}</h3>
                  <span className="text-sm font-bold text-white whitespace-nowrap">{item.priceDisplay}</span>
                </div>
                <p className="text-xs text-[#94a3b8] mt-1 line-clamp-2 flex-1">{item.description}</p>
                <button type="button" onClick={() => setChatItem(item)}
                  className="mt-2 w-full bg-[#1a1c22] hover:bg-[#252830] hover:text-[#4d8eff] text-white text-xs font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  <MessageSquare className="w-3 h-3" /> Chat with Seller
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-[#4d8eff]/10 to-[#a78bfa]/10 border border-[#4d8eff]/20 rounded-2xl p-8 text-center space-y-4">
        <Zap className="w-8 h-8 text-[#4d8eff] mx-auto" />
        <h3 className="text-xl font-bold text-white">Have something to sell or rent?</h3>
        <p className="text-sm text-[#94a3b8] max-w-md mx-auto">List it in 30 seconds. No fees, no couriers, campus-only buyers.</p>
        <button type="button" onClick={() => setSellOpen(true)}
          className="bg-[#4d8eff] hover:bg-[#3b7cee] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer text-sm">
          List an Item →
        </button>
      </div>

      {/* Modals */}
      <RentModal item={rentItem} isOpen={Boolean(rentItem)} onClose={() => setRentItem(null)} onSubmit={handleRent} currentStudent={guestStudent} />
      <ChatModal item={chatItem} isOpen={Boolean(chatItem)} onClose={() => setChatItem(null)} onSubmit={handleChat} currentStudent={guestStudent} />
      <SellListModal isOpen={sellOpen} onClose={() => setSellOpen(false)} onSubmit={handleList} currentStudent={guestStudent} />
      <Toast message={toast} />
    </div>
  );
};
