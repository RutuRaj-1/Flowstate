import {
  getTimeRiskLevel,
  getDaysRemaining,
  getTimeElapsedPct,
  computeAllProgress
} from '../utils/progressEngine';

describe('Progress Engine', () => {
  describe('getTimeRiskLevel', () => {
    it('returns safe if dates are missing', () => {
      expect(getTimeRiskLevel({})).toBe('safe');
    });

    it('returns safe when progress is on track with time elapsed', () => {
      const now = Date.now();
      const goal = {
        startDate: new Date(now - 1000000).toISOString(),
        endDate: new Date(now + 1000000).toISOString(),
        progress: 60, // 50% time elapsed, 60% progress
      };
      expect(getTimeRiskLevel(goal)).toBe('safe');
    });

    it('returns danger when critically behind schedule', () => {
      const now = Date.now();
      const goal = {
        startDate: new Date(now - 8000000).toISOString(),
        endDate: new Date(now + 2000000).toISOString(),
        progress: 10, // ~80% time elapsed, only 10% progress
      };
      expect(getTimeRiskLevel(goal)).toBe('danger');
    });
  });

  describe('getDaysRemaining', () => {
    it('returns null if endDate is null or undefined', () => {
      expect(getDaysRemaining(null)).toBeNull();
    });

    it('returns positive integer for future dates', () => {
      const future = new Date(Date.now() + 5 * 86400000).toISOString();
      const days = getDaysRemaining(future);
      expect(days).toBeGreaterThanOrEqual(4);
      expect(days).toBeLessThanOrEqual(6);
    });
  });

  describe('getTimeElapsedPct', () => {
    it('returns 0 for missing dates', () => {
      expect(getTimeElapsedPct({})).toBe(0);
    });

    it('returns 100 if end date is in the past', () => {
      const goal = {
        startDate: new Date(Date.now() - 200000).toISOString(),
        endDate: new Date(Date.now() - 100000).toISOString(),
      };
      expect(getTimeElapsedPct(goal)).toBe(100);
    });
  });

  describe('computeAllProgress', () => {
    it('aggregates linked daily tasks into monthly goals and up the pyramid', () => {
      const goals = [
        { id: 'mg1', type: 'monthly', title: 'Monthly Goal 1', parentId: 'qg1', weight: 2 },
        { id: 'qg1', type: 'quarterly', title: 'Quarterly Goal 1', parentId: 'yg1', weight: 2 },
        { id: 'yg1', type: 'yearly', title: 'Yearly Goal 1', weight: 2 },
      ];

      const tasks = [
        { id: 't1', linkedGoalId: 'mg1', completed: true, priority: 'high' },
        { id: 't2', linkedGoalId: 'mg1', completed: true, priority: 'medium' },
      ];

      const progressMap = computeAllProgress(goals, tasks);
      expect(progressMap.mg1).toBe(100);
      expect(progressMap.qg1).toBe(100);
      expect(progressMap.yg1).toBe(100);
    });
  });
});
