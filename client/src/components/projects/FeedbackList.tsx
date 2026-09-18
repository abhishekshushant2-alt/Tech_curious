import React from 'react';
import { Star, MessageSquare, User } from 'lucide-react';
import { Feedback } from '../../lib/types.js';
import { formatDate } from '../../lib/utils.js';

interface FeedbackListProps {
  feedbackList: Feedback[];
}

export const FeedbackList: React.FC<FeedbackListProps> = ({ feedbackList }) => {
  if (!feedbackList || feedbackList.length === 0) {
    return (
      <div className="py-8 text-center rounded-xl bg-slate-50/50 dark:bg-dark-surface/40 border border-dashed border-slate-200 dark:border-slate-800">
        <MessageSquare className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-60" />
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          No feedback yet. Be the first to share your thoughts on this build!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {feedbackList.map((item) => (
        <div
          key={item._id}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  {item.name}
                </h5>
                <span className="text-[11px] text-slate-400">{formatDate(item.createdAt)}</span>
              </div>
            </div>

            {item.rating && (
              <div className="flex items-center space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= (item.rating || 0)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-9">
            {item.message}
          </p>
        </div>
      ))}
    </div>
  );
};
