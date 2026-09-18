import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Step } from '../../lib/types';

interface StepListProps {
  steps: Step[];
}

export const StepList: React.FC<StepListProps> = ({ steps }) => {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1]);

  if (!steps || steps.length === 0) return null;

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const expandAll = () => {
    setExpandedSteps(steps.map((s) => s.stepNumber));
  };

  const collapseAll = () => {
    setExpandedSteps([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-base font-display font-bold text-slate-950 dark:text-white flex items-center space-x-2">
          <span>Assembly Instructions</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-dark-elevated text-slate-600 dark:text-zinc-400 font-mono font-normal">
            {steps.length} Steps
          </span>
        </h3>
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <button onClick={expandAll} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Expand All
          </button>
          <span>•</span>
          <button onClick={collapseAll} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Collapse
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {steps.map((step) => {
          const isExpanded = expandedSteps.includes(step.stepNumber);

          return (
            <div
              key={step.stepNumber}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-white dark:bg-dark-surface border-black/[0.08] dark:border-white/[0.09] shadow-sm'
                  : 'bg-white/60 dark:bg-dark-surface/50 border-black/[0.05] dark:border-white/[0.06] hover:border-black/[0.1] dark:hover:border-white/[0.1]'
              }`}
            >
              {/* Step Header */}
              <button
                onClick={() => toggleStep(step.stepNumber)}
                className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                      isExpanded
                        ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950'
                        : 'bg-slate-100 dark:bg-dark-elevated text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    {String(step.stepNumber).padStart(2, '0')}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    {step.title}
                  </h4>
                </div>

                <div className="text-slate-400 shrink-0 ml-2">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

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
