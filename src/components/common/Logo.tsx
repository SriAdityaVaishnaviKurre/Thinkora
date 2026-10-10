import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'horizontal' | 'badge' | 'icon-only';
  orientation?: 'horizontal' | 'vertical';
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showTagline = false,
  variant = 'horizontal',
  orientation = 'horizontal',
  theme = 'light'
}) => {
  // Official Thinkora logo asset located in public directory (reliable in both dev and production)
  const logoSrc = "/thinkora-logo.jpg";

  if (variant === 'badge' || orientation === 'vertical') {
    const badgeDimensions = {
      sm: 'w-16 h-16',
      md: 'w-24 h-24',
      lg: 'w-32 h-32',
      xl: 'w-40 h-40',
    };

    return (
      <div className={`flex flex-col items-center shrink-0 ${className}`}>
        <div className={`relative rounded-2xl overflow-hidden shadow-lg border border-slate-900/10 bg-[#0B1B3D] shrink-0 p-0.5 ${badgeDimensions[size]}`}>
          <img
            src={logoSrc}
            alt="Thinkora Official Logo"
            className="w-full h-full object-cover rounded-xl"
            referrerPolicy="no-referrer"
            loading="eager"
          />
        </div>
        <span className={`font-extrabold tracking-tight mt-2 text-slate-900 ${size === 'xl' ? 'text-2xl' : 'text-xl'}`}>
          Thinkora
        </span>
        {showTagline && (
          <span className="mt-1 text-xs font-semibold text-slate-500 tracking-tight text-center">
            Real Opportunities. Real People. Real Growth.
          </span>
        )}
      </div>
    );
  }

  if (variant === 'icon-only') {
    const iconDimensions = {
      sm: 'w-7 h-7',
      md: 'w-9 h-9',
      lg: 'w-11 h-11',
      xl: 'w-14 h-14',
    };

    return (
      <div 
        className={`relative rounded-xl overflow-hidden shadow-xs border border-slate-900/15 bg-[#0B1B3D] shrink-0 flex items-center justify-center ${iconDimensions[size]} ${className}`}
      >
        <img
          src={logoSrc}
          alt="Thinkora Emblem"
          className="w-full h-full object-cover scale-105"
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </div>
    );
  }

  // Standard Horizontal Layout: Emblem + Full Wordmark in ONE Stable Brand Container
  const iconDimensions = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
    xl: 'w-14 h-14 rounded-2xl',
  };

  const textDimensions = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const taglineColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-500';

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 shrink-0 select-none ${className}`}>
      {/* Official Thinkora Crest Emblem */}
      <div 
        className={`relative overflow-hidden bg-[#0a183d] border border-blue-900/30 shadow-xs shrink-0 flex items-center justify-center ${iconDimensions[size]}`}
        style={{ minWidth: size === 'sm' ? '32px' : size === 'md' ? '36px' : '44px' }}
      >
        <img
          src={logoSrc}
          alt="Thinkora Emblem"
          className="w-full h-full object-cover scale-105"
          referrerPolicy="no-referrer"
          loading="eager"
        />
        {/* Subtle decorative gold pip indicator */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 pointer-events-none">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>
      </div>

      {/* Full "Thinkora" Wordmark */}
      <div className="flex flex-col justify-center shrink-0 min-w-0">
        <span className={`font-extrabold tracking-tight leading-none whitespace-nowrap ${textColor} ${textDimensions[size]}`}>
          Thinkora
        </span>
        {showTagline && (
          <span className={`text-[10px] font-semibold tracking-tight mt-1 whitespace-nowrap leading-none ${taglineColor}`}>
            Real Opportunities. Real People. Real Growth.
          </span>
        )}
      </div>
    </div>
  );
};
