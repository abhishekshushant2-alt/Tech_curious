import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ArrowUpDown, Cpu } from 'lucide-react';
import api from '../lib/api';
import { Project, Category } from '../lib/types';
import { CategoryFilter } from '../components/projects/CategoryFilter';
import { ProjectGrid } from '../components/projects/ProjectGrid';

export const Projects: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<'latest' | 'likes' | 'views'>('latest');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let url = '/projects?status=published';
        if (activeCategory) url += `&category=${encodeURIComponent(activeCategory)}`;
        if (searchTerm.trim()) url += `&search=${encodeURIComponent(searchTerm.trim())}`;

        const res = await api.get(url);
        if (res.data?.success) {
          let list: Project[] = res.data.data || [];

          if (sortBy === 'likes') {
            list = list.sort((a, b) => b.likeCount - a.likeCount);
          } else if (sortBy === 'views') {
            list = list.sort((a, b) => b.viewCount - a.viewCount);
          } else {
            list = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          }

          setProjects(list);
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [activeCategory, searchTerm, sortBy]);

  const handleCategorySelect = (slug: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (slug) {
      nextParams.set('category', slug);
    } else {
      nextParams.delete('category');
    }
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      nextParams.set('search', searchTerm.trim());
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-brand-600 dark:text-brand-400 font-medium">
          <Cpu className="w-3.5 h-3.5" />
          <span>PROJECT REPOSITORY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-slate-950 dark:text-white">
          Hardware Tutorials & Case Studies
        </h1>
        <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-2xl font-normal">
          Browse comprehensive build logs across robotics, embedded microcontrollers, IoT telemetry, and custom PCB designs.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by keyword, sensor, or microcontroller..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-white dark:bg-dark-surface border border-black/[0.06] dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 shadow-sm"
            />
          </form>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-dark-surface border border-black/[0.06] dark:border-white/[0.08] text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 shadow-sm"
            >
              <option value="latest">Latest Published</option>
              <option value="likes">Most Liked</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <CategoryFilter
          categories={categories}
          activeSlug={activeCategory}
          onSelect={handleCategorySelect}
        />
      </div>

      {/* Grid of Results */}
      <ProjectGrid projects={projects} loading={loading} />
    </div>
  );
};
