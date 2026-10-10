import React from 'react';

interface CompanyLogoProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ name, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
  };

  const lower = name.toLowerCase();

  if (lower.includes('google')) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg bg-white border border-slate-100 flex items-center justify-center p-1.5 shadow-2xs shrink-0 ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
      </div>
    );
  }

  if (lower.includes('deloitte')) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg bg-black text-white font-serif font-black flex items-center justify-center tracking-tighter shrink-0 ${className}`}>
        <span>D.</span>
      </div>
    );
  }

  if (lower.includes('tcs')) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg bg-slate-900 text-white font-extrabold flex items-center justify-center tracking-tighter shrink-0 px-1 ${className}`}>
        <span className="text-[11px] font-mono font-bold tracking-tight text-white">TCS</span>
      </div>
    );
  }

  if (lower.includes('microsoft')) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg bg-white border border-slate-100 flex items-center justify-center p-1.5 shadow-2xs shrink-0 ${className}`}>
        <div className="grid grid-cols-2 gap-0.5 w-full h-full">
          <div className="bg-[#F25022] rounded-[1px]"></div>
          <div className="bg-[#7FBA00] rounded-[1px]"></div>
          <div className="bg-[#00A4EF] rounded-[1px]"></div>
          <div className="bg-[#FFB900] rounded-[1px]"></div>
        </div>
      </div>
    );
  }

  if (lower.includes('adobe')) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg bg-[#FA0F00] text-white flex items-center justify-center shrink-0 ${className}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M13.96 4H24v16h-4.32l-3.32-8.32H12.9l3.52 8.32H12.2l-2-4.88H5.66L9.62 4h4.34zm-6.14 7.6h3.58L9.62 7.12 7.82 11.6zM0 4h5.66L0 19.98V4z" />
        </svg>
      </div>
    );
  }

  if (lower.includes('amazon')) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg bg-black text-white flex items-center justify-center p-1 shrink-0 ${className}`}>
        <span className="font-sans font-bold text-base leading-none text-white tracking-tighter">a</span>
      </div>
    );
  }

  // Fallback initial
  return (
    <div className={`${sizeClasses[size]} rounded-lg bg-blue-50 text-blue-800 font-bold flex items-center justify-center border border-blue-100 shrink-0 ${className}`}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
};
