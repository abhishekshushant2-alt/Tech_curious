import React, { useState } from 'react';
import { Trash2, MessageSquare, Star, ExternalLink } from 'lucide-react';
import { Feedback } from '../../lib/types.js';
import { formatDate } from '../../lib/utils.js';

interface FeedbackModerationProps {
  feedbackList: Feedback[];
  onDeleteFeedback: (id: string) => Promise<void>;
}

export const FeedbackModeration: React.FC<FeedbackModerationProps> = ({
  feedbackList,
  onDeleteFeedback,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this comment permanently?')) {
      try {
        setDeletingId(id);
        await onDeleteFeedback(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (feedbackList.length === 0) {
    return (
      <div className="py-12 text-center rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800">
        <MessageSquare className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-50" />
        <p className="text-sm text-slate-500">No community feedback records found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card List (< md screens) */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Community Comments
          </h3>
          <span className="text-xs text-slate-500">{feedbackList.length} Total</span>
        </div>

        {feedbackList.map((item) => (
          <div
            key={item._id}
            className="p-4 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white leading-snug">
                  {item.name}
                </h4>
                {item.email && (
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.email}</p>
                )}
              </div>

              {item.rating ? (
                <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{item.rating}/5</span>
                </div>
              ) : null}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-dark-elevated/40 p-2.5 rounded-xl">
              {item.message}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">{formatDate(item.createdAt)}</span>
              <button
                onClick={() => handleDelete(item._id)}
                disabled={deletingId === item._id}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
                title="Delete Comment"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (md+ screens) */}
      <div className="hidden md:block rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Community Feedback Moderation
          </h3>
          <span className="text-xs text-slate-500">{feedbackList.length} Comments</span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-dark-elevated text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Author</th>
                <th className="py-3.5 px-4">Message</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">Rating</th>
                <th className="py-3.5 px-4 whitespace-nowrap hidden sm:table-cell">Date</th>
                <th className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {feedbackList.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-dark-elevated/40 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                    <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                    {item.email && <span className="text-xs text-slate-400 font-mono">{item.email}</span>}
                  </td>
                  <td className="py-3.5 px-4 min-w-[200px]">
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm line-clamp-2">
                      {item.message}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {item.rating ? (
                      <div className="inline-flex items-center space-x-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{item.rating}/5</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap font-mono hidden sm:table-cell">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Inappropriate Comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
