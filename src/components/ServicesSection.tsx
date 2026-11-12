import React, { useState } from 'react';
import {
  Truck,
  Box,
  Zap,
  Thermometer,
  ShieldAlert,
  Layers,
  Flame,
  Route,
  TrendingUp,
  FileText,
  Clock,
  Compass,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Percent,
  X,
  Sparkles,
  PhoneCall,
  ShieldCheck,
} from 'lucide-react';

interface ServicesSectionProps {
  onOpenRegister: () => void;
}

type ServiceCategory =
  | 'all'
  | 'equipment'
  | 'paperwork'
  | 'operations';

interface ServiceItem {
  id: string;
  name: string;
  category: 'equipment' | 'paperwork' | 'operations';
  feeBadge?: string;
  isPopular?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  highlights: string[];
  fullDetailsText: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenRegister }) => {
  const [activeTab, setActiveTab] = useState<ServiceCategory>('all');
  const [modalService, setModalService] = useState<ServiceItem | null>(null);

  // 13 Official Services categorized cleanly
  const allServices: ServiceItem[] = [
    // Equipment Dispatch (7)
    {
      id: 'dry-van',
      name: 'Dry Van Dispatch',
      category: 'equipment',
      feeBadge: '5% Fee',
      icon: Truck,
      description:
        'We match dry van owner-operators with high-density lanes, top-tier brokers, and consistent freight to keep your wheels turning profitability.',
      highlights: [
        '53ft & 48ft Dry Van Loads',
        'Drop & Hook Opportunities',
        'High-Rate Regional & OTR Lanes',
      ],
      fullDetailsText:
        'Our Dry Van dispatch unit scans nationwide spot markets to locate high-density consumer and industrial freight. We pre-plan return backhauls so your deadhead stays below 8%, negotiate premium detention pay, and keep you connected with trusted Fortune 500 contracted brokers.',
    },
    {
      id: 'box-truck',
      name: 'Box Truck Dispatch',
      category: 'equipment',
      feeBadge: '7% Fee',
      isPopular: true,
      icon: Box,
      description:
        'Specialized 26ft box truck load sourcing including expedite freight, local runs, liftgate loads, and dedicated multi-stop routes.',
      highlights: [
        'Expedited & Local Freight',
        '26ft Liftgate Loads',
        'High Rate-Per-Mile LTL Combinations',
      ],
      fullDetailsText:
        'Box truck operators often face challenging rate variances. Our dedicated 26ft team specializes in high-margin liftgate, dock-high, and expedited medical/electronics deliveries with rapid same-day turnaround, maximizing your gross revenue per day.',
    },
    {
      id: 'power-only',
      name: 'Power Only Dispatch',
      category: 'equipment',
      feeBadge: '5% Fee',
      icon: Zap,
      description:
        'Maximize tractor utilization with power-only freight. No trailer maintenance costs, smooth drop-and-hook setups, and quick turnarounds.',
      highlights: [
        'Zero Trailer Maintenance',
        'Drop & Hook Convenience',
        'Pre-planned Chain Loads',
      ],
      fullDetailsText:
        'Power-only dispatch eliminates the expense and risk of trailer ownership. We plug your tractor directly into major brokerage pools, pre-assigning consecutive drop-and-hook trailers for zero dwell time and continuous road miles.',
    },
    {
      id: 'reefer',
      name: 'Reefer Dispatch',
      category: 'equipment',
      feeBadge: '5% Fee',
      icon: Thermometer,
      description:
        'High-paying temperature-sensitive cargo dispatch. Food, produce, pharma, and frozen goods with expert temperature log management.',
      highlights: [
        'Premium Produce & Pharma Rates',
        'Year-Round Stable Freight',
        'High RPM Seasonal Spikes',
      ],
      fullDetailsText:
        'Reefer hauling commands the highest seasonal rates in trucking. We monitor seasonal harvest lanes, meat processing schedules, and pharmaceutical requirements while ensuring clear temp-tailored rate cons and pulp-temp guidance.',
    },
    {
      id: 'flatbed',
      name: 'Flatbed Dispatch',
      category: 'equipment',
      feeBadge: '5% Fee',
      isPopular: true,
      icon: Layers,
      description:
        'Expert dispatch for flatbeds, lumber, steel coils, building materials, and machinery. We negotiate tarp fees and oversized permits.',
      highlights: [
        'High RPM Industrial Freight',
        'Tarp & Strap Fee Negotiation',
        'Overdimensional Load Assistance',
      ],
      fullDetailsText:
        'Flatbed freight demands technical knowledge and aggressive negotiation. We ensure you get paid full market price for every tarp, strap, chain, and oversize permit, matching your trailer with industrial construction and manufacturing leaders.',
    },
    {
      id: 'step-deck',
      name: 'Step Deck Dispatch',
      category: 'equipment',
      feeBadge: '5% Fee',
      icon: ShieldAlert,
      description:
        'Specialized load matching for step-decks and drop-decks carrying oversized industrial equipment, tractors, and tall machinery.',
      highlights: [
        'Tall Load Clearance Routes',
        'Specialized Heavy Equipment',
        'High Profit Specialized Freight',
      ],
      fullDetailsText:
        'Step-deck and lowboy trailers require precise height clearances and specialized route corridors. Our dispatchers handle bridge clearance verifications, state escort coordination, and oversized rate negotiations.',
    },
    {
      id: 'hotshot',
      name: 'Hotshot Dispatch',
      category: 'equipment',
      feeBadge: '7% Fee',
      icon: Flame,
      description:
        'Fast-paced hotshot freight with non-stop load coordination. We keep your 40ft gooseneck and dually moving with high-paying LTL and partials.',
      highlights: [
        '40ft Gooseneck & Dually Freight',
        'High-Paying LTL & Partials',
        'Expedited Direct Delivery',
      ],
      fullDetailsText:
        'Hotshot freight is all about agility and rapid load stacking. We pair your 40ft gooseneck with urgent machinery parts, oilfield components, and high-RPM partials that yield class 8 equivalent revenues without semi-truck overhead.',
    },

    // Paperwork & Negotiation
    {
      id: 'dedicated-lanes',
      name: 'Dedicated Lanes',
      category: 'paperwork',
      feeBadge: 'Premium Lane',
      icon: Route,
      description:
        'Custom lane building tailored to your home-time schedule and revenue goals. Consistent contracts with vetted brokers and direct shippers.',
      highlights: [
        'Consistent Year-Round Volume',
        'Predictable Weekly Schedule',
        'Pre-negotiated Steady Rates',
      ],
      fullDetailsText:
        'Tired of daily spot market roulette? We negotiate dedicated contracted round-trips and triangular loops with credit-checked shippers and freight brokers, guaranteeing consistent revenue with scheduled home-time every single weekend.',
    },
    {
      id: 'broker-negotiation',
      name: 'Broker Negotiation',
      category: 'paperwork',
      feeBadge: 'Aggressive RPM',
      icon: TrendingUp,
      description:
        'Our seasoned dispatchers negotiate top-dollar rates on every load. We leverage market data, spot rates, and broker relationships to win you the best RPM.',
      highlights: [
        'Aggressive Rate Per Mile Bidding',
        'Spot Market Rate Intelligence',
        'Detention, Layover & TONU Pay Defense',
      ],
      fullDetailsText:
        'We never take the first rate posted on a board. Using proprietary DAT iQ, Truckstop RateMate, and lane volume indices, we counter-bid aggressively to ensure your truck gets top-tier market compensation on every single dispatch confirmation.',
    },
    {
      id: 'paperwork-management',
      name: 'Paperwork Management',
      category: 'paperwork',
      feeBadge: 'Full Service',
      icon: FileText,
      description:
        'Say goodbye to paperwork headaches. We handle all broker carrier packets, rate confirmations, insurance certificates, and invoicing so you just drive.',
      highlights: [
        'Broker Packet Setup & Compliance',
        'COI & Insurance Dispatch Filing',
        'Fast Factoring & Direct Billing',
      ],
      fullDetailsText:
        'No more pulling over to complete 15-page broker packets on your phone. Our office completes carrier agreements, orders insurance certificates with your agent, verifies W-9 compliance, and immediately forwards signed rate cons to your cab.',
    },
    {
      id: 'detention-tonu',
      name: 'Detention & TONU Assistance',
      category: 'paperwork',
      feeBadge: '100% Recovered',
      icon: Clock,
      description:
        'We fight for your rightful compensation when shippers or receivers delay you. Fast filing and broker follow-up for every billable minute.',
      highlights: [
        'Instant Detention Tracking',
        'TONU Claims Filed Immediately',
        'Lumper Fee Reimbursement Handling',
      ],
      fullDetailsText:
        'Time is money. When shippers or receivers hold your truck beyond the 2-hour free time window, we immediately file written detention notices with timestamped in/out gate receipts, ensuring $50–$85/hour compensation or full Truck Ordered Not Used (TONU) pay.',
    },

    // 24/7 Operations Support
    {
      id: 'route-planning',
      name: 'Route Planning',
      category: 'operations',
      feeBadge: 'Fuel & Time Saver',
      icon: Compass,
      description:
        'Smart route optimization avoiding bad weather, heavy tolls, and construction while maximizing fuel efficiency and minimizing deadhead miles.',
      highlights: [
        'Minimized Unpaid Deadhead Miles',
        'Fuel-Efficient Smart Navigation',
        'Toll & Scale Bypass Optimization',
      ],
      fullDetailsText:
        'Our operations room models routes to circumvent hazardous winter passes, severe weather, bridge weight limits, and expensive toll corridors. We calculate IFTA state fuel tax optimization so more profit stays in your business account.',
    },
    {
      id: '24-7-support',
      name: '24/7 Dispatch Support',
      category: 'operations',
      feeBadge: '24/7 Live Agent',
      icon: Headphones,
      description:
        'Around-the-clock live dispatch assistance. Whether you need late-night check calls, emergency assistance, or morning check-ins, we are always on duty.',
      highlights: [
        '24/7 Live Agent Phone & Chat',
        'Real-Time Broker Check Calls',
        'Emergency Roadside & Facility Escalation',
      ],
      fullDetailsText:
        'Logistics never sleeps. If you encounter a midnight gate guard issue, broken seal, facility rejection, or highway breakdown, an experienced Infinity Dispatch LLC team member answers immediately to resolve broker communication and protect your rating.',
    },
  ];

  // Filtering
  const filteredServices = allServices.filter((s) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'equipment') return s.category === 'equipment';
    if (activeTab === 'paperwork') return s.category === 'paperwork';
    if (activeTab === 'operations') return s.category === 'operations';
    return true;
  });

  return (
    <section id="services" className="py-20 bg-[#070B14] relative border-b border-blue-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* ========================================================
            PART 1: OUR PROFESSIONAL DISPATCH SERVICES (13 SERVICES)
            ======================================================== */}
        <div>
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/50 text-xs font-mono text-sky-400">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>FULL-CYCLE AMERICAN TRUCK DISPATCH</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight">
              Our Professional Dispatch Services
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Infinity Dispatch LLC provides end-to-end logistics support so you can focus on driving while we maximize your rate per mile and handle all paperwork.
            </p>
          </div>

          {/* 4 Interactive Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/40'
                  : 'bg-[#0D1527] text-slate-300 hover:text-white border border-blue-900/50 hover:border-blue-700'
              }`}
            >
              All Services (13)
            </button>

            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'equipment'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/40'
                  : 'bg-[#0D1527] text-slate-300 hover:text-white border border-blue-900/50 hover:border-blue-700'
              }`}
            >
              Equipment Dispatch (7)
            </button>

            <button
              onClick={() => setActiveTab('paperwork')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'paperwork'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/40'
                  : 'bg-[#0D1527] text-slate-300 hover:text-white border border-blue-900/50 hover:border-blue-700'
              }`}
            >
              Paperwork & Negotiation
            </button>

            <button
              onClick={() => setActiveTab('operations')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'operations'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/40'
                  : 'bg-[#0D1527] text-slate-300 hover:text-white border border-blue-900/50 hover:border-blue-700'
              }`}
            >
              24/7 Operations Support
            </button>
          </div>

          {/* Services Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.id}
                  className="rounded-2xl bg-[#0C1425] border border-blue-900/40 hover:border-sky-500/60 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-blue-950/50 group"
                >
                  <div>
                    {/* Header badge & icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-950/90 border border-blue-700/50 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>

                      {service.feeBadge && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-600/20 text-sky-300 border border-blue-500/40">
                          {service.feeBadge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                      {service.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* Bullet Highlights */}
                    <ul className="space-y-2 border-t border-blue-900/30 pt-3.5 mb-5">
                      {service.highlights.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-blue-900/20 flex items-center gap-2">
                    <button
                      onClick={() => setModalService(service)}
                      className="flex-1 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-blue-900/40 rounded-lg transition-colors cursor-pointer text-center"
                    >
                      View Full Details
                    </button>

                    <button
                      onClick={onOpenRegister}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                      title="Sign up for this service"
                    >
                      <span>Sign Up</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Link to Elevated Equipment Rates Section */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-[#0C152B] via-[#101F42] to-[#0C152B] border border-blue-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest block">
              TRANSPARENT 5% - 7% DISPATCH COMMISSION
            </span>
            <h4 className="text-lg font-bold text-white">
              Looking for our detailed equipment commission breakdown and net profit calculator?
            </h4>
            <p className="text-xs text-slate-300">
              5% for Dry Van, Reefer, Flatbed, Step Deck, Power Only · 7% for Box Truck & Hotshot.
            </p>
          </div>
          <a
            href="#equipment-rates"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold whitespace-nowrap shadow-md cursor-pointer transition-colors"
          >
            View Equipment Rates (5%-7%)
          </a>
        </div>

      </div>

      {/* ========================================================
          SERVICE DETAILS MODAL (VIEW FULL DETAILS POPUP)
          ======================================================== */}
      {modalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B1325] border border-blue-500/50 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setModalService(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <modalService.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{modalService.name}</h3>
                {modalService.feeBadge && (
                  <span className="text-xs font-mono font-bold text-sky-400">
                    {modalService.feeBadge} · Infinity Dispatch LLC
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p className="font-medium text-white">{modalService.description}</p>
              <p className="text-slate-300 bg-[#060D1A] p-4 rounded-xl border border-blue-900/40">
                {modalService.fullDetailsText}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold font-mono text-sky-400 uppercase tracking-wider">
                Key Deliverables
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
                {modalService.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  setModalService(null);
                  onOpenRegister();
                }}
                className="flex-1 py-3 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/30 text-center cursor-pointer"
              >
                Get Started With {modalService.name}
              </button>

              <button
                onClick={() => setModalService(null)}
                className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
