import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Heart,
  Eye,
  MessageSquare,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import api from '../lib/api.js';
import { Project, Feedback, Category } from '../lib/types.js';
import { AdminSidebar } from '../components/admin/AdminSidebar.js';
import { ProjectTable } from '../components/admin/ProjectTable.js';
import { FeedbackModeration } from '../components/admin/FeedbackModeration.js';
import { CategoryManager } from '../components/admin/CategoryManager.js';

export const AdminDashboard: React.FC = () => {
  const { admin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState<'projects' | 'feedback' | 'categories'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Authentication Guard
  useEffect(() => {
    if (!authLoading && !admin) {
      navigate('/admin/login');
    }
  }, [admin, authLoading, navigate]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      const [pRes, fRes, cRes] = await Promise.all([
        api.get('/projects/admin/all'),
        api.get('/feedback/admin/all'),
        api.get('/categories'),
      ]);

      if (pRes.data?.success) setProjects(pRes.data.data || []);
      if (fRes.data?.success) setFeedbackList(fRes.data.data || []);
      if (cRes.data?.success) setCategories(cRes.data.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (admin) {
      loadData();
    }
  }, [admin]);

  const handleDeleteProject = async (id: string) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      setFeedbackList((prev) => prev.filter((f) => (typeof f.project === 'string' ? f.project !== id : f.project?._id !== id)));
    } catch (err) {
      alert('Failed to delete project.');
    }
  };

  const handleToggleStatus = async (project: Project) => {
    try {
      const nextStatus = project.status === 'published' ? 'draft' : 'published';
      const res = await api.put(`/projects/${project._id}`, { status: nextStatus });
      if (res.data?.success) {
        setProjects((prev) =>
          prev.map((p) => (p._id === project._id ? { ...p, status: nextStatus } : p))
        );
      }
    } catch (err) {
      alert('Failed to toggle status.');
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    try {
      await api.delete(`/feedback/${id}`);
      setFeedbackList((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      alert('Failed to delete feedback.');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) return null;

  // Aggregate Metrics
  const totalLikes = projects.reduce((sum, p) => sum + (p.likeCount || 0), 0);
  const totalViews = projects.reduce((sum, p) => sum + (p.viewCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Creator CMS & Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your hardware tutorials, inspect feedback, and publish updates.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-100 dark:bg-dark-elevated hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => navigate('/admin/projects/new')}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Tutorial</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3 sm:space-x-4">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-brand-500/10 text-brand-500 shrink-0 flex items-center justify-center">
            <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
              {projects.length}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 truncate mt-1">Total Tutorials</div>
          </div>
        </div>

        <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3 sm:space-x-4">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-rose-500/10 text-rose-500 shrink-0 flex items-center justify-center">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
              {totalLikes}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 truncate mt-1">Total Likes</div>
          </div>
        </div>

        <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3 sm:space-x-4">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/10 text-brand-cyan shrink-0 flex items-center justify-center">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
              {totalViews}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 truncate mt-1">Tutorial Views</div>
          </div>
        </div>

        <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3 sm:space-x-4">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-brand-mint/10 text-brand-mint shrink-0 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
              {feedbackList.length}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 truncate mt-1">Comments</div>
          </div>
        </div>
      </div>

      {/* Main Admin Content: Sidebar + Active Tab Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        <AdminSidebar currentTab={currentTab} onTabChange={setCurrentTab} />

        <div className="flex-1 min-w-0 space-y-6">
          {currentTab === 'projects' && (
            <ProjectTable
              projects={projects}
              onDelete={handleDeleteProject}
              onToggleStatus={handleToggleStatus}
            />
          )}

          {currentTab === 'feedback' && (
            <FeedbackModeration
              feedbackList={feedbackList}
              onDeleteFeedback={handleDeleteFeedback}
            />
          )}

          {currentTab === 'categories' && (
            <CategoryManager categories={categories} onCategoryUpdated={loadData} />
          )}
        </div>
      </div>
    </div>
  );
};
