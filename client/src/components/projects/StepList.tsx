import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import { Step } from '../../lib/types';

interface StepListProps {
  steps: Step[];
  projectId?: string;
}

export const StepList: React.FC<StepListProps> = ({ steps, projectId = 'generic' }) => {
  const storageKey = `tc_steps_progress_${projectId}`;
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1]);
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completedSteps));
    } catch {
      // ignore
    }
  }, [completedSteps, storageKey]);

  if (!steps || steps.length === 0) return null;

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const toggleCompleted = (stepNumber: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const resetProgress = () => {
    if (window.confirm('Reset your assembly progress for this build?')) {
      setCompletedSteps([]);
    }
  };

  const expandAll = () => {
    setExpandedSteps(steps.map((s) => s.stepNumber));
  };

  const collapseAll = () => {
    setExpandedSteps([]);
  };

  const percentCompleted = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div className="flex items-center space-x-2.5">
          <h3 className="text-base font-display font-bold text-slate-950 dark:text-white flex items-center space-x-2">
            <span>Assembly Instructions</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-dark-elevated text-slate-600 dark:text-zinc-400 font-mono font-normal">
              {steps.length} Steps
            </span>
          </h3>
          {completedSteps.length > 0 && (
            <button
              onClick={resetProgress}
              className="inline-flex items-center space-x-1 text-[11px] text-slate-400 hover:text-rose-500 transition-colors"
              title="Reset assembly progress"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <button onClick={expandAll} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Expand All
          </button>
          <span>•</span>
          <button onClick={collapseAll} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Collapse All
          </button>
        </div>
      </div>

      {/* Assembly Progress Tracker Bar */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-dark-surface border border-black/[0.06] dark:border-white/[0.07] shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-mint" />
            <span>Maker Build Progress:</span>
          </span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">
            {completedSteps.length} of {steps.length} Steps Complete ({percentCompleted}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-dark-elevated overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-mint rounded-full transition-all duration-300"
            style={{ width: `${percentCompleted}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-2.5">
        {steps.map((step) => {
          const isExpanded = expandedSteps.includes(step.stepNumber);
          const isDone = completedSteps.includes(step.stepNumber);

          return (
            <div
              key={step.stepNumber}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isDone
                  ? 'bg-brand-mint/[0.03] dark:bg-brand-mint/[0.02] border-brand-mint/30 shadow-sm'
                  : isExpanded
                  ? 'bg-white dark:bg-dark-surface border-black/[0.08] dark:border-white/[0.09] shadow-sm'
                  : 'bg-white/60 dark:bg-dark-surface/50 border-black/[0.05] dark:border-white/[0.06] hover:border-black/[0.1] dark:hover:border-white/[0.1]'
              }`}
            >
              {/* Step Header */}
              <div
                onClick={() => toggleStep(step.stepNumber)}
                className="w-full flex items-center justify-between p-4 text-left cursor-pointer select-none"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                      isDone
                        ? 'bg-brand-mint text-white'
                        : isExpanded
                        ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950'
                        : 'bg-slate-100 dark:bg-dark-elevated text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    {String(step.stepNumber).padStart(2, '0')}
                  </div>
                  <h4
                    className={`text-sm font-semibold truncate ${
                      isDone
                        ? 'text-slate-500 dark:text-zinc-400 line-through'
                        : 'text-slate-900 dark:text-zinc-100'
                    }`}
                  >
                    {step.title}
                  </h4>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-2">
                  {/* Mark Step Completed Toggle */}
                  <button
                    type="button"
                    onClick={(e) => toggleCompleted(step.stepNumber, e)}
                    className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isDone
                        ? 'bg-brand-mint/15 text-brand-mint border border-brand-mint/30'
                        : 'bg-slate-100 dark:bg-dark-elevated text-slate-500 hover:text-slate-900 dark:hover:text-white border border-transparent'
                    }`}
                    title={isDone ? 'Mark as incomplete' : 'Mark step as done'}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 fill-brand-mint text-white" />
                        <span className="hidden sm:inline">Done</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Mark Done</span>
                      </>
                    )}
                  </button>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Step Body */}
              {isExpanded && (
                <div className="px-4 pb-5 pt-1 text-slate-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed border-t border-black/[0.04] dark:border-white/[0.05] mt-1">
                  <p className="whitespace-pre-line font-normal">{step.description}</p>
                  {step.image && (
                    <div className="mt-3.5 rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] max-h-72">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
