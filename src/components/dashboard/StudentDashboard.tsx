import React, { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Lightbulb, 
  Users, 
  Search, 
  Bookmark, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  Clock,
  Send,
  X,
  ExternalLink
} from 'lucide-react';
import { JobOpportunity, StartupIdea, CollaboratorProfile, UserSession } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { ThinkoraService } from '../../services/api';
import { NavTab } from '../common/Header';

interface StudentDashboardProps {
  currentUser: UserSession;
  onNavigate: (tab: NavTab, params?: { query?: string; category?: string; filterType?: string }) => void;
  onSelectJob: (job: JobOpportunity) => void;
  onSelectIdea: (idea: StartupIdea) => void;
  onOpenShareIdeaModal: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  onNavigate,
  onSelectJob,
  onSelectIdea,
  onOpenShareIdeaModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [ideas, setIdeas] = useState<StartupIdea[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(false);
      try {
        const [jobsList, ideasList, savedList, appsList, requestsList] = await Promise.all([
          ThinkoraService.getJobs(),
          ThinkoraService.getIdeas(),
          ThinkoraService.getSavedJobIds(currentUser.id),
          ThinkoraService.getApplications(currentUser.id),
          ThinkoraService.getCollaborationRequests(currentUser.id),
        ]);
        setJobs(jobsList);
        setIdeas(ideasList);
        setSavedJobIds(savedList);
        setApplicationsCount(appsList.length);
        const acceptedConnections = requestsList.filter((r) => r.status === 'accepted').length;
        setConnectionsCount(acceptedConnections);
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      }
    }
    loadDashboardData();
  }, [currentUser.id]);

  // Global search matching across jobs, internships, and startup ideas
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return { matchedJobs: [], matchedIdeas: [] };
    const q = searchQuery.toLowerCase();
    
    const matchedJobs = jobs.filter((j) =>
      j.title.toLowerCase().includes(q) ||
      j.companyName.toLowerCase().includes(q) ||
      j.requiredSkills.some((s) => s.toLowerCase().includes(q)) ||
      j.location.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedIdeas = ideas.filter((i) =>
      i.title.toLowerCase().includes(q) ||
      i.tagline.toLowerCase().includes(q) ||
      i.problem.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      i.requiredSkills.some((s) => s.toLowerCase().includes(q))
    ).slice(0, 4);

    return { matchedJobs, matchedIdeas };
  }, [searchQuery, jobs, ideas]);

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchFocused(false);
    onNavigate('jobs', { query: searchQuery.trim() });
  };

  const topOpportunities = jobs.filter((j) => j.verificationStatus === 'Verified').slice(0, 4);
  const trendingIdeas = [...ideas].sort((a, b) => b.interestedCount - a.interestedCount).slice(0, 3);
  const myIdeasCount = ideas.filter((i) => i.creatorId === currentUser.id).length;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-150">
      
      {/* 1. Welcome Greeting & Personalized Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-visible">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Welcome to Thinkora Student Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {currentUser.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {currentUser.university ? `${currentUser.university} · ` : ''}{currentUser.major || 'University Student'}{currentUser.graduationYear ? ` (Class of ${currentUser.graduationYear})` : ''}. Find verified jobs & internships and collaborate with fellow student innovators.
          </p>

          {/* Global Search Bar (supports jobs, internships, and startup ideas) */}
          <div className="relative pt-2 max-w-2xl">
            <form onSubmit={handleGlobalSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 z-10" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, internships or startups..."
                className="w-full pl-10 pr-24 py-2.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 rounded-xl text-sm placeholder-slate-300 focus:placeholder-slate-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-20 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition"
              >
                Search
              </button>
            </form>

            {/* Live Search Popup Overlay */}
            {isSearchFocused && searchQuery.trim().length >= 2 && (
              <div 
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 text-slate-900 animate-in fade-in zoom-in-95 duration-100 max-h-96 overflow-y-auto"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs text-slate-500">
                  <span>Results for <strong>"{searchQuery}"</strong></span>
                  <button
                    onClick={() => setIsSearchFocused(false)}
                    className="text-slate-400 hover:text-slate-600 text-[11px]"
                  >
                    Close
                  </button>
                </div>

                {/* Matched Opportunities */}
                {searchResults.matchedJobs.length > 0 && (
                  <div className="space-y-1 mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                      Opportunities ({searchResults.matchedJobs.length})
                    </span>
                    {searchResults.matchedJobs.map((job) => (
                      <button
                        key={job.id}
                        type="button"
                        onClick={() => {
                          setIsSearchFocused(false);
                          onSelectJob(job);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-blue-50 transition flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                            {job.companyInitials}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 block">
                              {job.title}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {job.companyName} · {job.type} ({job.location})
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition">
                          View Details →
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Matched Startup Ideas */}
                {searchResults.matchedIdeas.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                      Startup Ideas ({searchResults.matchedIdeas.length})
                    </span>
                    {searchResults.matchedIdeas.map((idea) => (
                      <button
                        key={idea.id}
                        type="button"
                        onClick={() => {
                          setIsSearchFocused(false);
                          onSelectIdea(idea);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-amber-50 transition flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0">
                            <Lightbulb className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 group-hover:text-amber-700 block">
                              {idea.title}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {idea.category} · by {idea.creatorName} ({idea.creatorUniversity})
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-amber-600 font-semibold opacity-0 group-hover:opacity-100 transition">
                          View Idea →
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.matchedJobs.length === 0 && searchResults.matchedIdeas.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No exact jobs or startup ideas found for "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Decorative subtle backdrop mesh */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-blue-400 to-transparent pointer-events-none" />
      </section>

      {/* 2. Key Metrics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('saved')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Saved Opportunities</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {savedJobIds.length}
          </p>
          <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1 mt-1">
            <span>View saved list</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        <div 
          onClick={() => onNavigate('saved')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Applications Tracked</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {applicationsCount}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <span>Track progress</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        <div 
          onClick={() => onNavigate('startups')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Shared Startup Ideas</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {myIdeasCount}
          </p>
          <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1 mt-1">
            <span>Manage ideas</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        <div 
          onClick={() => onNavigate('collaborators')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-purple-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Peer Connections</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {connectionsCount}
          </p>
          <span className="text-[11px] text-purple-600 font-medium flex items-center gap-1 mt-1">
            <span>Find teammates</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </section>

      {/* 3. Four Core Shortcuts Grid (Direct reference image match) */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => onNavigate('jobs')}
          className="flex flex-col items-start p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all text-left group"
        >
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Module A</span>
          <span className="text-sm font-bold text-slate-900 mt-0.5">Jobs</span>
          <span className="text-[11px] text-slate-500 mt-1">Verified early career roles</span>
        </button>

        <button
          onClick={() => onNavigate('jobs', { filterType: 'Internship' })}
          className="flex flex-col items-start p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all text-left group"
        >
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Module A</span>
          <span className="text-sm font-bold text-slate-900 mt-0.5">Internships</span>
          <span className="text-[11px] text-slate-500 mt-1">Summer 2026 & Co-ops</span>
        </button>

        <button
          onClick={() => onNavigate('startups')}
          className="flex flex-col items-start p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all text-left group"
        >
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Lightbulb className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Module B</span>
          <span className="text-sm font-bold text-slate-900 mt-0.5">Startups</span>
          <span className="text-[11px] text-slate-500 mt-1">Explore student ventures</span>
        </button>

        <button
          onClick={() => onNavigate('collaborators')}
          className="flex flex-col items-start p-4 rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-xs transition-all text-left group"
        >
          <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Module B</span>
          <span className="text-sm font-bold text-slate-900 mt-0.5">Collaborate</span>
          <span className="text-[11px] text-slate-500 mt-1">Find student co-founders</span>
        </button>
      </section>

      {/* 4. Top Opportunities & Trending Startups Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Module A: Top Opportunities section with See All link */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="text-xs font-bold text-blue-700 tracking-wide uppercase">Top Opportunities</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Recommended for You
              </h2>
            </div>
            <button
              onClick={() => onNavigate('jobs')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>See All ({jobs.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topOpportunities.map((job) => (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100">
                      {job.companyInitials}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{job.companyName}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {job.location} ({job.workMode})
                        </span>
                      </div>
                    </div>
                  </div>
                  <VerificationBadge status={job.verificationStatus} />
                </div>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {job.shortDescription}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {job.compensation}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{job.type}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectJob(job);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scam-Defense Trust Notice Banner */}
          <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800">Thinkora Scam Defense Guarantee</span>
              <p>
                Every listing is subject to our 5-point credibility checklist (corporate email authenticity, verified business registration, domain link consistency, and zero upfront fee enforcement).
              </p>
            </div>
          </div>
        </div>

        {/* Module B Column: Trending Student Startups */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-xs font-bold text-amber-700 tracking-wide uppercase">Startup Ideas</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Trending Student Concepts
              </h2>
            </div>
            <button
              onClick={() => onNavigate('startups')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {trendingIdeas.map((idea) => (
              <div
                key={idea.id}
                onClick={() => onSelectIdea(idea)}
                className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                    {idea.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-amber-600" />
                    <span className="font-bold text-slate-800 tabular-nums">{idea.interestedCount}</span> interested
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-2 leading-snug">
                  {idea.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {idea.tagline}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                      {idea.creatorInitials}
                    </span>
                    <span className="truncate max-w-[120px] font-medium">{idea.creatorName}</span>
                    <span className="text-slate-400">({idea.creatorUniversity})</span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600 hover:underline">
                    View & Join →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick CTA to Share Idea */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200 text-center space-y-2">
            <h4 className="text-sm font-bold text-blue-950">Have a Startup Idea?</h4>
            <p className="text-xs text-slate-600">
              Pitch your concept, outline skills you need, and find talented university peers to build an MVP.
            </p>
            <button
              onClick={onOpenShareIdeaModal}
              className="mt-2 w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition shadow-xs"
            >
              + Share a Startup Idea
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
