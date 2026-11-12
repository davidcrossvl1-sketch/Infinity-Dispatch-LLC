import React, { useState } from 'react';
import { storage } from '../services/storage';
import {
  Phone,
  Mail,
  Send,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  User,
  Sparkles,
} from 'lucide-react';

interface ContactSectionProps {
  onOpenDemo?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenDemo }) => {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mcNumber, setMcNumber] = useState('');
  const [equipmentType, setEquipmentType] = useState('Dry Van (5%)');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    storage.submitInquiry({
      fullName: name,
      companyName,
      email,
      phone,
      subject: `Direct Inquiry from ${name} (MC: ${mcNumber || 'N/A'}, Eq: ${equipmentType})`,
      message: `${message}\n\nEquipment: ${equipmentType}\nMC#: ${mcNumber || 'None'}\nPhone: ${phone}`,
    });

    storage.logEmail({
      to: 'Davidcross.vl1@gmail.com',
      subject: `[Website Message] ${name} (${companyName || 'Owner Operator'})`,
      body: `Carrier: ${name}\nCompany: ${companyName}\nPhone: ${phone}\nEmail: ${email}\nMC#: ${mcNumber}\nEquipment: ${equipmentType}\n\nMessage:\n${message}`,
      type: 'Live Inquiry',
    });

    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-[#070B14] border-t border-b border-blue-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/50 text-xs font-mono text-sky-400">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>DIRECT LEADERSHIP & DISPATCH ACCESS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight">
            Get In Touch With Infinity Dispatch
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Have a question about load rates, setup, or fleet management? Reach out to David directly or send us a message below.
          </p>
        </div>

        {/* Content 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: David & HQ Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* David Owner Card */}
            <div className="p-6 rounded-3xl bg-[#091124] border border-blue-500/40 shadow-xl space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-display font-black text-2xl shadow-lg shrink-0">
                  D
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">David</h3>
                  <div className="text-xs font-bold text-sky-400">
                    Company Owner • Infinity Dispatch LLC
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                    Nationwide Commercial Dispatch
                  </span>
                </div>
              </div>

              {/* Direct Info List */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-blue-900/40 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Phone / Cell
                  </span>
                  <a
                    href="tel:+14095096940"
                    className="font-mono text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>(409) 509-6940</span>
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-blue-900/40 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Email Address
                  </span>
                  <a
                    href="mailto:Davidcross.vl1@gmail.com"
                    className="font-mono text-xs text-sky-400 hover:text-sky-300 flex items-center gap-2 truncate"
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="truncate">Davidcross.vl1@gmail.com</span>
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-blue-900/40 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Office Hours
                  </span>
                  <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>24/7 Dispatch Support</span>
                  </div>
                </div>
              </div>

              {onOpenDemo && (
                <button
                  onClick={onOpenDemo}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Direct 1-on-1 Consultation</span>
                </button>
              )}
            </div>

            {/* USA Logistics HQ Terminal Card */}
            <div className="p-6 rounded-3xl bg-[#091124] border border-blue-900/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950 flex items-center justify-center text-sky-400 border border-blue-800/60">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">USA Dispatch Logistics Network HQ</h4>
                  <span className="text-xs text-emerald-400 font-mono font-bold block">
                    All 48 States Active · 48 State Dispatch Coverage
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                Headquartered in Texas, Dispatching Nationwide. We coordinate spot and dedicated contracted freight across all American highways.
              </p>

              <div className="pt-1">
                <a
                  href="tel:+14095096940"
                  className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-white transition-colors"
                >
                  <span>Contact H.Q. Dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Send Us A Message Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-[#091124] border border-blue-500/40 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Delivered to David Cross</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Thank you, <strong className="text-white">{name}</strong>. Your inquiry has been sent directly to company leadership. David or a senior dispatcher will respond within 15 minutes.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="pb-3 border-b border-blue-900/30">
                  <h3 className="text-xl font-bold text-white">Send Us A Message</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill out the form below and David or a senior dispatcher will respond within 15 minutes.
                  </p>
                </div>

                {/* Name & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. David Miller"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Miller Trucking LLC"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. driver@millertrucking.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. (409) 555-0199"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400 font-mono"
                    />
                  </div>
                </div>

                {/* MC & Equipment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      MC Number (If Applicable)
                    </label>
                    <input
                      type="text"
                      value={mcNumber}
                      onChange={(e) => setMcNumber(e.target.value)}
                      placeholder="e.g. MC-987654"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Equipment Type
                    </label>
                    <select
                      value={equipmentType}
                      onChange={(e) => setEquipmentType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                    >
                      <option value="Dry Van (5%)">Dry Van (5%)</option>
                      <option value="Power Only (5%)">Power Only (5%)</option>
                      <option value="Flatbed (5%)">Flatbed (5%)</option>
                      <option value="Step Deck (5%)">Step Deck (5%)</option>
                      <option value="Hotshot (7%)">Hotshot (7%)</option>
                      <option value="Reefer (5%)">Reefer (5%)</option>
                      <option value="Box Truck (7%)">Box Truck (7%)</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Message or Inquiry *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your truck setup, current lanes, or dispatch needs..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-sky-600 to-blue-500 hover:from-blue-500 hover:to-sky-400 shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message To David</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
