import React from 'react';
import { ShieldCheck, Clock, HelpCircle, AlertTriangle } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface VerificationBadgeProps {
  status: VerificationStatus;
  showIcon?: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  showIcon = true,
  className = '',
}) => {
  switch (status) {
    case 'Verified':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-md whitespace-nowrap ${className}`}
          title="Verified Opportunity: Employer identity and recruiter domain confirmed via Thinkora Trust Review"
        >
          {showIcon && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />}
          <span>Verified</span>
        </span>
      );
    case 'Pending Review':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 rounded-md whitespace-nowrap ${className}`}
          title="Pending Review: Employer submission is currently undergoing company registry verification"
        >
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />}
          <span>Pending Review</span>
        </span>
      );
    case 'Unable to Verify':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-md whitespace-nowrap ${className}`}
          title="Unable to Verify: Business registration or recruiter identity could not be independently confirmed"
        >
          {showIcon && <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />}
          <span>Unable to Verify</span>
        </span>
      );
    case 'Potential Risk':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-md whitespace-nowrap ${className}`}
          title="Potential Risk Flagged: Automated & editorial checks detected scam indicators (e.g., upfront payment, free webmail)"
        >
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" aria-hidden="true" />}
          <span>Potential Risk</span>
        </span>
      );
    default:
      return null;
  }
};
