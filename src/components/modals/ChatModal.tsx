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
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="chat-modal-title">
      <div className="modal-container max-w-sm">
        <header className="flex items-center justify-between border-b border-faint p-4 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" aria-hidden="true" />
            <h3 id="chat-modal-title" className="text-body text-ink">
              {item.category === 'urgent' ? 'Immediate Corridor Ping' : 'Seller Inquiry'}
            </h3>
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

        {/* Item Info Box */}
        <div className="card-elevated m-4 p-3 space-y-1 text-caption">
          <div className="flex items-center justify-between">
            <span className="text-ink truncate max-w-[200px]">{item.title}</span>
            <span className="text-ink font-medium">{item.priceDisplay}</span>
          </div>
          <div className="text-muted flex items-center justify-between">
            <span>{item.locationTag}</span>
            <span className="text-[10px]">{item.sellerName}</span>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 space-y-2">
          <span className="text-[10px] text-muted block">Quick message shortcuts:</span>
          <div className="flex flex-wrap gap-1.5">
            {quickChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setMessage(chip)}
                className="text-[10px] bg-canvas hover:bg-faint text-muted hover:text-ink px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-caption text-muted block">Direct Campus Ping</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value))
              rows={3}
              className="w-full bg-surface border border-faint rounded-inner text-body text-ink placeholder-muted px-4 py-3 focus:outline-none focus:border-accent resize-none font-gt-standard"
            />
          </div>

          <div className="text-[10px] text-muted flex items-center justify-between">
            <span>From: {currentStudent.name} ({currentStudent.hostel})</span>
            <span className="text-accent font-medium">Verified Student</span>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 btn-pill btn-pill-primary justify-center py-2.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Ping</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-pill btn-pill-secondary py-2.5 px-5"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};