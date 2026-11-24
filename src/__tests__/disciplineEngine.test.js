import {
  calculateCompletion,
  calculateWeightedCompletion,
  calculateDisciplineScore,
  calculateStreak
} from '../utils/disciplineEngine';

describe('Discipline Engine', () => {
  describe('calculateCompletion', () => {
    it('returns 0 when given an empty array', () => {
      expect(calculateCompletion([])).toBe(0);
    });

    it('calculates correct percentage for mixed tasks', () => {
      const tasks = [
        { id: '1', completed: true },
        { id: '2', completed: false },
        { id: '3', completed: true },
        { id: '4', completed: false },
      ];
      expect(calculateCompletion(tasks)).toBe(50);
    });

    it('returns 100 when all tasks are completed', () => {
      const tasks = [
        { id: '1', completed: true },
        { id: '2', completed: true },
      ];
      expect(calculateCompletion(tasks)).toBe(100);
    });
  });

  describe('calculateWeightedCompletion', () => {
    it('returns 0 when given an empty array', () => {
      expect(calculateWeightedCompletion([])).toBe(0);
    });

    it('prioritizes high priority tasks over low priority tasks', () => {
      // 1 high priority completed (weight 3), 1 low priority incomplete (weight 1)
      const tasks = [
        { id: '1', completed: true, priority: 'high' },
        { id: '2', completed: false, priority: 'low' },
      ];
      // Completed: 3 / 4 = 75%
      expect(calculateWeightedCompletion(tasks)).toBe(75);
    });
  });

  describe('calculateDisciplineScore', () => {
    it('calculates score within bounds [0, 100]', () => {
      const tasks = [
        { id: '1', completed: true, priority: 'high', dueDate: new Date().toISOString() },
        { id: '2', completed: true, priority: 'medium', dueDate: new Date().toISOString() },
      ];
      const dailyLogs = [
        { totalTasks: 2, completionPercentage: 100 },
        { totalTasks: 2, completionPercentage: 80 },
      ];

      const result = calculateDisciplineScore(tasks, dailyLogs);
      expect(result.overall).toBeGreaterThanOrEqual(0);
      expect(result.overall).toBeLessThanOrEqual(100);
      expect(result.breakdown).toBeDefined();
      expect(result.breakdown.consistency).toBe(100);
      expect(result.breakdown.completionRate).toBe(100);
    });

    it('handles empty data gracefully', () => {
      const result = calculateDisciplineScore([], []);
      expect(result.overall).toBeGreaterThanOrEqual(0);
      expect(result.overall).toBeLessThanOrEqual(100);
    });
  });

  describe('calculateStreak', () => {
    it('returns a non-negative number for any task list', () => {
      expect(calculateStreak([])).toBe(0);
    });
  });
});
