import React from 'react';
import { ArrowDown, ArrowRight, CheckCircle2, Clock3, Database, Search, ShoppingBag, Users } from 'lucide-react';

const journey = [
  { icon: Users, title: 'Student opens BlockBuddy', detail: 'Choose a hostel profile and explore the campus community.' },
  { icon: Search, title: 'Find or list an item', detail: 'Search by keyword, category, hostel, or browse rentals and urgent needs.' },
  { icon: ShoppingBag, title: 'Contact the student', detail: 'Message the seller or send a rental request and agree on pickup.' },
  { icon: Database, title: 'Save and refresh', detail: 'Listings are stored in Supabase; the browser cache is only a convenience.' },
  { icon: CheckCircle2, title: 'Meet on campus', detail: 'Complete the handoff, then update the item status as needed.' },
];

const milestones = [
  { step: '01', time: 'Plan', title: 'Define the problem', detail: 'Make it easier for hostel students to buy, sell, rent, and exchange essentials.' },
  { step: '02', time: 'Design', title: 'Build the experience', detail: 'Create the marketplace, filters, listing form, student profile, and chat/rental flows.' },
  { step: '03', time: 'Develop', title: 'Connect the data layer', detail: 'Use Supabase for shared listings and keep local storage as a fallback cache.' },
  { step: '04', time: 'Test', title: 'Verify the complete journey', detail: 'Publish a listing, reload, clear browser cache, and confirm the database listing returns.' },
  { step: '05', time: 'Launch', title: 'Deploy and improve', detail: 'Deploy on Vercel, collect student feedback, and iterate on safety and usability.' },
];

export const ProjectFlowSection: React.FC = () => (
  <section id="project-flow" className="space-y-7 border-t border-[#22252b] pt-10">
    <div className="max-w-2xl">
      <span className="text-xs font-semibold text-[#4d8eff] tracking-wide uppercase">How it works</span>
      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">BlockBuddy project flow</h2>
      <p className="text-sm text-[#94a3b8] mt-2">From discovering an item to a safe hostel handoff — and the development path behind the project.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {journey.map((step, index) => {
        const Icon = step.icon;
        return (
          <React.Fragment key={step.title}>
            <div className="rounded-xl border border-[#22252b] bg-[#121316] p-4 min-h-[150px]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-wider text-[#64748b]">Step {index + 1}</span>
                <Icon className="w-4 h-4 text-[#4d8eff]" />
              </div>
              <h3 className="text-sm font-semibold text-white">{step.title}</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed mt-2">{step.detail}</p>
            </div>
            {index < journey.length - 1 && (
              <div className="md:hidden flex justify-center -my-1 text-[#4d8eff]"><ArrowDown className="w-4 h-4" /></div>
            )}
          </React.Fragment>
        );
      })}
    </div>

    <div className="flex items-center gap-2 text-xs font-semibold text-white">
      <Clock3 className="w-4 h-4 text-[#4d8eff]" />
      <span>Project development timeline</span>
      <span className="text-[#64748b] font-normal">— phases, not calendar dates</span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {milestones.map((milestone, index) => (
        <div key={milestone.step} className="relative rounded-xl border border-[#22252b] bg-[#0f1013] p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-full bg-[#4d8eff]/15 text-[#4d8eff] flex items-center justify-center text-[10px] font-bold">{milestone.step}</span>
            <span className="text-[10px] uppercase tracking-wider text-[#64748b]">{milestone.time}</span>
            {index < milestones.length - 1 && <ArrowRight className="hidden lg:block w-3 h-3 text-[#353945] ml-auto" />}
          </div>
          <h3 className="text-sm font-semibold text-white">{milestone.title}</h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed mt-2">{milestone.detail}</p>
        </div>
      ))}
    </div>
  </section>
);
