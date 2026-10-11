import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ArrowUpDown, Cpu, Gauge, Layers, X } from 'lucide-react';
import api from '../lib/api';
import { Project, Category } from '../lib/types';
import { CategoryFilter } from '../components/projects/CategoryFilter';
import { ProjectGrid } from '../components/projects/ProjectGrid';

const PLATFORMS = [
  'All Platforms',
  'ESP32',
  'Nordic nRF52',
  'ROS2 & SLAM',
  'Raspberry Pi',
  'Arduino',
];

const DIFFICULTIES = [
  'All Levels',
  'Beginner',
  'Intermediate',
  'Advanced',
];

export const Projects: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<'latest' | 'likes' | 'views'>('latest');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');

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

  // Filter projects by Platform & Difficulty client-side
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Platform filter
      if (selectedPlatform !== 'All Platforms') {
        const textToMatch = `${p.title} ${p.shortDescription} ${p.fullDescription} ${(p.components || []).map((c) => c.name).join(' ')}`.toLowerCase();
        const platQuery = selectedPlatform.toLowerCase().replace('& slam', '').trim();
        if (!textToMatch.includes(platQuery)) {
          return false;
        }
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All Levels') {
        const fullText = `${p.title} ${p.shortDescription} ${p.fullDescription}`.toLowerCase();
        const diffLower = selectedDifficulty.toLowerCase();
        // Check if difficulty matches description or infer by keyword
        const matchesDiff = (p as any).difficulty?.toLowerCase() === diffLower || fullText.includes(diffLower);
        if (!matchesDiff) {
          // If project doesn't have an explicit difficulty field, we allow intermediate default unless advanced or beginner keywords matched
          if (selectedDifficulty === 'Advanced' && !fullText.includes('advanced') && !fullText.includes('slam') && !fullText.includes('4-layer')) return false;
          if (selectedDifficulty === 'Beginner' && (fullText.includes('slam') || fullText.includes('4-layer') || fullText.includes('ros2'))) return false;
        }
      }

      return true;
    });
  }, [projects, selectedPlatform, selectedDifficulty]);

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

  const hasActiveCustomFilters =
    selectedPlatform !== 'All Platforms' ||
    selectedDifficulty !== 'All Levels' ||
    Boolean(activeCategory) ||
    Boolean(searchTerm);

  const resetAllFilters = () => {
    setSelectedPlatform('All Platforms');
    setSelectedDifficulty('All Levels');
    setSearchTerm('');
    setSearchParams(new URLSearchParams());
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

        {/* Secondary Hardware Filters: Platform & Difficulty */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border-t border-black/[0.05] dark:border-white/[0.05]">
          <div className="flex flex-wrap items-center gap-2">
            {/* Platform Selector */}
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-dark-elevated text-slate-700 dark:text-zinc-300">
              <Layers className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
              <span className="text-[11px] font-mono text-slate-400 mr-1">Platform:</span>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-transparent font-semibold focus:outline-none text-slate-900 dark:text-white cursor-pointer"
              >
                {PLATFORMS.map((plat) => (
                  <option key={plat} value={plat} className="bg-white dark:bg-dark-surface text-slate-900 dark:text-white">
                    {plat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-dark-elevated text-slate-700 dark:text-zinc-300">
              <Gauge className="w-3.5 h-3.5 text-brand-mint shrink-0" />
              <span className="text-[11px] font-mono text-slate-400 mr-1">Level:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-transparent font-semibold focus:outline-none text-slate-900 dark:text-white cursor-pointer"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff} className="bg-white dark:bg-dark-surface text-slate-900 dark:text-white">
                    {diff}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset button if filtered */}
          {hasActiveCustomFilters && (
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center space-x-1 text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Results */}
      <ProjectGrid projects={filteredProjects} loading={loading} />
    </div>
  );
};
