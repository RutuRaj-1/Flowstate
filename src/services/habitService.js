import { 
    collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, Timestamp 
} from "firebase/firestore";
import { db } from "./firebase/config";

const HABITS_COLLECTION = "habits";

// Default starter habits for new adventurers
export const DEFAULT_HABITS = [
    { name: "Morning Focus & Hydration", category: "health", targetDaysPerWeek: 7, frequency: "daily" },
    { name: "Deep Work Sprint (90 min)", category: "work", targetDaysPerWeek: 5, frequency: "weekdays" },
    { name: "Daily Skill / Reading", category: "learning", targetDaysPerWeek: 5, frequency: "weekdays" },
    { name: "Codex Evening Reflection", category: "routine", targetDaysPerWeek: 7, frequency: "daily" },
];

/**
 * Calculate streak count from habit history map
 */
export const calculateHabitStreak = (history = {}) => {
    let streak = 0;
    const today = new Date();
    
    // Check backwards from today up to 365 days
    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const ds = d.toISOString().split('T')[0];
        
        if (history[ds]) {
            streak++;
        } else if (i === 0) {
            // Today might not be completed yet, grant grace period
            continue;
        } else {
            break;
        }
    }
    return streak;
};

export const habitService = {
    getUserHabits: async (userId) => {
        try {
            const q = query(collection(db, HABITS_COLLECTION), where("userId", "==", userId));
            const snapshot = await getDocs(q);
            const habits = [];
            snapshot.forEach((d) => {
                const data = d.data();
                habits.push({
                    id: d.id,
                    ...data,
                    history: data.history || {},
                    streak: calculateHabitStreak(data.history || {}),
                });
            });

            // If user has no habits yet, auto-seed defaults
            if (habits.length === 0) {
                const seeded = [];
                for (const def of DEFAULT_HABITS) {
                    const payload = {
                        userId,
                        name: def.name,
                        category: def.category,
                        frequency: def.frequency,
                        targetDaysPerWeek: def.targetDaysPerWeek,
                        history: {},
                        archived: false,
                        createdAt: Timestamp.now(),
                        updatedAt: Timestamp.now(),
                    };
                    const docRef = await addDoc(collection(db, HABITS_COLLECTION), payload);
                    seeded.push({ id: docRef.id, ...payload, streak: 0 });
                }
                return seeded;
            }

            return habits;
        } catch (error) {
            console.warn("Firestore habits fetch error, using local fallback:", error);
            const local = localStorage.getItem(`fs_habits_${userId}`);
            if (local) {
                try { return JSON.parse(local); } catch (e) {}
            }
            // Return defaults locally
            return DEFAULT_HABITS.map((def, idx) => ({
                id: `local_${idx}`,
                userId,
                ...def,
                history: {},
                streak: 0,
            }));
        }
    },

    createHabit: async (userId, habitData) => {
        const payload = {
            userId,
            name: habitData.name,
            category: habitData.category || "routine",
            frequency: habitData.frequency || "daily",
            targetDaysPerWeek: Number(habitData.targetDaysPerWeek) || 7,
            history: {},
            archived: false,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        try {
            const docRef = await addDoc(collection(db, HABITS_COLLECTION), payload);
            return { success: true, habit: { id: docRef.id, ...payload, streak: 0 } };
        } catch (error) {
            const localHabit = {
                id: `local_${Date.now()}`,
                ...payload,
                streak: 0,
            };
            return { success: true, habit: localHabit };
        }
    },

    toggleHabitDay: async (userId, habit, dateStr) => {
        const currentHistory = { ...(habit.history || {}) };
        const newStatus = !currentHistory[dateStr];

        if (newStatus) {
            currentHistory[dateStr] = true;
        } else {
            delete currentHistory[dateStr];
        }

        const newStreak = calculateHabitStreak(currentHistory);

        try {
            if (!habit.id.startsWith("local_")) {
                const docRef = doc(db, HABITS_COLLECTION, habit.id);
                await updateDoc(docRef, {
                    history: currentHistory,
                    updatedAt: Timestamp.now(),
                });
            }
            return {
                success: true,
                history: currentHistory,
                streak: newStreak,
            };
        } catch (error) {
            return {
                success: true,
                history: currentHistory,
                streak: newStreak,
            };
        }
    },

    deleteHabit: async (habitId) => {
        try {
            if (!habitId.startsWith("local_")) {
                await deleteDoc(doc(db, HABITS_COLLECTION, habitId));
            }
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};

export default habitService;
