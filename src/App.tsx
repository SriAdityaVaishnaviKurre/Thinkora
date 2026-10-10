import React, { useState, useEffect } from 'react';
import { 
  Header, 
  NavTab 
} from './components/common/Header';
import { Footer } from './components/common/Footer';
import { WelcomeAuthView } from './components/auth/WelcomeAuthView';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { JobsListing } from './components/jobs/JobsListing';
import { JobDetailsModal } from './components/jobs/JobDetailsModal';
import { ApplicationTrackerModal } from './components/jobs/ApplicationTrackerModal';
import { StartupIdeasListing } from './components/startups/StartupIdeasListing';
import { StartupIdeaDetailsModal } from './components/startups/StartupIdeaDetailsModal';
import { ShareIdeaModal } from './components/startups/ShareIdeaModal';
import { CollaboratorsDirectory } from './components/collaborators/CollaboratorsDirectory';
import { ConnectPitchModal } from './components/collaborators/ConnectPitchModal';
import { StudentProfileView } from './components/profile/StudentProfileView';
import { NotificationPanel } from './components/common/NotificationPanel';
import { 
  JobOpportunity, 
  StartupIdea, 
  CollaboratorProfile, 
  CollaborationRequest, 
  JobApplicationRecord, 
  UserSession,
  ApplicationTrackingStatus,
  RequestStatus,
  AppNotification
} from './types';
import { ThinkoraService } from './services/api';

