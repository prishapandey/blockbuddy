import React from 'react';
import { CreditCard, ShieldCheck, Users } from 'lucide-react';

export const CampusTrustSection: React.FC = () => {
  return (
    <section className="section" aria-labelledby="trust-title">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="section-subtitle">Why BlockBuddy</span>
        <h2 id="trust-title" className="section-title">Campus Trust & Safety</h2>
        <p className="section-desc">Built for IITB students, by IITB students. Every trade is peer-to-peer, verified, and fee-free.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="trust-card">
          <ShieldCheck className="trust-icon" aria-hidden="true" />
          <h3 className="trust-title">Campus Verified</h3>
          <p className="trust-desc">Every user is authenticated via university email. Trade strictly with students from your college.</p>
        </article>

        <article className="trust-card">
          <Users className="trust-icon" aria-hidden="true" />
          <h3 className="trust-title">Corridor Handoffs</h3>
          <p className="trust-desc">Meet at hostel mess lobbies, TV rooms, or wing corridors. Inspect the item or rental before paying.</p>
        </article>

        <article className="trust-card">
          <CreditCard className="trust-icon" aria-hidden="true" />
          <h3 className="trust-title">0% Commission Fee</h3>
          <p className="trust-desc">Direct peer-to-peer UPI transfer. BlockBuddy never takes a cut from campus students.</p>
        </article>
      </div>
    </section>
  );
};