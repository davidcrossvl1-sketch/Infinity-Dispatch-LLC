import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  Compass,
  CheckCircle2,
  TrendingUp,
  FileCheck2,
  Play,
  MapPin,
  Truck,
  Sparkles,
  Activity,
  Search,
  Award,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenRegister: () => void;
  designStyle?: 'flagship' | 'navix' | 'horizon';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenRegister,
  designStyle = 'flagship',
}) => {
  // Mouse position normalized (-0.5 to 0.5) for multi-layer 3D parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Concept 2 (Navix) Interactive State
  const [navixViewMode, setNavixViewMode] = useState<'gross' | 'net'>('gross');
  const [activeStepIndex, setActiveStepIndex] = useState(2);

  // Concept 3 (Horizon) Quick Rate Estimator State
  const [estOrigin, setEstOrigin] = useState('Dallas, TX');
  const [estDest, setEstDest] = useState('Chicago, IL');
  const [showEstimatedRate, setShowEstimatedRate] = useState(false);

  const navixSteps = [
    { label: 'Spot Load Identified', detail: 'Broker posted load at $3,100' },
    { label: 'Aggressive Counter', detail: 'Dispatcher locked $3,850 (+$750)' },
    { label: 'Rate Con Signed', detail: 'Locked at $4.09/mi · 0 unpaid deadhead' },
    { label: 'Carrier In Transit', detail: '24/7 broker check calls managed' },
    { label: 'Direct Carrier Payout', detail: '100% direct broker quick-pay' },
  ];

  return (
    <section id="home" className="relative overflow-hidden pt-2 pb-10 lg:pt-4 lg:pb-16 select-none">
      {/* ─────────────────────────────────────────────────────────────
          CONCEPT 1: CINEMATIC HIGHWAY FLAGSHIP (UG Transportation Style)
          Subtle Parallax Motion Graphics + Headlight Ambient Bloom + Frosted Dock
          ───────────────────────────────────────────────────────────── */}
      {designStyle === 'flagship' && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-3xl overflow-hidden min-h-[640px] lg:min-h-[700px] flex flex-col justify-between border border-blue-500/30 shadow-[0_30px_70px_-15px_rgba(0,18,60,0.75)] bg-[#040711]"
          >
            {/* Cinematic Parallax Semi-Truck Photography */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <motion.img
                src="/assets/images/hero_semi_truck_1793918054436.jpg"
                alt="Infinity Dispatch LLC Class 8 semi-truck on American highway"
                className="w-full h-full object-cover object-right md:object-center brightness-[0.92] contrast-[1.08]"
                referrerPolicy="no-referrer"
                animate={{
                  x: mousePos.x * -24,
                  y: mousePos.y * -16,
                  scale: 1.06,
                }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 120,
                  mass: 0.6,
                }}
              />

              {/* Highway speed glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#04060E] via-[#04060E]/85 via-45% to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04060E] via-transparent via-50% to-[#04060E]/60" />

              {/* Headlight Parallax Beam Pulse */}
              <motion.div
                className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-sky-400/15 blur-[100px] pointer-events-none"
                animate={{
                  x: mousePos.x * 40,
                  y: mousePos.y * 30,
                  opacity: [0.35, 0.65, 0.35],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* Top Text Content Zone */}
            <motion.div
              animate={{
                x: mousePos.x * 8,
                y: mousePos.y * 6,
              }}
              transition={{ type: 'spring', damping: 30, stiffness: 100 }}
              className="relative z-10 p-6 sm:p-10 lg:p-16 max-w-2xl lg:max-w-3xl space-y-6"
            >
              {/* Highlighted & Stylish Top Brand Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-950/90 via-[#0B1A3C] to-blue-950/90 border border-sky-400/60 shadow-[0_0_25px_rgba(56,189,248,0.4)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
                </span>
                <span className="font-display font-black tracking-[0.24em] text-xs sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.7)] uppercase">
                  INFINITY DISPATCH LLC
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-sm border border-sky-300/30">
                  OFFICIAL USA
                </span>
              </div>

              {/* Official David Cross Business Development Executive Banner above headline */}
              <div className="w-full max-w-xl rounded-2xl overflow-hidden border border-sky-400/60 shadow-xl shadow-sky-950/60 bg-[#0B1528] group hover:border-sky-300 transition-all">
                <img
                  src="/assets/aistudio/Screenshot_2026-11-04_123601_65aa921f.png"
                  alt="David Cross - Business Development Executive | IDL Infinity Dispatch LLC"
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Category Live Status Kicker */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#091328]/90 border border-blue-500/40 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-sky-300 uppercase">
                  FREIGHT DISPATCH SOLUTIONS · USA
                </span>
              </div>

              {/* Monumental Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-white tracking-tight leading-[1.04] text-balance">
                Reliable freight <br />
                solutions <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 drop-shadow-[0_0_30px_rgba(56,189,248,0.4)]">
                  you can trust
                </span>
              </h1>

              {/* Supporting Editorial Message */}
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl font-normal drop-shadow-sm">
                Dedicated capacity, disciplined load sourcing, and aggressive rate negotiation
                for owner-operators and fleets who want miles that make commercial sense.
              </p>

              {/* Front Screen Portion: Official Low Dispatch Fee Banner */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#081329]/90 border border-sky-400/50 backdrop-blur-md shadow-xl space-y-2.5 max-w-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-sky-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Low Transparent Dispatch Fees:</span>
                  </span>
                  <a
                    href="#equipment-rates"
                    className="text-[11px] font-mono text-sky-400 hover:text-white underline font-bold"
                  >
                    View All 7 Rates
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-3 py-1.5 rounded-xl bg-blue-950/90 border border-blue-700/60 text-white font-bold flex items-center gap-1.5 shadow-sm">
                    <span className="text-emerald-400 font-black text-sm">5%</span> Dry Van · Reefer · Flatbed · Step Deck · Power Only
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-blue-950/90 border border-blue-700/60 text-white font-bold flex items-center gap-1.5 shadow-sm">
                    <span className="text-amber-400 font-black text-sm">7%</span> 26ft Box Truck & Hotshot
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2 pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100% Direct Broker Pay · Zero Upfront Charges · No Forced Dispatch</span>
                </div>
              </div>

              {/* Primary & Secondary Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onOpenRegister}
                  className="px-8 py-4 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 rounded-xl shadow-xl shadow-blue-600/35 hover:shadow-blue-500/50 transition-all flex items-center gap-2.5 cursor-pointer uppercase tracking-wider"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Start Carrier Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <a
                  href="#calculator"
                  className="px-6 py-4 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-slate-950/70 hover:bg-slate-900 border border-slate-700/80 rounded-xl backdrop-blur-md transition-all flex items-center gap-2.5 group"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600/40 border border-blue-400/50 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                    <Play className="w-2.5 h-2.5 fill-sky-400 text-sky-400 ml-0.5" />
                  </div>
                  <span>Estimate Your Weekly Net</span>
                </a>
              </div>
            </motion.div>

            {/* Bottom 4-Item Floating Dark Glass Bar with Subtle Parallax Float */}
            <motion.div
              animate={{
                x: mousePos.x * -10,
                y: mousePos.y * -8,
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="relative z-10 m-4 sm:m-6 lg:m-8 rounded-2xl bg-[#060C1C]/85 backdrop-blur-2xl border border-blue-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-4 sm:p-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-blue-900/40">
                {/* 1. 24/7 SUPPORT */}
                <div className="flex items-center gap-3.5 pt-2 sm:pt-0 group cursor-default">
                  <div className="w-11 h-11 rounded-full bg-blue-950/90 border border-blue-500/40 flex items-center justify-center text-sky-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">24/7 SUPPORT</h4>
                    <p className="text-[11px] text-slate-300">Live dispatch, always on</p>
                  </div>
                </div>

                {/* 2. REAL-TIME TRACKING */}
                <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:pl-6 group cursor-default">
                  <div className="w-11 h-11 rounded-full bg-blue-950/90 border border-blue-500/40 flex items-center justify-center text-sky-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">REAL-TIME TRACKING</h4>
                    <p className="text-[11px] text-slate-300">Milestone pings you can trust</p>
                  </div>
                </div>

                {/* 3. SAFETY-FOCUSED */}
                <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:pl-6 group cursor-default">
                  <div className="w-11 h-11 rounded-full bg-blue-950/90 border border-blue-500/40 flex items-center justify-center text-sky-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">SAFETY-FOCUSED</h4>
                    <p className="text-[11px] text-slate-300">Verified, trained, accountable</p>
                  </div>
                </div>

                {/* 4. TRANSPARENT DISPATCH */}
                <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:pl-6 group cursor-default">
                  <div className="w-11 h-11 rounded-full bg-blue-950/90 border border-blue-500/40 flex items-center justify-center text-sky-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">TRANSPARENT DISPATCH</h4>
                    <p className="text-[11px] text-slate-300">Clear updates, no guesswork</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CONCEPT 2: PRECISION FREIGHT TMS & TECH (Navix Style)
          Multi-Layer 3D Tilt Parallax + Interactive Glass Widgets + Rate Card
          ───────────────────────────────────────────────────────────── */}
      {designStyle === 'navix' && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-3xl overflow-hidden min-h-[670px] p-6 sm:p-10 lg:p-16 flex flex-col justify-between border border-sky-500/35 bg-gradient-to-b from-[#081329] via-[#050C1B] to-[#03060E] shadow-2xl"
          >
            {/* Background Highway Truck Vignette with Parallax Depth */}
            <div className="absolute inset-0 pointer-events-none opacity-45 overflow-hidden">
              <motion.img
                src="/assets/images/freight_dryvan_reefer_1793918055016.jpg"
                alt="Freight Management"
                className="w-full h-full object-cover object-bottom"
                referrerPolicy="no-referrer"
                animate={{
                  x: mousePos.x * -30,
                  y: mousePos.y * -20,
                  scale: 1.08,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 100 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03060E] via-[#050C1B]/80 to-[#081329]" />
            </div>

            {/* Centered Editorial Header (Navix Style) */}
            <motion.div
              animate={{
                y: mousePos.y * 10,
              }}
              transition={{ type: 'spring', damping: 30, stiffness: 100 }}
              className="relative z-10 text-center max-w-3xl mx-auto space-y-5 pt-2"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-xs font-mono text-sky-400 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Next-Gen Transport & Dispatch Management</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.08] text-balance">
                Freight Dispatch & Lane Planning <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-teal-300">
                  tailored for American carriers.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                Oversee and coordinate all your transports on a single platform — guaranteeing
                rate transparency, real-time cost insights, and seamless broker paperwork.
              </p>

              {/* Centered Action Button Pair */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onOpenRegister}
                  className="px-7 py-3.5 text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-xl transition-all flex items-center gap-2 cursor-pointer font-sans"
                >
                  <span>Book Carrier Consultation</span>
                  <ArrowRight className="w-4 h-4 text-slate-900" />
                </motion.button>

                <a
                  href="#services"
                  className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all"
                >
                  <span>Explore Services</span>
                </a>
              </div>
            </motion.div>

            {/* Floating Glassmorphic Status Cards with Parallax Layering */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 items-end">
              {/* Left Floating Card: Offer Status Timeline (Parallax layer +1) */}
              <motion.div
                animate={{
                  x: mousePos.x * 20,
                  y: mousePos.y * 14,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                className="p-5 rounded-2xl bg-[#091122]/90 backdrop-blur-xl border border-blue-500/35 text-xs shadow-2xl space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-blue-900/40">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-sky-400" />
                    <span>Offer Status Progression</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    Live
                  </span>
                </div>

                <div className="space-y-2 font-mono text-[11px]">
                  {navixSteps.map((step, idx) => {
                    const isDone = idx < activeStepIndex;
                    const isCurrent = idx === activeStepIndex;
                    return (
                      <div
                        key={step.label}
                        onClick={() => setActiveStepIndex(idx)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                          isCurrent
                            ? 'bg-blue-950/80 text-sky-300 font-bold border border-blue-800/50'
                            : isDone
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isDone ? 'text-emerald-400' : isCurrent ? 'text-sky-400' : 'text-slate-600'}`} />
                        <div className="truncate">
                          <div>{step.label}</div>
                          {isCurrent && <div className="text-[10px] text-slate-400 font-normal">{step.detail}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Center Floating Status Pill (Parallax layer +2) */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  x: mousePos.x * 12,
                }}
                transition={{
                  y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                  x: { type: 'spring', damping: 25, stiffness: 100 },
                }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950/95 backdrop-blur-xl border border-emerald-500/50 shadow-2xl text-xs font-mono font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Shipment Delivered · 100% On-Time</span>
                </div>
              </motion.div>

              {/* Right Floating Card: Giant Rate & Settlement Card (Parallax layer +3) */}
              <motion.div
                animate={{
                  x: mousePos.x * -20,
                  y: mousePos.y * -14,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                className="p-5 rounded-2xl bg-[#091122]/90 backdrop-blur-xl border border-blue-500/35 shadow-2xl text-xs space-y-3"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Shipment Received</span>
                  </span>
                  {/* Toggle between Gross and Net */}
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-md font-mono text-[10px]">
                    <button
                      onClick={() => setNavixViewMode('gross')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${navixViewMode === 'gross' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                    >
                      Gross
                    </button>
                    <button
                      onClick={() => setNavixViewMode('net')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${navixViewMode === 'net' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                    >
                      Net
                    </button>
                  </div>
                </div>

                <div className="text-4xl sm:text-5xl font-display font-black text-white font-mono tabular-nums tracking-tight">
                  {navixViewMode === 'gross' ? '$4,500' : '$4,185'}
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-300 font-mono border-t border-blue-900/40 pt-2.5">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block text-[10px]">Due Date:</span>
                    <span className="font-semibold text-white">Settled Next Day</span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-slate-400 block text-[10px]">Reference:</span>
                    <span className="font-bold text-sky-400">XY-789012</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CONCEPT 3: HORIZON COMMAND CENTER (Carry Horizon Style)
          Bento Grid + Parallax Semi-Truck Cutout + Interactive Lane Intake
          ───────────────────────────────────────────────────────────── */}
      {designStyle === 'horizon' && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="rounded-3xl bg-[#080E1D] border border-blue-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
          >
            {/* Live Freight Stream Bar (Horizon Command Style) */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#0B152A] border border-blue-900/40 text-xs overflow-hidden">
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono font-bold text-sky-400 text-[11px] uppercase tracking-wider">
                  LIVE DISPATCH NETWORK:
                </span>
              </div>
              <div className="flex items-center gap-6 font-mono text-[11px] text-slate-300 truncate">
                <span>Dallas, TX → Columbus, OH · <strong className="text-emerald-400">$2.73/mi</strong> [Booked]</span>
                <span className="text-slate-600">·</span>
                <span>Nashville, TN → Philadelphia, PA · <strong className="text-emerald-400">$4.50/mi</strong> [In Transit]</span>
                <span className="text-slate-600">·</span>
                <span>Gary, IN → Houston, TX · <strong className="text-emerald-400">$3.52/mi</strong> [Dispatched]</span>
              </div>
              <span className="hidden lg:inline text-[10px] font-mono text-slate-400 shrink-0">
                Updated Just Now
              </span>
            </div>

            {/* Bento Grid: 2 Columns with Interactive Parallax Response */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column (7 cols): Headline + Quick Lane Lookup */}
              <motion.div
                animate={{
                  x: mousePos.x * 10,
                  y: mousePos.y * 8,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 100 }}
                className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#0B1428] border border-blue-900/40 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
                    <Activity className="w-4 h-4 text-sky-400" />
                    <span>Real-Time Fleet Dispatch Engine</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
                    Maximize Every Mile. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">
                      Eliminate Empty Deadhead.
                    </span>
                  </h1>

                  <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                    Direct dispatcher assignment with David Cross & Alvin. We handle check calls,
                    rate negotiations, and pre-book reloads before you arrive at receiver docks.
                  </p>
                </div>

                {/* Instant Lane Rate Estimator Widget */}
                <div className="p-4 rounded-xl bg-[#070D1B] border border-blue-800/40 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-sky-400" />
                      <span>Instant Lane Rate Estimator</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Current Spot Index</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={estOrigin}
                      onChange={(e) => setEstOrigin(e.target.value)}
                      placeholder="Origin (e.g. Dallas, TX)"
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={estDest}
                      onChange={(e) => setEstDest(e.target.value)}
                      placeholder="Destination (e.g. Chicago, IL)"
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                    <button
                      onClick={() => setShowEstimatedRate(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Check RPM
                    </button>
                  </div>

                  {showEstimatedRate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3 bg-blue-950/60 rounded-lg border border-blue-700/40 text-xs flex items-center justify-between font-mono"
                    >
                      <div>
                        <span className="text-slate-400 text-[10px] block">Estimated Lane Rate:</span>
                        <span className="text-emerald-400 font-bold text-sm">$3,150 – $3,600</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] block">Avg Spot RPM:</span>
                        <span className="text-sky-300 font-bold text-sm">$3.35 / mi</span>
                      </div>
                      <button
                        onClick={onOpenRegister}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[11px] cursor-pointer"
                      >
                        Lock In Load
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Right Column (5 cols): Metrics Cards & Delivery Curve with Parallax Depth */}
              <motion.div
                animate={{
                  x: mousePos.x * -12,
                  y: mousePos.y * -10,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 100 }}
                className="lg:col-span-5 space-y-4 flex flex-col justify-between"
              >
                {/* 4 Quick Stat Tiles */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#0B1428] border border-blue-900/40">
                    <span className="text-xs text-slate-400 block">Weekly Gross</span>
                    <div className="text-2xl font-mono font-bold text-white mt-1">$8,450</div>
                    <span className="text-[10px] text-emerald-400 font-mono">+16% vs avg</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0B1428] border border-blue-900/40">
                    <span className="text-xs text-slate-400 block">Dispatched Miles</span>
                    <div className="text-2xl font-mono font-bold text-white mt-1">2,580 mi</div>
                    <span className="text-[10px] text-sky-400 font-mono">6.2% deadhead</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0B1428] border border-blue-900/40">
                    <span className="text-xs text-slate-400 block">Average Rate</span>
                    <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">$3.28/mi</div>
                    <span className="text-[10px] text-slate-400 font-mono">Spot market peak</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0B1428] border border-blue-900/40">
                    <span className="text-xs text-slate-400 block">Forced Dispatch</span>
                    <div className="text-2xl font-mono font-bold text-sky-400 mt-1">0%</div>
                    <span className="text-[10px] text-slate-400 font-mono">100% driver choice</span>
                  </div>
                </div>

                {/* Simulated Delivery Time Sparkline Card (Carry Horizon Style) */}
                <div className="p-5 rounded-2xl bg-[#0B1428] border border-blue-900/40 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Transit Efficiency Curve</span>
                    <span className="text-[11px] font-mono text-sky-400 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                      Avg 7h 25m transit
                    </span>
                  </div>

                  {/* SVG Smoothed Bezier Wave */}
                  <div className="relative h-20 w-full">
                    <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 60 Q 50 20, 100 45 T 200 25 T 300 15 L 300 80 L 0 80 Z"
                        fill="url(#waveGrad)"
                      />
                      <path
                        d="M 0 60 Q 50 20, 100 45 T 200 25 T 300 15"
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <circle cx="200" cy="25" r="4" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Final Onboarding Action */}
                <button
                  onClick={onOpenRegister}
                  className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Connect Truck With Dispatch Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
