import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Lightbulb, 
  Plus, 
  TrendingUp, 
  Users, 
  Sparkles, 
  Compass, 
  X,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import { StartupIdea, StartupCategory, UserSession } from '../../types';

interface StartupIdeasListingProps {
  ideas: StartupIdea[];
  currentUser: UserSession;
  onSelectIdea: (idea: StartupIdea) => void;
  onOpenShareModal: () => void;
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

export const StartupIdeasListing: React.FC<StartupIdeasListingProps> = ({
  ideas,
  currentUser,
  onSelectIdea,
  onOpenShareModal,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'My Ideas' | 'Trending'>('All');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false);

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      // 1. Tab filter (All | My Ideas | Trending)
      if (activeTab === 'My Ideas' && idea.creatorId !== currentUser.id) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all' && idea.category !== selectedCategory) {
        return false;
      }

      // 3. Search term
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = idea.title.toLowerCase().includes(q);
        const matchesTagline = idea.tagline.toLowerCase().includes(q);
        const matchesProblem = idea.problem.toLowerCase().includes(q);
        const matchesSkills = idea.requiredSkills.some((s) => s.toLowerCase().includes(q));
        const matchesCreator = idea.creatorName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTagline && !matchesProblem && !matchesSkills && !matchesCreator) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (activeTab === 'Trending') {
        return b.interestedCount - a.interestedCount;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [ideas, activeTab, selectedCategory, search, currentUser.id]);

  const myIdeasCount = ideas.filter((i) => i.creatorId === currentUser.id).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* 1. Top Navigation Bar (Back button, Title: Startups, Filter icon) */}
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
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                  Module B
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Startups & Innovation
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCategoryDrawer(!showCategoryDrawer)}
              className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold ${
                showCategoryDrawer || selectedCategory !== 'all'
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Filter by category"
              aria-label="Filter startups"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Categories</span>
            </button>

            <button
              onClick={onOpenShareModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Share Your Idea</span>
            </button>
          </div>
        </div>

        {/* 2. Tabs: All | My Ideas | Trending (Exact Reference Screen 6 match) */}
        <div className="flex items-center gap-1 border-b border-slate-100 pt-1">
          {(['All', 'My Ideas', 'Trending'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition -mb-px flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'All' && <span>All ({ideas.length})</span>}
              {tab === 'My Ideas' && <span>My Ideas ({myIdeasCount})</span>}
              {tab === 'Trending' && <span>Trending 🔥</span>}
            </button>
          ))}
        </div>

        {/* 3. Search Bar */}
        <div className="relative pt-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search startup ideas by title, problem, or required skill (e.g. EcoTrack, HealthTech, EduLens)..."
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

        {/* 4. Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-blue-600 hover:underline font-semibold ml-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 5. Startup Ideas Cards Grid */}
      {filteredIdeas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIdeas.map((idea) => {
            return (
              <div
                key={idea.id}
                onClick={() => onSelectIdea(idea)}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
              >
                <div>
                  {/* Category and Stage row */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                      {idea.category}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {idea.stage}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {idea.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {idea.tagline || idea.problem}
                  </p>

                  {/* Creator details */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    {idea.creatorAvatarUrl ? (
                      <img
                        src={idea.creatorAvatarUrl}
                        alt={idea.creatorName}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                        {idea.creatorInitials}
                      </div>
                    )}
                    <span className="font-semibold text-slate-800 truncate">{idea.creatorName}</span>
                    <span className="text-slate-400 truncate">· {idea.creatorUniversity}</span>
                  </div>

                  {/* Skills sought tags */}
                  {idea.requiredSkills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {idea.requiredSkills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                      {idea.requiredSkills.length > 3 && (
                        <span className="text-[10px] px-1 py-0.5 text-slate-400">
                          +{idea.requiredSkills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer: Members/Collaborators count + View Idea action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Users className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-bold text-slate-800 tabular-nums">
                      {idea.collaboratorIds.length} members
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="tabular-nums">{idea.interestedCount} interested</span>
                  </div>

                  <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-800 flex items-center gap-1">
                    <span>View Idea</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <Lightbulb className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            {activeTab === 'My Ideas' ? "You haven't shared any ideas yet" : 'No startup ideas match your filter'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === 'My Ideas'
              ? 'Have an idea you want to develop? Share your concept to discover fellow university collaborators.'
              : 'Try clearing your search keyword or selecting a different category.'}
          </p>
          <button
            onClick={onOpenShareModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
          >
            + Share Your Startup Idea
          </button>
        </div>
      )}

      {/* Prominent Share Your Idea Sticky Bottom CTA on Mobile */}
      <div className="sm:hidden pt-4 text-center">
        <button
          onClick={onOpenShareModal}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Share Your Startup Idea</span>
        </button>
      </div>

    </div>
  );
};
