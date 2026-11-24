import React, { memo } from 'react';
import { Check, Flame, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useHabitStore } from '../../stores/useHabitStore';

export const HabitMatrixPreview = memo(({ onOpenFullHabits }) => {
  const { user } = useAuth();
  const { habits, toggleDay } = useHabitStore();

  // Generate current week dates (Mon - Sun)
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
  const distanceToMonday = (currentDayOfWeek + 6) % 7;
  
  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((name, index) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + index);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = dateStr === today.toISOString().split('T')[0];
    return { name, dateStr, isToday, dayNum: d.getDate() };
  });

  const handleCellClick = (habit, dateStr) => {
    if (user?.uid) {
      toggleDay(user.uid, habit.id, dateStr);
    }
  };

  return (
    <div className="water-card rounded-2xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-ocean-800 dark:text-water-400" />
          <h3 className="text-base font-bold text-[var(--fs-text-primary)] tracking-tight">
            Weekly Habit Cadence
          </h3>
        </div>
        {onOpenFullHabits && (
          <button
            onClick={onOpenFullHabits}
            className="text-xs font-semibold text-ocean-800 dark:text-water-400 hover:underline flex items-center gap-1"
          >
            Full Habit Tracker →
          </button>
        )}
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-[var(--fs-border)]">
              <th className="py-2.5 px-3 text-xs font-bold text-[var(--fs-text-muted)] uppercase tracking-wider w-1/3">
                Habit Routine
              </th>
              {weekDays.map((wd) => (
                <th key={wd.dateStr} className="py-2.5 px-1.5 text-center">
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${wd.isToday ? 'text-ocean-800 dark:text-water-400 font-extrabold' : 'text-[var(--fs-text-muted)]'}`}>
                    {wd.name}
                  </div>
                  <div className={`text-xs font-mono font-bold mt-0.5 ${wd.isToday ? 'w-6 h-6 rounded-full bg-ocean-800 text-white flex items-center justify-center mx-auto shadow-sm' : 'text-[var(--fs-text-secondary)]'}`}>
                    {wd.dayNum}
                  </div>
                </th>
              ))}
              <th className="py-2.5 px-3 text-center text-xs font-bold text-[var(--fs-text-muted)] uppercase tracking-wider">
                Ratio
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--fs-border)]">
            {habits.slice(0, 5).map((habit) => {
              // Calculate weekly completed count
              const completedThisWeek = weekDays.filter(
                (wd) => habit.history && habit.history[wd.dateStr]
              ).length;

              return (
                <tr key={habit.id} className="hover:bg-[var(--fs-surface-raised)]/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--fs-text-primary)] truncate max-w-[180px]">
                        {habit.name}
                      </span>
                      {habit.streak > 0 && (
                        <span className="text-[10px] font-extrabold font-mono text-amber-500 flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                          <Flame className="w-2.5 h-2.5 fill-current" /> {habit.streak}d
                        </span>
                      )}
                    </div>
                  </td>
                  {weekDays.map((wd) => {
                    const isChecked = Boolean(habit.history && habit.history[wd.dateStr]);
                    return (
                      <td key={wd.dateStr} className="py-2 px-1 text-center">
                        <button
                          onClick={() => handleCellClick(habit, wd.dateStr)}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center mx-auto transition-all duration-150 ${
                            isChecked
                              ? 'bg-ocean-800 dark:bg-water-500 border-ocean-800 dark:border-water-500 text-white dark:text-ocean-950 shadow-sm'
                              : 'bg-[var(--fs-surface)] hover:bg-[var(--fs-surface-subtle)] border-[var(--fs-border)] text-transparent hover:text-[var(--fs-text-muted)]'
                          }`}
                          title={`Toggle ${habit.name} for ${wd.name}`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-3 px-3 text-center">
                    <span className="text-xs font-mono font-bold text-[var(--fs-text-secondary)]">
                      {completedThisWeek}/7
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

HabitMatrixPreview.displayName = 'HabitMatrixPreview';
export default HabitMatrixPreview;
