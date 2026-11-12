import React, { useState, useEffect } from 'react';
import {
  Clock,
  Radio,
  CheckSquare,
  Square,
  Shield,
  Truck,
  Globe,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface ZoneConfig {
  id: string;
  name: string;
  abbreviation: string;
  utcOffsetStr: string;
  timeZone: string;
  colorName: string;
  topBarColor: string;
  headerTextColor: string;
  bgBadge: string;
  states: string;
  description: string;
  freightNotes: string;
}

export const FreightTimeZonesMap: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [use24Hour, setUse24Hour] = useState(false);
  const [activeZone, setActiveZone] = useState<string>('central');

  // Real-time ticking clock engine updating every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Time formatter helper
  const formatTime = (timeZone: string, force24Hour = false) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: force24Hour ? false : !use24Hour,
      }).format(now);
    } catch {
      return now.toLocaleTimeString('en-US');
    }
  };

  // Date formatter helper
  const formatDate = (timeZone?: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      };
      if (timeZone) options.timeZone = timeZone;
      return new Intl.DateTimeFormat('en-US', options).format(now);
    } catch {
      return '11/06/2026';
    }
  };

  // Full day name and date for current device
  const deviceFullDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(now);

  // Device UTC offset string
  const getDeviceUtcOffset = () => {
    const offsetMin = -now.getTimezoneOffset();
    const sign = offsetMin >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offsetMin) / 60);
    const mins = Math.abs(offsetMin) % 60;
    return `UTC${sign}${hours}${mins ? `:${mins}` : ''}`;
  };

  // Analog clock hand degrees
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  const secondDeg = seconds * 6; // 360 / 60
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  // 5 Main Top Continental Zones (Alaska, Pacific, Mountain, Central, Eastern)
  const topZones: ZoneConfig[] = [
    {
      id: 'alaska',
      name: 'ALASKA DAYLIGHT TIME',
      abbreviation: 'AKDT',
      utcOffsetStr: 'AKDT (UTC-8)',
      timeZone: 'America/Anchorage',
      colorName: 'sky',
      topBarColor: 'bg-sky-500',
      headerTextColor: 'text-sky-400',
      bgBadge: 'border-sky-500/50 bg-sky-950/40',
      states: 'AK (Anchorage, Fairbanks, Juneau)',
      description: 'Alaska Highway & Maritime Freight Corridor',
      freightNotes: 'Heavy equipment, pipeline parts & refrigerated seafood transit.',
    },
    {
      id: 'pacific',
      name: 'PACIFIC DAYLIGHT TIME',
      abbreviation: 'PDT',
      utcOffsetStr: 'PDT (UTC-7)',
      timeZone: 'America/Los_Angeles',
      colorName: 'orange',
      topBarColor: 'bg-orange-500',
      headerTextColor: 'text-orange-400',
      bgBadge: 'border-orange-500/50 bg-orange-950/40',
      states: 'WA, OR, CA, NV',
      description: 'West Coast Ports & Salinas Valley Produce Hub',
      freightNotes: 'LA/Long Beach container drays, I-5 corridor, Central Valley agriculture.',
    },
    {
      id: 'mountain',
      name: 'MOUNTAIN DAYLIGHT TIME',
      abbreviation: 'MDT',
      utcOffsetStr: 'MDT (UTC-6)',
      timeZone: 'America/Denver',
      colorName: 'emerald',
      topBarColor: 'bg-emerald-500',
      headerTextColor: 'text-emerald-400',
      bgBadge: 'border-emerald-500/50 bg-emerald-950/40',
      states: 'MT, ID, WY, UT, CO, NM, AZ*',
      description: 'Cross-Country High Elevation Mountain Corridor',
      freightNotes: 'I-80 & I-70 winter transit, mining machinery, timber & cross-docking.',
    },
    {
      id: 'central',
      name: 'CENTRAL DAYLIGHT TIME',
      abbreviation: 'CDT',
      utcOffsetStr: 'CDT (UTC-5)',
      timeZone: 'America/Chicago',
      colorName: 'amber',
      topBarColor: 'bg-amber-400',
      headerTextColor: 'text-amber-400',
      bgBadge: 'border-amber-400/50 bg-amber-950/40',
      states: 'TX, IL, TN, MO, MN, WI, IA, KS, OK, LA, MS, AL, ND, SD, NE',
      description: 'Infinity Dispatch Primary Operations Center',
      freightNotes: 'Highest national freight volume, Texas triangle, Chicago rail & Midwest manufacturing.',
    },
    {
      id: 'eastern',
      name: 'EASTERN DAYLIGHT TIME',
      abbreviation: 'EDT',
      utcOffsetStr: 'EDT (UTC-4)',
      timeZone: 'America/New_York',
      colorName: 'rose',
      topBarColor: 'bg-rose-500',
      headerTextColor: 'text-rose-400',
      bgBadge: 'border-rose-500/50 bg-rose-950/40',
      states: 'MI, IN, OH, KY, GA, FL, NC, SC, VA, WV, PA, NY, MD, NJ, DE, CT, RI, MA, VT, NH, ME',
      description: 'Eastern Seaboard & Industrial Rust Belt',
      freightNotes: 'Automotive freight, Atlanta mega-hub, retail consumer goods, high-RPM regional lanes.',
    },
  ];

  // 3 Left Offshore Zones
  const leftOffshoreZones: ZoneConfig[] = [
    {
      id: 'aleutian',
      name: 'ALEUTIAN DAYLIGHT TIME',
      abbreviation: 'HADT',
      utcOffsetStr: 'HADT (UTC-9)',
      timeZone: 'America/Adak',
      colorName: 'blue',
      topBarColor: 'bg-blue-500',
      headerTextColor: 'text-blue-400',
      bgBadge: 'border-blue-500/50 bg-blue-950/40',
      states: 'Aleutian Islands (West of 169°30′W)',
      description: 'Maritime shipping & Arctic logistics',
      freightNotes: 'Commercial fishing supply chain.',
    },
    {
      id: 'hawaii',
      name: 'HAWAII STANDARD TIME',
      abbreviation: 'HST',
      utcOffsetStr: 'HST (UTC-10)',
      timeZone: 'Pacific/Honolulu',
      colorName: 'purple',
      topBarColor: 'bg-purple-500',
      headerTextColor: 'text-purple-400',
      bgBadge: 'border-purple-500/50 bg-purple-950/40',
      states: 'Hawaii (Oahu, Maui, Big Island, Kauai)',
      description: 'Island intermodal distribution',
      freightNotes: 'Containerized port drayage & hotel provisioning.',
    },
    {
      id: 'samoa',
      name: 'SAMOA STANDARD TIME',
      abbreviation: 'SST',
      utcOffsetStr: 'SST (UTC-11)',
      timeZone: 'Pacific/Pago_Pago',
      colorName: 'indigo',
      topBarColor: 'bg-indigo-500',
      headerTextColor: 'text-indigo-400',
      bgBadge: 'border-indigo-500/50 bg-indigo-950/40',
      states: 'American Samoa (Pago Pago, Tutuila)',
      description: 'South Pacific shipping hub',
      freightNotes: 'Ocean shipping & naval supplies.',
    },
  ];

  const currentActiveZoneConfig =
    topZones.find((z) => z.id === activeZone) ||
    leftOffshoreZones.find((z) => z.id === activeZone) ||
    topZones[3];

  return (
    <section id="time-zones" className="py-16 sm:py-20 bg-[#060A14] border-t border-b border-blue-950/80 relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/90 border border-blue-700/50 text-xs font-mono text-emerald-400 shadow-md">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>24/7 LIVE NATIONWIDE TIME ZONE DISPATCH DESK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white tracking-tight">
            Real-Time American Highway Freight Clocks
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Live running seconds across all continental and offshore US time zones. Our dispatch room monitors broker check-ins, receiver cutoffs, and appointment slots seamlessly coast-to-coast.
          </p>
        </div>

        {/* ==============================================================
            1. TOP ROW: 5 CONTINENTAL CLOCKS (ALASKA, PACIFIC, MOUNTAIN, CENTRAL, EASTERN)
            ============================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {topZones.map((zone) => {
            const isSelected = activeZone === zone.id;

            return (
              <div
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer border relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? `${zone.bgBadge} ring-2 ring-sky-400 shadow-xl shadow-blue-950/60`
                    : 'bg-[#0B1222] border-blue-900/50 hover:border-blue-600 hover:bg-[#0D162B]'
                }`}
              >
                {/* Top colored accent bar */}
                <div className={`h-1.5 w-full ${zone.topBarColor} rounded-full mb-2.5`} />

                <div>
                  <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-tight text-white line-clamp-1">
                    {zone.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 font-bold mb-2">
                    {zone.utcOffsetStr}
                  </div>

                  {/* High-visibility digital running clock box */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-black/90 border border-slate-800 text-center shadow-inner">
                    <span className="font-mono font-black text-lg sm:text-xl md:text-2xl text-white tracking-tight tabular-nums block">
                      {formatTime(zone.timeZone)}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400 truncate">{zone.abbreviation} Hub</span>
                  <span className="text-emerald-400 font-bold">● ACTIVE</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==============================================================
            2. MAIN COMPOSITE: LEFT OFFSHORE ZONES + CENTER US MAP + RIGHT CLOCK DESK
            ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: OFFSHORE / PACIFIC ISLAND ZONES (3 COLS) */}
          <div className="lg:col-span-3 space-y-3 flex flex-col justify-between">
            {leftOffshoreZones.map((zone) => {
              const isSelected = activeZone === zone.id;

              return (
                <div
                  key={zone.id}
                  onClick={() => setActiveZone(zone.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex-1 flex flex-col justify-between ${
                    isSelected
                      ? `${zone.bgBadge} ring-2 ring-sky-400 shadow-lg`
                      : 'bg-[#0A1020] border-blue-900/50 hover:border-blue-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[11px] font-extrabold uppercase ${zone.headerTextColor}`}>
                        {zone.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {zone.abbreviation}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 mb-2">
                      {zone.utcOffsetStr}
                    </div>

                    {/* Digital running clock box */}
                    <div className="p-2.5 rounded-xl bg-black/90 border border-slate-800 text-center shadow-inner">
                      <span className="font-mono font-black text-lg sm:text-xl text-white tracking-tight tabular-nums block">
                        {formatTime(zone.timeZone)}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 pt-2 font-mono truncate">
                    {zone.states}
                  </div>
                </div>
              );
            })}

            {/* Arizona Standard Time Special Notice */}
            <div className="p-3 rounded-xl bg-[#080E1C] border border-emerald-900/40 text-[10px] font-mono text-slate-400 space-y-1">
              <span className="text-emerald-400 font-bold block">
                ARIZONA MOUNTAIN STANDARD TIME
              </span>
              <span>MST (UTC-7) · No Daylight Saving Time</span>
            </div>
          </div>

          {/* CENTER: THE COLOR-CODED US MAP WITH INTERACTIVE CORRIDORS (6 COLS) */}
          <div className="lg:col-span-6 rounded-3xl bg-[#081022] border-2 border-blue-500/40 p-4 sm:p-6 flex flex-col justify-between relative shadow-2xl overflow-hidden">
            
            {/* Top map ribbon with active zone selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-blue-900/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-sky-300 uppercase tracking-wider">
                  CONTINENTAL US TIME ZONES & FREIGHT LANES
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Live Dispatch Sync
              </span>
            </div>

            {/* High-fidelity US Map Graphic with Time Zones (Using user attached Map.png) */}
            <div className="relative py-4 flex items-center justify-center my-auto">
              <img
                src="/assets/aistudio/Map_6d7381a0.png"
                alt="USA Time Zone Freight Corridors Map (Pacific, Mountain, Central, Eastern)"
                className="w-full h-auto max-h-[420px] object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Interactive Selected Zone Operational Intelligence Bar */}
            <div className="p-3 sm:p-4 rounded-2xl bg-[#050B17] border border-blue-800/60 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${currentActiveZoneConfig.topBarColor}`} />
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {currentActiveZoneConfig.name} ({currentActiveZoneConfig.abbreviation})
                  </span>
                </div>
                <div className="font-mono text-xs font-black text-sky-400 bg-slate-900/90 px-2.5 py-0.5 rounded border border-blue-800">
                  {formatTime(currentActiveZoneConfig.timeZone)} · {formatDate(currentActiveZoneConfig.timeZone)}
                </div>
              </div>

              <div className="text-xs text-slate-300">
                <span className="text-slate-400 font-mono text-[11px] block">Key Coverage:</span>
                <span>{currentActiveZoneConfig.states}</span>
              </div>

              <p className="text-[11px] font-mono text-emerald-400/90 pt-1 border-t border-slate-800">
                {currentActiveZoneConfig.freightNotes}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: 24-HR TOGGLE + UTC CLOCK + DEVICE'S ANALOG CLOCK (3 COLS) */}
          <div className="lg:col-span-3 space-y-3.5 flex flex-col justify-between">
            
            {/* 24-Hour Clock Toggle Checkbox */}
            <div
              onClick={() => setUse24Hour(!use24Hour)}
              className="p-3 rounded-2xl bg-[#0A1020] border border-blue-900/50 hover:border-sky-500 cursor-pointer flex items-center justify-between transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                {use24Hour ? (
                  <CheckSquare className="w-5 h-5 text-sky-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500" />
                )}
                <span className="text-xs font-bold text-white">24-Hour Clock Display</span>
              </div>
              <span className="text-[10px] font-mono text-sky-300 font-bold px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800">
                {use24Hour ? '24H' : '12H'}
              </span>
            </div>

            {/* Coordinated Universal Time (UTC) Clock Box */}
            <div className="p-3.5 rounded-2xl bg-[#0A1020] border border-blue-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase text-slate-300 tracking-tight">
                  Coordinated Universal Time (UTC)
                </span>
                <Globe className="w-3.5 h-3.5 text-sky-400" />
              </div>

              {/* UTC Digital Clock - Always 24h format */}
              <div className="p-2.5 rounded-xl bg-black border border-slate-800 text-center shadow-inner">
                <span className="font-mono font-black text-xl sm:text-2xl text-white tracking-widest tabular-nums block">
                  {formatTime('UTC', true)}
                </span>
              </div>

              <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider text-center">
                UTC IS ALWAYS DISPLAYED AS A 24-HOUR CLOCK.
              </div>
            </div>

            {/* Device Clock Box with Animated Analog Clock Dial & Live Date */}
            <div className="p-3.5 rounded-2xl bg-[#0A1020] border border-blue-900/50 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-white">Your Device's Clock</span>
                  <span className="text-[10px] font-mono font-bold text-sky-400">
                    ({getDeviceUtcOffset()})
                  </span>
                </div>

                {/* Today's Live Date */}
                <div className="mt-1 flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Today: {formatDate()}</span>
                </div>
              </div>

              {/* Live Animated Analog Clock Face */}
              <div className="flex justify-center my-1">
                <div className="relative w-32 h-32 rounded-full border-4 border-slate-700 bg-slate-950 shadow-2xl flex items-center justify-center">
                  
                  {/* Clock numbers 12, 3, 6, 9 */}
                  <span className="absolute top-1 text-[10px] font-mono font-bold text-slate-400">12</span>
                  <span className="absolute right-1.5 text-[10px] font-mono font-bold text-slate-400">3</span>
                  <span className="absolute bottom-1 text-[10px] font-mono font-bold text-slate-400">6</span>
                  <span className="absolute left-1.5 text-[10px] font-mono font-bold text-slate-400">9</span>

                  {/* Center pin */}
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-400 z-30 shadow" />

                  {/* Hour Hand */}
                  <div
                    className="absolute w-1 bg-white rounded-full origin-bottom z-10"
                    style={{
                      height: '28px',
                      bottom: '50%',
                      transform: `rotate(${hourDeg}deg)`,
                      transition: 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)',
                    }}
                  />

                  {/* Minute Hand */}
                  <div
                    className="absolute w-0.5 bg-sky-300 rounded-full origin-bottom z-20"
                    style={{
                      height: '42px',
                      bottom: '50%',
                      transform: `rotate(${minuteDeg}deg)`,
                      transition: 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)',
                    }}
                  />

                  {/* Second Hand (Ticking red hand) */}
                  <div
                    className="absolute w-0.5 bg-rose-500 rounded-full origin-bottom z-25"
                    style={{
                      height: '48px',
                      bottom: '50%',
                      transform: `rotate(${secondDeg}deg)`,
                      transition: 'transform 0.15s ease-out',
                    }}
                  />
                </div>
              </div>

              {/* Local Digital Display */}
              <div className="p-2 rounded-xl bg-black/90 border border-slate-800 text-center font-mono font-black text-lg text-white tabular-nums">
                {now.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: !use24Hour,
                })}
              </div>

              {/* Accurate Sync Status */}
              <div className="text-[10px] font-mono text-emerald-400 text-center flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Clock synchronized · Real-time live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Information Bar */}
        <div className="p-4 rounded-2xl bg-[#091122] border border-blue-900/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <span>Atlantic Standard Time (AST UTC-4): Puerto Rico & US Virgin Islands Covered</span>
          </div>
          <div className="text-emerald-400 font-bold">
            24/7 Live Dispatch Office · Never Miss a Broker Appointment Slot
          </div>
        </div>

      </div>
    </section>
  );
};
