import React from 'react';
import { Calendar } from 'lucide-react';
import { ListingItem } from '../types';

interface RentGearSectionProps {
  items: ListingItem[];
  onRentClick: (item: ListingItem) => void;
  onSwitchToBuy: () => void;
}

export const RentGearSection: React.FC<RentGearSectionProps> = ({
  items,
  onRentClick,
  onSwitchToBuy,
}) => {
  return (
    <section className="space-y-6" id="rent-gear">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#22252b] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#4d8eff] tracking-wide uppercase">
              Short-Term Utility
            </span>
            <span className="text-xs bg-[#4d8eff]/10 text-[#4d8eff] px-2 py-0.5 rounded border border-[#4d8eff]/20 font-medium">
              Hourly &amp; Daily
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Rent Campus Equipment
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Don't buy items you only need for one semester, one exam, or an interview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Buy vs Rent Toggle */}
          <div className="bg-[#121316] border border-[#22252b] rounded-md p-0.5 flex text-xs">
            <button
              type="button"
              className="px-3 py-1 rounded bg-[#22252b] text-white font-medium cursor-default"
            >
              Rent Gear
            </button>
            <button
              type="button"
              onClick={onSwitchToBuy}
              className="px-3 py-1 rounded text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
            >
              Buy / Thrift
            </button>
          </div>
        </div>
      </div>

      {/* 4 Rentable Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-[#121316] border border-[#22252b] rounded-lg overflow-hidden flex flex-col justify-between group hover:border-[#4d8eff]/50 transition-colors"
          >
            <div>
              <div className="aspect-[16/10] bg-[#1a1c22] overflow-hidden relative">
                <img
                  alt={item.title}
                  src={item.imageUrl}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback visual
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute top-2 left-2 bg-[#0a0a0c]/80 backdrop-blur text-[11px] text-white font-medium px-2 py-0.5 rounded border border-[#22252b]">
                  {item.locationTag}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-sm font-semibold text-white line-clamp-1">{item.title}</h3>
                <p className="text-xs text-[#94a3b8] line-clamp-2 min-h-[32px]">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-[#22252b]/60 flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-bold text-[#4d8eff]">{item.priceDisplay}</span>
                    <span className="text-xs text-[#94a3b8]"> {item.priceUnit}</span>
                    {item.secondaryPrice && (
                      <span className="text-xs text-[#64748b] block">{item.secondaryPrice}</span>
                    )}
                  </div>
                  {item.deposit && (
                    <span className="text-[10px] text-[#64748b]">{item.deposit}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                type="button"
                onClick={() => onRentClick(item)}
                className="w-full bg-[#1e2128] hover:bg-[#4d8eff] hover:text-white text-white text-xs font-medium py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Rent Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="p-8 text-center bg-[#121316] border border-[#22252b] rounded-lg">
          <p className="text-sm text-[#94a3b8]">No rental items matching your current filter.</p>
        </div>
      )}
    </section>
  );
};
