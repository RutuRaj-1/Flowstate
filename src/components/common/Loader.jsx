import React from 'react';

const Loader = ({ fullScreen = false, message = '' }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-9 h-9 border-3 border-water-300 border-t-ocean-800 rounded-full animate-spin" />
      {message && <p className="text-sm font-medium text-[var(--fs-text-secondary)] animate-pulse">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[var(--fs-bg)]/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;
