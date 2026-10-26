import React, { useState } from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { ListingItem } from '../types';

interface MarketplaceSectionProps {
  items: ListingItem[];
  onChatClick: (item: ListingItem) => void;
  onFilterCategory?: () => void;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({
  items,
  onChatClick,
}) => {
  const [showAllExpanded, setShowAllExpanded] = useState(false);

  // If expanded, show all items; otherwise show first 4 (or up to 8 if more exist)
  const displayItems = showAllExpanded ? items : items.slice(0, 4);

  return (
    <section className="space-y-6" id="marketplace">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#22252b] pb-4">
        <div>
          <span className="text-xs font-semibold text-[#4d8eff] tracking-wide uppercase">
            Second-Hand Campus Gear
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Fresh on Marketplace
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Pre-loved essentials sold by seniors &amp; wingmates at steep discounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAllExpanded(!showAllExpanded)}
          className="text-xs text-[#4d8eff] hover:underline flex items-center gap-1 font-medium cursor-pointer self-start sm:self-auto"
        >
          <span>{showAllExpanded ? 'Show featured 4 items' : `View all ${Math.max(items.length, 84)} items`}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayItems.map((item) => (
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
              onClick={() => onChatClick(item)}
              className="w-full bg-[#1a1c22] hover:bg-[#252830] hover:text-[#4d8eff] text-white text-xs font-medium py-1.5 rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat with Seller</span>
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="p-8 text-center bg-[#121316] border border-[#22252b] rounded-lg">
          <p className="text-sm text-[#94a3b8]">No marketplace items currently available.</p>
        </div>
      )}
    </section>
  );
};
