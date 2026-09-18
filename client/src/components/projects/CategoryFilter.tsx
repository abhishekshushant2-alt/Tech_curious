import React from 'react';
import { Category } from '../../lib/types';
import { Layers } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeSlug,
  onSelect,
}) => {
  return (
    <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onSelect('')}
        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shrink-0 flex items-center space-x-1.5 ${
          activeSlug === ''
            ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm'
            : 'bg-white dark:bg-dark-surface border border-black/[0.06] dark:border-white/[0.07] text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
        }`}
      >
        <Layers className="w-3 h-3" />
        <span>All Tracks</span>
      </button>

      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug;
        return (
          <button
            key={cat._id}
            onClick={() => onSelect(cat.slug)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shrink-0 ${
              isActive
                ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                : 'bg-white dark:bg-dark-surface border border-black/[0.06] dark:border-white/[0.07] text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};
