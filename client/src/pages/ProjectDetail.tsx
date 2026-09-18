import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Eye,
  Youtube,
  Instagram,
  Cpu,
  Code,
  Share2,
  Check,
} from 'lucide-react';
import api from '../lib/api';
import { Project, Category, Feedback } from '../lib/types';
import { formatDate, extractYouTubeId } from '../lib/utils';
import { StepList } from '../components/projects/StepList';
import { ComponentList } from '../components/projects/ComponentList';
import { CodeBlock } from '../components/projects/CodeBlock';
import { LikeButton } from '../components/projects/LikeButton';
import { FeedbackForm } from '../components/projects/FeedbackForm';
import { FeedbackList } from '../components/projects/FeedbackList';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchProjectAndFeedback = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await api.get(`/projects/${slug}`);
        if (res.data?.success) {
          const proj: Project = res.data.data;
          setProject(proj);

          // Fetch feedback for this project
          const fbRes = await api.get(`/feedback/${proj._id}`);
          if (fbRes.data?.success) {
            setFeedbackList(fbRes.data.data || []);
          }
        } else {
          setProject(null);
        }
      } catch (err) {
        console.error('Failed to load project detail:', err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndFeedback();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleFeedbackAdded = (newFb: Feedback) => {
    setFeedbackList((prev) => [newFb, ...prev]);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-6 animate-pulse">
        <div className="h-5 w-24 bg-slate-200 dark:bg-dark-elevated rounded-full" />
        <div className="h-10 w-3/4 bg-slate-200 dark:bg-dark-elevated rounded-2xl" />
        <div className="aspect-video w-full bg-slate-200 dark:bg-dark-elevated rounded-3xl" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <Cpu className="w-12 h-12 mx-auto text-slate-400" />
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Tutorial Not Found</h2>
        <p className="text-xs text-slate-500">The requested engineering case study could not be located.</p>
        <Link
          to="/projects"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-semibold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  const categoryName =
    typeof project.category === 'object' && project.category !== null
      ? (project.category as Category).name
      : 'Hardware';

  const youtubeVideoId = extractYouTubeId(project.youtubeLink);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">
      {/* Back Button & Share */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-dark-surface border border-black/[0.06] dark:border-white/[0.08] text-xs font-medium text-slate-600 dark:text-zinc-300 transition-colors shadow-sm"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-brand-mint" />
              <span className="text-brand-mint font-semibold">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Build</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Header & Hero */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <Cpu className="w-3 h-3 mr-1" />
            {categoryName}
          </span>
          <span className="text-xs text-slate-400 flex items-center font-mono">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            {formatDate(project.createdAt)}
          </span>
          <span className="text-xs text-slate-400 flex items-center font-mono">
            <Eye className="w-3.5 h-3.5 mr-1" />
            {project.viewCount} views
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed max-w-3xl font-normal">
          {project.shortDescription}
        </p>
      </div>

      {/* Hero Media: YouTube Video or High-Res Thumbnail */}
      <div className="rounded-3xl overflow-hidden bg-slate-100 dark:bg-dark-elevated border border-black/[0.08] dark:border-white/[0.08] shadow-lg">
        {youtubeVideoId ? (
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}`}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-none"
            />
          </div>
        ) : (
          <img
            src={project.thumbnailImage}
            alt={project.title}
            className="w-full h-auto aspect-video object-cover"
          />
        )}
      </div>

      {/* Action Bar (Like + Social Video Links) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface border border-black/[0.06] dark:border-white/[0.07] flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <LikeButton projectId={project._id} initialLikeCount={project.likeCount} />

        <div className="flex items-center space-x-2">
          {project.youtubeLink && (
            <a
              href={project.youtubeLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs font-semibold transition-all"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>Watch Video</span>
            </a>
          )}
          {project.instagramLink && (
            <a
              href={project.instagramLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white text-xs font-semibold transition-all"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram Reel</span>
            </a>
          )}
        </div>
      </div>

      {/* 2. Full Description Case Study */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-surface border border-black/[0.06] dark:border-white/[0.07] shadow-sm space-y-4">
        <h2 className="text-lg font-display font-bold text-slate-950 dark:text-white border-b border-black/[0.05] dark:border-white/[0.06] pb-3">
          Architecture & Engineering Specifications
        </h2>
        <div className="text-slate-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
          {project.fullDescription}
        </div>
      </div>

      {/* 3. Step-by-Step Process */}
      {project.steps && project.steps.length > 0 && (
        <section>
          <StepList steps={project.steps} />
        </section>
      )}

      {/* 4. Required Components BOM */}
      {project.components && project.components.length > 0 && (
        <section>
          <ComponentList components={project.components} />
        </section>
      )}

      {/* 5. Source Code Viewer */}
      {project.sourceCode && project.sourceCode.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-brand-500" />
            <h3 className="text-base font-display font-bold text-slate-950 dark:text-white">
              Firmware & Source Code
            </h3>
          </div>
          <CodeBlock sourceCode={project.sourceCode} />
        </section>
      )}

      {/* 8 & 9. Community Feedback */}
      <section className="space-y-6 pt-6 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-display font-bold text-slate-950 dark:text-white">
            Community Comments & Questions
          </h3>
          <span className="text-xs text-slate-500">{feedbackList.length} Comments</span>
        </div>

        <FeedbackForm projectId={project._id} onFeedbackAdded={handleFeedbackAdded} />
        <FeedbackList feedbackList={feedbackList} />
      </section>
    </div>
  );
};
