'use client';

import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'atd_cookies';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => { setVisible(true); setAnimating(true); }, 1200);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, []);

  const accept = (level: 'all' | 'necessary') => {
    localStorage.setItem(STORAGE_KEY, level);
    setAnimating(false);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[150] transition-transform duration-500 ease-out ${
        animating ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Backdrop blur strip */}
      <div className="mx-auto max-w-screen-xl px-4 pb-4">
        <div className="rounded-2xl bg-cream-50/95 dark:bg-[#13161D]/95 backdrop-blur-xl border border-ink/10 dark:border-white/10 shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[15px]">🍪</span>
              <span className="font-medium text-[13.5px]">We use cookies</span>
            </div>
            <p className="text-[12px] text-ink-mute leading-relaxed">
              Attendly uses cookies to keep you signed in, remember your preferences, and analyse traffic.
              <span className="hidden sm:inline"> No third-party ad trackers — ever.</span>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => accept('necessary')}
              className="flex-1 sm:flex-none rounded-xl border border-ink/15 dark:border-white/15 px-4 py-2 text-[12.5px] text-ink-mute hover:text-ink transition-all whitespace-nowrap"
            >
              Necessary only
            </button>
            <button
              onClick={() => accept('all')}
              className="flex-1 sm:flex-none rounded-xl bg-accent text-cream-50 px-5 py-2 text-[12.5px] font-medium hover:bg-accent/90 transition-all whitespace-nowrap"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function useCookieLevel(): 'all' | 'necessary' | null {
  if (typeof window === 'undefined') return null;
  return (localStorage.getItem(STORAGE_KEY) as 'all' | 'necessary' | null);
}
