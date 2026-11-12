import React, { useState } from 'react';
import { storage } from '../services/storage';
import {
  Search,
  MapPin,
  Calendar,
  Truck,
  Weight,
  Package,
  DollarSign,
  FileText,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const LoadRequestSection: React.FC = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('2026-11-06');
  const [equipmentType, setEquipmentType] = useState('Dry Van 53ft (5%)');
  const [weightCapacity, setWeightCapacity] = useState('40,000 lbs');
  const [commodity, setCommodity] = useState('General Freight');
  const [targetRate, setTargetRate] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupLocation || !deliveryLocation) return;

    // Save inquiry to storage & notify owner
    storage.submitInquiry({
      fullName: 'Carrier Load Request',
      email: 'Davidcross.vl1@gmail.com',
      phone: '(409) 509-6940',
      subject: `Load Request: ${pickupLocation} -> ${deliveryLocation} [${equipmentType}]`,
      message: `Pickup: ${pickupLocation} on ${pickupDate}. Delivery: ${deliveryLocation}. Equipment: ${equipmentType}. Weight: ${weightCapacity}. Commodity: ${commodity}. Desired RPM/Gross: ${targetRate || 'Market High'}. Notes: ${additionalNotes}`,
    });

    setSubmitted(true);
  };

  return (
    <section id="load-search" className="py-20 bg-[#060913] border-t border-b border-blue-950/70 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/50 text-xs font-mono text-sky-400">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>FIND FREIGHT FAST</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight">
            Request A Load Search
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal">
            Where is your truck sitting or heading? Tell us your pickup and delivery points, and our dispatch team will source top-paying loads instantly.
          </p>
        </div>

        {/* Load Search Form Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#091124] border border-blue-500/40 shadow-2xl relative">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white">Load Search Request Received!</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Our operations team is actively querying DAT One, Truckstop, and contracted shipper lanes for <strong className="text-white">{pickupLocation}</strong> to <strong className="text-white">{deliveryLocation}</strong>.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Submit Another Load Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Pickup & Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pickup City / State *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g. Dallas, TX or Atlanta, GA"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delivery City / State *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="e.g. Chicago, IL or Open / Any"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Row 2: Pickup Date & Equipment Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>Pickup Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Equipment Type *</span>
                  </label>
                  <select
                    value={equipmentType}
                    onChange={(e) => setEquipmentType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400"
                  >
                    <option value="Dry Van 53ft (5%)">Dry Van 53ft (5%)</option>
                    <option value="Reefer 53ft (5%)">Reefer 53ft (5%)</option>
                    <option value="Flatbed 48/53ft (5%)">Flatbed 48/53ft (5%)</option>
                    <option value="Step Deck (5%)">Step Deck (5%)</option>
                    <option value="Power Only (5%)">Power Only (5%)</option>
                    <option value="Hotshot 40ft (7%)">Hotshot 40ft (7%)</option>
                    <option value="26ft Box Truck (7%)">26ft Box Truck (7%)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Weight & Commodity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Weight className="w-3.5 h-3.5 text-purple-400" />
                    <span>Weight (Capacity)</span>
                  </label>
                  <input
                    type="text"
                    value={weightCapacity}
                    onChange={(e) => setWeightCapacity(e.target.value)}
                    placeholder="e.g. 40,000 lbs"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Commodity</span>
                  </label>
                  <input
                    type="text"
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value)}
                    placeholder="General Freight"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Row 4: Target Rate */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target Rate / Minimum Desired RPM or Gross ($)</span>
                </label>
                <input
                  type="text"
                  value={targetRate}
                  onChange={(e) => setTargetRate(e.target.value)}
                  placeholder="e.g. $3.20/mile or $2,500 total gross"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>

              {/* Row 5: Additional Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Additional Notes</span>
                </label>
                <textarea
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="e.g. Need drop & hook, or require tarp for flatbed load."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-sky-600 to-blue-500 hover:from-blue-500 hover:to-sky-400 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Submit Load Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
