import React, { memo } from 'react';
import { CheckCircle2, Circle, AlertCircle, Clock, Plus } from 'lucide-react';

export const TodayAgenda = memo({
  displayName: 'TodayAgenda',
  render: ({ tasks, onToggleTask, onSelectFocus, onAddTask }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Sort: incomplete first, high priority first
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const w = { high: 3, medium: 2, low: 1 };
      return (w[b.priority] || 1) - (w[a.priority] || 1);
    });

    return (
      <div className="water-card rounded-2xl p-5 md:p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[var(--fs-text-primary)] tracking-tight">
              Today's Agenda
            </h3>
            <p className="text-xs text-[var(--fs-text-secondary)] mt-0.5">
              {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
            </p>
          </div>
          <button
            onClick={onAddTask}
            className="p-1.5 rounded-lg bg-ocean-100 dark:bg-ocean-900/60 text-ocean-800 dark:text-water-400 hover:bg-ocean-200 transition-colors"
            title="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Task list container */}
        <div className="space-y-2 flex-1 overflow-y-auto max-h-[360px] no-scrollbar pr-1">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-[var(--fs-border)] rounded-xl">
              <Clock className="w-8 h-8 text-[var(--fs-text-muted)] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[var(--fs-text-secondary)]">No tasks scheduled for today.</p>
              <button
                onClick={onAddTask}
                className="mt-2 text-xs font-bold text-ocean-800 dark:text-water-400 hover:underline"
              >
                + Schedule a task
              </button>
            </div>
          ) : (
            sortedTasks.map((task) => {
              const isOverdue = !task.completed && task.dueDate && task.dueDate.split('T')[0] < todayStr;
              return (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-150 ${
                    task.completed
                      ? 'bg-[var(--fs-surface-raised)]/50 border-transparent opacity-60'
                      : 'bg-[var(--fs-surface)] hover:bg-[var(--fs-surface-raised)] border-[var(--fs-border)] shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="flex-shrink-0 text-[var(--fs-text-muted)] hover:text-ocean-800 dark:hover:text-water-400 transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs md:text-sm font-semibold truncate ${
                        task.completed ? 'line-through text-[var(--fs-text-muted)]' : 'text-[var(--fs-text-primary)]'
                      }`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[var(--fs-text-muted)] font-mono">
                        {isOverdue && (
                          <span className="text-rose-500 font-bold flex items-center gap-0.5">
                            <AlertCircle className="w-3 h-3" /> Overdue
                          </span>
                        )}
                        {task.priority && (
                          <span className={`capitalize ${
                            task.priority === 'high' ? 'text-rose-500 font-bold' :
                            task.priority === 'low' ? 'text-emerald-500 font-medium' :
                            'text-amber-500 font-medium'
                          }`}>
                            • {task.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!task.completed && onSelectFocus && (
                    <button
                      onClick={() => onSelectFocus(task)}
                      className="opacity-0 group-hover:opacity-100 text-[10px] font-bold px-2 py-1 bg-ocean-800 text-white rounded-md transition-opacity ml-2 flex-shrink-0"
                    >
                      Focus
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }
}.render);

export default TodayAgenda;
