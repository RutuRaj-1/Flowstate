import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Target, ChevronDown, X, Medal } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useGoals } from '../../hooks/useGoals';
import { useCharacterStore } from '../../stores/useCharacterStore';
import { useIdentityStore } from '../../stores/useIdentityStore';
import { useQuestStore } from '../../stores/useQuestStore';
import { useHabitStore } from '../../stores/useHabitStore';
import ProgressBar from '../../components/hud/ProgressBar';
import StatGauge from '../../components/hud/StatGauge';
import IdentitySelector from '../../components/hud/IdentitySelector';
import TodayKPIStrip from '../../components/dashboard/TodayKPIStrip';
import CurrentFocusPanel from '../../components/dashboard/CurrentFocusPanel';
import TodayAgenda from '../../components/dashboard/TodayAgenda';
import HabitMatrixPreview from '../../components/dashboard/HabitMatrixPreview';
import GoalAlignmentSection from '../../components/dashboard/GoalAlignmentSection';
import ExecutionHighlights from '../../components/dashboard/ExecutionHighlights';
import AICoachSnippet from '../../components/dashboard/AICoachSnippet';
import Button from '../../components/common/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tasks, addTask, toggleTask } = useTasks();
  const { goals, progressMap } = useGoals();

  // Stores
  const { character, loadCharacter, isLevelingUp, dismissLevelUp } = useCharacterStore();
  const { currentIdentity, setIdentityLocally } = useIdentityStore();
  const { fetchQuests, addQuest, completeQuest } = useQuestStore();
  const { habits, fetchHabits, getTodayCompletionRatio } = useHabitStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFocusTask, setSelectedFocusTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'work',
    tier: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
  });

  // Load user data on mount
  useEffect(() => {
    if (user?.uid) {
      loadCharacter(user.uid);
      fetchQuests(user.uid);
      fetchHabits(user.uid);
    }
  }, [user, loadCharacter, fetchQuests, fetchHabits]);

  // Sync archetype theme class locally
  useEffect(() => {
    if (character?.currentIdentity) {
      setIdentityLocally(character.currentIdentity);
    }
  }, [character?.currentIdentity, setIdentityLocally]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter tasks due today or rolled over
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => {
      const td = t.dueDate ? t.dueDate.split('T')[0] : '';
      return td === todayStr || (!t.completed && td < todayStr);
    });
  }, [tasks, todayStr]);

  const completedToday = useMemo(() => todayTasks.filter((t) => t.completed).length, [todayTasks]);

  // Derive Current Focus task (either explicitly selected, or highest priority uncompleted today)
  const currentFocus = useMemo(() => {
    if (selectedFocusTask && !selectedFocusTask.completed) {
      return selectedFocusTask;
    }
    const uncompleted = todayTasks.filter((t) => !t.completed);
    const high = uncompleted.find((t) => t.priority === 'high');
    return high || uncompleted[0] || null;
  }, [selectedFocusTask, todayTasks]);

  // Derive Next Task recommendation
  const nextTask = useMemo(() => {
    const uncompleted = todayTasks.filter((t) => !t.completed && t.id !== currentFocus?.id);
    return uncompleted[0] || null;
  }, [todayTasks, currentFocus]);

  // Habit metrics
  const habitRatio = useMemo(() => getTodayCompletionRatio(), [getTodayCompletionRatio]);

  // Streak calculation from completed tasks
  const streakDays = useMemo(() => {
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const dayTasks = tasks.filter((t) => t.dueDate && t.dueDate.split('T')[0] === ds);
      if (dayTasks.length > 0 && dayTasks.filter((t) => t.completed).length / dayTasks.length >= 0.5) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return Math.max(streak, 1);
  }, [tasks]);

  // Handle task completion
  const handleToggleTask = useCallback(async (taskId) => {
    await toggleTask(taskId);
    if (user?.uid) {
      const task = tasks.find((t) => t.id === taskId);
      if (task && !task.completed) {
        await completeQuest(user.uid, taskId);
      }
    }
  }, [toggleTask, completeQuest, user?.uid, tasks]);

  // Handle Add Task submission
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !user?.uid) return;

    // Add to TaskContext
    await addTask({
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      category: newTask.category,
      dueDate: newTask.dueDate,
    });

    // Also register in quest system if user has questing enabled
    await addQuest(user.uid, {
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
      tier: newTask.tier,
      dueDate: newTask.dueDate,
    });

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'work',
      tier: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
    });
    setShowAddModal(false);
  };

  const displayName = user?.displayName || character?.name || 'Adventurer';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--fs-border)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black text-[var(--fs-text-primary)] tracking-tight">
              Welcome, {displayName}
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-ocean-100 dark:bg-ocean-900/60 text-ocean-800 dark:text-water-400">
              {currentIdentity.name}
            </span>
          </div>
          <p className="text-xs md:text-sm text-[var(--fs-text-secondary)] mt-0.5">
            Turn intention into action. Stay in flow.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAddModal(true)}
            variant="water"
            size="md"
            icon={Plus}
          >
            Create Mission
          </Button>
        </div>
      </div>

      {/* 2. Today's Execution KPI Strip */}
      <TodayKPIStrip
        completedTasks={completedToday}
        totalTasks={todayTasks.length}
        streak={streakDays}
        habitsCompleted={habitRatio.completed}
        totalHabits={habitRatio.total}
        focusMinutes={50}
        xpEarned={completedToday * 120}
      />

      {/* 3. Primary Visual Anchor: Current Focus Panel */}
      <CurrentFocusPanel
        activeTask={currentFocus}
        nextTask={nextTask}
        onCompleteTask={handleToggleTask}
        onSelectTask={(task) => setSelectedFocusTask(task)}
      />

      {/* 4. Execution Core: 2/3 Left (Agenda & Habit Matrix) vs 1/3 Right (HUD, Goals, Highlights) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 of 12) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Today's Agenda */}
          <TodayAgenda
            tasks={todayTasks}
            onToggleTask={handleToggleTask}
            onSelectFocus={(task) => setSelectedFocusTask(task)}
            onAddTask={() => setShowAddModal(true)}
          />

          {/* Weekly Habit Cadence */}
          <HabitMatrixPreview onOpenFullHabits={() => navigate('/tasks')} />

          {/* AI Coach Snippet */}
          <AICoachSnippet tasks={todayTasks} />
        </div>

        {/* Right Column (4 of 12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Compact RPG HUD Status */}
          <div className="space-y-4">
            <ProgressBar />
            <StatGauge />
          </div>

          {/* Goal Pyramid Alignment */}
          <GoalAlignmentSection goals={goals} progressMap={progressMap} />

          {/* Execution Highlights Feed */}
          <ExecutionHighlights tasks={tasks} habits={habits} character={character} />
        </div>
      </div>

      {/* 5. Archetype Persona Selector */}
      <IdentitySelector />

      {/* Create Mission / Task Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content rounded-2xl p-6 relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[var(--fs-border)]">
              <h3 className="text-base font-bold text-[var(--fs-text-primary)] flex items-center gap-2">
                <Target size={16} className="text-ocean-800 dark:text-water-400" />
                Schedule New Mission
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-[var(--fs-surface-raised)] rounded-lg text-[var(--fs-text-muted)]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1.5">
                  Mission Title *
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Implement Raft cluster heartbeat..."
                  className="w-full px-4 py-2.5 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs md:text-sm text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1.5">
                  Details / Context
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Key milestones or execution notes..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs md:text-sm text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1.5">
                    Priority
                  </label>
                  <div className="relative">
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800 appearance-none font-medium"
                    >
                      <option value="high">🔴 High Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="low">🟢 Low Priority</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fs-text-muted)] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1.5">
                    Difficulty Tier
                  </label>
                  <div className="relative">
                    <select
                      value={newTask.tier}
                      onChange={(e) => setNewTask((p) => ({ ...p, tier: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800 appearance-none font-medium"
                    >
                      <option value="trivial">🟢 Trivial (+15 XP)</option>
                      <option value="easy">🔵 Easy (+50 XP)</option>
                      <option value="medium">🟡 Medium (+120 XP)</option>
                      <option value="hard">🔴 Hard Boss (+300 XP)</option>
                      <option value="legendary">💀 World Boss (+800 XP)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fs-text-muted)] pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1.5">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask((p) => ({ ...p, category: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800 appearance-none font-medium"
                    >
                      <option value="work">⚔️ Campaign Work</option>
                      <option value="health">🛡️ Health & Vitality</option>
                      <option value="learning">🎓 Learning & Books</option>
                      <option value="routine">🏆 Daily Routine</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fs-text-muted)] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--fs-text-secondary)] block mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask((p) => ({ ...p, dueDate: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-xl text-xs text-[var(--fs-text-primary)] focus:outline-none focus:border-ocean-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="water"
                  fullWidth
                >
                  Schedule Mission
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Level Up Celebration Dialog */}
      {isLevelingUp && (
        <div className="modal-overlay">
          <div className="modal-content rounded-3xl p-8 text-center space-y-5 border-2 border-water-500 shadow-pop">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ocean-800 to-water-500 text-white flex items-center justify-center mx-auto shadow-ocean">
              <Medal className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-water-600 dark:text-water-400">
                Milestone Unlocked
              </span>
              <h2 className="text-2xl font-black text-[var(--fs-text-primary)] tracking-tight mt-1">
                CHARACTER LEVEL UP!
              </h2>
              <p className="text-xs text-[var(--fs-text-secondary)] mt-2">
                You have advanced to Level <span className="font-bold text-ocean-800 dark:text-water-400">{character?.level}</span>.
                +5 Attribute Points granted to enhance your stats!
              </p>
            </div>
            <Button
              variant="water"
              onClick={dismissLevelUp}
              fullWidth
            >
              Claim Rewards
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
