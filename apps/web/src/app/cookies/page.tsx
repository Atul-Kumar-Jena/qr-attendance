'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const COOKIES = [
  {
    name: 'attendly-theme-mode',
    type: 'Necessary',
    purpose: 'Remembers your light/dark/auto theme preference so the site loads in the right mode.',
    lifetime: 'Persistent (until you change it)',
  },
  {
    name: 'attendly_site_config',
    type: 'Necessary',
    purpose: 'Caches admin-edited site configuration (pricing labels, stats) so the site renders instantly while Firestore loads.',
    lifetime: 'Persistent',
  },
  {
    name: 'atd_cookies',
    type: 'Necessary',
    purpose: 'Stores your cookie consent choice so we don\'t ask again.',
    lifetime: '12 months',
  },
  {
    name: 'atd_terms',
    type: 'Necessary',
    purpose: 'Records that you accepted the Terms of Service.',
    lifetime: 'Persistent',
  },
  {
    name: 'atd_tour_*',
    type: 'Functional',
    purpose: 'Tracks which guided tours (driver.js) you have already seen so they don\'t restart.',
    lifetime: 'Persistent',
  },
  {
    name: 'atd_onboarding_*',
    type: 'Functional',
    purpose: 'Remembers if you completed the new-user onboarding flow (Student / Institution).',
    lifetime: 'Persistent',
  },
  {
    name: 'firebase:authUser:*',
    type: 'Necessary',
    purpose: 'Keeps you signed in across visits (issued by Firebase Authentication).',
    lifetime: 'Until sign-out',
  },
];

const TYPE_BADGE: Record<string, string> = {
  Necessary:  'bg-green-500/15 text-green-400 border-green-500/25',
  Functional: 'bg-blue-500/15  text-blue-400  border-blue-500/25',
  Analytics:  'bg-orange-500/15 text-orange-400 border-orange-500/25',
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-cream-100 dark:bg-[#0D0F14] px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-[12.5px] text-ink-mute hover:text-ink dark:hover:text-white inline-flex items-center gap-1.5 mb-8 transition-colors">
            <span aria-hidden>←</span> Back to site
          </Link>

          <div className="text-[10.5px] tracking-[0.22em] uppercase text-ink-mute mb-4">
            [ policy — cookies ]
          </div>
          <h1 className="font-display text-[2.6rem] md:text-[3.4rem] leading-[1.05] tracking-tightest text-ink dark:text-[#F0EDE6] mb-3">
            What cookies <span className="italic text-accent">we use</span>.
          </h1>
          <p className="text-[14px] text-ink-mute leading-relaxed mb-10 max-w-xl">
            Attendly is privacy-first. We only store what is required to keep you signed in, remember your preferences, and run guided tours — no third-party ad trackers, no fingerprinting, no analytics resold to anyone.
          </p>

          <div className="space-y-3">
            {COOKIES.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                className="rounded-2xl border border-ink/8 dark:border-white/8 bg-cream-50 dark:bg-[#13161D] p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="font-mono text-[12.5px] text-ink dark:text-cream-50 break-all">{c.name}</div>
                  <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full border ${TYPE_BADGE[c.type] || ''}`}>
                    {c.type}
                  </span>
                </div>
                <p className="text-[13px] text-ink-mute leading-relaxed mb-1.5">{c.purpose}</p>
                <div className="text-[11px] text-ink-mute/80">Lifetime: {c.lifetime}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-ink/8 dark:border-white/8 bg-cream-50 dark:bg-[#13161D] p-5">
            <h2 className="text-[14px] font-medium text-ink dark:text-cream-50 mb-2">Manage your choices</h2>
            <p className="text-[12.5px] text-ink-mute leading-relaxed mb-3">
              Clear your cookie consent and any cached preferences to see the banner again:
            </p>
            <Link
              href="/?reset=1"
              className="inline-flex items-center gap-2 rounded-xl border border-ink/15 dark:border-white/15 px-4 py-2 text-[12.5px] text-ink dark:text-cream-50/90 hover:bg-ink/4 dark:hover:bg-white/6 transition-colors"
            >
              Reset preferences
            </Link>
          </div>

          <div className="mt-8 text-[12px] text-ink-mute">
            Questions? See our <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link>.
          </div>
        </motion.div>
      </div>
    </main>
  );
}
