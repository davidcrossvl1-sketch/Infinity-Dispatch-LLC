import React from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Crown,
  Truck,
  ArrowRight,
  Phone,
  Sparkles,
} from 'lucide-react';

interface PricingPlansSectionProps {
  onOpenRegister: () => void;
}

export const PricingPlansSection: React.FC<PricingPlansSectionProps> = ({
  onOpenRegister,
}) => {
  return (
    <section id="pricing" className="py-20 bg-[#070B14] border-t border-b border-blue-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/50 text-xs font-mono text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>TRANSPARENT DISPATCH COMMISSION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight">
            Fair Commission. Zero Hidden Fees.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Choose the dispatch plan that fits your business. No setup charges, no long-term locks, and 100% money paid directly to you.
          </p>
        </div>

        {/* 3 Pricing Tier Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Starter Dispatch */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[#091124] border border-blue-900/50 hover:border-blue-600 transition-all flex flex-col justify-between shadow-xl">
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 mb-4 border border-slate-700">
                Starter Plan
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Starter Dispatch</h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                Ideal for single owner-operators looking for reliable load sourcing & negotiation.
              </p>

              {/* Price */}
              <div className="p-4 rounded-2xl bg-black/60 border border-blue-900/40 mb-6 space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-display font-black text-sky-400 font-mono">5%</span>
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                    Fee per load
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono block">
                  Dry Van · Power Only · Flatbed · Step Deck
                </span>
              </div>

              {/* Bullets */}
              <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>100% No Forced Dispatch</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>High RPM Load Search & Negotiation</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Rate Confirmation & Setup Packets</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Broker Credit Checks</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Standard Business Hours Support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenRegister}
              className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 border border-blue-700/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Professional Full-Service Dispatch (Most Popular) */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0F1D3D] via-[#0A142A] to-[#0A142A] border-2 border-sky-400 shadow-2xl shadow-blue-950/80 transition-all flex flex-col justify-between relative">
            
            {/* Pill Banner */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-sky-400 text-slate-950 shadow-lg flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <span>Most Popular · Dedicated Dispatcher</span>
              </span>
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-950 text-sky-300 mb-4 border border-blue-700/60 mt-1">
                Professional
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Full-Service Dispatch</h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                Complete logistics department for owner-operators & specialized trailers.
              </p>

              {/* Price */}
              <div className="p-4 rounded-2xl bg-black/70 border border-sky-500/50 mb-6 space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-display font-black text-sky-300 font-mono">
                    5% - 7%
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                    Fee per load
                  </span>
                </div>
                <span className="text-[11px] text-slate-300 font-mono block">
                  Box Truck/Hotshot (7%) & Dry Van/Reefer/Flatbed (5%)
                </span>
              </div>

              {/* Bullets */}
              <div className="space-y-3 mb-8 text-xs sm:text-sm text-slate-100">
                <div className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider pb-1">
                  Everything in Starter +
                </div>
                <li className="flex items-start gap-2.5 list-none">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Dedicated Personal Senior Dispatcher</strong></span>
                </li>
                <li className="flex items-start gap-2.5 list-none">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>24/7 Round-the-Clock Dispatch Support</strong></span>
                </li>
                <li className="flex items-start gap-2.5 list-none">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Detention, Layover & TONU Assistance</span>
                </li>
                <li className="flex items-start gap-2.5 list-none">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Invoicing & Factoring Submission</span>
                </li>
                <li className="flex items-start gap-2.5 list-none">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dedicated Lane & Weekly Route Planning</span>
                </li>
              </div>
            </div>

            <button
              onClick={onOpenRegister}
              className="w-full py-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-sky-600 to-blue-500 hover:from-blue-500 hover:to-sky-400 shadow-xl shadow-blue-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign Up Professional</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Fleet & Enterprise */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[#091124] border border-blue-900/50 hover:border-blue-600 transition-all flex flex-col justify-between shadow-xl">
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 mb-4 border border-slate-700">
                Fleet & Enterprise
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Fleet Dispatch</h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                Custom volume rates for small fleets (3+ trucks) & fleet managers.
              </p>

              {/* Price */}
              <div className="p-4 rounded-2xl bg-black/60 border border-blue-900/40 mb-6 space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-display font-black text-amber-400 font-mono">
                    Custom Quote
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono block">
                  Discounted volume percentage rates available
                </span>
              </div>

              {/* Bullets */}
              <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Dedicated Fleet Account Manager</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Multi-Truck Dispatch Synchronization</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Weekly Fleet Gross Revenue Reporting</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Custom Invoicing & Payroll Summaries</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Direct Shipper Contract Integration</span>
                </li>
              </ul>
            </div>

            <a
              href="tel:+14095096940"
              className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow text-center"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Contact for Fleet Quote</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
