import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Bell, 
  Search, 
  Briefcase, 
  GraduationCap, 
  Lightbulb, 
  Users, 
  Bookmark, 
  Home, 
  MessageSquare, 
  User, 
  SlidersHorizontal, 
  Eye, 
  EyeOff, 
  Check, 
  Settings, 
  ChevronRight,
  Send,
  Heart
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { CompanyLogo } from '../common/CompanyLogo';
import { JobOpportunity, StartupIdea, CollaboratorProfile } from '../../types';

interface ScreenProps {
  onNavigate?: (screenName: string, data?: any) => void;
  savedJobIds?: string[];
  onToggleSaveJob?: (id: string) => void;
  connectedIds?: string[];
  onToggleConnect?: (id: string) => void;
}

// -------------------------------------------------------------
// Screen 1: Welcome / Onboarding Screen
// -------------------------------------------------------------
export const WelcomeMockup: React.FC<ScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white text-center">
      <div className="my-auto flex flex-col items-center">
        {/* Centered Thinkora Logo */}
        <Logo size="xl" orientation="vertical" />
        
        <p className="text-xs text-slate-600 font-medium mt-3 tracking-tight">
          Real Opportunities. Real People. Real Growth.
        </p>
      </div>

      <div className="space-y-3 pt-6 pb-2">
        <button
          onClick={() => onNavigate && onNavigate('create-account')}
          className="w-full py-3 bg-[#0c5beb] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
        >
          Get Started
        </button>

        <p className="text-[11px] text-slate-500">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="text-[#0c5beb] font-semibold hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Screen 2: Create Account Screen
