import { create } from 'zustand';
import { db } from '../services/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

export const IDENTITIES = {
  vanguard: {
    id: 'vanguard',
    name: 'Vanguard',
    coachingStyle: 'tough_love_commander',
    preferredCategory: 'health',
    description: 'A bold front-line warrior of action. Focuses on bodily strength, morning tasks, and pushing past physical limits.',
    perks: 'Earn double XP on physical & health missions. Focus recoveries are 15% faster.',
    theme: 'vanguard-crimson',
    themeColors: {
      primary: '#EF4444',
      bgGlow: 'rgba(239, 68, 68, 0.15)',
      gradient: 'linear-gradient(135deg, #EF4444, #991B1B)'
    },
    passiveBonus: {
      xpMultiplier: 1.0,
      regenBonus: 0.15,
    }
  },
  strategist: {
    id: 'strategist',
    name: 'Strategist',
    coachingStyle: 'analytical_mentor',
    preferredCategory: 'learning',
    description: 'A master of systems, knowledge, and planning. Optimizes work processes and gains depth of understanding.',
    perks: 'Knowledge and Creativity attributes increase 25% faster. Deep work focus capacity boosted by 20 FP.',
    theme: 'strategist-teal',
    themeColors: {
      primary: '#0D9488',
      bgGlow: 'rgba(13, 148, 136, 0.15)',
      gradient: 'linear-gradient(135deg, #0D9488, #115E59)'
    },
    passiveBonus: {
      xpMultiplier: 1.0,
      focusCapacityBonus: 20
    }
  },
  guardian: {
    id: 'guardian',
    name: 'Guardian',
    coachingStyle: 'calm_stoic',
    preferredCategory: 'routine',
    description: 'The shield of consistency and peace of mind. Excellent at repetitive habits, routines, and avoiding burnout.',
    perks: 'Habits consume 20% less energy. HP damage from failed tasks is reduced by 30%.',
    theme: 'guardian-gold',
    themeColors: {
      primary: '#D97706',
      bgGlow: 'rgba(217, 119, 6, 0.15)',
      gradient: 'linear-gradient(135deg, #D97706, #78350F)'
    },
    passiveBonus: {
      energyDiscount: 0.20,
      damageReduction: 0.30
    }
  },
  executor: {
    id: 'executor',
    name: 'Executor',
    coachingStyle: 'relentless_hustler',
    preferredCategory: 'work',
    description: 'The relentless deliverer of results. Specializes in intense execution sessions, high-volume tasks, and defeating bosses.',
    perks: 'Deals 50% more progress damage to Campaign Bosses. Critical tasks yield 15% extra XP.',
    theme: 'executor-purple',
    themeColors: {
      primary: '#9333EA',
      bgGlow: 'rgba(147, 51, 234, 0.15)',
      gradient: 'linear-gradient(135deg, #9333EA, #581C87)'
    },
    passiveBonus: {
      bossDmgMultiplier: 1.5,
      workXpBonus: 0.15
    }
  }
};

export const useIdentityStore = create((set, get) => ({
  currentIdentity: IDENTITIES.strategist,

  setIdentityLocally: (identityId) => {
    const identity = IDENTITIES[identityId];
    if (identity) {
      set({ currentIdentity: identity });
      applyTheme(identity.theme);
    }
  },

  syncIdentity: async (userId, identityId) => {
    const identity = IDENTITIES[identityId];
    if (!identity || !userId) return;

    set({ currentIdentity: identity });
    applyTheme(identity.theme);

    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        'character.currentIdentity': identityId
      });
    } catch (err) {
      console.error('Error updating player identity:', err);
    }
  }
}));

const applyTheme = (themeName) => {
  // Clear any existing class prefix themes on body
  const body = document.body;
  const classesToRemove = Array.from(body.classList).filter(c => c.startsWith('theme-') || c.startsWith('identity-'));
  classesToRemove.forEach(c => body.classList.remove(c));
  
  // Add the new identity theme class
  body.classList.add(`theme-${themeName}`);
  body.classList.add(`identity-${themeName.split('-')[0]}`);
};
