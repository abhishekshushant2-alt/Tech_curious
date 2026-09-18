import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Cpu, Eye, Heart } from 'lucide-react';
import api from '../../lib/api.js';
import { Project } from '../../lib/types.js';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get(`/projects?search=${encodeURIComponent(query.trim())}`);
        if (res.data?.success) {
          setResults(res.data.data || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 transition-all">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800/80">
          <Search className="w-5 h-5 text-brand-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search robotics, IoT, schematics, tutorials..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-100 dark:bg-dark-elevated rounded border border-slate-300 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
              <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-3" />
              Scanning project archives...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1.5">
              {results.map((project) => (
                <div
                  key={project._id}
                  onClick={() => {
                    navigate(`/projects/${project.slug}`);
                    onClose();
                  }}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-elevated/70 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <img
                      src={project.thumbnailImage}
                      alt={project.title}
                      className="w-12 h-12 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-slate-800"
                    />
                    <div className="truncate">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-500 transition-colors truncate">
                        {project.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {project.shortDescription}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0 ml-4">
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span className="flex items-center"><Heart className="w-3.5 h-3.5 mr-1 text-rose-500" />{project.likeCount}</span>
                      <span className="flex items-center"><Eye className="w-3.5 h-3.5 mr-1" />{project.viewCount}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="text-center py-12">
              <Cpu className="w-10 h-10 mx-auto text-slate-400/60 mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No project tutorials matched "{query}"</p>
            </div>
          ) : (
            <div className="px-3 py-6 text-xs text-slate-400 text-center">
              Type keywords like <span className="text-brand-500 font-medium">"ESP32"</span>, <span className="text-brand-500 font-medium">"LiDAR"</span>, or <span className="text-brand-500 font-medium">"PCB"</span> to quickly navigate tutorials.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
