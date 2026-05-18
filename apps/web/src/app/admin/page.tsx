'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth, roleAtLeast, ROLE_WEIGHT, type Role } from '@/context/AuthContext';
import { useSiteConfig, type SiteConfig, type PricingMode } from '@/context/SiteConfigContext';
import { AuthModal } from '@/components/AuthModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SkeletonTable } from '@/components/Skeleton';
import { CryptoPanel } from '@/components/admin/CryptoPanel';
import { LedgerPanel } from '@/components/admin/LedgerPanel';

function useTourGuide(role: Role | null) {
  useEffect(() => {
    if (typeof window === 'undefined' || !role) return;
    const key = `atd_tour_${role}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    import('driver.js').then(({ driver }) => {
      import('driver.js/dist/driver.css' as any).catch(() => {});
      const d = driver({
        animate: true, smoothScroll: true, showProgress: true,
        steps: [
          { element: '#tour-overview', popover: { title: 'Overview', description: 'Your dashboard at a glance — sessions, students, attendance stats.' } },
          { element: '#tour-students', popover: { title: 'Students', description: 'Add, search and manage students. Click a student to add remarks.' } },
          { element: '#tour-manage-users', popover: { title: 'Manage Users', description: 'Invite admins and teachers, change roles, suspend accounts.' } },
          { element: '#tour-institution', popover: { title: 'Institution', description: 'Your institution code lives here — share it so others can join.' } },
          { element: '#tour-qr-btn', popover: { title: 'Start QR Session', description: 'Launch a live QR session. The code rotates every second — impossible to fake.' } },
        ],
      });
      setTimeout(() => d.drive(), 800);
    }).catch(() => {});
  }, [role]);
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab =
  | 'overview'
  | 'sessions'
  | 'students'
  | 'classes'
  | 'reports'
  | 'audit'
  | 'crypto'
  | 'ledger'
  | 'manage-users'
  | 'teacher-perms'
  | 'institution'
  | 'institutions'
  | 'god-mode';

const ROLE_META: Record<Role, { label: string; dot: string; access: Tab[] }> = {
  developer: {
    label: 'Developer',
    dot: 'bg-red-500',
    access: ['overview', 'sessions', 'students', 'classes', 'reports', 'audit', 'crypto', 'ledger', 'manage-users', 'teacher-perms', 'institution', 'institutions', 'god-mode'],
  },
  institution: {
    label: 'Institution',
    dot: 'bg-orange-500',
    access: ['overview', 'sessions', 'students', 'classes', 'reports', 'audit', 'crypto', 'ledger', 'manage-users', 'teacher-perms', 'institution'],
  },
  admin: {
    label: 'Admin',
    dot: 'bg-yellow-500',
    access: ['overview', 'sessions', 'students', 'classes', 'reports', 'audit', 'crypto', 'ledger', 'manage-users', 'teacher-perms'],
  },
  teacher: {
    label: 'Teacher',
    dot: 'bg-blue-500',
    access: ['overview', 'sessions', 'students'],
  },
  student: {
    label: 'Student',
    dot: 'bg-gray-400',
    access: [],
  },
};

const TAB_LABELS: Record<Tab, string> = {
  'overview':      'Overview',
  'sessions':      'Sessions',
  'students':      'Students',
  'classes':       'Classes',
  'reports':       'Reports',
  'audit':         'Audit Logs',
  'crypto':        '🔐 Crypto & Keys',
  'ledger':        '⛓ Hash Ledger',
  'manage-users':  'Manage Users',
  'teacher-perms': 'Teacher Perms',
  'institution':   'Institution',
  'institutions':  '🌐 All Institutions',
  'god-mode':      '⚡ God Mode',
};

// ─── Shell ────────────────────────────────────────────────────────────────────

function useLiveSessionCount() {
  const { institutionId } = useAuth();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!institutionId) return;
    const { onSessions } = require('@/lib/firestore-db');
    return onSessions(institutionId, (list: import('@/lib/firestore-db').FSSession[]) => {
      setCount(list.filter((s) => s.status === 'OPEN').length);
    });
  }, [institutionId]);
  return count;
}

export default function AdminHome() {
  const { user, role, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const liveCount = useLiveSessionCount();
  useTourGuide(role);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="text-ink-mute text-[13px]">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-100 gap-6">
        <div className="font-display text-[2.4rem]">Attendly</div>
        <p className="text-ink-mute text-[14px]">Sign in to access the admin panel.</p>
        <AuthModal trigger={
          <button className="rounded-xl bg-accent text-cream-50 px-6 py-3 text-[14px] font-medium hover:bg-accent/90 transition-all">
            Sign in with Google
          </button>
        } />
        <Link href="/" className="text-[13px] text-ink-mute hover:text-ink transition-colors">← back to site</Link>
      </div>
    );
  }

  const meta = role ? ROLE_META[role] : null;
  if (!meta || meta.access.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-100 gap-4">
        <div className="text-[2rem] font-display">Access Denied</div>
        <p className="text-ink-mute text-[14px]">Your account does not have admin privileges.</p>
        {meta && (
          <span className="inline-flex items-center gap-2 text-[12px] px-3 py-1 rounded-full bg-ink/8">
            <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        )}
        <Link href="/" className="text-[13px] text-accent hover:underline mt-2">← back to site</Link>
      </div>
    );
  }

  const allowedTabs = meta.access;
  const currentTab: Tab = allowedTabs.includes(tab) ? tab : allowedTabs[0] as Tab;

  return (
    <div className="min-h-screen flex bg-cream-100">
      <aside className="w-64 border-r border-ink/10 dark:border-white/10 bg-cream-50 p-5 flex flex-col flex-shrink-0">
        <div className="font-display text-[1.4rem] mb-2">Attendly</div>
        <div className="flex items-center gap-2 mb-8 text-[11px] text-ink-mute">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`} />
          {meta.label}
          {user.displayName && (
            <span className="truncate text-ink/60 ml-1">· {user.displayName.split(' ')[0]}</span>
          )}
        </div>

        <nav className="flex-1 space-y-0.5">
          {(Object.keys(TAB_LABELS) as Tab[]).map((t) => {
            const allowed = allowedTabs.includes(t);
            const isGod = t === 'god-mode';
            const tourMap: Partial<Record<Tab, string>> = {
              overview: 'tour-overview', students: 'tour-students',
              'manage-users': 'tour-manage-users', institution: 'tour-institution',
            };
            const tourId = tourMap[t];
            return (
              <button key={t} id={tourId} onClick={() => allowed && setTab(t)} disabled={!allowed}
                className={`block w-full text-left px-3 py-2 rounded-md text-[13px] transition-colors ${
                  isGod && allowed
                    ? currentTab === t ? 'bg-red-600 text-white font-semibold' : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium'
                    : currentTab === t ? 'bg-ink text-cream-50 dark:bg-white/10 dark:border dark:border-white/10'
                    : allowed ? 'text-ink-mute hover:text-ink hover:bg-cream-100'
                    : 'text-ink/20 dark:text-white/20 cursor-not-allowed'
                }`}
              >
                {TAB_LABELS[t]}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-ink/10 dark:border-white/10 space-y-2">
          <Link
            href="/profile"
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-ink/4 dark:bg-white/6 hover:bg-ink/10 dark:hover:bg-white/12 text-ink dark:text-cream-50 text-[13px] transition-all"
          >
            <span>👤</span>
            <span>Profile</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-ink/6 dark:bg-white/8 hover:bg-ink/12 dark:hover:bg-white/14 text-ink dark:text-cream-50 text-[13px] font-medium transition-all"
          >
            <span>←</span>
            <span>Back to site</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl border border-red-500/25 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-[13px] transition-all"
          >
            <span>↩</span>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[2.4rem]">{TAB_LABELS[currentTab]}</h1>
            {liveCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[11px] font-medium px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                {liveCount} live
              </span>
            )}
          </div>
          {roleAtLeast(role, 'teacher') && (
            <Link id="tour-qr-btn" href="/admin/qr/demo"
              className="rounded-full bg-accent text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-accent/90 transition-all">
              Start QR session
            </Link>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <ErrorBoundary name={TAB_LABELS[currentTab]}>
              {currentTab === 'overview'      && <OverviewPanel role={role!} />}
              {currentTab === 'sessions'      && <SessionsPanel />}
              {currentTab === 'students'      && <StudentsPanel role={role!} />}
              {currentTab === 'classes'       && <ClassesPanel />}
              {currentTab === 'reports'       && <ReportsPanel />}
              {currentTab === 'audit'         && <AuditPanel role={role!} />}
              {currentTab === 'crypto'        && <CryptoPanel />}
              {currentTab === 'ledger'        && <LedgerPanel />}
              {currentTab === 'manage-users'  && <ManageUsersPanel role={role!} />}
              {currentTab === 'teacher-perms' && <TeacherPermsPanel />}
              {currentTab === 'institution'   && <InstitutionPanel />}
              {currentTab === 'institutions'  && <InstitutionsPanel />}
              {currentTab === 'god-mode'      && <GodModePanel />}
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl bg-cream-50 border border-ink/8 ${className}`}>{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[11px] tracking-[0.18em] uppercase text-ink-mute font-medium mb-4">{children}</h2>;
}

function Field({ label, value, onChange, type = 'text', placeholder, className = '' }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[11px] tracking-wide text-ink-mute mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full text-[13px] text-ink bg-cream-100 border border-ink/10 rounded-lg px-3 py-2 focus:outline-none focus:border-accent/50 transition-colors" />
    </div>
  );
}

function Toggle({ label, checked, onChange, description, danger }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; description?: string; danger?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div className="relative mt-0.5 flex-shrink-0">
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className={`w-9 h-5 rounded-full transition-colors ${checked ? (danger ? 'bg-red-500' : 'bg-accent') : 'bg-ink/20 dark:bg-white/20'}`} />
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </div>
      <div>
        <div className={`text-[13px] font-medium ${danger ? 'text-red-600' : 'text-ink'}`}>{label}</div>
        {description && <div className="text-[11px] text-ink-mute mt-0.5">{description}</div>}
      </div>
    </label>
  );
}

function Badge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    DEVELOPER: 'bg-red-100 text-red-700', INSTITUTION: 'bg-orange-100 text-orange-700',
    ADMIN: 'bg-yellow-100 text-yellow-700', TEACHER: 'bg-blue-100 text-blue-700',
    STUDENT: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${colors[role] ?? 'bg-gray-100 text-gray-600'}`}>
      {role.toLowerCase()}
    </span>
  );
}

// ─── Animated stat card ───────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef(0);

  useEffect(() => {
    if (!ref.current) return;
    const from = prev.current;
    const to = value;
    prev.current = to;
    if (from === to) return;
    let start: number | null = null;
    const duration = 600;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * ease);
      if (ref.current) ref.current.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return (
    <Card className="p-5">
      <div className="text-[10.5px] tracking-[0.18em] text-ink-mute uppercase">{label}</div>
      <div ref={ref} className="font-display text-[2.4rem] leading-none mt-2">{value.toLocaleString()}</div>
    </Card>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function OverviewPanel({ role }: { role: Role }) {
  const { institutionId } = useAuth();
  const [students, setStudents] = useState<import('@/lib/firestore-db').FSStudent[]>([]);
  const [users, setUsers] = useState<import('@/lib/firestore-db').FSUser[]>([]);
  const [sessions, setSessions] = useState<import('@/lib/firestore-db').FSSession[]>([]);
  const [allInstitutions, setAllInstitutions] = useState<import('@/lib/firestore-db').FSInstitution[]>([]);

  useEffect(() => {
    if (!institutionId) return;
    const { onStudents, onUsers, onSessions } = require('@/lib/firestore-db');
    const u1 = onStudents(institutionId, setStudents);
    const u2 = onUsers(institutionId, setUsers);
    const u3 = onSessions(institutionId, setSessions);
    return () => { u1(); u2(); u3(); };
  }, [institutionId]);

  useEffect(() => {
    if (!roleAtLeast(role, 'developer')) return;
    const { onAllInstitutions, onUsers } = require('@/lib/firestore-db');
    const u1 = onAllInstitutions(setAllInstitutions);
    // Load all users globally for developer stats (no institutionId filter)
    const u2 = onUsers(null, (all: import('@/lib/firestore-db').FSUser[]) => {
      if (!institutionId) setUsers(all);
    });
    return () => { u1(); u2(); };
  }, [role, institutionId]);

  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todaySessions = sessions.filter((s) => {
    if (!s.startedAt) return false;
    try { return (s.startedAt as any).seconds * 1000 >= todayStart.getTime(); } catch { return false; }
  });
  const activeSessions = sessions.filter((s) => s.status === 'OPEN');
  const teachers = users.filter((u) => u.role === 'teacher');
  const admins   = users.filter((u) => u.role === 'admin');
  const totalAttendance = sessions.reduce((sum, s) => sum + (s.attendanceCount ?? 0), 0);

  const stats = [
    { l: 'Students', v: students.length },
    { l: 'Teachers', v: teachers.length },
    { l: 'Active sessions', v: activeSessions.length },
    { l: "Today's sessions", v: todaySessions.length },
    { l: 'Total sessions', v: sessions.length },
    { l: 'Total attendance marked', v: totalAttendance },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <StatCard key={s.l} label={s.l} value={s.v} />
        ))}
      </div>
      {roleAtLeast(role, 'developer') && (
        <div>
          <SectionTitle>Global (Developer view)</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: 'Total institutions', v: allInstitutions.length },
              { l: 'Total users', v: users.length },
              { l: 'Active sessions', v: activeSessions.length },
              { l: 'Sub-admins', v: admins.length },
            ].map(({ l, v }) => (
              <Card key={l} className="p-4 border-red-200 dark:border-red-900/40 bg-red-50/40 dark:bg-red-900/10">
                <div className="text-[10px] tracking-[0.16em] text-red-500 dark:text-red-400 uppercase">{l}</div>
                <div className="font-mono text-[1.4rem] mt-1 text-red-700 dark:text-red-400">{v}</div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

function SessionsPanel() {
  const { institutionId, user: me } = useAuth();
  const [sessions, setSessions] = useState<import('@/lib/firestore-db').FSSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState<string | null>(null);

  useEffect(() => {
    if (!institutionId) { setLoading(false); return; }
    const { onSessions } = require('@/lib/firestore-db');
    const unsub = onSessions(institutionId, (list: import('@/lib/firestore-db').FSSession[]) => {
      setSessions(list);
      setLoading(false);
    });
    return () => unsub();
  }, [institutionId]);

  const endSess = async (id: string, s: import('@/lib/firestore-db').FSSession) => {
    setEnding(id);
    const { endSession, logAudit } = require('@/lib/firestore-db');
    await endSession(id);
    await logAudit({ institutionId: institutionId ?? '', actorId: me?.uid ?? '', actorName: me?.displayName ?? me?.email ?? '', action: 'SESSION_ENDED', targetId: id, details: `${s.subjectName} · ${s.className}` });
    setEnding(null);
  };

  const active = sessions.filter((s) => s.status === 'OPEN');
  const past   = sessions.filter((s) => s.status === 'CLOSED');

  const fmtTime = (ts: unknown) => {
    if (!ts) return '—';
    try { return new Date((ts as any).seconds * 1000).toLocaleString(); } catch { return '—'; }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {active.length > 0 && (
        <div className="space-y-3">
          <SectionTitle>Live sessions ({active.length})</SectionTitle>
          {active.map((s) => (
            <Card key={s.id} className="p-5 border-green-300 dark:border-green-800/40 bg-green-50/30 dark:bg-green-900/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                    <span className="font-medium text-[14px]">{s.subjectName}</span>
                    <span className="text-[11px] text-ink-mute">· {s.className}</span>
                  </div>
                  <div className="text-[11.5px] text-ink-mute mt-1">
                    Started: {fmtTime(s.startedAt)} · By: {s.teacherName ?? s.teacherId}
                  </div>
                  <div className="text-[11.5px] text-ink-mute">
                    Attendance marked: <strong>{s.attendanceCount}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href="/admin/qr/demo" className="text-[12px] border border-accent/40 text-accent rounded-lg px-3 py-1.5 hover:bg-accent/5 transition-colors">
                    View QR
                  </Link>
                  <button onClick={() => endSess(s.id, s)} disabled={ending === s.id}
                    className="text-[12px] border border-red-300 text-red-500 rounded-lg px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
                    {ending === s.id ? 'Ending…' : 'End session'}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {active.length === 0 && !loading && (
        <div className="rounded-xl border-2 border-dashed border-ink/10 p-8 text-center space-y-3">
          <div className="text-ink-mute text-[13px]">No active sessions right now.</div>
          <Link href="/admin/qr/demo"
            className="inline-flex items-center gap-2 rounded-xl bg-accent text-cream-50 px-5 py-2.5 text-[13px] font-medium hover:bg-accent/90 transition-all">
            Start a QR session
          </Link>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <SectionTitle>Past sessions ({past.length})</SectionTitle>
          <Card className="overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-ink/8 text-[10.5px] tracking-[0.15em] text-ink-mute uppercase">
                  <th className="text-left px-5 py-3">Subject</th>
                  <th className="text-left px-5 py-3">Class</th>
                  <th className="text-left px-5 py-3">Teacher</th>
                  <th className="text-left px-5 py-3">Started</th>
                  <th className="text-left px-5 py-3">Marked</th>
                </tr>
              </thead>
              <tbody>
                {past.slice(0, 50).map((s) => (
                  <tr key={s.id} className="border-b border-ink/6 last:border-0 hover:bg-cream-100/50 transition-colors">
                    <td className="px-5 py-3 font-medium">{s.subjectName}</td>
                    <td className="px-5 py-3 text-ink-mute">{s.className}</td>
                    <td className="px-5 py-3 text-ink-mute">{s.teacherName ?? s.teacherId}</td>
                    <td className="px-5 py-3 text-ink-mute font-mono text-[11px]">{fmtTime(s.startedAt)}</td>
                    <td className="px-5 py-3">{s.attendanceCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {loading && <SkeletonTable rows={4} cols={5} />}
    </div>
  );
}

// ─── Students + Remarks ───────────────────────────────────────────────────────

function StudentsPanel({ role }: { role: Role }) {
  const { user: me, institutionId } = useAuth();
  const [students, setStudents] = useState<import('@/lib/firestore-db').FSStudent[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<import('@/lib/firestore-db').FSStudent | null>(null);
  const [remarkText, setRemarkText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [remarks, setRemarks] = useState<import('@/lib/firestore-db').FSRemark[]>([]);
  const [remarkSaving, setRemarkSaving] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ rollNo: '', fullName: '', email: '', klassName: '' });
  const [editingStudent, setEditingStudent] = useState(false);
  const [editForm, setEditForm] = useState({ rollNo: '', fullName: '', email: '', klassName: '' });
  const [editSaving, setEditSaving] = useState(false);

  const canAdmin = roleAtLeast(role, 'admin');
  const canRemark = roleAtLeast(role, 'teacher');

  useEffect(() => {
    if (!institutionId) return;
    const { onStudents } = require('@/lib/firestore-db');
    const unsub = onStudents(institutionId, setStudents);
    return () => unsub();
  }, [institutionId]);

  useEffect(() => {
    if (!selected) { setRemarks([]); return; }
    const { onRemarks } = require('@/lib/firestore-db');
    const unsub = onRemarks(selected.id, canAdmin, setRemarks);
    return () => unsub();
  }, [selected?.id, canAdmin]);

  const filtered = students.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (s.rollNo ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const submitRemark = async () => {
    if (!remarkText.trim() || !selected || !me || !institutionId) return;
    setRemarkSaving(true);
    try {
      const { addRemark } = require('@/lib/firestore-db');
      await addRemark({
        teacherId: me.uid, teacherName: me.displayName ?? me.email ?? 'Unknown',
        studentId: selected.id, content: remarkText, isPrivate,
        institutionId,
      });
      setRemarkText('');
    } catch (e: unknown) {
      alert('Failed to save remark: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setRemarkSaving(false);
    }
  };

  const addStudent = async () => {
    if (!newStudent.fullName || !newStudent.rollNo || !institutionId) return;
    try {
      const { createStudent } = require('@/lib/firestore-db');
      await createStudent({ ...newStudent, suspended: false, institutionId });
      setNewStudent({ rollNo: '', fullName: '', email: '', klassName: '' });
      setShowAddStudent(false);
    } catch (e: unknown) {
      alert('Failed to add student: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  const startEdit = () => {
    if (!selected) return;
    setEditForm({ rollNo: selected.rollNo, fullName: selected.fullName, email: selected.email ?? '', klassName: selected.klassName ?? '' });
    setEditingStudent(true);
  };

  const saveEdit = async () => {
    if (!selected || !editForm.fullName || !editForm.rollNo) return;
    setEditSaving(true);
    try {
      const { patchStudent } = require('@/lib/firestore-db');
      await patchStudent(selected.id, { rollNo: editForm.rollNo, fullName: editForm.fullName, email: editForm.email, klassName: editForm.klassName });
      setSelected((s) => s ? { ...s, ...editForm } : null);
      setEditingStudent(false);
    } catch (e: unknown) {
      alert('Failed to save changes: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {canAdmin && (
        <div className="flex justify-end">
          <button onClick={() => setShowAddStudent((x) => !x)}
            className="rounded-xl bg-accent text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-accent/90 transition-all">
            + Add student
          </button>
        </div>
      )}

      {showAddStudent && (
        <Card className="p-5 space-y-3 border-accent/30">
          <SectionTitle>New student</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Roll no." value={newStudent.rollNo} onChange={(v) => setNewStudent((s) => ({ ...s, rollNo: v }))} />
            <Field label="Full name" value={newStudent.fullName} onChange={(v) => setNewStudent((s) => ({ ...s, fullName: v }))} />
            <Field label="Email" value={newStudent.email} onChange={(v) => setNewStudent((s) => ({ ...s, email: v }))} />
            <Field label="Class / section" value={newStudent.klassName} onChange={(v) => setNewStudent((s) => ({ ...s, klassName: v }))} />
          </div>
          <div className="flex gap-3">
            <button onClick={addStudent} className="rounded-lg bg-ink text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-ink/80 transition-all">Add</button>
            <button onClick={() => setShowAddStudent(false)} className="rounded-lg border border-ink/10 px-4 py-2 text-[12.5px] text-ink-mute hover:text-ink transition-all">Cancel</button>
          </div>
        </Card>
      )}

      <div className="flex gap-6 h-[calc(100vh-18rem)]">
        <div className="w-72 flex-shrink-0 flex flex-col gap-3">
          <input type="text" placeholder="Search name or roll no…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full text-[13px] bg-cream-50 border border-ink/10 rounded-lg px-3 py-2 focus:outline-none focus:border-accent/50" />
          <Card className="flex-1 overflow-auto p-2 space-y-1">
            {filtered.map((s) => (
              <button key={s.id} onClick={() => setSelected(s)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                  selected?.id === s.id ? 'bg-ink dark:bg-white/10 dark:border dark:border-white/10 text-cream-50' : 'hover:bg-cream-100'
                }`}>
                <div className="text-[13px] font-medium flex items-center gap-2">
                  {s.fullName}
                  {s.suspended && <span className="text-[9px] text-red-500 uppercase tracking-wider">suspended</span>}
                </div>
                <div className={`text-[11px] ${selected?.id === s.id ? 'text-cream-50/60' : 'text-ink-mute'}`}>
                  {s.rollNo} · {s.klassName}
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-[12px] text-ink-mute text-center py-6">
                {students.length === 0 ? 'No students added yet.' : 'No match.'}
              </div>
            )}
          </Card>
        </div>

        {selected ? (
          <div className="flex-1 flex flex-col gap-4 overflow-auto">
            <Card className="p-5">
              {editingStudent ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Roll no." value={editForm.rollNo} onChange={(v) => setEditForm((f) => ({ ...f, rollNo: v }))} />
                    <Field label="Full name" value={editForm.fullName} onChange={(v) => setEditForm((f) => ({ ...f, fullName: v }))} />
                    <Field label="Email" value={editForm.email} onChange={(v) => setEditForm((f) => ({ ...f, email: v }))} />
                    <Field label="Class / section" value={editForm.klassName} onChange={(v) => setEditForm((f) => ({ ...f, klassName: v }))} />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={saveEdit} disabled={editSaving || !editForm.fullName || !editForm.rollNo}
                      className="rounded-lg bg-accent text-cream-50 px-4 py-1.5 text-[12.5px] font-medium hover:bg-accent/90 transition-all disabled:opacity-50">
                      {editSaving ? 'Saving…' : 'Save changes'}
                    </button>
                    <button onClick={() => setEditingStudent(false)}
                      className="rounded-lg border border-ink/10 px-4 py-1.5 text-[12.5px] text-ink-mute hover:text-ink transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-[1.8rem]">{selected.fullName}</h2>
                    <div className="text-[12px] text-ink-mute mt-1">{selected.rollNo} · {selected.email} · {selected.klassName}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selected.suspended && (
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded-full uppercase tracking-wider">Suspended</span>
                    )}
                    {canAdmin && (
                      <>
                        <button onClick={startEdit}
                          className="text-[11px] px-2 py-1 rounded border border-ink/15 text-ink-mute hover:text-ink hover:border-ink/30 transition-colors">
                          ✎ Edit
                        </button>
                        <button onClick={async () => {
                          const { patchStudent, logAudit } = require('@/lib/firestore-db');
                          await patchStudent(selected.id, { suspended: !selected.suspended });
                          await logAudit({ institutionId: institutionId ?? '', actorId: me?.uid ?? '', actorName: me?.displayName ?? me?.email ?? '', action: selected.suspended ? 'STUDENT_UNSUSPENDED' : 'STUDENT_SUSPENDED', targetId: selected.id, targetName: selected.fullName });
                          setSelected((s) => s ? { ...s, suspended: !s.suspended } : null);
                        }} className={`text-[11px] px-2 py-1 rounded border transition-colors ${
                          selected.suspended ? 'border-green-300 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' : 'border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}>
                          {selected.suspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-5 flex-1 flex flex-col gap-4 overflow-auto">
              <SectionTitle>Remarks ({remarks.length})</SectionTitle>
              <div className="flex-1 overflow-auto space-y-3 min-h-0">
                {remarks.length === 0 && (
                  <p className="text-[12px] text-ink-mute">No remarks yet.</p>
                )}
                {remarks.map((r) => (
                  <div key={r.id} className={`rounded-lg p-3 text-[13px] ${r.isPrivate ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30' : 'bg-cream-100'}`}>
                    <div className="text-ink leading-relaxed">{r.content}</div>
                    <div className="flex items-center gap-2 mt-1.5 text-[10.5px] text-ink-mute">
                      <span>{r.teacherName ?? r.teacherId}</span>
                      <span>·</span>
                      <span>{r.createdAt ? new Date((r.createdAt as any).seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                      {r.isPrivate && <span className="text-amber-600 dark:text-amber-400 font-medium">· private</span>}
                    </div>
                  </div>
                ))}
              </div>
              {canRemark && (
                <div className="border-t border-ink/8 pt-4 space-y-2">
                  <textarea value={remarkText} onChange={(e) => setRemarkText(e.target.value)}
                    placeholder="Add a remark about this student…" rows={3}
                    className="w-full text-[13px] text-ink bg-cream-100 border border-ink/10 rounded-lg px-3 py-2 focus:outline-none focus:border-accent/50 resize-none" />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[12px] text-ink-mute cursor-pointer">
                      <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="accent-accent" />
                      Private (admin+ only)
                    </label>
                    <button onClick={submitRemark} disabled={remarkSaving || !remarkText.trim()}
                      className="rounded-lg bg-accent text-cream-50 px-4 py-1.5 text-[12.5px] font-medium hover:bg-accent/90 transition-all disabled:opacity-50">
                      {remarkSaving ? 'Saving…' : 'Add remark'}
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-ink-mute text-[13px]">
            Select a student to view their profile and remarks
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Classes ─────────────────────────────────────────────────────────────────

function ClassesPanel() {
  const { institutionId, user: me } = useAuth();
  const [classes, setClasses] = useState<import('@/lib/firestore-db').FSClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', section: '', description: '' });
  const [editForm, setEditForm] = useState({ name: '', section: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!institutionId) { setLoading(false); return; }
    const { onClasses } = require('@/lib/firestore-db');
    const unsub = onClasses(institutionId, (list: import('@/lib/firestore-db').FSClass[]) => {
      setClasses(list);
      setLoading(false);
    });
    return () => unsub();
  }, [institutionId]);

  const addClass = async () => {
    if (!form.name.trim() || !institutionId) return;
    setSaving(true);
    try {
      const { createClass, logAudit } = require('@/lib/firestore-db');
      await createClass({ institutionId, name: form.name.trim(), section: form.section.trim() || undefined, description: form.description.trim() || undefined });
      await logAudit({ institutionId, actorId: me?.uid ?? '', actorName: me?.displayName ?? me?.email ?? '', action: 'CLASS_CREATED', details: form.name.trim() });
      setForm({ name: '', section: '', description: '' });
      setShowAdd(false);
    } catch (e: unknown) {
      alert('Failed to add class: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (c: import('@/lib/firestore-db').FSClass) => {
    setEditingId(c.id);
    setEditForm({ name: c.name, section: c.section ?? '', description: c.description ?? '' });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const { patchClass } = require('@/lib/firestore-db');
      await patchClass(id, { name: editForm.name.trim(), section: editForm.section.trim() || undefined, description: editForm.description.trim() || undefined });
      setEditingId(null);
    } catch (e: unknown) {
      alert('Failed to save class: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete class "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    const { deleteClass, logAudit } = require('@/lib/firestore-db');
    await deleteClass(id);
    await logAudit({ institutionId: institutionId ?? '', actorId: me?.uid ?? '', actorName: me?.displayName ?? me?.email ?? '', action: 'CLASS_DELETED', details: name });
    setDeleting(null);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-ink-mute">Manage class / batch / section records for your institution.</p>
        <button onClick={() => { setShowAdd((x) => !x); setEditingId(null); }}
          className="rounded-xl bg-accent text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-accent/90 transition-all flex-shrink-0 ml-4">
          + Add class
        </button>
      </div>

      {showAdd && (
        <Card className="p-5 space-y-3 border-accent/30">
          <SectionTitle>New class</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Class name *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="e.g. Computer Science" />
            <Field label="Section / batch" value={form.section} onChange={(v) => setForm((f) => ({ ...f, section: v }))} placeholder="e.g. Batch A" />
            <Field label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} placeholder="Optional notes" className="col-span-2" />
          </div>
          <div className="flex gap-3">
            <button onClick={addClass} disabled={saving || !form.name.trim()}
              className="rounded-lg bg-ink text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-ink/80 transition-all disabled:opacity-50">
              {saving ? 'Adding…' : 'Add class'}
            </button>
            <button onClick={() => setShowAdd(false)}
              className="rounded-lg border border-ink/10 px-4 py-2 text-[12.5px] text-ink-mute hover:text-ink transition-all">
              Cancel
            </button>
          </div>
        </Card>
      )}

      {loading ? (
        <SkeletonTable rows={3} cols={4} />
      ) : classes.length === 0 ? (
        <Card className="p-8 text-center space-y-2">
          <div className="text-ink-mute text-[13px]">No classes yet.</div>
          <div className="text-[11.5px] text-ink-mute">Add your first class or batch using the button above.</div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-ink/8 text-[10.5px] tracking-[0.15em] text-ink-mute uppercase">
                <th className="text-left px-5 py-3">Class name</th>
                <th className="text-left px-5 py-3">Section</th>
                <th className="text-left px-5 py-3">Description</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id} className="border-b border-ink/6 last:border-0 hover:bg-cream-100/50 transition-colors">
                  {editingId === c.id ? (
                    <>
                      <td className="px-5 py-2">
                        <input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                          className="w-full text-[13px] text-ink bg-cream-100 border border-accent/30 rounded px-2 py-1 focus:outline-none" />
                      </td>
                      <td className="px-5 py-2">
                        <input value={editForm.section} onChange={(e) => setEditForm((f) => ({ ...f, section: e.target.value }))}
                          className="w-full text-[13px] text-ink bg-cream-100 border border-ink/10 rounded px-2 py-1 focus:outline-none" />
                      </td>
                      <td className="px-5 py-2">
                        <input value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                          className="w-full text-[13px] text-ink bg-cream-100 border border-ink/10 rounded px-2 py-1 focus:outline-none" />
                      </td>
                      <td className="px-5 py-2">
                        <div className="flex items-center gap-2">
                          <button onClick={() => saveEdit(c.id)} disabled={saving || !editForm.name.trim()}
                            className="text-[11px] border border-accent/40 text-accent rounded px-2 py-1 hover:bg-accent/5 transition-colors disabled:opacity-50">
                            {saving ? '…' : 'Save'}
                          </button>
                          <button onClick={() => setEditingId(null)}
                            className="text-[11px] border border-ink/15 text-ink-mute rounded px-2 py-1 hover:text-ink transition-colors">
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-3 font-medium">{c.name}</td>
                      <td className="px-5 py-3 text-ink-mute">{c.section ?? '—'}</td>
                      <td className="px-5 py-3 text-ink-mute text-[12px]">{c.description ?? '—'}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEdit(c)}
                            className="text-[11px] border border-ink/15 text-ink-mute rounded px-2 py-1 hover:text-ink transition-colors">
                            ✎ Edit
                          </button>
                          <button onClick={() => remove(c.id, c.name)} disabled={deleting === c.id}
                            className="text-[11px] border border-red-300 text-red-500 rounded px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
                            {deleting === c.id ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ─── Reports ─────────────────────────────────────────────────────────────────

function ReportsPanel() {
  const { institutionId } = useAuth();
  const [sessions, setSessions] = useState<import('@/lib/firestore-db').FSSession[]>([]);
  const [students, setStudents] = useState<import('@/lib/firestore-db').FSStudent[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!institutionId) { setLoading(false); return; }
    const { onSessions, onStudents } = require('@/lib/firestore-db');
    const u1 = onSessions(institutionId, (list: import('@/lib/firestore-db').FSSession[]) => { setSessions(list); setLoading(false); });
    const u2 = onStudents(institutionId, setStudents);
    return () => { u1(); u2(); };
  }, [institutionId]);

  const now = Date.now();
  const cutoffs: Record<string, number> = {
    today: new Date().setHours(0, 0, 0, 0),
    week:  now - 7  * 86400_000,
    month: now - 30 * 86400_000,
  };

  const filtered = sessions.filter((s) => {
    if (filter === 'all') return true;
    if (!s.startedAt) return false;
    try { return (s.startedAt as any).seconds * 1000 >= cutoffs[filter]; } catch { return false; }
  });

  const totalStudents = students.length;
  const totalAttendance = filtered.reduce((sum, s) => sum + (s.attendanceCount ?? 0), 0);
  const avgRate = totalStudents > 0 && filtered.length > 0
    ? ((totalAttendance / (filtered.length * totalStudents)) * 100).toFixed(1)
    : '—';

  const fmtTime = (ts: unknown) => {
    if (!ts) return '—';
    try { return new Date((ts as any).seconds * 1000).toLocaleString(); } catch { return '—'; }
  };

  const exportCsv = () => {
    const rows = [
      ['Date', 'Subject', 'Class', 'Teacher', 'Marked', 'Total Students', 'Rate %'],
      ...filtered.map((s) => [
        fmtTime(s.startedAt),
        s.subjectName,
        s.className,
        s.teacherName ?? s.teacherId,
        s.attendanceCount,
        totalStudents,
        totalStudents > 0 ? ((s.attendanceCount / totalStudents) * 100).toFixed(1) : '—',
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: 'Sessions shown', v: filtered.length },
          { l: 'Total students', v: totalStudents },
          { l: 'Attendance marked', v: totalAttendance.toLocaleString() },
          { l: 'Avg. rate', v: `${avgRate}%` },
        ].map((s) => (
          <Card key={s.l} className="p-4">
            <div className="text-[10px] tracking-[0.18em] text-ink-mute uppercase">{s.l}</div>
            <div className="font-display text-[2rem] leading-none mt-1">{s.v}</div>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 rounded-lg border border-ink/10 overflow-hidden p-0.5">
          {(['all', 'today', 'week', 'month'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[12px] rounded-md transition-colors capitalize ${filter === f ? 'bg-ink dark:bg-white/15 text-cream-50' : 'text-ink-mute hover:text-ink'}`}>
              {f === 'all' ? 'All time' : f === 'today' ? 'Today' : f === 'week' ? 'Last 7 days' : 'Last 30 days'}
            </button>
          ))}
        </div>
        <button onClick={exportCsv} disabled={filtered.length === 0}
          className="rounded-xl border border-ink/15 px-4 py-2 text-[12.5px] text-ink-mute hover:text-ink hover:border-ink/30 transition-colors flex items-center gap-2 disabled:opacity-40">
          ↓ Export CSV
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={5} cols={5} />
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center text-ink-mute text-[13px]">No sessions in this period yet.</Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-ink/8 text-[10.5px] tracking-[0.15em] text-ink-mute uppercase">
                <th className="text-left px-5 py-3">Subject</th>
                <th className="text-left px-5 py-3">Class</th>
                <th className="text-left px-5 py-3">Teacher</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-right px-5 py-3">Marked</th>
                <th className="text-right px-5 py-3">Rate</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const rate = totalStudents > 0
                  ? ((s.attendanceCount / totalStudents) * 100).toFixed(0)
                  : null;
                return (
                  <tr key={s.id} className="border-b border-ink/6 last:border-0 hover:bg-cream-100/50 transition-colors">
                    <td className="px-5 py-3 font-medium">{s.subjectName}</td>
                    <td className="px-5 py-3 text-ink-mute">{s.className}</td>
                    <td className="px-5 py-3 text-ink-mute">{s.teacherName ?? s.teacherId}</td>
                    <td className="px-5 py-3 text-ink-mute font-mono text-[11px]">{fmtTime(s.startedAt)}</td>
                    <td className="px-5 py-3 text-right font-mono">{s.attendanceCount}</td>
                    <td className="px-5 py-3 text-right">
                      {rate !== null ? (
                        <span className={`font-mono text-[12px] ${Number(rate) >= 75 ? 'text-green-600 dark:text-green-400' : Number(rate) >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500'}`}>
                          {rate}%
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] uppercase tracking-wider font-medium ${s.status === 'OPEN' ? 'text-green-600 dark:text-green-400' : 'text-ink-mute'}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ─── Audit Logs ───────────────────────────────────────────────────────────────

const ACTION_META: Record<string, { label: string; color: string }> = {
  SESSION_STARTED:     { label: 'Session started',     color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
  SESSION_ENDED:       { label: 'Session ended',        color: 'text-ink-mute bg-cream-100 dark:bg-white/5' },
  ROLE_CHANGED:        { label: 'Role changed',         color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
  USER_SUSPENDED:      { label: 'User suspended',       color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
  USER_UNSUSPENDED:    { label: 'User unsuspended',     color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
  STUDENT_SUSPENDED:   { label: 'Student suspended',    color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
  STUDENT_UNSUSPENDED: { label: 'Student unsuspended',  color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
  PERMS_UPDATED:       { label: 'Permissions updated',  color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' },
  CLASS_CREATED:       { label: 'Class created',         color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
  CLASS_DELETED:       { label: 'Class deleted',         color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
};

function AuditPanel({ role }: { role: Role }) {
  const { institutionId } = useAuth();
  const [logs, setLogs] = useState<import('@/lib/firestore-db').FSAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [indexError, setIndexError] = useState(false);

  useEffect(() => {
    if (!institutionId) { setLoading(false); return; }
    const { onAuditLogs } = require('@/lib/firestore-db');
    const unsub = onAuditLogs(institutionId, (list: import('@/lib/firestore-db').FSAuditLog[]) => {
      setLogs(list);
      setLoading(false);
    });
    return () => unsub();
  }, [institutionId]);

  const fmtTime = (ts: unknown) => {
    if (!ts) return 'just now';
    try { return new Date((ts as any).seconds * 1000).toLocaleString(); } catch { return '—'; }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-ink-mute">
          Append-only log of all sensitive actions. {logs.length > 0 && `${logs.length} entries.`}
        </p>
      </div>

      {indexError && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 px-4 py-3 text-[12.5px] text-amber-800 dark:text-amber-300">
          Firestore needs a composite index for this query. Check the browser console for a link to create it — it takes ~1 minute.
        </div>
      )}

      {loading ? (
        <SkeletonTable rows={6} cols={4} />
      ) : logs.length === 0 ? (
        <Card className="p-8 text-center space-y-2">
          <div className="text-ink-mute text-[13px]">No audit entries yet.</div>
          <div className="text-[11.5px] text-ink-mute">Entries appear when roles are changed, sessions start/end, or students are suspended.</div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-ink/8 text-[10.5px] tracking-[0.15em] text-ink-mute uppercase">
                <th className="text-left px-5 py-3">When</th>
                <th className="text-left px-5 py-3">Action</th>
                <th className="text-left px-5 py-3">By</th>
                <th className="text-left px-5 py-3">Target / Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const meta = ACTION_META[log.action] ?? { label: log.action, color: 'text-ink-mute bg-cream-100 dark:bg-white/5' };
                return (
                  <tr key={log.id} className="border-b border-ink/6 last:border-0 hover:bg-cream-100/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-[11px] text-ink-mute whitespace-nowrap">{fmtTime(log.createdAt)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full ${meta.color}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-mute">{log.actorName || log.actorId}</td>
                    <td className="px-5 py-3">
                      {log.targetName && <span className="font-medium">{log.targetName}</span>}
                      {log.details && <span className="text-ink-mute text-[11.5px]">{log.targetName ? ' · ' : ''}{log.details}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ─── Manage Users ─────────────────────────────────────────────────────────────

function ManageUsersPanel({ role }: { role: Role }) {
  const { user: me, institutionId } = useAuth();
  const [users, setUsers] = useState<import('@/lib/firestore-db').FSUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', fullName: '', role: 'TEACHER' });
  const [status, setStatus] = useState('');

  const myLevel = ROLE_WEIGHT[role];
  const ALL_ROLES = ['DEVELOPER', 'INSTITUTION', 'ADMIN', 'TEACHER', 'STUDENT'];
  const assignableRoles = ALL_ROLES.filter((r) => {
    const w: Record<string, number> = { DEVELOPER: 50, INSTITUTION: 40, ADMIN: 30, TEACHER: 20, STUDENT: 10 };
    return w[r] < myLevel;
  });

  const canModify = (target: import('@/lib/firestore-db').FSUser) => {
    const w: Record<string, number> = { developer: 50, institution: 40, admin: 30, teacher: 20, student: 10 };
    return (w[target.role] ?? 0) < myLevel && target.uid !== me?.uid;
  };

  useEffect(() => {
    const { onUsers } = require('@/lib/firestore-db');
    const unsub = onUsers(role === 'developer' ? null : institutionId, (list: import('@/lib/firestore-db').FSUser[]) => {
      setUsers(list);
      setLoading(false);
    });
    return () => unsub();
  }, [institutionId, role]);

  const changeRole = async (uid: string, newRole: string, targetName?: string) => {
    const { patchUser, logAudit } = require('@/lib/firestore-db');
    await patchUser(uid, { role: newRole.toLowerCase() as import('@/lib/firestore-db').UserRole });
    await logAudit({ institutionId: institutionId ?? '', actorId: me?.uid ?? '', actorName: me?.displayName ?? me?.email ?? '', action: 'ROLE_CHANGED', targetId: uid, targetName, details: `→ ${newRole}` });
    setEditingId(null);
  };

  const toggleSuspend = async (u: import('@/lib/firestore-db').FSUser) => {
    const { patchUser, logAudit } = require('@/lib/firestore-db');
    await patchUser(u.uid, { suspended: !u.suspended });
    await logAudit({ institutionId: institutionId ?? '', actorId: me?.uid ?? '', actorName: me?.displayName ?? me?.email ?? '', action: u.suspended ? 'USER_UNSUSPENDED' : 'USER_SUSPENDED', targetId: u.uid, targetName: u.displayName ?? u.email ?? '' });
  };

  const createUser = async () => {
    if (!form.email || !form.fullName) return;
    const { createPendingUser } = require('@/lib/firestore-db');
    await createPendingUser({
      email: form.email, displayName: form.fullName,
      role: form.role.toLowerCase() as import('@/lib/firestore-db').UserRole,
      institutionId: institutionId ?? undefined,
    });
    setForm({ email: '', fullName: '', role: 'TEACHER' });
    setShowCreate(false);
    setStatus('User invited. They will get this role when they sign in.');
    setTimeout(() => setStatus(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-ink-mute">
          Manage roles and access for users below your privilege level.
          {roleAtLeast(role, 'admin') && ' Sub-admins you create cannot remove you.'}
        </p>
        <button onClick={() => setShowCreate(true)}
          className="rounded-xl bg-accent text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-accent/90 transition-all flex-shrink-0 ml-4">
          + Invite user
        </button>
      </div>

      {status && (
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 px-4 py-2 text-[12.5px] text-green-700 dark:text-green-400">{status}</div>
      )}

      {showCreate && (
        <Card className="p-5 space-y-4 border-accent/30">
          <SectionTitle>Invite user</SectionTitle>
          <p className="text-[12px] text-ink-mute -mt-2">
            Creates a pending record. The user gets this role the next time they sign in with this email.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full name" value={form.fullName} onChange={(v) => setForm((f) => ({ ...f, fullName: v }))} />
            <Field label="Email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} type="email" />
            <div>
              <label className="block text-[11px] tracking-wide text-ink-mute mb-1">Role</label>
              <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full text-[13px] text-ink bg-cream-100 border border-ink/10 rounded-lg px-3 py-2 focus:outline-none">
                {assignableRoles.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={createUser}
              className="rounded-lg bg-ink text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-ink/80 transition-all">
              Create invite
            </button>
            <button onClick={() => setShowCreate(false)}
              className="rounded-lg border border-ink/10 px-4 py-2 text-[12.5px] text-ink-mute hover:text-ink transition-all">
              Cancel
            </button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <SkeletonTable rows={5} cols={4} />
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-ink/8 text-[10.5px] tracking-[0.15em] text-ink-mute uppercase">
                <th className="text-left px-5 py-3">User</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const editable = canModify(u);
                return (
                  <tr key={u.uid} className="border-b border-ink/6 last:border-0 hover:bg-cream-100/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium">{u.displayName || u.email}</div>
                      <div className="text-[11px] text-ink-mute">{u.email}</div>
                    </td>
                    <td className="px-5 py-3">
                      {editable && editingId === u.uid ? (
                        <select value={u.role} onChange={(e) => changeRole(u.uid, e.target.value, u.displayName ?? u.email ?? '')}
                          autoFocus onBlur={() => setEditingId(null)}
                          className="text-[12px] bg-cream-100 border border-accent/30 rounded px-2 py-1 focus:outline-none">
                          {assignableRoles.map((r) => <option key={r} value={r.toLowerCase()}>{r}</option>)}
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge role={u.role.toUpperCase()} />
                          {editable && (
                            <button onClick={() => setEditingId(u.uid)}
                              className="text-ink-mute hover:text-ink transition-colors text-[11px]">✎</button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] uppercase tracking-wider ${u.suspended ? 'text-red-500' : 'text-green-600'}`}>
                        {u.suspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {editable ? (
                        <button onClick={() => toggleSuspend(u)}
                          className={`text-[11px] px-2 py-1 rounded border transition-colors ${
                            u.suspended ? 'border-green-300 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' : 'border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                          }`}>
                          {u.suspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                      ) : (
                        <span className="text-[11px] text-ink/30 dark:text-white/20">
                          {u.uid === me?.uid ? 'You' : 'Protected'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-ink-mute text-[13px]">No users yet. Invite some above.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

// ─── Teacher Permissions ──────────────────────────────────────────────────────

const PERM_CONFIG = [
  { key: 'canCreateSessions',    label: 'Create sessions',     desc: 'Open new attendance sessions.' },
  { key: 'canEndSessions',       label: 'End sessions',        desc: 'Close ongoing sessions.' },
  { key: 'canViewAllAttendance', label: 'View all attendance', desc: "See all students' records in their sessions." },
  { key: 'canManageStudents',    label: 'Manage students',     desc: 'Add, edit, or suspend student records.' },
  { key: 'canExportReports',     label: 'Export reports',      desc: 'Download CSV/PDF attendance reports.' },
  { key: 'canViewAuditLog',      label: 'View audit log',      desc: 'Access the institution audit trail.' },
  { key: 'canManageClasses',     label: 'Manage classes',      desc: 'Create and edit class/batch/section records.' },
  { key: 'canAddRemarks',        label: 'Add remarks',         desc: 'Write observations about students.' },
];

function TeacherPermsPanel() {
  const { institutionId, user: me } = useAuth();
  const [teachers, setTeachers] = useState<import('@/lib/firestore-db').FSUser[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [perms, setPerms] = useState<Record<string, boolean>>(
    Object.fromEntries(PERM_CONFIG.map((p) => [p.key,
      ['canCreateSessions','canEndSessions','canViewAllAttendance','canAddRemarks'].includes(p.key)]))
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { onUsers } = require('@/lib/firestore-db');
    const unsub = onUsers(institutionId, (users: import('@/lib/firestore-db').FSUser[]) => {
      setTeachers(users.filter((u) => u.role === 'teacher'));
    });
    return () => unsub();
  }, [institutionId]);

  useEffect(() => {
    if (!selectedTeacher || !institutionId) return;
    const { onTeacherPerm } = require('@/lib/firestore-db');
    const unsub = onTeacherPerm(selectedTeacher, institutionId, (p: import('@/lib/firestore-db').FSTeacherPerm) => {
      setPerms({
        canCreateSessions: p.canCreateSessions, canEndSessions: p.canEndSessions,
        canViewAllAttendance: p.canViewAllAttendance, canManageStudents: p.canManageStudents,
        canExportReports: p.canExportReports, canViewAuditLog: p.canViewAuditLog,
        canManageClasses: p.canManageClasses, canAddRemarks: p.canAddRemarks,
      });
    });
    return () => unsub();
  }, [selectedTeacher, institutionId]);

  const savePerms = async () => {
    if (!selectedTeacher || !institutionId) return;
    setSaving(true);
    const { saveTeacherPerm, logAudit } = require('@/lib/firestore-db');
    await saveTeacherPerm(selectedTeacher, { ...perms, institutionId });
    const enabledPerms = Object.entries(perms).filter(([, v]) => v).map(([k]) => k).join(', ');
    await logAudit({ institutionId, actorId: me?.uid ?? '', actorName: me?.displayName ?? me?.email ?? '', action: 'PERMS_UPDATED', targetId: selectedTeacher, details: enabledPerms });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="p-6 space-y-3">
        <SectionTitle>Select teacher</SectionTitle>
        <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}
          className="w-full text-[13px] text-ink bg-cream-100 border border-ink/10 rounded-lg px-3 py-2 focus:outline-none">
          <option value="">— choose a teacher —</option>
          {teachers.map((t) => (
            <option key={t.uid} value={t.uid}>{t.displayName || t.email}</option>
          ))}
        </select>
        {teachers.length === 0 && (
          <p className="text-[11px] text-ink-mute">No teachers found. Invite teachers in Manage Users first.</p>
        )}
      </Card>

      {selectedTeacher && (
        <>
          <Card className="p-6 space-y-4">
            <SectionTitle>Permissions</SectionTitle>
            <p className="text-[12px] text-ink-mute -mt-2">
              Teachers have sudo-level access within sessions by default.
            </p>
            {PERM_CONFIG.map((p) => (
              <Toggle key={p.key} label={p.label} description={p.desc}
                checked={perms[p.key] ?? false}
                onChange={(v) => setPerms((c) => ({ ...c, [p.key]: v }))} />
            ))}
          </Card>

          <button onClick={savePerms} disabled={saving}
            className="rounded-xl bg-accent text-cream-50 px-6 py-2.5 text-[13.5px] font-medium hover:bg-accent/90 transition-all disabled:opacity-50">
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save permissions'}
          </button>
        </>
      )}
    </div>
  );
}

// ─── Institution Settings ─────────────────────────────────────────────────────

function InstitutionPanel() {
  const { institutionId } = useAuth();
  const [inst, setInst] = useState<import('@/lib/firestore-db').FSInstitution | null>(null);
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!institutionId) return;
    const { onInstitution } = require('@/lib/firestore-db');
    return onInstitution(institutionId, (i: import('@/lib/firestore-db').FSInstitution | null) => {
      setInst(i);
      if (i && !name) setName(i.name);
    });
  }, [institutionId]);

  const copyCode = () => {
    if (!inst?.code) return;
    navigator.clipboard.writeText(inst.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveSettings = async () => {
    if (!institutionId) return;
    setSaving(true);
    const { saveInstitution } = require('@/lib/firestore-db');
    await saveInstitution(institutionId, { name });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!institutionId) {
    return (
      <Card className="p-8 text-center space-y-3">
        <div className="text-ink-mute text-[13px]">You are not linked to any institution yet.</div>
        <p className="text-[12px] text-ink-mute">Create one in God Mode or ask your admin to assign you.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Institution join code — most prominent */}
      <Card className="p-6 space-y-3 border-accent/30 bg-accent/5">
        <SectionTitle>Your institution code</SectionTitle>
        <p className="text-[12.5px] text-ink-mute -mt-2">
          Share this code with students and teachers so they can join your institution.
        </p>
        <div className="flex items-center gap-4">
          <div className="font-mono text-[2.8rem] font-bold tracking-[0.3em] text-ink leading-none">
            {inst?.code ?? '——'}
          </div>
          <button onClick={copyCode}
            className="rounded-lg border border-ink/15 px-3 py-1.5 text-[12px] text-ink-mute hover:text-ink transition-colors">
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-[11px] text-ink-mute">
          Students enter this on first sign-in. Teachers use Manage Users → Invite.
        </p>
      </Card>

      <Card className="p-6 space-y-4">
        <SectionTitle>Organisation details</SectionTitle>
        <Field label="Institution name" value={name} onChange={setName} />
      </Card>

      <button onClick={saveSettings} disabled={saving}
        className="rounded-xl bg-accent text-cream-50 px-6 py-2.5 text-[13.5px] font-medium hover:bg-accent/90 transition-all disabled:opacity-60">
        {saving ? 'Saving…' : saved ? 'Saved!' : 'Save settings'}
      </button>
    </div>
  );
}

// ─── All Institutions (Developer) ─────────────────────────────────────────────

function InstitutionsPanel() {
  const [institutions, setInstitutions] = useState<import('@/lib/firestore-db').FSInstitution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { onAllInstitutions } = require('@/lib/firestore-db');
    return onAllInstitutions((list: import('@/lib/firestore-db').FSInstitution[]) => {
      setInstitutions(list);
      setLoading(false);
    });
  }, []);

  const contactHref = (inst: import('@/lib/firestore-db').FSInstitution) => {
    const subject = encodeURIComponent(`Additional institution request — ${inst.name}`);
    const body = encodeURIComponent(
      `Hi Attendly team,\n\nI'd like to add another institution to my account.\n\nCurrent institution: ${inst.name} (ID: ${inst.id})\n\nPlease let me know the next steps.\n\nThank you!`
    );
    return `mailto:hello@attendly.app?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-ink-mute">
          All institutions on the platform. Click <strong>Contact</strong> to open a pre-filled email for their owner.
        </p>
        <span className="text-[12px] text-ink-mute bg-ink/6 rounded-full px-3 py-1">
          {institutions.length} total
        </span>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <SkeletonTable rows={4} cols={5} />
        ) : institutions.length === 0 ? (
          <div className="p-8 text-center text-ink-mute text-[13px]">No institutions yet.</div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-ink/8 text-[10.5px] tracking-[0.15em] text-ink-mute uppercase">
                <th className="text-left px-5 py-3">Institution</th>
                <th className="text-left px-5 py-3">Code</th>
                <th className="text-left px-5 py-3">Type</th>
                <th className="text-left px-5 py-3">Owner ID</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {institutions.map((inst) => (
                <tr key={inst.id} className="border-b border-ink/6 last:border-0 hover:bg-cream-100/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium">{inst.name}</div>
                    <div className="text-[11px] text-ink-mute font-mono">{inst.id}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-mono font-bold tracking-widest text-accent">{inst.code ?? '—'}</span>
                  </td>
                  <td className="px-5 py-3 text-ink-mute capitalize">{inst.type ?? '—'}</td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-[11px] text-ink-mute truncate max-w-[120px] block">{inst.ownerId ?? '—'}</span>
                  </td>
                  <td className="px-5 py-3">
                    <a href={contactHref(inst)}
                      className="text-[11px] border border-ink/15 rounded px-2 py-1 hover:border-accent hover:text-accent transition-colors">
                      Contact owner
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

// ─── God Mode ─────────────────────────────────────────────────────────────────

function GodModePanel() {
  const { config, save } = useSiteConfig();
  const [local, setLocal] = useState<SiteConfig>({ ...config });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedMsg, setSavedMsg] = useState('');
  const [pricingDialog, setPricingDialog] = useState<'paid' | 'free' | null>(null);
  const [draftPrice, setDraftPrice] = useState('');
  const [draftPriceLabel, setDraftPriceLabel] = useState('per month');
  const [draftPaymentUrl, setDraftPaymentUrl] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  // GSAP card stagger entrance
  useEffect(() => {
    if (typeof window === 'undefined' || !rootRef.current) return;
    let cancelled = false;
    import('gsap').then(({ default: gsap }) => {
      if (cancelled || !rootRef.current) return;
      try {
        const cards = rootRef.current.querySelectorAll(':scope > div, :scope > .glass');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.06 },
        );
      } catch {}
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const set = useCallback(<K extends keyof SiteConfig>(k: K, v: SiteConfig[K]) => {
    setLocal((c) => ({ ...c, [k]: v }));
  }, []);

  const handlePricingToggle = (mode: PricingMode) => {
    if (mode === local.pricingMode) return;
    if (mode === 'PAID') {
      setDraftPrice(String(local.customPrice ?? ''));
      setDraftPriceLabel(local.customPriceLabel || 'per month');
      setDraftPaymentUrl(local.paymentUrl || '');
      setPricingDialog('paid');
    } else if (mode === 'FREE') {
      setPricingDialog('free');
    } else {
      set('pricingMode', mode);
    }
  };

  const confirmPaid = () => {
    const price = parseFloat(draftPrice);
    setLocal((c) => ({
      ...c,
      pricingMode: 'PAID',
      customPrice: isNaN(price) ? null : price,
      customPriceLabel: draftPriceLabel || 'per month',
      paymentUrl: draftPaymentUrl,
    }));
    setPricingDialog(null);
  };

  const confirmFree = () => {
    set('pricingMode', 'FREE');
    setPricingDialog(null);
  };

  const persist = async () => {
    setSaving(true);
    setSaveError('');
    setSavedMsg('');
    const result = await save(local);
    setSaving(false);
    if (result.ok) {
      setSavedMsg('Changes saved!');
      setTimeout(() => setSavedMsg(''), 3000);
    } else {
      setSaveError(result.error ?? 'Unknown error');
    }
  };

  return (
    <div ref={rootRef} className="space-y-8 max-w-3xl">
      {/* Warning banner */}
      <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 px-4 py-3 text-[12.5px] text-red-700 dark:text-red-400 flex items-start gap-3">
        <span className="text-red-500 text-lg leading-none flex-shrink-0">⚡</span>
        <span>
          <strong>God Mode</strong> — changes here affect the entire platform globally. Config persists to
          Firestore <code className="font-mono text-[11px]">config/site</code> and localStorage fallback.
        </span>
      </div>

      {/* Pricing mode toggle — prominent */}
      <Card className="p-6 space-y-4 border-amber-200 dark:border-amber-700/30 bg-amber-50/30 dark:bg-amber-900/10">
        <SectionTitle>Pricing mode</SectionTitle>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handlePricingToggle('LIMITED_OFFER')}
            className={`flex-1 rounded-xl border-2 py-4 text-[13px] font-medium transition-all text-center ${
              local.pricingMode === 'LIMITED_OFFER'
                ? 'border-accent bg-accent/10 text-accent dark:text-accent'
                : 'border-ink/10 dark:border-white/10 text-ink-mute hover:border-ink/20 dark:hover:border-white/20'
            }`}
          >
            <div className="text-lg mb-1">🎟️</div>
            <div>Limited offer</div>
            <div className="text-[11px] mt-0.5 opacity-70">Discounted prices</div>
          </button>
          <button
            onClick={() => handlePricingToggle('PAID')}
            className={`flex-1 rounded-xl border-2 py-4 text-[13px] font-medium transition-all text-center ${
              local.pricingMode === 'PAID'
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                : 'border-ink/10 dark:border-white/10 text-ink-mute hover:border-ink/20 dark:hover:border-white/20'
            }`}
          >
            <div className="text-lg mb-1">💳</div>
            <div>Custom price</div>
            <div className="text-[11px] mt-0.5 opacity-70">Set your own rate</div>
          </button>
          <button
            onClick={() => handlePricingToggle('FREE')}
            className={`flex-1 rounded-xl border-2 py-4 text-[13px] font-medium transition-all text-center ${
              local.pricingMode === 'FREE'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'border-ink/10 dark:border-white/10 text-ink-mute hover:border-ink/20 dark:hover:border-white/20'
            }`}
          >
            <div className="text-lg mb-1">🎁</div>
            <div>Free</div>
            <div className="text-[11px] mt-0.5 opacity-70">All plans at no cost</div>
          </button>
        </div>

        {local.pricingMode === 'LIMITED_OFFER' && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Offer label" value={local.limitedOfferLabel}
              onChange={(v) => set('limitedOfferLabel', v)} />
            <Field label="Discount %" value={String(local.limitedOfferDiscountPct)}
              onChange={(v) => set('limitedOfferDiscountPct', Number(v))} type="number" />
          </div>
        )}

        {local.pricingMode === 'PAID' && (
          <div className="rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-700/30 p-4 space-y-3">
            <p className="text-[12px] text-orange-700 dark:text-orange-400 font-medium">Custom pricing active</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Custom price ($)" value={local.customPrice !== null ? String(local.customPrice) : ''}
                onChange={(v) => set('customPrice', v === '' ? null : parseFloat(v))} type="number" placeholder="e.g. 49" />
              <Field label="Price label" value={local.customPriceLabel}
                onChange={(v) => set('customPriceLabel', v)} placeholder="per month" />
            </div>
            <Field label="Payment URL (leave blank if not ready)" value={local.paymentUrl}
              onChange={(v) => set('paymentUrl', v)} placeholder="https://buy.stripe.com/…" />
            {!local.paymentUrl && (
              <p className="text-[11px] text-orange-600 dark:text-orange-500">
                No payment URL set — CTAs will show &quot;coming soon&quot; until you add one.
              </p>
            )}
          </div>
        )}

        {local.pricingMode === 'FREE' && (
          <div className="rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-700/30 p-4">
            <p className="text-[12px] text-green-700 dark:text-green-400">
              All plans show as <strong>Free</strong> across the site. No payment required.
            </p>
          </div>
        )}
      </Card>

      {/* PAID pricing dialog */}
      {pricingDialog === 'paid' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 dark:bg-black/60 backdrop-blur-sm">
          <div className="bg-cream-50 dark:bg-[#13161D] rounded-2xl border border-ink/10 dark:border-white/10 p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="font-display text-[1.6rem] mb-1 dark:text-cream-50">Set custom pricing</h2>
            <p className="text-[13px] text-ink-mute dark:text-white/50 mb-5">
              Visitors will see this price on the Pro plan. Leave the payment URL blank if you haven&apos;t set up payments yet.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] tracking-wide text-ink-mute dark:text-white/50 mb-1">Custom price ($)</label>
                <input
                  type="number" min="0" value={draftPrice}
                  onChange={(e) => setDraftPrice(e.target.value)}
                  placeholder="e.g. 49"
                  className="w-full rounded-lg border border-ink/10 dark:border-white/10 bg-cream-50 dark:bg-[#1A2236] px-3 py-2 text-[13px] dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-wide text-ink-mute dark:text-white/50 mb-1">Price label</label>
                <input
                  type="text" value={draftPriceLabel}
                  onChange={(e) => setDraftPriceLabel(e.target.value)}
                  placeholder="per month"
                  className="w-full rounded-lg border border-ink/10 dark:border-white/10 bg-cream-50 dark:bg-[#1A2236] px-3 py-2 text-[13px] dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-wide text-ink-mute dark:text-white/50 mb-1">Payment URL <span className="text-ink/30 dark:text-white/30">(optional — leave blank if not ready)</span></label>
                <input
                  type="url" value={draftPaymentUrl}
                  onChange={(e) => setDraftPaymentUrl(e.target.value)}
                  placeholder="https://buy.stripe.com/…"
                  className="w-full rounded-lg border border-ink/10 dark:border-white/10 bg-cream-50 dark:bg-[#1A2236] px-3 py-2 text-[13px] dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
                {!draftPaymentUrl && (
                  <p className="mt-1 text-[11px] text-ink/40 dark:text-white/30">CTAs will show &quot;coming soon&quot; until you add a payment link.</p>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={confirmPaid}
                className="flex-1 rounded-xl bg-orange-600 text-white py-2.5 text-[13px] font-medium hover:bg-orange-700 transition-all">
                Apply custom pricing
              </button>
              <button onClick={() => setPricingDialog(null)}
                className="flex-1 rounded-xl border border-ink/10 dark:border-white/10 py-2.5 text-[13px] text-ink-mute dark:text-white/50 hover:text-ink dark:hover:text-cream-50 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FREE pricing confirmation dialog */}
      {pricingDialog === 'free' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 dark:bg-black/60 backdrop-blur-sm">
          <div className="bg-cream-50 dark:bg-[#13161D] rounded-2xl border border-ink/10 dark:border-white/10 p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="font-display text-[1.6rem] mb-1 dark:text-cream-50">Make everything free?</h2>
            <p className="text-[13px] text-ink-mute dark:text-white/50 mb-4">
              All pricing plans will display as <strong className="text-green-600 dark:text-green-400">Free</strong> across the entire site. No payment required from visitors.
            </p>
            <ul className="text-[13px] space-y-1 mb-6 pl-4">
              <li className="list-disc text-ink-mute dark:text-white/50">Starter, Pro, and Enterprise all show as free</li>
              <li className="list-disc text-ink-mute dark:text-white/50">CTAs change to &quot;Start for free&quot;</li>
              <li className="list-disc text-green-600 dark:text-green-400 font-medium">You can switch back at any time</li>
            </ul>
            <div className="flex gap-3">
              <button onClick={confirmFree}
                className="flex-1 rounded-xl bg-green-600 text-white py-2.5 text-[13px] font-medium hover:bg-green-700 transition-all">
                Yes, make it free
              </button>
              <button onClick={() => setPricingDialog(null)}
                className="flex-1 rounded-xl border border-ink/10 dark:border-white/10 py-2.5 text-[13px] text-ink-mute dark:text-white/50 hover:text-ink dark:hover:text-cream-50 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branding */}
      <Card className="p-6 space-y-4">
        <SectionTitle>Branding &amp; text</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Site title" value={local.siteTitle} onChange={(v) => set('siteTitle', v)} className="col-span-2" />
          <Field label="Tagline" value={local.tagline} onChange={(v) => set('tagline', v)} className="col-span-2" />
          <Field label="Logo URL" value={local.logoUrl ?? ''} onChange={(v) => set('logoUrl', v || null)} placeholder="https://…" />
          <Field label="Favicon URL" value={local.faviconUrl ?? ''} onChange={(v) => set('faviconUrl', v || null)} placeholder="https://…" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] tracking-wide text-ink-mute mb-1">Primary colour</label>
            <div className="flex items-center gap-2">
              <input type="color" value={local.primaryColor}
                onChange={(e) => set('primaryColor', e.target.value)}
                className="w-10 h-10 rounded-lg border border-ink/10 cursor-pointer" />
              <span className="font-mono text-[13px] text-ink-mute">{local.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-[11px] tracking-wide text-ink-mute mb-1">Accent colour</label>
            <div className="flex items-center gap-2">
              <input type="color" value={local.accentColor}
                onChange={(e) => set('accentColor', e.target.value)}
                className="w-10 h-10 rounded-lg border border-ink/10 cursor-pointer" />
              <span className="font-mono text-[13px] text-ink-mute">{local.accentColor}</span>
            </div>
          </div>
        </div>
        {/* Live preview */}
        <div className="rounded-lg border border-ink/8 p-4 bg-cream-100 space-y-1">
          <div className="font-display text-[1.6rem]" style={{ color: local.primaryColor }}>{local.siteTitle}</div>
          <div className="text-[13px] text-ink-mute">{local.tagline}</div>
          <button className="mt-2 px-4 py-1.5 rounded-lg text-white text-[12px]" style={{ background: local.accentColor }}>
            Sample button
          </button>
        </div>
      </Card>

      {/* Stats editor — "Numbers that speak for themselves" */}
      <Card className="p-6 space-y-4">
        <SectionTitle>Numbers — &quot;speak for themselves&quot;</SectionTitle>
        <p className="text-[12px] text-ink-mute">8 stat cards (4 left column, 4 right). Leave all blank to restore defaults.</p>
        <div className="space-y-2">
          {Array.from({ length: 8 }, (_, i) => {
            const stat = (local.siteStats?.[i]) || { tag: '', value: '', sub: '' };
            const update = (field: 'tag' | 'value' | 'sub', val: string) => {
              const next = Array.from({ length: 8 }, (__, j) => local.siteStats?.[j] || { tag: '', value: '', sub: '' }) as { tag: string; value: string; sub: string }[];
              next[i] = { ...next[i], [field]: val };
              set('siteStats', next);
            };
            return (
              <div key={i} className="grid grid-cols-3 gap-2 items-center">
                {i === 0 && <><div className="text-[10px] text-ink-mute">Label</div><div className="text-[10px] text-ink-mute">Value</div><div className="text-[10px] text-ink-mute">Subtitle</div></>}
                <input value={stat.tag} onChange={e => update('tag', e.target.value)} placeholder={`Label ${i + 1}`}
                  className="rounded-lg border border-ink/10 dark:border-white/10 bg-cream-50 dark:bg-[#1A2236] px-3 py-1.5 text-[12px] dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-accent/40" />
                <input value={stat.value} onChange={e => update('value', e.target.value)} placeholder="e.g. 99.7%"
                  className="rounded-lg border border-ink/10 dark:border-white/10 bg-cream-50 dark:bg-[#1A2236] px-3 py-1.5 text-[12px] dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-accent/40" />
                <input value={stat.sub} onChange={e => update('sub', e.target.value)} placeholder={`Subtitle ${i + 1}`}
                  className="rounded-lg border border-ink/10 dark:border-white/10 bg-cream-50 dark:bg-[#1A2236] px-3 py-1.5 text-[12px] dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-accent/40" />
              </div>
            );
          })}
        </div>
        <button onClick={() => set('siteStats', [])} className="text-[11px] text-ink-mute hover:text-accent transition-colors">
          ↺ Reset to defaults
        </button>
      </Card>

      {/* Feature flags */}
      <Card className="p-6 space-y-4">
        <SectionTitle>Feature flags</SectionTitle>
        <Toggle label="Geofencing" description="Reject scans outside the configured radius."
          checked={local.geofencingEnabled} onChange={(v) => set('geofencingEnabled', v)} />
        <Toggle label="Device binding" description="Lock each student to one registered device."
          checked={local.deviceBindingEnabled} onChange={(v) => set('deviceBindingEnabled', v)} />
        <Toggle label="App attestation" description="Require Play Integrity / DeviceCheck on mobile."
          checked={local.attestationEnabled} onChange={(v) => set('attestationEnabled', v)} />
        <Toggle label="Mock location detection" description="Flag and reject spoofed GPS readings."
          checked={local.mockLocationDetection} onChange={(v) => set('mockLocationDetection', v)} />
        <Toggle label="QR token rotation" description="Rotate signed tokens on the configured interval."
          checked={local.qrRotationEnabled} onChange={(v) => set('qrRotationEnabled', v)} />
        <Toggle label="Maintenance mode" description="Block all non-developer API requests."
          checked={local.maintenanceMode} onChange={(v) => set('maintenanceMode', v)} danger />
      </Card>

      {/* QR security defaults — live preview */}
      <Card className="p-6 space-y-5">
        <SectionTitle>QR security defaults</SectionTitle>
        <p className="text-[11.5px] text-ink-mute">
          Live across the landing page demo and every new QR session. Animates smoothly when changed.
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[12.5px] text-ink dark:text-cream-50 font-medium">Rotation interval</label>
            <span className="text-[12px] font-mono tabular-nums text-accent">
              {Number(local.defaultQrRotationSec).toFixed(1)}s
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={local.defaultQrRotationSec}
            onChange={(e) => set('defaultQrRotationSec', parseFloat(e.target.value))}
            className="w-full accent-accent cursor-pointer"
          />
          <div className="flex justify-between text-[10.5px] font-mono text-ink-mute">
            <span>1.0s · strict</span>
            <span>1.5s · balanced</span>
            <span>2.0s</span>
            <span>3.0s · slow nets</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[12.5px] text-ink dark:text-cream-50 font-medium">Max scans per token</label>
            <span className="text-[12px] font-mono tabular-nums text-accent">
              {local.defaultQrMaxScans === 0 ? 'unlimited' : local.defaultQrMaxScans}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 5, 25, 100].map((n) => (
              <button
                key={n}
                onClick={() => set('defaultQrMaxScans', n)}
                className={`rounded-lg border px-2.5 py-2 text-[12px] font-medium transition-colors ${
                  local.defaultQrMaxScans === n
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-ink/10 dark:border-white/10 text-ink-mute hover:border-ink/20 dark:hover:border-white/20'
                }`}
              >
                {n === 0 ? '∞' : n}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-ink-mute">
            <strong>1</strong> = strongest anti-replay (each token consumed after first valid scan).
            <strong> ∞</strong> = unlimited within the TTL window.
          </p>
        </div>
      </Card>

      {/* System config */}
      <Card className="p-6 space-y-4">
        <SectionTitle>Rate limits</SectionTitle>
        <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
          Rate limit changes require API restart on the server side.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Login rate limit (req/min)" value={String(local.loginRateLimitMax)}
            onChange={(v) => set('loginRateLimitMax', Number(v))} type="number" />
          <Field label="Scan rate limit (req/min)" value={String(local.scanRateLimitMax)}
            onChange={(v) => set('scanRateLimitMax', Number(v))} type="number" />
        </div>
      </Card>

      {/* User management */}
      <Card className="p-6 space-y-4">
        <SectionTitle>User management (cross-institution)</SectionTitle>
        <CreateUserForm />
      </Card>

      {/* Institutions */}
      <Card className="p-6 space-y-4">
        <SectionTitle>Institutions management</SectionTitle>
        <CreateInstitutionForm />
      </Card>

      {/* Firestore rules hint */}
      <Card className="p-5 border-blue-200 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-900/10 space-y-2">
        <SectionTitle>Firebase setup — Firestore rules</SectionTitle>
        <p className="text-[12px] text-ink-mute">Deploy these rules in Firebase Console → Firestore → Rules to enable all collections:</p>
        <pre className="text-[11px] bg-ink text-cream-50 rounded-lg p-4 overflow-x-auto leading-relaxed">{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /config/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    match /institutions/{id} {
      allow read, write: if request.auth != null;
    }
    match /students/{id} {
      allow read, write: if request.auth != null;
    }
    match /teacherPerms/{id} {
      allow read, write: if request.auth != null;
    }
    match /remarks/{id} {
      allow read, write: if request.auth != null;
    }
    match /sessions/{id} {
      allow read, write: if request.auth != null;
    }
    match /auditLogs/{id} {
      allow read, write: if request.auth != null;
    }
    match /classes/{id} {
      allow read, write: if request.auth != null;
    }
  }
}`}</pre>
      </Card>

      {/* Save button + status */}
      <div className="flex items-start gap-4 flex-wrap">
        <button onClick={persist} disabled={saving}
          className="rounded-xl bg-red-600 text-white px-6 py-2.5 text-[13.5px] font-medium hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50">
          {saving ? 'Saving…' : 'Save all changes'}
        </button>
        <button
          onClick={() => {
            if (confirm('Reset all site config to factory defaults? This will clear localStorage and cannot be undone.')) {
              localStorage.removeItem('attendly_site_config');
              window.location.reload();
            }
          }}
          className="rounded-xl border border-ink/10 dark:border-white/10 px-4 py-2.5 text-[12px] text-ink-mute dark:text-white/50 hover:text-ink dark:hover:text-cream-50 hover:border-ink/20 dark:hover:border-white/20 transition-all"
        >
          Reset to defaults
        </button>
        {savedMsg && <span className="text-[13px] text-green-600 dark:text-green-400 mt-2">{savedMsg}</span>}
        {saveError && (
          <div className={`flex-1 rounded-lg px-4 py-2 text-[12px] whitespace-pre-wrap ${
            saveError.startsWith('Saved locally')
              ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 text-amber-800 dark:text-amber-300'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400'
          }`}>
            {saveError}
          </div>
        )}
      </div>
    </div>
  );
}

function CreateUserForm() {
  const [form, setForm] = useState({ institutionId: '', email: '', fullName: '', role: 'ADMIN' });
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm((c) => ({ ...c, [k]: v }));

  const create = async () => {
    if (!form.email || !form.fullName) return;
    setSaving(true);
    try {
      const { createPendingUser } = require('@/lib/firestore-db');
      await createPendingUser({
        email: form.email, displayName: form.fullName,
        role: form.role.toLowerCase() as import('@/lib/firestore-db').UserRole,
        institutionId: form.institutionId || undefined,
      });
      setForm({ institutionId: '', email: '', fullName: '', role: 'ADMIN' });
      setStatus('Pending user created. They get this role on next sign-in.');
    } catch (e: unknown) {
      setStatus('Error: ' + (e instanceof Error ? e.message : String(e)));
    }
    setSaving(false);
    setTimeout(() => setStatus(''), 6000);
  };

  return (
    <div className="space-y-3">
      <p className="text-[12px] text-ink-mute">
        Creates a pending record — the user gets this role the next time they sign in with this email address.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Institution ID (blank = global)" value={form.institutionId} onChange={set('institutionId')} placeholder="Firestore doc ID" />
        <div>
          <label className="block text-[11px] tracking-wide text-ink-mute mb-1">Role</label>
          <select value={form.role} onChange={(e) => set('role')(e.target.value)}
            className="w-full text-[13px] text-ink bg-cream-100 border border-ink/10 rounded-lg px-3 py-2 focus:outline-none">
            {['INSTITUTION', 'ADMIN', 'TEACHER', 'STUDENT'].map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <Field label="Email" value={form.email} onChange={set('email')} type="email" />
        <Field label="Full name" value={form.fullName} onChange={set('fullName')} />
      </div>
      <button onClick={create} disabled={saving || !form.email || !form.fullName}
        className="rounded-lg bg-ink text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-ink/80 transition-all disabled:opacity-50">
        {saving ? 'Creating…' : 'Create pending user'}
      </button>
      {status && <p className="text-[11px] text-ink-mute font-mono">{status}</p>}
    </div>
  );
}

function CreateInstitutionForm() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [type, setType] = useState('school');
  const [status, setStatus] = useState('');
  const [statusKind, setStatusKind] = useState<'ok' | 'err' | 'limit'>('ok');
  const [saving, setSaving] = useState(false);

  const create = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const { createInstitution, getOwnedInstitution } = require('@/lib/firestore-db');
      if (user) {
        const existing = await getOwnedInstitution(user.uid);
        if (existing) {
          const subject = encodeURIComponent('Additional institution request');
          const body = encodeURIComponent(`Hi,\n\nI'd like to add another institution.\n\nCurrent: ${existing.name} (${existing.id})\n\nThanks!`);
          setStatus(`Free plan allows 1 institution. <a href="mailto:hello@attendly.app?subject=${subject}&body=${body}" class="underline text-accent">Contact us</a> to add more.`);
          setStatusKind('limit');
          setSaving(false);
          return;
        }
      }
      const id = await createInstitution({ name: name.trim(), type }, user?.uid);
      setName('');
      setStatus(`Institution created! ID: ${id}`);
      setStatusKind('ok');
    } catch (e: unknown) {
      setStatus('Error: ' + (e instanceof Error ? e.message : String(e)));
      setStatusKind('err');
    }
    setSaving(false);
    setTimeout(() => setStatus(''), 10000);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Institution name" value={name} onChange={setName} className="col-span-2" />
        <div>
          <label className="block text-[11px] tracking-wide text-ink-mute mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}
            className="w-full text-[13px] text-ink bg-cream-100 border border-ink/10 rounded-lg px-3 py-2 focus:outline-none">
            {['school','college','coaching','corporate','other'].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <p className="text-[11.5px] text-ink-mute">A unique join code is generated automatically.</p>
      <button onClick={create} disabled={saving || !name.trim()}
        className="rounded-lg bg-ink text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-ink/80 transition-all disabled:opacity-50">
        {saving ? 'Creating…' : 'Create institution'}
      </button>
      {status && (
        <p className={`text-[11px] font-mono ${statusKind === 'err' ? 'text-red-500' : statusKind === 'limit' ? 'text-amber-600 dark:text-amber-400' : 'text-ink-mute'}`}
          dangerouslySetInnerHTML={{ __html: status }} />
      )}
    </div>
  );
}
