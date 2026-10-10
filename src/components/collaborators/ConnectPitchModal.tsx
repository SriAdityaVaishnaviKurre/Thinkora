import React, { useState } from 'react';
import { X, Send, Sparkles, UserCheck } from 'lucide-react';
import { CollaboratorProfile, StartupIdea, UserSession } from '../../types';
import { ThinkoraService } from '../../services/api';

interface ConnectPitchModalProps {
  collaborator?: CollaboratorProfile | null;
  targetIdea?: StartupIdea | null;
  currentUser?: UserSession | null;
  onSuccess: () => void;
  onClose: () => void;
}

export const ConnectPitchModal: React.FC<ConnectPitchModalProps> = ({
  collaborator,
  targetIdea,
  currentUser,
  onSuccess,
  onClose,
}) => {
  const [proposedRole, setProposedRole] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const targetName = collaborator?.name || targetIdea?.creatorName || 'Student Peer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!message.trim()) {
      setErrorMessage('Please write a short pitch or intro message.');
      return;
    }

    const activeUser = currentUser || ThinkoraService.getCurrentUser();
    if (!activeUser) {
      setErrorMessage('Please sign in to send collaboration pitches.');
      return;
    }

    setIsSending(true);
    try {
      await ThinkoraService.sendCollaborationRequest({
        receiverId: collaborator?.id || targetIdea?.creatorId || '',
        senderId: activeUser.id,
        senderName: activeUser.name,
        senderUniversity: activeUser.university || 'University',
        senderSkills: activeUser.skills || [],
        ideaId: targetIdea?.id,
        ideaTitle: targetIdea?.title,
        message,
        proposedRole: proposedRole || 'Collaborator',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send collaboration request.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-55 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pitch-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 id="pitch-title" className="text-sm font-bold text-slate-900">
                {targetIdea ? 'Pitch Collaboration on Idea' : 'Connect with Collaborator'}
              </h3>
              <p className="text-[11px] text-slate-500">
                To: {targetName} {targetIdea ? `(${targetIdea.title})` : ''}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Proposed Role or Contribution
            </label>
            <input
              type="text"
              required
              value={proposedRole}
              onChange={(e) => setProposedRole(e.target.value)}
              placeholder="e.g. Frontend Developer, UI/UX Designer, Growth Lead"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Personal Pitch Note
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself, why you're interested in this concept or skills match, and what you'd like to build together..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 space-y-1 text-[11px]">
            <span className="font-semibold text-slate-800 block">Privacy Notice</span>
            <p>
              Your student email and contact information will only be shared with {targetName} after they accept this collaboration request.
            </p>
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
              disabled={isSending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Sending...' : 'Send Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
