import { create } from 'zustand';
import { habitService } from '../services/habitService';

export const useHabitStore = create((set, get) => ({
    habits: [],
    loading: false,

    fetchHabits: async (userId) => {
        if (!userId) return;
        set({ loading: true });
        try {
            const habits = await habitService.getUserHabits(userId);
            set({ habits, loading: false });
            localStorage.setItem(`fs_habits_${userId}`, JSON.stringify(habits));
        } catch (err) {
            console.error('Error fetching habits:', err);
            set({ loading: false });
        }
    },

    addHabit: async (userId, habitData) => {
        if (!userId) return;
        const res = await habitService.createHabit(userId, habitData);
        if (res.success && res.habit) {
            set((state) => {
                const updated = [res.habit, ...state.habits];
                localStorage.setItem(`fs_habits_${userId}`, JSON.stringify(updated));
                return { habits: updated };
            });
            return res.habit;
        }
    },

    toggleDay: async (userId, habitId, dateStr) => {
        const { habits } = get();
        const habit = habits.find((h) => h.id === habitId);
        if (!habit || !userId) return;

        const res = await habitService.toggleHabitDay(userId, habit, dateStr);
        if (res.success) {
            set((state) => {
                const updated = state.habits.map((h) =>
                    h.id === habitId
                        ? { ...h, history: res.history, streak: res.streak }
                        : h
                );
                localStorage.setItem(`fs_habits_${userId}`, JSON.stringify(updated));
                return { habits: updated };
            });
        }
    },

    deleteHabit: async (userId, habitId) => {
        await habitService.deleteHabit(habitId);
        set((state) => {
            const updated = state.habits.filter((h) => h.id !== habitId);
            if (userId) localStorage.setItem(`fs_habits_${userId}`, JSON.stringify(updated));
            return { habits: updated };
        });
    },

    getTodayCompletionRatio: () => {
        const { habits } = get();
        if (habits.length === 0) return { completed: 0, total: 0, percentage: 0 };
        const todayStr = new Date().toISOString().split('T')[0];
        const completed = habits.filter((h) => h.history && h.history[todayStr]).length;
        const total = habits.length;
        return {
            completed,
            total,
            percentage: Math.round((completed / total) * 100),
        };
    },
}));
