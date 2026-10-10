import React, { useState } from 'react';
import { 
  User, 
  Bookmark, 
  Briefcase, 
  Lightbulb, 
  Users, 
  Edit3, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink,
  Trash2,
  Lock,
  Plus,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Eye,
  LogOut,
  Target,
  Sparkles
} from 'lucide-react';
import { 
  UserSession, 
  JobOpportunity, 
  JobApplicationRecord, 
  StartupIdea, 
  CollaborationRequest, 
  RequestStatus,
  ApplicationTrackingStatus,
  StartupCategory
} from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { ThinkoraService } from '../../services/api';

export type ProfileMenuItem = 'profile' | 'applications' | 'saved' | 'settings';

interface StudentProfileViewProps {
  currentUser: UserSession;
  allJobs: JobOpportunity[];
  savedJobIds: string[];
  applications: JobApplicationRecord[];
  ideas: StartupIdea[];
  requests: CollaborationRequest[];
  onSelectJob: (job: JobOpportunity) => void;
  onSelectIdea: (idea: StartupIdea) => void;
  onToggleSaveJob: (jobId: string) => void;
  onOpenEditIdea: (idea: StartupIdea) => void;
  onDeleteIdea: (ideaId: string) => void;
  onOpenShareIdeaModal: () => void;
  onUpdateApplicationStatus: (jobId: string, status: ApplicationTrackingStatus) => void;
  onUpdateRequestStatus: (requestId: string, status: RequestStatus) => void;
  onProfileUpdated: (updated: UserSession) => void;
  onLogout?: () => void;
  defaultMenu?: ProfileMenuItem;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  currentUser,
  allJobs,
  savedJobIds,
  applications,
  ideas,
  requests,
  onSelectJob,
  onSelectIdea,
  onToggleSaveJob,
  onOpenEditIdea,
  onDeleteIdea,
  onOpenShareIdeaModal,
  onUpdateApplicationStatus,
  onUpdateRequestStatus,
  onProfileUpdated,
  onLogout,
  defaultMenu = 'profile',
}) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<ProfileMenuItem>(defaultMenu);
  const [isEditingProfileModal, setIsEditingProfileModal] = useState(false);

  // Profile Edit fields
  const [editName, setEditName] = useState(currentUser.name);
  const [editUniversity, setEditUniversity] = useState(currentUser.university);
  const [editDegree, setEditDegree] = useState(currentUser.degree);
  const [editMajor, setEditMajor] = useState(currentUser.major);
  const [editGradYear, setEditGradYear] = useState(currentUser.graduationYear);
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [editSkillsStr, setEditSkillsStr] = useState(currentUser.skills.join(', '));
  const [editInterestsStr, setEditInterestsStr] = useState((currentUser.interests || []).join(', '));
  const [careerGoals, setCareerGoals] = useState('Secure a Frontend or Full-Stack Engineering Summer Internship at a climate or education startup.');
  const [startupInterests, setStartupInterests] = useState('EdTech, CleanTech, Developer Tools');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Settings State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationPush, setNotificationPush] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'students_only'>('public');

  const savedJobs = allJobs.filter((j) => savedJobIds.includes(j.id));
  const myIdeas = ideas.filter((i) => i.creatorId === currentUser.id);
  const connectedPeersCount = requests.filter((r) => r.status === 'accepted').length;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const skillsArr = editSkillsStr.split(',').map((s) => s.trim()).filter(Boolean);
      const interestsArr = editInterestsStr.split(',').map((s) => s.trim()).filter(Boolean);
      await ThinkoraService.updateProfile(currentUser.id, {
        name: editName,
        university: editUniversity,
        degree: editDegree,
        major: editMajor,
        graduationYear: editGradYear,
        bio: editBio,
        skills: skillsArr,
        interests: interestsArr,
      });
      onProfileUpdated({
        ...currentUser,
        name: editName,
        university: editUniversity,
        degree: editDegree,
        major: editMajor,
        graduationYear: editGradYear,
        bio: editBio,
        skills: skillsArr,
        interests: interestsArr,
      });
      setIsEditingProfileModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert('New password must be at least 6 characters.');
      return;
    }
    setPasswordSuccess('Password updated securely!');
    setOldPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(''), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* 1. Profile Top Card (Exact Reference Screen 9 Header) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Navy Header Strip */}
        <div className="h-24 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 px-6 flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-200 tracking-wide uppercase">
            Student Profile Hub
          </span>
          <button
            onClick={() => setSelectedMenuItem('settings')}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
            title="Open Account Settings"
            aria-label="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 mb-5">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white font-bold text-2xl flex items-center justify-center border-4 border-white shadow-md">
                {currentUser.initials || 'ST'}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {currentUser.name}
                  </h1>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified Student
                  </span>
                </div>
                <p className="text-xs font-semibold text-blue-700">
                  {currentUser.university} · {currentUser.degree} {currentUser.major}
                </p>
                <p className="text-[11px] text-slate-500">
                  Class of {currentUser.graduationYear} · {currentUser.email}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditingProfileModal(true)}
              className="self-start sm:self-auto px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold border border-blue-200 flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* 3 Metric Counters: Saved Jobs count, Ideas count, Collaborators count (Exact Reference Screen 9) */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
            <div 
              onClick={() => setSelectedMenuItem('saved')}
              className="cursor-pointer hover:opacity-80 transition"
            >
              <span className="text-[11px] font-semibold text-slate-500 block">Saved Jobs</span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {savedJobIds.length}
              </span>
            </div>

            <div 
              onClick={() => setSelectedMenuItem('profile')}
              className="cursor-pointer hover:opacity-80 transition border-x border-slate-200"
            >
              <span className="text-[11px] font-semibold text-slate-500 block">Ideas Created</span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {myIdeas.length}
              </span>
            </div>

            <div 
              onClick={() => setSelectedMenuItem('profile')}
              className="cursor-pointer hover:opacity-80 transition"
            >
              <span className="text-[11px] font-semibold text-slate-500 block">Collaborators</span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {connectedPeersCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Profile Menu Navigation Items (Exact Reference Screen 9 Items):
          1. My Profile
          2. My Applications
          3. Saved Opportunities
          4. Settings */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => setSelectedMenuItem('profile')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            selectedMenuItem === 'profile'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Profile</span>
        </button>

        <button
          onClick={() => setSelectedMenuItem('applications')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            selectedMenuItem === 'applications'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setSelectedMenuItem('saved')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            selectedMenuItem === 'saved'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Opportunities ({savedJobs.length})</span>
        </button>

        <button
          onClick={() => setSelectedMenuItem('settings')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            selectedMenuItem === 'settings'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* 3. Panel Content */}

      {/* Item 1: My Profile (View & Edit Details) */}
      {selectedMenuItem === 'profile' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Student Overview & Bio</h2>
                <p className="text-xs text-slate-500">Your public academic and career presence on Thinkora.</p>
              </div>
              <button
                onClick={() => setIsEditingProfileModal(true)}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Info</span>
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  About Me / Bio
                </span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {currentUser.bio || 'Second-year undergraduate passionate about software engineering, startup innovation, and human-computer interaction.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-blue-600" />
                    <span>Career Goals</span>
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {careerGoals}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Startup Interests</span>
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {startupInterests}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Core Technical & Soft Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 text-slate-800 font-semibold border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ideas Created by Student */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Startup Ideas You Created</h3>
                <p className="text-xs text-slate-500">Concepts you have pitched on Thinkora.</p>
              </div>
              <button
                onClick={onOpenShareIdeaModal}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Pitch Idea</span>
              </button>
            </div>

            {myIdeas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {myIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    onClick={() => onSelectIdea(idea)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-amber-300 transition cursor-pointer group space-y-2 bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {idea.category}
                      </span>
                      <span className="text-slate-500">{idea.stage}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {idea.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {idea.problem}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                      <span className="text-slate-500">{idea.interestedCount} interested</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEditIdea(idea);
                          }}
                          className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[11px] font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this idea?')) onDeleteIdea(idea.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                You haven't pitched any startup concepts yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Item 2: My Applications (Interested, Applied, Interview, Offer, Rejected, Closed) */}
      {selectedMenuItem === 'applications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              My Job & Internship Applications
            </h2>
            <p className="text-xs text-slate-500">
              Track your application stages across Interested, Applied, Interview, Offer, Rejected, and Closed.
            </p>
          </div>

          {applications.length > 0 ? (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {applications.map((app) => {
                const targetJob = allJobs.find((j) => j.id === app.jobId);
                if (!targetJob) return null;

                return (
                  <div key={app.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{targetJob.title}</span>
                        <span className="text-xs text-slate-500">· {targetJob.companyName}</span>
                        <VerificationBadge status={targetJob.verificationStatus} />
                      </div>
                      {app.notes && (
                        <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100 max-w-xl">
                          "{app.notes}"
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400">
                        Applied: {app.appliedDate} · Updated: {app.lastUpdated}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Stage:</span>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          onUpdateApplicationStatus(
                            app.jobId,
                            e.target.value as ApplicationTrackingStatus
                          )
                        }
                        className="py-1 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="Interested">Interested</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Closed">Closed</option>
                      </select>

                      <button
                        onClick={() => onSelectJob(targetJob)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
              No active applications tracked yet. When viewing a job in Module A, click "Track Application" to monitor progress.
            </div>
          )}
        </div>
      )}

      {/* Item 3: Saved Opportunities (Bookmarks) */}
      {selectedMenuItem === 'saved' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Saved Jobs & Internships
            </h2>
            <p className="text-xs text-slate-500">
              Bookmarked roles with transparent scam screening and verification badges.
            </p>
          </div>

          {savedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-100">
                          {job.companyInitials}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-700">{job.companyName}</span>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                        </div>
                      </div>
                      <VerificationBadge status={job.verificationStatus} />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{job.location}</span>
                      <span>·</span>
                      <span>{job.workMode}</span>
                      <span>·</span>
                      <span>{job.type}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {job.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {job.compensation}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSaveJob(job.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectJob(job);
                        }}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-semibold text-xs"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
              No saved opportunities yet. Browse verified opportunities in Module A to bookmark roles.
            </div>
          )}
        </div>
      )}

      {/* Item 4: Settings (Account, Password, Notifications, Visibility, Logout) */}
      {selectedMenuItem === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900">Account Settings & Privacy</h2>
            <p className="text-xs text-slate-500">Manage login credentials, alerts, and directory visibility.</p>
          </div>

          {/* Change Password */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Change Password</span>
            </h3>

            {passwordSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Bell className="w-4 h-4 text-amber-600" />
              <span>Notification Preferences</span>
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <span className="text-slate-700 font-medium">
                  Receive email alerts for new collaboration pitches and request responses
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationPush}
                  onChange={(e) => setNotificationPush(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <span className="text-slate-700 font-medium">
                  Notify me when new verified jobs match my field of study ({currentUser.major})
                </span>
              </label>
            </div>
          </div>

          {/* Profile Visibility & Privacy Settings */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Directory Visibility & Privacy</span>
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={profileVisibility === 'public'}
                  onChange={() => setProfileVisibility('public')}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <span className="text-slate-800 font-semibold block">Public Student Directory</span>
                  <span className="text-slate-500 text-[11px]">
                    Visible to verified student collaborators and mentors searching for teammates.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={profileVisibility === 'students_only'}
                  onChange={() => setProfileVisibility('students_only')}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <span className="text-slate-800 font-semibold block">Only Campus Peers</span>
                  <span className="text-slate-500 text-[11px]">
                    Only visible to students from {currentUser.university}.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Log Out Button */}
          {onLogout && (
            <div className="pt-2 flex justify-start">
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-lg text-xs transition flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Thinkora</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfileModal && (
        <div className="fixed inset-0 z-55 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Edit Student Profile</h3>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">University</label>
                  <input
                    type="text"
                    required
                    value={editUniversity}
                    onChange={(e) => setEditUniversity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Degree / Major</label>
                  <input
                    type="text"
                    required
                    value={editMajor}
                    onChange={(e) => setEditMajor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Graduation Year</label>
                <input
                  type="text"
                  value={editGradYear}
                  onChange={(e) => setEditGradYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bio / Overview</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={editSkillsStr}
                  onChange={(e) => setEditSkillsStr(e.target.value)}
                  placeholder="React, TypeScript, Python, Figma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Interests</label>
                <input
                  type="text"
                  value={editInterestsStr}
                  onChange={(e) => setEditInterestsStr(e.target.value)}
                  placeholder="EdTech, CleanTech, Developer Tools"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditingProfileModal(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  {isSavingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
