import { create } from 'zustand';
import { db } from '../services/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const LEVEL_FORMULA = {
  A: 120,
  B: 1.7,
  C: 250,
};

// Calculate XP required for next level
export const getXpForNextLevel = (level) => {
  return Math.round(LEVEL_FORMULA.A * Math.pow(level, LEVEL_FORMULA.B) + LEVEL_FORMULA.C * level);
};

const DEFAULT_CHARACTER = {
  name: 'Initiate',
  level: 1,
  xp: 0,
  hp: 100,
  maxHp: 100,
  fp: 100,
  maxFp: 100,
  ep: 100,
  maxEp: 100,
  attributes: {
    discipline: 10,
    knowledge: 10,
    creativity: 10,
    leadership: 10,
    consistency: 10
  },
  currentIdentity: 'strategist',
  title: 'Novice Adventurer',
  attributePoints: 0
};

export const useCharacterStore = create((set, get) => ({
  character: { ...DEFAULT_CHARACTER },
  loading: false,
  isLevelingUp: false,

  setCharacter: (data) => set({ character: { ...get().character, ...data } }),

  loadCharacter: async (userId) => {
    if (!userId) return;
    set({ loading: true });
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.character) {
          // Merge with default character stats to ensure backwards compatibility
          const mergedChar = {
            ...DEFAULT_CHARACTER,
            ...data.character,
            attributes: {
              ...DEFAULT_CHARACTER.attributes,
              ...(data.character.attributes || {})
            }
          };
          // Re-calc max stats
          mergedChar.maxHp = 100 + (mergedChar.attributes.discipline * 2) + (mergedChar.level * 5);
          mergedChar.maxFp = 100 + (mergedChar.attributes.knowledge * 3);
          mergedChar.maxEp = 100 + (mergedChar.attributes.consistency * 2);
          
          set({ character: mergedChar });
        } else {
          // Create character in DB
          await updateDoc(docRef, { character: DEFAULT_CHARACTER });
          set({ character: { ...DEFAULT_CHARACTER } });
        }
      }
    } catch (err) {
      console.error('Error loading character:', err);
    } finally {
      set({ loading: false });
    }
  },

  addXP: async (userId, xpAmount, statModifiers = {}) => {
    const { character } = get();
    if (!character || !userId) return;

    let newXP = character.xp + xpAmount;
    let newLevel = character.level;
    let nextLevelXP = getXpForNextLevel(newLevel);
    let leveledUp = false;
    let addedPoints = 0;

    while (newXP >= nextLevelXP) {
      newXP -= nextLevelXP;
      newLevel += 1;
      nextLevelXP = getXpForNextLevel(newLevel);
      leveledUp = true;
      addedPoints += 5; // 5 attribute points per level up
    }

    // Apply stat modifiers if any (e.g. +1 discipline for completing a study task)
    const newAttributes = { ...character.attributes };
    Object.keys(statModifiers).forEach(key => {
      if (newAttributes[key] !== undefined) {
        newAttributes[key] = Math.round((newAttributes[key] + statModifiers[key]) * 10) / 10;
      }
    });

    const maxHp = 100 + (newAttributes.discipline * 2) + (newLevel * 5);
    const maxFp = 100 + (newAttributes.knowledge * 3);
    const maxEp = 100 + (newAttributes.consistency * 2);

    const updatedChar = {
      ...character,
      xp: Math.round(newXP),
      level: newLevel,
      hp: leveledUp ? maxHp : Math.min(character.hp + Math.round(xpAmount * 0.1), maxHp), // heal small amount on completion
      maxHp,
      fp: Math.min(character.fp + Math.round(xpAmount * 0.05), maxFp),
      maxFp,
      ep: Math.min(character.ep, maxEp),
      maxEp,
      attributes: newAttributes,
      attributePoints: character.attributePoints + addedPoints
    };

    // Calculate dynamic title based on level
    updatedChar.title = getDynamicTitle(newLevel, updatedChar.currentIdentity);

    set({ character: updatedChar, isLevelingUp: leveledUp });

    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, { character: updatedChar });
    } catch (err) {
      console.error('Error saving character level progress:', err);
    }
  },

  takeDamage: async (userId, damageAmount) => {
    const { character } = get();
    if (!character || !userId) return;

    const newHp = Math.max(0, character.hp - damageAmount);
    const updatedChar = { ...character, hp: newHp };

    set({ character: updatedChar });

    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, { character: updatedChar });
    } catch (err) {
      console.error('Error saving character damage:', err);
    }
  },

  spendAttributePoint: async (userId, attrName) => {
    const { character } = get();
    if (!character || character.attributePoints <= 0 || !userId) return;

    const newAttributes = {
      ...character.attributes,
      [attrName]: (character.attributes[attrName] || 0) + 1
    };

    const maxHp = 100 + (newAttributes.discipline * 2) + (character.level * 5);
    const maxFp = 100 + (newAttributes.knowledge * 3);
    const maxEp = 100 + (newAttributes.consistency * 2);

    const updatedChar = {
      ...character,
      attributes: newAttributes,
      attributePoints: character.attributePoints - 1,
      maxHp,
      maxFp,
      maxEp
    };

    set({ character: updatedChar });

    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, { character: updatedChar });
    } catch (err) {
      console.error('Error upgrading attribute:', err);
    }
  },

  dismissLevelUp: () => set({ isLevelingUp: false })
}));

const getDynamicTitle = (level, identity) => {
  const tiers = ['Novice', 'Apprentice', 'Journeyman', 'Expert', 'Master', 'Grandmaster', 'Legendary', 'Demi-God'];
  const tierIndex = Math.min(Math.floor((level - 1) / 5), tiers.length - 1);
  const tier = tiers[tierIndex];
  
  const idCapitalized = identity.charAt(0).toUpperCase() + identity.slice(1);
  return `${tier} ${idCapitalized}`;
};
