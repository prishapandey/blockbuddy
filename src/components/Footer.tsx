import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onOpenSafetyModal: () => void;
  onOpenSupabaseModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSafetyModal,
  onOpenSupabaseModal,
}) => {
  return (
    <footer className="border-t border-[#434630] bg-[#242519] mt-20 text-[#CDCBD6]">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9fa293]">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">BlockBuddy</span>
          <span>•</span>
          <span>Campus Peer Exchange &amp; Smart Escrow</span>
        </div>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link to="/rentals" className="hover:text-white transition-colors">
            Rentals Zone
          </Link>
          <Link to="/need-it-now" className="hover:text-white transition-colors">
            Corridor Express
          </Link>
          <Link to="/marketplace" className="hover:text-white transition-colors">
            Marketplace
          </Link>
          <Link to="/blockchain" className="hover:text-white transition-colors">
            On-Chain Trust
          </Link>
          <button
            type="button"
            onClick={onOpenSafetyModal}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Safety Guidelines
          </button>
          <button
            type="button"
            onClick={onOpenSupabaseModal}
            className="text-[#D96846] hover:underline transition-colors cursor-pointer"
          >
            Database Status
          </button>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
};
