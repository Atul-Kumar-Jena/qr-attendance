'use client';

import { motion } from 'framer-motion';

export function RootCrashScreen({ error }: { error?: Error }) {
  const hardReload = () => {
    try {
      window.location.href = '/qr-attendance/?reset=1';
    } catch {
      window.location.reload();
    }
  };

  const goHome = () => {
    try {
      window.location.href = '/qr-attendance/';
    } catch {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-cream-100 dark:bg-[#07140E] relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '48px 48px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-md w-full rounded-2xl border border-ink/10 dark:border-white/10 bg-cream-50 dark:bg-[#0C1C14] p-7 shadow-2xl"
      >
        <div className="text-[10.5px] tracking-[0.22em] uppercase text-ink-mute mb-3">
          [ unexpected error · recovery ]
        </div>
        <h1 className="font-display text-[2rem] leading-tight text-ink dark:text-cream-50 mb-2">
          Something <span className="italic text-accent">broke</span>.
        </h1>
        <p className="text-[13px] text-ink-mute leading-relaxed mb-4">
          The page hit an unexpected error. Your data is safe — nothing was
          deleted. Try one of the actions below.
        </p>

        {error?.message && (
          <pre className="text-[11px] font-mono bg-ink/5 dark:bg-white/4 rounded-lg p-3 mb-5 text-ink-mute overflow-x-auto break-all whitespace-pre-wrap">
            {error.message.slice(0, 240)}
          </pre>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={goHome}
            className="rounded-xl bg-ink dark:bg-[#13261B] dark:border dark:border-white/15 px-5 py-3 text-[13px] font-medium text-cream-50 hover:bg-ink-soft dark:hover:bg-[#1A3324] transition-colors"
          >
            ← Back to home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl border border-ink/15 dark:border-white/15 px-5 py-3 text-[13px] text-ink dark:text-cream-50/90 hover:bg-ink/4 dark:hover:bg-white/6 transition-colors"
          >
            Reload page
          </button>
          <button
            onClick={hardReload}
            className="rounded-xl border border-red-500/25 text-red-500 dark:text-red-400 px-5 py-3 text-[13px] hover:bg-red-50 dark:hover:bg-red-900/15 transition-colors"
          >
            Reset preferences &amp; reload
          </button>
        </div>
      </motion.div>
    </div>
  );
}
