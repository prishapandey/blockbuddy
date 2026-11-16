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
  <section id="project-flow" className="section border-t border-faint pt-0" aria-labelledby="project-flow-title">
    <div className="max-w-2xl mx-auto text-center mb-12">
      <span className="section-subtitle">How it works</span>
      <h2 id="project-flow-title" className="section-title">BlockBuddy project flow</h2>
      <p className="section-desc">From discovering an item to a safe hostel handoff — and the development path behind the project.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-16">
      {journey.map((step, index) => {
        const Icon = step.icon;
        return (
          <React.Fragment key={step.title}>
            <article className="flow-card">
              <div className="flex items-center justify-between mb-4">
                <span className="flow-step">Step {index + 1}</span>
                <Icon className="flow-icon" aria-hidden="true" />
              </div>
              <h3 className="flow-title">{step.title}</h3>
              <p className="flow-desc">{step.detail}</p>
            </article>
            {index < journey.length - 1 && (
              <div className="md:hidden flex justify-center my-2 text-accent"><ArrowDown className="w-4 h-4" /></div>
            )}
          </React.Fragment>
        );
      })}
    </div>

    <div className="flex items-center gap-2 text-caption text-ink justify-center mb-8">
      <Clock3 className="w-4 h-4 text-accent" aria-hidden="true" />
      <span>Project development timeline</span>
      <span className="text-muted">— phases, not calendar dates</span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {milestones.map((milestone, index) => (
        <article key={milestone.step} className="milestone-card relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="milestone-step">{milestone.step}</span>
            <span className="milestone-time">{milestone.time}</span>
            {index < milestones.length - 1 && <ArrowRight className="hidden lg:block w-3 h-3 text-cool-stone ml-auto" aria-hidden="true" />}
          </div>
          <h3 className="milestone-title">{milestone.title}</h3>
          <p className="milestone-desc">{milestone.detail}</p>
        </article>
      ))}
    </div>
  </section>
);