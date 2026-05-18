'use client';

import { useEffect, useState } from 'react';

/**
 * Online / offline indicator. Shows a small bottom-right pill when offline.
 * Hides itself when online to stay out of the way.
 */
export function NetStatus() {
  const [online, setOnline] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (!mounted || online) return null;

  return (
    <div
      role="status"
      className="fixed bottom-5 left-5 z-[140] rounded-full bg-amber-500/95 dark:bg-amber-600/95 text-white text-[11.5px] font-medium px-3.5 py-1.5 shadow-lg flex items-center gap-2 backdrop-blur-sm pointer-events-none select-none"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
      Offline — changes will sync when connection returns
    </div>
  );
}
