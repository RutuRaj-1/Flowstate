import { calculateHabitStreak, DEFAULT_HABITS } from '../services/habitService';

describe('Habit Service & Streak Logic', () => {
  it('defines 4 default starter habits', () => {
    expect(DEFAULT_HABITS).toHaveLength(4);
    expect(DEFAULT_HABITS[0].name).toContain('Morning Focus');
  });

  describe('calculateHabitStreak', () => {
    it('returns 0 for empty history', () => {
      expect(calculateHabitStreak({})).toBe(0);
    });

    it('calculates consecutive streak correctly', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(today.getDate() - 2);

      const history = {
        [today.toISOString().split('T')[0]]: true,
        [yesterday.toISOString().split('T')[0]]: true,
        [twoDaysAgo.toISOString().split('T')[0]]: true,
      };

      expect(calculateHabitStreak(history)).toBe(3);
    });

    it('grants grace period if today is not completed yet but yesterday was', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const history = {
        [yesterday.toISOString().split('T')[0]]: true,
      };

      expect(calculateHabitStreak(history)).toBe(1);
    });
  });
});
