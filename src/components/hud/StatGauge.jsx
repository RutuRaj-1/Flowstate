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
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col gap-4">
      {/* HP (Health Points) */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Heart size={14} className="animate-pulse" />
            <span>Health (HP)</span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-200">{hp} / {maxHp}</span>
        </div>
        <div className="h-2.5 bg-slate-950/80 border border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${hpPercent}%`,
              background: 'linear-gradient(90deg, #F43F5E, #E11D48)',
              boxShadow: '0 0 8px rgba(244, 63, 94, 0.5)'
            }}
          />
        </div>
      </div>

      {/* FP (Focus Points) */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1.5 text-teal-400 font-bold text-xs uppercase tracking-wider">
            <Activity size={14} />
            <span>Focus (FP)</span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-200">{fp} / {maxFp}</span>
        </div>
        <div className="h-2.5 bg-slate-950/80 border border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${fpPercent}%`,
              background: 'linear-gradient(90deg, #14B8A6, #0D9488)',
              boxShadow: '0 0 8px rgba(20, 184, 166, 0.5)'
            }}
          />
        </div>
      </div>

      {/* EP (Energy Points) */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Zap size={14} />
            <span>Energy (EP)</span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-200">{ep} / {maxEp}</span>
        </div>
        <div className="h-2.5 bg-slate-950/80 border border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${epPercent}%`,
              background: 'linear-gradient(90deg, #F59E0B, #D97706)',
              boxShadow: '0 0 8px rgba(245, 158, 11, 0.5)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatGauge;
