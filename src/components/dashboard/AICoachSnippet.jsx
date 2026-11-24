import React, { memo } from 'react';
import { Bot, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AICoachSnippet = memo(({ tasks = [] }) => {
  const completedCount = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const highPriorityPending = tasks.filter((t) => !t.completed && t.priority === 'high').length;

  let advice = "Build your momentum by tackling one high-priority task first thing.";
  if (highPriorityPending > 0) {
    advice = `You have ${highPriorityPending} high-priority mission${highPriorityPending > 1 ? 's' : ''} awaiting action. Focus on single-tasking before moving to routine items.`;
  } else if (total > 0 && completedCount === total) {
    advice = "All planned missions cleared for today! Consider taking a restorative break or drafting tomorrow's objectives.";
  } else if (completedCount > 0) {
    advice = `Steady execution: ${completedCount}/${total} missions completed today. Maintain focus block discipline.`;
  }

  return (
    <div className="water-card rounded-2xl p-5 md:p-6 bg-gradient-to-r from-ocean-50 to-mist-50 dark:from-ocean-950/60 dark:to-ocean-900/40 border border-ocean-200 dark:border-ocean-800">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ocean-800 to-water-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-ocean-950 dark:text-white">
                FlowState AI Coach
              </h4>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-water-500/20 text-ocean-800 dark:text-water-300">
                Data Grounded
              </span>
            </div>
            <p className="text-xs text-[var(--fs-text-secondary)] mt-1.5 leading-relaxed max-w-2xl">
              {advice}
            </p>
          </div>
        </div>
        <Link
          to="/ai-assistant"
          className="text-xs font-bold text-ocean-800 dark:text-water-400 hover:underline flex items-center gap-1 flex-shrink-0 self-center"
        >
          Open AI Coach <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
});

AICoachSnippet.displayName = 'AICoachSnippet';
export default AICoachSnippet;
