import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, ArrowUpRight, Cpu } from 'lucide-react';
import { Project, Category } from '../../lib/types';
import { formatDate } from '../../lib/utils';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const categoryName =
    typeof project.category === 'object' && project.category !== null
      ? (project.category as Category).name
      : 'Hardware';

  return (
    <article className="group relative flex flex-col rounded-2xl bg-white dark:bg-dark-surface border border-black/[0.06] dark:border-white/[0.07] hover:border-brand-500/40 dark:hover:border-brand-500/40 card-hover-glow overflow-hidden">
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-dark-elevated">
        <img
          src={project.thumbnailImage}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 dark:bg-dark-surface/90 text-slate-900 dark:text-zinc-200 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-sm">
            <Cpu className="w-3 h-3 mr-1 text-brand-500" />
            {categoryName}
          </span>
        </div>

        {/* Action Button Badge on Hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
            <span>{formatDate(project.createdAt)}</span>
            <div className="flex items-center space-x-2.5">
              <span className="flex items-center">
                <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {project.viewCount}
              </span>
              <span className="flex items-center text-rose-500/90">
                <Heart className="w-3.5 h-3.5 mr-1 fill-rose-500/20" />
                {project.likeCount}
              </span>
            </div>
          </div>

          <h3 className="text-base font-display font-bold text-slate-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
            <Link to={`/projects/${project.slug}`}>
              <span className="absolute inset-0 z-10" />
              {project.title}
            </Link>
          </h3>

          <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <span>{project.steps?.length || 0} build steps</span>
          <span className="text-[11px] font-semibold text-slate-900 dark:text-zinc-300 group-hover:text-brand-500 transition-colors">
            Read Case Study &rarr;
          </span>
        </div>
      </div>
    </article>
  );
};
