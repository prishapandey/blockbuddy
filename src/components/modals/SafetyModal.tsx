import React from 'react';
import { AlertTriangle, CheckCircle, ShieldCheck, X } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0c]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121316] border border-[#22252b] w-full max-w-md rounded-xl p-6 space-y-4 shadow-2xl my-6">
        <div className="flex items-center justify-between border-b border-[#22252b] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#4d8eff]/20 border border-[#4d8eff]/30 flex items-center justify-center text-[#4d8eff]">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-semibold text-white">Campus Safety &amp; Trade Rules</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-white transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-[#94a3b8] leading-relaxed">
          <div className="p-3 rounded-lg bg-[#0a0a0c] border border-[#22252b] space-y-1">
            <div className="text-white font-medium flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#3ecf8e]" />
              <span>Corridor &amp; Common Room Pickups</span>
            </div>
            <p className="text-[11px]">
              Meet only at familiar campus common areas: hostel mess lobbies, ground floor lounges, TV rooms, or wing corridors.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0a0a0c] border border-[#22252b] space-y-1">
            <div className="text-white font-medium flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#3ecf8e]" />
              <span>Inspect Before Direct UPI</span>
            </div>
            <p className="text-[11px]">
              Always check the appliance, calculator battery, or book edition in-person before transferring via UPI (GPay, PhonePe, Paytm).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0a0a0c] border border-[#22252b] space-y-1">
            <div className="text-white font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Rental Returns &amp; Deposit</span>
            </div>
            <p className="text-[11px]">
              Refundable deposits are returned immediately upon handing back clean and undamaged equipment to the owner’s room.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-[#4d8eff] hover:bg-[#3b7cee] text-white text-xs font-semibold py-2.5 rounded-md transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
