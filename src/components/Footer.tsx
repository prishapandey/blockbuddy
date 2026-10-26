import React from 'react';

interface FooterProps {
  onOpenSafetyModal: () => void;
  onOpenSupabaseModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSafetyModal,
  onOpenSupabaseModal,
}) => {
  return (
    <footer className="border-t border-[#22252b] bg-[#0a0a0c] mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">BlockBuddy</span>
          <span>•</span>
          <span>Campus peer exchange &amp; equipment rentals</span>
        </div>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <a
            className="hover:text-white transition-colors"
            href="#rent-gear"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('rent-gear')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Rent Equipment
          </a>
          <a
            className="hover:text-white transition-colors"
            href="#marketplace"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Marketplace
          </a>
          <button
            type="button"
            onClick={onOpenSafetyModal}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Safety Rules
          </button>
          <button
            type="button"
            onClick={onOpenSupabaseModal}
            className="hover:text-white text-[#3ecf8e] transition-colors cursor-pointer"
          >
            Supabase DB
          </button>
          <span>© 2025</span>
        </div>
      </div>
    </footer>
  );
};
