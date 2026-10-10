import React from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Briefcase, 
  Lightbulb, 
  Users, 
  Info,
  ExternalLink 
} from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationPanelProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigateToItem?: (tab: string, id?: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onNavigateToItem,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'collaboration_request':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'request_accepted':
        return <Lightbulb className="w-4 h-4 text-emerald-600" />;
      case 'job_alert':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-100">
      <div 
        className="w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 id="notifications-title" className="text-sm font-bold text-slate-900">
                Notifications
              </h2>
              <span className="text-[11px] text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1 transition"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
              aria-label="Close notifications panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 sm:p-3">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (!notif.isRead) onMarkRead(notif.id);
                  if (notif.linkTab && onNavigateToItem) {
                    onNavigateToItem(notif.linkTab, notif.linkId);
                    onClose();
                  }
                }}
                className={`p-3 rounded-xl transition cursor-pointer mb-1 border ${
                  notif.isRead
                    ? 'bg-white border-transparent hover:bg-slate-50 text-slate-700'
                    : 'bg-blue-50/50 border-blue-100/80 hover:bg-blue-50 text-slate-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-white border border-slate-200/80 shrink-0 shadow-2xs">
                    {getIcon(notif.type)}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-xs ${notif.isRead ? 'font-medium text-slate-800' : 'font-bold text-slate-900'}`}>
                        {notif.title}
                      </h3>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>{notif.createdAt}</span>
                      {notif.linkTab && (
                        <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Bell className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No notifications yet</p>
              <p className="text-[11px] text-slate-400">
                You will receive updates here when peers collaborate or when new opportunities match your profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
