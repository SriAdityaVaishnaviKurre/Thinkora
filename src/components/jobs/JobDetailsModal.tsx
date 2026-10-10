import React from 'react';
import { 
  X, 
  ArrowLeft,
  MapPin, 
  Building2, 
  Calendar, 
  ExternalLink, 
  Bookmark, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  DollarSign,
  Clock
} from 'lucide-react';
import { JobOpportunity, ApplicationTrackingStatus } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';

interface JobDetailsModalProps {
  job: JobOpportunity;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onClose: () => void;
  onOpenTracker: (job: JobOpportunity) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  isSaved,
  onToggleSave,
  onClose,
  onOpenTracker,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-100">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-title"
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/70">
          <div className="flex items-start gap-3.5">
            <button
              onClick={onClose}
              className="mt-1 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 rounded-xl transition"
              aria-label="Back to listings"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
              {job.companyInitials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-semibold text-slate-700">{job.companyName}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">{job.type}</span>
                <span className="text-slate-300">·</span>
                <VerificationBadge status={job.verificationStatus} />
              </div>
              <h2 id="job-title" className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {job.title}
              </h2>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location} ({job.workMode})
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-900">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  {job.compensation}
                </span>
                {job.duration && (
                  <span className="flex items-center gap-1 text-slate-700 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Duration: {job.duration}
                  </span>
                )}
                {job.applicationDeadline && (
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Deadline: {job.applicationDeadline}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm leading-relaxed">
          
          {/* Demo disclaimer */}
          {job.isDemoListing && (
            <div className="p-3 rounded-lg bg-blue-50/80 border border-blue-200/80 text-xs text-blue-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Demonstration Opportunity:</strong> This listing is for academic demonstration and scam-education testing on the Thinkora platform. Real company names and recruiter credentials will be linked upon university partnership deployment.
              </div>
            </div>
          )}

          {/* Transparent Trust & Scam Credibility Checklist (Core Thinkora Feature) */}
          <section className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Thinkora Trust & Scam Credibility Evaluation
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Rule-Based Security Check
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Thinkora cross-checks employer identity, official email MX domain records, application URL destinations, and fee policies to protect students from predatory hiring scams.
            </p>

            <div className="space-y-2 pt-1">
              {job.credibilityChecks.map((check) => (
                <div
                  key={check.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs border ${
                    check.passed
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/70 border-rose-200 text-rose-950'
                  }`}
                >
                  {check.passed ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <span className="font-semibold">{check.name}:</span>{' '}
                    <span className="text-slate-700">{check.detail}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Warning Reasons (if risk detected) */}
            {job.verificationEvidence.warningReasons && job.verificationEvidence.warningReasons.length > 0 && (
              <div className="mt-3 p-3 rounded-lg bg-rose-100/80 border border-rose-300 text-rose-900 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-rose-950">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  <span>Why This Opportunity Was Flagged as Potential Risk:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
                  {job.verificationEvidence.warningReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-[11px] text-slate-500 italic pt-1">
              * Note: Automated checks are preliminary and cannot guarantee legitimacy. Legitimate companies never charge fees for onboarding, equipment, or badge checks.
            </p>
          </section>

          {/* Job Overview */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
              Role Overview
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              {job.fullDescription}
            </p>
          </section>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
                Key Responsibilities
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs sm:text-sm">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="leading-relaxed">{resp}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Eligibility & Skills */}
          {job.eligibility && job.eligibility.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
                Eligibility & Candidate Profile
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs sm:text-sm">
                {job.eligibility.map((el, i) => (
                  <li key={i} className="leading-relaxed">{el}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Required Skills */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
                Target Skills
              </h3>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {job.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200/80 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Application Instructions */}
          {job.applicationInstructions && (
            <section className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-100 text-xs space-y-1">
              <span className="font-bold text-blue-900">Application Instructions:</span>
              <p className="text-slate-700">{job.applicationInstructions}</p>
            </section>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onToggleSave(job.id)}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
              isSaved
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600 text-blue-600' : 'text-slate-500'}`} />
            <span>{isSaved ? 'Saved to Opportunities' : 'Save Opportunity'}</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              onClick={() => onOpenTracker(job)}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition border border-slate-200"
            >
              Track Application
            </button>

            {job.verificationStatus !== 'Potential Risk' ? (
              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => onOpenTracker(job)}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Apply on Company Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                disabled
                className="w-full sm:w-auto px-5 py-2.5 bg-rose-200 text-rose-800 text-xs font-bold rounded-xl cursor-not-allowed opacity-80"
                title="Application disabled due to potential scam indicators"
              >
                Application Blocked (Scam Risk)
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
