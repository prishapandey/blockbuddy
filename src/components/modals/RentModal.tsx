import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, MapPin, X } from 'lucide-react';
import { ListingItem, StudentProfile } from '../../types';

interface RentModalProps {
  item: ListingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    item: ListingItem;
    durationType: 'exam' | 'hour' | 'day' | 'week';
    durationCount: number;
    pickupTime: string;
    message: string;
    totalAmount: number;
  }) => void;
  currentStudent: StudentProfile;
}

export const RentModal: React.FC<RentModalProps> = ({
  item,
  isOpen,
  onClose,
  onSubmit,
  currentStudent,
}) => {
  if (!isOpen || !item) return null;

  const [durationType, setDurationType] = useState<'exam' | 'hour' | 'day' | 'week'>(
    item.priceUnit.includes('exam')
      ? 'exam'
      : item.priceUnit.includes('hour')
      ? 'hour'
      : 'day'
  );
  const [durationCount, setDurationCount] = useState<number>(1);
  const [pickupTime, setPickupTime] = useState<string>('In 15 minutes');
  const [message, setMessage] = useState<string>(
    `Hi ${item.sellerName.split(' ')[0]}, I need this for rent. When can I pick it up from your wing?`
  );

  const calculateTotal = () => {
    let rate = item.priceValue;
    if (durationType === 'exam') rate = item.priceValue;
    else if (durationType === 'hour') rate = item.priceValue;
    else if (durationType === 'day') rate = item.priceValue;
    else if (durationType === 'week') rate = item.priceValue * 5; // discounted week
    return rate * durationCount;
  };

  const total = calculateTotal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      item,
      durationType,
      durationCount,
      pickupTime,
      message,
      totalAmount: total,
    });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="rent-modal-title">
      <div className="modal-container">
        <header className="flex items-center justify-between border-b border-faint p-4 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
            <h3 id="rent-modal-title" className="text-body text-ink">Rent Campus Equipment</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-canvas hover:bg-faint text-muted hover:text-ink transition-colors cursor-pointer flex items-center justify-center"
            type="button"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Item Preview Card */}
        <div className="card-elevated m-4 p-3 space-y-2">
          <div className="flex gap-3">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-16 h-16 object-cover product-image bg-surface"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-body text-ink truncate">{item.title}</h4>
              <p className="text-caption text-muted mt-1">{item.locationTag}</p>
              <div className="flex items-center gap-2 mt-1 text-caption">
                <span className="text-accent font-medium">{item.priceDisplay}</span>
                <span className="text-muted">{item.priceUnit}</span>
                {item.deposit && (
                  <span className="text-[10px] text-muted bg-surface px-2 py-0.5 rounded-full border border-faint">
                    {item.deposit}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* Duration Selector */}
          <fieldset className="space-y-3">
            <legend className="text-caption text-muted flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
              <span>Rental Period</span>
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-caption">
              {item.priceUnit.includes('exam') && (
                <button
                  type="button"
                  onClick={() => setDurationType('exam')}
                  className={`py-3 px-3 rounded-full border text-center transition-colors ${
                    durationType === 'exam'
                      ? 'bg-accent border-accent text-white shadow-accent'
                      : 'bg-canvas border-transparent text-muted hover:text-ink'
                  }`}
                >
                  Exam Period
                </button>
              )}
              {item.priceUnit.includes('hour') && (
                <button
                  type="button"
                  onClick={() => setDurationType('hour')}
                  className={`py-3 px-3 rounded-full border text-center transition-colors ${
                    durationType === 'hour'
                      ? 'bg-accent border-accent text-white shadow-accent'
                      : 'bg-canvas border-transparent text-muted hover:text-ink'
                  }`}
                >
                  Hourly
                </button>
              )}
              <button
                type="button"
                onClick={() => setDurationType('day')}
                className={`py-3 px-3 rounded-full border text-center transition-colors ${
                  durationType === 'day'
                    ? 'bg-accent border-accent text-white shadow-accent'
                    : 'bg-canvas border-transparent text-muted hover:text-ink'
                }`}
              >
                1 Day
              </button>
              <button
                type="button"
                onClick={() => setDurationType('week')}
                className={`py-3 px-3 rounded-full border text-center transition-colors ${
                  durationType === 'week'
                    ? 'bg-accent border-accent text-white shadow-accent'
                    : 'bg-canvas border-transparent text-muted hover:text-ink'
                }`}
              >
                1 Week
              </button>
            </div>
          </fieldset>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-caption text-muted block">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDurationCount(Math.max(1, durationCount - 1))}
                className="w-8 h-8 rounded-full bg-canvas hover:bg-faint text-ink flex items-center justify-center transition-colors"
                aria-label="Decrease quantity"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
              <span className="text-body text-ink font-medium w-8 text-center">{durationCount}</span>
              <button
                type="button"
                onClick={() => setDurationCount(durationCount + 1)}
                className="w-8 h-8 rounded-full bg-canvas hover:bg-faint text-ink flex items-center justify-center transition-colors"
                aria-label="Increase quantity"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
            </div>
          </div>

          {/* Pickup Window */}
          <div className="space-y-2">
            <label className="text-caption text-muted flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
              <span>Corridor Pickup Time</span>
            </label>
            <select
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="input-pill appearance-none bg-surface cursor-pointer"
            >
              <option value="In 15 minutes">In 15 minutes (Immediate pickup)</option>
              <option value="This evening (8 PM - 10 PM)">This evening (8 PM - 10 PM)</option>
              <option value="Tonight midnight (Study session)">Tonight midnight (Study session)</option>
              <option value="Tomorrow morning (Before exam)">Tomorrow morning (Before exam)</option>
            </select>
          </div>

          {/* Custom Message to Seller */}
          <div className="space-y-2">
            <label className="text-caption text-muted block">Direct Campus Ping</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full bg-surface border border-faint rounded-inner text-body text-ink placeholder-muted px-4 py-3 focus:outline-none focus:border-accent resize-none font-gt-standard"
              placeholder="Add a note for the seller..."
            />
          </div>

          {/* Calculation summary */}
          <div className="bg-canvas p-4 rounded-inner flex flex-col sm:flex-row items-center justify-between text-caption gap-3">
            <div className="text-muted">
              Estimated rent: <span className="text-ink font-medium">₹{total}</span>
              <span className="text-[10px] text-muted block">Direct UPI to seller on corridor handoff</span>
            </div>
            <div className="text-right text-[10px] text-accent font-medium">
              0% Platform Fee
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 btn-pill btn-pill-primary justify-center py-3"
            >
              Send Rent Request
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-pill btn-pill-secondary py-3 px-6"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};