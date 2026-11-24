import React from 'react';
import { Heart, Activity, Zap } from 'lucide-react';
import { useCharacterStore } from '../../stores/useCharacterStore';

export const StatGauge = () => {
  const { character } = useCharacterStore();

  if (!character) return null;

  const { hp, maxHp, fp, maxFp, ep, maxEp } = character;

  const hpPercent = Math.min(100, Math.max(0, (hp / maxHp) * 100));
  const fpPercent = Math.min(100, Math.max(0, (fp / maxFp) * 100));
  const epPercent = Math.min(100, Math.max(0, (ep / maxEp) * 100));

  return (
    <div className="water-card rounded-2xl p-4 md:p-5 flex flex-col justify-between gap-3 h-full">
      {/* HP (Health Points) */}
      <div>
        <div className="flex justify-between items-center mb-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-rose-500">
            <Heart size={13} className="animate-pulse" />
            <span>Health (HP)</span>
          </div>
          <span className="font-mono font-bold text-[var(--fs-text-primary)] text-xs">{hp} / {maxHp}</span>
        </div>
        <div className="h-2 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${hpPercent}%`,
              background: 'linear-gradient(90deg, #F43F5E, #E11D48)',
            }}
          />
        </div>
      </div>

      {/* FP (Focus Points) */}
      <div>
        <div className="flex justify-between items-center mb-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-water-600 dark:text-water-400">
            <Activity size={13} />
            <span>Focus (FP)</span>
          </div>
          <span className="font-mono font-bold text-[var(--fs-text-primary)] text-xs">{fp} / {maxFp}</span>
        </div>
        <div className="h-2 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${fpPercent}%`,
              background: 'linear-gradient(90deg, #075B9A, #5BBEDB)',
            }}
          />
        </div>
      </div>

      {/* EP (Energy Points) */}
      <div>
        <div className="flex justify-between items-center mb-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-500">
            <Zap size={13} />
            <span>Energy (EP)</span>
          </div>
          <span className="font-mono font-bold text-[var(--fs-text-primary)] text-xs">{ep} / {maxEp}</span>
        </div>
        <div className="h-2 bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${epPercent}%`,
              background: 'linear-gradient(90deg, #F59E0B, #D97706)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatGauge;
