import React, { useMemo, useState } from 'react';
import { Calendar, Search, SlidersHorizontal } from 'lucide-react';
import { RentModal } from '../components/modals/RentModal';
import { Toast } from '../components/Toast';
import { getLocalItems, saveRentalBooking, saveCorridorPing } from '../lib/supabase';
import { ListingItem, RentalBooking, CorridorPing } from '../types';
import { useAuth } from '../context/AuthContext';

const QUICK_TAGS = ['All', 'Scientific Calculators', 'Electric Kettles', 'Electronics', 'Kitchen Appliances', 'Sports & Fitness', 'Drawing Supplies', 'Formal Wear'];
const HOSTELS = ['All', 'A Block', 'B Block', 'C Block', 'D Block', 'E Block', 'F Block'];

export const RentalsPage: React.FC = () => {
  const { student } = useAuth();
  const [items] = useState<ListingItem[]>(getLocalItems);
  const [search, setSearch] = useState('');
  const [hostel, setHostel] = useState('All');
  const [tag, setTag] = useState('All');
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'default'>('default');
  const [rentItem, setRentItem] = useState<ListingItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3200); };

  const filtered = useMemo(() => {
    let r = items.filter((i) => i.category === 'rental');
    if (tag !== 'All') r = r.filter((i) => i.quickTag === tag);
    if (hostel !== 'All') r = r.filter((i) => i.hostel === hostel);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    if (sort === 'price-asc') r = [...r].sort((a, b) => a.priceValue - b.priceValue);
    if (sort === 'price-desc') r = [...r].sort((a, b) => b.priceValue - a.priceValue);
    return r;
  }, [items, tag, hostel, search, sort]);

  const handleRent = async (data: any) => {
    const booking: RentalBooking = {
      id: `booking-${Date.now()}`,
      itemId: data.item.id, itemTitle: data.item.title,
      renterName: student?.name || 'Guest', renterHostel: student?.hostel || 'A Block', renterRoom: student?.room || '',
      durationType: data.durationType, durationCount: data.durationCount,
      totalAmount: data.totalAmount, depositAmount: 150,
      pickupTime: data.pickupTime, status: 'confirmed', createdAt: new Date().toISOString(),
    };
    const ping: CorridorPing = {
      id: `ping-${Date.now()}`, itemId: data.item.id, itemTitle: data.item.title,
      sellerName: data.item.sellerName, senderName: student?.name || 'Guest',
      senderHostel: student?.hostel || 'A Block', message: data.message,
      timestamp: new Date().toISOString(), status: 'sent',
    };
    await saveRentalBooking(booking);
    await saveCorridorPing(ping);
    setRentItem(null);
    showToast(`Rent request sent to ${data.item.sellerName.split(' ')[0]}!`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <span className="text-xs font-semibold text-[#4d8eff] tracking-wide uppercase">Short-Term Utility</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">Rent Campus Equipment</h1>
        <p className="text-sm text-[#94a3b8] mt-1">Don't buy items you need for one exam or one interview.</p>
      </div>

      {/* Filters */}
      <div className="bg-[#121316] border border-[#22252b] rounded-xl p-4 space-y-3">
        <div className="flex gap-2 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rentals..."
              className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-lg text-sm text-white placeholder-[#64748b] pl-9 pr-3 py-2 focus:outline-none focus:border-[#4d8eff]"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#64748b] shrink-0" />
            <select value={sort} onChange={(e) => setSort(e.target.value as any)}
              className="bg-[#0a0a0c] border border-[#22252b] rounded-lg text-xs text-white px-3 py-2 focus:outline-none focus:border-[#4d8eff]">
              <option value="default">Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Hostel chips */}
        <div className="flex gap-1.5 flex-wrap">
          {HOSTELS.map((h) => (
            <button key={h} type="button" onClick={() => setHostel(h)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${hostel === h ? 'bg-[#4d8eff] border-[#4d8eff] text-white' : 'border-[#22252b] text-[#94a3b8] hover:text-white'}`}>
              {h}
            </button>
          ))}
        </div>

        {/* Tag chips */}
        <div className="flex gap-1.5 flex-wrap">
          {QUICK_TAGS.map((t) => (
            <button key={t} type="button" onClick={() => setTag(t)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${tag === t ? 'bg-[#4d8eff]/15 border-[#4d8eff] text-[#4d8eff]' : 'border-[#22252b] text-[#64748b] hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-[#64748b]">{filtered.length} item{filtered.length !== 1 ? 's' : ''} available</p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.id}
            className="bg-[#121316] border border-[#22252b] rounded-xl overflow-hidden flex flex-col group hover:border-[#4d8eff]/40 transition-colors">
            <div className="aspect-[16/10] bg-[#1a1c22] relative overflow-hidden">
              <img src={item.imageUrl} alt={item.title} referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="absolute top-2 left-2 bg-[#0a0a0c]/80 backdrop-blur text-[10px] text-white px-1.5 py-0.5 rounded border border-[#22252b]/60">
                {item.locationTag}
              </span>
              {item.badgeNote && (
                <span className="absolute top-2 right-2 bg-[#4d8eff]/90 text-[9px] text-white font-medium px-1.5 py-0.5 rounded">
                  {item.badgeNote}
                </span>
              )}
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-sm font-semibold text-white line-clamp-1">{item.title}</h3>
              <p className="text-xs text-[#94a3b8] mt-1 line-clamp-2 flex-1">{item.description}</p>
              <div className="mt-3 pt-3 border-t border-[#22252b]/60">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-bold text-[#4d8eff]">{item.priceDisplay}</span>
                    <span className="text-xs text-[#94a3b8]"> {item.priceUnit}</span>
                  </div>
                  {item.deposit && <span className="text-[10px] text-[#64748b]">{item.deposit}</span>}
                </div>
                {item.secondaryPrice && <p className="text-[11px] text-[#64748b] mt-0.5">{item.secondaryPrice}</p>}
              </div>
              <button type="button" onClick={() => setRentItem(item)}
                className="mt-3 w-full bg-[#1e2128] hover:bg-[#4d8eff] text-white text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                <Calendar className="w-3.5 h-3.5" />
                Rent Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center bg-[#121316] border border-[#22252b] rounded-xl">
          <p className="text-[#94a3b8]">No rentals match your filters.</p>
        </div>
      )}

      <RentModal item={rentItem} isOpen={Boolean(rentItem)} onClose={() => setRentItem(null)}
        onSubmit={handleRent} currentStudent={student || { name: '', email: '', hostel: 'A Block', room: '', wing: '', department: '' }} />
      <Toast message={toast} />
    </div>
  );
};
