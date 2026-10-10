import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  screenTitle?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ 
  children, 
  className = '',
  screenTitle 
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {screenTitle && (
        <span className="text-xs font-semibold text-slate-500 mb-2 font-mono">
          {screenTitle}
        </span>
      )}
      <div className="w-[300px] h-[610px] bg-slate-900 rounded-[44px] p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-slate-800 relative flex flex-col shrink-0 select-none">
        
        {/* Outer Phone Bezel & Screen Glass */}
        <div className="w-full h-full bg-white rounded-[36px] overflow-hidden flex flex-col relative">
          
          {/* iOS Status Bar */}
          <div className="h-9 px-6 flex items-center justify-between text-slate-900 text-[11px] font-semibold tracking-tight shrink-0 select-none z-30 bg-transparent">
            <span>9:41</span>
            
            {/* Dynamic Island / Notch Pill */}
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />

            <div className="flex items-center gap-1.5 text-slate-900">
              <Signal className="w-3 h-3 fill-current" />
              <Wifi className="w-3 h-3" />
              <div className="w-5 h-2.5 border border-slate-900 rounded-[2px] p-0.5 flex items-center">
                <div className="w-full h-full bg-slate-900 rounded-[0.5px]"></div>
              </div>
            </div>
          </div>

          {/* Screen Content Viewport (Scrollable with hidden scrollbar) */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col relative text-slate-900">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="h-4 flex items-center justify-center shrink-0 bg-white">
            <div className="w-28 h-1 bg-slate-900/80 rounded-full" />
          </div>

        </div>

      </div>
    </div>
  );
};
