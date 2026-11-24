import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle, Flame, Plus, Target,
  AlertCircle, RefreshCw, X, ChevronDown, Medal, Shield, BookOpen
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useQuotes } from '../../hooks/useQuotes';
import { useCharacterStore } from '../../stores/useCharacterStore';
import { useIdentityStore } from '../../stores/useIdentityStore';
import { useQuestStore } from '../../stores/useQuestStore';
import ProgressBar from '../../components/hud/ProgressBar';
import StatGauge from '../../components/hud/StatGauge';
import IdentitySelector from '../../components/hud/IdentitySelector';

const CATEGORY_ICONS = {
  health: Shield,
  learning: BookOpen,
  routine: Medal,
  work: Target
};

const Dashboard = () => {
  // navigation disabled for layout compatibility
  const { user } = useAuth();
  const { quote, refreshQuote } = useQuotes();
  
  // Zustand Stores
  const { character, loadCharacter, isLevelingUp, dismissLevelUp, spendAttributePoint } = useCharacterStore();
  const { currentIdentity, setIdentityLocally } = useIdentityStore();
  const { quests, loading, fetchQuests, addQuest, completeQuest, failQuest, deleteQuest } = useQuestStore();

  const [showAddQuest, setShowAddQuest] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    category: 'work',
    tier: 'medium',
    dueDate: new Date().toISOString().split('T')[0]
  });

  // Load character data and quest lists
  useEffect(() => {
    if (user?.uid) {
      loadCharacter(user.uid);
      fetchQuests(user.uid);
    }
  }, [user, loadCharacter, fetchQuests]);

  // Load local theme state based on DB settings if available
  useEffect(() => {
    if (character?.currentIdentity) {
      setIdentityLocally(character.currentIdentity);
    }
  }, [character?.currentIdentity, setIdentityLocally]);

  // activeQuests tracked inside quest board filters

  const completedQuestsCount = useMemo(() => {
    return quests.filter(q => q.completed).length;
  }, [quests]);

  const failedQuestsCount = useMemo(() => {
    return quests.filter(q => q.failedAt).length;
  }, [quests]);

  // Class-specific greeting messages
  const classGreeting = useMemo(() => {
    if (!character) return "Greetings, Adventurer.";
    const name = user?.displayName || character.name;
    switch (currentIdentity.id) {
      case 'vanguard':
        return `Prepare for combat, Vanguard ${name}! The frontline awaits your execution.`;
      case 'strategist':
        return `Logistics aligned, Architect ${name}. Review today's mission probabilities.`;
      case 'guardian':
        return `Stand firm, Protector ${name}. Consistency is our ultimate fortress.`;
      case 'executor':
        return `Zero excuses, Operative ${name}. Complete targets, reap the XP payouts.`;
      default:
        return `Welcome back, Initiate ${name}. Ready to embark on today's campaign?`;
    }
  }, [character, currentIdentity, user]);

  const handleAddQuest = async (e) => {
    e.preventDefault();
    if (!newQuest.title.trim() || !user?.uid) return;

    await addQuest(user.uid, newQuest);
    setNewQuest({
      title: '',
      description: '',
      category: 'work',
      tier: 'medium',
      dueDate: new Date().toISOString().split('T')[0]
    });
    setShowAddQuest(false);
  };

  const filteredQuests = useMemo(() => {
    return quests.filter(q => {
      if (filter === 'all') return true;
      if (filter === 'completed') return q.completed;
      if (filter === 'bosses') return q.tier === 'hard' || q.tier === 'legendary';
      if (filter === 'active') return !q.completed && !q.failedAt;
      return true;
    });
  }, [quests, filter]);

  if (loading && quests.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#090d16]">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* RPG Grid Overlay */}
      <div className="game-grid-overlay" />

      {/* Class Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-xl lg:text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <Flame size={20} className="text-indigo-400 animate-pulse" />
            {classGreeting}
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-mono uppercase tracking-wider">
            Current Persona: <span className="text-indigo-400 font-bold">{currentIdentity.name}</span> | Preferred Tasks: <span className="text-indigo-300 font-bold">{currentIdentity.preferredCategory}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddQuest(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs font-bold font-mono tracking-wider uppercase"
          >
            <Plus size={14} /> Add Mission
          </button>
        </div>
      </div>

      {/* Character HUD Layout: Stats & Level Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressBar />
        </div>
        <div>
          <StatGauge />
        </div>
      </div>

      {/* Identity Selector Section */}
      <IdentitySelector />

      {/* Main Campaign Quest Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quest List (Left 2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            
            {/* Board Header & Filter Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-base font-black text-slate-100 tracking-wider uppercase flex items-center gap-2">
                  <Target size={16} className="text-indigo-400" /> Active Campaigns & Quests
                </h2>
                <span className="text-[11px] text-slate-500 font-mono">
                  COMPLETED: {completedQuestsCount} | FAILED: {failedQuestsCount}
                </span>
              </div>
              <div className="flex gap-1 bg-slate-950/80 p-1 border border-slate-800 rounded-lg overflow-x-auto max-w-full">
                {['all', 'active', 'bosses', 'completed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-wider font-mono transition-all ${
                      filter === tab
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Quests Container */}
            <div className="space-y-3">
              {filteredQuests.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl">
                  <Medal className="w-12 h-12 text-slate-700 mx-auto mb-3 animate-bounce" />
                  <p className="text-slate-400 text-sm font-semibold">No quests listed on the board.</p>
                  <p className="text-slate-500 text-xs mt-1">Accept a new daily mission to gain XP rewards!</p>
                  <button
                    onClick={() => setShowAddQuest(true)}
                    className="mt-4 text-indigo-400 text-xs font-mono font-bold hover:text-indigo-300"
                  >
                    Accept First Mission →
                  </button>
                </div>
              ) : (
                filteredQuests.map((quest) => (
                  <QuestRow
                    key={quest.id}
                    quest={quest}
                    onComplete={() => user?.uid && completeQuest(user.uid, quest.id)}
                    onFail={() => user?.uid && failQuest(user.uid, quest.id)}
                    onDelete={() => deleteQuest(quest.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Side panels (Right 1/3) */}
        <div className="space-y-6">
          
          {/* Attributes Panel */}
          {character && (
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">Character Stats</h3>
                {character.attributePoints > 0 && (
                  <span className="text-[10px] px-2 py-0.5 bg-amber-500 text-slate-950 font-black rounded-full animate-bounce">
                    +{character.attributePoints} Points Available
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {Object.entries(character.attributes || {}).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-slate-950/40 border border-slate-800/60 rounded-lg">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-slate-300 font-mono">{key}</span>
                      <p className="text-[10px] text-slate-500 font-mono">Modifiers: +{val}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-200">{val}</span>
                      {character.attributePoints > 0 && (
                        <button
                          onClick={() => user?.uid && spendAttributePoint(user.uid, key)}
                          className="w-5 h-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lore / Quote System */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex gap-3">
              <span className="text-4xl text-indigo-500/30 font-serif leading-none">"</span>
              <div className="flex-1">
                <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-mono block mb-1">Codex Entry</span>
                <p className="text-slate-300 italic text-xs leading-relaxed line-clamp-4">{quote.text}</p>
                <p className="text-slate-500 text-[10px] mt-2 font-mono">— {quote.author}</p>
              </div>
              <button
                onClick={refreshQuote}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-800 rounded-lg self-start transition-opacity"
              >
                <RefreshCw size={12} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quest Add Modal */}
      {showAddQuest && (
        <div className="modal-overlay" onClick={() => setShowAddQuest(false)}>
          <div className="modal-content bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-5 border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-100 tracking-widest uppercase flex items-center gap-2">
                <Target size={16} className="text-indigo-400" /> Construct Mission
              </h3>
              <button onClick={() => setShowAddQuest(false)} className="p-1 hover:bg-slate-800 rounded-lg"><X size={16} className="text-slate-400" /></button>
            </div>

            <form onSubmit={handleAddQuest} className="space-y-4">
              <div>
                <label className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 block mb-1">Quest Title</label>
                <input
                  type="text" autoFocus required value={newQuest.title}
                  onChange={(e) => setNewQuest(p => ({ ...p, title: e.target.value }))}
                  placeholder="Draft project specifications..."
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 block mb-1">Quest Codex details</label>
                <textarea
                  value={newQuest.description}
                  onChange={(e) => setNewQuest(p => ({ ...p, description: e.target.value }))}
                  placeholder="Break down execution details..."
                  className="w-full h-20 px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 block mb-1">Mission Difficulty</label>
                  <div className="relative">
                    <select
                      value={newQuest.tier}
                      onChange={(e) => setNewQuest(p => ({ ...p, tier: e.target.value }))}
                      className="w-full px-3 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 appearance-none font-mono"
                    >
                      <option value="trivial">🟢 Trivial (+15 XP)</option>
                      <option value="easy">🔵 Easy (+50 XP)</option>
                      <option value="medium">🟡 Medium (+120 XP)</option>
                      <option value="hard">🔴 Hard Boss (+300 XP)</option>
                      <option value="legendary">💀 Legendary Boss (+800 XP)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 block mb-1">Quest Category</label>
                  <div className="relative">
                    <select
                      value={newQuest.category}
                      onChange={(e) => setNewQuest(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-3 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 appearance-none font-mono"
                    >
                      <option value="work">⚔️ Campaign Work</option>
                      <option value="health">🛡️ Health & Vitality</option>
                      <option value="learning">🎓 Scroll Learning</option>
                      <option value="routine">🏆 Daily Routine</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 block mb-1">Target Completion Date</label>
                <input
                  type="date" value={newQuest.dueDate}
                  onChange={(e) => setNewQuest(p => ({ ...p, dueDate: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddQuest(false)}
                  className="flex-1 py-3 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Retreat
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                >
                  Launch Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Level Up Overlay Alert */}
      {isLevelingUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
          <div className="text-center space-y-6 max-w-md p-8 border border-amber-500/50 bg-slate-900/80 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-[scaleIn_0.3s_ease-out]">
            <Medal className="w-20 h-20 text-amber-400 mx-auto animate-bounce" />
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-black">Level Unlocked</span>
              <h2 className="text-3xl font-black text-slate-100 tracking-tight">CHARACTER LEVEL UP!</h2>
              <p className="text-slate-300 text-sm">
                You have advanced to Level <span className="text-indigo-400 font-bold">{character.level}</span>.
              </p>
              <p className="text-xs text-slate-500 italic">
                +5 Attribute Points granted! Spend them on your Character Stats page.
              </p>
            </div>
            <button
              onClick={dismissLevelUp}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-mono font-black uppercase tracking-widest rounded-xl transition-all"
            >
              Acknowledge Progression
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Quest Row details
const QuestRow = ({ quest, onComplete, onFail, onDelete }) => {
  const CatIcon = CATEGORY_ICONS[quest.category] || Target;
  const tierColor = {
    trivial: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    easy: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    hard: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    legendary: 'text-violet-400 bg-violet-500/10 border-violet-500/20'
  };

  const isBoss = quest.tier === 'hard' || quest.tier === 'legendary';

  return (
    <div className={`group flex items-center gap-4 p-4 rounded-xl border bg-slate-950/40 border-slate-800 transition-all hover:bg-slate-950/80 ${
      quest.completed ? 'opacity-50 border-slate-900 bg-slate-950/10' : ''
    }`}>
      {/* Category Icon indicator */}
      <div className={`p-2.5 rounded-lg border flex-shrink-0 ${tierColor[quest.tier] || tierColor.medium}`}>
        <CatIcon size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold font-mono uppercase tracking-wider ${tierColor[quest.tier]}`}>
            {isBoss ? '👹 Boss Battle' : quest.tier}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">-{quest.energyCost} Energy</span>
        </div>
        <h4 className={`text-sm font-extrabold truncate mt-0.5 tracking-tight ${
          quest.completed ? 'text-slate-500 line-through' : 'text-slate-200'
        }`}>
          {quest.title}
        </h4>
        {quest.description && (
          <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5">{quest.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Quest Rewards Display */}
        <div className="text-right hidden sm:block">
          <span className="text-[9px] text-emerald-400 font-bold block font-mono">+{quest.xpReward} XP</span>
          <span className="text-[9px] text-rose-500 font-bold block font-mono">-{quest.failureConsequence?.hpLoss || 10} HP</span>
        </div>

        {/* Action Controls */}
        {!quest.completed && !quest.failedAt && (
          <div className="flex gap-1">
            <button
              onClick={onComplete}
              title="Complete Quest"
              className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/20 rounded-lg transition-all"
            >
              <CheckCircle size={14} />
            </button>
            <button
              onClick={onFail}
              title="Fail Quest"
              className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-slate-950 border border-rose-500/20 rounded-lg transition-all"
            >
              <AlertCircle size={14} />
            </button>
          </div>
        )}

        {quest.completed && (
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider border border-emerald-500/20 px-2 py-1 bg-emerald-500/10 rounded-md">
            Cleared
          </span>
        )}

        {quest.failedAt && (
          <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider border border-rose-500/20 px-2 py-1 bg-rose-500/10 rounded-md">
            Defeated
          </span>
        )}

        <button
          onClick={onDelete}
          title="Delete quest log"
          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded-lg transition-all"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;