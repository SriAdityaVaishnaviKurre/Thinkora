import React, { useState } from 'react';
import { X, Lightbulb, Rocket, CheckCircle2 } from 'lucide-react';
import { StartupIdea, StartupCategory, StartupStage } from '../../types';
import { ThinkoraService } from '../../services/api';

interface ShareIdeaModalProps {
  initialIdea?: StartupIdea | null;
  onSaved: (idea: StartupIdea) => void;
  onClose: () => void;
}

const CATEGORIES: StartupCategory[] = [
  'EdTech',
  'AI & Machine Learning',
  'HealthTech',
  'CleanTech & Climate',
  'Fintech',
  'Campus Life',
  'Social Impact',
  'Dev Tools & Open Source',
];

const STAGES: StartupStage[] = [
  'Idea Concept',
  'Prototype',
  'Building MVP',
  'Launched Beta',
];

export const ShareIdeaModal: React.FC<ShareIdeaModalProps> = ({
  initialIdea,
  onSaved,
  onClose,
}) => {
  const [title, setTitle] = useState(initialIdea?.title || '');
  const [tagline, setTagline] = useState(initialIdea?.tagline || '');
  const [problem, setProblem] = useState(initialIdea?.problem || '');
  const [solution, setSolution] = useState(initialIdea?.solution || '');
  const [targetAudience, setTargetAudience] = useState(initialIdea?.targetAudience || '');
  const [category, setCategory] = useState<StartupCategory>(initialIdea?.category || 'EdTech');
  const [stage, setStage] = useState<StartupStage>(initialIdea?.stage || 'Idea Concept');
  const [skillsInput, setSkillsInput] = useState(initialIdea?.requiredSkills.join(', ') || '');
  const [collaborationPreferences, setCollaborationPreferences] = useState(
    initialIdea?.collaborationPreferences || ''
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please provide a title for your startup idea.');
      return;
    }
    if (!problem.trim()) {
      setErrorMessage('Please describe the problem you are solving.');
      return;
    }
    if (!solution.trim()) {
      setErrorMessage('Please outline your proposed solution.');
      return;
    }

    const skillsArray = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      if (initialIdea) {
        const updated = await ThinkoraService.updateIdea(initialIdea.id, {
          title,
          tagline: tagline || title,
          problem,
          solution,
          targetAudience,
          category,
          stage,
          requiredSkills: skillsArray,
          collaborationPreferences,
        });
        onSaved(updated);
      } else {
        const currentUser = ThinkoraService.getCurrentUser();
        const created = await ThinkoraService.createIdea({
          title,
          tagline: tagline || title,
          problem,
          solution,
          targetAudience,
          category,
          stage,
          creatorId: currentUser?.id || 'guest',
          creatorName: currentUser?.name || 'Student Founder',
          creatorInitials: currentUser?.initials || 'SF',
          creatorUniversity: currentUser?.university || 'University',
          requiredSkills: skillsArray,
          collaborationPreferences,
        });
        onSaved(created);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save startup idea. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-100">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-idea-title"
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 id="share-idea-title" className="text-lg font-bold text-slate-900">
                {initialIdea ? 'Edit Startup Idea' : 'Share a Student Startup Idea'}
              </h2>
              <p className="text-xs text-slate-500">
                Module B · Startup Ideas & Collaboration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto text-xs">
          
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Startup Idea Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SolarBench: Autonomous Campus Charging Pods"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              One-Line Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Solar-powered outdoor workstations for college quads"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StartupCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Current Stage *</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as StartupStage)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {STAGES.map((stg) => (
                  <option key={stg} value={stg}>
                    {stg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Problem Statement (What pain point are students or customers facing?) *
            </label>
            <textarea
              rows={3}
              required
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe the real-world friction, inefficiencies, or unmet student need..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Proposed Solution (How does your concept solve this problem?) *
            </label>
            <textarea
              rows={3}
              required
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Explain your approach, technology stack, product model, or unique advantage..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Target Users & Audience
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Undergraduate STEM majors, university campus dining halls, student clubs"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Collaborator Skills Needed (comma-separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. React, Python, UI Design, Embedded Systems, Hardware"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Collaboration Preferences (Commitment & expectations)
            </label>
            <input
              type="text"
              value={collaborationPreferences}
              onChange={(e) => setCollaborationPreferences(e.target.value)}
              placeholder="e.g. Looking for a technical co-founder, 5-10 hrs/week, preparing for summer hackathon"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-xs"
            >
              {isSubmitting ? 'Publishing...' : initialIdea ? 'Save Changes' : 'Publish Idea'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