// -------------------------------------------------------------
export const CreateAccountMockup: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-white text-left">
      <div>
        {/* Top Header */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => onNavigate && onNavigate('welcome')}
            className="p-1 -ml-1 text-slate-700 hover:text-slate-900"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-slate-900">Create Account</h2>
        </div>
        <p className="text-[11px] text-slate-500 mb-5">
          Join Thinkora and unlock new opportunities
        </p>

        {/* Inputs */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 pr-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="w-full mt-2 py-2.5 bg-[#0c5beb] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
          >
            Sign Up
          </button>
        </div>

        {/* Social logins */}
        <div className="mt-5 text-center">
          <p className="text-[10px] text-slate-400 mb-3">or continue with</p>
          <div className="flex items-center justify-center gap-3">
            {/* Google */}
            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <span className="font-bold text-xs text-blue-600">G</span>
            </button>
            {/* Apple */}
            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <span className="font-bold text-xs text-slate-900"></span>
            </button>
            {/* LinkedIn */}
            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <span className="font-bold text-xs text-blue-700">in</span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center pt-3 pb-1">
        <p className="text-[11px] text-slate-500">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="text-[#0c5beb] font-semibold hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Screen 3: Home / Student Dashboard Screen
// -------------------------------------------------------------
export const HomeMockup: React.FC<ScreenProps> = ({ 
  onNavigate,
  savedJobIds = [],
  onToggleSaveJob
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between bg-white text-left">
      <div className="p-4 space-y-3.5 flex-1 overflow-y-auto no-scrollbar">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">
              Hello, Alex 👋
            </h2>
            <p className="text-[11px] text-slate-500">
              Find your next big opportunity!
            </p>
          </div>
          <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600">
            <Bell className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs, internships, or startups..."
            onClick={() => onNavigate && onNavigate('jobs')}
            readOnly
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-[11px] text-slate-800 placeholder:text-slate-400 cursor-pointer"
          />
        </div>

        {/* 4 Colored Shortcut Icons in a row */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <button
            onClick={() => onNavigate && onNavigate('jobs')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#eaf1ff] text-[#0c5beb] flex items-center justify-center transition group-hover:scale-105">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700">Jobs</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('jobs')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#e6f4ff] text-[#0091ff] flex items-center justify-center transition group-hover:scale-105">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700">Internships</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('startups')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#fff2e8] text-[#ff7a00] flex items-center justify-center transition group-hover:scale-105">
              <Lightbulb className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700">Startups</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('collaborators')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#eef2ff] text-[#6366f1] flex items-center justify-center transition group-hover:scale-105">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700">Collaborate</span>
          </button>
        </div>

        {/* Section: Top Opportunities */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-900">Top Opportunities</h3>
            <button
              onClick={() => onNavigate && onNavigate('jobs')}
              className="text-[11px] font-semibold text-[#0c5beb] hover:underline"
            >
              See all →
            </button>
          </div>

          <div className="space-y-2">
            {/* Google */}
            <div 
              onClick={() => onNavigate && onNavigate('jobs')}
              className="p-3 bg-white rounded-xl border border-slate-150 shadow-2xs hover:border-blue-300 transition cursor-pointer flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5">
                <CompanyLogo name="Google" size="sm" />
                <div>
                  <h4 className="text-[11px] font-bold text-slate-900 leading-tight">
                    Software Developer Intern
                  </h4>
                  <p className="text-[10px] text-slate-500">Google</p>
                  <p className="text-[9px] text-slate-400">Remote · Internship</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified
                </span>
                <Bookmark className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600" />
              </div>
            </div>

            {/* Deloitte */}
            <div 
              onClick={() => onNavigate && onNavigate('jobs')}
              className="p-3 bg-white rounded-xl border border-slate-150 shadow-2xs hover:border-blue-300 transition cursor-pointer flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5">
                <CompanyLogo name="Deloitte" size="sm" />
                <div>
                  <h4 className="text-[11px] font-bold text-slate-900 leading-tight">
                    Marketing Intern
                  </h4>
                  <p className="text-[10px] text-slate-500">Deloitte</p>
                  <p className="text-[9px] text-slate-400">Bengaluru · Internship</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified
                </span>
                <Bookmark className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600" />
              </div>
            </div>

            {/* TCS */}
            <div 
              onClick={() => onNavigate && onNavigate('jobs')}
              className="p-3 bg-white rounded-xl border border-slate-150 shadow-2xs hover:border-blue-300 transition cursor-pointer flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5">
                <CompanyLogo name="TCS" size="sm" />
                <div>
                  <h4 className="text-[11px] font-bold text-slate-900 leading-tight">
                    Junior Data Analyst
                  </h4>
                  <p className="text-[10px] text-slate-500">TCS</p>
                  <p className="text-[9px] text-slate-400">Hybrid · Internship</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified
                </span>
                <Bookmark className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom iOS Navigation Bar */}
      <div className="border-t border-slate-200 px-6 py-2 flex items-center justify-between bg-white text-slate-500">
        <button 
          onClick={() => onNavigate && onNavigate('home')}
          className="flex flex-col items-center gap-0.5 text-[#0c5beb]"
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px] font-bold">Home</span>
        </button>
        <button 
          onClick={() => onNavigate && onNavigate('jobs')}
          className="flex flex-col items-center gap-0.5 hover:text-slate-900"
        >
          <Bookmark className="w-4 h-4" />
          <span className="text-[9px] font-medium">Saved</span>
        </button>
        <button 
          onClick={() => onNavigate && onNavigate('collaborators')}
          className="flex flex-col items-center gap-0.5 hover:text-slate-900"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-[9px] font-medium">Messages</span>
        </button>
        <button 
          onClick={() => onNavigate && onNavigate('profile')}
          className="flex flex-col items-center gap-0.5 hover:text-slate-900"
        >
          <User className="w-4 h-4" />
          <span className="text-[9px] font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Screen 4: Jobs & Internships Listing Screen
// -------------------------------------------------------------
export const JobsMockup: React.FC<ScreenProps> = ({ 
  onNavigate,
  savedJobIds = [],
  onToggleSaveJob
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Full-time' | 'Part-time' | 'Remote'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex-1 flex flex-col justify-between bg-white text-left">
      <div className="p-4 space-y-3 flex-1 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="p-1 -ml-1 text-slate-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-slate-900">Jobs</h2>
          </div>
          <button className="p-1 text-slate-600 hover:text-slate-900">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
          {(['All', 'Full-time', 'Part-time', 'Remote'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full font-semibold transition shrink-0 ${
                activeTab === tab
                  ? 'bg-[#0c5beb] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Dropdown Filters Row */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
          <button className="px-2 py-1 bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1">
            <span>Location</span>
            <span>▾</span>
          </button>
          <button className="px-2 py-1 bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1">
            <span>Experience Level</span>
            <span>▾</span>
          </button>
          <button className="px-2 py-1 bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1">
            <span>Type</span>
            <span>▾</span>
          </button>
        </div>

        {/* Jobs List */}
        <div className="space-y-2 pt-1">
          {/* Microsoft */}
          <div className="p-3 bg-white rounded-xl border border-slate-150 shadow-2xs hover:border-blue-300 transition flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <CompanyLogo name="Microsoft" size="sm" />
              <div>
                <h4 className="text-[11px] font-bold text-slate-900 leading-tight">
                  Frontend Developer Intern
                </h4>
                <p className="text-[10px] text-slate-500">Microsoft</p>
                <p className="text-[9px] text-slate-400">Remote · Internship</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified
              </span>
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* TCS */}
          <div className="p-3 bg-white rounded-xl border border-slate-150 shadow-2xs hover:border-blue-300 transition flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <CompanyLogo name="TCS" size="sm" />
              <div>
                <h4 className="text-[11px] font-bold text-slate-900 leading-tight">
                  Data Analyst Intern
                </h4>
                <p className="text-[10px] text-slate-500">TCS</p>
                <p className="text-[9px] text-slate-400">Bengaluru · Internship</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified
              </span>
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Adobe */}
          <div className="p-3 bg-white rounded-xl border border-slate-150 shadow-2xs hover:border-blue-300 transition flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <CompanyLogo name="Adobe" size="sm" />
              <div>
                <h4 className="text-[11px] font-bold text-slate-900 leading-tight">
                  UI/UX Design Intern
                </h4>
                <p className="text-[10px] text-slate-500">Adobe</p>
                <p className="text-[9px] text-slate-400">Remote · Internship</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified
              </span>
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Amazon */}
          <div className="p-3 bg-white rounded-xl border border-slate-150 shadow-2xs hover:border-blue-300 transition flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <CompanyLogo name="Amazon" size="sm" />
              <div>
                <h4 className="text-[11px] font-bold text-slate-900 leading-tight">
                  Business Analyst Intern
                </h4>
                <p className="text-[10px] text-slate-500">Amazon</p>
                <p className="text-[9px] text-slate-400">Hybrid · Internship</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified
              </span>
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Screen 5: Startups Listing Screen
// -------------------------------------------------------------
export const StartupsMockup: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'My Ideas' | 'Trending'>('All');

  return (
    <div className="flex-1 flex flex-col justify-between bg-white text-left">
      <div className="p-4 space-y-3 flex-1 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="p-1 -ml-1 text-slate-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-slate-900">Startups</h2>
          </div>
          <button className="p-1 text-slate-600 hover:text-slate-900">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-[11px]">
          {(['All', 'My Ideas', 'Trending'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full font-semibold transition ${
                activeTab === tab
                  ? 'bg-[#0c5beb] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Ideas List */}
        <div className="space-y-2.5 pt-1">
          {/* Card 1: EcoTrack */}
          <div 
            onClick={() => onNavigate && onNavigate('idea-details')}
            className="p-3 bg-white rounded-xl border border-slate-150 shadow-2xs hover:border-blue-400 transition cursor-pointer space-y-2"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2e7d32] text-white flex items-center justify-center shrink-0">
                🌱
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 leading-tight">EcoTrack</h4>
                <p className="text-[10px] text-slate-500 leading-snug">Sustainable lifestyle tracking app</p>
                <div className="flex items-center gap-1.5 mt-1.5 text-[9px]">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">Sustainability</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">Tech</span>
                  <span className="text-slate-400 ml-auto">3 members</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: HealthTech */}
          <div 
            onClick={() => onNavigate && onNavigate('idea-details')}
            className="p-3 bg-white rounded-xl border border-slate-150 shadow-2xs hover:border-blue-400 transition cursor-pointer space-y-2"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                🧠
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 leading-tight">HealthTech</h4>
                <p className="text-[10px] text-slate-500 leading-snug">Mental health support platform</p>
                <div className="flex items-center gap-1.5 mt-1.5 text-[9px]">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">Health</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">EdTech</span>
                  <span className="text-slate-400 ml-auto">5 members</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: EduLens */}
          <div 
            onClick={() => onNavigate && onNavigate('idea-details')}
            className="p-3 bg-white rounded-xl border border-slate-150 shadow-2xs hover:border-blue-400 transition cursor-pointer space-y-2"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#00897b] text-white flex items-center justify-center shrink-0">
                👁️
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 leading-tight">EduLens</h4>
                <p className="text-[10px] text-slate-500 leading-snug">AI-powered personalized learning</p>
                <div className="flex items-center gap-1.5 mt-1.5 text-[9px]">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">EdTech</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">AI</span>
                  <span className="text-slate-400 ml-auto">4 members</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: NextGen Finance */}
          <div 
            onClick={() => onNavigate && onNavigate('idea-details')}
            className="p-3 bg-white rounded-xl border border-slate-150 shadow-2xs hover:border-blue-400 transition cursor-pointer space-y-2"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#c2185b] text-white flex items-center justify-center shrink-0">
                💳
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 leading-tight">NextGen Finance</h4>
                <p className="text-[10px] text-slate-500 leading-snug">Smart budgeting for students</p>
                <div className="flex items-center gap-1.5 mt-1.5 text-[9px]">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">FinTech</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">Finance</span>
                  <span className="text-slate-400 ml-auto">2 members</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom button: + Share Your Idea */}
      <div className="p-3 bg-white border-t border-slate-100">
        <button
          onClick={() => onNavigate && onNavigate('startups')}
          className="w-full py-2.5 bg-[#0c5beb] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
        >
          + Share Your Idea
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Screen 6: Idea Details Screen
// -------------------------------------------------------------
export const IdeaDetailsMockup: React.FC<ScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col justify-between bg-white text-left">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Top Header */}
        <div className="p-3.5 flex items-center justify-between border-b border-slate-100">
          <button
            onClick={() => onNavigate && onNavigate('startups')}
            className="flex items-center gap-1 text-slate-700 font-semibold text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Idea Details</span>
          </button>
          <Bookmark className="w-4 h-4 text-slate-400" />
        </div>

        {/* Hero Banner Image */}
        <div className="w-full h-36 bg-slate-100 overflow-hidden relative">
          <img
            src="/src/assets/images/ecotrack_lightbulb_desk_1791621365343.jpg"
            alt="EcoTrack concept"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">EcoTrack</h2>
            <p className="text-[11px] text-slate-500">Sustainable lifestyle tracking app</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
              Sustainability
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              Tech
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              Mobile App
            </span>
          </div>

          {/* Description */}
          <p className="text-[11px] text-slate-600 leading-relaxed">
            EcoTrack helps users track their daily carbon footprint, make eco-friendly choices, and earn sustainable actions.
          </p>

          {/* Looking for */}
          <div className="pt-2 space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900">Looking for</h3>
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              <span className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-medium">
                Developers
              </span>
              <span className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-medium">
                Designers
              </span>
              <span className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-medium">
                Business Minded
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-3.5 bg-white border-t border-slate-100">
        <button
          onClick={() => alert('Pitch submitted to EcoTrack creators!')}
          className="w-full py-2.5 bg-[#0c5beb] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
        >
          Join / Collaborate
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Screen 7: Collaborators Directory Screen
// -------------------------------------------------------------
export const CollaboratorsMockup: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Students' | 'Mentors'>('All');
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const toggleConnect = (name: string) => {
    setConnected((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const collaborators = [
    {
      name: 'Priya Sharma',
      initials: 'PS',
      education: 'B.Tech CSE · 3rd Year',
      skills: ['Developer', 'UI/UX'],
    },
    {
      name: 'Rahul Mehta',
      initials: 'RM',
      education: 'B.Sc. CS · 4th Year',
      skills: ['Designer', 'Marketing'],
    },
    {
      name: 'Sneha Iyer',
      initials: 'SI',
      education: 'B.Tech ECE · 3rd Year',
      skills: ['Developer', 'Product'],
    },
    {
      name: 'Arjun Nair',
      initials: 'AN',
      education: 'BBA · 3rd Year',
      skills: ['Business', 'Strategy'],
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-white text-left">
      <div className="p-4 space-y-3 flex-1 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="p-1 -ml-1 text-slate-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-slate-900">Collaborators</h2>
          </div>
          <button className="p-1 text-slate-600 hover:text-slate-900">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-[11px]">
          {(['All', 'Students', 'Mentors'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full font-semibold transition ${
                activeTab === tab
                  ? 'bg-[#0c5beb] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List of Collaborator Rows */}
        <div className="space-y-3 pt-1">
          {collaborators.map((c) => {
            const isConnected = !!connected[c.name];

            return (
              <div
                key={c.name}
                className="p-3 bg-white rounded-xl border border-slate-150 shadow-2xs hover:border-blue-300 transition flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {c.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {c.name}
                    </h4>
                    <p className="text-[10px] text-slate-500">{c.education}</p>
                    <div className="flex items-center gap-1 mt-1 text-[9px]">
                      {c.skills.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleConnect(c.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                    isConnected
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-[#0c5beb] hover:bg-blue-700 text-white'
                  }`}
                >
                  {isConnected ? 'Pending' : 'Connect'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Screen 8: Profile Screen
// -------------------------------------------------------------
export const ProfileMockup: React.FC<ScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col justify-between bg-white text-left">
      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Profile</h2>
          <button className="p-1 text-slate-600 hover:text-slate-900">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#0c5beb] text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
            AS
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Alex Sharma</h3>
            <p className="text-[11px] text-slate-600 font-medium">Final Year Student</p>
            <p className="text-[10px] text-slate-400">B.Tech - Computer Science</p>
          </div>
        </div>

        {/* 3 Stats Row */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <div>
            <span className="text-base font-bold text-slate-900 block tabular-nums">3</span>
            <span className="text-[10px] text-slate-500">Saved Jobs</span>
          </div>
          <div className="border-x border-slate-200">
            <span className="text-base font-bold text-slate-900 block tabular-nums">2</span>
            <span className="text-[10px] text-slate-500">Ideas</span>
          </div>
          <div>
            <span className="text-base font-bold text-slate-900 block tabular-nums">5</span>
            <span className="text-[10px] text-slate-500">Collaborators</span>
          </div>
        </div>

        {/* Menu list */}
        <div className="space-y-1 pt-1 text-xs font-semibold text-slate-700">
          <button 
            onClick={() => onNavigate && onNavigate('profile')}
            className="w-full p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between transition"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-slate-500" />
              <span>My Profile</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button 
            onClick={() => onNavigate && onNavigate('jobs')}
            className="w-full p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between transition"
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span>My Applications</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button 
            onClick={() => onNavigate && onNavigate('jobs')}
            className="w-full p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between transition"
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-4 h-4 text-slate-500" />
              <span>Saved Opportunities</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button className="w-full p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between transition">
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-slate-200 px-6 py-2 flex items-center justify-between bg-white text-slate-500">
        <button 
          onClick={() => onNavigate && onNavigate('home')}
          className="flex flex-col items-center gap-0.5 hover:text-slate-900"
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px] font-medium">Home</span>
        </button>
        <button 
          onClick={() => onNavigate && onNavigate('jobs')}
          className="flex flex-col items-center gap-0.5 hover:text-slate-900"
        >
          <Bookmark className="w-4 h-4" />
          <span className="text-[9px] font-medium">Saved</span>
        </button>
        <button 
          onClick={() => onNavigate && onNavigate('collaborators')}
          className="flex flex-col items-center gap-0.5 hover:text-slate-900"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-[9px] font-medium">Messages</span>
        </button>
        <button 
          onClick={() => onNavigate && onNavigate('profile')}
          className="flex flex-col items-center gap-0.5 text-[#0c5beb]"
        >
          <User className="w-4 h-4" />
          <span className="text-[9px] font-bold">Profile</span>
        </button>
      </div>
    </div>
  );
};
