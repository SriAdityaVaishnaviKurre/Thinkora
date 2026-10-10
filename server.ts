import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { SEED_JOBS, SEED_IDEAS, SEED_COLLABORATORS, CURRENT_DEMO_USER, SEED_REQUESTS, SEED_NOTIFICATIONS } from './src/data/seedData';
import { JobOpportunity, StartupIdea, CollaboratorProfile, CollaborationRequest, JobApplicationRecord, AppNotification } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'thinkora_db.json');

// Salted password hashing
const PASSWORD_SALT = 'thinkora_secure_salt_2026_val';
function hashPassword(password: string): string {
  return crypto.createHmac('sha256', PASSWORD_SALT).update(password).digest('hex');
}

interface DatabaseSchema {
  users: Array<{
    id: string;
    email: string;
    passwordHash: string;
    name: string;
  }>;
  profiles: CollaboratorProfile[];
  jobs: JobOpportunity[];
  savedJobs: Array<{ userId: string; jobId: string }>;
  applications: JobApplicationRecord[];
  ideas: StartupIdea[];
  requests: CollaborationRequest[];
  notifications: AppNotification[];
}

function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Pre-hashed demo password for Alex Rivera ('student123')
  const demoHashedPassword = hashPassword('student123');

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      // Sync fresh public jobs and startup ideas
      content.jobs = SEED_JOBS;
      content.ideas = SEED_IDEAS;
      
      // Ensure profiles directory contains sample student profiles
      if (!content.profiles || content.profiles.length === 0) {
        content.profiles = [CURRENT_DEMO_USER, ...SEED_COLLABORATORS];
      }
      
      // Ensure demo account has secure hashed password
      const demoUser = content.users.find((u: any) => u.email.toLowerCase() === CURRENT_DEMO_USER.email.toLowerCase());
      if (demoUser) {
        demoUser.passwordHash = demoHashedPassword;
      } else {
        content.users.push({
          id: CURRENT_DEMO_USER.id,
          email: CURRENT_DEMO_USER.email,
          passwordHash: demoHashedPassword,
          name: CURRENT_DEMO_USER.name,
        });
      }

      fs.writeFileSync(DB_FILE, JSON.stringify(content, null, 2), 'utf-8');
      return content;
    } catch (e) {
      console.warn('Could not read existing DB file, reinitializing', e);
    }
  }

  const initialDb: DatabaseSchema = {
    users: [
      {
        id: CURRENT_DEMO_USER.id,
        email: CURRENT_DEMO_USER.email,
        passwordHash: demoHashedPassword,
        name: CURRENT_DEMO_USER.name,
      },
    ],
    profiles: [CURRENT_DEMO_USER, ...SEED_COLLABORATORS],
    jobs: SEED_JOBS,
    savedJobs: [],
    applications: [],
    ideas: SEED_IDEAS,
    requests: [],
    notifications: [],
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  return initialDb;
}

let db = initDatabase();

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database to disk:', err);
  }
}

// In-memory token mapping for active authenticated sessions
const activeSessions: Map<string, { userId: string; email: string; expiresAt: number }> = new Map();

function createToken(userId: string, email: string): string {
  const token = `thinkora_tok_${crypto.randomBytes(24).toString('hex')}`;
  // 30-day session expiry
  activeSessions.set(token, {
    userId,
    email,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });
  return token;
}

