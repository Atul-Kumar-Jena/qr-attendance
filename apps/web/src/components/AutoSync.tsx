'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { syncPending } from '@/lib/ledger';

/**
 * Background ledger auto-sync:
 *   - on mount when authenticated + online
 *   - whenever the browser fires the 'online' event
 *   - every 5 minutes while authenticated
 *
 * Silent — failures stay in pending and are retried next tick.
 */
export function AutoSync() {
  const { institutionId } = useAuth();
  const inFlight = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!institutionId || typeof window === 'undefined') return;

    const run = async () => {
      if (inFlight.current) return;
      if (!navigator.onLine) return;
      inFlight.current = true;
      try { await syncPending(institutionId); } catch {}
      finally { inFlight.current = false; }
    };

    // Kick once on mount
    run();

    // On reconnect
    const onOnline = () => { run(); };
    window.addEventListener('online', onOnline);

    // Periodic re-attempt (5 min)
    timerRef.current = setInterval(run, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('online', onOnline);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [institutionId]);

  return null;
}
