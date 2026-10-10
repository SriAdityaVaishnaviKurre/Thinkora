import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, HeartHandshake, AlertCircle } from 'lucide-react';
import { NavTab } from './Header';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <Logo size="md" theme="dark" showTagline={true} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Thinkora empowers college students and fresh graduates with legitimate career opportunities and a collaborative launchpad for student-led startups.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Built for university students</span>
            </div>
          </div>

          {/* Module 1: Careers & Safety */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Jobs & Safety</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('jobs')}
                  className="hover:text-white transition-colors text-left"
                >
                  Verified Internships
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('jobs')}
                  className="hover:text-white transition-colors text-left"
                >
                  Entry-Level Roles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('jobs')}
                  className="hover:text-white transition-colors text-left"
                >
                  Credibility Checklist
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('saved')}
                  className="hover:text-white transition-colors text-left"
                >
                  Application Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Module 2: Startups & Innovation */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-blue-400" />
              <span>Startup & Teams</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('startups')}
                  className="hover:text-white transition-colors text-left"
                >
                  Explore Student Ideas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('collaborators')}
                  className="hover:text-white transition-colors text-left"
                >
                  Find Student Co-founders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('startups')}
                  className="hover:text-white transition-colors text-left"
                >
                  Trending Student Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('profile')}
                  className="hover:text-white transition-colors text-left"
                >
                  Collaboration Requests
                </button>
              </li>
            </ul>
          </div>

          {/* Student Transparency & Trust */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Trust Notice</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              All demo listings are clearly labeled. Automated credibility checks provide preliminary safety indicators and are designed to educate students on spotting employment scams.
            </p>
            <p className="text-[11px] text-slate-500">
              Never pay upfront fees for interviews, equipment, or application badges.
            </p>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Thinkora. Real Opportunities. Real People. Real Growth.</p>
          <div className="flex items-center gap-6">
            <span>Student Career & Innovation Initiative</span>
            <span>Privacy Controls Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
