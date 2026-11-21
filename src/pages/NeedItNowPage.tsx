import React, { useMemo, useState } from 'react';
import { Search, Send, Zap } from 'lucide-react';
import { ChatModal } from '../components/modals/ChatModal';
import { Toast } from '../components/Toast';
import { getLocalItems, saveCorridorPing } from '../lib/supabase';
import { CorridorPing, ListingItem } from '../types';
import { useAuth } from '../context/AuthContext';

const HOSTELS = ['All', 'A Block', 'B Block', 'C Block', 'D Block', 'E Block', 'F Block'];
const TAGS = ['All', 'Midnight Snacks', 'Exam Stationery', 'Cables & Adapters', 'Health & Wellness'];

export const NeedItNowPage: React.FC = () => {
  const { student } = useAuth();
  const [items] = useState<ListingItem[]>(getLocalItems);
  const [search, setSearch] = useState('');
  const [hostel, setHostel] = useState('All');
  const [tag, setTag] = useState('All');
  const [chatItem, setChatItem] = useState<ListingItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3200); };

  const filtered = useMemo(() => {
    let r = items.filter((i) => i.category === 'urgent');
    if (hostel !== 'All') r = r.filter((i) => i.hostel === hostel);
    if (tag !== 'All') r = r.filter((i) => i.quickTag === tag);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    return r;
  }, [items, hostel, tag, search]);

  const handleChat = async (data: { item: ListingItem; message: string }) => {
    const ping: CorridorPing = {
      id: `ping-${Date.now()}`, itemId: data.item.id, itemTitle: data.item.title,
      sellerName: data.item.sellerName, senderName: student?.name || 'Guest',
      senderHostel: student?.hostel || 'A Block', message: data.message,
      timestamp: new Date().toISOString(), status: 'sent',
    };
    await saveCorridorPing(ping);
    setChatItem(null);
    showToast('Ping sent! Seller notified via corridor messenger.');
  };

  return (
    <div className="space-y-6 text-[#CDCBD6]">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#D96846]/20 border border-[#D96846]/40 flex items-center justify-center shrink-0 mt-1">
          <Zap className="w-5 h-5 text-[#D96846]" />
        </div>
        <div>
          <span className="text-xs font-semibold text-[#D96846] tracking-wide uppercase">Immediate Corridor Handoff</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">Need It Now</h1>
          <p className="text-sm text-[#9fa293] mt-1">Available right now within your hostel wing. 5–15 min door-to-door pickup.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#26271a] border border-[#434630] rounded-xl p-4 space-y-3 shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9fa293]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search urgent items..."
            className="w-full bg-[#1e1f14] border border-[#434630] rounded-lg text-sm text-white placeholder-[#9fa293]/60 pl-9 pr-3 py-2 focus:outline-none focus:border-[#D96846]" />
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
          {TAGS.map((t) => (
            <button key={t} type="button" onClick={() => setTag(t)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${tag === t ? 'bg-[#D96846]/20 border-[#D96846] text-[#D96846]' : 'border-[#434630] text-[#9fa293] hover:text-white hover:bg-[#353826]'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#9fa293]">{filtered.length} item{filtered.length !== 1 ? 's' : ''} available right now</p>

      {/* Grid */}
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
              <span className="absolute top-2 right-2 bg-[#596235] text-[9px] text-white font-bold px-2 py-0.5 rounded">
                LIVE
              </span>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-1">
                <h3 className="text-sm font-semibold text-white line-clamp-1">{item.title}</h3>
                <span className="text-sm font-bold text-white whitespace-nowrap">{item.priceDisplay}</span>
              </div>
              <p className="text-xs text-[#CDCBD6]/80 mt-1 line-clamp-2 flex-1">{item.description}</p>
              <button type="button" onClick={() => setChatItem(item)}
                className="mt-3 w-full bg-[#2b2d1e] hover:bg-[#D96846] border border-[#434630] text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow">
                <Send className="w-3.5 h-3.5" />
                Ping for Pickup
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center bg-[#26271a] border border-[#434630] rounded-xl space-y-3">
          <p className="text-[#CDCBD6]">No urgent items match your current search and filters.</p>
          <button
            type="button"
            onClick={() => { setSearch(''); setHostel('All'); setTag('All'); }}
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