export default function App() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // App datasets
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<JobApplicationRecord[]>([]);
  const [ideas, setIdeas] = useState<StartupIdea[]>([]);
  const [collaborators, setCollaborators] = useState<CollaboratorProfile[]>([]);
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Navigation parameter passes (e.g. from dashboard search)
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [jobFilterType, setJobFilterType] = useState('All');

  // Modal active states
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [trackingJob, setTrackingJob] = useState<JobOpportunity | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<StartupIdea | null>(null);
  const [editingIdea, setEditingIdea] = useState<StartupIdea | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [pitchTargetPeer, setPitchTargetPeer] = useState<CollaboratorProfile | null>(null);
  const [pitchTargetIdea, setPitchTargetIdea] = useState<StartupIdea | null>(null);

  // Check active authentication session on startup
  useEffect(() => {
    let isMounted = true;
    async function initSession() {
      try {
        const session = await ThinkoraService.checkSession();
        if (isMounted) {
          if (session) {
            setCurrentUser(session);
          } else {
            setCurrentUser(null);
          }
        }
      } catch (err) {
        if (isMounted) setCurrentUser(null);
      } finally {
        if (isMounted) setIsCheckingSession(false);
      }
    }
    initSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Refresh user-specific and platform data
  const refreshData = async (activeUserId?: string) => {
    try {
      const [allJobs, allIdeas, allCollabs] = await Promise.all([
        ThinkoraService.getJobs(),
        ThinkoraService.getIdeas(),
        ThinkoraService.getCollaborators(),
      ]);
      setJobs(allJobs);
      setIdeas(allIdeas);
      setCollaborators(allCollabs);

      if (activeUserId) {
        const [saved, apps, allReqs, notifs] = await Promise.all([
          ThinkoraService.getSavedJobIds(activeUserId),
          ThinkoraService.getApplications(activeUserId),
          ThinkoraService.getCollaborationRequests(activeUserId),
          ThinkoraService.getNotifications(activeUserId),
        ]);
        setSavedJobIds(saved);
        setApplications(apps);
        setRequests(allReqs);
        setNotifications(notifs);
      } else {
        setSavedJobIds([]);
        setApplications([]);
        setRequests([]);
        setNotifications([]);
      }
    } catch (e) {
      console.error('Failed to load Thinkora data', e);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      refreshData(currentUser.id);
    }
  }, [currentUser?.id]);

  // Auth actions
  const handleAuthSuccess = (user: UserSession) => {
    setCurrentUser(user);
    setCurrentTab('dashboard');
    refreshData(user.id);
  };

  const handleLogout = () => {
    ThinkoraService.logout();
    setCurrentUser(null);
    setSavedJobIds([]);
    setApplications([]);
    setRequests([]);
    setNotifications([]);
    setCurrentTab('dashboard');
  };

  // Navigation router helper
  const handleNavigate = (
    tab: NavTab, 
    params?: { query?: string; category?: string; filterType?: string }
  ) => {
    if (!currentUser) return;
    if (params?.query !== undefined) {
      setJobSearchQuery(params.query);
    }
    if (params?.filterType !== undefined) {
      setJobFilterType(params.filterType);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Job Bookmark toggle
  const handleToggleSaveJob = async (jobId: string) => {
    if (!currentUser) return;
    const updated = await ThinkoraService.toggleSaveJob(jobId, currentUser.id);
    setSavedJobIds(updated);
  };

  // Application tracker update
  const handleUpdateApplicationStatus = async (
    jobId: string, 
    status: ApplicationTrackingStatus
  ) => {
    if (!currentUser) return;
    const updated = await ThinkoraService.trackApplication(jobId, status, '', currentUser.id);
    setApplications((prev) => {
      const idx = prev.findIndex((a) => a.id === updated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
  };

  // Startup ideas actions
  const handleIdeaSaved = (saved: StartupIdea) => {
    setIdeas((prev) => {
      const idx = prev.findIndex((i) => i.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setSelectedIdea(saved);
  };

  const handleDeleteIdea = async (ideaId: string) => {
    await ThinkoraService.deleteIdea(ideaId);
    setIdeas((prev) => prev.filter((i) => i.id !== ideaId));
    if (selectedIdea?.id === ideaId) {
      setSelectedIdea(null);
    }
  };

  // Collaboration request update
  const handleUpdateRequestStatus = async (requestId: string, status: RequestStatus) => {
    const updated = await ThinkoraService.updateCollaborationRequestStatus(requestId, status);
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? updated : r))
    );
  };

  // Notification actions
  const handleMarkNotificationRead = async (id: string) => {
    await ThinkoraService.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = async () => {
    if (!currentUser) return;
    await ThinkoraService.markAllNotificationsRead(currentUser.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationNavigate = (tab: string, id?: string) => {
    if (tab === 'jobs') {
      setCurrentTab('jobs');
      if (id) {
        const targetJob = jobs.find((j) => j.id === id);
        if (targetJob) setSelectedJob(targetJob);
      }
    } else if (tab === 'startups') {
      setCurrentTab('startups');
      if (id) {
        const targetIdea = ideas.find((i) => i.id === id);
        if (targetIdea) setSelectedIdea(targetIdea);
      }
    } else if (tab === 'profile') {
      setCurrentTab('profile');
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // 1. Loading splash while verifying session (prevents dashboard flash)
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-150">
          <div className="w-16 h-16 rounded-2xl bg-[#0B1B3D] border border-blue-900/30 shadow-lg overflow-hidden p-0.5 flex items-center justify-center animate-pulse">
            <img
              src="/thinkora-logo.jpg"
              alt="Thinkora"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-center">
            <p className="font-extrabold text-xl text-slate-900 tracking-tight">Thinkora</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Checking student authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Visitor: Show dedicated Sign In / Register Page (FIX 1 & FIX 4)
  if (!currentUser) {
    return (
      <WelcomeAuthView
        onSuccess={handleAuthSuccess}
      />
    );
  }

  // 3. Authenticated Session: Render Protected Application
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white pb-14 md:pb-0">
      
      {/* Universal Desktop & Mobile Header with Fixed Wordmark & Emblem */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Protected Main Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Protected Page: Student Dashboard */}
        {currentTab === 'dashboard' && (
          <StudentDashboard
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onSelectJob={(job) => setSelectedJob(job)}
            onSelectIdea={(idea) => setSelectedIdea(idea)}
            onOpenShareIdeaModal={() => setIsShareModalOpen(true)}
          />
        )}

        {/* Protected Page: Verified Jobs & Internships */}
        {currentTab === 'jobs' && (
          <JobsListing
            jobs={jobs}
            savedJobIds={savedJobIds}
            initialSearchQuery={jobSearchQuery}
            initialFilterType={jobFilterType}
            onSelectJob={(job) => setSelectedJob(job)}
            onToggleSave={handleToggleSaveJob}
            onBack={() => handleNavigate('dashboard')}
          />
        )}

        {/* Protected Page: Startup Ideas & Collaboration */}
        {currentTab === 'startups' && (
          <StartupIdeasListing
            ideas={ideas}
            currentUser={currentUser}
            onSelectIdea={(idea) => setSelectedIdea(idea)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onBack={() => handleNavigate('dashboard')}
          />
        )}

        {/* Protected Page: Collaborators Directory */}
        {currentTab === 'collaborators' && (
          <CollaboratorsDirectory
            collaborators={collaborators}
            requests={requests}
            currentUser={currentUser}
            onOpenPitchModal={(peer) => {
              setPitchTargetPeer(peer);
              setPitchTargetIdea(null);
            }}
            onBack={() => handleNavigate('dashboard')}
          />
        )}

        {/* Protected Page: Saved Opportunities & Tracker */}
        {currentTab === 'saved' && (
          <StudentProfileView
            currentUser={currentUser}
            allJobs={jobs}
            savedJobIds={savedJobIds}
            applications={applications}
            ideas={ideas}
            requests={requests}
            onSelectJob={(job) => setSelectedJob(job)}
            onSelectIdea={(idea) => setSelectedIdea(idea)}
            onToggleSaveJob={handleToggleSaveJob}
            onOpenEditIdea={(idea) => setEditingIdea(idea)}
            onDeleteIdea={handleDeleteIdea}
            onOpenShareIdeaModal={() => setIsShareModalOpen(true)}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onProfileUpdated={(up) => setCurrentUser(up)}
            onLogout={handleLogout}
            defaultMenu="saved"
          />
        )}

        {/* Protected Page: Student Profile & Settings */}
        {currentTab === 'profile' && (
          <StudentProfileView
            currentUser={currentUser}
            allJobs={jobs}
            savedJobIds={savedJobIds}
            applications={applications}
            ideas={ideas}
            requests={requests}
            onSelectJob={(job) => setSelectedJob(job)}
            onSelectIdea={(idea) => setSelectedIdea(idea)}
            onToggleSaveJob={handleToggleSaveJob}
            onOpenEditIdea={(idea) => setEditingIdea(idea)}
            onDeleteIdea={handleDeleteIdea}
            onOpenShareIdeaModal={() => setIsShareModalOpen(true)}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onProfileUpdated={(up) => setCurrentUser(up)}
            onLogout={handleLogout}
            defaultMenu="profile"
          />
        )}

      </main>

      {/* Universal Footer */}
      <Footer onSelectTab={handleNavigate} />

      {/* --- Global Modals, Panels & Dialogs --- */}

      {/* Notifications Drawer */}
      <NotificationPanel
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onNavigateToItem={handleNotificationNavigate}
      />

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isSaved={savedJobIds.includes(selectedJob.id)}
          onToggleSave={handleToggleSaveJob}
          onClose={() => setSelectedJob(null)}
          onOpenTracker={(job) => {
            setSelectedJob(null);
            setTrackingJob(job);
          }}
        />
      )}

      {/* Application Tracker Modal */}
      {trackingJob && (
        <ApplicationTrackerModal
          job={trackingJob}
          existingRecord={applications.find((a) => a.jobId === trackingJob.id)}
          onSaved={(record) => {
            setApplications((prev) => {
              const idx = prev.findIndex((a) => a.id === record.id);
              if (idx >= 0) {
                const copy = [...prev];
                copy[idx] = record;
                return copy;
              }
              return [record, ...prev];
            });
            setTrackingJob(null);
          }}
          onClose={() => setTrackingJob(null)}
        />
      )}

      {/* Startup Idea Details Modal */}
      {selectedIdea && (
        <StartupIdeaDetailsModal
          idea={selectedIdea}
          currentUser={currentUser}
          onClose={() => setSelectedIdea(null)}
          onJoinPitch={(idea) => {
            setSelectedIdea(null);
            setPitchTargetIdea(idea);
            setPitchTargetPeer(null);
          }}
          onEditIdea={(idea) => {
            setSelectedIdea(null);
            setEditingIdea(idea);
          }}
          onDeleteIdea={handleDeleteIdea}
        />
      )}

      {/* Share / Edit Idea Modal */}
      {(isShareModalOpen || editingIdea) && (
        <ShareIdeaModal
          initialIdea={editingIdea}
          onSaved={(saved) => {
            handleIdeaSaved(saved);
            setIsShareModalOpen(false);
            setEditingIdea(null);
          }}
          onClose={() => {
            setIsShareModalOpen(false);
            setEditingIdea(null);
          }}
        />
      )}

      {/* Connect & Pitch Modal */}
      {(pitchTargetPeer || pitchTargetIdea) && (
        <ConnectPitchModal
          collaborator={pitchTargetPeer}
          targetIdea={pitchTargetIdea}
          onSuccess={() => {
            refreshData(currentUser.id);
          }}
          onClose={() => {
            setPitchTargetPeer(null);
            setPitchTargetIdea(null);
          }}
        />
      )}

    </div>
  );
}
