import React from 'react';
import { ClipboardList, MessageSquare, Search, Truck, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenRegister: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onOpenRegister }) => {
  const steps = [
    {
      number: '01',
      icon: ClipboardList,
      title: 'Submit Your Truck Information',
      description:
        'Complete our fast online carrier registration with your MC/DOT number, trailer specifications, current location, and insurance certificates.',
    },
    {
      number: '02',
      icon: MessageSquare,
      title: 'Discuss Your Preferences',
      description:
        'Connect directly with David Cross, Alvin, or an assigned dispatcher to establish your target rate per mile, preferred lanes, max deadhead, and home-time goals.',
    },
    {
      number: '03',
      icon: Search,
      title: 'We Search & Coordinate Loads',
      description:
        'We aggressively hunt for high-rate freight, conduct broker credit reviews, negotiate rates, submit carrier packets, and send you rate cons for approval.',
    },
    {
      number: '04',
      icon: Truck,
      title: 'Keep Your Truck Moving',
      description:
        'Drive safely knowing your check calls, detention claims, and next backhaul loads are already planned ahead of time. You get paid directly by brokers.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#070B14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 mb-3">
            <span className="w-5 h-px bg-sky-400" />
            <span>Streamlined 4-Step Onboarding</span>
            <span className="w-5 h-px bg-sky-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
            How Working With Infinity Dispatch LLC Works
          </h2>
          <p className="mt-3 text-base text-slate-300">
            A simple, transparent process designed to get your rig booked with profitable freight immediately.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative p-6 rounded-2xl bg-[#0D1527] border border-blue-900/40 hover:border-blue-500/50 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/40 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2.5 group-hover:text-sky-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-blue-900/20 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>Step {index + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#0B1222] border border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-white">Have questions before onboarding?</h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Call David Cross directly at <a href="tel:+14095096940" className="text-sky-400 underline font-mono">+1 (409) 509-6940</a> or message us on Telegram.
            </p>
          </div>
          <button
            onClick={onOpenRegister}
            className="px-6 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-all whitespace-nowrap inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start Step 1 Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
