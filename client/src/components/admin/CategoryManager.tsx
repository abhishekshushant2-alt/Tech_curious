import React, { useState } from 'react';
import { Plus, Trash2, Tags, CheckCircle2, AlertCircle } from 'lucide-react';
import { Category } from '../../lib/types.js';
import api from '../../lib/api.js';

interface CategoryManagerProps {
  categories: Category[];
  onCategoryUpdated: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onCategoryUpdated,
}) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await api.post('/categories', { name: name.trim() });
      if (res.data?.success) {
        setSuccessMsg('Category created successfully!');
        setName('');
        onCategoryUpdated();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to create category.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        onCategoryUpdated();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete category.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Category Form */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Tags className="w-5 h-5 text-brand-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Domain Category</h3>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="Category Name (e.g. Drone Avionics, AI Vision)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="inline-flex items-center justify-center space-x-2 px-5 py-2 text-sm font-semibold rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? 'Creating...' : 'Add Category'}</span>
          </button>
        </form>

        {successMsg && (
          <div className="text-xs text-brand-mint flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="text-xs text-rose-500 flex items-center space-x-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Category List */}
      <div className="rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Existing Categories</h4>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-dark-elevated/40 transition-colors"
            >
              <div>
                <span className="font-semibold text-sm text-slate-900 dark:text-white mr-2">
                  {cat.name}
                </span>
                <span className="text-xs text-slate-400 font-mono">slug: {cat.slug}</span>
              </div>
              <button
                onClick={() => handleDelete(cat._id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
