import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  PlusCircle,
  MessageSquare,
  Tags,
  LogOut,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  currentTab: 'projects' | 'feedback' | 'categories';
  onTabChange: (tab: 'projects' | 'feedback' | 'categories') => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentTab, onTabChange }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const tabs = [
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'categories', label: 'Categories', icon: Tags },
  ] as const;

  return (
    <>
      {/* Mobile Horizontal Navigation Bar (< lg screens) */}
      <div className="lg:hidden w-full space-y-3">
        {/* Profile and Quick Actions Strip */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-dark-surface border border-black/[0.06] dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-black/10 dark:ring-white/15 bg-black flex items-center justify-center shrink-0">
              <img src="/brand-logo.jpg" alt="TC" className="w-full h-full object-cover" />
            </div>
            <div className="truncate">
              <span className="text-xs font-brand font-bold text-slate-900 dark:text-white block truncate">
                {admin?.email || 'Admin'}
              </span>
              <span className="text-[10px] text-brand-mint font-mono block">Tech Curious Session</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <Link
              to="/admin/projects/new"
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-semibold shadow-sm"
              title="New Tutorial"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New</span>
            </Link>

            <Link
              to="/"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-elevated"
              title="View Public Site"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Tab Switcher Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 min-w-[100px] flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                    : 'bg-white dark:bg-dark-surface border border-black/[0.06] dark:border-white/[0.08] text-slate-600 dark:text-zinc-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Vertical Sidebar (lg+ screens) */}
      <aside className="hidden lg:block w-64 shrink-0 rounded-2xl bg-white dark:bg-dark-surface border border-black/[0.06] dark:border-white/[0.08] p-4 space-y-6 shadow-sm">
        {/* Admin Profile */}
        <div className="flex items-center space-x-3 pb-4 border-b border-black/[0.05] dark:border-white/[0.06]">
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-black/10 dark:ring-white/15 bg-black flex items-center justify-center shrink-0 shadow-sm">
            <img src="/brand-logo.jpg" alt="TC" className="w-full h-full object-cover" />
          </div>
          <div className="truncate">
            <h4 className="text-xs font-brand font-bold text-slate-900 dark:text-white tracking-tight">Tech Curious CMS</h4>
            <p className="text-[11px] text-slate-400 truncate">{admin?.email || 'Administrator'}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <button
            onClick={() => onTabChange('projects')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              currentTab === 'projects'
                ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-dark-elevated'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Manage Tutorials</span>
          </button>

          <Link
            to="/admin/projects/new"
            className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-dark-elevated transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-brand-mint" />
            <span>Create New Tutorial</span>
          </Link>

          <button
            onClick={() => onTabChange('feedback')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              currentTab === 'feedback'
                ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-dark-elevated'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Feedback Moderation</span>
          </button>

          <button
            onClick={() => onTabChange('categories')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              currentTab === 'categories'
                ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-dark-elevated'
            }`}
          >
            <Tags className="w-4 h-4" />
            <span>Categories</span>
          </button>
        </nav>

        {/* Action shortcuts */}
        <div className="pt-4 border-t border-black/[0.05] dark:border-white/[0.06] space-y-1">
          <Link
            to="/"
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-elevated transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
