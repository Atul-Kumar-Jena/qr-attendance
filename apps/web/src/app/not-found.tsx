'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <main className="min-h-screen relative flex items-center justify-center px-6 bg-cream-100 dark:bg-[#0D0F14] overflow-hidden">
      {/* Animated grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '48px 48px',
        }}
      />

      {/* Soft glow blobs */}
      <motion.div
        aria-hidden
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-[10.5px] tracking-[0.22em] uppercase text-ink-mute mb-5">
            [ error 404 — page not found ]
          </div>

          <motion.h1
            className="font-display text-[5rem] md:text-[7rem] leading-none tracking-tightest text-ink dark:text-[#F0EDE6] mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={mounted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            4<span className="italic text-accent">0</span>4
          </motion.h1>

          <p className="text-[15px] text-ink-mute leading-relaxed mb-8 max-w-md mx-auto">
            That URL doesn&apos;t exist — or it moved during a recent deploy.
            Head back to the homepage and try again.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-ink dark:bg-[#1A2236] dark:border dark:border-white/15 px-5 py-3 text-[13px] font-medium tracking-wide text-cream-50 hover:bg-ink-soft dark:hover:bg-[#222c3e] transition-colors"
              >
                <span aria-hidden>←</span> Back to site
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl border border-ink/15 dark:border-white/15 px-5 py-3 text-[13px] tracking-wide text-ink dark:text-cream-50/90 hover:bg-ink/4 dark:hover:bg-white/6 transition-colors"
              >
                Open dashboard
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
