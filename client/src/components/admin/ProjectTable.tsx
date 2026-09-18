import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Heart,
  CheckCircle2,
  Clock,
  Search,
  LayoutGrid,
  List,
  X,
  Plus,
} from 'lucide-react';
import { Project, Category } from '../../lib/types.js';
import { formatDate } from '../../lib/utils.js';

interface ProjectTableProps {
  projects: Project[];
  onDelete: (id: string) => Promise<void>;
  onToggleStatus: (project: Project) => Promise<void>;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onDelete,
  onToggleStatus,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const confirmDelete = async (id: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this project? All attached feedback will be permanently removed.'
      )
    ) {
      try {
        setDeletingId(id);
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const categoryName =
        typeof project.category === 'object' && project.category !== null
          ? (project.category as Category).name
          : 'General';

      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoryName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const publishedCount = useMemo(
    () => projects.filter((p) => p.status === 'published').length,
    [projects]
  );
  const draftCount = useMemo(
    () => projects.filter((p) => p.status === 'draft').length,
    [projects]
  );

  if (projects.length === 0) {
    return (
      <div className="py-12 text-center rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 space-y-3">
        <p className="text-sm text-slate-500">No projects created yet.</p>
        <Link
          to="/admin/projects/new"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create your first tutorial</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Search & Filter Toolbar for PC and Mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[180px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tutorials by title, slug, or track..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end space-x-2 w-full sm:w-auto">
          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1 p-0.5 rounded-xl bg-slate-100 dark:bg-dark-elevated border border-slate-200/60 dark:border-slate-800/60 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-dark-surface text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({projects.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                statusFilter === 'published'
                  ? 'bg-white dark:bg-dark-surface text-brand-mint shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                statusFilter === 'draft'
                  ? 'bg-white dark:bg-dark-surface text-amber-500 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>

          {/* Desktop View Mode Toggle (Table / Grid) */}
          <div className="hidden md:flex items-center space-x-1 p-0.5 rounded-xl bg-slate-100 dark:bg-dark-elevated border border-slate-200/60 dark:border-slate-800/60 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-dark-surface text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-dark-surface text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty Search Result State */}
      {filteredProjects.length === 0 && (
        <div className="py-12 text-center rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 space-y-2">
          <p className="text-sm text-slate-500">No tutorials match your current search or filter.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="text-xs text-brand-500 font-semibold hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Mobile Card List (< md screens) */}
      <div className="md:hidden space-y-3">
        {filteredProjects.map((project) => {
          const categoryName =
            typeof project.category === 'object' && project.category !== null
              ? (project.category as Category).name
              : 'General';

          const isPublished = project.status === 'published';

          return (
            <div
              key={project._id}
              className="p-4 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              {/* Card Header: Thumbnail + Title + Status */}
              <div className="flex items-start space-x-3">
                <img
                  src={project.thumbnailImage}
                  alt={project.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-dark-elevated text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 truncate">
                      {categoryName}
                    </span>
                    <button
                      onClick={() => onToggleStatus(project)}
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors shrink-0 ${
                        isPublished
                          ? 'bg-brand-mint/10 text-brand-mint border border-brand-mint/30'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                      }`}
                    >
                      {isPublished ? (
                        <>
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-2.5 h-2.5" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white leading-tight line-clamp-1">
                    {project.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                    /{project.slug}
                  </p>
                </div>
              </div>

              {/* Card Footer: Metrics & Actions */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-slate-500">
                  <span className="flex items-center">
                    <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {project.viewCount}
                  </span>
                  <span className="flex items-center text-rose-500">
                    <Heart className="w-3.5 h-3.5 mr-1" />
                    {project.likeCount}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <Link
                    to={`/projects/${project.slug}`}
                    target="_blank"
                    className="p-1.5 text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-dark-elevated rounded-lg transition-colors"
                    title="View Public Tutorial"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/admin/projects/${project._id}/edit`}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-dark-elevated text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Project"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => confirmDelete(project._id)}
                    disabled={deletingId === project._id}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop PC Grid View (when Grid Mode is selected) */}
      {viewMode === 'grid' && (
        <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const categoryName =
              typeof project.category === 'object' && project.category !== null
                ? (project.category as Category).name
                : 'General';

            const isPublished = project.status === 'published';

            return (
              <div
                key={project._id}
                className="rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:border-brand-500/40 transition-all group"
              >
                <div className="relative aspect-video w-full bg-slate-100 dark:bg-dark-elevated overflow-hidden">
                  <img
                    src={project.thumbnailImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-900/80 backdrop-blur-md text-white border border-white/10">
                      {categoryName}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => onToggleStatus(project)}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-md backdrop-blur-md transition-colors ${
                        isPublished
                          ? 'bg-brand-mint/90 text-slate-950 font-bold'
                          : 'bg-amber-500/90 text-slate-950 font-bold'
                      }`}
                      title="Click to toggle status"
                    >
                      {isPublished ? (
                        <>
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-2.5 h-2.5" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4
                      className="font-semibold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2"
                      title={project.title}
                    >
                      {project.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                      /{project.slug}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <span className="flex items-center">
                        <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {project.viewCount}
                      </span>
                      <span className="flex items-center text-rose-500">
                        <Heart className="w-3.5 h-3.5 mr-1" />
                        {project.likeCount}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Link
                        to={`/projects/${project.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-brand-500 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-elevated transition-colors"
                        title="View Public Tutorial"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <Link
                        to={`/admin/projects/${project._id}/edit`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-dark-elevated text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Project"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>

                      <button
                        onClick={() => confirmDelete(project._id)}
                        disabled={deletingId === project._id}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Desktop PC Fluid Table View (when Table Mode is selected) */}
      {viewMode === 'table' && (
        <div className="hidden md:block w-full rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-dark-elevated text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Project Tutorial</th>
                  <th className="py-3.5 px-3 whitespace-nowrap">Category</th>
                  <th className="py-3.5 px-3 text-center whitespace-nowrap">Status</th>
                  <th className="py-3.5 px-3 text-center whitespace-nowrap">Engagement</th>
                  <th className="py-3.5 px-3 whitespace-nowrap hidden xl:table-cell">Created</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredProjects.map((project) => {
                  const categoryName =
                    typeof project.category === 'object' && project.category !== null
                      ? (project.category as Category).name
                      : 'General';

                  const isPublished = project.status === 'published';

                  return (
                    <tr
                      key={project._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-dark-elevated/40 transition-colors"
                    >
                      {/* Project Column: Fluid flex width with no premature truncation */}
                      <td className="py-3.5 px-4 sm:px-6 min-w-[220px]">
                        <div className="flex items-center space-x-3">
                          <img
                            src={project.thumbnailImage}
                            alt={project.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800 shadow-xs"
                          />
                          <div className="min-w-0 flex-1">
                            <h4
                              className="font-semibold text-slate-900 dark:text-white truncate"
                              title={project.title}
                            >
                              {project.title}
                            </h4>
                            <span className="text-xs text-slate-400 font-mono block truncate mt-0.5">
                              /{project.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800">
                          {categoryName}
                        </span>
                      </td>

                      {/* Status Toggle Button */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-center">
                        <button
                          onClick={() => onToggleStatus(project)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                            isPublished
                              ? 'bg-brand-mint/10 text-brand-mint border border-brand-mint/30 hover:bg-brand-mint/20'
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20'
                          }`}
                          title="Click to toggle published / draft status"
                        >
                          {isPublished ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Engagement Metrics */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-3 text-xs text-slate-500">
                          <span className="flex items-center" title="Tutorial Views">
                            <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            {project.viewCount}
                          </span>
                          <span className="flex items-center text-rose-500" title="Community Likes">
                            <Heart className="w-3.5 h-3.5 mr-1" />
                            {project.likeCount}
                          </span>
                        </div>
                      </td>

                      {/* Date (hidden on compact laptop screens <1280px to prevent awkward table squishing) */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-xs text-slate-500 font-mono hidden xl:table-cell">
                        {formatDate(project.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Link
                            to={`/projects/${project.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-dark-elevated rounded-lg transition-colors"
                            title="View Public Tutorial"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/admin/projects/${project._id}/edit`}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-dark-elevated text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Project"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>

                          <button
                            onClick={() => confirmDelete(project._id)}
                            disabled={deletingId === project._id}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
