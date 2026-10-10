import { 
  JobOpportunity, 
  StartupIdea, 
  CollaboratorProfile, 
  CollaborationRequest, 
  JobApplicationRecord,
  UserSession,
  RequestStatus,
  AppNotification
} from '../types';
import { 
  SEED_JOBS, 
  SEED_IDEAS, 
  SEED_COLLABORATORS
} from '../data/seedData';

const STORAGE_KEYS = {
  USER: 'thinkora_auth_user',
  TOKEN: 'thinkora_auth_token',
  SAVED_JOBS: 'thinkora_saved_job_ids',
  APPLICATIONS: 'thinkora_applications',
  IDEAS: 'thinkora_custom_ideas',
  REQUESTS: 'thinkora_custom_requests',
  NOTIFICATIONS: 'thinkora_notifications',
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    return JSON.parse(val) as T;
  } catch (e) {
    console.error('Storage parse error', e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export class ThinkoraService {
  // --- Auth & Session ---

  static getCurrentUser(): UserSession | null {
    const saved = getStored<UserSession | null>(STORAGE_KEYS.USER, null);
    return saved;
  }

  static getToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: UserSession): void {
    setStored(STORAGE_KEYS.USER, user);
  }

  static logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (e) {
      console.error('Logout storage cleanup error', e);
    }
  }

  // Session verification from server to restore active authenticated session
  static async checkSession(): Promise<UserSession | null> {
    const token = this.getToken();
    if (!token) {
      this.logout();
      return null;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const session: UserSession = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          initials: data.profile?.initials || data.user.name.slice(0, 2).toUpperCase(),
          university: data.profile?.university || '',
          degree: data.profile?.degree || 'B.S.',
          major: data.profile?.major || '',
          graduationYear: data.profile?.graduationYear || '',
          bio: data.profile?.bio || '',
          skills: data.profile?.skills || [],
          interests: data.profile?.interests || [],
          avatarUrl: data.profile?.avatarUrl,
        };
        this.setCurrentUser(session);
        return session;
      } else {
        // Invalid or expired session
        this.logout();
        return null;
      }
    } catch (e) {
      // If server unreachable, check if local cached session is intact
      const local = this.getCurrentUser();
      return local;
    }
  }

  static async login(email: string, password: string): Promise<{ user: UserSession; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    if (!res.ok) {
      let errorMsg = 'Invalid email or password. Please verify your credentials.';
      try {
        const errData = await res.json();
        if (errData.error) errorMsg = errData.error;
      } catch {}
      throw new Error(errorMsg);
    }

    const data = await res.json();
    const session: UserSession = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      initials: data.profile?.initials || data.user.name.slice(0, 2).toUpperCase(),
      university: data.profile?.university || '',
      degree: data.profile?.degree || 'B.S.',
      major: data.profile?.major || '',
      graduationYear: data.profile?.graduationYear || '',
      bio: data.profile?.bio || '',
      skills: data.profile?.skills || [],
      interests: data.profile?.interests || [],
      avatarUrl: data.profile?.avatarUrl,
    };

    this.setCurrentUser(session);
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    } catch {}

    return { user: session, token: data.token };
  }

  static async register(data: {
    name: string;
    email: string;
    password: string;
    university?: string;
    major?: string;
    graduationYear?: string;
  }): Promise<{ user: UserSession; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let errorMsg = 'Registration failed. Please check your details.';
      try {
        const errData = await res.json();
        if (errData.error) errorMsg = errData.error;
      } catch {}
      throw new Error(errorMsg);
    }

    const result = await res.json();
    const session: UserSession = {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      initials: result.profile.initials,
      university: result.profile.university,
      degree: result.profile.degree,
      major: result.profile.major,
      graduationYear: result.profile.graduationYear,
      bio: result.profile.bio,
      skills: result.profile.skills,
      interests: result.profile.interests,
      avatarUrl: result.profile.avatarUrl,
    };

    this.setCurrentUser(session);
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
    } catch {}

    return { user: session, token: result.token };
  }

  static async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    });

    if (!res.ok) {
      throw new Error('Unable to process password reset request at this time.');
    }
    return await res.json();
  }

  // --- Module A: Jobs & Internships ---

  static async getJobs(): Promise<JobOpportunity[]> {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Using client fallback for jobs', e);
    }
    return SEED_JOBS;
  }

  static async getJobById(id: string): Promise<JobOpportunity | null> {
    try {
      const res = await fetch(`/api/jobs/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    const local = SEED_JOBS.find((j) => j.id === id);
    return local || null;
  }

  static async getSavedJobIds(userId?: string): Promise<string[]> {
    if (!userId) return [];
    try {
      const res = await fetch(`/api/saved-jobs?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    const key = `${STORAGE_KEYS.SAVED_JOBS}_${userId}`;
    return getStored<string[]>(key, []);
  }

  static async toggleSaveJob(jobId: string, userId?: string): Promise<string[]> {
    if (!userId) return [];
    try {
      const res = await fetch('/api/saved-jobs/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, jobId }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.savedJobIds;
      }
    } catch (e) {}

    const key = `${STORAGE_KEYS.SAVED_JOBS}_${userId}`;
    const cur = getStored<string[]>(key, []);
    let updated: string[];
    if (cur.includes(jobId)) {
      updated = cur.filter((id) => id !== jobId);
    } else {
      updated = [...cur, jobId];
    }
    setStored(key, updated);
    return updated;
  }

  static async getApplications(userId?: string): Promise<JobApplicationRecord[]> {
    if (!userId) return [];
    try {
      const res = await fetch(`/api/applications?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    const key = `${STORAGE_KEYS.APPLICATIONS}_${userId}`;
    return getStored<JobApplicationRecord[]>(key, []);
  }

  static async trackApplication(
    jobId: string, 
    status: any, 
    notes = '', 
    userId?: string
  ): Promise<JobApplicationRecord> {
    if (!userId) {
      throw new Error('User authentication required to track applications');
    }
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, jobId, status, notes }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    const key = `${STORAGE_KEYS.APPLICATIONS}_${userId}`;
    const all = getStored<JobApplicationRecord[]>(key, []);
    const now = new Date().toISOString().split('T')[0];
    const existingIdx = all.findIndex((a) => a.jobId === jobId && a.userId === userId);

    if (existingIdx >= 0) {
      all[existingIdx].status = status;
      all[existingIdx].notes = notes;
      all[existingIdx].lastUpdated = now;
      setStored(key, all);
      return all[existingIdx];
    }

    const created: JobApplicationRecord = {
      id: `app-${Date.now()}`,
      jobId,
      userId,
      status,
      appliedDate: now,
      notes,
      lastUpdated: now,
    };
    all.push(created);
    setStored(key, all);
    return created;
  }

  // --- Module B: Startup Ideas & Collaboration ---

  static async getIdeas(): Promise<StartupIdea[]> {
    try {
      const res = await fetch('/api/ideas');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return SEED_IDEAS;
  }

  static async createIdea(ideaData: Omit<StartupIdea, 'id' | 'createdAt' | 'updatedAt' | 'interestedCount' | 'collaboratorIds'>): Promise<StartupIdea> {
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ideaData),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    const now = new Date().toISOString().split('T')[0];
    const newIdea: StartupIdea = {
      ...ideaData,
      id: `idea-${Date.now()}`,
      interestedCount: 1,
      collaboratorIds: [ideaData.creatorId],
      createdAt: now,
      updatedAt: now,
    };
    const stored = getStored<StartupIdea[]>(STORAGE_KEYS.IDEAS, []);
    setStored(STORAGE_KEYS.IDEAS, [newIdea, ...stored]);
    return newIdea;
  }

  static async updateIdea(ideaId: string, updates: Partial<StartupIdea>): Promise<StartupIdea> {
    try {
      const res = await fetch(`/api/ideas/${ideaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    const ideas = await this.getIdeas();
    const idx = ideas.findIndex((i) => i.id === ideaId);
    if (idx >= 0) {
      ideas[idx] = { ...ideas[idx], ...updates, updatedAt: new Date().toISOString().split('T')[0] };
      setStored(STORAGE_KEYS.IDEAS, ideas);
      return ideas[idx];
    }
    throw new Error('Idea not found');
  }

  static async deleteIdea(ideaId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/ideas/${ideaId}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch (e) {}
    const stored = getStored<StartupIdea[]>(STORAGE_KEYS.IDEAS, []);
    setStored(STORAGE_KEYS.IDEAS, stored.filter((i) => i.id !== ideaId));
    return true;
  }

  // --- Collaborators Directory & Pitches ---

  static async getCollaborators(): Promise<CollaboratorProfile[]> {
    try {
      const res = await fetch('/api/collaborators');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return SEED_COLLABORATORS;
  }

  static async getCollaborationRequests(userId?: string): Promise<CollaborationRequest[]> {
    if (!userId) return [];
    try {
      const res = await fetch(`/api/collaboration-requests?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    const key = `${STORAGE_KEYS.REQUESTS}_${userId}`;
    return getStored<CollaborationRequest[]>(key, []);
  }

  static async sendCollaborationRequest(data: {
    receiverId: string;
    senderId: string;
    senderName: string;
    senderUniversity: string;
    senderSkills: string[];
    ideaId?: string;
    ideaTitle?: string;
    message: string;
    proposedRole?: string;
  }): Promise<CollaborationRequest> {
    try {
      const res = await fetch('/api/collaboration-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    const newReq: CollaborationRequest = {
      id: `req-${Date.now()}`,
      senderId: data.senderId,
      senderName: data.senderName,
      senderUniversity: data.senderUniversity,
      senderSkills: data.senderSkills,
      receiverId: data.receiverId,
      ideaId: data.ideaId,
      ideaTitle: data.ideaTitle,
      message: data.message,
      proposedRole: data.proposedRole || 'Collaborator',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const key = `${STORAGE_KEYS.REQUESTS}_${data.senderId}`;
    const all = getStored<CollaborationRequest[]>(key, []);
    setStored(key, [newReq, ...all]);
    return newReq;
  }

  static async updateCollaborationRequestStatus(requestId: string, status: RequestStatus): Promise<CollaborationRequest> {
    try {
      const res = await fetch(`/api/collaboration-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    const currentUser = this.getCurrentUser();
    const key = currentUser ? `${STORAGE_KEYS.REQUESTS}_${currentUser.id}` : STORAGE_KEYS.REQUESTS;
    const reqs = getStored<CollaborationRequest[]>(key, []);
    const idx = reqs.findIndex((r) => r.id === requestId);
    if (idx >= 0) {
      reqs[idx].status = status;
      reqs[idx].respondedAt = new Date().toISOString().split('T')[0];
      setStored(key, reqs);
      return reqs[idx];
    }
    throw new Error('Request not found');
  }

  // --- Profile Updates ---

  static async updateProfile(profileId: string, updates: Partial<CollaboratorProfile>): Promise<CollaboratorProfile> {
    try {
      const res = await fetch(`/api/profile/${profileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        // Sync local current user session if it matches
        const current = this.getCurrentUser();
        if (current && current.id === profileId) {
          const newSession: UserSession = {
            ...current,
            name: updated.name || current.name,
            university: updated.university || current.university,
            major: updated.major || current.major,
            graduationYear: updated.graduationYear || current.graduationYear,
            bio: updated.bio || current.bio,
            skills: updated.skills || current.skills,
            interests: updated.interests || current.interests,
            avatarUrl: updated.avatarUrl || current.avatarUrl,
          };
          this.setCurrentUser(newSession);
        }
        return updated;
      }
    } catch (e) {}

    const current = this.getCurrentUser();
    if (current && current.id === profileId) {
      const merged: UserSession = { ...current, ...updates };
      this.setCurrentUser(merged);
      return merged as any;
    }
    throw new Error('Profile update failed');
  }

  // --- Notifications ---

  static async getNotifications(userId?: string): Promise<AppNotification[]> {
    if (!userId) return [];
    try {
      const res = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    const key = `${STORAGE_KEYS.NOTIFICATIONS}_${userId}`;
    return getStored<AppNotification[]>(key, []);
  }

  static async markNotificationRead(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      if (res.ok) return true;
    } catch (e) {}
    return true;
  }

  static async markAllNotificationsRead(userId?: string): Promise<boolean> {
    if (!userId) return true;
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) return true;
    } catch (e) {}
    return true;
  }
}
