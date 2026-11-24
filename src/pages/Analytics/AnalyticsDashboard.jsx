import React, { useState, useMemo, memo } from 'react';
import {
  AreaChart, Area, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Calendar, Award, Target, Star,
  Activity, Zap, Cpu
} from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';

const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState('week');

  const {
    loading, weeklyData, monthlyData, disciplineMetrics,
    overallScore, streak, priorityRatios, bestWorstDays, insights
  } = useAnalytics(timeframe);

  const weeklyAverage = useMemo(() => {
    const active = weeklyData.filter(d => d.total > 0);
    return active.length > 0 ? Math.round(active.reduce((s, d) => s + d.percentage, 0) / active.length) : 0;
  }, [weeklyData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-3 border-water-300 border-t-ocean-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[var(--fs-border)] gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[var(--fs-text-primary)] tracking-tight">
            Performance & Discipline Analytics
          </h1>
          <p className="text-xs md:text-sm text-[var(--fs-text-secondary)] mt-0.5">
            Evidence-grounded metrics, execution momentum and 5-axis discipline radar.
          </p>
        </div>
        <div className="flex gap-1.5 p-1 bg-[var(--fs-surface-raised)] rounded-xl border border-[var(--fs-border)] w-fit">
          {['week', 'month', 'quarter'].map(p => (
            <button
              key={p}
              onClick={() => setTimeframe(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                timeframe === p
                  ? 'bg-ocean-800 text-white shadow-sm'
                  : 'text-[var(--fs-text-secondary)] hover:text-[var(--fs-text-primary)] hover:bg-[var(--fs-surface)]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Discipline Score" value={overallScore} unit="%" icon={Cpu} color="ocean" sub="Weighted execution score" />
        <MetricCard title="Weekly Average" value={weeklyAverage} unit="%" icon={Activity} color="water" sub="Task completion velocity" />
        <MetricCard title="Active Streak" value={streak} unit="days" icon={Zap} color="amber" sub="Consecutive productive days" />
        <MetricCard title="Peak Performance Day" value={bestWorstDays.best.day} icon={Star} color="seafoam" sub={`${bestWorstDays.best.completion}% completion`} />
      </div>

      {/* Primary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Weekly Completion Velocity" icon={Calendar}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weeklyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="oceanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#075B9A" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#5BBEDB" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--fs-border)" />
              <XAxis dataKey="day" stroke="var(--fs-text-muted)" fontSize={11} />
              <YAxis stroke="var(--fs-text-muted)" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--fs-surface)', borderRadius: '12px', border: '1px solid var(--fs-border)', fontSize: '12px' }} />
              <Area type="monotone" dataKey="completed" stroke="#075B9A" strokeWidth={2} fillOpacity={1} fill="url(#oceanGradient)" name="Tasks Completed" />
              <Area type="monotone" dataKey="total" stroke="#A9C5D3" strokeWidth={1.5} fillOpacity={0.1} fill="#D5E4EB" name="Total Planned" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Execution Trend" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--fs-border)" />
              <XAxis dataKey="week" stroke="var(--fs-text-muted)" fontSize={11} />
              <YAxis stroke="var(--fs-text-muted)" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--fs-surface)', borderRadius: '12px', border: '1px solid var(--fs-border)', fontSize: '12px' }} />
              <Line type="monotone" dataKey="completion" stroke="#075B9A" strokeWidth={2.5} dot={{ r: 3 }} name="Completion Rate (%)" />
              <Line type="monotone" dataKey="focus" stroke="#5BBEDB" strokeWidth={2} dot={{ r: 2 }} name="Focus Score (%)" />
              <Line type="monotone" dataKey="productivity" stroke="#23856D" strokeWidth={2} dot={{ r: 2 }} name="Productivity (%)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Priority Ratios & 5-Axis Discipline Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Priority Execution Breakdown" icon={Target}>
          <div className="space-y-4 py-2">
            {priorityRatios.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="font-bold text-[var(--fs-text-primary)]">{p.name} Priority</span>
                  </div>
                  <span className="font-mono font-bold text-[var(--fs-text-primary)]">{p.ratio}%</span>
                </div>
                <div className="h-2 bg-[var(--fs-surface-raised)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${p.ratio}%`, backgroundColor: p.color }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[var(--fs-text-muted)] font-mono mt-1">
                  <span>{p.completed} completed</span>
                  <span>{p.total} total</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="5-Axis Discipline Radar" icon={Award}>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={disciplineMetrics}>
              <PolarGrid stroke="var(--fs-border)" />
              <PolarAngleAxis dataKey="metric" stroke="var(--fs-text-secondary)" fontSize={11} fontStyle="bold" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--fs-text-muted)" fontSize={10} />
              <Radar name="Discipline Score" dataKey="score" stroke="#075B9A" fill="#5BBEDB" fillOpacity={0.35} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--fs-surface)', borderRadius: '12px', border: '1px solid var(--fs-border)', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* AI Behavioral Insights */}
      {insights.length > 0 && (
        <div className="water-card rounded-2xl p-5 md:p-6 bg-gradient-to-r from-ocean-50/50 to-mist-50/50 dark:from-ocean-950/40 dark:to-ocean-900/30">
          <h3 className="text-sm font-bold text-[var(--fs-text-primary)] mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-ocean-800 dark:text-water-400" />
            Execution Insights & Heuristics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.map((insight, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl border text-xs ${
                  insight.type === 'positive'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300'
                    : insight.type === 'warning'
                    ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300'
                    : 'bg-ocean-50/80 dark:bg-ocean-950/30 border-ocean-200 dark:border-ocean-800/40 text-ocean-900 dark:text-water-300'
                }`}
              >
                <p className="font-bold">{insight.message}</p>
                {insight.action && <p className="mt-1 opacity-90 leading-relaxed">{insight.action}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = memo(({ title, value, unit, icon: Icon, color, sub }) => {
  const colorMap = {
    ocean: 'bg-ocean-100 dark:bg-ocean-900/60 text-ocean-800 dark:text-water-400',
    water: 'bg-water-100 dark:bg-ocean-900/60 text-water-600 dark:text-water-400',
    amber: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    seafoam: 'bg-seafoam-100 dark:bg-seafoam-500/20 text-seafoam-500 dark:text-emerald-400',
  };

  return (
    <div className="water-card rounded-2xl p-5 flex flex-col justify-between">
      <div className={`p-2.5 rounded-xl ${colorMap[color] || colorMap.ocean} w-fit mb-3`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs font-bold text-[var(--fs-text-secondary)] uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-[var(--fs-text-primary)] font-mono mt-0.5">
          {value}{unit && <span className="text-xs font-normal text-[var(--fs-text-muted)] ml-0.5">{unit}</span>}
        </p>
        {sub && <p className="text-[10px] text-[var(--fs-text-muted)] font-medium mt-1">{sub}</p>}
      </div>
    </div>
  );
});
MetricCard.displayName = 'MetricCard';

const ChartCard = memo(({ title, icon: Icon, children }) => (
  <div className="water-card rounded-2xl p-5 md:p-6 flex flex-col justify-between">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 bg-ocean-100 dark:bg-ocean-900/60 rounded-lg text-ocean-800 dark:text-water-400">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-sm font-bold text-[var(--fs-text-primary)]">{title}</h3>
    </div>
    {children}
  </div>
));
ChartCard.displayName = 'ChartCard';

export default AnalyticsDashboard;
