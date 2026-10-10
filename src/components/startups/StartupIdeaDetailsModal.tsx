import React from 'react';
import { 
  X, 
  Lightbulb, 
  Users, 
  CheckCircle, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Target, 
  Send,
  Calendar,
  Compass,
  ArrowLeft,
  UserCheck,
  Briefcase
} from 'lucide-react';
import { StartupIdea, UserSession } from '../../types';

interface StartupIdeaDetailsModalProps {
  idea: StartupIdea;
  currentUser: UserSession;
  onClose: () => void;
  onJoinPitch: (idea: StartupIdea) => void;
  onEditIdea: (idea: StartupIdea) => void;
  onDeleteIdea: (ideaId: string) => void;
  onViewCreatorProfile?: (creatorId: string) => void;
}

export const StartupIdeaDetailsModal: React.FC<StartupIdeaDetailsModalProps> = ({
  idea,
  currentUser,
  onClose,
  onJoinPitch,
  onEditIdea,
  onDeleteIdea,
  onViewCreatorProfile,
}) => {
  const isCreator = currentUser.id === idea.creatorId;
  const isMember = idea.collaboratorIds?.includes(currentUser.id);

  // Default roles if none provided
  const lookingForRoles = idea.desiredRoles && idea.desiredRoles.length > 0 
    ? idea.desiredRoles 
    : ['Developers', 'Designers', 'Business Minded'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-100">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="idea-title"
      >
        
        {/* Header with Back button */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/70">
          <div className="flex items-start gap-3">
            <button
              onClick={onClose}
              className="mt-1 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 rounded-xl transition"
              aria-label="Back to startups"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60">
                  {idea.category}
                </span>
                <span className="font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
                  Stage: {idea.stage}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 font-medium tabular-nums flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  <strong>{idea.collaboratorIds?.length || 1}</strong> members
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 font-medium tabular-nums">
                  {idea.interestedCount} interested
                </span>
              </div>

              <h2 id="idea-title" className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {idea.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {idea.tagline}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          {/* Creator Profile Bar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {idea.creatorAvatarUrl ? (
                <img
                  src={idea.creatorAvatarUrl}
                  alt={idea.creatorName}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                  {idea.creatorInitials}
                </div>
              )}
              <div>
                <span className="text-xs text-slate-500 block">Startup Creator</span>
                <span className="font-bold text-slate-900 text-sm">{idea.creatorName}</span>
                <span className="text-slate-500 text-xs ml-2">({idea.creatorUniversity})</span>
              </div>
            </div>

            {isCreator ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                You created this idea
              </span>
            ) : isMember ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Team Member</span>
              </span>
            ) : (
              <button
                onClick={() => onJoinPitch(idea)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Join / Collaborate</span>
              </button>
            )}
          </div>

          {/* Looking For Section (Exact Reference Screen 7 Requirement) */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-700" />
              <span>Looking for Teammates & Roles</span>
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {lookingForRoles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-white text-amber-900 text-xs font-semibold rounded-lg border border-amber-300 shadow-2xs flex items-center gap-1"
                >
                  <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                  <span>{role}</span>
                </span>
              ))}
            </div>
            <p className="text-[11px] text-amber-900/80 pt-1">
              {idea.collaborationPreferences || 'Seeking multidisciplinary student collaborators to bring this concept to life.'}
            </p>
          </div>

          {/* Problem Statement */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-rose-500" />
              <span>Problem Being Solved</span>
            </h3>
            <p className="p-3.5 rounded-xl bg-rose-50/40 border border-rose-100 text-slate-800 leading-relaxed">
              {idea.problem}
            </p>
          </div>

          {/* Proposed Solution */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Proposed Solution & Approach</span>
            </h3>
            <p className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100 text-slate-800 leading-relaxed">
              {idea.solution}
            </p>
          </div>

          {/* Target Audience */}
          {idea.targetAudience && (
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Target Users & Market</span>
              </h3>
              <p className="text-slate-700">{idea.targetAudience}</p>
            </div>
          )}

          {/* Required Skills */}
          {idea.requiredSkills && idea.requiredSkills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Teammate Skills Sought
              </h3>
              <div className="flex flex-wrap gap-2">
                {idea.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium text-xs border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="pt-2 text-slate-400 text-[11px] flex items-center gap-4">
            <span>Posted: {idea.createdAt}</span>
            <span>Last updated: {idea.updatedAt}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
          {isCreator ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEditIdea(idea)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Idea</span>
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this startup idea?')) {
                    onDeleteIdea(idea.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-500">
              Reach out to {idea.creatorName} to pitch your involvement.
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Close
            </button>
            {!isCreator && !isMember && (
              <button
                onClick={() => onJoinPitch(idea)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Join / Collaborate</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
