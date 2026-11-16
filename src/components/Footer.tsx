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
    <footer className="footer-dark" role="contentinfo">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="wordmark justify-start mb-4">
              <span className="wordmark-dot" aria-hidden="true" />
              <span className="text-white">BlockBuddy<span className="text-accent-wash">.</span></span>
            </div>
            <p className="text-white/60 text-body-sm leading-relaxed max-w-xs">
              Campus peer exchange & equipment rentals for IITB students. Zero fees, direct handoffs, verified community.
            </p>
          </div>

          <nav aria-label="Product">
            <h3 className="text-white text-body-sm font-medium mb-4">Product</h3>
            <ul className="space-y-3 text-white/60 text-body-sm">
              <li>
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
              </li>
              <li>
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
              </li>
              <li>
                <a
                  className="hover:text-white transition-colors"
                  href="#need-it-now"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('need-it-now')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Need It Now
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Support">
            <h3 className="text-white text-body-sm font-medium mb-4">Support</h3>
            <ul className="space-y-3 text-white/60 text-body-sm">
              <li>
                <button
                  type="button"
                  onClick={onOpenSafetyModal}
                  className="hover:text-white transition-colors text-left"
                >
                  Safety Rules
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSupabaseModal}
                  className="hover:text-white transition-colors text-left"
                >
                  Supabase DB
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-caption">
          <p>© 2025 BlockBuddy. Built for IITB campus community.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors" aria-label="Privacy Policy">Privacy</a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Terms of Service">Terms</a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Contact">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};