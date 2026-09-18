import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import api from '../../lib/api';
import { getDeviceId } from '../../lib/utils';

interface LikeButtonProps {
  projectId: string;
  initialLikeCount: number;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ projectId, initialLikeCount }) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(() => {
    const saved = localStorage.getItem(`tc_liked_${projectId}`);
    return saved === 'true';
  });
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleLike = async () => {
    if (loading) return;

    const nextState = !isLiked;
    const nextCount = nextState ? likeCount + 1 : Math.max(0, likeCount - 1);
    setIsLiked(nextState);
    setLikeCount(nextCount);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);

    localStorage.setItem(`tc_liked_${projectId}`, String(nextState));

    try {
      setLoading(true);
      const deviceId = getDeviceId();
      const res = await api.post(`/projects/${projectId}/like`, { deviceId });
      if (res.data?.success) {
        setLikeCount(res.data.likeCount);
        setIsLiked(res.data.liked);
        localStorage.setItem(`tc_liked_${projectId}`, String(res.data.liked));
      }
    } catch (err) {
      setIsLiked(!nextState);
      setLikeCount(likeCount);
      localStorage.setItem(`tc_liked_${projectId}`, String(!nextState));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={loading}
      className={`group inline-flex items-center space-x-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-200 ${
        isLiked
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20'
          : 'bg-white dark:bg-dark-surface border-black/[0.06] dark:border-white/[0.08] text-slate-700 dark:text-zinc-300 hover:border-black/20 dark:hover:border-white/20'
      }`}
      aria-label="Like this tutorial"
    >
      <Heart
        className={`w-3.5 h-3.5 transition-transform ${
          animating ? 'scale-125' : 'scale-100'
        } ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400 group-hover:text-rose-500'}`}
      />
      <span>{likeCount}</span>
      <span className="text-[11px] text-slate-400 font-normal">
        {isLiked ? 'Liked' : 'Like tutorial'}
      </span>
    </button>
  );
};
