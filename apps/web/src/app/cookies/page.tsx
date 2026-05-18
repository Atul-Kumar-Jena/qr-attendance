'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const CATEGORIES = [
  {
    icon: '🔐',
    title: 'Keeping you signed in',
    body: 'When you sign in with Google, we save a small token so you stay signed in next time you visit. No need to log in every page.',
  },
  {
    icon: '🎨',
    title: 'Remembering your preferences',
    body: 'Light mode, dark mode, your institution code — we keep these on your device so the site loads the way you like it.',
  },
  {
    icon: '🧭',
    title: 'Showing you the tour just once',
    body: 'The first time you visit a section, a quick guided tour appears. We remember that you\'ve seen it so it doesn\'t get in the way next time.',
  },
  {
    icon: '🛡️',
    title: 'Security & fraud prevention',
    body: 'A tiny device fingerprint helps us catch fake attendance attempts. It stays on your device — never sent to advertisers.',
  },
];

const PROMISES = [
  'No third-party advertising or tracking pixels — ever.',
  'No selling or sharing your data with marketers.',
  'No cross-site profiling. Your activity stays with us.',
  'You can clear everything any time with one click below.',
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-cream-100 dark:bg-[#0D0F14] px-6 py-16 relative overflow-hidden">
      {/* Subtle backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/"
            className="text-[12.5px] text-ink-mute hover:text-ink dark:hover:text-white inline-flex items-center gap-1.5 mb-10 transition-colors group"
          >
            <span aria-hidden className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Back to home
          </Link>

          <div className="text-[10.5px] tracking-[0.22em] uppercase text-ink-mute mb-4">
            [ how we use cookies ]
          </div>
          <h1 className="font-display text-[2.6rem] md:text-[3.4rem] leading-[1.05] tracking-tightest text-ink dark:text-[#F0EDE6] mb-4">
            Simple, <span className="italic text-accent">private,</span> respectful.
          </h1>
          <p className="text-[14.5px] text-ink-mute leading-relaxed mb-10">
            We use a few small bits of local storage to make the site work and remember
            your preferences. That&apos;s it. No ads, no trackers, no resold data.
          </p>

          {/* What we use */}
          <div className="text-[10.5px] tracking-[0.22em] uppercase text-ink-mute mb-3">
            What we save
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-10">
            {CATEGORIES.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 * i }}
                className="rounded-2xl border border-ink/8 dark:border-white/8 bg-cream-50 dark:bg-[#13161D] p-5"
              >
                <div className="text-[24px] mb-2 leading-none">{c.icon}</div>
                <div className="text-[14px] font-medium text-ink dark:text-cream-50 mb-1">{c.title}</div>
                <p className="text-[12.5px] text-ink-mute leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Our promise */}
          <div className="text-[10.5px] tracking-[0.22em] uppercase text-ink-mute mb-3">
            Our privacy promise
          </div>
          <div className="rounded-2xl border border-accent/30 bg-accent/5 dark:bg-accent/10 p-5 mb-10">
            <ul className="space-y-2.5">
              {PROMISES.map((p) => (
                <li key={p} className="flex gap-2.5 text-[13px] text-ink dark:text-cream-50/90">
                  <span className="text-accent flex-shrink-0">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Manage */}
          <div className="rounded-2xl border border-ink/8 dark:border-white/8 bg-cream-50 dark:bg-[#13161D] p-5 mb-10">
            <h2 className="text-[14px] font-medium text-ink dark:text-cream-50 mb-1.5">In your control</h2>
            <p className="text-[12.5px] text-ink-mute leading-relaxed mb-3">
              You can clear all saved preferences any time. Your sign-in, theme, and consent will reset.
            </p>
            <Link
              href="/?reset=1"
              className="inline-flex items-center gap-2 rounded-xl border border-ink/15 dark:border-white/15 px-4 py-2 text-[12.5px] text-ink dark:text-cream-50/90 hover:bg-ink/4 dark:hover:bg-white/6 transition-colors"
            >
              Clear all preferences
            </Link>
          </div>

          {/* Continue */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 rounded-xl bg-ink dark:bg-[#1A2236] dark:border dark:border-white/15 px-5 py-3.5 text-[13.5px] font-medium tracking-wide text-cream-50 text-center hover:bg-ink-soft dark:hover:bg-[#222c3e] transition-colors"
            >
              ← Continue to site
            </Link>
            <Link
              href="/terms"
              className="flex-1 rounded-xl border border-ink/15 dark:border-white/15 px-5 py-3.5 text-[13.5px] tracking-wide text-ink dark:text-cream-50/90 text-center hover:bg-ink/4 dark:hover:bg-white/6 transition-colors"
            >
              Read terms of service
            </Link>
          </div>

          <div className="mt-8 text-[11.5px] text-ink-mute text-center">
            Questions? Email <a href="mailto:hello@attendly.app" className="text-accent hover:underline">hello@attendly.app</a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
