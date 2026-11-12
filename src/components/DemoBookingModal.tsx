import React, { useState } from 'react';
import { storage } from '../services/storage';
import { EquipmentType } from '../types';
import {
  Calendar,
  Clock,
  User,
  Building,
  Mail,
  Phone,
  CheckCircle2,
  X,
  Truck,
  Sparkles,
} from 'lucide-react';

interface DemoBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoBookingModal: React.FC<DemoBookingModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferredTime: '10:00 AM CST',
    equipmentType: 'Dry Van' as EquipmentType,
    truckCount: 1,
    assignedOwner: 'David Cross' as 'David Cross' | 'Alvin',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.companyName || !formData.phone) return;

    storage.submitDemoBooking({
      fullName: formData.fullName,
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      equipmentType: formData.equipmentType,
      truckCount: Number(formData.truckCount),
      assignedOwner: formData.assignedOwner,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#091122] border border-blue-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-blue-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-sky-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Schedule 1-on-1 Dispatch Demo</h3>
              <p className="text-xs text-slate-400">Walk through live load rates and broker setup</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-3 text-emerald-400 font-mono">
            <CheckCircle2 className="w-12 h-12 mx-auto" />
            <h4 className="text-xl font-bold text-white">Demo Confirmed!</h4>
            <p className="text-xs text-slate-300">
              Assigned directly to <strong>{formData.assignedOwner}</strong>. We will contact you at {formData.phone} on {formData.preferredDate}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Jason Miller"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Miller Trans Logistics"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. (314) 555-8902"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. jason@millertrans.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Time</label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                >
                  <option value="09:00 AM CST">09:00 AM CST (Morning)</option>
                  <option value="11:30 AM CST">11:30 AM CST (Mid-Day)</option>
                  <option value="02:00 PM CST">02:00 PM CST (Afternoon)</option>
                  <option value="04:30 PM CST">04:30 PM CST (Late Afternoon)</option>
                </select>
              </div>
            </div>

            {/* Select Owner */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Dispatch Executive:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, assignedOwner: 'David Cross' })}
                  className={`p-2.5 rounded-xl border text-xs text-left cursor-pointer transition-all ${
                    formData.assignedOwner === 'David Cross'
                      ? 'bg-blue-600/30 border-blue-500 text-white ring-1 ring-blue-500 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  David Cross (Business Dev)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, assignedOwner: 'Alvin' })}
                  className={`p-2.5 rounded-xl border text-xs text-left cursor-pointer transition-all ${
                    formData.assignedOwner === 'Alvin'
                      ? 'bg-blue-600/30 border-blue-500 text-white ring-1 ring-blue-500 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  Alvin (Operations Director)
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span>Confirm Demo Booking</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
