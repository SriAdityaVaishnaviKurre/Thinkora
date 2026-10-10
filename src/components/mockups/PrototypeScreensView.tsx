import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { PhoneFrame } from './PhoneFrame';
import { 
  WelcomeMockup,
  CreateAccountMockup,
  HomeMockup,
  JobsMockup,
  StartupsMockup,
  IdeaDetailsMockup,
  CollaboratorsMockup,
  ProfileMockup
} from './MobileMockupScreens';
import { 
  Smartphone, 
  LayoutGrid, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Users,
  Compass
} from 'lucide-react';

interface PrototypeScreensViewProps {
  onOpenWebApp?: () => void;
}

export const PrototypeScreensView: React.FC<PrototypeScreensViewProps> = ({ onOpenWebApp }) => {
  const [activeInteractiveScreen, setActiveInteractiveScreen] = useState<string | null>(null);

  const screens = [
    { id: 'welcome', title: '1. Welcome / Onboarding', component: <WelcomeMockup onNavigate={(s) => setActiveInteractiveScreen(s)} /> },
    { id: 'create-account', title: '2. Create Account', component: <CreateAccountMockup onNavigate={(s) => setActiveInteractiveScreen(s)} /> },
    { id: 'home', title: '3. Student Dashboard', component: <HomeMockup onNavigate={(s) => setActiveInteractiveScreen(s)} /> },
    { id: 'jobs', title: '4. Verified Jobs & Internships', component: <JobsMockup onNavigate={(s) => setActiveInteractiveScreen(s)} /> },
    { id: 'startups', title: '5. Startup Ideas Listing', component: <StartupsMockup onNavigate={(s) => setActiveInteractiveScreen(s)} /> },
    { id: 'idea-details', title: '6. Startup Idea Details', component: <IdeaDetailsMockup onNavigate={(s) => setActiveInteractiveScreen(s)} /> },
    { id: 'collaborators', title: '7. Collaborators Directory', component: <CollaboratorsMockup onNavigate={(s) => setActiveInteractiveScreen(s)} /> },
    { id: 'profile', title: '8. Student Profile', component: <ProfileMockup onNavigate={(s) => setActiveInteractiveScreen(s)} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f3f6fa] text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Top Banner with Mode Controls */}
      <div className="max-w-[1720px] mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <div className="h-4 w-px bg-slate-200"></div>
          <span className="text-xs font-semibold text-slate-600">
            Figma Prototype Master Layout & Functional Simulator
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onOpenWebApp && (
            <button
              onClick={onOpenWebApp}
              className="px-4 py-2 bg-[#0c5beb] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Open Expanded Web Platform</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Container: Left Branding Section + 8 Phone Mockups Grid (matching image.png) */}
      <div className="max-w-[1720px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left-Side Branding Column (Faithful recreation from image.png) */}
        <div className="xl:col-span-3 sticky top-6 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="space-y-4">
            <Logo size="lg" />

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162d59] tracking-tight leading-tight">
              Real Opportunities.<br />Real People. Real Growth.
            </h2>

            {/* Divider Line */}
            <div className="w-16 h-0.5 bg-[#162d59]/30 my-4" />

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              A platform for students to find verified jobs & internships and connect with like-minded people to bring startup ideas to life.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2 Core Dedicated Modules
            </h4>
            
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs space-y-1">
              <span className="font-bold text-[#0c5beb] block">Module A: Verified Jobs</span>
              <p className="text-slate-600 text-[11px] leading-snug">
                Verified opportunities from Google, Deloitte, TCS, Microsoft, Adobe, and Amazon with scam-defense screening.
              </p>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100 text-xs space-y-1">
              <span className="font-bold text-amber-800 block">Module B: Startups & Co-founders</span>
              <p className="text-slate-600 text-[11px] leading-snug">
                Pitch student ventures like EcoTrack and connect with student peers across design, engineering, and business.
              </p>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500">
            <p className="text-[11px]">
              Tip: Click any button, tab, or phone screen to interact with the prototype live.
            </p>
          </div>
        </div>

        {/* Right 8 Phones Grid (arranged across 2 rows of 4 phones as in image.png) */}
        <div className="xl:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {screens.map((screen) => (
              <div 
                key={screen.id} 
                className="transition-transform hover:-translate-y-1 duration-200"
              >
                <PhoneFrame screenTitle={screen.title}>
                  {screen.component}
                </PhoneFrame>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Single Screen Modal (if user triggered navigation inside phone) */}
      {activeInteractiveScreen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative">
            <button
              onClick={() => setActiveInteractiveScreen(null)}
              className="absolute -top-10 right-0 text-white font-semibold text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition"
            >
              Close Simulator ✕
            </button>
            <PhoneFrame screenTitle={`Live Interactive: ${activeInteractiveScreen}`}>
              {activeInteractiveScreen === 'welcome' && <WelcomeMockup onNavigate={setActiveInteractiveScreen} />}
              {activeInteractiveScreen === 'create-account' && <CreateAccountMockup onNavigate={setActiveInteractiveScreen} />}
              {activeInteractiveScreen === 'home' && <HomeMockup onNavigate={setActiveInteractiveScreen} />}
              {activeInteractiveScreen === 'jobs' && <JobsMockup onNavigate={setActiveInteractiveScreen} />}
              {activeInteractiveScreen === 'startups' && <StartupsMockup onNavigate={setActiveInteractiveScreen} />}
              {activeInteractiveScreen === 'idea-details' && <IdeaDetailsMockup onNavigate={setActiveInteractiveScreen} />}
              {activeInteractiveScreen === 'collaborators' && <CollaboratorsMockup onNavigate={setActiveInteractiveScreen} />}
              {activeInteractiveScreen === 'profile' && <ProfileMockup onNavigate={setActiveInteractiveScreen} />}
            </PhoneFrame>
          </div>
        </div>
      )}

    </div>
  );
};
