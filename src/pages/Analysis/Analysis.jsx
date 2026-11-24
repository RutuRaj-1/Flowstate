import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BookOpen, Save, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { dailyLogService } from '../../services/dailyLogService';
import { useTasks } from '../../hooks/useTasks';

const Analysis = () => {
    const { user } = useAuth();
    const { tasks } = useTasks();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [analysisText, setAnalysisText] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null
    const [loadingLog, setLoadingLog] = useState(false);

    // Derive active date string
    const dateStr = useMemo(() => selectedDate.toISOString().split('T')[0], [selectedDate]);
    const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

    // Fetch log for the selected date
    const loadDailyLog = useCallback(async () => {
        if (!user) return;
        setLoadingLog(true);
        setSaveStatus(null);
        try {
            const result = await dailyLogService.getDailyLog(user.uid, selectedDate);
            if (result.success && result.data && result.data.analysis) {
                setAnalysisText(result.data.analysis);
            } else {
                setAnalysisText('');
            }
        } catch (error) {
            console.error("Error loading analysis:", error);
        } finally {
            setLoadingLog(false);
        }
    }, [user, selectedDate]);

    useEffect(() => {
        loadDailyLog();
    }, [loadDailyLog]);

    // Save the reflection
    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        setSaveStatus(null);
        try {
            // Create/Update the daily log analysis side
            const result = await dailyLogService.saveDailyAnalysis(user.uid, dateStr, analysisText);
            if (result.success) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus(null), 3000);
            } else {
                setSaveStatus('error');
            }

            // Also ensure tasks are saved for this specific date snapshot if they aren't already
            const dateTasks = tasks.filter(t => (t.dueDate ? t.dueDate.split('T')[0] : '') === dateStr);
            if (dateTasks.length > 0) {
                await dailyLogService.saveDailyLog(user.uid, dateTasks, selectedDate);
            }
        } catch (error) {
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const changeDate = (days) => {
        setSelectedDate(prev => {
            const next = new Date(prev);
            next.setDate(next.getDate() + days);
            return next;
        });
    };

    const goToToday = () => setSelectedDate(new Date());

    return (
        <div className="p-6 lg:p-8 flex flex-col h-full max-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 flex-shrink-0">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-light text-slate-800 dark:text-slate-100">Codex Notes</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Reflect on your progress and calibrate tomorrow</p>
                </div>

                {/* Date Navigation */}
                <div className="flex items-center gap-2 bg-white dark:bg-ocean-900 rounded-xl border border-water-200 dark:border-ocean-700 p-1 shadow-sm">
                    <button
                        onClick={() => changeDate(-1)}
                        className="p-2 hover:bg-water-50 dark:hover:bg-ocean-800 rounded-lg transition-colors text-slate-500 dark:text-slate-400"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center justify-center min-w-[140px] px-2 relative">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {dateStr === todayStr
                                ? 'Today'
                                : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <input
                            type="date"
                            value={dateStr}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full"
                            style={{ colorScheme: 'light' }}
                        />
                    </div>

                    <button
                        onClick={() => changeDate(1)}
                        disabled={dateStr === todayStr}
                        className={`p-2 rounded-lg transition-colors ${dateStr === todayStr ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'hover:bg-water-50 dark:hover:bg-ocean-800 text-slate-500 dark:text-slate-400'}`}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {dateStr !== todayStr && (
                <div className="mb-4 flex-shrink-0">
                    <button onClick={goToToday} className="text-xs text-ocean-600 dark:text-water-400 hover:underline font-medium">
                        → Return to Today
                    </button>
                </div>
            )}

            {/* Editor Area */}
            <div className="flex-1 water-card rounded-2xl border border-water-200/60 dark:border-ocean-800 shadow-sm flex flex-col overflow-hidden relative">
                {loadingLog && (
                    <div className="absolute inset-0 bg-white/60 dark:bg-ocean-950/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-water-200 border-t-ocean-600 rounded-full animate-spin mb-2" />
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">Loading journal...</p>
                    </div>
                )}

                <div className="px-6 py-4 border-b border-water-100 dark:border-ocean-800 flex items-center gap-2 bg-water-50/40 dark:bg-ocean-900/40">
                    <BookOpen className="w-4 h-4 text-ocean-600 dark:text-water-400" />
                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Execution Codex</h2>
                </div>

                <textarea
                    value={analysisText}
                    onChange={(e) => setAnalysisText(e.target.value)}
                    placeholder="How did today go? What were the friction points, accomplishments, and focus adjustments for tomorrow?"
                    className="flex-1 w-full p-6 text-slate-700 dark:text-slate-200 text-sm leading-relaxed resize-none focus:outline-none focus:ring-inset focus:ring-1 focus:ring-water-300 bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-water-100 dark:border-ocean-800 bg-water-50/20 dark:bg-ocean-900/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {saveStatus === 'success' && (
                            <span className="flex items-center text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Saved to codex
                            </span>
                        )}
                        {saveStatus === 'error' && (
                            <span className="flex items-center text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded-lg">
                                <AlertCircle className="w-3 h-3 mr-1" /> Failed to save
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-ocean-800 to-ocean-600 hover:from-ocean-900 hover:to-ocean-700 text-white rounded-xl transition-all shadow-sm text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Saving...' : 'Save Entry'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Analysis;
