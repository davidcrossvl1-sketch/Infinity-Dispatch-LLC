import React, { useState } from 'react';

interface InfinityLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'mark-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const InfinityLogo: React.FC<InfinityLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const [imageLoaded, setImageLoaded] = useState(true);

  const sizeMap = {
    sm: { imgH: 'h-8 sm:h-9', text: 'text-sm sm:text-base', sub: 'text-[8px] sm:text-[9px]' },
    md: { imgH: 'h-10 sm:h-12', text: 'text-base sm:text-lg lg:text-xl', sub: 'text-[9px] sm:text-[10px]' },
    lg: { imgH: 'h-14 sm:h-16', text: 'text-xl sm:text-2xl', sub: 'text-[10px] sm:text-xs' },
    xl: { imgH: 'h-16 sm:h-20', text: 'text-2xl sm:text-3xl', sub: 'text-xs sm:text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* Official Infinity Dispatch LLC Logo with Heart Highway, Truck & Infinity Symbol */}
      {imageLoaded ? (
        <img
          src="/assets/aistudio/--INFINITY_DISPATCH_LLC--_124c467f.png"
          alt="Infinity Dispatch LLC Official Logo"
          className={`${currentSize.imgH} w-auto object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.35)] hover:brightness-110 transition-all`}
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.endsWith('/infinity-logo-metallic.png')) {
              target.src = '/infinity-logo-metallic.png';
            } else {
              setImageLoaded(false);
            }
          }}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-sky-500/50 flex items-center justify-center text-sky-400 font-bold text-xl">
          ∞
        </div>
      )}

      {/* Highlighted & Stylish Brand Typography */}
      {variant !== 'mark-only' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-sky-400 drop-shadow-[0_0_18px_rgba(56,189,248,0.55)] uppercase ${currentSize.text}`}
            >
              INFINITY DISPATCH
            </span>
            <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-600 to-sky-500 text-white font-mono text-[9px] sm:text-[10px] font-black tracking-widest shadow-md shadow-blue-500/40 border border-sky-300/40">
              LLC
            </span>
          </div>
          <span
            className={`font-mono tracking-[0.2em] text-sky-300 font-bold uppercase flex items-center gap-1.5 ${currentSize.sub}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Reliable Dispatch · Infinite Service</span>
          </span>
        </div>
      )}
    </div>
  );
};
