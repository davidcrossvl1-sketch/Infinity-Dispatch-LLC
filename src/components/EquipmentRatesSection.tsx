import React, { useState } from 'react';
import {
  Truck,
  Box,
  Zap,
  Thermometer,
  ShieldAlert,
  Layers,
  Flame,
  CheckCircle2,
  Calculator,
  Percent,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface EquipmentRatesSectionProps {
  onOpenRegister: () => void;
}

export interface EquipmentRateCard {
  id: string;
  name: string;
  feePercent: number;
  isPopular?: boolean;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  bullets: string[];
}

export const EquipmentRatesSection: React.FC<EquipmentRatesSectionProps> = ({
  onOpenRegister,
}) => {
  const [selectedForCalc, setSelectedForCalc] = useState<string | null>(null);

  // Exact 7 Equipment Commission Rate Cards from user specification
  const equipmentRates: EquipmentRateCard[] = [
    {
      id: 'dry-van-rate',
      name: 'Dry Van',
      feePercent: 5,
      isPopular: true,
      badge: 'Popular',
      icon: Truck,
      bullets: [
        '53ft & 48ft Dry Van Loads',
        'Spot Market & Contract Freight',
        '24/7 Dedicated Dispatcher',
        'Full Paperwork & Invoicing',
      ],
    },
    {
      id: 'power-only-rate',
      name: 'Power Only',
      feePercent: 5,
      badge: 'Drop & Hook',
      icon: Zap,
      bullets: [
        'Drop & Hook Freight',
        'Zero Trailer Maintenance',
        'High Mileage Chains',
        'Dedicated Lane Matching',
      ],
    },
    {
      id: 'flatbed-rate',
      name: 'Flatbed',
      feePercent: 5,
      isPopular: true,
      badge: 'Popular',
      icon: Layers,
      bullets: [
        'Machinery, Steel & Building Materials',
        'Tarp & Strap Fee Negotiation',
        'Oversize Permit Coordination',
        'High Rate-Per-Mile Loads',
      ],
    },
    {
      id: 'step-deck-rate',
      name: 'Step Deck',
      feePercent: 5,
      badge: 'Heavy Haul',
      icon: ShieldAlert,
      bullets: [
        'Heavy & Tall Equipment',
        'Specialized Freight Lanes',
        'Ramp & RGN Coordination',
        'Maximum Revenue Per Mile',
      ],
    },
    {
      id: 'hotshot-rate',
      name: 'Hotshot',
      feePercent: 7,
      badge: 'Expedited',
      icon: Flame,
      bullets: [
        '40ft Gooseneck & 35ft Trailers',
        'High-Paying LTL & Partials',
        'Expedited Construction Loads',
        'Non-stop Rapid Sourcing',
      ],
    },
    {
      id: 'reefer-rate',
      name: 'Reefer',
      feePercent: 5,
      badge: 'Temp-Control',
      icon: Thermometer,
      bullets: [
        'Food, Produce & Pharma Loads',
        'High-Value Refrigerated Cargo',
        'Seasonal Premium Rates',
        'Continuous Temperature Monitoring',
      ],
    },
    {
      id: 'box-truck-rate',
      name: 'Box Truck',
      feePercent: 7,
      isPopular: true,
      badge: 'Popular',
      icon: Box,
      bullets: [
        '26ft Box Trucks (Dock High & Liftgate)',
        'Expedited Freight & Local Delivery',
        'High-Density Regional Runs',
        'Multi-Stop High RPM Freights',
      ],
    },
  ];

  const handleSelectForCalculator = (rate: EquipmentRateCard) => {
    setSelectedForCalc(rate.id);

    // Broadcast custom event so EarningsCalculator picks up the exact fee
    window.dispatchEvent(
      new CustomEvent('infinity_select_calculator', {
        detail: {
          fee: rate.feePercent,
          equipment: rate.name,
        },
      })
    );

    // Smooth scroll to calculator
    const calcEl = document.getElementById('calculator');
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="equipment-rates"
      className="py-16 sm:py-20 bg-gradient-to-b from-[#070B14] via-[#091122] to-[#070B14] border-t border-b border-blue-950/70 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/90 border border-sky-400/60 text-xs font-mono text-sky-300 shadow-md">
            <Percent className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-bold tracking-wider uppercase">
              EQUIPMENT RATES & COMMISSION BREAKDOWN
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight">
            Transparent Low Dispatch Fees
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            No hidden costs. No setup fees. You keep 100% of your money paid directly by brokers or factoring, and only pay our low flat percentage fee.
          </p>
        </div>

        {/* 7 Commission Rate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {equipmentRates.map((card) => {
            const Icon = card.icon;
            const isSelected = selectedForCalc === card.id;

            return (
              <div
                key={card.id}
                className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative ${
                  card.isPopular
                    ? 'bg-gradient-to-b from-[#0F1D3B] via-[#0B152B] to-[#080F1E] border-2 border-sky-400 shadow-2xl shadow-blue-950/80'
                    : 'bg-[#0A1224] border border-blue-900/50 hover:border-blue-500 hover:bg-[#0D1830] shadow-xl'
                }`}
              >
                {/* Popular or Specialty Badge */}
                {card.badge && (
                  <div className="absolute -top-3 right-5">
                    <span
                      className={`px-3 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                        card.isPopular
                          ? 'bg-sky-400 text-slate-950 shadow-md font-black'
                          : 'bg-blue-900 text-sky-200 border border-blue-700/60'
                      }`}
                    >
                      {card.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-950 border border-blue-700/60 flex items-center justify-center text-sky-400 shadow-inner">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{card.name}</h3>
                  </div>

                  {/* Big Fee Display */}
                  <div className="p-4 rounded-2xl bg-black/70 border border-blue-900/50 mb-5 shadow-inner">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-display font-black text-sky-400 font-mono">
                        {card.feePercent}%
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                        Dispatch Fee
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono block mt-1">
                      Direct 100% broker/factor payout
                    </span>
                  </div>

                  {/* 4 Standardized Bullets */}
                  <ul className="space-y-2.5 mb-6 text-xs sm:text-sm text-slate-200">
                    {card.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Calculator Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleSelectForCalculator(card)}
                    className={`w-full py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-2 ring-emerald-400'
                        : card.isPopular
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                        : 'bg-blue-950/80 hover:bg-blue-900 text-sky-200 border border-blue-800/60'
                    }`}
                  >
                    <Calculator className="w-4 h-4" />
                    <span>
                      {isSelected ? 'Selected! Scroll Below' : 'Select for Calculator'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="p-6 rounded-3xl bg-[#091124] border border-blue-800/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Zero Forced Dispatch · 100% Direct Carrier Payment · Transparent Invoicing
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                You maintain 100% authority on your rig. We only earn our 5%–7% fee when you get paid on booked, delivered loads.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenRegister}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold whitespace-nowrap shadow-lg shadow-blue-600/30 cursor-pointer transition-all flex items-center gap-2"
          >
            <span>Get Dispatched Today</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
