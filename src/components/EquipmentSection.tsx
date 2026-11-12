import React, { useState } from 'react';
import { EquipmentType } from '../types';
import { Truck, Weight, Check, ArrowRight } from 'lucide-react';

interface EquipmentSectionProps {
  onSelectEquipment: (type: EquipmentType) => void;
}

interface EquipmentCardData {
  type: EquipmentType;
  title: string;
  image?: string;
  specs: string;
  payload: string;
  idealFreight: string;
  description: string;
  tags: string[];
}

export const EquipmentSection: React.FC<EquipmentSectionProps> = ({ onSelectEquipment }) => {
  const [filter, setFilter] = useState<'all' | 'heavy' | 'expedited'>('all');

  const equipmentList: EquipmentCardData[] = [
    {
      type: 'Dry Van',
      title: '53ft Dry Van',
      image: '/assets/images/hero_semi_truck_1793918054436.jpg',
      specs: '53ft Length · 102in Width · 110in Height',
      payload: 'Up to 45,000 lbs',
      idealFreight: 'Packaged consumer goods, electronics, retail, auto parts',
      description:
        'The backbone of American freight. High-volume, consistent lanes across every state with zero-touch dock loading.',
      tags: ['Consistent Volume', 'High Availability', 'Drop & Hook'],
    },
    {
      type: 'Reefer',
      title: '53ft Refrigerated (Reefer)',
      image: '/assets/images/freight_dryvan_reefer_1793918055016.jpg',
      specs: '53ft Length · Thermo King / Carrier Units',
      payload: 'Up to 43,500 lbs',
      idealFreight: 'Fresh produce, meat, frozen food, pharmaceuticals',
      description:
        'Premium rates per mile year-round. We monitor temperature specifications and secure top perishable spot rates.',
      tags: ['Premium RPM', 'High Demand', 'Temperature Controlled'],
    },
    {
      type: 'Flatbed',
      title: '48ft / 53ft Standard Flatbed',
      image: '/assets/images/equipment_flatbed_heavy_1793918055540.jpg',
      specs: '48ft / 53ft Deck Length · 102in Width',
      payload: 'Up to 48,000 lbs',
      idealFreight: 'Structural steel, lumber, construction materials, machinery',
      description:
        'Consistent open-deck freight with strong regional rates. Tarp and strapping accessorial charges negotiated on every load.',
      tags: ['Open Deck', 'Tarp Pay', 'Industrial Freight'],
    },
    {
      type: 'Step Deck',
      title: 'Single / Double Drop Step Deck',
      image: '/assets/images/truck_stepdeck_heavy_1793923215902.jpg',
      specs: 'Upper Deck (10-11ft) + Lower Deck (37-43ft)',
      payload: 'Up to 46,000 lbs',
      idealFreight: 'Tractors, oversized equipment, tall machinery, industrial components',
      description:
        'Accommodates taller loads that exceed standard flatbed height limits, commanding higher per-mile revenue.',
      tags: ['Oversized Capable', 'Specialized Pay', 'High Clearance'],
    },
    {
      type: 'Power Only',
      title: 'Power Only (Tractor Only)',
      image: '/assets/images/truck_power_only_1793923217089.jpg',
      specs: 'Standard 3-Axle Sleeper / Day Cab',
      payload: 'Varies by connected trailer',
      idealFreight: 'Pre-loaded shipper trailers, auctions, fleet relocations',
      description:
        'Maximize fuel economy and minimize maintenance without trailer ownership. We connect you with verified trailer pools.',
      tags: ['No Trailer Overhead', 'High Turnaround', 'Drop & Hook'],
    },
    {
      type: 'Hotshot',
      title: 'Hotshot (3500/4500 + 40ft Gooseneck)',
      image: '/assets/images/equipment_hotshot_fleet_1793918055472.jpg',
      specs: '30ft – 40ft Gooseneck Deck with Ramps',
      payload: 'Up to 16,500 – 18,000 lbs',
      idealFreight: 'Oilfield pipes, machinery parts, urgent building materials',
      description:
        'High agility and rapid transit for time-critical regional industrial freight. We keep your hotshot booked consecutively.',
      tags: ['Expedited Freight', 'Oilfield & Energy', 'Fast Turnaround'],
    },
    {
      type: 'Box Truck',
      title: '26ft Straight Box Truck (Non-CDL & CDL)',
      image: '/assets/images/truck_box_commercial_1793923215293.jpg',
      specs: '26ft Length · 102in Width · 102in Height + Liftgate',
      payload: '9,500 lbs (Non-CDL) / 13,000 lbs (CDL)',
      idealFreight: 'Palletized LTL, commercial deliveries, retail distribution',
      description:
        'Dedicated dispatching for 26ft straight trucks with liftgates. We book both full truckload LTL and expedited regional runs.',
      tags: ['Liftgate Available', 'Regional Routes', 'Direct Delivery'],
    },
    {
      type: 'Sprinter Van',
      title: 'Cargo & Sprinter Van',
      image: '/assets/images/truck_sprinter_cargo_1793923217019.jpg',
      specs: 'High Roof Extended Wheelbase',
      payload: 'Up to 3,500 – 4,500 lbs',
      idealFreight: 'Expedited automotive parts, medical equipment, priority parcels',
      description:
        'Rapid point-to-point courier and emergency freight. We negotiate time-sensitive premium expedited rates.',
      tags: ['High Priority', 'Minimal Fuel Cost', 'Express Transit'],
    },
  ];

  const filteredEquipment = equipmentList.filter((item) => {
    if (filter === 'heavy') {
      return ['Dry Van', 'Reefer', 'Flatbed', 'Step Deck', 'Power Only'].includes(item.type);
    }
    if (filter === 'expedited') {
      return ['Hotshot', 'Box Truck', 'Sprinter Van'].includes(item.type);
    }
    return true;
  });

  return (
    <section id="equipment" className="py-20 bg-[#090E1B] border-t border-blue-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 mb-3">
              <span className="w-5 h-px bg-sky-400" />
              <span>Full Equipment Coverage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
              Specialized Dispatch for Every Trailer Type
            </h2>
            <p className="mt-3 text-base text-slate-300">
              Each equipment category has distinct weight ratings, commodity requirements, and market dynamics.
              We know how to dispatch each type for optimal profitability.
            </p>
          </div>

          {/* Interactive filter control */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilter('heavy')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === 'heavy'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Class 8 / Semi
            </button>
            <button
              onClick={() => setFilter('expedited')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === 'expedited'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hotshot & Expedited
            </button>
          </div>
        </div>

        {/* 8 Equipment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEquipment.map((eq) => (
            <div
              key={eq.type}
              className="rounded-2xl bg-[#0D1527] border border-blue-900/40 hover:border-blue-500/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group shadow-lg shadow-black/20"
            >
              <div>
                {/* Photo Header if available, else styled banner */}
                {eq.image ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0A101D]">
                    <img
                      src={eq.image}
                      alt={eq.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1527] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[11px] font-mono font-bold text-sky-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-blue-800/40">
                      {eq.type}
                    </span>
                  </div>
                ) : (
                  <div className="p-5 bg-gradient-to-br from-blue-950/60 to-slate-900 border-b border-blue-900/40 flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-900/40 flex items-center justify-center text-sky-400 border border-blue-700/40">
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-sky-300 bg-slate-950/80 px-2.5 py-1 rounded-md border border-blue-800/40">
                      {eq.type}
                    </span>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    {eq.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-300 border-y border-blue-900/30 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Payload Capacity:</span>
                      <span className="font-mono font-semibold text-slate-200">{eq.payload}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Dimensions:</span>
                      <span className="text-right text-[11px] text-slate-300 truncate max-w-[150px]">
                        {eq.specs}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {eq.description}
                  </p>

                  {/* Clean unboxed tags with typographic separator */}
                  <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-sky-400/90 font-medium">
                    {eq.tags.map((tag, i) => (
                      <React.Fragment key={tag}>
                        <span>{tag}</span>
                        {i < eq.tags.length - 1 && <span className="text-slate-600">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onSelectEquipment(eq.type)}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 hover:border-blue-500 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
                >
                  <span>Dispatch My {eq.type}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
