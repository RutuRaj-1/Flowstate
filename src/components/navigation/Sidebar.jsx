import React, { useState, useCallback, memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, BarChart3, Bot, Settings,
  Target, Calendar, LogOut, Menu, X, BookOpen, Flame
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';

const Sidebar = memo(() => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();

  const pendingCount = tasks.filter(t => !t.completed).length;
  const displayName = user?.displayName || 'Adventurer';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const navigationItems = [
    { id: 'dashboard', label: 'Quest Board', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'tasks', label: 'Quest Logs', icon: CheckSquare, path: '/tasks', badge: pendingCount > 0 ? String(pendingCount) : null },
    { id: 'goals', label: 'Campaigns', icon: Target, path: '/goals' },
    { id: 'analysis', label: 'Codex Notes', icon: BookOpen, path: '/analysis' },
    { id: 'analytics', label: 'Character Stats', icon: BarChart3, path: '/analytics' },
    { id: 'ai-assistant', label: 'AI Game Master', icon: Bot, path: '/ai-assistant', badge: 'GM' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/auth');
  }, [logout, navigate]);

  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  return (
    <>
      {/* Mobile hamburger — visible only on small screens */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-slate-900 rounded-xl shadow-md border border-slate-800"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-slate-300" />
      </button>

      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar — fixed position, always w-64 on desktop */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-40
        w-64 bg-slate-950/90 border-r border-slate-900
        flex flex-col backdrop-blur-md
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-900 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.4)]">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black text-slate-100 tracking-wider uppercase font-mono rpg-neon-text">
              flowstate
            </span>
          </div>
          <button
            onClick={closeMobile}
            className="lg:hidden p-1 rounded-lg hover:bg-slate-900"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={closeMobile}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs uppercase font-extrabold font-mono tracking-wider
                  transition-all duration-150 border border-transparent
                  ${isActive
                    ? 'bg-indigo-950/40 text-indigo-400 border-slate-800 shadow-[0_0_10px_rgba(99,102,241,0.1)]'
                    : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
                  }
                `}
              >
                <Icon className="w-[16px] h-[16px] flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md leading-none ${
                    item.badge === 'GM'
                      ? 'bg-violet-950/60 text-violet-400 border border-violet-800/30'
                      : 'bg-indigo-950/60 text-indigo-400 border border-indigo-800/30'
                    }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Date widget */}
        <div className="px-4 py-3 border-t border-slate-900 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-900/40 border border-slate-800/60 rounded-xl">
            <Calendar className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Today's Cycle</p>
              <p className="text-xs font-bold text-slate-300 truncate font-mono">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* User section */}
        <div className="border-t border-slate-900 p-3 flex-shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-3 px-2">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-[0_0_10px_rgba(99,102,241,0.25)]">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-300 truncate tracking-tight">{displayName}</p>
              <p className="text-[10px] text-slate-500 truncate font-mono">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-rose-400 transition-colors flex-shrink-0"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;