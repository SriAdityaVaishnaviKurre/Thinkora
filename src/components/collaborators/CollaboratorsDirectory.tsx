import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Users, 
  MapPin, 
  GraduationCap, 
  Clock, 
  Send, 
  CheckCircle, 
  Mail, 
  Sparkles,
  ExternalLink,
  X,
  ArrowLeft,
  Award
} from 'lucide-react';
import { CollaboratorProfile, CollaborationRequest, UserSession, StartupCategory } from '../../types';

interface CollaboratorsDirectoryProps {
  collaborators: CollaboratorProfile[];
  requests: CollaborationRequest[];
  currentUser: UserSession;
  onOpenPitchModal: (collaborator: CollaboratorProfile) => void;
  onBack?: () => void;
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

export const CollaboratorsDirectory: React.FC<CollaboratorsDirectoryProps> = ({
  collaborators,
  requests,
  currentUser,
  onOpenPitchModal,
  onBack,
}) => {
  const [roleTab, setRoleTab] = useState<'All' | 'Students' | 'Mentors'>('All');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  // Filter out current user from directory view
  const peers = useMemo(() => {
    return collaborators.filter((c) => c.id !== currentUser.id);
  }, [collaborators, currentUser.id]);

  const filteredPeers = useMemo(() => {
    return peers.filter((peer) => {
      // 1. Role Tab filter (All | Students | Mentors)
      if (roleTab === 'Students' && peer.roleType === 'Mentor') return false;
      if (roleTab === 'Mentors' && peer.roleType !== 'Mentor') return false;

      // 2. Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = peer.name.toLowerCase().includes(q);
        const matchesMajor = peer.major.toLowerCase().includes(q);
        const matchesUniversity = peer.university.toLowerCase().includes(q);
        const matchesSkills = peer.skills.some((s) => s.toLowerCase().includes(q));
        const matchesInterests = peer.interests.some((i) => i.toLowerCase().includes(q));
        const matchesBio = peer.bio.toLowerCase().includes(q);
        if (!matchesName && !matchesMajor && !matchesUniversity && !matchesSkills && !matchesInterests && !matchesBio) {
          return false;
        }
      }

      // 3. Startup Category filter
      if (selectedCategory !== 'all') {
        const hasInterest = peer.startupInterests?.includes(selectedCategory as StartupCategory);
        if (!hasInterest) return false;
      }

      // 4. Availability filter
      if (availabilityFilter !== 'all' && peer.availability !== availabilityFilter) {
        return false;
      }

      return true;
    });
  }, [peers, roleTab, search, selectedCategory, availabilityFilter]);

  // Helper to determine relationship state
  const getRequestState = (peerId: string) => {
    const existing = requests.find(
      (r) =>
        (r.senderId === currentUser.id && r.receiverId === peerId) ||
        (r.receiverId === currentUser.id && r.senderId === peerId)
    );
    if (!existing) return null;
    return existing.status; // 'pending' | 'accepted' | 'declined'
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* 1. Header with Back button and Title */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                aria-label="Back to dashboard"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                  Module B
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Collaborators & Mentors
              </h1>
            </div>
          </div>

          <span className="text-xs text-slate-500 font-medium tabular-nums">
            {filteredPeers.length} profiles available
          </span>
        </div>

        {/* 2. Top Controls: All tab | Students tab | Mentors tab (Exact Reference Screen 8 tabs) */}
        <div className="flex items-center gap-1 border-b border-slate-100 pt-1">
          {(['All', 'Students', 'Mentors'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setRoleTab(tab)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition -mb-px flex items-center gap-1.5 ${
                roleTab === tab
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'All' && <span>All ({peers.length})</span>}
              {tab === 'Students' && <span>Students ({peers.filter((p) => p.roleType !== 'Mentor').length})</span>}
              {tab === 'Mentors' && <span>Mentors ({peers.filter((p) => p.roleType === 'Mentor').length})</span>}
            </button>
          ))}
        </div>

        {/* 3. Search Field */}
        <div className="relative pt-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, role (Developer, Designer), skill (React, Figma, Python), or interest..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 4. Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="all">All Startup Domains</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="all">All Availabilities</option>
            <option value="1-5 hrs/week">1-5 hrs/week</option>
            <option value="5-10 hrs/week">5-10 hrs/week</option>
            <option value="10-20 hrs/week">10-20 hrs/week</option>
          </select>

          {(search || selectedCategory !== 'all' || availabilityFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setAvailabilityFilter('all');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 5. Person Cards Grid */}
      {filteredPeers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPeers.map((peer) => {
            const reqState = getRequestState(peer.id);
            const isMentor = peer.roleType === 'Mentor';

            return (
              <div
                key={peer.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-purple-300 transition-all"
              >
                <div>
                  {/* Top Header with Avatar */}
                  <div className="flex items-start gap-3.5 mb-3">
                    {peer.avatarUrl ? (
                      <img
                        src={peer.avatarUrl}
                        alt={peer.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-xl font-bold text-sm flex items-center justify-center shrink-0 ${
                        isMentor ? 'bg-amber-600 text-white' : 'bg-slate-900 text-white'
                      }`}>
                        {peer.initials}
                      </div>
                    )}

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {peer.name}
                        </h3>
                        {isMentor && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                            Mentor
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-purple-700">
                        {peer.university}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {peer.degree} {peer.major} {peer.graduationYear !== 'Faculty' && peer.graduationYear !== 'Alumni' ? `· Class of ${peer.graduationYear}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Bio summary */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">
                    {peer.bio}
                  </p>

                  {/* Skills tags */}
                  <div className="space-y-1.5 mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {peer.skills.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                      {peer.skills.length > 4 && (
                        <span className="text-[10px] px-1 py-0.5 text-slate-400">
                          +{peer.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Areas of Interest */}
                  {peer.interests && peer.interests.length > 0 && (
                    <div className="space-y-1 mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Areas of Interest
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {peer.interests.map((interest) => (
                          <span
                            key={interest}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100 font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Availability: <strong>{peer.availability}</strong></span>
                  </div>
                </div>

                {/* Bottom Card Footer: Connect Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {reqState === 'accepted' ? (
                    <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Connected · {peer.email}</span>
                    </div>
                  ) : reqState === 'pending' ? (
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      Request Pending
                    </span>
                  ) : (
                    <button
                      onClick={() => onOpenPitchModal(peer)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No {roleTab.toLowerCase()} found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, switching between Students and Mentors tabs, or resetting filters.
          </p>
        </div>
      )}

    </div>
  );
};
