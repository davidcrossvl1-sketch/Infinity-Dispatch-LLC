import React from 'react';
import {
  Send,
  Phone,
  Mail,
  Shield,
  CheckCircle2,
  Award,
  Globe,
  ExternalLink,
} from 'lucide-react';

interface ExecutiveLeadershipSectionProps {
  onOpenRegister: () => void;
}

export const ExecutiveLeadershipSection: React.FC<ExecutiveLeadershipSectionProps> = ({
  onOpenRegister,
}) => {
  return (
    <section className="py-20 bg-[#070B16] border-t border-b border-blue-950/70 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Official David Cross Business Development Executive Banner */}
        <div className="rounded-3xl overflow-hidden border border-sky-500/40 shadow-2xl bg-gradient-to-r from-sky-900/60 to-blue-950/80 p-2 sm:p-3">
          <img
            src="/assets/aistudio/Screenshot_2026-11-04_123601_65aa921f.png"
            alt="David Cross - Business Development Executive | IDL Infinity Dispatch LLC"
            className="w-full h-auto object-cover rounded-2xl shadow-lg"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/40 text-xs font-mono text-sky-400 mb-3">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>EXECUTIVE LEADERSHIP & DISPATCH DESK</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Direct Leadership Backing Every Mile
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Work directly with owners who know freight rates, broker relationships, and truck dispatching inside and out.
          </p>
        </div>

        {/* Both Owners Feature Grid with Royal Gold & Silver Medallions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* 1. David Cross Leadership Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1326] border border-blue-500/30 flex flex-col justify-between shadow-2xl hover:border-sky-500/60 transition-all group">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-blue-900/40">
                {/* Official David Cross Royal Gold & Silver Crown Emblem */}
                <div className="relative shrink-0">
                  <img
                    src="/assets/aistudio/Screenshot_2026-11-04_095031_b047180c.png"
                    alt="David Cross Official Royal Gold Emblem"
                    className="w-28 h-28 sm:w-32 sm:h-32 object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.35)] group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                    Owner & Business Development Executive
                  </span>
                  <h3 className="text-2xl font-display font-extrabold text-white">David Cross</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Head of Broker Rate Negotiations, Freight Lane Expansion & Carrier Partnerships.
                  </p>
                </div>
              </div>

              {/* Direct Channels */}
              <div className="space-y-2.5 text-xs font-mono">
                <a
                  href="tel:+14095096940"
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-sky-400" />
                    <span>Direct Call / SMS:</span>
                  </span>
                  <span className="font-bold text-sky-400">+1 (409) 509-6940</span>
                </a>

                <a
                  href="mailto:Davidcross.vl1@gmail.com"
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-sky-400" />
                    <span>Executive Email:</span>
                  </span>
                  <span className="text-white truncate max-w-[200px]">Davidcross.vl1@gmail.com</span>
                </a>

                <a
                  href="https://t.me/DavidCross4899"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-blue-950/60 hover:bg-blue-900/70 border border-blue-700/50 flex items-center justify-between text-sky-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-sky-400" />
                    <span>Telegram Direct Channel:</span>
                  </span>
                  <span className="font-bold">@DavidCross4899</span>
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-blue-900/30">
              <button
                onClick={onOpenRegister}
                className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request Dispatching with David Cross</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Alvin Leadership Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1326] border border-blue-500/30 flex flex-col justify-between shadow-2xl hover:border-sky-500/60 transition-all group">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-blue-900/40">
                {/* Official Alvin Royal Gold & Silver Crown Emblem */}
                <div className="relative shrink-0">
                  <img
                    src="/assets/aistudio/Alvin_Royal_Gold_Emblem_1d364b11.png"
                    alt="Alvin Official Royal Gold Emblem"
                    className="w-28 h-28 sm:w-32 sm:h-32 object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.35)] group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                    Owner & Operations Director
                  </span>
                  <h3 className="text-2xl font-display font-extrabold text-white">Alvin</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Lead of Fleet Operations, Carrier Compliance, Dispatch Workflow & Quality Assurance.
                  </p>
                </div>
              </div>

              {/* Direct Channels */}
              <div className="space-y-2.5 text-xs font-mono">
                <a
                  href="mailto:alvin.vast@gmail.com"
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-sky-400" />
                    <span>Direct Email:</span>
                  </span>
                  <span className="text-white">alvin.vast@gmail.com</span>
                </a>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-slate-200">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Authority & Admin:</span>
                  </span>
                  <span className="font-bold text-emerald-400">SUPER ADMIN</span>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-700/50 flex items-center justify-between text-sky-300">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <span>Dispatch Support:</span>
                  </span>
                  <span className="font-bold text-white">24/7 Nationwide</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-blue-900/30">
              <button
                onClick={onOpenRegister}
                className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request Dispatching with Alvin</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Operations Center & Elimination of Load Board Frustration */}
        <div className="rounded-3xl bg-[#091022] border border-blue-500/30 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Mission & Operational Guarantees */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono font-bold text-red-400 tracking-wider uppercase">
                RELIABLE DISPATCH. INFINITE SERVICE.
              </span>
              <h3 className="text-xl sm:text-3xl font-display font-extrabold text-white">
                At Infinity Dispatch LLC, we eliminate load board frustration so you can focus strictly on driving and earning.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Founded to give owner-operators and small fleets big-carrier leverage, we negotiate high-rate freight for Dry Van, Power Only, Flatbed, Step Deck, Hotshot, Reefer, and 26ft Box Truck equipment setups.
              </p>
              <div className="space-y-2.5 pt-2 text-xs text-slate-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span><strong>Aggressive Broker Rate Negotiation</strong> (Targeting Maximum RPM on Every Run)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span><strong>Full Invoicing, BOL & Factoring Paperwork Handling</strong> (Get Paid Faster)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span><strong>Transparent Low Commission Fees</strong> (Standard 5% to 7% with zero hidden charges)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Commercial Semi Truck Illustration Asset */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#050914] border border-blue-900/50 text-center">
              <img
                src="/assets/aistudio/LOGO_truck_8e4365b5.png"
                alt="Infinity Dispatch Commercial Semi Truck"
                className="w-48 sm:w-60 h-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] invert brightness-125"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs font-mono font-bold text-sky-400 mt-3 block">
                IDL · INFINITY DISPATCH LLC
              </span>
              <span className="text-[11px] text-slate-400 block font-mono">
                All Trailer Types Handled
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
