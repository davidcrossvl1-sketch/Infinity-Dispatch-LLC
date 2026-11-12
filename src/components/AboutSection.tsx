import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Send,
  MessageCircle,
  Maximize2,
  X,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleScrollToSignup = () => {
    const signupEl = document.getElementById('carrier-signup');
    if (signupEl) {
      signupEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="py-16 sm:py-20 bg-[#060913] border-t border-b border-blue-950/70 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Pill Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/90 border border-blue-700/60 text-xs font-mono text-sky-400 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wider uppercase">ABOUT INFINITY DISPATCH LLC</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white tracking-tight">
            Your Trusted Partner On The American Highway
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-normal">
            Dedicated to empowering independent truckers, owner-operators, and small fleet owners with top-paying loads, hassle-free paperwork, and 24/7 personalized dispatch support.
          </p>
        </div>

        {/* Master Pristine Graphic (Not Adjusted, Not Cropped, 100% Natural Aspect Ratio) */}
        <div className="relative group rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-blue-500/40 shadow-2xl bg-[#091124]">
          <img
            src="/assets/aistudio/image_7adf96af.png"
            alt="Infinity Dispatch LLC - Your Trusted Partner On The American Highway"
            className="w-full h-auto object-contain block mx-auto cursor-pointer transition-transform duration-300 group-hover:scale-[1.005]"
            onClick={() => setIsZoomed(true)}
            referrerPolicy="no-referrer"
          />

          {/* Click to Zoom Overlay Indicator on Hover */}
          <button
            onClick={() => setIsZoomed(true)}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-blue-500/40 text-sky-300 text-xs font-mono flex items-center gap-1.5 backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full View</span>
          </button>
        </div>

        {/* Interactive Quick-Connect Action Bar Directly Connecting with David Cross */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[#091122] border border-blue-800/50 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-white">
                  Direct Owner Onboarding · David Cross
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  ONLINE NOW
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Contact David directly for rapid carrier setup, lane matching, and 100% transparent dispatch rates.
              </p>
            </div>

            {/* Direct Interactive Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="tel:+14095096940"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-blue-700/60 text-white text-xs font-mono font-bold flex items-center gap-2 shadow transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call: (409) 509-6940</span>
              </a>

              <a
                href="mailto:Davidcross.vl1@gmail.com"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-blue-700/60 text-white text-xs font-mono font-bold flex items-center gap-2 shadow transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Davidcross.vl1@gmail.com</span>
              </a>

              <a
                href="https://t.me/DavidCross4899"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-[#229ED9]/20 hover:bg-[#229ED9]/30 border border-[#229ED9]/50 text-sky-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#229ED9]" />
                <span>Telegram</span>
              </a>

              <a
                href="https://wa.me/14095096940"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={handleScrollToSignup}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Sign Up Today</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Security & Direct Payout Reassurance */}
          <div className="pt-3 border-t border-blue-900/40 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>100% Direct Broker Pay · 48 States Coverage · 24/7 Dedicated Support</span>
            </span>
            <span className="text-emerald-400 font-bold">
              5% - 7% Transparent Low Dispatch Fees · No Forced Dispatch
            </span>
          </div>
        </div>

      </div>

      {/* Full-Screen Zoom Lightbox Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-6xl w-full max-h-[92vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-12 right-0 p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
              title="Close Full View"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src="/assets/aistudio/image_7adf96af.png"
              alt="Infinity Dispatch LLC - Full High Definition"
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl border border-blue-500/50 shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </section>
  );
};
