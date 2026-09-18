import React, { useState } from 'react';
import { Star, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../lib/api.js';
import { Feedback } from '../../lib/types.js';

interface FeedbackFormProps {
  projectId: string;
  onFeedbackAdded: (newFeedback: Feedback) => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ projectId, onFeedbackAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    try {
      setLoading(true);
      setStatus('idle');
      const res = await api.post(`/feedback/${projectId}`, {
        name,
        email,
        message,
        rating,
      });

      if (res.data?.success) {
        setStatus('success');
        setStatusMsg('Feedback posted successfully!');
        onFeedbackAdded(res.data.data);
        setName('');
        setEmail('');
        setMessage('');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch (err: any) {
      setStatus('error');
      setStatusMsg(err.response?.data?.message || 'Failed to submit comment. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
      <h4 className="text-base font-bold text-slate-900 dark:text-white">
        Leave a Comment or Question
      </h4>

      {/* Star Rating Picker */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-slate-500">Tutorial Rating:</span>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors"
            >
              <Star
                className={`w-4 h-4 ${
                  (hoverRating || rating) >= star
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-300 dark:text-slate-700'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          required
          placeholder="Your name or handle *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500"
        />
        <input
          type="email"
          placeholder="Email (optional, not displayed)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500"
        />
      </div>

      <textarea
        required
        rows={3}
        placeholder="Ask a technical question, share your build results, or leave constructive feedback..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 resize-none"
      />

      {status === 'success' && (
        <div className="text-xs text-brand-mint flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="text-xs text-rose-500 flex items-center space-x-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center space-x-2 px-5 py-2 text-sm font-semibold rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
      >
        <Send className="w-4 h-4" />
        <span>{loading ? 'Posting...' : 'Post Comment'}</span>
      </button>
    </form>
  );
};
