import React, { useState, useCallback, memo, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, CheckSquare, BarChart3, Bot, Settings,
  Target, LogOut, Menu, X, BookOpen, Droplets, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { ThemeContext } from '../../context/ThemeContext';

const Sidebar = memo(() => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingCount = tasks.filter(t => !t.completed && (t.dueDate ? t.dueDate.split('T')[0] <= todayStr : true)).length;
  const displayName = user?.displayName || 'Adventurer';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const navigationItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'tasks', label: 'Schedule & Tasks', icon: Calendar, path: '/tasks', badge: pendingCount > 0 ? String(pendingCount) : null },
    { id: 'habits', label: 'Habit Matrix', icon: CheckSquare, path: '/habits' },
    { id: 'goals', label: 'Goal Pyramid', icon: Target, path: '/goals' },
    { id: 'analysis', label: 'Codex Notes', icon: BookOpen, path: '/analysis' },
    { id: 'analytics', label: 'Analytics & Radar', icon: BarChart3, path: '/analytics' },
    { id: 'ai-assistant', label: 'AI Coach', icon: Bot, path: '/ai-assistant', badge: 'AI' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/auth');
  }, [logout, navigate]);

  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  return (
    <>
      {/* Mobile hamburger trigger */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-ocean-900 text-white rounded-xl shadow-lg border border-ocean-700/60"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-water-300" />
      </button>

      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-ocean-950/70 backdrop-blur-sm z-40"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar — fixed position with Deep Ocean #1D3A60 surface */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50
        w-64 bg-ocean-900 text-white border-r border-ocean-950/40
        flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-ocean-800/60 flex-shrink-0 bg-ocean-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-ocean-700 to-water-500 rounded-xl flex items-center justify-center shadow-md shadow-water-500/20">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white block leading-none">
                flowstate
              </span>
              <span className="text-[10px] text-water-300 font-medium tracking-wider uppercase">
                Execution OS
              </span>
            </div>
          </div>
          <button
            onClick={closeMobile}
            className="lg:hidden p-1.5 rounded-lg hover:bg-ocean-800 text-slate-300"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={closeMobile}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide
                  transition-all duration-200 border
                  ${isActive
                    ? 'bg-ocean-800 text-white border-water-500/30 shadow-md shadow-ocean-950/40'
                    : 'text-mist-200/80 hover:bg-ocean-800/50 hover:text-white border-transparent'
                  }
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0 text-water-300" />
                <span className="flex-1 font-medium">{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none ${
                    item.badge === 'AI'
                      ? 'bg-water-500 text-ocean-950 font-black'
                      : 'bg-ocean-700 text-water-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Date & Theme toggle strip */}
        <div className="px-4 py-3 border-t border-ocean-800/60 bg-ocean-950/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-water-300" />
            <span className="text-xs font-medium text-mist-100">{formattedDate}</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-ocean-800 hover:bg-ocean-700 text-water-300 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-water-300" />}
          </button>
        </div>

        {/* Desktop Adaptation Controls (Electron / Mini Mode) */}
        {window.electronAPI?.isElectron && (
          <div className="px-4 py-2 border-t border-ocean-800/60 bg-ocean-950/40 flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase tracking-wider text-water-300 font-semibold">Desktop Mode</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => window.electronAPI?.toggleMiniMode?.()}
                className="px-2 py-0.5 rounded bg-ocean-800 hover:bg-ocean-700 text-[10px] text-water-200 transition-colors border border-ocean-700"
                title="Toggle Mini Mode (380x600 dock)"
              >
                Mini
              </button>
              <button
                onClick={() => window.electronAPI?.toggleWallpaperMode?.()}
                className="px-2 py-0.5 rounded bg-ocean-800 hover:bg-ocean-700 text-[10px] text-water-200 transition-colors border border-ocean-700"
                title="Toggle Wallpaper Mode"
              >
                Desk
              </button>
            </div>
          </div>
        )}

        {/* User profile & sign-out */}
        <div className="border-t border-ocean-800/60 p-3 flex-shrink-0 bg-ocean-950/40">
          <div className="flex items-center gap-3 px-1">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-ocean-700 to-water-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-ocean-900 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{displayName}</p>
              <p className="text-[10px] text-water-300/70 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-ocean-800 text-mist-200/70 hover:text-rose-300 transition-colors flex-shrink-0"
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
