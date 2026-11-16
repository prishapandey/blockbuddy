import React from 'react';
import { AlertTriangle, CheckCircle, ShieldCheck, X } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="safety-modal-title">
      <div className="modal-container max-w-md">
        <header className="flex items-center justify-between border-b border-faint p-5 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-accent-wash/50 border border-accent/20 flex items-center justify-center text-accent">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 id="safety-modal-title" className="text-body text-ink">Campus Safety & Trade Rules</h3>
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

        <div className="p-5 space-y-3 text-caption text-muted leading-relaxed">
          <article className="card-elevated p-3 space-y-1">
            <div className="text-ink font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
              <span>Corridor & Common Room Pickups</span>
            </div>
            <p className="text-[10px]">
              Meet only at familiar campus common areas: hostel mess lobbies, ground floor lounges, TV rooms, or wing corridors.
            </p>
          </article>

          <article className="card-elevated p-3 space-y-1">
            <div className="text-ink font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
              <span>Inspect Before Direct UPI</span>
            </div>
            <p className="text-[10px]">
              Always check the appliance, calculator battery, or book edition in-person before transferring via UPI (GPay, PhonePe, Paytm).
            </p>
          </article>

          <article className="card-elevated p-3 space-y-1">
            <div className="text-ink font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-ink flex-shrink-0" aria-hidden="true" />
              <span>Rental Returns & Deposit</span>
            </div>
            <p className="text-[10px]">
              Refundable deposits are returned immediately upon handing back clean and undamaged equipment to the owner's room.
            </p>
          </article>
        </div>

        <div className="p-5 pt-2 border-t border-faint">
          <button
            type="button"
            onClick={onClose}
            className="w-full btn-pill btn-pill-primary justify-center py-3"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};