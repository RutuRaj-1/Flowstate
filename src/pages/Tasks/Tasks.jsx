import React, { useState, useMemo, useCallback, useEffect, memo } from 'react';
import {
  Plus, Search, CheckCircle, Circle, Trash2, Edit3,
  ChevronLeft, ChevronRight, X,
  Calendar, Check, AlertCircle, Flame, Target,
  Layers, Clock
} from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useGoals } from '../../hooks/useGoals';
import { useAuth } from '../../hooks/useAuth';
import { useHabitStore } from '../../stores/useHabitStore';
import Button from '../../components/common/Button';

// ── Mini Calendar Component for Day View ───────────────────────────────────────
const MiniCalendar = memo(({ selectedDate, onSelectDate }) => {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date(selectedDate);
    d.setDate(1);
    return d;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const selectedStr = selectedDate.toISOString().split('T')[0];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = useCallback(() => {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }, []);

  const nextMonth = useCallback(() => {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(today);
  }, [onSelectDate]);

  const handleDayClick = useCallback((day) => {
    onSelectDate(new Date(year, month, day));
  }, [year, month, onSelectDate]);

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="water-card rounded-2xl p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1.5 hover:bg-[var(--fs-surface-raised)] rounded-lg text-[var(--fs-text-secondary)] transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-[var(--fs-text-primary)]">{monthLabel}</span>
          {selectedStr !== todayStr && (
            <button
              onClick={goToToday}
              className="text-[10px] font-bold text-ocean-800 dark:text-water-400 hover:underline mt-0.5"
            >
              Today
            </button>
          )}
        </div>
        <button
          onClick={nextMonth}
          className="p-1.5 hover:bg-[var(--fs-surface-raised)] rounded-lg text-[var(--fs-text-secondary)] transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1.5">
        {weekDays.map(d => (
          <div key={d} className="text-center text-[11px] font-bold text-[var(--fs-text-muted)] py-0.5">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = dateStr === selectedStr;
          const isToday = dateStr === todayStr;

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`
                w-full aspect-square flex items-center justify-center rounded-xl text-xs font-semibold transition-all duration-150
                ${isSelected
                  ? 'bg-ocean-800 text-white shadow-sm font-bold'
                  : isToday
                    ? 'bg-ocean-100 dark:bg-ocean-900/60 text-ocean-800 dark:text-water-300 font-bold'
                    : 'text-[var(--fs-text-primary)] hover:bg-[var(--fs-surface-raised)]'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
});
MiniCalendar.displayName = 'MiniCalendar';

// ── Main Tasks & Scheduler Component ──────────────────────────────────────────
const Tasks = ({ initialTab = 'day' }) => {
  const { user } = useAuth();
  const { tasks, addTask, updateTask, deleteTask, toggleTask, carryForwardTask, loading } = useTasks();
  const { goals } = useGoals();
  const { habits, fetchHabits, addHabit, toggleDay, deleteHabit: removeHabit } = useHabitStore();

  const [activeTab, setActiveTab] = useState(initialTab === 'habits' ? 'habits' : 'day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [newTask, setNewTask] = useState({
    title: '', description: '', priority: 'medium', dueDate: '', category: 'work', linkedGoalId: ''
  });

  const [newHabit, setNewHabit] = useState({
    name: '', category: 'routine', frequency: 'daily', targetDaysPerWeek: 7
  });

  useEffect(() => {
    if (user?.uid) {
      fetchHabits(user.uid);
    }
  }, [user, fetchHabits]);

  const dateStr = useMemo(() => selectedDate.toISOString().split('T')[0], [selectedDate]);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const monthlyGoals = useMemo(() => goals.filter(g => g.type === 'monthly'), [goals]);

  // Tasks for selected date in Day view
  const dayTasks = useMemo(() => {
    let result = tasks;

    if (filter === 'overdue') {
      result = result.filter(t => !t.completed && t.dueDate && t.dueDate.split('T')[0] < todayStr);
    } else {
      result = result.filter(task => {
        const td = task.dueDate ? task.dueDate.split('T')[0] : '';
        const isSelectedDate = td === dateStr || (!task.dueDate && dateStr === todayStr);
        const isOverdueRollover = dateStr === todayStr && !task.completed && td && td < todayStr;
        return isSelectedDate || isOverdueRollover;
      });

      if (filter === 'pending') result = result.filter(t => !t.completed);
      if (filter === 'completed') result = result.filter(t => t.completed);
      if (filter === 'high') result = result.filter(t => t.priority === 'high');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)));
    }

    return [...result].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const w = { high: 3, medium: 2, low: 1 };
      return (w[b.priority] || 1) - (w[a.priority] || 1);
    });
  }, [tasks, filter, searchQuery, dateStr, todayStr]);

  // Week View calculation (Monday to Sunday)
  const weekDays = useMemo(() => {
    const d = new Date(selectedDate);
    const dayOfWeek = d.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - distanceToMonday);

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => {
      const current = new Date(monday);
      current.setDate(monday.getDate() + idx);
      const ds = current.toISOString().split('T')[0];
      const isToday = ds === todayStr;
      const tasksOnDay = tasks.filter(t => t.dueDate && t.dueDate.split('T')[0] === ds);
      const completedOnDay = tasksOnDay.filter(t => t.completed).length;

      return {
        dayName,
        date: current,
        dateStr: ds,
        dayNum: current.getDate(),
        isToday,
        tasks: tasksOnDay,
        completedCount: completedOnDay,
        totalCount: tasksOnDay.length,
      };
    });
  }, [selectedDate, tasks, todayStr]);

  // Month View calendar grid calculation
  const monthCalendarDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayTasks = tasks.filter(t => t.dueDate && t.dueDate.split('T')[0] === ds);
      const completed = dayTasks.filter(t => t.completed).length;
      days.push({
        dayNum: d,
        dateStr: ds,
        isToday: ds === todayStr,
        tasks: dayTasks,
        completedCount: completed,
        totalCount: dayTasks.length,
      });
    }
    return days;
  }, [selectedDate, tasks, todayStr]);

  // Handlers
  const handleAddTaskSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    await addTask({
      ...newTask,
      dueDate: newTask.dueDate || dateStr,
    });
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', category: 'work', linkedGoalId: '' });
    setShowAddTask(false);
  }, [newTask, addTask, dateStr]);

  const handleEditTaskSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) return;
    await updateTask(editingTask.id, {
      title: editingTask.title,
      description: editingTask.description || '',
      priority: editingTask.priority || 'medium',
      category: editingTask.category || 'work',
      dueDate: editingTask.dueDate || dateStr,
      linkedGoalId: editingTask.linkedGoalId || null,
    });
    setEditingTask(null);
  }, [editingTask, updateTask, dateStr]);

  const handleCreateHabitSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!newHabit.name.trim() || !user?.uid) return;
    await addHabit(user.uid, newHabit);
    setNewHabit({ name: '', category: 'routine', frequency: 'daily', targetDaysPerWeek: 7 });
    setShowAddHabit(false);
  }, [newHabit, user?.uid, addHabit]);

  const handleCarryForward = useCallback(async (taskId) => {
    await carryForwardTask(taskId, todayStr);
  }, [carryForwardTask, todayStr]);

  const changeDateBy = useCallback((days) => {
    setSelectedDate(prev => {
      const next = new Date(prev);
      next.setDate(next.getDate() + days);
      return next;
    });
  }, []);

  const changeMonthBy = useCallback((months) => {
    setSelectedDate(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + months);
      return next;
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-3 border-water-300 border-t-ocean-800 rounded-full animate-spin" />
      </div>
    );
  }

  const completedTodayCount = dayTasks.filter(t => t.completed).length;
  const dayProgressPct = dayTasks.length > 0 ? Math.round((completedTodayCount / dayTasks.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--fs-border)]">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[var(--fs-text-primary)] tracking-tight">
            Schedule & Execution
          </h1>
          <p className="text-xs md:text-sm text-[var(--fs-text-secondary)] mt-0.5">
            Plan, organize, and execute across Day, Week, Month and Habit cadences.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--fs-surface-raised)] rounded-xl border border-[var(--fs-border)] w-fit">
          {[
            { id: 'day', label: 'Day View', icon: Clock },
            { id: 'week', label: 'Week View', icon: Layers },
            { id: 'month', label: 'Month View', icon: Calendar },
            { id: 'habits', label: 'Habit Matrix', icon: Target },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-ocean-800 text-white shadow-sm'
                    : 'text-[var(--fs-text-secondary)] hover:text-[var(--fs-text-primary)] hover:bg-[var(--fs-surface)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {activeTab === 'habits' ? (
            <Button
              onClick={() => setShowAddHabit(true)}
              variant="water"
              size="md"
              icon={Plus}
            >
              Add Habit
            </Button>
          ) : (
            <Button
              onClick={() => setShowAddTask(true)}
              variant="water"
              size="md"
              icon={Plus}
            >
              New Task
            </Button>
          )}
        </div>
      </div>

      {/* 2. Main View Switcher Render */}

      {/* ─── TAB A: DAY VIEW ────────────────────────────────────────────── */}
      {activeTab === 'day' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: MiniCalendar & Today's Progress */}
          <div className="lg:col-span-4 space-y-5">
            <MiniCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            <div className="water-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)]">
                  {dateStr === todayStr ? "Today's Execution" : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-xs font-mono font-bold text-ocean-800 dark:text-water-400">
                  {completedTodayCount} / {dayTasks.length}
                </span>
              </div>
              <div className="h-2 bg-[var(--fs-surface-raised)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-ocean-800 to-water-500 rounded-full transition-all duration-500"
                  style={{ width: `${dayProgressPct}%` }}
                />
              </div>
              <p className="text-[11px] text-[var(--fs-text-muted)] mt-2 font-medium text-center">
                {dayProgressPct === 100 && dayTasks.length > 0 ? "All scheduled items cleared! 🎉" : `${dayProgressPct}% completed`}
              </p>
            </div>
          </div>

          {/* Right Column: Search, Filters & Task List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Search and Filters Strip */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[var(--fs-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks by title..."
                  className="w-full pl-9 pr-3 py-2 bg-[var(--fs-surface)] border border-[var(--fs-border)] rounded-xl text-xs md:text-sm text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800"
                />
              </div>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {['all', 'pending', 'completed', 'high', 'overdue'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-colors ${
                      filter === f
                        ? 'bg-ocean-800 text-white'
                        : 'bg-[var(--fs-surface)] text-[var(--fs-text-secondary)] border border-[var(--fs-border)] hover:bg-[var(--fs-surface-raised)]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Cards List */}
            <div className="space-y-2.5">
              {dayTasks.length === 0 ? (
                <div className="water-card rounded-2xl p-10 text-center border-dashed">
                  <Clock className="w-8 h-8 text-[var(--fs-text-muted)] mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-[var(--fs-text-primary)]">
                    {filter !== 'all' ? 'No matching tasks' : 'No tasks on this schedule'}
                  </h3>
                  <p className="text-xs text-[var(--fs-text-secondary)] mt-1">
                    {filter !== 'all' ? 'Try adjusting your filters.' : 'Your day is open. Schedule a task to enter flow.'}
                  </p>
                  <Button
                    onClick={() => setShowAddTask(true)}
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                  >
                    + Add Task
                  </Button>
                </div>
              ) : (
                dayTasks.map(task => {
                  const isOverdue = !task.completed && task.dueDate && task.dueDate.split('T')[0] < todayStr;
                  return (
                    <div
                      key={task.id}
                      className={`water-card rounded-xl p-4 flex items-center justify-between gap-3 group transition-all ${
                        task.completed ? 'opacity-65 bg-[var(--fs-surface-raised)]/60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="flex-shrink-0 text-[var(--fs-text-muted)] hover:text-ocean-800 dark:hover:text-water-400 transition-colors"
                        >
                          {task.completed ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-bold truncate ${
                            task.completed ? 'line-through text-[var(--fs-text-muted)]' : 'text-[var(--fs-text-primary)]'
                          }`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-[var(--fs-text-secondary)] truncate mt-0.5">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1 text-[10px] font-mono">
                            {isOverdue && (
                              <span className="text-rose-500 font-bold flex items-center gap-0.5">
                                <AlertCircle className="w-3 h-3" /> Overdue
                              </span>
                            )}
                            <span className={`capitalize font-bold ${
                              task.priority === 'high' ? 'text-rose-500' :
                              task.priority === 'low' ? 'text-emerald-500' : 'text-amber-500'
                            }`}>
                              • {task.priority} Priority
                            </span>
                            {task.category && (
                              <span className="text-[var(--fs-text-muted)] capitalize">
                                • {task.category}
                              </span>
                            )}
                            {task.rolloverCount > 0 && (
                              <span className="text-amber-600 dark:text-amber-400 font-bold">
                                • Rollover x{task.rolloverCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {isOverdue && (
                          <button
                            onClick={() => handleCarryForward(task.id)}
                            className="text-[10px] font-bold px-2.5 py-1 bg-ocean-100 dark:bg-ocean-900/60 text-ocean-800 dark:text-water-400 hover:bg-ocean-200 rounded-md transition-colors"
                            title="Reschedule to Today without losing history"
                          >
                            Carry Forward →
                          </button>
                        )}
                        <button
                          onClick={() => setEditingTask({ ...task })}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-[var(--fs-text-muted)] hover:text-ocean-800 dark:hover:text-water-400 rounded-lg hover:bg-[var(--fs-surface-raised)] transition-all"
                          title="Edit Task"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-[var(--fs-text-muted)] hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB B: WEEK VIEW ───────────────────────────────────────────── */}
      {activeTab === 'week' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between water-card rounded-2xl p-4">
            <button
              onClick={() => changeDateBy(-7)}
              className="p-1.5 rounded-lg border hover:bg-[var(--fs-surface-raised)] text-[var(--fs-text-secondary)]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-center">
              <span className="text-sm font-bold text-[var(--fs-text-primary)]">
                Week of {weekDays[0]?.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {weekDays[6]?.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <button
              onClick={() => changeDateBy(7)}
              className="p-1.5 rounded-lg border hover:bg-[var(--fs-surface-raised)] text-[var(--fs-text-secondary)]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 7 Day Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {weekDays.map(col => (
              <div
                key={col.dateStr}
                className={`water-card rounded-2xl p-3.5 flex flex-col min-h-[380px] ${
                  col.isToday ? 'ring-2 ring-ocean-800 dark:ring-water-500 shadow-md' : ''
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--fs-border)]">
                  <div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                      col.isToday ? 'text-ocean-800 dark:text-water-400 font-extrabold' : 'text-[var(--fs-text-muted)]'
                    }`}>
                      {col.dayName}
                    </span>
                    <span className="text-sm font-bold text-[var(--fs-text-primary)] font-mono">
                      {col.dayNum}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setNewTask(p => ({ ...p, dueDate: col.dateStr }));
                      setShowAddTask(true);
                    }}
                    className="p-1 hover:bg-[var(--fs-surface-raised)] rounded text-[var(--fs-text-muted)] hover:text-ocean-800"
                    title={`Add task for ${col.dayName}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Task Stack */}
                <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar">
                  {col.tasks.length === 0 ? (
                    <div className="text-center py-8 text-[11px] text-[var(--fs-text-muted)] italic">
                      No tasks
                    </div>
                  ) : (
                    col.tasks.map(t => (
                      <div
                        key={t.id}
                        className={`p-2.5 rounded-xl border text-xs transition-all ${
                          t.completed 
                            ? 'bg-[var(--fs-surface-raised)]/40 border-transparent opacity-60 line-through text-[var(--fs-text-muted)]'
                            : 'bg-[var(--fs-surface)] border-[var(--fs-border)] text-[var(--fs-text-primary)] hover:border-ocean-800'
                        }`}
                      >
                        <div className="flex items-start gap-1.5">
                          <button
                            onClick={() => toggleTask(t.id)}
                            className="mt-0.5 text-[var(--fs-text-muted)] hover:text-emerald-500"
                          >
                            {t.completed ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Circle className="w-3.5 h-3.5" />}
                          </button>
                          <span className="font-semibold truncate flex-1 leading-tight">
                            {t.title}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Count */}
                {col.totalCount > 0 && (
                  <div className="pt-2 mt-auto border-t border-[var(--fs-border)] text-[10px] font-mono text-[var(--fs-text-muted)] flex justify-between">
                    <span>Done:</span>
                    <span>{col.completedCount}/{col.totalCount}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB C: MONTH VIEW ──────────────────────────────────────────── */}
      {activeTab === 'month' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between water-card rounded-2xl p-4">
            <button
              onClick={() => changeMonthBy(-1)}
              className="p-1.5 rounded-lg border hover:bg-[var(--fs-surface-raised)] text-[var(--fs-text-secondary)]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-center">
              <span className="text-base font-bold text-[var(--fs-text-primary)]">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <button
              onClick={() => changeMonthBy(1)}
              className="p-1.5 rounded-lg border hover:bg-[var(--fs-surface-raised)] text-[var(--fs-text-secondary)]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="water-card rounded-2xl p-4 md:p-6 overflow-x-auto no-scrollbar">
            <div className="grid grid-cols-7 gap-2 min-w-[600px]">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-bold uppercase tracking-wider text-[var(--fs-text-muted)] pb-2">
                  {d}
                </div>
              ))}

              {monthCalendarDays.map((cell, idx) => {
                if (!cell) {
                  return <div key={`empty-${idx}`} className="h-24 bg-[var(--fs-surface-raised)]/30 rounded-xl" />;
                }

                return (
                  <div
                    key={cell.dateStr}
                    onClick={() => {
                      setSelectedDate(new Date(cell.dateStr));
                      setActiveTab('day');
                    }}
                    className={`h-24 p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all hover:border-ocean-800 ${
                      cell.isToday
                        ? 'bg-ocean-50 dark:bg-ocean-950/40 border-ocean-800 dark:border-water-500'
                        : 'bg-[var(--fs-surface)] border-[var(--fs-border)]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-mono font-bold ${cell.isToday ? 'w-5 h-5 rounded-full bg-ocean-800 text-white flex items-center justify-center' : 'text-[var(--fs-text-primary)]'}`}>
                        {cell.dayNum}
                      </span>
                      {cell.totalCount > 0 && (
                        <span className="text-[10px] font-mono text-[var(--fs-text-muted)]">
                          {cell.completedCount}/{cell.totalCount}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 overflow-hidden">
                      {cell.tasks.slice(0, 2).map(t => (
                        <div key={t.id} className="text-[10px] truncate text-[var(--fs-text-secondary)] bg-[var(--fs-surface-raised)] px-1 rounded">
                          {t.title}
                        </div>
                      ))}
                      {cell.tasks.length > 2 && (
                        <span className="text-[9px] text-ocean-800 dark:text-water-400 font-bold block">
                          +{cell.tasks.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB D: PERSISTED HABIT MATRIX ─────────────────────────────── */}
      {activeTab === 'habits' && (
        <div className="water-card rounded-2xl p-5 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--fs-border)]">
            <div>
              <h3 className="text-lg font-bold text-[var(--fs-text-primary)]">
                Weekly Habit Matrix
              </h3>
              <p className="text-xs text-[var(--fs-text-secondary)]">
                Inspired by high-performance physical planners. Track daily disciplines with precision.
              </p>
            </div>
            <Button
              onClick={() => setShowAddHabit(true)}
              variant="water"
              size="sm"
              icon={Plus}
            >
              Add New Habit
            </Button>
          </div>

          {/* Habit Matrix Table */}
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-[var(--fs-border)]">
                  <th className="py-3 px-4 text-xs font-bold text-[var(--fs-text-muted)] uppercase tracking-wider w-2/5">
                    Habit Discipline
                  </th>
                  {weekDays.map(wd => (
                    <th key={wd.dateStr} className="py-3 px-2 text-center">
                      <div className={`text-[11px] font-bold uppercase tracking-wider ${wd.isToday ? 'text-ocean-800 dark:text-water-400 font-extrabold' : 'text-[var(--fs-text-muted)]'}`}>
                        {wd.dayName}
                      </div>
                      <div className={`text-xs font-mono font-bold mt-0.5 ${wd.isToday ? 'w-6 h-6 rounded-full bg-ocean-800 text-white flex items-center justify-center mx-auto shadow-sm' : 'text-[var(--fs-text-secondary)]'}`}>
                        {wd.dayNum}
                      </div>
                    </th>
                  ))}
                  <th className="py-3 px-3 text-center text-xs font-bold text-[var(--fs-text-muted)] uppercase tracking-wider">
                    Score
                  </th>
                  <th className="py-3 px-3 text-right text-xs font-bold text-[var(--fs-text-muted)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--fs-border)]">
                {habits.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-xs text-[var(--fs-text-muted)]">
                      No habits configured. Create your first habit discipline to start building streaks!
                    </td>
                  </tr>
                ) : (
                  habits.map(habit => {
                    const completedThisWeek = weekDays.filter(
                      wd => habit.history && habit.history[wd.dateStr]
                    ).length;

                    return (
                      <tr key={habit.id} className="hover:bg-[var(--fs-surface-raised)]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs md:text-sm font-bold text-[var(--fs-text-primary)]">
                              {habit.name}
                            </span>
                            {habit.streak > 0 && (
                              <span className="text-[10px] font-extrabold font-mono text-amber-500 flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                                <Flame className="w-2.5 h-2.5 fill-current" /> {habit.streak}d
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[var(--fs-text-muted)] capitalize">
                            {habit.category} • Target {habit.targetDaysPerWeek || 7} days/week
                          </span>
                        </td>

                        {weekDays.map(wd => {
                          const isChecked = Boolean(habit.history && habit.history[wd.dateStr]);
                          return (
                            <td key={wd.dateStr} className="py-2 px-1 text-center">
                              <button
                                onClick={() => user?.uid && toggleDay(user.uid, habit.id, wd.dateStr)}
                                className={`w-8 h-8 rounded-xl border flex items-center justify-center mx-auto transition-all duration-150 ${
                                  isChecked
                                    ? 'bg-ocean-800 dark:bg-water-500 border-ocean-800 dark:border-water-500 text-white dark:text-ocean-950 shadow-sm'
                                    : 'bg-[var(--fs-surface)] hover:bg-[var(--fs-surface-subtle)] border-[var(--fs-border)] text-transparent hover:text-[var(--fs-text-muted)]'
                                }`}
                                title={`Toggle ${habit.name} on ${wd.dayName}`}
                              >
                                <Check className="w-4 h-4 stroke-[3]" />
                              </button>
                            </td>
                          );
                        })}

                        <td className="py-3.5 px-3 text-center">
                          <span className="text-xs font-mono font-bold text-[var(--fs-text-primary)]">
                            {completedThisWeek}/7
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => user?.uid && removeHabit(user.uid, habit.id)}
                            className="p-1 text-[var(--fs-text-muted)] hover:text-rose-500 rounded transition-colors"
                            title="Delete habit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── ADD TASK MODAL ────────────────────────────────────────────── */}
      {showAddTask && (
        <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
          <div className="modal-content rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[var(--fs-border)]">
              <h3 className="text-base font-bold text-[var(--fs-text-primary)]">Create Task / Mission</h3>
              <button onClick={() => setShowAddTask(false)} className="p-1 text-[var(--fs-text-muted)]">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddTaskSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newTask.title}
                  onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                  placeholder="Task title or mission target..."
                  className="w-full px-4 py-2.5 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs md:text-sm text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))}
                  placeholder="Execution notes or criteria..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs md:text-sm text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800"
                  >
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate || dateStr}
                    onChange={e => setNewTask(p => ({ ...p, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800 font-mono"
                  />
                </div>
              </div>

              {monthlyGoals.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1">
                    Link to Goal Pyramid
                  </label>
                  <select
                    value={newTask.linkedGoalId}
                    onChange={e => setNewTask(p => ({ ...p, linkedGoalId: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800"
                  >
                    <option value="">— No linked goal —</option>
                    {monthlyGoals.map(g => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-3">
                <Button type="button" variant="secondary" fullWidth onClick={() => setShowAddTask(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="water" fullWidth>
                  Save Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── EDIT TASK MODAL ───────────────────────────────────────────── */}
      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal-content rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[var(--fs-border)]">
              <h3 className="text-base font-bold text-[var(--fs-text-primary)]">Edit Task</h3>
              <button onClick={() => setEditingTask(null)} className="p-1 text-[var(--fs-text-muted)]">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditTaskSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={editingTask.title}
                  onChange={e => setEditingTask(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs md:text-sm text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1">
                  Description
                </label>
                <textarea
                  value={editingTask.description || ''}
                  onChange={e => setEditingTask(p => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs md:text-sm text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1">
                    Priority
                  </label>
                  <select
                    value={editingTask.priority || 'medium'}
                    onChange={e => setEditingTask(p => ({ ...p, priority: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800"
                  >
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editingTask.dueDate ? editingTask.dueDate.split('T')[0] : dateStr}
                    onChange={e => setEditingTask(p => ({ ...p, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <Button type="button" variant="secondary" fullWidth onClick={() => setEditingTask(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="water" fullWidth>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── ADD HABIT MODAL ───────────────────────────────────────────── */}
      {showAddHabit && (
        <div className="modal-overlay" onClick={() => setShowAddHabit(false)}>
          <div className="modal-content rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[var(--fs-border)]">
              <h3 className="text-base font-bold text-[var(--fs-text-primary)]">New Habit Routine</h3>
              <button onClick={() => setShowAddHabit(false)} className="p-1 text-[var(--fs-text-muted)]">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateHabitSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1">
                  Habit Name *
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newHabit.name}
                  onChange={e => setNewHabit(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Read 20 pages / Morning Run..."
                  className="w-full px-4 py-2.5 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs md:text-sm text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1">
                    Category
                  </label>
                  <select
                    value={newHabit.category}
                    onChange={e => setNewHabit(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800"
                  >
                    <option value="routine">Routine</option>
                    <option value="health">Health & Fitness</option>
                    <option value="learning">Learning</option>
                    <option value="work">Deep Work</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1">
                    Target Days / Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={newHabit.targetDaysPerWeek}
                    onChange={e => setNewHabit(p => ({ ...p, targetDaysPerWeek: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <Button type="button" variant="secondary" fullWidth onClick={() => setShowAddHabit(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="water" fullWidth>
                  Save Habit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
