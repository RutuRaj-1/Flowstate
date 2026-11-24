import React, { memo } from 'react';
import { CheckCircle2, Flame, Target, Clock, Zap } from 'lucide-react';

export const TodayKPIStrip = memo(({ 
  completedTasks, 
  totalTasks, 
  streak, 
  habitsCompleted, 
  totalHabits, 
  focusMinutes = 50,
  xpEarned = 0,
}) => {
  const taskPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const habitPct = totalHabits > 0 ? Math.round((habitsCompleted / totalHabits) * 100) : 0;

  const kpis = [
    {
      id: 'tasks',
      label: 'Tasks Executed',
      value: `${completedTasks}/${totalTasks}`,
      sub: `${taskPct}% finished`,
      icon: CheckCircle2,
      color: 'text-ocean-800 dark:text-water-400',
      bg: 'bg-ocean-100 dark:bg-ocean-900/60',
    },
    {
      id: 'habits',
      label: 'Habits Kept',
      value: `${habitsCompleted}/${totalHabits}`,
      sub: `${habitPct}% consistency`,
      icon: Target,
      color: 'text-water-600 dark:text-water-400',
      bg: 'bg-water-100 dark:bg-ocean-900/60',
    },
    {
      id: 'streak',
      label: 'Momentum Streak',
      value: `${streak} Days`,
      sub: 'Consecutive flow',
      icon: Flame,
      color: 'text-amber-500',
      bg: 'bg-amber-100 dark:bg-amber-950/40',
    },
    {
      id: 'focus',
      label: 'Focus Session',
      value: `${focusMinutes}m`,
      sub: 'Deep work completed',
      icon: Clock,
      color: 'text-seafoam-500 dark:text-emerald-400',
      bg: 'bg-seafoam-100 dark:bg-seafoam-500/20',
    },
    {
      id: 'xp',
      label: 'Daily XP Ledger',
      value: `+${xpEarned} XP`,
      sub: 'Progression score',
      icon: Zap,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-950/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div 
            key={kpi.id} 
            className="water-card rounded-2xl p-4 flex flex-col justify-between hover:border-water-500/40 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[var(--fs-text-secondary)] uppercase tracking-wider">
                {kpi.label}
              </span>
              <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-[var(--fs-text-primary)] font-mono tracking-tight">
                {kpi.value}
              </div>
              <p className="text-[10px] text-[var(--fs-text-muted)] font-medium mt-0.5">
                {kpi.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
});

TodayKPIStrip.displayName = 'TodayKPIStrip';
export default TodayKPIStrip;
