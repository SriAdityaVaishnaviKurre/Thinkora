import React, { useState } from 'react';
import { X, Check, Briefcase, Calendar, FileText } from 'lucide-react';
import { JobOpportunity, ApplicationTrackingStatus, JobApplicationRecord } from '../../types';
import { ThinkoraService } from '../../services/api';

interface ApplicationTrackerModalProps {
  job: JobOpportunity;
  existingRecord?: JobApplicationRecord;
  onSaved: (record: JobApplicationRecord) => void;
  onClose: () => void;
}

export const ApplicationTrackerModal: React.FC<ApplicationTrackerModalProps> = ({
  job,
  existingRecord,
  onSaved,
  onClose,
}) => {
  const [status, setStatus] = useState<ApplicationTrackingStatus>(
    existingRecord?.status || 'Applied'
  );
  const [notes, setNotes] = useState(existingRecord?.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const statuses: ApplicationTrackingStatus[] = [
    'Interested',
    'Applied',
    'Interview',
    'Offer',
    'Closed',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const record = await ThinkoraService.trackApplication(job.id, status, notes);
      onSaved(record);
      onClose();
    } catch (e) {
      console.error('Failed to update tracker', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-55 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tracker-title"
      >
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 id="tracker-title" className="text-sm font-bold text-slate-900">
                Track Application
              </h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[240px]">
                {job.title} · {job.companyName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Application Stage
            </label>
            <div className="grid grid-cols-3 gap-2">
              {statuses.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`py-2 px-2.5 rounded-lg font-medium text-xs border text-center transition ${
                    status === s
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Private Student Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Submitted resume version v2; scheduled 30-min phone screen with recruiter on April 22..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Timestamp:</span>
            </span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {existingRecord?.appliedDate || new Date().toISOString().split('T')[0]}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-xs"
            >
              {isSaving ? 'Saving...' : 'Update Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
