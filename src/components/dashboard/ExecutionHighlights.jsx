import React, { memo } from 'react';
import { Activity, CheckCircle2, Zap, Target } from 'lucide-react';

export const ExecutionHighlights = memo(({ tasks = [], habits = [], character }) => {
  // Derive real events from completed tasks today
  const todayStr = new Date().toISOString().split('T')[0];
  const completedToday = tasks.filter(
    (t) => t.completed && t.completedAt && t.completedAt.split('T')[0] === todayStr
  );

  // Derive completed habits today
  const habitsDoneToday = habits.filter(
    (h) => h.history && h.history[todayStr]
  );

  const events = [];

  // Add completed task events
  completedToday.slice(0, 3).forEach((task) => {
    events.push({
      id: `task_${task.id}`,
      type: 'task',
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
      title: `Completed: ${task.title}`,
      time: task.completedAt ? new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
      badge: task.tier ? `${task.tier}` : 'Task',
    });
  });

  // Add habit maintained event
  if (habitsDoneToday.length > 0) {
    events.push({
      id: 'habits_summary',
      type: 'habit',
      icon: Target,
      color: 'text-water-600 dark:text-water-400 bg-water-50 dark:bg-ocean-900/60',
      title: `${habitsDoneToday.length} Daily Habits Maintained`,
      time: 'Today',
      badge: 'Habit',
    });
  }

  // Add level / XP event
  if (character) {
    events.push({
      id: 'level_info',
      type: 'xp',
      icon: Zap,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40',
      title: `Level ${character.level} ${character.title}`,
      time: `${character.xp} XP current`,
      badge: 'Status',
    });
  }

  return (
    <div className="water-card rounded-2xl p-5 md:p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-ocean-800 dark:text-water-400" />
          <h3 className="text-base font-bold text-[var(--fs-text-primary)] tracking-tight">
            Execution Highlights
          </h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--fs-text-muted)]">
          Real Activity Feed
        </span>
      </div>

      <div className="space-y-3 flex-1">
        {events.length === 0 ? (
          <div className="text-center py-6 text-xs text-[var(--fs-text-muted)] border border-dashed border-[var(--fs-border)] rounded-xl">
            Complete tasks or habits today to generate real execution highlights.
          </div>
        ) : (
          events.map((event) => {
            const Icon = event.icon;
            return (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 bg-[var(--fs-surface-raised)]/70 rounded-xl border border-[var(--fs-border)]"
              >
                <div className={`p-2 rounded-lg ${event.color} flex-shrink-0 mt-0.5`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[var(--fs-text-primary)] truncate">
                    {event.title}
                  </p>
                  <p className="text-[10px] text-[var(--fs-text-muted)] font-mono mt-0.5">
                    {event.time}
                  </p>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--fs-surface)] text-[var(--fs-text-secondary)] border border-[var(--fs-border)] flex-shrink-0">
                  {event.badge}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

ExecutionHighlights.displayName = 'ExecutionHighlights';
export default ExecutionHighlights;
