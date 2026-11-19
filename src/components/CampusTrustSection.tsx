import React from 'react';
import { CreditCard, ShieldCheck, Users } from 'lucide-react';

export const CampusTrustSection: React.FC = () => {
  return (
    <section className="bg-[#121316] border border-[#22252b] rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <div className="text-white font-semibold text-sm flex items-center gap-2">
            <ShieldCheck className="w-[18px] h-[18px] text-[#4d8eff] shrink-0" />
            <span>Campus Verified</span>
          </div>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Every user is authenticated via university email. Trade strictly with students from your college.
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-white font-semibold text-sm flex items-center gap-2">
            <Users className="w-[18px] h-[18px] text-[#4d8eff] shrink-0" />
            <span>Corridor Handoffs</span>
          </div>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Meet at hostel mess lobbies, TV rooms, or wing corridors. Inspect the item or rental before paying.
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-white font-semibold text-sm flex items-center gap-2">
            <CreditCard className="w-[18px] h-[18px] text-[#4d8eff] shrink-0" />
            <span>0% Commission Fee</span>
          </div>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Direct peer-to-peer UPI transfer. BlockBuddy never takes a cut from campus students.
          </p>
        </div>
      </div>
    </section>
  );
};
