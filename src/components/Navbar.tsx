import React, { useState } from 'react';
import { InfinityLogo } from './InfinityLogo';
import { Menu, X, Shield, Truck, UserCheck, KeyRound, Mail } from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
  onOpenCarrierPortal: () => void;
  onOpenOwnerPortal: () => void;
  onOpenGmailModal?: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRegister,
  onOpenCarrierPortal,
  onOpenOwnerPortal,
  onOpenGmailModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Carrier Sign-Up', href: '#carrier-signup' },
    { label: 'Rates & Fees', href: '#equipment-rates' },
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Equipment', href: '#equipment' },
    { label: 'Calculator', href: '#calculator' },
    { label: 'Time Zones', href: '#time-zones' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070B14]/95 backdrop-blur-md border-b border-blue-900/40 transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-6 h-20">
          
          {/* Zone 1: Brand Wordmark / Logo */}
          <a
            href="#home"
            className="flex items-center group whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            <InfinityLogo size="md" variant="full" />
          </a>

          {/* Zone 2: Navigation Links (Adaptive responsive spacing) */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-7 text-xs 2xl:text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-sky-400 hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Quick Portals (ALWAYS SHOWING Admin Login & Get Started) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Gmail Dispatch Button */}
            {onOpenGmailModal && (
              <button
                onClick={onOpenGmailModal}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-sky-200 hover:text-white bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-sky-950/40"
                title="Google & Gmail Dispatch Authenticator (OAuth 2.0)"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Gmail Dispatch</span>
              </button>
            )}

            {/* Carrier Portal Link (hidden on tiny screens, visible on md+) */}
            <button
              onClick={onOpenCarrierPortal}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Access Carrier Portal"
            >
              <Truck className="w-3.5 h-3.5 text-sky-400" />
              <span>Carrier Portal</span>
            </button>

            {/* Admin Login Button (ALWAYS VISIBLE & PROMINENT ON ALL SCREEN SIZES) */}
            <button
              onClick={onOpenOwnerPortal}
              className="px-3 sm:px-3.5 py-2 text-xs font-bold text-amber-300 hover:text-white bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg transition-all whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 shadow-sm shadow-amber-950/40 cursor-pointer"
              title="Admin Login (David Cross & Alvin Portal)"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Admin Login</span>
            </button>

            {/* Get Started Button (ALWAYS VISIBLE & PROMINENT ON ALL SCREEN SIZES) */}
            <button
              onClick={onOpenRegister}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-sky-600 to-blue-500 hover:from-blue-500 hover:to-sky-400 rounded-lg shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer ring-1 ring-sky-400/40"
              title="Start Onboarding Application"
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>Get Started</span>
            </button>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0A101D] border-b border-blue-900/60 px-5 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2 pt-2 border-b border-slate-800 pb-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-sm font-medium text-slate-200 hover:text-sky-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full py-2.5 text-center text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-sky-500 rounded-lg shadow-md flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Get Started / Carrier Registration</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCarrierPortal();
                }}
                className="py-2.5 px-3 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 rounded-lg text-center inline-flex items-center justify-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5 text-sky-400" />
                <span>Carrier Portal</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOwnerPortal();
                }}
                className="py-2.5 px-3 text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/40 rounded-lg text-center inline-flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Login</span>
              </button>
            </div>

            {onOpenGmailModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenGmailModal();
                }}
                className="w-full py-2.5 px-3 text-xs font-semibold text-sky-200 bg-sky-500/15 border border-sky-400/40 rounded-lg text-center inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Gmail Dispatch Authenticator (OAuth 2.0)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