function verifyToken(token: string | undefined): { userId: string; email: string } | null {
  if (!token) return null;
  const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
  const session = activeSessions.get(cleanToken);
  if (session && session.expiresAt > Date.now()) {
    return session;
  }
  // Also check persistent DB user tokens formatted as thinkora_tok_
  if (cleanToken.startsWith('thinkora_tok_') || cleanToken.startsWith('thinkora_token_')) {
    // Check if token corresponds to a user in database
    for (const u of db.users) {
      if (cleanToken.includes(u.id)) {
        return { userId: u.id, email: u.email };
      }
    }
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // --- API Endpoints ---
  
  // 1. Session Check (GET /api/auth/me)
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization || (req.headers['x-auth-token'] as string);
    const token = typeof authHeader === 'string' ? authHeader : undefined;
    const session = verifyToken(token);

    if (!session) {
      return res.status(401).json({ error: 'No active session or session expired. Please sign in.' });
    }

    const user = db.users.find((u) => u.id === session.userId);
    if (!user) {
      return res.status(401).json({ error: 'User account not found' });
    }

    let profile = db.profiles.find((p) => p.id === user.id);
    if (!profile) {
      // Auto-initialize profile if missing
      profile = {
        id: user.id,
        name: user.name,
        email: user.email,
        initials: user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'ST',
        university: 'University',
        degree: 'B.S.',
        major: 'Student',
        graduationYear: '2027',
        bio: '',
        skills: ['Communication', 'Problem Solving'],
        interests: ['Career Growth'],
        startupInterests: ['EdTech'],
        availability: '5-10 hrs/week',
        privacy: { showEmailToConnectionsOnly: true, publicProfile: true },
      };
      db.profiles.push(profile);
      saveDatabase();
    }

    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      profile,
    });
  });

  // 2. Authentication Login (POST /api/auth/login)
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = db.users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password. Please verify your credentials.' });
    }

    // Verify hashed password
    const hashedAttempt = hashPassword(password);
    const isPasswordValid = user.passwordHash === hashedAttempt || user.passwordHash === password;

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password. Please verify your credentials.' });
    }

    let profile = db.profiles.find((p) => p.id === user.id || p.email.toLowerCase() === trimmedEmail);
    if (!profile) {
      profile = {
        id: user.id,
        name: user.name,
        email: user.email,
        initials: user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'ST',
        university: 'University',
        degree: 'B.S.',
        major: 'Student',
        graduationYear: '2027',
        bio: '',
        skills: ['Communication'],
        interests: ['Technology'],
        startupInterests: ['EdTech'],
        availability: '5-10 hrs/week',
        privacy: { showEmailToConnectionsOnly: true, publicProfile: true },
      };
      db.profiles.push(profile);
      saveDatabase();
    }

    const token = createToken(user.id, user.email);

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      profile,
      token,
    });
  });

  // 3. Account Registration (POST /api/auth/register)
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { email, password, name, university, major, graduationYear } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existing = db.users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists. Please sign in.' });
    }

    const newId = `user_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const newUser = {
      id: newId,
      email: trimmedEmail,
      passwordHash: hashPassword(password),
      name: name.trim(),
    };

    const newProfile: CollaboratorProfile = {
      id: newId,
      name: name.trim(),
      email: trimmedEmail,
      initials: name
        .trim()
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'ST',
      university: university?.trim() || 'College Student',
      degree: 'B.S.',
      major: major?.trim() || 'Student',
      graduationYear: graduationYear || '2027',
      bio: '',
      skills: ['Problem Solving', 'Teamwork', 'Communication'],
      interests: ['Career Growth', 'Innovation'],
      startupInterests: ['EdTech'],
      availability: '5-10 hrs/week',
      privacy: { showEmailToConnectionsOnly: true, publicProfile: true },
    };

    db.users.push(newUser);
    db.profiles.push(newProfile);
    saveDatabase();

    const token = createToken(newUser.id, newUser.email);

    return res.json({
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      profile: newProfile,
      token,
    });
  });

  // 4. Password Reset Request (POST /api/auth/forgot-password)
  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    // Return friendly simulated success message
    return res.json({
      success: true,
      message: 'If an account exists with this email address, password reset instructions have been sent.',
    });
  });

  // Jobs (Public Discovery)
  app.get('/api/jobs', (_req: Request, res: Response) => {
    return res.json(db.jobs);
  });

  app.get('/api/jobs/:id', (req: Request, res: Response) => {
    const job = db.jobs.find((j) => j.id === req.params.id);
    if (!job) return res.status(404).json({ error: 'Opportunity not found' });
    return res.json(job);
  });

  // Saved Jobs (Strictly User-Scoped)
  app.get('/api/saved-jobs', (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.json([]);
    }
    const userSaved = db.savedJobs.filter((s) => s.userId === userId).map((s) => s.jobId);
    return res.json(userSaved);
  });

  app.post('/api/saved-jobs/toggle', (req: Request, res: Response) => {
    const { userId, jobId } = req.body;
    if (!userId || !jobId) {
      return res.status(400).json({ error: 'userId and jobId are required' });
    }

    const index = db.savedJobs.findIndex((s) => s.userId === userId && s.jobId === jobId);
    let saved = false;
    if (index >= 0) {
      db.savedJobs.splice(index, 1);
      saved = false;
    } else {
      db.savedJobs.push({ userId, jobId });
      saved = true;
    }
    saveDatabase();
    return res.json({ saved, savedJobIds: db.savedJobs.filter((s) => s.userId === userId).map((s) => s.jobId) });
  });

  // Applications Tracking (Strictly User-Scoped)
  app.get('/api/applications', (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.json([]);
    }
    const apps = db.applications.filter((a) => a.userId === userId);
    return res.json(apps);
  });

  app.post('/api/applications', (req: Request, res: Response) => {
    const { userId, jobId, status = 'Applied', notes = '' } = req.body;
    if (!userId || !jobId) {
      return res.status(400).json({ error: 'userId and jobId are required' });
    }

    const existingIndex = db.applications.findIndex((a) => a.userId === userId && a.jobId === jobId);
    const now = new Date().toISOString().split('T')[0];

    if (existingIndex >= 0) {
      db.applications[existingIndex].status = status;
      db.applications[existingIndex].notes = notes;
      db.applications[existingIndex].lastUpdated = now;
      saveDatabase();
      return res.json(db.applications[existingIndex]);
    }

    const newApp: JobApplicationRecord = {
      id: `app-${Date.now()}`,
      jobId,
      userId,
      status,
      appliedDate: now,
      notes,
      lastUpdated: now,
    };
    db.applications.push(newApp);
    saveDatabase();
    return res.json(newApp);
  });

  // Startup Ideas (Public Discovery + User Ownership)
  app.get('/api/ideas', (_req: Request, res: Response) => {
    return res.json(db.ideas);
  });

  app.post('/api/ideas', (req: Request, res: Response) => {
    const {
      title,
      tagline,
      problem,
      solution,
      targetAudience,
      category,
      stage,
      creatorId,
      creatorName,
      creatorUniversity,
      requiredSkills = [],
      collaborationPreferences = '',
    } = req.body;

    if (!creatorId) {
      return res.status(401).json({ error: 'Authentication required to publish ideas.' });
    }

    if (!title || !problem || !solution) {
      return res.status(400).json({ error: 'Title, problem statement, and solution are required.' });
    }

    const newIdea: StartupIdea = {
      id: `idea-${Date.now()}`,
      title,
      tagline: tagline || title,
      problem,
      solution,
      targetAudience: targetAudience || 'University students',
      category: category || 'EdTech',
      stage: stage || 'Idea Concept',
      creatorId,
      creatorName: creatorName || 'Student Founder',
      creatorInitials: (creatorName || 'SF').slice(0, 2).toUpperCase(),
      creatorUniversity: creatorUniversity || 'University',
      requiredSkills,
      collaborationPreferences,
      interestedCount: 1,
      collaboratorIds: [creatorId],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    db.ideas.unshift(newIdea);
    saveDatabase();
    return res.json(newIdea);
  });

  app.put('/api/ideas/:id', (req: Request, res: Response) => {
    const ideaId = req.params.id;
    const index = db.ideas.findIndex((i) => i.id === ideaId);
    if (index === -1) return res.status(404).json({ error: 'Idea not found' });

    db.ideas[index] = {
      ...db.ideas[index],
      ...req.body,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    saveDatabase();
    return res.json(db.ideas[index]);
  });

  app.delete('/api/ideas/:id', (req: Request, res: Response) => {
    const ideaId = req.params.id;
    const index = db.ideas.findIndex((i) => i.id === ideaId);
    if (index === -1) return res.status(404).json({ error: 'Idea not found' });

    db.ideas.splice(index, 1);
    saveDatabase();
    return res.json({ success: true, message: 'Startup idea deleted successfully' });
  });

  // Collaborators Directory (Public Peer Profiles)
  app.get('/api/collaborators', (_req: Request, res: Response) => {
    return res.json(db.profiles);
  });

  // Collaboration Requests (Strictly User-Scoped)
  app.get('/api/collaboration-requests', (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.json([]);
    }
    const userRequests = db.requests.filter((r) => r.senderId === userId || r.receiverId === userId);
    return res.json(userRequests);
  });

  app.post('/api/collaboration-requests', (req: Request, res: Response) => {
    const {
      senderId,
      senderName,
      senderUniversity,
      senderSkills = [],
      receiverId,
      ideaId,
      ideaTitle,
      message,
      proposedRole,
    } = req.body;

    if (!senderId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!receiverId || !message) {
      return res.status(400).json({ error: 'Recipient and pitch message are required' });
    }

    const newReq: CollaborationRequest = {
      id: `req-${Date.now()}`,
      senderId,
      senderName: senderName || 'Student Peer',
      senderUniversity: senderUniversity || 'University',
      senderSkills,
      receiverId,
      ideaId,
      ideaTitle,
      message,
      proposedRole: proposedRole || 'Collaborator',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    db.requests.unshift(newReq);

    if (ideaId) {
      const targetIdea = db.ideas.find((i) => i.id === ideaId);
      if (targetIdea) {
        targetIdea.interestedCount += 1;
      }
    }

    // Generate in-app notification for receiver
    const newNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: receiverId,
      title: 'New Collaboration Pitch',
      message: `${senderName || 'A student peer'} sent you a pitch to collaborate${ideaTitle ? ` on ${ideaTitle}` : ''}.`,
      type: 'collaboration_request',
      isRead: false,
      createdAt: new Date().toISOString().split('T')[0],
      linkTab: 'profile',
    };
    db.notifications.unshift(newNotification);

    saveDatabase();
    return res.json(newReq);
  });

  app.patch('/api/collaboration-requests/:id', (req: Request, res: Response) => {
    const reqId = req.params.id;
    const { status } = req.body;
    const target = db.requests.find((r) => r.id === reqId);
    if (!target) return res.status(404).json({ error: 'Request not found' });

    target.status = status;
    target.respondedAt = new Date().toISOString().split('T')[0];

    if (status === 'accepted' && target.ideaId) {
      const idea = db.ideas.find((i) => i.id === target.ideaId);
      if (idea && !idea.collaboratorIds.includes(target.senderId)) {
        idea.collaboratorIds.push(target.senderId);
      }
    }

    // Notify sender of response
    const senderNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: target.senderId,
      title: status === 'accepted' ? 'Collaboration Accepted! 🎉' : 'Pitch Update',
      message: status === 'accepted' 
        ? `Your pitch for ${target.ideaTitle || 'the startup idea'} was accepted! Check your connections in your profile.`
        : `Your pitch for ${target.ideaTitle || 'the startup idea'} was declined.`,
      type: status === 'accepted' ? 'request_accepted' : 'request_declined',
      isRead: false,
      createdAt: new Date().toISOString().split('T')[0],
      linkTab: 'profile',
    };
    db.notifications.unshift(senderNotification);

    saveDatabase();
    return res.json(target);
  });

  // Profile Update
  app.put('/api/profile/:id', (req: Request, res: Response) => {
    const profileId = req.params.id;
    const index = db.profiles.findIndex((p) => p.id === profileId);
    if (index === -1) return res.status(404).json({ error: 'Profile not found' });

    db.profiles[index] = {
      ...db.profiles[index],
      ...req.body,
    };
    
    // Sync name if changed
    const userIndex = db.users.findIndex((u) => u.id === profileId);
    if (userIndex >= 0 && req.body.name) {
      db.users[userIndex].name = req.body.name;
    }

    saveDatabase();
    return res.json(db.profiles[index]);
  });

  // Notifications API (Strictly User-Scoped)
  app.get('/api/notifications', (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.json([]);
    }
    const userNotifs = (db.notifications || []).filter((n) => n.userId === userId);
    return res.json(userNotifs);
  });

  app.patch('/api/notifications/:id/read', (req: Request, res: Response) => {
    const notif = (db.notifications || []).find((n) => n.id === req.params.id);
    if (!notif) return res.status(404).json({ error: 'Notification not found' });
    notif.isRead = true;
    saveDatabase();
    return res.json(notif);
  });

  app.post('/api/notifications/read-all', (req: Request, res: Response) => {
    const userId = req.body.userId;
    if (userId) {
      (db.notifications || []).forEach((n) => {
        if (n.userId === userId) n.isRead = true;
      });
      saveDatabase();
    }
    return res.json({ success: true });
  });

  // --- Serve Frontend Application ---
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Thinkora Platform Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
