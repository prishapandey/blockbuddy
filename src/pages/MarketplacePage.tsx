import React, { useMemo, useState } from 'react';
import { MessageSquare, Search, SlidersHorizontal } from 'lucide-react';
import { ChatModal } from '../components/modals/ChatModal';
import { Toast } from '../components/Toast';
import { getLocalItems, saveCorridorPing } from '../lib/supabase';
import { CorridorPing, ListingItem } from '../types';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Textbooks', 'Electronics', 'Tools & Hardware', 'Furniture'];
const HOSTELS = ['All', 'A Block', 'B Block', 'C Block', 'D Block', 'E Block', 'F Block'];

export const MarketplacePage: React.FC = () => {
  const { student } = useAuth();
  const [items] = useState<ListingItem[]>(getLocalItems);
  const [search, setSearch] = useState('');
  const [hostel, setHostel] = useState('All');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'default'>('default');
  const [chatItem, setChatItem] = useState<ListingItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3200); };

  const filtered = useMemo(() => {
    let r = items.filter((i) => i.category === 'marketplace');
    if (cat !== 'All') r = r.filter((i) => i.quickTag === cat);
    if (hostel !== 'All') r = r.filter((i) => i.hostel === hostel);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    if (sort === 'price-asc') r = [...r].sort((a, b) => a.priceValue - b.priceValue);
    if (sort === 'price-desc') r = [...r].sort((a, b) => b.priceValue - a.priceValue);
    return r;
  }, [items, cat, hostel, search, sort]);

  const handleChat = async (data: { item: ListingItem; message: string }) => {
    const ping: CorridorPing = {
      id: `ping-${Date.now()}`, itemId: data.item.id, itemTitle: data.item.title,
      sellerName: data.item.sellerName, senderName: student?.name || 'Guest',
      senderHostel: student?.hostel || 'A Block', message: data.message,
      timestamp: new Date().toISOString(), status: 'sent',
    };
    await saveCorridorPing(ping);
    setChatItem(null);
    showToast(`Message sent to ${data.item.sellerName.split(' ')[0]}!`);
  };

  return (
    <div className="space-y-6 text-[#CDCBD6]">
      <div>
        <span className="text-xs font-semibold text-[#D96846] tracking-wide uppercase">Second-Hand Campus Gear</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">Marketplace</h1>
        <p className="text-sm text-[#9fa293] mt-1">Pre-loved essentials at steep discounts from seniors and wingmates. 0% platform fee.</p>
      </div>

      {/* Filters */}
      <div className="bg-[#26271a] border border-[#434630] rounded-xl p-4 space-y-3 shadow-md">
        <div className="flex gap-2 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9fa293]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="w-full bg-[#1e1f14] border border-[#434630] rounded-lg text-sm text-white placeholder-[#9fa293]/60 pl-9 pr-3 py-2 focus:outline-none focus:border-[#D96846]" />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#9fa293] shrink-0" />
            <select value={sort} onChange={(e) => setSort(e.target.value as any)}
              className="bg-[#1e1f14] border border-[#434630] rounded-lg text-xs text-white px-3 py-2 focus:outline-none focus:border-[#D96846]">
              <option value="default">Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {HOSTELS.map((h) => (
            <button key={h} type="button" onClick={() => setHostel(h)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${hostel === h ? 'bg-[#D96846] border-[#D96846] text-white' : 'border-[#434630] text-[#CDCBD6] hover:text-white hover:bg-[#353826]'}`}>
              {h}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${cat === c ? 'bg-[#D96846]/20 border-[#D96846] text-[#D96846]' : 'border-[#434630] text-[#9fa293] hover:text-white hover:bg-[#353826]'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#9fa293]">{filtered.length} listing{filtered.length !== 1 ? 's' : ''}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.id}
            className="bg-[#26271a] border border-[#434630] rounded-xl overflow-hidden flex flex-col hover:border-[#D96846] transition-colors shadow-lg">
            <div className="aspect-[16/10] bg-[#1e1f14] relative overflow-hidden">
              <img src={item.imageUrl} alt={item.title} referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="absolute top-2 left-2 bg-[#242519]/80 backdrop-blur text-[10px] text-white px-2 py-0.5 rounded border border-[#434630]">
                {item.locationTag}
              </span>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-1">
                <h3 className="text-sm font-semibold text-white line-clamp-1">{item.title}</h3>
                <span className="text-sm font-bold text-white whitespace-nowrap">{item.priceDisplay}</span>
              </div>
              <p className="text-xs text-[#CDCBD6]/80 mt-1 line-clamp-2 flex-1">{item.description}</p>
              <p className="text-[11px] text-[#9fa293] mt-2">By {item.sellerName}</p>
              <button type="button" onClick={() => setChatItem(item)}
                className="mt-3 w-full bg-[#2b2d1e] hover:bg-[#D96846] hover:text-white text-[#CDCBD6] border border-[#434630] text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow">
                <MessageSquare className="w-3.5 h-3.5" />
                Chat with Seller
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center bg-[#26271a] border border-[#434630] rounded-xl space-y-3">
          <p className="text-[#CDCBD6]">No marketplace listings match your current search and filters.</p>
          <button
            type="button"
            onClick={() => { setSearch(''); setHostel('All'); setCat('All'); setSort('default'); }}
            className="text-xs bg-[#2b2d1e] hover:bg-[#363926] text-[#D96846] border border-[#D96846]/40 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      <ChatModal item={chatItem} isOpen={Boolean(chatItem)} onClose={() => setChatItem(null)}
        onSubmit={handleChat} currentStudent={student || { name: '', email: '', hostel: 'A Block', room: '', wing: '', department: '' }} />
      <Toast message={toast} />
    </div>
  );
};
