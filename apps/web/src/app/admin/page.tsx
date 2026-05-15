'use client';

import { useState } from 'react';
import Link from 'next/link';

/** Admin dashboard shell. Real auth + data hooks live in /lib/api. */
export default function AdminHome() {
  const [tab, setTab] = useState<'overview' | 'sessions' | 'students' | 'reports' | 'audit'>('overview');
  return (
    <div className="min-h-screen flex bg-cream-100">
      <aside className="w-60 border-r border-ink/10 bg-cream-50 p-5">
        <div className="font-display text-[1.4rem] mb-8">Attendly</div>
        {(['overview', 'sessions', 'students', 'reports', 'audit'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`block w-full text-left px-3 py-2 rounded-md text-[13.5px] capitalize ${
              tab === t ? 'bg-ink text-cream-50' : 'text-ink-mute hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
        <div className="mt-10 text-[11px] text-ink-mute">
          <Link href="/" className="link-line">← back to site</Link>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="font-display text-[2.4rem] capitalize">{tab}</h1>
          <Link
            href="/admin/qr/demo"
            className="rounded-full bg-accent text-cream-50 px-4 py-2 text-[12.5px] font-medium"
          >
            Start QR session
          </Link>
        </div>

        {tab === 'overview' && <Overview />}
        {tab === 'sessions' && <Placeholder name="Sessions" />}
        {tab === 'students' && <Placeholder name="Students" />}
        {tab === 'reports' && <Placeholder name="Reports" />}
        {tab === 'audit' && <Placeholder name="Audit" />}
      </main>
    </div>
  );
}

function Overview() {
  const stats = [
    { l: 'Students', v: '4,182' },
    { l: 'Classes', v: '64' },
    { l: 'Today\'s sessions', v: '37' },
    { l: 'Avg. attendance', v: '88.3%' },
    { l: 'Absent today', v: '486' },
    { l: 'Suspicious scans', v: '12' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((s) => (
        <div key={s.l} className="rounded-xl bg-cream-50 border border-ink/8 p-5">
          <div className="text-[10.5px] tracking-[0.18em] text-ink-mute uppercase">{s.l}</div>
          <div className="font-display text-[2.4rem] leading-none mt-2">{s.v}</div>
        </div>
      ))}
    </div>
  );
}

function Placeholder({ name }: { name: string }) {
  return (
    <div className="rounded-xl bg-cream-50 border border-ink/8 p-10 text-center text-ink-mute">
      {name} module — wire to <code className="font-mono">/v1/{name.toLowerCase()}</code>.
    </div>
  );
}
