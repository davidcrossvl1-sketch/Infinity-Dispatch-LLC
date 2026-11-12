import React from 'react';
import {
  Clock,
  TrendingUp,
  ShieldCheck,
  UserCheck,
  PhoneCall,
  Globe,
  Award,
  DollarSign,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface WhyChooseUsProps {
  onOpenRegister: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenRegister }) => {
  const guarantees = [
    {
      icon: Clock,
      title: '24/7 Dispatch Support',
      desc: 'Our dispatch team never sleeps. Get instant help with brokers, shippers, directions, or emergencies any hour of the day.',
    },
    {
      icon: TrendingUp,
      title: 'Best Rate Negotiation',
      desc: 'We know current market DAT & Truckstop averages. We aggressively negotiate top rates so you never settle for less.',
    },
    {
      icon: ShieldCheck,
      title: 'No Forced Dispatch',
      desc: 'You are the boss of your truck. You have 100% final approval on every load, lane, price, and destination.',
    },
    {
      icon: UserCheck,
      title: 'Dedicated Dispatcher',
      desc: 'Work with a personal dispatcher who knows your preferences, home time schedule, equipment specs, and financial goals.',
    },
    {
      icon: PhoneCall,
      title: 'Fast Broker Communication',
      desc: 'We keep brokers updated continuously so you can focus on driving safely without endless phone interruptions.',
    },
    {
      icon: Globe,
      title: 'Nationwide Coverage',
      desc: 'Access freight in all 50 states across regional, short-haul, and coast-to-coast long-haul transportation corridors.',
    },
    {
      icon: Award,
      title: 'Experienced Team',
      desc: 'Led by industry veterans who understand logistics inside out, keeping your truck profitably loaded week after week.',
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      desc: 'Flat percentage fee per load based on equipment type. No hidden charges, setup fees, or long-term lock-in contracts.',
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-[#070B14] border-t border-b border-blue-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/50 text-xs font-mono text-sky-400">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>BUILT FOR OWNER OPERATORS & SMALL FLEETS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight">
            Why Choose Infinity Dispatch
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            We operate as your dedicated in-house logistics department — negotiating higher rates per mile, keeping your truck loaded, and protecting your bottom line.
          </p>
        </div>

        {/* 8 Guarantees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-[#091124] border border-blue-900/40 hover:border-sky-500/60 transition-all flex flex-col justify-between group shadow-lg hover:shadow-xl hover:shadow-blue-950/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-950/90 border border-blue-700/50 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-sky-300 border border-blue-800">
                      Infinity Guarantee
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ready to roll CTA strip */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0C152B] via-[#101F42] to-[#0C152B] border border-blue-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-white">
              Ready to partner with a dispatch team that puts you first?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Submit your carrier packet and get assigned to your dedicated dispatcher today.
            </p>
          </div>

          <button
            onClick={onOpenRegister}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap"
          >
            <span>Start Carrier Registration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
