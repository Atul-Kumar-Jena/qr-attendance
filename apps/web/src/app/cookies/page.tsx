'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const ESSENTIALS = [
  {
    icon: '🔑',
    title: 'Sign-in token',
    body: 'When you sign in with Google, we save a tiny token so you stay signed in next visit. Without this, you\'d have to log in on every page.',
    cantTurnOff: true,
  },
  {
    icon: '🎨',
    title: 'Theme & display',
    body: 'Your light / dark / auto choice, your accent colour, and any layout tweaks you make. Just so the site looks the way you like it.',
    cantTurnOff: true,
  },
];

const HELPFUL = [
  {
    icon: '🧭',
    title: 'Guided tour memory',
    body: 'The first time you open a new section, a quick walkthrough appears. We remember you\'ve seen it so it doesn\'t reappear.',
  },
  {
    icon: '🎯',
    title: 'Onboarding progress',
    body: 'If you\'re a new student or institution, we save your step in the join flow — so refreshing the page doesn\'t start it over.',
  },
];

const SECURITY = [
  {
    icon: '🛡️',
    title: 'Device fingerprint',
    body: 'A small random hash of your browser. Helps Attendly tell your scans apart from impostors. Never sent to anyone outside Attendly.',
  },
];

const NEVER = [
  'Third-party advertising cookies',
  'Cross-site tracking pixels',
  'Behavioural profiling for marketers',
  'Selling or sharing data with brokers',
  'Fingerprinting for ad networks',
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-cream-100 dark:bg-[#07140E] px-6 py-16 relative overflow-hidden">
      {/* Subtle backdrop with a different hue so users see this is a different doc from /terms */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)',
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
            [ document 02 · cookie policy ]
          </div>
          <h1 className="font-display text-[2.6rem] md:text-[3.4rem] leading-[1.05] tracking-tightest text-ink dark:text-[#F0EDE6] mb-3">
            What we keep on <span className="italic text-accent">your device</span>.
          </h1>
          <p className="text-[14.5px] text-ink-mute leading-relaxed mb-3">
            We use a handful of small browser-side items so Attendly works smoothly. No ads, no trackers, no resold data.
          </p>
          <p className="text-[12px] text-ink-mute mb-10">
            Effective: May 2026 · This page covers only your local browser storage. For the service agreement, see{' '}
            <Link href="/terms" className="text-accent hover:underline">Terms &amp; Conditions</Link>.
          </p>

          {/* Essential */}
          <SectionHeader title="Essential — always on" tint="green" />
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {ESSENTIALS.map((c, i) => <CookieCard key={c.title} card={c} i={i} accent="green" />)}
          </div>

          {/* Helpful */}
          <SectionHeader title="Helpful — improve your experience" tint="blue" />
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {HELPFUL.map((c, i) => <CookieCard key={c.title} card={c} i={i} accent="blue" />)}
          </div>

          {/* Security */}
          <SectionHeader title="Security — fraud prevention" tint="purple" />
          <div className="grid sm:grid-cols-2 gap-3 mb-10">
            {SECURITY.map((c, i) => <CookieCard key={c.title} card={c} i={i} accent="purple" />)}
          </div>

          {/* Never */}
          <div className="rounded-2xl border border-red-400/25 bg-red-50/40 dark:bg-red-900/10 p-5 mb-10">
            <h3 className="text-[13.5px] font-medium text-ink dark:text-cream-50 mb-2.5 flex items-center gap-2">
              <span className="text-red-500">✗</span> What we never use
            </h3>
            <ul className="space-y-2">
              {NEVER.map((p) => (
                <li key={p} className="flex gap-2.5 text-[12.5px] text-ink-mute leading-relaxed">
                  <span className="text-red-500 flex-shrink-0 text-[10px] mt-1">●</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Manage */}
          <div className="rounded-2xl border border-ink/8 dark:border-white/8 bg-cream-50 dark:bg-[#0C1C14] p-5 mb-10">
            <h2 className="text-[14px] font-medium text-ink dark:text-cream-50 mb-1.5">In your control</h2>
            <p className="text-[12.5px] text-ink-mute leading-relaxed mb-3">
              You can clear everything we&apos;ve saved on your device in one click. Your sign-in, theme, tour state and device fingerprint will reset.
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
              className="flex-1 rounded-xl bg-ink dark:bg-[#13261B] dark:border dark:border-white/15 px-5 py-3.5 text-[13.5px] font-medium tracking-wide text-cream-50 text-center hover:bg-ink-soft dark:hover:bg-[#1A3324] transition-colors"
            >
              ← Continue to site
            </Link>
            <Link
              href="/terms"
              className="flex-1 rounded-xl border border-ink/15 dark:border-white/15 px-5 py-3.5 text-[13.5px] tracking-wide text-ink dark:text-cream-50/90 text-center hover:bg-ink/4 dark:hover:bg-white/6 transition-colors"
            >
              Read Terms &amp; Conditions →
            </Link>
          </div>

          <div className="mt-8 text-[11.5px] text-ink-mute text-center">
            Last updated May 2026 · <a href="mailto:hello@attendly.app" className="text-accent hover:underline">hello@attendly.app</a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function SectionHeader({ title, tint }: { title: string; tint: 'green' | 'blue' | 'purple' }) {
  const dot =
    tint === 'green' ? 'bg-green-500' :
    tint === 'blue'  ? 'bg-blue-500'  : 'bg-purple-500';
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span className="text-[10.5px] tracking-[0.22em] uppercase text-ink-mute">{title}</span>
    </div>
  );
}

function CookieCard({
  card,
  i,
  accent,
}: {
  card: { icon: string; title: string; body: string; cantTurnOff?: boolean };
  i: number;
  accent: 'green' | 'blue' | 'purple';
}) {
  const ring =
    accent === 'green' ? 'border-green-500/15' :
    accent === 'blue'  ? 'border-blue-500/15'  : 'border-purple-500/15';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.06 * i }}
      className={`rounded-2xl border bg-cream-50 dark:bg-[#0C1C14] p-5 ${ring}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="text-[24px] leading-none">{card.icon}</div>
        {card.cantTurnOff && (
          <span className="text-[9.5px] tracking-[0.15em] uppercase text-ink-mute/70">always on</span>
        )}
      </div>
      <div className="text-[14px] font-medium text-ink dark:text-cream-50 mb-1">{card.title}</div>
      <p className="text-[12.5px] text-ink-mute leading-relaxed">{card.body}</p>
    </motion.div>
  );
}
