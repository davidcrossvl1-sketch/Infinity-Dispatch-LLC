import React, { useState } from 'react';
import {
  MapPin,
  TrendingUp,
  Truck,
  Phone,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Navigation,
  Activity,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
  DollarSign,
  Gauge,
  Zap,
  BarChart3,
  Check,
  Eye,
  Crosshair,
} from 'lucide-react';

interface NationwideDispatchNetworkSectionProps {
  onOpenRegister: () => void;
  onOpenDemo?: () => void;
}

type CommandView = 'terminal' | 'telemetry' | 'corridors';

interface CorridorData {
  id: string;
  code: string;
  title: string;
  badge: string;
  description: string;
  equipment: string[];
  avgRpm: string;
  transitTime: string;
  distance: string;
  estWeeklyGross: string;
  activeLoads: number;
  backhaulRating: string;
}

export const NationwideDispatchNetworkSection: React.FC<NationwideDispatchNetworkSectionProps> = ({
  onOpenRegister,
  onOpenDemo,
}) => {
  const [activeView, setActiveView] = useState<CommandView>('terminal');
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('i10w');

  const corridors: CorridorData[] = [
    {
      id: 'i10w',
      code: 'I-10 W',
      title: 'I-10 West Transcontinental',
      badge: 'High RPM Priority',
      description:
        'Primary cross-country freight lane connecting Houston HQ to West Coast ports & Arizona distribution hubs.',
      equipment: ['Dry Van', 'Reefer', 'Flatbed', 'Hotshot'],
      avgRpm: '$3.15 / mi',
      transitTime: '2-3 Days',
      distance: '1,540 mi',
      estWeeklyGross: '$8,950+',
      activeLoads: 42,
      backhaulRating: '98% Guaranteed Reload',
    },
    {
      id: 'i45n',
      code: 'I-45 N / I-35 N',
      title: 'I-45 / I-35 Central Corridor',
      badge: 'High Volume Daily',
      description:
        'High-volume central pipeline moving freight from Houston HQ through Dallas/DFW to Chicago and the Midwest.',
      equipment: ['Dry Van', 'Reefer', 'Power Only', 'Step Deck'],
      avgRpm: '$3.30 / mi',
      transitTime: '1-2 Days',
      distance: '1,080 mi',
      estWeeklyGross: '$9,200+',
      activeLoads: 58,
      backhaulRating: '99% Guaranteed Reload',
    },
    {
      id: 'i10e',
      code: 'I-10 E / I-85 N',
      title: 'I-10 East / I-85 Southeast Express',
      badge: 'Reefer & Dry Van Hub',
      description:
        'Southeastern agricultural & manufacturing express link from Houston HQ to Atlanta, Georgia & Florida ports.',
      equipment: ['Reefer', 'Dry Van', 'Flatbed'],
      avgRpm: '$3.05 / mi',
      transitTime: '1-2 Days',
      distance: '820 mi',
      estWeeklyGross: '$8,400+',
      activeLoads: 36,
      backhaulRating: '97% Guaranteed Reload',
    },
    {
      id: 'i59n',
      code: 'I-59 N / I-55 N',
      title: 'I-59 / I-55 Mid-South Artery',
      badge: 'Heavy Industrial',
      description:
        'Heavy industrial lane connecting Texas oilfields & chemical plants to Memphis distribution & Midwest auto plants.',
      equipment: ['Flatbed', 'Power Only', 'Hotshot'],
      avgRpm: '$3.40 / mi',
      transitTime: '1-2 Days',
      distance: '1,220 mi',
      estWeeklyGross: '$9,650+',
      activeLoads: 29,
      backhaulRating: '96% Guaranteed Reload',
    },
    {
      id: 'i95n',
      code: 'I-10 E to I-95 N',
      title: 'I-10 / I-95 Eastern Seaboard Link',
      badge: 'Premium Rate RPM',
      description:
        'Long-haul freight channel delivering consumer merchandise and refrigerated goods to New Jersey / NY Metro.',
      equipment: ['Dry Van', 'Reefer', 'Power Only'],
      avgRpm: '$3.55 / mi',
      transitTime: '3-4 Days',
      distance: '1,610 mi',
      estWeeklyGross: '$10,250+',
      activeLoads: 31,
      backhaulRating: '99% Guaranteed Reload',
    },
  ];

  const activeCorridor = corridors.find((c) => c.id === selectedCorridorId) || corridors[0];

  const liveTmsLoads = [
    {
      id: 'INF-9482',
      lane: 'Houston, TX ➔ Atlanta, GA',
      equipment: '53ft Reefer',
      rate: '$3.85 / mi',
      gross: '$3,426',
      status: 'Rate Con Locked & Verified',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      payout: 'Direct Broker Pay (No Fee Withholding)',
      timeAgo: 'Just now',
    },
    {
      id: 'INF-9479',
      lane: 'Dallas, TX ➔ Chicago, IL',
      equipment: '53ft Dry Van (Drop & Hook)',
      rate: '$3.35 / mi',
      gross: '$3,150',
      status: 'In-Transit · Check-Call #2 Logged',
      statusColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      payout: 'Factoring Direct Submission',
      timeAgo: '6m ago',
    },
    {
      id: 'INF-9475',
      lane: 'Beaumont, TX ➔ Gary, IN',
      equipment: '48ft Flatbed (Steel Coils)',
      rate: '$3.95 / mi',
      gross: '$4,345',
      status: 'Tarp & Strap Verified · Detention Protected',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      payout: 'QuickPay Direct Wire',
      timeAgo: '14m ago',
    },
    {
      id: 'INF-9471',
      lane: 'Houston, TX ➔ Memphis, TN',
      equipment: '26ft Box Truck (Expedite)',
      rate: '$3.65 / mi',
      gross: '$2,190',
      status: 'Dock Dock-High Confirmed · On Time',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      payout: 'Direct Broker Pay (7% Fee)',
      timeAgo: '28m ago',
    },
    {
      id: 'INF-9467',
      lane: 'Pasadena, TX ➔ Phoenix, AZ',
      equipment: 'Power Only (Chained Load)',
      rate: '$3.25 / mi',
      gross: '$3,800',
      status: 'Pre-planned Reload Secured',
      statusColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      payout: 'Direct Broker Pay (5% Fee)',
      timeAgo: '41m ago',
    },
  ];

  return (
    <section id="corridors" className="py-20 bg-[#060913] border-t border-b border-blue-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/50 text-xs font-mono text-sky-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>NATIONWIDE COMMAND CENTER · 24/7 ACTIVE DISPATCH TELEMETRY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight">
              Houston HQ & High-Paying Corridor Network
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Headquartered in Houston, Texas, Infinity Dispatch LLC operates a modern multi-corridor dispatch nerve center powering owner-operators across all 48 continental states.
            </p>
          </div>

          <a
            href="tel:+14095096940"
            className="self-start md:self-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 whitespace-nowrap cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Phone className="w-4 h-4 text-emerald-300" />
            <span>Call Houston Dispatch: (409) 509-6940</span>
          </a>
        </div>

        {/* Multi-Dimensional Command Center Switcher (Suggestion 2 & Suggestion 3) */}
        <div className="bg-[#091124] border border-blue-900/60 rounded-3xl p-2 sm:p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveView('terminal')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeView === 'terminal'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-black/40 text-slate-400 hover:text-white hover:bg-blue-950/50'
              }`}
            >
              <Building2 className="w-4 h-4 text-sky-300" />
              <span>1. Houston HQ Operations Floor</span>
            </button>

            <button
              onClick={() => setActiveView('telemetry')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeView === 'telemetry'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-black/40 text-slate-400 hover:text-white hover:bg-blue-950/50'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>2. Live TMS Corridor Telemetry</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                LIVE
              </span>
            </button>

            <button
              onClick={() => setActiveView('corridors')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeView === 'corridors'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-black/40 text-slate-400 hover:text-white hover:bg-blue-950/50'
              }`}
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>3. National Freight Corridor Matrix</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
                5 LANES
              </span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-slate-400 px-3">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>HQ Operations Online · 24/7 Monitoring</span>
          </div>
        </div>

        {/* VIEW 1: HOUSTON HQ OPERATIONS FLOOR & TERMINAL SPECS */}
        {activeView === 'terminal' && (
          <div className="rounded-3xl bg-[#091124] border-2 border-blue-500/40 p-6 sm:p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
            {/* Photo of Houston HQ Operations Floor */}
            <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-blue-700/50 relative shadow-xl min-h-[320px] group bg-black/60">
              <img
                src="/assets/aistudio/image_55efaf5f.png"
                alt="Houston, TX HQ - Infinity Dispatch Operations Floor"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 max-h-[360px]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-white bg-blue-950/90 px-3 py-1 rounded-lg border border-blue-700/60 backdrop-blur-sm">
                      Houston, Texas HQ · Master Operations Floor
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300">
                    Live logistics controllers actively securing rates & monitoring lane volume
                  </p>
                </div>
              </div>
            </div>

            {/* Houston Terminal Specs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white">Houston, TX Command Center</h3>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        PRIMARY HQ
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Infinity Dispatch LLC • 48-State Carrier Management & Freight Pipeline
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Headquarters Performance Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-black/60 border border-blue-900/40">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Monthly Load Throughput
                  </span>
                  <span className="text-2xl font-display font-black text-sky-400 font-mono">
                    2,800+
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">Loads/Month</span>
                </div>
                <div className="p-4 rounded-xl bg-black/60 border border-blue-900/40">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    HQ Market Rate RPM
                  </span>
                  <span className="text-2xl font-display font-black text-emerald-400 font-mono">
                    $2.95 - $3.60
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">Average Outbound</span>
                </div>
                <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-black/60 border border-blue-900/40">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Broker Network Reach
                  </span>
                  <span className="text-2xl font-display font-black text-amber-400 font-mono">
                    12,500+
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">Vetted Brokers & Shippers</span>
                </div>
              </div>

              {/* Commodities Dispatched */}
              <div>
                <span className="text-xs font-mono font-bold text-slate-300 block mb-2 uppercase tracking-wider">
                  Primary Houston Outbound Commodities:
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <span className="px-3 py-1 rounded-lg bg-blue-950/70 border border-blue-800/60 text-sky-200">
                    Oil & Gas Equipment
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-blue-950/70 border border-blue-800/60 text-sky-200">
                    Industrial Machinery
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-blue-950/70 border border-blue-800/60 text-sky-200">
                    Refrigerated Food & Produce
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-blue-950/70 border border-blue-800/60 text-sky-200">
                    Steel & Master Coils
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-blue-950/70 border border-blue-800/60 text-sky-200">
                    Consumer & Retail Freight
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenRegister}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
                >
                  <Truck className="w-4 h-4 text-sky-200" />
                  <span>Get Dispatched from Houston HQ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveView('telemetry')}
                  className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-blue-900/60 text-sky-300 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>View Live TMS Feeds</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: LIVE TMS CORRIDOR TELEMETRY & STATUS (SUGGESTION 2) */}
        {activeView === 'telemetry' && (
          <div className="rounded-3xl bg-[#091124] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-8 animate-fadeIn">
            {/* Telemetry Header with Status Indicators */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-900/50 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                    LIVE TMS LOAD DISPATCH TELEMETRY (SUGGESTION 2)
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                  Real-Time Load Feeds & Check-Call Activity
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Live snapshot of active rate confirmations, dock-in verifications, and direct carrier payouts managed by Houston HQ.
                </p>
              </div>

              {/* 4 Guarantees Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Direct Carrier Payout</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-sky-500/30 text-sky-300 text-xs font-mono font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>15-Min Rate Con Lock</span>
                </div>
              </div>
            </div>

            {/* Live TMS Load Table / Feed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-3">
                <span>ACTIVE DISPATCH QUEUE</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Auto-Updating Every 30s
                </span>
              </div>

              <div className="space-y-2.5">
                {liveTmsLoads.map((load) => (
                  <div
                    key={load.id}
                    className="p-4 rounded-xl bg-black/60 border border-blue-900/40 hover:border-sky-500/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start md:items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center text-sky-400 font-mono text-xs font-bold shrink-0">
                        <Truck className="w-5 h-5 text-sky-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-slate-400 font-bold">
                            {load.id}
                          </span>
                          <span className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                            {load.lane}
                          </span>
                          <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {load.equipment}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-400">
                          Payment: <span className="text-slate-300">{load.payout}</span> • <span className="text-slate-500">{load.timeAgo}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-blue-900/30 pt-2 md:pt-0">
                      <div className="text-left md:text-right">
                        <span className="text-base font-mono font-black text-emerald-400 block">
                          {load.rate}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          Gross: {load.gross}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border ${load.statusColor}`}>
                          {load.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detention, Layover & TONU Guarantee Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-blue-900/40">
              <div className="p-4 rounded-xl bg-black/40 border border-blue-900/30 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-mono font-bold text-white block">
                    Zero Detention Loss
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Live dock tracking with automated $75/hr detention billing after 2 hours.
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-blue-900/30 flex items-center gap-3">
                <FileText className="w-8 h-8 text-sky-400 shrink-0" />
                <div>
                  <span className="text-xs font-mono font-bold text-white block">
                    $250 - $350 TONU Recovery
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Aggressive enforcement of Truck Ordered Not Used fees if a broker cancels.
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-blue-900/30 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <span className="text-xs font-mono font-bold text-white block">
                    Factoring Integration
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Same-day rate con & BOL submission direct to your factoring provider.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={onOpenRegister}
                className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-lg shadow-emerald-600/30 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Put Your Truck On This Active Telemetry Board</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: HIGH-PAYING CORRIDOR NETWORK MATRIX (SUGGESTION 3) */}
        {activeView === 'corridors' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Interactive Corridor Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {corridors.map((c) => {
                const isSelected = selectedCorridorId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCorridorId(c.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/80 border-sky-400 shadow-xl shadow-blue-900/40 ring-2 ring-sky-400/40'
                        : 'bg-[#091124] border-blue-900/40 hover:border-sky-500/40 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-black/60 text-sky-400'
                      }`}>
                        {c.code}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {c.avgRpm}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white mb-1 line-clamp-1">
                      {c.title}
                    </h4>

                    <span className="text-[10px] font-mono text-slate-400 block">
                      {c.distance} • {c.transitTime}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detailed Selected Corridor Pipeline Card */}
            <div className="rounded-3xl bg-[#091124] border-2 border-sky-500/40 p-6 sm:p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-blue-950 text-sky-300 border border-blue-700">
                    {activeCorridor.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {activeCorridor.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {activeCorridor.activeLoads} Active Daily Loads Available
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                  {activeCorridor.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeCorridor.description}
                </p>

                {/* Corridor Specific Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-black/60 border border-blue-900/40">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Average RPM
                    </span>
                    <span className="text-lg font-mono font-bold text-emerald-400">
                      {activeCorridor.avgRpm}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/60 border border-blue-900/40">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Total Lane Distance
                    </span>
                    <span className="text-lg font-mono font-bold text-sky-400">
                      {activeCorridor.distance}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/60 border border-blue-900/40">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Transit Duration
                    </span>
                    <span className="text-lg font-mono font-bold text-amber-400">
                      {activeCorridor.transitTime}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/60 border border-blue-900/40">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Est. Weekly Gross
                    </span>
                    <span className="text-lg font-mono font-bold text-purple-400">
                      {activeCorridor.estWeeklyGross}
                    </span>
                  </div>
                </div>

                {/* Recommended Equipment */}
                <div className="border-t border-blue-900/40 pt-4 space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-300 block uppercase">
                    Optimal Equipment Dispatched On This Lane:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeCorridor.equipment.map((eq) => (
                      <span
                        key={eq}
                        className="px-3 py-1 rounded-lg bg-blue-950/70 text-xs font-mono text-sky-200 border border-blue-800/60"
                      >
                        {eq}
                      </span>
                    ))}
                    <span className="px-3 py-1 rounded-lg bg-emerald-950/60 text-xs font-mono text-emerald-300 border border-emerald-800/50">
                      ✓ {activeCorridor.backhaulRating}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={onOpenRegister}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
                  >
                    <span>Claim Loads on {activeCorridor.code}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href="tel:+14095096940"
                    className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call David for Rate Con</span>
                  </a>
                </div>
              </div>

              {/* Corridor Blueprint Map Visualizer / Highlights */}
              <div className="lg:col-span-5 rounded-2xl bg-black/60 border border-blue-900/60 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-blue-900/40 pb-3">
                  <span className="text-xs font-mono font-bold text-sky-400 uppercase">
                    Houston Dispatch Pipeline Matrix
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Active Channel
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-900/30 flex items-center justify-between">
                    <span className="text-slate-400">Origin Hub:</span>
                    <span className="text-white font-bold">Houston, TX (HQ Hub)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-900/30 flex items-center justify-between">
                    <span className="text-slate-400">Target Corridor:</span>
                    <span className="text-sky-300 font-bold">{activeCorridor.code}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-900/30 flex items-center justify-between">
                    <span className="text-slate-400">Backhaul Guarantee:</span>
                    <span className="text-emerald-400 font-bold">Never Deadhead Home</span>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-900/30 flex items-center justify-between">
                    <span className="text-slate-400">Dedicated Dispatcher:</span>
                    <span className="text-amber-300 font-bold">Assigned 1-on-1</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Infinity Fuel & Route Optimization</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80">
                    We calculate fuel stop discounts, toll-avoidance routes, and optimal weigh station hours to maximize your net profit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Direct Owner Commitment Quote Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0C152B] via-[#0E1A38] to-[#0C152B] border-2 border-sky-400/50 shadow-2xl space-y-6 text-center max-w-4xl mx-auto">
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest block">
            DIRECT OWNER COMMITMENT
          </span>

          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-snug">
            “We treat your truck like it’s our own.”
          </blockquote>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            “At Infinity Dispatch LLC, my promise to every owner operator and fleet manager is simple: transparent low fees, zero forced dispatch, and round-the-clock support to make sure you never drive empty or underpaid.”
          </p>

          <div className="text-xs font-mono text-sky-300 font-bold">
            — David, Company Owner (Call direct: <a href="tel:+14095096940" className="underline hover:text-white">(409) 509-6940</a>)
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenRegister}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <span>Carrier Setup Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenDemo && (
              <button
                onClick={onOpenDemo}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span>Book 1-on-1 Call With David</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
