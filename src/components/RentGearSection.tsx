import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
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
    <section className="section" id="rent-gear" aria-labelledby="rent-gear-title">
      <header className="section-header">
        <div>
          <span className="section-subtitle">Short-Term Utility</span>
          <h2 id="rent-gear-title" className="section-title">Rent Campus Equipment</h2>
          <p className="section-desc">Don't buy items you only need for one semester, one exam, or an interview.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Buy vs Rent Toggle */}
          <div className="tab-pills">
            <button
              type="button"
              className="tab-pill tab-pill-active"
              aria-selected="true"
            >
              Rent Gear
            </button>
            <button
              type="button"
              onClick={onSwitchToBuy}
              className="tab-pill"
              aria-selected="false"
            >
              Buy / Thrift
            </button>
          </div>
        </div>
      </header>

      {/* 4 Rentable Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list">
        {items.map((item) => (
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
                <div>
                  <span className="product-card-price">{item.priceDisplay}</span>
                  <span className="product-card-price-unit"> {item.priceUnit}</span>
                  {item.secondaryPrice && (
                    <span className="product-card-secondary">{item.secondaryPrice}</span>
                  )}
                </div>
                {item.deposit && (
                  <span className="product-card-deposit">{item.deposit}</span>
                )}
              </div>
            </div>

            <div className="product-card-action p-4 pt-0">
              <button
                type="button"
                onClick={() => onRentClick(item)}
                className="btn-pill btn-pill-primary w-full justify-center"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Rent Now</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {items.length === 0 && (
        <div className="card-elevated p-8 text-center">
          <p className="text-body text-muted">No rental items matching your current filter.</p>
        </div>
      )}

      <div className="text-center mt-8">
        <button
          type="button"
          onClick={onSwitchToBuy}
          className="view-all-link"
        >
          <span>View all marketplace items</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};