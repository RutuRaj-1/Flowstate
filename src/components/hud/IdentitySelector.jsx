import React from 'react';
import { useIdentityStore, IDENTITIES } from '../../stores/useIdentityStore';
import { useAuth } from '../../hooks/useAuth';
import { Shield, Compass, BookOpen, Flame } from 'lucide-react';

const ICON_MAP = {
  vanguard: Flame,
  strategist: BookOpen,
  guardian: Shield,
  executor: Compass
};

export const IdentitySelector = () => {
  const { user } = useAuth();
  const { currentIdentity, syncIdentity } = useIdentityStore();

  const handleSelect = (identityId) => {
    if (user?.uid) {
      syncIdentity(user.uid, identityId);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Select Daily Archetype</h3>
        <p className="text-xs text-slate-400">Choose your class to unlock daily passive bonuses and active abilities.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(IDENTITIES).map((identity) => {
          const Icon = ICON_MAP[identity.id];
          const isSelected = currentIdentity.id === identity.id;
          
          return (
            <button
              key={identity.id}
              onClick={() => handleSelect(identity.id)}
              className={`relative flex flex-col text-left p-4 rounded-xl border transition-all duration-300 overflow-hidden ${
                isSelected
                  ? 'bg-slate-800/80 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              {/* Highlight background glow */}
              {isSelected && (
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{ backgroundColor: identity.themeColors.primary }}
                />
              )}

              <div className="flex items-center gap-3 mb-2">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: isSelected ? identity.themeColors.bgGlow : 'rgba(255,255,255,0.05)',
                    color: identity.themeColors.primary
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-100 tracking-tight">{identity.name}</h4>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                    {identity.coachingStyle.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed mb-3 flex-grow">
                {identity.description}
              </p>

              <div className="mt-auto pt-2 border-t border-slate-800/80">
                <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-bold block mb-1">
                  Passive Perk
                </span>
                <p className="text-[10px] text-slate-300 italic leading-snug">
                  {identity.perks}
                </p>
              </div>

              {/* Selection indicator dots/corner notches */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: identity.themeColors.primary }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default IdentitySelector;
