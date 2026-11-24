import React from 'react';
import { useCharacterStore, getXpForNextLevel } from '../../stores/useCharacterStore';
import { Zap, Trophy } from 'lucide-react';

export const ProgressBar = () => {
  const { character } = useCharacterStore();
  
  if (!character) return null;

  const { level, xp, title } = character;
  const xpNeeded = getXpForNextLevel(level);
  const percentage = Math.min(100, Math.max(0, (xp / xpNeeded) * 100));

  return (
    <div className="water-card rounded-2xl p-4 md:p-5 relative overflow-hidden">
      {/* Top light reflection border */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ocean-800 via-water-500 to-ocean-800" />
      
      <div className="flex justify-between items-center mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-ocean-100 dark:bg-ocean-900/60 text-ocean-800 dark:text-water-400 flex items-center justify-center font-bold text-sm">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-ocean-800 dark:text-water-400 block leading-tight">
              Progression Level {level}
            </span>
            <h3 className="text-sm md:text-base font-extrabold text-[var(--fs-text-primary)] tracking-tight">
              {title}
            </h3>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-[var(--fs-text-muted)] uppercase tracking-wider block">Experience</span>
          <p className="text-xs md:text-sm font-bold font-mono text-[var(--fs-text-primary)]">
            {xp} <span className="text-[var(--fs-text-muted)] font-normal">/ {xpNeeded} XP</span>
          </p>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="relative h-3 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-full overflow-hidden p-0.5">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #075B9A 0%, #0877B8 50%, #5BBEDB 100%)',
            boxShadow: '0 0 10px rgba(91, 190, 219, 0.4)'
          }}
        />
      </div>
      
      <div className="flex justify-between items-center mt-2.5 text-[10px] text-[var(--fs-text-muted)] font-medium">
        <span>Active Persona Bonus Active</span>
        <span className="flex items-center gap-1 font-mono text-ocean-800 dark:text-water-400">
          <Zap className="w-3 h-3" /> {Math.round(xpNeeded - xp)} XP to Next Level
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
