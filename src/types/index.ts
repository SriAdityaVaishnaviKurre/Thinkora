export type VerificationStatus = 'Verified' | 'Pending Review' | 'Unable to Verify' | 'Potential Risk';

export interface CredibilityCheck {
  id: string;
  name: string;
  passed: boolean;
  severity: 'low' | 'medium' | 'high';
  detail: string;
}

export interface JobOpportunity {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl?: string;
  companyInitials: string;
  companyWebsite: string;
  companyEmailDomain: string;
  location: string;
  workMode: 'Remote' | 'On-site' | 'Hybrid';
  type: 'Internship' | 'Full-time' | 'Part-time' | 'Co-op';
  experienceLevel: 'Student / Intern' | 'Entry-Level (0-2 yrs)' | 'Junior (1-3 yrs)';
  duration?: string;
  compensation: string;
  postedDate: string;
  applicationDeadline: string;
  shortDescription: string;
  fullDescription: string;
  responsibilities: string[];
  eligibility: string[];
  requiredSkills: string[];
  verificationStatus: VerificationStatus;
  verificationEvidence: {
    officialEmailVerified: boolean;
    companyRegistrationConfirmed: boolean;
    domainMatchesApplicationUrl: boolean;
    noUpfrontFeeRequired: boolean;
    clearJobScope: boolean;
    notes: string;
    warningReasons?: string[];
  };
  credibilityChecks: CredibilityCheck[];
  applicationUrl: string;
  applicationInstructions?: string;
  isDemoListing: boolean;
}

export type ApplicationTrackingStatus = 'Interested' | 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Closed';

export interface JobApplicationRecord {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationTrackingStatus;
  appliedDate: string;
  notes: string;
  lastUpdated: string;
}

export type StartupCategory = 
  | 'EdTech'
  | 'AI & Machine Learning'
  | 'HealthTech'
  | 'CleanTech & Climate'
  | 'Fintech'
  | 'Campus Life'
  | 'Social Impact'
  | 'Dev Tools & Open Source';

export type StartupStage = 'Idea Concept' | 'Prototype' | 'Building MVP' | 'Launched Beta';

export interface StartupIdea {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  targetAudience: string;
  category: StartupCategory;
  stage: StartupStage;
  creatorId: string;
  creatorName: string;
  creatorAvatarUrl?: string;
  creatorInitials: string;
  creatorUniversity: string;
  requiredSkills: string[];
  desiredRoles?: string[];
  collaborationPreferences: string;
  interestedCount: number;
  collaboratorIds: string[];
  createdAt: string;
  updatedAt: string;
  projectLinks?: {
    github?: string;
    demo?: string;
    pitchDeck?: string;
  };
}

export interface CollaboratorProfile {
  id: string;
  name: string;
  email: string;
  roleType?: 'Student' | 'Mentor';
  avatarUrl?: string;
  initials: string;
  university: string;
  degree: string;
  major: string;
  graduationYear: string;
  bio: string;
  skills: string[];
  interests: string[];
  startupInterests: StartupCategory[];
  availability: '1-5 hrs/week' | '5-10 hrs/week' | '10-20 hrs/week' | 'Full-time Summer';
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  privacy: {
    showEmailToConnectionsOnly: boolean;
    publicProfile: boolean;
  };
}

export type RequestStatus = 'pending' | 'accepted' | 'declined';

export interface CollaborationRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  senderUniversity: string;
  senderSkills: string[];
  receiverId: string;
  ideaId?: string;
  ideaTitle?: string;
  message: string;
  proposedRole: string;
  status: RequestStatus;
  createdAt: string;
  respondedAt?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'collaboration_request' | 'request_accepted' | 'request_declined' | 'job_alert' | 'system';
  isRead: boolean;
  createdAt: string;
  linkTab?: string;
  linkId?: string;
}

export interface UserPreferences {
  profileVisibility: 'public' | 'students_only' | 'private';
  notificationEmail: boolean;
  notificationPush: boolean;
  allowCollaborationInvites: boolean;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
  university: string;
  degree: string;
  major: string;
  graduationYear: string;
  bio: string;
  skills: string[];
  interests: string[];
}
