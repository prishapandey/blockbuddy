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
    <div className="fixed inset-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121316] border border-[#22252b] w-full max-w-sm rounded-lg p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#22252b] pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#4d8eff]" />
            <h3 className="text-sm font-semibold text-white">
              {item.category === 'urgent' ? 'Immediate Corridor Ping' : 'Seller Inquiry'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-white transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item Info Box */}
        <div className="bg-[#0a0a0c] border border-[#22252b] rounded p-3 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium truncate max-w-[200px]">{item.title}</span>
            <span className="text-white font-bold">{item.priceDisplay}</span>
          </div>
          <div className="text-[#94a3b8] flex items-center justify-between">
            <span>{item.locationTag}</span>
            <span className="text-[#64748b] text-[11px]">{item.sellerName}</span>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1">
          <span className="text-[11px] text-[#64748b]">Quick message shortcuts:</span>
          <div className="flex flex-wrap gap-1.5">
            {quickChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setMessage(chip)}
                className="text-[11px] bg-[#1a1c22] hover:bg-[#252830] text-[#94a3b8] hover:text-white px-2 py-1 rounded border border-[#22252b] transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs text-[#94a3b8] block">Direct Campus Ping:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full bg-[#0a0a0c] border border-[#22252b] rounded text-xs text-white p-2.5 focus:outline-none focus:border-[#4d8eff]"
            />
          </div>

          <div className="text-[11px] text-[#64748b] flex items-center justify-between">
            <span>From: {currentStudent.name} ({currentStudent.hostel})</span>
            <span className="text-[#3ecf8e]">Verified Student</span>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-[#4d8eff] hover:bg-[#3b7cee] text-white text-xs font-semibold py-2 rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Ping</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#1a1c22] hover:bg-[#252830] text-[#94a3b8] text-xs font-medium px-4 py-2 rounded transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
