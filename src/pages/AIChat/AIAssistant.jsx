import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';
import {
  Send, Bot, User, Target, TrendingUp, Calendar,
  CheckCircle, Zap, Cpu, Activity, Trash2
} from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../hooks/useAuth';

const AIAssistant = () => {
  const { messages, isTyping, sendMessage, clearMessages } = useAI();
  const { tasks, getTodayTasks, getCompletionPercentage } = useTasks();
  useAuth(); // ensure auth context is available
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const todayTasks = useMemo(() => getTodayTasks(), [getTodayTasks]);
  const completedToday = useMemo(() => todayTasks.filter(t => t.completed).length, [todayTasks]);
  const highPriority = useMemo(() => tasks.filter(t => t.priority === 'high' && !t.completed).length, [tasks]);
  const pct = useMemo(() => getCompletionPercentage(), [getCompletionPercentage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage, { tasks, dailyLogs: [] });
    setInputMessage('');
  }, [inputMessage, sendMessage, tasks]);

  const handleSuggestion = useCallback((text) => {
    sendMessage(text, { tasks, dailyLogs: [] });
  }, [sendMessage, tasks]);

  const formatTime = (ts) => {
    try { return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
    catch { return ''; }
  };

  return (
    <div className="p-6 lg:p-8 h-[calc(100vh-2rem)]">
      <div className="flex gap-6 h-full max-h-[calc(100vh-4rem)]">
        {/* Chat area */}
        <div className="flex-1 flex flex-col water-card bg-white dark:bg-ocean-900/90 rounded-2xl border border-water-200/60 dark:border-ocean-800 shadow-sm overflow-hidden min-w-0">
          {/* Header */}
          <div className="p-4 border-b border-water-100 dark:border-ocean-800 bg-gradient-to-r from-ocean-50/70 to-water-50/70 dark:from-ocean-950/70 dark:to-ocean-900/70 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-ocean-700 to-ocean-500 rounded-xl shadow-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    FlowState AI Coach
                    <span className="text-[10px] bg-seafoam-100 dark:bg-seafoam-900/50 text-seafoam-700 dark:text-seafoam-300 px-1.5 py-0.5 rounded-full font-medium">Active</span>
                  </h1>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Analyzing your real task execution telemetry</p>
                </div>
              </div>
              <button onClick={clearMessages} className="p-2 hover:bg-water-100 dark:hover:bg-ocean-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" title="Clear"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {[
                { icon: CheckCircle, text: `${completedToday}/${todayTasks.length} today`, color: 'text-seafoam-600' },
                { icon: Target, text: `${highPriority} high priority`, color: 'text-rose-500' },
                { icon: Zap, text: `${pct}% done`, color: 'text-water-600' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-1 bg-white/90 dark:bg-ocean-800/90 px-2.5 py-1 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 border border-water-100 dark:border-ocean-700 shadow-xs">
                  <s.icon className={`w-3 h-3 ${s.color}`} />{s.text}
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} onSuggestion={handleSuggestion} formatTime={formatTime} />
            ))}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center"><Bot className="w-3.5 h-3.5 text-slate-400" /></div>
                <div className="flex gap-1">{[0, 150, 300].map(d => <span key={d} className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-water-100 dark:border-ocean-800 flex-shrink-0 bg-water-50/20 dark:bg-ocean-950/20">
            <div className="flex gap-2">
              <input ref={inputRef} type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask your AI coach about focus, execution, or habits..."
                className="flex-1 px-4 py-2.5 bg-white dark:bg-ocean-800 border border-water-200 dark:border-ocean-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-water-300 text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />
              <button onClick={handleSend} disabled={!inputMessage.trim()}
                className={`p-2.5 rounded-xl transition-all ${inputMessage.trim() ? 'bg-gradient-to-r from-ocean-800 to-ocean-600 text-white shadow-sm hover:from-ocean-900 hover:to-ocean-700' : 'bg-slate-100 dark:bg-ocean-800 text-slate-400'}`}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 hidden xl:block flex-shrink-0">
          <div className="water-card bg-white dark:bg-ocean-900/90 rounded-2xl p-5 border border-water-200/60 dark:border-ocean-800 shadow-sm sticky top-6">
            <h2 className="text-[10px] font-semibold text-ocean-700 dark:text-water-400 uppercase tracking-wider mb-4">Quick Prompts</h2>
            <div className="space-y-2 mb-6">
              {[
                { icon: TrendingUp, text: 'How can I improve?', color: 'from-ocean-700 to-ocean-500' },
                { icon: Activity, text: 'Analyze my challenges', color: 'from-water-600 to-water-500' },
                { icon: Calendar, text: 'Plan my tomorrow', color: 'from-ocean-800 to-ocean-600' },
              ].map((a, i) => (
                <button key={i} onClick={() => handleSuggestion(a.text)}
                  className="w-full flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-ocean-950/60 hover:bg-water-50/50 dark:hover:bg-ocean-800 rounded-xl border border-water-100 dark:border-ocean-800 transition-all text-left">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${a.color}`}><a.icon className="w-3 h-3 text-white" /></div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{a.text}</span>
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-water-100 dark:border-ocean-800">
              <p className="text-[10px] text-slate-400 flex items-center gap-1"><Cpu className="w-3 h-3 text-water-500" /> Powered by Gemini AI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoized message bubble
const MessageBubble = memo(({ msg, onSuggestion, formatTime }) => (
  <div className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}>
    <div className={`flex max-w-[80%] ${msg.type === 'ai' ? 'flex-row' : 'flex-row-reverse'} gap-2`}>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${msg.type === 'ai' ? 'bg-gradient-to-br from-ocean-700 to-ocean-500' : 'bg-ocean-800'
        }`}>
        {msg.type === 'ai' ? <Bot className="w-3.5 h-3.5 text-white" /> : <User className="w-3.5 h-3.5 text-white" />}
      </div>
      <div>
        <div className={`rounded-2xl p-3.5 text-sm leading-relaxed ${msg.type === 'ai' ? 'bg-slate-50 dark:bg-ocean-950/70 border border-water-100 dark:border-ocean-800 text-slate-700 dark:text-slate-200' : 'bg-gradient-to-br from-ocean-800 to-ocean-600 text-white shadow-sm'
          }`} dangerouslySetInnerHTML={{
            __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
          }} />
        {msg.type === 'ai' && msg.suggestions?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {msg.suggestions.map((s, i) => (
              <button key={i} onClick={() => onSuggestion(s)}
                className="px-2.5 py-1 bg-white dark:bg-ocean-800 text-[11px] text-slate-600 dark:text-slate-300 rounded-full border border-water-200 dark:border-ocean-700 hover:border-water-400 hover:bg-water-50 dark:hover:bg-ocean-700 transition-colors">{s}</button>
            ))}
          </div>
        )}
        <p className="text-[9px] text-slate-400 mt-1">{formatTime(msg.timestamp)}</p>
      </div>
    </div>
  </div>
));
MessageBubble.displayName = 'MessageBubble';

export default AIAssistant;