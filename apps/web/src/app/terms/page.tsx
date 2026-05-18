'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const SECTIONS = [
  {
    title: '1. Acceptance',
    body: 'By using Attendly you confirm that you have read, understood and agree to be bound by these Terms. If you do not agree, please stop using the service.',
  },
  {
    title: '2. The Service',
    body: 'Attendly provides QR-code based attendance management for educational institutions. We offer dynamic signed QR tokens, device binding, geofencing and analytics dashboards for admins and teachers.',
  },
  {
    title: '3. Accounts',
    body: 'You may sign in with a Google account. You are responsible for keeping access to that Google account secure. Students join their institution using a short code shared by their admin; admins are responsible for revoking codes they no longer want shared.',
  },
  {
    title: '4. Roles & Permissions',
    body: 'Roles (Developer, Institution, Admin, Teacher, Student) are assigned automatically based on whether you create or join an institution. Developers have elevated access for platform debugging. Misuse of elevated roles may result in suspension.',
  },
  {
    title: '5. Data & Privacy',
    body: 'We store the minimum data required to run the service: your email and display name (from Google), your role, your institution membership, and attendance records. We do not sell your data, ever. See our cookies policy for details on local storage.',
  },
  {
    title: '6. Acceptable Use',
    body: 'You agree not to: spoof location, share device tokens to fake attendance, attempt to scrape other institutions\' data, reverse-engineer the QR signing scheme, or use the service for anything illegal.',
  },
  {
    title: '7. Beta status',
    body: 'Attendly is in active development. Features may change without notice, and short outages are possible. We aim for production-grade reliability but make no SLA guarantees during the early-access period.',
  },
  {
    title: '8. Liability',
    body: 'The service is provided "as is". Attendly is not liable for indirect or consequential losses arising from attendance record disputes, missed sessions, or downtime.',
  },
  {
    title: '9. Contact',
    body: 'Reach the team at hello@attendly.app for any questions, takedown requests, or to delete your data.',
  },
];

export default function TermsPage() {
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
            [ policy — terms of service ]
          </div>
          <h1 className="font-display text-[2.6rem] md:text-[3.4rem] leading-[1.05] tracking-tightest text-ink dark:text-[#F0EDE6] mb-3">
            Terms of <span className="italic text-accent">service</span>.
          </h1>
          <p className="text-[14px] text-ink-mute leading-relaxed mb-10 max-w-xl">
            Last updated: May 2026 · Effective on first sign-in
          </p>

          <div className="space-y-5">
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

          <div className="mt-10 text-[12px] text-ink-mute">
            See our <Link href="/cookies" className="text-accent hover:underline">cookie policy</Link> for details on local storage.
          </div>
        </motion.div>
      </div>
    </main>
  );
}
