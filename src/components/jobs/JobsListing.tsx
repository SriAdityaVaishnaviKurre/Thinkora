import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Bookmark, 
  ShieldCheck, 
  AlertTriangle,
  Briefcase,
  X,
  ArrowLeft,
  SlidersHorizontal,
  ChevronRight,
  Clock
} from 'lucide-react';
import { JobOpportunity, VerificationStatus } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';

interface JobsListingProps {
  jobs: JobOpportunity[];
  savedJobIds: string[];
  initialSearchQuery?: string;
  initialFilterType?: string;
  onSelectJob: (job: JobOpportunity) => void;
  onToggleSave: (jobId: string) => void;
  onBack?: () => void;
}

export const JobsListing: React.FC<JobsListingProps> = ({
  jobs,
  savedJobIds,
  initialSearchQuery = '',
  initialFilterType = 'All',
  onSelectJob,
  onToggleSave,
  onBack,
}) => {
  // Top employment/arrangement tabs: All | Full-time | Part-time | Remote
  const [activeTab, setActiveTab] = useState<'All' | 'Full-time' | 'Part-time' | 'Remote'>(
    (initialFilterType === 'Full-time' || initialFilterType === 'Part-time' || initialFilterType === 'Remote')
      ? initialFilterType
      : 'All'
  );

  const [search, setSearch] = useState(initialSearchQuery);
  const [locationFilter, setLocationFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [showScamEducation, setShowScamEducation] = useState(false);

  // Extract distinct locations for dropdown
  const uniqueLocations = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => set.add(j.location));
    return Array.from(set);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Employment tab filter (All | Full-time | Part-time | Remote)
      if (activeTab === 'Full-time' && job.type !== 'Full-time') return false;
      if (activeTab === 'Part-time' && job.type !== 'Part-time') return false;
      if (activeTab === 'Remote' && job.workMode !== 'Remote') return false;

      // 2. Search term
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.companyName.toLowerCase().includes(q);
        const matchesSkill = job.requiredSkills.some((s) => s.toLowerCase().includes(q));
        const matchesLocation = job.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesSkill && !matchesLocation) {
          return false;
        }
      }

      // 3. Location filter
      if (locationFilter !== 'all' && job.location !== locationFilter) {
        return false;
      }

      // 4. Experience Level filter
      if (experienceFilter !== 'all' && job.experienceLevel !== experienceFilter) {
        return false;
      }

      // 5. Type filter
      if (typeFilter !== 'all' && job.type !== typeFilter) {
        return false;
      }

      // 6. Verification Status filter
      if (verificationFilter !== 'all' && job.verificationStatus !== verificationFilter) {
        return false;
      }

      return true;
    });
  }, [jobs, activeTab, search, locationFilter, experienceFilter, typeFilter, verificationFilter]);

  const clearAllFilters = () => {
    setActiveTab('All');
    setSearch('');
    setLocationFilter('all');
    setExperienceFilter('all');
    setTypeFilter('all');
    setVerificationFilter('all');
  };

  const hasActiveFilters =
    activeTab !== 'All' ||
    search !== '' ||
    locationFilter !== 'all' ||
    experienceFilter !== 'all' ||
    typeFilter !== 'all' ||
    verificationFilter !== 'all';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* 1. Top Navigation Bar (Back button, Title: Jobs, Filter icon) */}
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
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                  Module A
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Jobs & Internships
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowScamEducation(!showScamEducation)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Trust Standard</span>
            </button>

            <button
              onClick={() => setFiltersDrawerOpen(!filtersDrawerOpen)}
              className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold ${
                filtersDrawerOpen || (hasActiveFilters && activeTab === 'All' && search === '')
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Toggle filters drawer"
              aria-label="Filter opportunities"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* 2. Employment-Type / Arrangement Tabs (Reference Screen 4 exact tabs) */}
        <div className="flex items-center gap-1 border-b border-slate-100 pt-1">
          {(['All', 'Full-time', 'Part-time', 'Remote'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition -mb-px ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
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
            placeholder="Search jobs by title, company, or skill (e.g. Frontend Developer, Data Analyst, React)..."
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

        {/* 4. Interactive Filters Bar (Drawer / Responsive Row) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="all">All Locations</option>
            {uniqueLocations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Experience Level Filter */}
          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="all">All Experience Levels</option>
            <option value="Student / Intern">Student / Intern</option>
            <option value="Entry-Level (0-2 yrs)">Entry-Level (0-2 yrs)</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="all">All Job Types</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Co-op">Co-op</option>
          </select>

          {/* Verification Status Filter */}
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="all">All Verification Tiers</option>
            <option value="Verified">Verified Only</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Unable to Verify">Unable to Verify</option>
            <option value="Potential Risk">Potential Risk Flagged</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="py-1.5 px-2.5 text-blue-600 hover:text-blue-800 font-semibold hover:underline"
            >
              Clear Filters
            </button>
          )}

          <span className="ml-auto text-slate-500 font-medium tabular-nums">
            Showing {filteredJobs.length} opportunities
          </span>
        </div>

        {/* Scam Defense Education Dropdown */}
        {showScamEducation && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                The Thinkora Trust & Safety Checklist
              </span>
              <button
                onClick={() => setShowScamEducation(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px] leading-relaxed">
              <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                <strong className="text-slate-900 block mb-1">1. Recruiter Email Domain</strong>
                Communications must come from registered company domains, never free webmail accounts.
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                <strong className="text-slate-900 block mb-1">2. Zero Upfront Payment Policy</strong>
                Legitimate employers never charge students for "processing fees" or equipment.
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                <strong className="text-slate-900 block mb-1">3. Consistent Application URLs</strong>
                Application links are cross-referenced with the verified ATS or portal.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Opportunity Cards Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            const isFlagged = job.verificationStatus === 'Potential Risk';

            return (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all cursor-pointer group shadow-2xs hover:shadow-md ${
                  isFlagged
                    ? 'border-rose-200 hover:border-rose-400 bg-rose-50/20'
                    : 'border-slate-200/90 hover:border-blue-300'
                }`}
              >
                <div>
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border ${
                        isFlagged
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-blue-50 text-blue-800 border-blue-100'
                      }`}>
                        {job.companyInitials}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-700 block">
                          {job.companyName}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(job.id);
                      }}
                      className={`p-2 rounded-lg transition shrink-0 ${
                        isSaved
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      title={isSaved ? 'Remove bookmark' : 'Save opportunity'}
                      aria-label="Bookmark job"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
                    </button>
                  </div>

                  {/* Metadata line (Location, Remote/Hybrid/Onsite, Employment Type) */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap mb-2.5">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700">{job.workMode}</span>
                    <span aria-hidden="true">·</span>
                    <span>{job.type}</span>
                    {job.duration && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-400">{job.duration}</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {job.shortDescription}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.requiredSkills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 4 && (
                      <span className="text-[11px] px-1.5 py-0.5 text-slate-500">
                        +{job.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 tabular-nums block">
                      {job.compensation}
                    </span>
                    <VerificationBadge status={job.verificationStatus} />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectJob(job);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No opportunities match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try switching employment tabs, adjusting your search keywords, or clearing your active filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};
