import React, { memo } from 'react';
import { Target, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GoalAlignmentSection = memo(({ goals, progressMap }) => {
  const activeGoals = goals.filter((g) => g.status === 'active' || !g.status).slice(0, 3);

  return (
    <div className="water-card rounded-2xl p-5 md:p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-ocean-800 dark:text-water-400" />
          <h3 className="text-base font-bold text-[var(--fs-text-primary)] tracking-tight">
            Goal Pyramid Alignment
          </h3>
        </div>
        <Link
          to="/goals"
          className="text-xs font-semibold text-ocean-800 dark:text-water-400 hover:underline flex items-center gap-0.5"
        >
          View Pyramid <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3.5 flex-1">
        {activeGoals.length === 0 ? (
          <div className="text-center py-6 text-xs text-[var(--fs-text-muted)] border border-dashed border-[var(--fs-border)] rounded-xl">
            No active campaign goals configured.
            <Link to="/goals" className="block mt-1 font-bold text-ocean-800 dark:text-water-400">
              Create a goal →
            </Link>
          </div>
        ) : (
          activeGoals.map((goal) => {
            const progress = progressMap[goal.id] ?? goal.progress ?? 0;
            return (
              <div key={goal.id} className="p-3 bg-[var(--fs-surface-raised)]/70 rounded-xl border border-[var(--fs-border)]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[var(--fs-text-primary)] truncate max-w-[200px]">
                    {goal.title}
                  </span>
                  <span className="font-mono font-bold text-ocean-800 dark:text-water-400 text-xs">
                    {progress}%
                  </span>
                </div>
                <div className="h-1.5 bg-[var(--fs-surface)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-ocean-800 to-water-500 rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[var(--fs-text-muted)] mt-1.5 uppercase font-medium">
                  <span className="capitalize">{goal.type} Goal</span>
                  <span className="capitalize">{goal.category}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

GoalAlignmentSection.displayName = 'GoalAlignmentSection';
export default GoalAlignmentSection;
