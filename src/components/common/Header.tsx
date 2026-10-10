import React, { useState } from 'react';
import { Logo } from './Logo';
import { UserSession } from '../../types';
import { 
  Briefcase, 
  Lightbulb, 
  Users, 
  Bookmark, 
  Menu, 
  X, 
  Plus, 
  LogOut, 
  User as UserIcon,
  LayoutDashboard,
  Bell,
  ChevronDown
} from 'lucide-react';

export type NavTab = 'dashboard' | 'jobs' | 'startups' | 'collaborators' | 'saved' | 'profile';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: UserSession | null;
  onLogout: () => void;
  onOpenShareModal: () => void;
  onOpenAuthModal?: () => void;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  onOpenShareModal,
  onOpenAuthModal,
  unreadNotificationsCount = 0,
  onOpenNotifications,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
    { id: 'jobs', label: 'Jobs & Internships', icon: <Briefcase className="w-4 h-4 shrink-0" /> },
    { id: 'startups', label: 'Startup Ideas', icon: <Lightbulb className="w-4 h-4 shrink-0" /> },
    { id: 'collaborators', label: 'Collaborators', icon: <Users className="w-4 h-4 shrink-0" /> },
    { id: 'saved', label: 'Saved & Tracker', icon: <Bookmark className="w-4 h-4 shrink-0" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* LEFT CONTAINER: Brand (Emblem + Wordmark) + Desktop Navigation */}
            <div className="flex items-center gap-6 lg:gap-8 min-w-0 shrink-0">
              
              {/* Brand Logo Container: Fixed Stable Alignment, No Wrap, No Sideways Shifting */}
              <button
                onClick={() => onSelectTab('dashboard')}
                className="flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg shrink-0 transition-opacity hover:opacity-90 py-1"
                aria-label="Thinkora Platform Dashboard"
              >
                <Logo size="md" />
              </button>

              {/* Desktop Navigation Links */}
              {currentUser && (
                <nav className="hidden lg:flex items-center gap-1 shrink-0" aria-label="Main Navigation">
                  {navItems.map((item) => {
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectTab(item.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs lg:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                        }`}
                      >
                        <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* RIGHT CONTAINER: Action, Notifications, User Menu, Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {currentUser ? (
                <>
                  {/* Share Startup Idea Button */}
                  <button
                    onClick={onOpenShareModal}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 rounded-lg hover:bg-blue-100/90 transition-colors whitespace-nowrap shadow-2xs shrink-0"
                    title="Share a new startup idea"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
                    <span className="hidden sm:inline">Share Idea</span>
                  </button>

                  {/* Notification Bell */}
                  {onOpenNotifications && (
                    <button
                      onClick={onOpenNotifications}
                      className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition shrink-0"
                      aria-label="View notifications"
                      title="Notifications"
                    >
                      <Bell className="w-4 h-4" />
                      {unreadNotificationsCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
                      )}
                    </button>
                  )}

                  {/* User Profile Avatar & Dropdown */}
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 border border-slate-200/60"
                      aria-label="User profile menu"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#0B1B3D] text-white font-bold text-xs flex items-center justify-center border border-slate-700 shadow-2xs shrink-0">
                        {currentUser.initials || 'ST'}
                      </div>
                      <div className="hidden xl:flex flex-col text-left">
                        <span className="text-xs font-bold text-slate-900 leading-tight">
                          {currentUser.name}
                        </span>
                        <span className="text-[10px] text-slate-500 leading-tight truncate max-w-[110px]">
                          {currentUser.university || 'Student'}
                        </span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
                    </button>

                    {/* Dropdown Menu */}
                    {userDropdownOpen && (
                      <div 
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                        onMouseLeave={() => setUserDropdownOpen(false)}
                      >
                        <div className="px-3.5 py-2.5 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                          <p className="text-[10px] text-blue-600 font-medium mt-0.5">{currentUser.university}</p>
                        </div>

                        <button
                          onClick={() => {
                            onSelectTab('profile');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>Student Profile & Settings</span>
                        </button>

                        <button
                          onClick={() => {
                            onSelectTab('saved');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                          <span>Saved Jobs & Tracker</span>
                        </button>

                        <div className="border-t border-slate-100 my-1"></div>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                onOpenAuthModal && (
                  <button
                    onClick={onOpenAuthModal}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs"
                  >
                    Sign In
                  </button>
                )
              )}

              {/* Mobile Menu Hamburger Toggle (screens < lg) */}
              {currentUser && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none shrink-0"
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {mobileMenuOpen && currentUser && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top duration-150">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2">
              <button
                onClick={() => {
                  onSelectTab('profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium"
              >
                <UserIcon className="w-4 h-4 text-slate-500" />
                <span>My Profile ({currentUser.name})</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 font-bold"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Compact Bottom Navigation Bar for rapid one-thumb switching */}
      {currentUser && (
        <nav 
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around h-14 px-2 shadow-up"
          aria-label="Mobile Bottom Bar"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-0.5 leading-tight truncate max-w-[64px]">
                  {item.label === 'Jobs & Internships' ? 'Jobs' : item.label === 'Saved & Tracker' ? 'Saved' : item.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
};
