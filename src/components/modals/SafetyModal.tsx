import React from 'react';
import { AlertTriangle, CheckCircle, ShieldCheck, X } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#242519]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto text-[#CDCBD6]">
      <div className="bg-[#26271a] border border-[#434630] w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl my-6">
        <div className="flex items-center justify-between border-b border-[#434630] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#596235]/30 border border-[#596235]/50 flex items-center justify-center text-[#D96846]">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-semibold text-white">Campus Safety &amp; Trade Rules</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9fa293] hover:text-white transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-[#CDCBD6]/80 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-[#1e1f14] border border-[#434630] space-y-1">
            <div className="text-white font-medium flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#596235]" />
              <span>Corridor &amp; Common Room Pickups</span>
            </div>
            <p className="text-[11px] text-[#9fa293]">
              Meet only at familiar campus common areas: hostel mess lobbies, ground floor lounges, TV rooms, or wing corridors.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1e1f14] border border-[#434630] space-y-1">
            <div className="text-white font-medium flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#596235]" />
              <span>Inspect Before Direct UPI</span>
            </div>
            <p className="text-[11px] text-[#9fa293]">
              Always check the appliance, calculator battery, or book edition in-person before transferring via UPI (GPay, PhonePe, Paytm).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1e1f14] border border-[#434630] space-y-1">
            <div className="text-white font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#D96846]" />
              <span>Rental Returns &amp; Deposit</span>
            </div>
            <p className="text-[11px] text-[#9fa293]">
              Refundable deposits are returned immediately upon handing back clean and undamaged equipment to the owner’s room.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-[#D96846] hover:bg-[#c45735] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors cursor-pointer shadow"
        >
          I Understand Campus Rules
        </button>
      </div>
    </div>
  );
};
