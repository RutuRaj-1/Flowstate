import { create } from 'zustand';
import { db } from '../services/firebase/config';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { useCharacterStore } from './useCharacterStore';
import { useIdentityStore } from './useIdentityStore';

export const QUEST_TIERS = {
  trivial: { id: 'trivial', name: 'Trivial Side-Quest', xp: 15, energy: 5, hpLoss: 2 },
  easy: { id: 'easy', name: 'Minor Quest', xp: 50, energy: 10, hpLoss: 8 },
  medium: { id: 'medium', name: 'Major Quest', xp: 120, energy: 20, hpLoss: 15 },
  hard: { id: 'hard', name: 'Elite Boss Quest', xp: 300, energy: 40, hpLoss: 25 },
  legendary: { id: 'legendary', name: 'World Raid Boss', xp: 800, energy: 75, hpLoss: 50 }
};

export const useQuestStore = create((set, get) => ({
  quests: [],
  loading: false,

  fetchQuests: async (userId) => {
    if (!userId) return;
    set({ loading: true });
    try {
      const q = query(collection(db, 'tasks'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const fetchedQuests = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedQuests.push({
          id: doc.id,
          ...data,
          // Fallback to legacy fields if necessary
          tier: data.tier || (data.priority === 'high' ? 'hard' : data.priority === 'low' ? 'easy' : 'medium'),
          category: data.category || 'work',
          energyCost: data.energyCost || (QUEST_TIERS[data.tier] || QUEST_TIERS.medium).energy,
          xpReward: data.xpReward || (QUEST_TIERS[data.tier] || QUEST_TIERS.medium).xp,
          failureConsequence: data.failureConsequence || {
            hpLoss: (QUEST_TIERS[data.tier] || QUEST_TIERS.medium).hpLoss
          }
        });
      });

      // Sort: incomplete first, then by tier weight descending
      const tierWeights = { legendary: 5, hard: 4, medium: 3, easy: 2, trivial: 1 };
      fetchedQuests.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const wA = tierWeights[a.tier] || 3;
        const wB = tierWeights[b.tier] || 3;
        return wB - wA;
      });

      set({ quests: fetchedQuests });
    } catch (err) {
      console.error('Error fetching quests:', err);
    } finally {
      set({ loading: false });
    }
  },

  addQuest: async (userId, questData) => {
    if (!userId) return;
    const tier = questData.tier || 'medium';
    const tierDetails = QUEST_TIERS[tier];

    // Align attributes based on category
    const statAllocations = {};
    if (questData.category === 'health') statAllocations.consistency = 1;
    else if (questData.category === 'learning') statAllocations.knowledge = 1;
    else if (questData.category === 'routine') statAllocations.discipline = 1;
    else statAllocations.creativity = 0.5; // default work category builds creativity/leadership

    const newQuest = {
      userId,
      title: questData.title,
      description: questData.description || '',
      category: questData.category || 'work',
      tier,
      completed: false,
      completedAt: null,
      failedAt: null,
      dueDate: questData.dueDate || new Date().toISOString().split('T')[0],
      energyCost: tierDetails.energy,
      xpReward: tierDetails.xp,
      statAllocations,
      failureConsequence: {
        hpLoss: tierDetails.hpLoss
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    try {
      const docRef = await addDoc(collection(db, 'tasks'), newQuest);
      const added = { id: docRef.id, ...newQuest };
      set((state) => ({ quests: [added, ...state.quests] }));
      return added;
    } catch (err) {
      console.error('Error adding quest:', err);
    }
  },

  completeQuest: async (userId, questId) => {
    const { quests } = get();
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.completed || !userId) return;

    // Apply Active Class Identity perks
    const activeIdentity = useIdentityStore.getState().currentIdentity;
    let finalXpReward = quest.xpReward;
    
    // Executor gets +15% on work tasks, Vanguard gets double on health tasks
    if (activeIdentity.id === 'executor' && quest.category === 'work') {
      finalXpReward = Math.round(finalXpReward * 1.15);
    } else if (activeIdentity.id === 'vanguard' && quest.category === 'health') {
      finalXpReward = Math.round(finalXpReward * 2.0);
    }

    const updates = {
      completed: true,
      completedAt: new Date().toISOString(),
      updatedAt: Timestamp.now()
    };

    try {
      // 1. Update Firestore
      const docRef = doc(db, 'tasks', questId);
      await updateDoc(docRef, updates);

      // 2. Award XP and attributes in character store
      await useCharacterStore.getState().addXP(userId, finalXpReward, quest.statAllocations);

      // 3. Update local state
      set((state) => ({
        quests: state.quests.map((q) => (q.id === questId ? { ...q, ...updates } : q))
      }));
    } catch (err) {
      console.error('Error completing quest:', err);
    }
  },

  failQuest: async (userId, questId) => {
    const { quests } = get();
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.completed || !userId) return;

    // Apply Guardian identity perk (damage reduction)
    const activeIdentity = useIdentityStore.getState().currentIdentity;
    let finalHpLoss = quest.failureConsequence.hpLoss;
    if (activeIdentity.id === 'guardian') {
      finalHpLoss = Math.round(finalHpLoss * 0.70); // 30% damage reduction
    }

    const updates = {
      completed: false,
      failedAt: new Date().toISOString(),
      updatedAt: Timestamp.now()
    };

    try {
      // 1. Update Firestore
      const docRef = doc(db, 'tasks', questId);
      await updateDoc(docRef, updates);

      // 2. Apply damage to character
      await useCharacterStore.getState().takeDamage(userId, finalHpLoss);

      // 3. Update local state
      set((state) => ({
        quests: state.quests.map((q) => (q.id === questId ? { ...q, ...updates } : q))
      }));
    } catch (err) {
      console.error('Error failing quest:', err);
    }
  },

  deleteQuest: async (questId) => {
    try {
      const docRef = doc(db, 'tasks', questId);
      await deleteDoc(docRef);
      set((state) => ({
        quests: state.quests.filter((q) => q.id !== questId)
      }));
    } catch (err) {
      console.error('Error deleting quest:', err);
    }
  }
}));
