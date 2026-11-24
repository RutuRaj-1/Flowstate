import React, { memo, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';

const MainLayout = memo(() => {
  const [isWallpaper, setIsWallpaper] = useState(false);

  useEffect(() => {
    if (window.electronAPI?.onWallpaperModeChanged) {
      window.electronAPI.onWallpaperModeChanged((active) => {
        setIsWallpaper(Boolean(active));
      });
    }
  }, []);

  return (
    <div className={`min-h-screen water-flow-bg text-[var(--fs-text-primary)] transition-colors duration-200 ${isWallpaper ? 'wallpaper-mode' : ''}`}>
      <div className="flex min-h-screen">
        {/* Fixed sidebar */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 min-h-screen ml-0 lg:ml-64 transition-[margin] duration-300">
          <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
});

MainLayout.displayName = 'MainLayout';
export default MainLayout;
