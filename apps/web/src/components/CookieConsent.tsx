'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'atd_cookies';
const TERMS_KEY = 'atd_terms';

// Pages where the banner would block users reading the policy itself.
const SUPPRESSED_PATHS = ['/cookies', '/terms', '/profile'];

function pathIsSuppressed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const path = window.location.pathname;
    return SUPPRESSED_PATHS.some((p) => path.includes(p));
  } catch { return false; }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      if (pathIsSuppressed()) return; // never show on /cookies, /terms, /profile
      if (!localStorage.getItem(STORAGE_KEY) || !localStorage.getItem(TERMS_KEY)) {
        const t = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  useEffect(() => {
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, []);

  const accept = (level: 'all' | 'necessary') => {
    try {
      localStorage.setItem(STORAGE_KEY, level);
      localStorage.setItem(TERMS_KEY, new Date().toISOString());
    } catch {}
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setVisible(false), 350);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 240 }}
          className="fixed bottom-0 left-0 right-0 z-[150]"
        >
          <div className="mx-auto max-w-screen-md px-4 pb-4">
            <div className="rounded-2xl bg-cream-50/95 dark:bg-[#0C1C14]/95 backdrop-blur-xl border border-ink/10 dark:border-white/10 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-5 flex items-start gap-3">
                <div className="text-[20px] flex-shrink-0 leading-none mt-0.5" aria-hidden>🍪</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[14px] text-ink dark:text-cream-50 mb-1">
                    Cookies &amp; terms
                  </div>
                  <p className="text-[12.5px] text-ink-mute leading-relaxed">
                    Attendly stores essential cookies to keep you signed in, remember your theme and run guided tours.
                    No ad trackers, ever.{' '}
                    <button
                      type="button"
                      onClick={() => setExpanded((x) => !x)}
                      className="text-accent hover:underline"
                    >
                      {expanded ? 'Hide details' : 'What are these cookies?'}
                    </button>
                  </p>
                </div>
              </div>

              {/* Expandable details — plain language only */}
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-2 text-[12.5px] text-ink-mute leading-relaxed">
                      <ul className="space-y-1.5 mb-3">
                        <li>• Keep you signed in across visits</li>
                        <li>• Remember your light/dark theme choice</li>
                        <li>• Skip the guided tour after you&apos;ve seen it once</li>
                        <li>• No third-party trackers or ads</li>
                      </ul>
                      <Link
                        href="/cookies"
                        className="inline-flex items-center gap-1 text-accent hover:underline text-[12px]"
                      >
                        Read the full policy →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Terms checkbox */}
              <div className="px-5 pb-3 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-ink/25 dark:border-white/25 accent-accent cursor-pointer"
                  />
                  <span className="text-[12px] text-ink-mute leading-relaxed group-hover:text-ink dark:group-hover:text-cream-50/90 transition-colors">
                    I agree to the{' '}
                    <Link href="/terms" className="text-accent hover:underline">
                      Terms
                    </Link>
                    {' '}and{' '}
                    <Link href="/cookies" className="text-accent hover:underline">
                      Cookie Policy
                    </Link>.
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="px-5 pb-5 pt-1 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => accept('necessary')}
                  disabled={!acceptTerms}
                  className="flex-1 sm:flex-none rounded-xl border border-ink/15 dark:border-white/15 px-4 py-2.5 text-[12.5px] text-ink-mute hover:text-ink dark:hover:text-cream-50 hover:bg-ink/4 dark:hover:bg-white/6 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Necessary only
                </button>
                <button
                  onClick={() => accept('all')}
                  disabled={!acceptTerms}
                  className="flex-1 rounded-xl bg-accent text-cream-50 px-5 py-2.5 text-[12.5px] font-medium hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Accept all &amp; continue
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useCookieLevel(): 'all' | 'necessary' | null {
  if (typeof window === 'undefined') return null;
  try {
    return (localStorage.getItem(STORAGE_KEY) as 'all' | 'necessary' | null);
  } catch { return null; }
}
