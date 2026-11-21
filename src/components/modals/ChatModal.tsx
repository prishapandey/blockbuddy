import React, { useState, useEffect } from 'react';
import { Send, X, Zap } from 'lucide-react';
import { ListingItem, StudentProfile } from '../../types';

interface ChatModalProps {
  item: ListingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    item: ListingItem;
    message: string;
  }) => void;
  currentStudent: StudentProfile;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  item,
  isOpen,
  onClose,
  onSubmit,
  currentStudent,
}) => {
  if (!isOpen || !item) return null;

  const defaultMsg =
    item.category === 'urgent'
      ? `Hey! Is ${item.title} still available? Can pick it up in 5 minutes from ${item.locationTag}.`
      : `Hi! Interested in "${item.title}". Can I drop by to inspect it?`;

  const [message, setMessage] = useState<string>(defaultMsg);

  useEffect(() => {
    setMessage(defaultMsg);
  }, [item]);

  const quickChips = [
    'Can pick up in 5 minutes',
    'Are you in your room right now?',
    'Will pay via GPay / UPI',
    'Can you leave it with your wingmate?',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSubmit({ item, message });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#242519]/80 backdrop-blur-sm flex items-center justify-center p-4 text-[#CDCBD6]">
      <div className="bg-[#26271a] border border-[#434630] w-full max-w-sm rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#434630] pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#D96846]" />
            <h3 className="text-sm font-semibold text-white">
              {item.category === 'urgent' ? 'Immediate Corridor Ping' : 'Seller Inquiry'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9fa293] hover:text-white transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item Info Box */}
        <div className="bg-[#1e1f14] border border-[#434630] rounded-xl p-3 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium truncate max-w-[200px]">{item.title}</span>
            <span className="text-white font-bold">{item.priceDisplay}</span>
          </div>
          <div className="text-[#CDCBD6] flex items-center justify-between">
            <span>{item.locationTag}</span>
            <span className="text-[#9fa293] text-[11px]">{item.sellerName}</span>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1">
          <span className="text-[11px] text-[#9fa293]">Quick message shortcuts:</span>
          <div className="flex flex-wrap gap-1.5">
            {quickChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setMessage(chip)}
                className="text-[11px] bg-[#1e1f14] hover:bg-[#353826] text-[#CDCBD6] hover:text-white px-2.5 py-1 rounded-md border border-[#434630] transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs text-[#CDCBD6] block">Direct Campus Ping:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full bg-[#1e1f14] border border-[#434630] rounded-lg text-xs text-white p-2.5 focus:outline-none focus:border-[#D96846]"
            />
          </div>

          <div className="text-[11px] text-[#9fa293] flex items-center justify-between">
            <span>
              From: {currentStudent.name} ({currentStudent.hostel})
            </span>
            <span className="text-[#596235] font-semibold">Campus Verified</span>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-[#D96846] hover:bg-[#c45735] text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Ping</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#202115] hover:bg-[#2b2d1e] text-[#CDCBD6] text-xs font-medium px-4 py-2 rounded-lg border border-[#434630] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
