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
    <div className="fixed inset-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121316] border border-[#22252b] w-full max-w-md rounded-lg p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#22252b] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4d8eff]"></span>
            <h3 className="text-sm font-semibold text-white">Rent Campus Equipment</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-white transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item Preview Card */}
        <div className="bg-[#0a0a0c] border border-[#22252b] rounded-lg p-3 space-y-2">
          <div className="flex gap-3">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-16 h-16 object-cover rounded bg-[#1a1c22] border border-[#22252b]"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
              <p className="text-xs text-[#94a3b8] mt-0.5">{item.locationTag}</p>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="text-[#4d8eff] font-bold">{item.priceDisplay}</span>
                <span className="text-[#64748b]">{item.priceUnit}</span>
                {item.deposit && (
                  <span className="text-[10px] text-[#94a3b8] bg-[#121316] px-1.5 py-0.5 rounded border border-[#22252b]">
                    {item.deposit}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Duration Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#94a3b8] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#4d8eff]" />
              <span>Rental Period:</span>
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {item.priceUnit.includes('exam') && (
                <button
                  type="button"
                  onClick={() => setDurationType('exam')}
                  className={`py-2 px-2.5 rounded border text-center transition-colors ${
                    durationType === 'exam'
                      ? 'bg-[#4d8eff]/15 border-[#4d8eff] text-white font-medium'
                      : 'bg-[#0a0a0c] border-[#22252b] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Exam Period
                </button>
              )}
              {item.priceUnit.includes('hour') && (
                <button
                  type="button"
                  onClick={() => setDurationType('hour')}
                  className={`py-2 px-2.5 rounded border text-center transition-colors ${
                    durationType === 'hour'
                      ? 'bg-[#4d8eff]/15 border-[#4d8eff] text-white font-medium'
                      : 'bg-[#0a0a0c] border-[#22252b] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Hourly
                </button>
              )}
              <button
                type="button"
                onClick={() => setDurationType('day')}
                className={`py-2 px-2.5 rounded border text-center transition-colors ${
                  durationType === 'day'
                    ? 'bg-[#4d8eff]/15 border-[#4d8eff] text-white font-medium'
                    : 'bg-[#0a0a0c] border-[#22252b] text-[#94a3b8] hover:text-white'
                }`}
              >
                1 Day
              </button>
              <button
                type="button"
                onClick={() => setDurationType('week')}
                className={`py-2 px-2.5 rounded border text-center transition-colors ${
                  durationType === 'week'
                    ? 'bg-[#4d8eff]/15 border-[#4d8eff] text-white font-medium'
                    : 'bg-[#0a0a0c] border-[#22252b] text-[#94a3b8] hover:text-white'
                }`}
              >
                1 Week
              </button>
            </div>
          </div>

          {/* Pickup Window */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#94a3b8] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#4d8eff]" />
              <span>Corridor Pickup Time:</span>
            </label>
            <select
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-[#22252b] rounded text-xs text-white p-2.5 focus:outline-none focus:border-[#4d8eff]"
            >
              <option value="In 15 minutes">In 15 minutes (Immediate pickup)</option>
              <option value="This evening (8 PM - 10 PM)">This evening (8 PM - 10 PM)</option>
              <option value="Tonight midnight (Study session)">Tonight midnight (Study session)</option>
              <option value="Tomorrow morning (Before exam)">Tomorrow morning (Before exam)</option>
            </select>
          </div>

          {/* Custom Message to Seller */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#94a3b8] block">Direct Campus Ping:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full bg-[#0a0a0c] border border-[#22252b] rounded text-xs text-white p-2.5 focus:outline-none focus:border-[#4d8eff]"
            />
          </div>

          {/* Calculation summary */}
          <div className="bg-[#0a0a0c] p-2.5 rounded border border-[#22252b] flex items-center justify-between text-xs">
            <div className="text-[#94a3b8]">
              Estimated rent: <span className="text-white font-bold">₹{total}</span>
              <span className="text-[10px] text-[#64748b] block">Direct UPI to seller on corridor handoff</span>
            </div>
            <div className="text-right text-[11px] text-[#3ecf8e]">
              0% Platform Fee
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-[#4d8eff] hover:bg-[#3b7cee] text-white text-xs font-semibold py-2.5 rounded transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              Send Rent Request
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#1a1c22] hover:bg-[#252830] text-[#94a3b8] text-xs font-medium px-4 py-2.5 rounded transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
