'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface Section { title: string; body: string; list?: string[]; }

const SECTIONS: Section[] = [
  {
    title: 'Welcome to Attendly',
    body: 'Attendly is a secure QR-based attendance platform for schools and organisations. These Terms & Conditions describe the agreement between you and us when you use the service. By signing in, you accept these terms.',
  },
  {
    title: 'Who can use Attendly',
    body: 'You may use Attendly if you are a student, teacher, admin or developer affiliated with a school or institution that has joined our platform. We don\'t set an age limit ourselves, but your institution may.',
  },
  {
    title: 'Your account and role',
    body: 'You sign in with a Google account. Your role on Attendly (Student, Teacher, Admin, Institution owner) is set when you first join — either by entering a school code or by creating a new institution. Each role has different permissions; admins can change roles for members of their own institution.',
  },
  {
    title: 'What you agree to do',
    body: 'Use Attendly honestly — to record your own real attendance and (if you\'re a teacher or admin) to manage attendance for your students or staff. Respect your institution\'s policies and the law that applies where you are.',
  },
  {
    title: 'What you agree NOT to do',
    body: 'Don\'t do any of the following:',
    list: [
      'Mark attendance for someone who isn\'t actually present',
      'Share device tokens, screenshots, or session links to help anyone fake attendance',
      'Spoof your location, time, or device identity',
      'Try to access another institution\'s data',
      'Reverse-engineer the QR signing scheme or scrape data at scale',
      'Use Attendly for anything illegal under your local laws',
    ],
  },
  {
    title: 'Your content and data',
    body: 'You keep ownership of your name, email and the attendance you generate. We hold this information so Attendly can do its job (e.g. show your history, calculate percentages, prove a session happened). We never sell or share your data with advertisers. Full details on what stays on your device are in the Cookie Policy.',
  },
  {
    title: 'Cancellation and deletion',
    body: 'You can sign out any time from the menu. To delete your account and erase your data permanently, email hello@attendly.app and we\'ll process the request within 7 days. Once your institution is removed, its students lose access.',
  },
  {
    title: 'Beta period',
    body: 'Attendly is currently in active development. Features may change without notice. We work hard for uptime but don\'t offer a formal SLA during the beta. If something breaks, please tell us at hello@attendly.app.',
  },
  {
    title: 'Limits of responsibility',
    body: 'Attendly is provided as-is. We are not responsible for indirect or consequential losses (for example: missed grades from attendance disputes, downtime affecting an exam window, or third-party device failures). For disputes about an individual attendance record, your institution\'s admin is the first point of contact.',
  },
  {
    title: 'Changes to these terms',
    body: 'If we make significant changes to these Terms, we\'ll show a notice in the app so you can review them before continuing. Minor wording or typo fixes don\'t trigger a notice — the current version is always live on this page.',
  },
  {
    title: 'Get in touch',
    body: 'For anything — questions, complaints, data requests, partnership ideas — email hello@attendly.app. We respond personally, usually within a business day.',
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
            'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
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
            [ document 01 · terms &amp; conditions ]
          </div>
          <h1 className="font-display text-[2.6rem] md:text-[3.4rem] leading-[1.05] tracking-tightest text-ink dark:text-[#F0EDE6] mb-3">
            The <span className="italic text-accent">agreement</span> between us.
          </h1>
          <p className="text-[14.5px] text-ink-mute leading-relaxed mb-3">
            Plain English. Eleven short sections. About four minutes to read.
          </p>
          <p className="text-[12px] text-ink-mute mb-10">
            Effective: May 2026 · This page covers the service itself. For what we save on your device, see{' '}
            <Link href="/cookies" className="text-accent hover:underline">the Cookie Policy</Link>.
          </p>

          {/* Sections */}
          <ol className="space-y-3 mb-12 list-none">
            {SECTIONS.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.03 * i }}
                className="rounded-2xl border border-ink/8 dark:border-white/8 bg-cream-50 dark:bg-[#13161D] p-5"
              >
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="text-[11px] font-mono text-accent flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="text-[14.5px] font-medium text-ink dark:text-cream-50">{s.title}</h2>
                </div>
                <p className="text-[13px] text-ink-mute leading-relaxed ml-7">{s.body}</p>
                {s.list && (
                  <ul className="ml-7 mt-2 space-y-1.5">
                    {s.list.map((item) => (
                      <li key={item} className="flex gap-2 text-[12.5px] text-ink-mute leading-relaxed">
                        <span className="text-red-500 flex-shrink-0">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.li>
            ))}
          </ol>

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
              Read the Cookie Policy →
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
