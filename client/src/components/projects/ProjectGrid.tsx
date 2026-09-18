import React from 'react';
import { Project } from '../../lib/types.js';
import { ProjectCard } from './ProjectCard.js';
import { Cpu } from 'lucide-react';

interface ProjectGridProps {
  projects: Project[];
  loading?: boolean;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse"
          >
            <div className="aspect-video bg-slate-200 dark:bg-dark-elevated rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-dark-elevated rounded w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-dark-elevated rounded w-full" />
              <div className="h-3 bg-slate-200 dark:bg-dark-elevated rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
        <Cpu className="w-12 h-12 mx-auto text-slate-400 mb-3" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">No projects found</h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
          No tutorial matches the active search criteria or category filter. Check back soon for new hardware builds!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
};
