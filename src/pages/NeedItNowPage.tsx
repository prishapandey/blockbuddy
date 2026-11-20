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
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center shrink-0 mt-1">
          <Zap className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <span className="text-xs font-semibold text-amber-400 tracking-wide uppercase">Immediate Corridor Handoff</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">Need It Now</h1>
          <p className="text-sm text-[#94a3b8] mt-1">Available right now within your hostel wing. 5–15 min door-to-door pickup.</p>
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 text-xs text-[#64748b]">
        <span className="w-2 h-2 rounded-full bg-[#3ecf8e] animate-pulse" />
        <span>{filtered.length} items available right now</span>
      </div>

      {/* Filters */}
      <div className="bg-[#121316] border border-[#22252b] rounded-xl p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search urgent items..."
            className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-lg text-sm text-white placeholder-[#64748b] pl-9 pr-3 py-2 focus:outline-none focus:border-[#4d8eff]" />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {HOSTELS.map((h) => (
            <button key={h} type="button" onClick={() => setHostel(h)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${hostel === h ? 'bg-amber-500 border-amber-500 text-white' : 'border-[#22252b] text-[#94a3b8] hover:text-white'}`}>
              {h}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {TAGS.map((t) => (
            <button key={t} type="button" onClick={() => setTag(t)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${tag === t ? 'bg-amber-500/15 border-amber-500 text-amber-400' : 'border-[#22252b] text-[#64748b] hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.id}
            className="bg-[#121316] border border-[#22252b] rounded-xl overflow-hidden flex flex-col hover:border-amber-500/30 transition-colors">
            <div className="aspect-[16/10] bg-[#1a1c22] relative overflow-hidden">
              <img src={item.imageUrl} alt={item.title} referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="absolute top-2 left-2 bg-[#0a0a0c]/80 backdrop-blur text-[10px] text-white px-1.5 py-0.5 rounded border border-[#22252b]/60">
                {item.locationTag}
              </span>
              <span className="absolute top-2 right-2 flex items-center gap-1 bg-[#3ecf8e]/90 text-[9px] text-black font-bold px-1.5 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-black/40" />
                LIVE
              </span>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-1">
                <h3 className="text-sm font-semibold text-white line-clamp-1">{item.title}</h3>
                <span className="text-sm font-bold text-white whitespace-nowrap">{item.priceDisplay}</span>
              </div>
              <p className="text-xs text-[#94a3b8] mt-1 line-clamp-2 flex-1">{item.description}</p>
              <button type="button" onClick={() => setChatItem(item)}
                className="mt-3 w-full bg-[#1a1c22] hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/40 border border-[#22252b] text-white text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                <Send className="w-3.5 h-3.5" />
                Ping for Pickup
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center bg-[#121316] border border-[#22252b] rounded-xl">
          <p className="text-[#94a3b8]">No urgent items for this filter right now.</p>
        </div>
      )}

      <ChatModal item={chatItem} isOpen={Boolean(chatItem)} onClose={() => setChatItem(null)}
        onSubmit={handleChat} currentStudent={student || { name: '', email: '', hostel: 'A Block', room: '', wing: '', department: '' }} />
      <Toast message={toast} />
    </div>
  );
};
