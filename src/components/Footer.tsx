import React, { useState } from 'react';
import { InfinityLogo } from './InfinityLogo';
import {
  Phone,
  Mail,
  Send,
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
  Shield,
  FileText,
  Truck,
} from 'lucide-react';

interface FooterProps {
  onOpenOwnerPortal: () => void;
  onOpenCarrierPortal: () => void;
  onOpenRegister: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenOwnerPortal,
  onOpenCarrierPortal,
  onOpenRegister,
}) => {
  const [modalPolicy, setModalPolicy] = useState<'privacy' | 'terms' | null>(null);

  return (
    <>
      <footer className="bg-[#05080F] border-t border-blue-900/40 text-slate-400 text-xs pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-blue-900/30">
            {/* Column 1 & 2: Brand Identity (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <InfinityLogo size="lg" variant="full" />
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm pt-2">
                Infinity Dispatch LLC delivers premier freight dispatching and strategic backhaul planning
                for independent owner-operators and fleet owners across North America.
                Dedicated dispatch, aggressive rate negotiation, and 100% direct carrier billing.
              </p>
              <div className="text-[11px] font-mono text-slate-400 pt-1">
                <span>Official Web: </span>
                <a
                  href="https://infinitydispatchllcusa.com"
                  className="text-sky-400 hover:underline"
                >
                  Infinitydispatchllcusa.com
                </a>
              </div>

              {/* Verified Social Media Row */}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href="https://t.me/DavidCross4899"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-sky-400 hover:text-white hover:bg-blue-600 transition-all"
                  aria-label="Telegram Channel"
                  title="Telegram: @DavidCross4899"
                >
                  <Send className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://www.linkedin.com/in/david-ca-6abb34376/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-sky-400 hover:text-white hover:bg-blue-600 transition-all"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://www.instagram.com/davidcross6563/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-pink-400 hover:text-white hover:bg-blue-600 transition-all"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://x.com/DavidCross_6563"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-white hover:bg-blue-600 transition-all font-bold text-xs"
                  aria-label="X (Twitter)"
                  title="X"
                >
                  𝕏
                </a>

                <a
                  href="https://www.facebook.com/Davidcross6563/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400 hover:text-white hover:bg-blue-600 transition-all"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://www.youtube.com/@Davidcross6563"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-red-400 hover:text-white hover:bg-blue-600 transition-all"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Column 3: Quick Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#home" className="hover:text-sky-400 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-sky-400 transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-sky-400 transition-colors">Dispatch Services</a></li>
                <li><a href="#equipment" className="hover:text-sky-400 transition-colors">Equipment Types</a></li>
                <li><a href="#how-it-works" className="hover:text-sky-400 transition-colors">How It Works</a></li>
                <li><a href="#calculator" className="hover:text-sky-400 transition-colors">Earnings Calculator</a></li>
                <li><a href="#contact" className="hover:text-sky-400 transition-colors">Contact Leadership</a></li>
              </ul>
            </div>

            {/* Column 4: Equipment Dispatched */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Equipment Handled
              </h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#equipment" className="hover:text-sky-400 transition-colors">53ft Dry Van</a></li>
                <li><a href="#equipment" className="hover:text-sky-400 transition-colors">53ft Reefer</a></li>
                <li><a href="#equipment" className="hover:text-sky-400 transition-colors">48ft/53ft Flatbed</a></li>
                <li><a href="#equipment" className="hover:text-sky-400 transition-colors">Step Deck & Double Drop</a></li>
                <li><a href="#equipment" className="hover:text-sky-400 transition-colors">Power Only Tractor Pools</a></li>
                <li><a href="#equipment" className="hover:text-sky-400 transition-colors">Hotshot (40ft Gooseneck)</a></li>
                <li><a href="#equipment" className="hover:text-sky-400 transition-colors">26ft Box Truck & Sprinter</a></li>
              </ul>
            </div>

            {/* Column 5: Leadership & Portals */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Leadership & Portals
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[11px]">Owner / Dispatch:</span>
                  <span className="font-semibold text-white">David Cross</span>
                  <a href="tel:+14095096940" className="block text-sky-400 font-mono text-[11px]">+1 (409) 509-6940</a>
                  <a href="mailto:Davidcross.vl1@gmail.com" className="block text-slate-300 hover:text-sky-400 text-[11px]">Davidcross.vl1@gmail.com</a>
                </div>

                <div className="pt-1">
                  <span className="text-slate-400 block text-[11px]">Owner / Executive:</span>
                  <span className="font-semibold text-white">Alvin</span>
                  <a href="mailto:alvin.vast@gmail.com" className="block text-slate-300 hover:text-sky-400 text-[11px]">alvin.vast@gmail.com</a>
                </div>

                <div className="pt-2 flex flex-col gap-1.5">
                  <button
                    onClick={onOpenCarrierPortal}
                    className="w-full py-1.5 px-2.5 text-[11px] text-sky-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <Truck className="w-3 h-3 text-sky-400" />
                    <span>Carrier Portal</span>
                  </button>

                  <button
                    onClick={onOpenOwnerPortal}
                    className="w-full py-1.5 px-2.5 text-[11px] text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-md text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <Shield className="w-3 h-3 text-blue-400" />
                    <span>Owner Control Center</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Legal */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              <span>© 2026 Infinity Dispatch LLC. All Rights Reserved.</span>
              <span className="mx-2">·</span>
              <span className="text-slate-400">Infinitydispatchllcusa.com</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setModalPolicy('privacy')}
                className="hover:text-slate-300 transition-colors underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setModalPolicy('terms')}
                className="hover:text-slate-300 transition-colors underline cursor-pointer"
              >
                Terms and Conditions
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modal */}
      {modalPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#0B1222] border border-blue-500/40 rounded-2xl p-6 sm:p-8 max-h-[80vh] overflow-y-auto text-xs text-slate-300 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-blue-900/40 pb-3">
              <h3 className="text-lg font-bold text-white">
                {modalPolicy === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions'}
              </h3>
              <button
                onClick={() => setModalPolicy(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                ✕
              </button>
            </div>

            {modalPolicy === 'privacy' ? (
              <div className="space-y-3 leading-relaxed">
                <p><strong>Infinity Dispatch LLC Privacy Notice (2026):</strong></p>
                <p>We respect the confidentiality of all carrier operational data, MC/DOT numbers, driver logs, certificates of insurance, and rate confirmations.</p>
                <p>1. Information Collected: Carrier company name, contact numbers, email addresses, authority documents, and route preferences are used solely for the coordination of freight dispatching services.</p>
                <p>2. Broker Interactions: Your carrier packet and certificates of insurance are transmitted strictly to verified freight brokers to establish setup agreements for authorized loads.</p>
                <p>3. No Third-Party Resale: We never sell or share carrier contact details or lane data with advertisers or non-affiliated third parties.</p>
              </div>
            ) : (
              <div className="space-y-3 leading-relaxed">
                <p><strong>Infinity Dispatch LLC Terms & Conditions (2026):</strong></p>
                <p>1. Carrier Independent Status: The carrier operates as an independent contractor maintaining complete authority and ownership over their tractor, trailer, and federal motor carrier safety compliance.</p>
                <p>2. No Forced Dispatch: The carrier reserves full right to accept or decline any load offered by Infinity Dispatch LLC.</p>
                <p>3. Direct Broker Payment: Rate confirmations are issued directly between the broker and the carrier. Infinity Dispatch LLC does not act as a broker or collection agency.</p>
                <p>4. Dispatch Fee: The agreed dispatch service fee (standard 7% unless custom contracted) applies to booked freight confirmed by the carrier.</p>
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setModalPolicy(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
