import React from 'react';
import { Send } from 'lucide-react';
import { ListingItem } from '../types';

interface NeedItNowSectionProps {
  items: ListingItem[];
  selectedHostel: string;
  onSelectHostel: (hostel: string) => void;
  onPingClick: (item: ListingItem) => void;
}

export const NeedItNowSection: React.FC<NeedItNowSectionProps> = ({
  items,
  selectedHostel,
  onSelectHostel,
  onPingClick,
}) => {
  const hostelFilters = ['all', 'H-12', 'H-14', 'H-15', 'H-16'];

  return (
    <section className="space-y-6" id="need-it-now">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#22252b] pb-4">
        <div>
          <span className="text-xs font-semibold text-[#4d8eff] tracking-wide uppercase">
            Immediate Corridor Handoff
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Need It Now</h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Available right now within your hostel wing. 5 to 15 min door-to-door pickup.
          </p>
        </div>

        {/* Instant Stock Hostel Filter Chips */}
        <div className="flex items-center gap-1.5 text-xs flex-wrap">
          <span className="text-[#94a3b8] mr-1">Instant stock in:</span>
          {hostelFilters.map((h) => {
            const isSelected = selectedHostel === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => onSelectHostel(isSelected && h !== 'all' ? 'all' : h)}
                className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#4d8eff] border-[#4d8eff] text-white font-medium'
                    : 'bg-[#121316] border-[#22252b] text-[#94a3b8] hover:text-white hover:border-[#353945]'
                }`}
              >
                {h === 'all' ? 'All Hostels' : h}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Compact Urgent Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-[#121316] border border-[#22252b] rounded-lg p-3 space-y-3 hover:border-[#353945] transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/10] bg-[#1a1c22] rounded overflow-hidden relative">
                <img
                  alt={item.title}
                  src={item.imageUrl}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute top-2 left-2 bg-[#0a0a0c]/80 backdrop-blur text-[10px] text-white px-1.5 py-0.5 rounded border border-[#22252b]/60">
                  {item.locationTag}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="text-sm font-semibold text-white line-clamp-1">{item.title}</h3>
                  <span className="text-sm font-bold text-white whitespace-nowrap">
                    {item.priceDisplay}
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] mt-0.5 line-clamp-2 min-h-[32px]">
                  {item.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onPingClick(item)}
              className="w-full bg-[#1a1c22] hover:bg-[#252830] hover:text-[#4d8eff] text-white text-xs font-medium py-1.5 rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ping for Pickup</span>
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="p-8 text-center bg-[#121316] border border-[#22252b] rounded-lg">
          <p className="text-sm text-[#94a3b8]">No urgent pickup items for this hostel right now.</p>
        </div>
      )}
    </section>
  );
};
