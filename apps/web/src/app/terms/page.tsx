'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const SECTIONS = [
  {
    title: 'The basics',
    body: 'Attendly helps schools and organisations take attendance with secure rotating QR codes. By using the service, you agree to these terms.',
  },
  {
    title: 'Your account',
    body: 'Sign in with your Google account. Keep your sign-in safe. Students join an institution using a short code their admin shares — admins can revoke that code any time.',
  },
  {
    title: 'What you can do',
    body: 'Use Attendly to run real attendance for real classes. Don\'t use it to fake attendance, spoof your location, share device tokens, or scrape data from other institutions.',
  },
  {
    title: 'Your data',
    body: 'We keep only what we need: your name, email, role, institution membership, and attendance records. We never sell your data. We never share it with advertisers.',
  },
  {
    title: 'No guarantees during beta',
    body: 'Attendly is in active development. Features may change, and occasional outages can happen. We aim for production reliability, but we don\'t promise a formal uptime SLA yet.',
  },
  {
    title: 'Limits of responsibility',
    body: 'The service is provided as is. Attendly is not responsible for indirect losses from attendance disputes, missed sessions, or downtime.',
  },
  {
    title: 'Contact us',
    body: 'For anything — questions, feedback, takedown requests, or to delete your account — email hello@attendly.app and we\'ll respond promptly.',
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-cream-100 dark:bg-[#0D0F14] px-6 py-16 relative overflow-hidden">
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
            [ terms of service ]
          </div>
          <h1 className="font-display text-[2.6rem] md:text-[3.4rem] leading-[1.05] tracking-tightest text-ink dark:text-[#F0EDE6] mb-4">
            Fair, <span className="italic text-accent">simple,</span> transparent.
          </h1>
          <p className="text-[14.5px] text-ink-mute leading-relaxed mb-10">
            We&apos;ve kept this short and in plain English. Updated May 2026.
          </p>

          <div className="space-y-3 mb-10">
            {SECTIONS.map((s, i) => (
              <motion.section
                key={s.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.04 * i }}
                className="rounded-2xl border border-ink/8 dark:border-white/8 bg-cream-50 dark:bg-[#13161D] p-5"
              >
                <h2 className="text-[14.5px] font-medium text-ink dark:text-cream-50 mb-1.5">{s.title}</h2>
                <p className="text-[13px] text-ink-mute leading-relaxed">{s.body}</p>
              </motion.section>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 rounded-xl bg-ink dark:bg-[#1A2236] dark:border dark:border-white/15 px-5 py-3.5 text-[13.5px] font-medium tracking-wide text-cream-50 text-center hover:bg-ink-soft dark:hover:bg-[#222c3e] transition-colors"
            >
              ← Continue to site
            </Link>
            <Link
              href="/cookies"
              className="flex-1 rounded-xl border border-ink/15 dark:border-white/15 px-5 py-3.5 text-[13.5px] tracking-wide text-ink dark:text-cream-50/90 text-center hover:bg-ink/4 dark:hover:bg-white/6 transition-colors"
            >
              Cookie policy
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
