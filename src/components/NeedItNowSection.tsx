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
    <section className="section" id="need-it-now" aria-labelledby="need-it-now-title">
      <header className="section-header">
        <div>
          <span className="section-subtitle">Immediate Corridor Handoff</span>
          <h2 id="need-it-now-title" className="section-title">Need It Now</h2>
          <p className="section-desc">Available right now within your hostel wing. 5 to 15 min door-to-door pickup.</p>
        </div>
      </header>

      {/* Instant Stock Hostel Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap mb-6" role="group" aria-label="Hostel filter">
        <span className="text-caption text-muted">Instant stock in:</span>
        <div className="flex flex-wrap gap-2">
          {hostelFilters.map((h) => {
            const isSelected = selectedHostel === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => onSelectHostel(isSelected && h !== 'all' ? 'all' : h)}
                className={`btn-pill ${isSelected ? 'btn-pill-active' : 'btn-pill-secondary'}`}
                aria-pressed={isSelected}
              >
                {h === 'all' ? 'All Hostels' : h}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Compact Urgent Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list">
        {items.map((item) => (
          <article
            key={item.id}
            className="urgent-card relative"
            role="listitem"
          >
            <div className="relative">
              <img
                alt={item.title}
                src={item.imageUrl}
                referrerPolicy="no-referrer"
                className="urgent-card-image product-image"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="urgent-card-badge">{item.locationTag}</span>
            </div>

            <div className="urgent-card-content">
              <div className="urgent-card-title-row">
                <h3 className="urgent-card-title">{item.title}</h3>
                <span className="urgent-card-price">{item.priceDisplay}</span>
              </div>
              <p className="urgent-card-desc">{item.description}</p>
            </div>

            <div className="p-3 pt-0">
              <button
                type="button"
                onClick={() => onPingClick(item)}
                className="btn-pill btn-pill-primary w-full justify-center"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ping for Pickup</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {items.length === 0 && (
        <div className="card-elevated p-8 text-center">
          <p className="text-body text-muted">No urgent pickup items for this hostel right now.</p>
        </div>
      )}
    </section>
  );
};