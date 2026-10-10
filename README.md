# Thinkora — Student Career & Startup Platform

> **"Real Opportunities. Real People. Real Growth."**

Thinkora is a student-focused web platform designed to empower college students and fresh graduates through two distinct, purposefully separated modules:

1. **Module A — Verified Jobs & Internships:** Helps students discover legitimate career opportunities, early-career internships, and co-ops while actively screening and assessing potential job scams using transparent credibility checklists.
2. **Module B — Startup Ideas & Collaboration:** Gives student innovators a space to pitch startup concepts, explore peers' projects, find co-founders by skill sets, and form multidisciplinary teams.

---

## 1. Visual Style & User Experience

- **Design Aesthetic:** Deep navy blue (`#0f172a`, `#1e3a8a`) and bright blue (`#2563eb`), clean light background (`#f8fafc`), and modern typography powered by `Plus Jakarta Sans`.
- **Emblem:** Custom Thinkora lightbulb mark representing student ideation and innovation.
- **Responsive Views:** Desktop, tablet, and mobile layouts with adaptive touch drawers and sticky navigation.
- **Reference Screens Built:**
  1. Welcome & Onboarding
  2. Create Account & Student Log In
  3. Student Dashboard
  4. Jobs & Internships Listing (with trust filters)
  5. Job Details (with 5-point credibility checklist and scam warnings)
  6. Startup Ideas Listing (Explore, Trending, My Ideas)
  7. Startup Idea Details (with collaboration pitch actions)
  8. Collaborators Directory (multidisciplinary student talent)
  9. Student Profile & Saved Opportunities / Application Lifecycle Tracker

---

## 2. Architecture & Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React icons
- **Backend:** Node.js & Express (`server.ts`) with REST API endpoints
- **Database & Storage:** Structured persistent JSON file store (`data/thinkora_db.json`) with client-side optimistic synchronization
- **Authentication:** Student session management with password masking and validation
- **Build Tool:** Vite 8

---

## 3. Database Schema

The database model is defined across 7 collections:

```typescript
// Users & Authentication
interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
}

// Student Profiles
interface CollaboratorProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  degree: string;
  major: string;
  graduationYear: string;
  bio: string;
  skills: string[];
  interests: string[];
  startupInterests: string[];
  availability: string;
  privacy: {
    showEmailToConnectionsOnly: boolean;
    publicProfile: boolean;
  };
}

// Job & Internship Opportunities
interface JobOpportunity {
  id: string;
  title: string;
  companyName: string;
  companyWebsite: string;
  companyEmailDomain: string;
  location: string;
  workMode: 'Remote' | 'On-site' | 'Hybrid';
  type: 'Internship' | 'Full-time' | 'Part-time' | 'Co-op';
  compensation: string;
  postedDate: string;
  applicationDeadline: string;
  shortDescription: string;
  fullDescription: string;
  responsibilities: string[];
  eligibility: string[];
  requiredSkills: string[];
  verificationStatus: 'Verified' | 'Pending Review' | 'Unable to Verify' | 'Potential Risk';
  verificationEvidence: {
    officialEmailVerified: boolean;
    companyRegistrationConfirmed: boolean;
    domainMatchesApplicationUrl: boolean;
    noUpfrontFeeRequired: boolean;
    clearJobScope: boolean;
    warningReasons?: string[];
  };
  credibilityChecks: CredibilityCheck[];
  applicationUrl: string;
  isDemoListing: boolean;
}

// Saved Jobs
interface SavedJob {
  userId: string;
  jobId: string;
}

// Applications Tracking
interface JobApplicationRecord {
  id: string;
  jobId: string;
  userId: string;
  status: 'Interested' | 'Applied' | 'Interview' | 'Offer' | 'Closed';
  appliedDate: string;
  notes: string;
  lastUpdated: string;
}

// Startup Ideas
interface StartupIdea {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  targetAudience: string;
  category: string;
  stage: 'Idea Concept' | 'Prototype' | 'Building MVP' | 'Launched Beta';
  creatorId: string;
  creatorName: string;
  creatorUniversity: string;
  requiredSkills: string[];
  collaborationPreferences: string;
  interestedCount: number;
  collaboratorIds: string[];
}

// Collaboration Requests
interface CollaborationRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderUniversity: string;
  receiverId: string;
  ideaId?: string;
  ideaTitle?: string;
  message: string;
  proposedRole: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}
```

---

## 4. Trust & Safety Features (Scam Defense)

Thinkora implements transparent rule-based checks:
1. **Official Recruiter Email Domain:** Cross-checks recruiter email MX domain with verified employer web domain (flags free webmails like `@gmail.com`).
2. **Registered Business Identity:** Confirms company active status and physical presence.
3. **Application URL Consistency:** Verifies that links route directly to the employer's official ATS or portal, preventing phishing redirects.
4. **Zero Upfront Fees Policy:** Flags any postings demanding applicant fees for "onboarding equipment", "background checks", or "security badges".
5. **Realistic Compensation Benchmark:** Flags abnormally high compensation for unskilled tasks.

---

## 5. Getting Started & Running Locally

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd thinkora

# Install dependencies
npm install
```

### Running in Development

```bash
# Starts full-stack Express server with Vite middleware on port 3000
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

---

## 6. Demo Account Credentials

For instant evaluation, you can use the pre-configured student profile:
- **Email:** `alex.rivera@stanford.edu`
- **Password:** `demo1234`
- Or click **"Sign In as Demo Student"** on the Welcome / Onboarding screen.
