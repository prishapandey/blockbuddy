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
    <section className="section" id="marketplace" aria-labelledby="marketplace-title">
      <header className="section-header">
        <div>
          <span className="section-subtitle">Second-Hand Campus Gear</span>
          <h2 id="marketplace-title" className="section-title">Fresh on Marketplace</h2>
          <p className="section-desc">Pre-loved essentials sold by seniors & wingmates at steep discounts.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAllExpanded(!showAllExpanded)}
          className="view-all-link"
        >
          <span>{showAllExpanded ? 'Show featured 4 items' : `View all ${Math.max(items.length, 84)} items`}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list">
        {displayItems.map((item) => (
          <article
            key={item.id}
            className="product-card"
            role="listitem"
          >
            <div className="relative">
              <img
                alt={item.title}
                src={item.imageUrl}
                referrerPolicy="no-referrer"
                className="product-card-image product-image"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="product-card-badge">{item.locationTag}</span>
            </div>

            <div className="product-card-content">
              <h3 className="product-card-title">{item.title}</h3>
              <p className="product-card-desc">{item.description}</p>

              <div className="product-card-footer">
                <span className="product-card-price">{item.priceDisplay}</span>
              </div>
            </div>

            <div className="product-card-action p-4 pt-0">
              <button
                type="button"
                onClick={() => onChatClick(item)}
                className="btn-pill btn-pill-secondary w-full justify-center"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat with Seller</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {items.length === 0 && (
        <div className="card-elevated p-8 text-center">
          <p className="text-body text-muted">No marketplace items currently available.</p>
        </div>
      )}
    </section>
  );
};