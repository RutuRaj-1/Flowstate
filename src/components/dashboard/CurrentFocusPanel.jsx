import React, { useState, useEffect, memo } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, ArrowRight, Star } from 'lucide-react';

export const CurrentFocusPanel = memo(({ 
  activeTask, 
  nextTask, 
  onCompleteTask, 
  onSelectTask 
}) => {
  // Focus timer state (25 minutes default = 1500s)
  const DEFAULT_SECONDS = 25 * 60;
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const toggleTimer = () => setIsRunning((prev) => !prev);
  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(DEFAULT_SECONDS);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const timerProgress = Math.round(((DEFAULT_SECONDS - secondsLeft) / DEFAULT_SECONDS) * 100);

  return (
    <div className="water-card rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-[var(--fs-surface)] to-[var(--fs-surface-raised)] border-l-4 border-l-ocean-800">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left: Active Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-ocean-800 text-white flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 text-water-300 fill-current" /> Current Focus
            </span>
            {activeTask?.priority && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                activeTask.priority === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' :
                activeTask.priority === 'low' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
              }`}>
                {activeTask.priority} Priority
              </span>
            )}
            {activeTask?.category && (
              <span className="text-[10px] font-semibold text-[var(--fs-text-muted)] uppercase tracking-wider">
                • {activeTask.category}
              </span>
            )}
          </div>

          {activeTask ? (
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[var(--fs-text-primary)] tracking-tight leading-snug">
                {activeTask.title}
              </h2>
              {activeTask.description && (
                <p className="text-xs text-[var(--fs-text-secondary)] mt-1 line-clamp-2 max-w-xl">
                  {activeTask.description}
                </p>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[var(--fs-text-primary)] tracking-tight">
                Choose your next focus
              </h2>
              <p className="text-xs text-[var(--fs-text-secondary)] mt-1">
                Select a high-priority mission from your agenda to enter flow state.
              </p>
            </div>
          )}

          {/* Next Task recommendation */}
          {nextTask && (
            <div className="mt-4 pt-3 border-t border-[var(--fs-border)] flex items-center gap-2 text-xs text-[var(--fs-text-secondary)]">
              <span className="font-bold text-[var(--fs-text-muted)] uppercase tracking-wider text-[10px]">Next Up:</span>
              <button 
                onClick={() => onSelectTask && onSelectTask(nextTask)}
                className="font-semibold text-ocean-800 dark:text-water-400 hover:underline flex items-center gap-1 truncate max-w-md"
              >
                {nextTask.title} <ArrowRight className="w-3 h-3 flex-shrink-0" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Integrated Focus Timer */}
        <div className="flex-shrink-0 flex items-center gap-4 bg-[var(--fs-surface)] p-4 rounded-xl border border-[var(--fs-border)] shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-black font-mono text-ocean-900 dark:text-water-300 tracking-tight">
              {formattedTime}
            </div>
            <div className="text-[10px] text-[var(--fs-text-muted)] uppercase tracking-wider mt-0.5">
              Deep Work Timer
            </div>
            {/* Progress bar */}
            <div className="w-28 h-1.5 bg-[var(--fs-surface-raised)] rounded-full mt-2 overflow-hidden mx-auto">
              <div 
                className="h-full bg-ocean-800 dark:bg-water-500 rounded-full transition-all duration-1000"
                style={{ width: `${timerProgress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <button
              onClick={toggleTimer}
              className={`p-2.5 rounded-lg text-white font-bold transition-all shadow-sm ${
                isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-ocean-800 hover:bg-ocean-700'
              }`}
              title={isRunning ? 'Pause Timer' : 'Start Focus Session'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-2 rounded-lg bg-[var(--fs-surface-raised)] hover:bg-[var(--fs-surface-subtle)] text-[var(--fs-text-secondary)] transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            {activeTask && (
              <button
                onClick={() => onCompleteTask && onCompleteTask(activeTask.id)}
                className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white transition-colors"
                title="Mark Current Focus Complete"
              >
                <CheckCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
});

CurrentFocusPanel.displayName = 'CurrentFocusPanel';
export default CurrentFocusPanel;
