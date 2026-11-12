import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  MessageCircle,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'rates' | 'paperwork' | 'operations';
}

export const FAQSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const faqs: FAQItem[] = [
    {
      question: 'Do you force dispatch?',
      answer:
        'Absolutely NOT. You are the owner of your truck and business. You maintain 100% control and final decision on every load. If a load or lane does not meet your expectations, we keep searching until we find one you love.',
      category: 'operations',
    },
    {
      question: 'What equipment do you dispatch?',
      answer:
        'We dispatch all major freight configurations: 53ft & 48ft Dry Van (5%), 26ft Box Truck with Liftgate/Dock-High (7%), Power Only (5%), Flatbed (5%), Step Deck (5%), 40ft Hotshot Gooseneck (7%), and Refrigerated / Reefer trailers (5%).',
      category: 'general',
    },
    {
      question: 'How do you get paid for your dispatch service?',
      answer:
        'We charge a simple, transparent flat percentage fee per load (5% for standard equipment, 7% for box trucks & hotshots). There are zero upfront charges, zero weekly minimums, and zero setup fees. You get paid 100% directly by the freight broker or your factoring company, and we invoice our fee only after the load is safely delivered.',
      category: 'rates',
    },
    {
      question: 'What states do you cover?',
      answer:
        'We provide complete nationwide coverage across all 48 continental United States. Whether you prefer running regional loops (such as the Texas Triangle, Midwest, or Southeast) or long-haul transcontinental cross-country freight, our dispatchers coordinate continuous high-RPM lanes.',
      category: 'operations',
    },
    {
      question: 'How quickly can we start dispatching after signing up?',
      answer:
        'You can start rolling in as little as 24 to 48 hours. Once you submit your MC Certificate, W-9, and Certificate of Insurance (COI), our onboarding team verifies your credentials, sets up broker profiles, and begins hunting for top-paying freight immediately.',
      category: 'general',
    },
    {
      question: 'Do you work with new MC authorities?',
      answer:
        'Yes! We specialize in assisting new MC authorities. We understand the hurdles of authorities under 30, 60, or 90 days. We maintain relationships with hundreds of vetted brokers and factoring companies who partner with newer carriers, keeping your wheels turning while your authority seasons.',
      category: 'general',
    },
    {
      question: 'What documents do I need to sign up with Infinity Dispatch LLC?',
      answer:
        'To get dispatched, we only require: 1) Active FMCSA MC Authority Certificate, 2) Signed IRS W-9 form, 3) Certificate of Insurance (COI) with $100,000 Cargo and $1,000,000 Auto Liability naming Infinity Dispatch LLC as certificate holder, and 4) Notice of Assignment (NOA) or voided check for factoring settlements.',
      category: 'paperwork',
    },
    {
      question: 'Do you assist with Factoring Companies and Paperwork?',
      answer:
        'Yes, 100%. We handle the administrative heavy lifting so you can focus strictly on driving. We complete all broker carrier setup packets, request and attach COIs, confirm rate confirmations, verify Proof of Delivery (POD/BOL), and submit clean billing packets directly to your factor for rapid same-day funding.',
      category: 'paperwork',
    },
    {
      question: 'How do you handle Detention, Layover, and TONU (Truck Ordered Not Used)?',
      answer:
        'We aggressively fight for every dollar you are owed. If a shipper or receiver delays you beyond the standard 2-hour free time window, we immediately file written detention notices with timestamped gate receipts. We secure TONU payouts if a broker cancels after dispatch and negotiate layover compensation if you are delayed overnight.',
      category: 'rates',
    },
    {
      question: 'Is there a long-term contract or hidden cancellation fee?',
      answer:
        'Never. Our dispatch agreement is month-to-month and load-by-load. We earn your business on every single load. There are no long-term lock-ins, no exclusivity penalties, and zero cancellation fees. You stay with Infinity Dispatch LLC because we consistently boost your revenue, not because of a piece of paper.',
      category: 'general',
    },
    {
      question: 'Can I request specific lanes or home-time schedules?',
      answer:
        'Yes, absolutely. That is the core of dedicated personalized dispatch. Before we book a single load, your assigned dispatcher reviews your financial targets, preferred freight corridors, preferred operating regions, and exact weekly home-time dates.',
      category: 'operations',
    },
    {
      question: 'How do I contact David or the dispatch team directly?',
      answer:
        'You can reach company owner David Cross directly via phone or SMS at +1 (409) 509-6940, by email at Davidcross.vl1@gmail.com, or on Telegram @DavidCross4899. Our dispatch team is active 24/7/365 to handle your road check calls and urgent freight needs.',
      category: 'general',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="faq" className="py-20 bg-[#070B14] border-t border-b border-blue-950/70 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/50 text-xs font-mono text-sky-400">
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>CLEAR ANSWERS TO YOUR QUESTIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Have questions about getting dispatched with Infinity Dispatch LLC? Here is everything you need to know.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FAQs (e.g. force dispatch, new authority, payment, equipment)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#0A1224] border border-blue-800/50 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 shadow-xl transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl transition-all border overflow-hidden ${
                    isOpen
                      ? 'bg-[#0D162B] border-sky-500/60 shadow-xl shadow-blue-950/40'
                      : 'bg-[#091122] border-blue-900/40 hover:border-blue-700 hover:bg-[#0B1428]'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="text-sm sm:text-base font-bold text-white leading-snug">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                        isOpen
                          ? 'bg-sky-500 text-slate-950 border-sky-400 rotate-180'
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-blue-900/30 animate-in fade-in duration-200">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 rounded-2xl bg-[#091122] border border-blue-900/40">
              <p className="text-slate-400 text-sm">No answers match your search term "{searchTerm}".</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-3 text-xs font-bold text-sky-400 hover:underline"
              >
                Reset FAQ search
              </button>
            </div>
          )}
        </div>

        {/* Direct Owner Consultation CTA Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0C152B] via-[#101E42] to-[#0C152B] border border-blue-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest block">
              HAVE A SPECIFIC QUESTION NOT LISTED HERE?
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Speak directly with David (Company Owner) right now.
            </h3>
            <p className="text-xs text-slate-300">
              Direct owner & dispatch contact: No bots, no hold music, no runarounds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+14095096940"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-emerald-300" />
              <span>Call David ((409) 509-6940)</span>
            </a>

            <a
              href="https://t.me/DavidCross4899"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
