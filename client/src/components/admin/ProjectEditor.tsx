import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Code,
  Layers,
  Cpu,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Youtube,
  Instagram,
} from 'lucide-react';
import { Project, Category, Step, ComponentItem, SourceCodeItem } from '../../lib/types.js';
import api from '../../lib/api.js';

interface ProjectEditorProps {
  initialProject?: Project;
  isEditMode?: boolean;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = ({
  initialProject,
  isEditMode = false,
}) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields
  const [title, setTitle] = useState(initialProject?.title || '');
  const [slug, setSlug] = useState(initialProject?.slug || '');
  const [category, setCategory] = useState<string>(
    typeof initialProject?.category === 'object' && initialProject?.category !== null
      ? (initialProject.category as Category)._id
      : (initialProject?.category as string) || ''
  );
  const [thumbnailImage, setThumbnailImage] = useState(initialProject?.thumbnailImage || '');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialProject?.thumbnailImage || '');
  const [shortDescription, setShortDescription] = useState(initialProject?.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(initialProject?.fullDescription || '');
  const [youtubeLink, setYoutubeLink] = useState(initialProject?.youtubeLink || '');
  const [instagramLink, setInstagramLink] = useState(initialProject?.instagramLink || '');
  const [status, setStatus] = useState<'draft' | 'published'>(initialProject?.status || 'published');

  // Dynamic Array Fields
  const [steps, setSteps] = useState<Step[]>(
    initialProject?.steps?.length
      ? initialProject.steps
      : [{ stepNumber: 1, title: '', description: '', image: '' }]
  );

  const [components, setComponents] = useState<ComponentItem[]>(
    initialProject?.components?.length
      ? initialProject.components
      : [{ name: '', quantity: '1', link: '' }]
  );

  const [sourceCode, setSourceCode] = useState<SourceCodeItem[]>(
    initialProject?.sourceCode?.length
      ? initialProject.sourceCode
      : [{ filename: 'main.ino', language: 'cpp', code: '' }]
  );

  // Load Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.success) {
          setCategories(res.data.data);
          if (!category && res.data.data.length > 0) {
            setCategory(res.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Handle Thumbnail File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Step Handlers
  const addStep = () => {
    setSteps([
      ...steps,
      { stepNumber: steps.length + 1, title: '', description: '', image: '' },
    ]);
  };

  const removeStep = (idx: number) => {
    const updated = steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, stepNumber: i + 1 }));
    setSteps(updated);
  };

  const updateStep = (idx: number, field: keyof Step, val: any) => {
    const updated = [...steps];
    updated[idx] = { ...updated[idx], [field]: val };
    setSteps(updated);
  };

  // Component Handlers
  const addComponent = () => {
    setComponents([...components, { name: '', quantity: '1', link: '' }]);
  };

  const removeComponent = (idx: number) => {
    setComponents(components.filter((_, i) => i !== idx));
  };

  const updateComponent = (idx: number, field: keyof ComponentItem, val: string) => {
    const updated = [...components];
    updated[idx] = { ...updated[idx], [field]: val };
    setComponents(updated);
  };

  // Source Code Handlers
  const addSourceCode = () => {
    setSourceCode([...sourceCode, { filename: 'file.cpp', language: 'cpp', code: '' }]);
  };

  const removeSourceCode = (idx: number) => {
    setSourceCode(sourceCode.filter((_, i) => i !== idx));
  };

  const updateSourceCode = (idx: number, field: keyof SourceCodeItem, val: string) => {
    const updated = [...sourceCode];
    updated[idx] = { ...updated[idx], [field]: val };
    setSourceCode(updated);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category || !shortDescription.trim() || !fullDescription.trim()) {
      setErrorMsg('Please fill in all required project fields.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const formData = new FormData();
      formData.append('title', title.trim());
      if (slug.trim()) formData.append('slug', slug.trim());
      formData.append('category', category);
      formData.append('shortDescription', shortDescription.trim());
      formData.append('fullDescription', fullDescription.trim());
      formData.append('youtubeLink', youtubeLink.trim());
      formData.append('instagramLink', instagramLink.trim());
      formData.append('status', status);

      // JSON fields
      formData.append('steps', JSON.stringify(steps));
      formData.append('components', JSON.stringify(components));
      formData.append('sourceCode', JSON.stringify(sourceCode));

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      } else if (thumbnailImage) {
        formData.append('thumbnailImage', thumbnailImage);
      }

      let res;
      if (isEditMode && initialProject) {
        res = await api.put(`/projects/${initialProject._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await api.post('/projects', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (res.data?.success) {
        setSuccessMsg('Project tutorial saved successfully!');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-16 px-1 sm:px-0">
      {/* Top Header & Sticky Save Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-16 sm:top-20 z-30 py-2.5 px-3 sm:px-5 rounded-2xl glass-surface border border-black/[0.06] dark:border-white/[0.08] shadow-sm">
        <button
          type="button"
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center justify-between sm:justify-end space-x-2.5 w-full sm:w-auto">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-1.5 sm:space-x-2 px-4 sm:px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-brand-500/25 disabled:opacity-50 transition-all shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : isEditMode ? 'Update Project' : 'Publish Project'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-brand-mint/10 border border-brand-mint/30 text-brand-mint text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Section 1: Overview & Meta */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 sm:space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          1. General Information & Media
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Autonomous Rover with LiDAR SLAM"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Category Domain *
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Thumbnail Uploader */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Thumbnail Image (Upload File or Enter Image URL)
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Preview"
                className="w-32 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-800 shrink-0"
              />
            )}
            <div className="flex-1 space-y-2 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-500/10 file:text-brand-500 hover:file:bg-brand-500/20"
              />
              <input
                type="text"
                placeholder="Or paste direct image URL (https://images.unsplash.com/...)"
                value={thumbnailImage}
                onChange={(e) => {
                  setThumbnailImage(e.target.value);
                  setThumbnailPreview(e.target.value);
                }}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Card Short Summary (1-2 sentences) *
          </label>
          <textarea
            required
            rows={2}
            placeholder="Brief overview visible on the project gallery cards..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Full Case Study Markdown Description *
          </label>
          <textarea
            required
            rows={6}
            placeholder="Detailed engineering background, architecture specifications, circuit notes..."
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Video / Social links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              <span>YouTube Video Tutorial URL</span>
            </label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-500" />
              <span>Instagram Reel / Post URL</span>
            </label>
            <input
              type="url"
              placeholder="https://www.instagram.com/..."
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Step-by-Step Instructions */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              2. Step-by-Step Assembly / Build Process
            </h3>
          </div>
          <button
            type="button"
            onClick={addStep}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-elevated hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-dark-elevated/40 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-brand-500">
                  Step {step.stepNumber}
                </span>
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(idx)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Remove step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="Step title (e.g. Soldering the Voltage Regulator)"
                value={step.title}
                onChange={(e) => updateStep(idx, 'title', e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />

              <textarea
                rows={2}
                placeholder="Detailed instructions for this step..."
                value={step.description}
                onChange={(e) => updateStep(idx, 'description', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 resize-none"
              />

              <input
                type="text"
                placeholder="Optional step image URL (https://...)"
                value={step.image || ''}
                onChange={(e) => updateStep(idx, 'image', e.target.value)}
                className="w-full px-3 py-1.5 text-[11px] rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Bill of Materials (BOM) */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-brand-mint" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              3. Bill of Materials (BOM)
            </h3>
          </div>
          <button
            type="button"
            onClick={addComponent}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-elevated hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Part</span>
          </button>
        </div>

        <div className="space-y-3">
          {components.map((comp, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-0 rounded-xl bg-slate-50 dark:bg-dark-elevated/40 sm:bg-transparent sm:dark:bg-transparent border border-slate-200 dark:border-slate-800 sm:border-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <input
                type="text"
                placeholder="Component Name (e.g. ESP32-WROOM-32)"
                value={comp.name}
                onChange={(e) => updateComponent(idx, 'name', e.target.value)}
                className="flex-1 w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-surface sm:bg-slate-50 sm:dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Qty"
                  value={comp.quantity}
                  onChange={(e) => updateComponent(idx, 'quantity', e.target.value)}
                  className="w-20 px-3 py-2 text-xs text-center rounded-xl bg-white dark:bg-dark-surface sm:bg-slate-50 sm:dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
                <input
                  type="text"
                  placeholder="Purchase link (Amazon / DigiKey)"
                  value={comp.link || ''}
                  onChange={(e) => updateComponent(idx, 'link', e.target.value)}
                  className="flex-1 sm:w-64 px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-surface sm:bg-slate-50 sm:dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
                {components.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeComponent(idx)}
                    className="p-2 text-slate-400 hover:text-rose-500 shrink-0"
                    title="Remove part"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Source Code Files */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-brand-cyan" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              4. Open-Source Code Snippets
            </h3>
          </div>
          <button
            type="button"
            onClick={addSourceCode}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-elevated hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add File</span>
          </button>
        </div>

        <div className="space-y-4">
          {sourceCode.map((file, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-dark-elevated/40 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Filename (e.g. main.ino, app.py)"
                    value={file.filename}
                    onChange={(e) => updateSourceCode(idx, 'filename', e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs font-mono rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                  <input
                    type="text"
                    placeholder="Lang (cpp, python)"
                    value={file.language}
                    onChange={(e) => updateSourceCode(idx, 'language', e.target.value)}
                    className="w-24 sm:w-28 px-3 py-1.5 text-xs font-mono rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                {sourceCode.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSourceCode(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 shrink-0"
                    title="Remove code snippet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <textarea
                rows={8}
                placeholder="Paste code snippet here..."
                value={file.code}
                onChange={(e) => updateSourceCode(idx, 'code', e.target.value)}
                className="w-full p-3 text-xs font-mono rounded-xl bg-dark-bg text-slate-200 border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
