import React from 'react';
import { useIdentityStore, IDENTITIES } from '../../stores/useIdentityStore';
import { useAuth } from '../../hooks/useAuth';
import { Shield, Compass, BookOpen, Flame, Check } from 'lucide-react';

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
    <div className="water-card rounded-2xl p-5 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h3 className="text-sm font-bold text-ocean-800 dark:text-water-400 uppercase tracking-wider">
            Execution Archetypes
          </h3>
          <p className="text-xs text-[var(--fs-text-secondary)]">
            Select your active operational persona to unlock specialized passive perks.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-ocean-100 dark:bg-ocean-900/60 text-ocean-800 dark:text-water-300 w-fit">
          Active: {currentIdentity.name}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {Object.values(IDENTITIES).map((identity) => {
          const Icon = ICON_MAP[identity.id];
          const isSelected = currentIdentity.id === identity.id;
          
          return (
            <button
              key={identity.id}
              onClick={() => handleSelect(identity.id)}
              className={`relative flex flex-col text-left p-4 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-ocean-50 dark:bg-ocean-900/40 border-ocean-800 dark:border-water-500 shadow-md ring-2 ring-ocean-800/20 dark:ring-water-500/20'
                  : 'bg-[var(--fs-surface)] hover:bg-[var(--fs-surface-raised)] border-[var(--fs-border)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="p-1.5 rounded-lg"
                    style={{
                      backgroundColor: `${identity.themeColors.primary}18`,
                      color: identity.themeColors.primary
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <h4 className="font-bold text-xs md:text-sm text-[var(--fs-text-primary)]">
                    {identity.name}
                  </h4>
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-ocean-800 dark:bg-water-500 text-white dark:text-ocean-950 flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>

              <p className="text-[11px] text-[var(--fs-text-secondary)] leading-relaxed mb-3 flex-grow line-clamp-2">
                {identity.description}
              </p>

              <div className="mt-auto pt-2 border-t border-[var(--fs-border)]">
                <span className="text-[9px] uppercase tracking-wider text-ocean-800 dark:text-water-400 font-bold block mb-0.5">
                  Passive Bonus
                </span>
                <p className="text-[10px] text-[var(--fs-text-primary)] leading-tight">
                  {identity.perks}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default IdentitySelector;
