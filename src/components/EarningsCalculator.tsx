import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, ArrowRight, Gauge, Fuel } from 'lucide-react';

interface EarningsCalculatorProps {
  onApplyCalculatedRate: (rpm: number) => void;
}

export const EarningsCalculator: React.FC<EarningsCalculatorProps> = ({
  onApplyCalculatedRate,
}) => {
  const [weeklyGross, setWeeklyGross] = useState<number>(7000); // Default $7,000 weekly gross as requested
  const [loadedMiles, setLoadedMiles] = useState<number>(2450);
  const [deadheadPercent, setDeadheadPercent] = useState<number>(8); // 8%
  const [dispatchFeePercent, setDispatchFeePercent] = useState<number>(7); // 7%
  const [costPerMile, setCostPerMile] = useState<number>(1.42); // fuel + maintenance + truck note

  // Listen for custom event from Equipment Rates & Commission Breakdown
  useEffect(() => {
    const handleSelect = (e: Event) => {
      const custom = e as CustomEvent<{ fee?: number; equipment?: string }>;
      if (custom.detail?.fee) {
        setDispatchFeePercent(custom.detail.fee);
      }
    };
    window.addEventListener('infinity_select_calculator', handleSelect);
    return () => window.removeEventListener('infinity_select_calculator', handleSelect);
  }, []);

  // Calculations
  const rpm = loadedMiles > 0 ? weeklyGross / loadedMiles : 2.85;
  const deadheadMiles = Math.round((loadedMiles * deadheadPercent) / 100);
  const totalMiles = loadedMiles + deadheadMiles;
  const grossRevenue = weeklyGross;
  const dispatchFee = (grossRevenue * dispatchFeePercent) / 100;
  const totalOperatingCost = totalMiles * costPerMile;
  const netEarnings = grossRevenue - dispatchFee - totalOperatingCost;
  const effectiveRpm = totalMiles > 0 ? grossRevenue / totalMiles : 0;
  const annualNet = netEarnings * 50; // 50 working weeks

  return (
    <section id="calculator" className="py-20 bg-[#090E1B] border-t border-b border-blue-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 mb-3">
            <span className="w-5 h-px bg-sky-400" />
            <span>Interactive Profit Tool</span>
            <span className="w-5 h-px bg-sky-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
            Carrier Earnings & Net Profit Calculator
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Calculate your weekly gross revenue, actual dispatch fees, operational expenses,
            and true net take-home pay based on your equipment and running preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#0D1527] border border-blue-900/40 space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-blue-900/30">
              <Calculator className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">Adjust Your Operational Parameters</h3>
            </div>

            {/* Slider 0: Target Weekly Gross Revenue (Default $7,000) */}
            <div className="space-y-2 p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Target Weekly Gross Revenue:</span>
                </span>
                <span className="font-mono font-black text-emerald-400 text-lg tabular-nums">
                  ${weeklyGross.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="3000"
                max="14000"
                step="250"
                value={weeklyGross}
                onChange={(e) => setWeeklyGross(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-800 h-2.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>$3,000 (Light)</span>
                <span className="text-emerald-400 font-bold">$7,000 (Infinity Target Default)</span>
                <span>$14,000 (Fleet/Team)</span>
              </div>
            </div>

            {/* Slider 1: Weekly Loaded Miles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-300 font-medium">Weekly Loaded Miles:</span>
                <span className="font-mono font-bold text-sky-400 text-base tabular-nums">
                  {loadedMiles.toLocaleString()} miles
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="4000"
                step="50"
                value={loadedMiles}
                onChange={(e) => setLoadedMiles(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>1,000 mi</span>
                <span>2,500 mi (Avg)</span>
                <span>4,000 mi</span>
              </div>
            </div>

            {/* Slider 2: Target Rate Per Mile */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-300 font-medium">Target Rate Per Mile (Loaded RPM):</span>
                <span className="font-mono font-bold text-emerald-400 text-base tabular-nums">
                  ${rpm.toFixed(2)} / mi
                </span>
              </div>
              <input
                type="range"
                min="1.80"
                max="4.50"
                step="0.05"
                value={rpm}
                onChange={(e) => setWeeklyGross(Number(e.target.value) * loadedMiles)}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>$1.80/mi</span>
                <span>$2.85/mi</span>
                <span>$4.50/mi</span>
              </div>
            </div>

            {/* Slider 3: Deadhead Miles % */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-300 font-medium">Expected Deadhead (Empty Miles %):</span>
                <span className="font-mono font-bold text-slate-200 text-base tabular-nums">
                  {deadheadPercent}% ({deadheadMiles} mi)
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={deadheadPercent}
                onChange={(e) => setDeadheadPercent(Number(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>3% (Tight)</span>
                <span>8% (Target)</span>
                <span>25%</span>
              </div>
            </div>

            {/* Grid 2 Columns: Dispatch Fee % & Operating Cost */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Dispatch Support Fee:</span>
                  <span className="font-mono font-bold text-sky-400 text-sm tabular-nums">
                    {dispatchFeePercent}%
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[5, 6, 7, 8, 10].map((fee) => (
                    <button
                      key={fee}
                      onClick={() => setDispatchFeePercent(fee)}
                      className={`flex-1 py-1 text-xs font-mono font-semibold rounded transition-colors cursor-pointer ${
                        dispatchFeePercent === fee
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {fee}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Estimated Cost / Mile:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm tabular-nums">
                    ${costPerMile.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1.00"
                  max="2.20"
                  step="0.02"
                  value={costPerMile}
                  onChange={(e) => setCostPerMile(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">Fuel, maintenance, insurance, truck note</span>
              </div>
            </div>
          </div>

          {/* Results Summary Column (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0F1C38] via-[#0C162E] to-[#0A1124] border border-blue-500/40 flex flex-col justify-between shadow-2xl shadow-blue-950/50">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-blue-800/40 pb-4">
                <div>
                  <span className="text-xs font-mono font-semibold text-sky-400 uppercase tracking-wider block">
                    Weekly Projections
                  </span>
                  <h4 className="text-lg font-bold text-white">Estimated Financial Summary</h4>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-300 bg-blue-950/80 px-2.5 py-1 rounded-md border border-blue-700/40">
                  {totalMiles.toLocaleString()} total mi
                </span>
              </div>

              {/* Main Net Take-Home Highlight */}
              <div className="p-5 rounded-xl bg-[#090E1D] border border-emerald-500/30">
                <span className="text-xs text-slate-400 block mb-1">
                  Estimated Weekly Net Take-Home
                </span>
                <div className="text-3xl sm:text-4xl font-display font-black text-emerald-400 font-mono tabular-nums">
                  ${Math.max(0, netEarnings).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2 font-mono">
                  <span>Effective All-In RPM:</span>
                  <span className="text-white font-bold">${effectiveRpm.toFixed(2)} / mi</span>
                </div>
              </div>

              {/* Breakdown lines */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Gross Freight Revenue:</span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    ${grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span>Dispatch Support Fee ({dispatchFeePercent}%):</span>
                  </span>
                  <span className="font-mono font-semibold text-sky-400 tabular-nums">
                    - ${dispatchFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>Operating & Fuel Expenses:</span>
                  <span className="font-mono font-semibold text-rose-400 tabular-nums">
                    - ${totalOperatingCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300 pt-2 border-t border-blue-900/30">
                  <span className="text-slate-400">Projected 50-Wk Annual Net:</span>
                  <span className="font-mono font-bold text-emerald-300 text-sm tabular-nums">
                    ${Math.max(0, annualNet).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6">
              <button
                onClick={() => onApplyCalculatedRate(rpm)}
                className="w-full py-3.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Register Truck With ${rpm.toFixed(2)} Target RPM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-center text-slate-400 block mt-2">
                Actual figures depend on spot rates, fuel prices, and driver acceptance.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
