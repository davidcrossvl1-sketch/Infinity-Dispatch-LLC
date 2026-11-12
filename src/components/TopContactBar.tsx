import React from 'react';
import {
  Phone,
  Mail,
  Send,
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
  Shield,
  UserCheck,
} from 'lucide-react';

interface TopContactBarProps {
  onOpenOwnerPortal?: () => void;
  onOpenRegister?: () => void;
  onOpenGmailModal?: () => void;
}

export const TopContactBar: React.FC<TopContactBarProps> = ({
  onOpenOwnerPortal,
  onOpenRegister,
  onOpenGmailModal,
}) => {
  return (
    <>
      {/* 0. Top Stylish Highlighted Brand Announcement Ribbon */}
      <div className="bg-gradient-to-r from-[#030611] via-[#091738] to-[#030611] border-b border-sky-400/40 py-1.5 px-4 text-center relative overflow-hidden shadow-[0_4px_25px_rgba(2,132,199,0.25)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-400/15 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 relative z-10">
          <div className="hidden md:flex items-center gap-2">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-sky-400/60" />
            <span className="text-[10px] font-mono text-sky-300 font-bold tracking-widest uppercase">
              US DOT / FMCSA COMPLIANT
            </span>
          </div>

          <div className="inline-flex items-center gap-2.5 px-4 py-0.5 rounded-full bg-blue-950/80 border border-sky-400/60 shadow-[0_0_20px_rgba(56,189,248,0.45)] backdrop-blur-md mx-auto md:mx-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
            </span>
            <span className="font-display font-black tracking-[0.24em] text-xs sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.7)] uppercase">
              INFINITY DISPATCH LLC
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-mono font-extrabold uppercase tracking-widest text-white bg-gradient-to-r from-blue-600 to-sky-500 rounded-md shadow-sm border border-sky-300/40">
              OFFICIAL DISPATCH
            </span>
          </div>

          {/* Quick Top Email Dispatch, Admin Login & Get Started Access */}
          <div className="flex items-center gap-2">
            {onOpenGmailModal && (
              <button
                onClick={onOpenGmailModal}
                className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-sky-200 hover:text-white bg-sky-500/20 hover:bg-sky-500/35 border border-sky-400/60 flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                title="Google & Gmail Dispatch Authenticator (OAuth 2.0 Rate Cons)"
              >
                <Mail className="w-3 h-3 text-sky-400" />
                <span className="hidden sm:inline">Gmail Dispatch</span>
                <span className="sm:hidden">Email</span>
                <span className="px-1 py-0.2 rounded bg-sky-400/25 text-[8px] font-bold text-sky-300 border border-sky-400/50">
                  OAuth 2.0
                </span>
              </button>
            )}

            {onOpenOwnerPortal && (
              <button
                onClick={onOpenOwnerPortal}
                className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 flex items-center gap-1 cursor-pointer transition-all"
                title="Admin Login Portal"
              >
                <Shield className="w-3 h-3 text-amber-400" />
                <span>Admin Login</span>
              </button>
            )}

            {onOpenRegister && (
              <button
                onClick={onOpenRegister}
                className="hidden sm:flex px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-white bg-blue-600 hover:bg-blue-500 items-center gap-1 cursor-pointer transition-all"
              >
                <UserCheck className="w-3 h-3 text-white" />
                <span>Get Started</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#05080F] border-b border-blue-900/40 text-xs text-slate-300 py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Contact direct numbers & emails */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="tel:+14095096940"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-sky-400 transition-colors font-mono tracking-tight"
              title="Call David Cross - Infinity Dispatch LLC"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>+1 (409) 509-6940</span>
            </a>

            <div className="inline-flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenGmailModal}
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-sky-400 transition-colors cursor-pointer"
                title="Launch Google & Gmail Dispatch Authenticator"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Davidcross.vl1@gmail.com</span>
                <span className="sm:hidden">David Cross</span>
              </button>
              {onOpenGmailModal && (
                <button
                  type="button"
                  onClick={onOpenGmailModal}
                  className="px-1.5 py-0.2 rounded bg-sky-500/20 hover:bg-sky-500/30 text-[9px] font-mono text-sky-300 border border-sky-400/40 transition-colors cursor-pointer hidden md:inline-block"
                  title="Open Live Gmail Composer"
                >
                  OAuth Dispatch
                </button>
              )}
            </div>

            <a
              href="mailto:alvin.vast@gmail.com"
              className="hidden md:inline-flex items-center gap-1.5 text-slate-300 hover:text-sky-400 transition-colors"
              title="Email Alvin"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>alvin.vast@gmail.com</span>
            </a>

            <a
              href="https://t.me/DavidCross4899"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sky-300 hover:text-sky-200 transition-colors"
              title="Telegram Direct Channel"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono">@DavidCross4899</span>
            </a>
          </div>

          {/* Real verified social media links */}
          <div className="flex items-center gap-3">
            <span className="text-slate-500 hidden lg:inline text-[11px] uppercase tracking-wider">
              Verified Profiles:
            </span>

            {/* Telegram */}
            <a
              href="https://t.me/DavidCross4899"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-sky-400 hover:bg-blue-950/60 transition-colors"
              aria-label="Telegram"
              title="Telegram"
            >
              <Send className="w-3.5 h-3.5" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/david-ca-6abb34376/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-sky-400 hover:bg-blue-950/60 transition-colors"
              aria-label="LinkedIn Profile"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/davidcross6563/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-pink-400 hover:bg-blue-950/60 transition-colors"
              aria-label="Instagram Profile"
              title="Instagram Profile"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com/DavidCross_6563"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-950/60 transition-colors font-bold text-xs"
              aria-label="X (Twitter) Profile"
              title="X (Twitter) Profile"
            >
              𝕏
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/Davidcross6563/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-950/60 transition-colors"
              aria-label="Facebook Profile"
              title="Facebook Profile"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@Davidcross6563"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-blue-950/60 transition-colors"
              aria-label="YouTube Channel"
              title="YouTube Channel"
            >
              <Youtube className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
