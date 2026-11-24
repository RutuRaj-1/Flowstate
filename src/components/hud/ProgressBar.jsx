import React from 'react';
import { useCharacterStore, getXpForNextLevel } from '../../stores/useCharacterStore';

export const ProgressBar = () => {
  const { character } = useCharacterStore();
  
  if (!character) return null;

  const { level, xp, title } = character;
  const xpNeeded = getXpForNextLevel(level);
  const percentage = Math.min(100, Math.max(0, (xp / xpNeeded) * 100));

  return (
    <div className="relative bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden group">
      {/* Dynamic light reflection edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Player Status</span>
          <h2 className="text-lg font-extrabold text-slate-100 tracking-tight flex items-baseline gap-2">
            Level {level} <span className="text-xs font-medium text-slate-400">({title})</span>
          </h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Experience Points</span>
          <p className="text-sm font-semibold text-slate-200">
            {xp} <span className="text-slate-500">/ {xpNeeded} XP</span>
          </p>
        </div>
      </div>

      {/* Outer bar with futuristic corner notches */}
      <div className="relative h-4 bg-slate-950/80 border border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
        {/* Animated bar fill */}
        <div
          className="h-full rounded-full transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) relative overflow-hidden"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.6)'
          }}
        >
          {/* Shimmering scanning line animation */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }} />
        </div>
      </div>
      
      {/* Quick stats indicators */}
      <div className="flex justify-between items-center mt-3 text-[11px] text-slate-400 font-mono">
        <span>STRENGTHS: +{character.attributes?.discipline || 10} DISCIPLINE</span>
        <span>NEXT TARGET: {Math.round(xpNeeded - xp)} XP TO UPGRADE</span>
      </div>
      
      {/* Embedded keyframe styles for custom AAA details */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;
