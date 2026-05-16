'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAuth, roleAtLeast, ROLE_WEIGHT, type Role } from '@/context/AuthContext';
import { useSiteConfig, type SiteConfig, type PricingMode } from '@/context/SiteConfigContext';
import { AuthModal } from '@/components/AuthModal';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab =
  | 'overview'
  | 'sessions'
  | 'students'
  | 'reports'
  | 'audit'
  | 'manage-users'
  | 'teacher-perms'
  | 'institution'
  | 'god-mode';

const ROLE_META: Record<Role, { label: string; dot: string; access: Tab[] }> = {
  developer: {
    label: 'Developer',
    dot: 'bg-red-500',
    access: ['overview', 'sessions', 'students', 'reports', 'audit', 'manage-users', 'teacher-perms', 'institution', 'god-mode'],
  },
  institution: {
    label: 'Institution',
    dot: 'bg-orange-500',
    access: ['overview', 'sessions', 'students', 'reports', 'audit', 'manage-users', 'teacher-perms', 'institution'],
  },
  admin: {
    label: 'Admin',
    dot: 'bg-yellow-500',
    access: ['overview', 'sessions', 'students', 'reports', 'audit', 'manage-users', 'teacher-perms'],
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
  'overview':     'Overview',
  'sessions':     'Sessions',
  'students':     'Students',
  'reports':      'Reports',
  'audit':        'Audit Logs',
  'manage-users': 'Manage Users',
  'teacher-perms':'Teacher Perms',
  'institution':  'Institution',
  'god-mode':     '⚡ God Mode',
};

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function AdminHome() {
  const { user, role, loading } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');

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
      <aside className="w-64 border-r border-ink/10 bg-cream-50 p-5 flex flex-col flex-shrink-0">
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
            return (
              <button key={t} onClick={() => allowed && setTab(t)} disabled={!allowed}
                className={`block w-full text-left px-3 py-2 rounded-md text-[13px] transition-colors ${
                  isGod && allowed
                    ? currentTab === t ? 'bg-red-600 text-white font-semibold' : 'text-red-600 hover:bg-red-50 font-medium'
                    : currentTab === t ? 'bg-ink text-cream-50'
                    : allowed ? 'text-ink-mute hover:text-ink hover:bg-cream-100'
                    : 'text-ink/20 cursor-not-allowed'
                }`}
              >
                {TAB_LABELS[t]}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-ink/8 text-[11px] text-ink-mute">
          <Link href="/" className="link-line block">← back to site</Link>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-auto">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="font-display text-[2.4rem]">{TAB_LABELS[currentTab]}</h1>
          {roleAtLeast(role, 'teacher') && (
            <Link href="/admin/qr/demo"
              className="rounded-full bg-accent text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-accent/90 transition-all">
              Start QR session
            </Link>
          )}
        </div>

        {currentTab === 'overview'      && <OverviewPanel role={role!} />}
        {currentTab === 'sessions'      && <SessionsPanel />}
        {currentTab === 'students'      && <StudentsPanel role={role!} />}
        {currentTab === 'reports'       && <Placeholder name="Reports" />}
        {currentTab === 'audit'         && <Placeholder name="Audit Logs" />}
        {currentTab === 'manage-users'  && <ManageUsersPanel role={role!} />}
        {currentTab === 'teacher-perms' && <TeacherPermsPanel />}
        {currentTab === 'institution'   && <InstitutionPanel />}
        {currentTab === 'god-mode'      && <GodModePanel />}
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
        <div className={`w-9 h-5 rounded-full transition-colors ${checked ? (danger ? 'bg-red-500' : 'bg-accent') : 'bg-ink/20'}`} />
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

function Placeholder({ name }: { name: string }) {
  return (
    <Card className="p-10 text-center text-ink-mute">
      {name} — wire to <code className="font-mono text-[12px]">/v1/{name.toLowerCase().replace(/ /g, '-')}</code>
    </Card>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function OverviewPanel({ role }: { role: Role }) {
  const stats = [
    { l: 'Students', v: '4,182' }, { l: 'Classes', v: '64' },
    { l: "Today's sessions", v: '37' }, { l: 'Avg. attendance', v: '88.3%' },
    { l: 'Absent today', v: '486' }, { l: 'Suspicious scans', v: '12' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.l} className="p-5">
            <div className="text-[10.5px] tracking-[0.18em] text-ink-mute uppercase">{s.l}</div>
            <div className="font-display text-[2.4rem] leading-none mt-2">{s.v}</div>
          </Card>
        ))}
      </div>
      {roleAtLeast(role, 'developer') && (
        <div>
          <SectionTitle>Global (Developer view)</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Total institutions', 'Total users', 'Active sessions', 'Site config'].map((l) => (
              <Card key={l} className="p-4 border-red-200 bg-red-50/40">
                <div className="text-[10px] tracking-[0.16em] text-red-500 uppercase">{l}</div>
                <div className="font-mono text-[1.4rem] mt-1 text-red-700">—</div>
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
  return <Placeholder name="Sessions" />;
}

// ─── Students + Remarks ───────────────────────────────────────────────────────

interface MockStudent { id: string; rollNo: string; fullName: string; email?: string; klassName?: string; suspended: boolean }

const MOCK_STUDENTS: MockStudent[] = [
  { id: '1', rollNo: 'CS001', fullName: 'Priya Sharma', email: 'priya@inst.edu', klassName: 'CS-A', suspended: false },
  { id: '2', rollNo: 'CS002', fullName: 'Rahul Verma', email: 'rahul@inst.edu', klassName: 'CS-A', suspended: false },
  { id: '3', rollNo: 'CS003', fullName: 'Anita Patel', email: 'anita@inst.edu', klassName: 'CS-B', suspended: true },
];

function StudentsPanel({ role }: { role: Role }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<MockStudent | null>(null);
  const [remarkText, setRemarkText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [remarks, setRemarks] = useState<{ id: string; content: string; isPrivate: boolean; teacher: string; createdAt: string }[]>([]);
  const [remarkSaved, setRemarkSaved] = useState(false);

  const filtered = MOCK_STUDENTS.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  const addRemark = () => {
    if (!remarkText.trim() || !selected) return;
    setRemarks((prev) => [...prev, {
      id: Date.now().toString(), content: remarkText, isPrivate,
      teacher: 'You', createdAt: new Date().toLocaleString(),
    }]);
    setRemarkText('');
    setRemarkSaved(true);
    setTimeout(() => setRemarkSaved(false), 2000);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-14rem)]">
      {/* Student list */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-3">
        <input
          type="text" placeholder="Search name or roll no…"
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full text-[13px] bg-cream-50 border border-ink/10 rounded-lg px-3 py-2 focus:outline-none focus:border-accent/50"
        />
        <Card className="flex-1 overflow-auto p-2 space-y-1">
          {filtered.map((s) => (
            <button key={s.id} onClick={() => setSelected(s)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                selected?.id === s.id ? 'bg-ink text-cream-50' : 'hover:bg-cream-100'
              }`}
            >
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
            <div className="text-[12px] text-ink-mute text-center py-6">No students found</div>
          )}
        </Card>
        <p className="text-[11px] text-ink-mute">
          Wire to <code className="font-mono">GET /v1/students</code>
        </p>
      </div>

      {/* Student detail + remarks */}
      {selected ? (
        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-[1.8rem]">{selected.fullName}</h2>
                <div className="text-[12px] text-ink-mute mt-1">{selected.rollNo} · {selected.email} · {selected.klassName}</div>
              </div>
              {selected.suspended && (
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded-full uppercase tracking-wider">Suspended</span>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-[12px]">
              {[['Attendance', '87%'], ['Sessions', '34'], ['Flagged', '2']].map(([l, v]) => (
                <div key={l} className="bg-cream-100 rounded-lg p-3">
                  <div className="text-ink-mute uppercase tracking-wider text-[10px]">{l}</div>
                  <div className="font-display text-[1.6rem] mt-1">{v}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Remarks */}
          <Card className="p-5 flex-1 flex flex-col gap-4 overflow-auto">
            <SectionTitle>Remarks</SectionTitle>

            <div className="flex-1 overflow-auto space-y-3 min-h-0">
              {remarks.length === 0 && (
                <p className="text-[12px] text-ink-mute">No remarks yet for this student.</p>
              )}
              {remarks.map((r) => (
                <div key={r.id} className={`rounded-lg p-3 text-[13px] ${r.isPrivate ? 'bg-amber-50 border border-amber-200' : 'bg-cream-100'}`}>
                  <div className="text-ink leading-relaxed">{r.content}</div>
                  <div className="flex items-center gap-2 mt-1.5 text-[10.5px] text-ink-mute">
                    <span>{r.teacher}</span>
                    <span>·</span>
                    <span>{r.createdAt}</span>
                    {r.isPrivate && <span className="text-amber-600 font-medium">· private</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Add remark form */}
            <div className="border-t border-ink/8 pt-4 space-y-2">
              <textarea
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder="Add a remark about this student…"
                rows={3}
                className="w-full text-[13px] text-ink bg-cream-100 border border-ink/10 rounded-lg px-3 py-2 focus:outline-none focus:border-accent/50 resize-none"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[12px] text-ink-mute cursor-pointer">
                  <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)}
                    className="accent-accent" />
                  Private (only visible to admin+)
                </label>
                <button onClick={addRemark}
                  className="rounded-lg bg-accent text-cream-50 px-4 py-1.5 text-[12.5px] font-medium hover:bg-accent/90 transition-all">
                  {remarkSaved ? 'Saved!' : 'Add remark'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-ink-mute text-[13px]">
          Select a student to view their profile and add remarks
        </div>
      )}
    </div>
  );
}

// ─── Manage Users ─────────────────────────────────────────────────────────────

type MockUser = { id: string; fullName: string; email: string; role: string; suspended: boolean; createdById?: string }

const MOCK_USERS: MockUser[] = [
  { id: 'u1', fullName: 'Shreya Nair', email: 'shreya@inst.edu', role: 'ADMIN', suspended: false },
  { id: 'u2', fullName: 'Dev Kapoor', email: 'dev@inst.edu', role: 'TEACHER', suspended: false },
  { id: 'u3', fullName: 'Meena Das', email: 'meena@inst.edu', role: 'TEACHER', suspended: true, createdById: 'u1' },
];

function ManageUsersPanel({ role }: { role: Role }) {
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', fullName: '', password: '', role: 'TEACHER' });
  const [status, setStatus] = useState('');

  // Roles this user can assign
  const ALL_ROLES = ['DEVELOPER', 'INSTITUTION', 'ADMIN', 'TEACHER', 'STUDENT'];
  const myLevel = ROLE_WEIGHT[role];
  const assignableRoles = ALL_ROLES.filter((r) => {
    const level: Record<string, number> = { DEVELOPER: 50, INSTITUTION: 40, ADMIN: 30, TEACHER: 20, STUDENT: 10 };
    return level[r] < myLevel;
  });

  const canModify = (target: MockUser) => {
    const level: Record<string, number> = { DEVELOPER: 50, INSTITUTION: 40, ADMIN: 30, TEACHER: 20, STUDENT: 10 };
    if (level[target.role] >= myLevel) return false;
    return true;
  };

  const toggleSuspend = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, suspended: !u.suspended } : u));
  };

  const changeRole = (id: string, newRole: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: newRole } : u));
  };

  const createUser = () => {
    if (!form.email || !form.fullName) return;
    const newUser: MockUser = {
      id: Date.now().toString(), fullName: form.fullName, email: form.email,
      role: form.role, suspended: false, createdById: 'self',
    };
    setUsers((prev) => [...prev, newUser]);
    setForm({ email: '', fullName: '', password: '', role: 'TEACHER' });
    setShowCreate(false);
    setStatus('User created. Wire to POST /v1/users');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-ink-mute">
          You can manage roles and access for users below your privilege level.
          {roleAtLeast(role, 'admin') && ' Admins can create sub-admins who cannot remove their creator.'}
        </p>
        <button onClick={() => setShowCreate(true)}
          className="rounded-xl bg-accent text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-accent/90 transition-all flex-shrink-0 ml-4">
          + Add user
        </button>
      </div>

      {status && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-[12.5px] text-green-700">{status}</div>
      )}

      {/* Create form */}
      {showCreate && (
        <Card className="p-5 space-y-4 border-accent/30">
          <SectionTitle>New user</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full name" value={form.fullName} onChange={(v) => setForm((f) => ({ ...f, fullName: v }))} />
            <Field label="Email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} type="email" />
            <Field label="Password" value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} type="password" />
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
              Create
            </button>
            <button onClick={() => setShowCreate(false)}
              className="rounded-lg border border-ink/10 px-4 py-2 text-[12.5px] text-ink-mute hover:text-ink transition-all">
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* User table */}
      <Card className="overflow-hidden">
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
                <tr key={u.id} className="border-b border-ink/6 last:border-0 hover:bg-cream-100/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium">{u.fullName}</div>
                    <div className="text-[11px] text-ink-mute">{u.email}</div>
                  </td>
                  <td className="px-5 py-3">
                    {editable && editingId === u.id ? (
                      <select
                        value={u.role}
                        onChange={(e) => { changeRole(u.id, e.target.value); setEditingId(null); }}
                        autoFocus
                        onBlur={() => setEditingId(null)}
                        className="text-[12px] bg-cream-100 border border-accent/30 rounded px-2 py-1 focus:outline-none"
                      >
                        {assignableRoles.map((r) => <option key={r}>{r}</option>)}
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge role={u.role} />
                        {editable && (
                          <button onClick={() => setEditingId(u.id)}
                            className="text-ink-mute hover:text-ink transition-colors text-[11px]">
                            ✎
                          </button>
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
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleSuspend(u.id)}
                          className={`text-[11px] px-2 py-1 rounded border transition-colors ${
                            u.suspended ? 'border-green-300 text-green-600 hover:bg-green-50' : 'border-red-300 text-red-500 hover:bg-red-50'
                          }`}>
                          {u.suspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                        <button onClick={() => setUsers((prev) => prev.filter((x) => x.id !== u.id))}
                          className="text-[11px] px-2 py-1 rounded border border-red-300 text-red-500 hover:bg-red-50 transition-colors">
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-ink/30">Protected</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <p className="text-[11px] text-ink-mute">Wire to <code className="font-mono">GET /v1/users/institution</code></p>
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
  const [teacherEmail, setTeacherEmail] = useState('');
  const [perms, setPerms] = useState<Record<string, boolean>>(
    Object.fromEntries(PERM_CONFIG.map((p) => [
      p.key,
      ['canCreateSessions', 'canEndSessions', 'canViewAllAttendance', 'canAddRemarks'].includes(p.key),
    ]))
  );
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="p-6 space-y-3">
        <SectionTitle>Select teacher</SectionTitle>
        <Field label="Teacher email or ID" value={teacherEmail} onChange={setTeacherEmail} placeholder="dev@school.edu" />
        <p className="text-[11px] text-ink-mute">Wire to <code className="font-mono">GET /v1/users/institution?role=TEACHER</code></p>
      </Card>

      <Card className="p-6 space-y-4">
        <SectionTitle>Permissions</SectionTitle>
        <p className="text-[12px] text-ink-mute -mt-2">
          Teachers have sudo-level access within sessions by default. Use this to restrict or grant specific rights.
        </p>
        {PERM_CONFIG.map((p) => (
          <Toggle key={p.key} label={p.label} description={p.desc}
            checked={perms[p.key] ?? false}
            onChange={(v) => setPerms((c) => ({ ...c, [p.key]: v }))} />
        ))}
      </Card>

      <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
        className="rounded-xl bg-accent text-cream-50 px-6 py-2.5 text-[13.5px] font-medium hover:bg-accent/90 transition-all">
        {saved ? 'Saved!' : 'Save permissions'}
      </button>
    </div>
  );
}

// ─── Institution Settings ─────────────────────────────────────────────────────

function InstitutionPanel() {
  const [form, setForm] = useState({
    name: '', qrRotationSec: '7', qrWindowMin: '15',
    lateAfterMin: '10', minAttendancePct: '75', geofenceM: '100',
  });
  const [saved, setSaved] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm((c) => ({ ...c, [k]: v }));

  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="p-6 space-y-4">
        <SectionTitle>Organisation details</SectionTitle>
        <Field label="Institution name" value={form.name} onChange={set('name')} />
      </Card>
      <Card className="p-6 space-y-4">
        <SectionTitle>Attendance rules</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Field label="QR rotation (sec)" value={form.qrRotationSec} onChange={set('qrRotationSec')} type="number" />
          <Field label="Window (min)" value={form.qrWindowMin} onChange={set('qrWindowMin')} type="number" />
          <Field label="Late after (min)" value={form.lateAfterMin} onChange={set('lateAfterMin')} type="number" />
          <Field label="Min. attendance %" value={form.minAttendancePct} onChange={set('minAttendancePct')} type="number" />
        </div>
      </Card>
      <Card className="p-6 space-y-4">
        <SectionTitle>Geofence defaults</SectionTitle>
        <Field label="Default radius (m)" value={form.geofenceM} onChange={set('geofenceM')} type="number" />
      </Card>
      <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
        className="rounded-xl bg-accent text-cream-50 px-6 py-2.5 text-[13.5px] font-medium hover:bg-accent/90 transition-all">
        {saved ? 'Saved!' : 'Save institution settings'}
      </button>
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
  const [showPricingConfirm, setShowPricingConfirm] = useState(false);
  const pendingPricingMode = useRef<PricingMode | null>(null);

  const set = useCallback(<K extends keyof SiteConfig>(k: K, v: SiteConfig[K]) => {
    setLocal((c) => ({ ...c, [k]: v }));
  }, []);

  const handlePricingToggle = (mode: PricingMode) => {
    if (mode === 'PAID' && local.pricingMode === 'LIMITED_OFFER') {
      pendingPricingMode.current = mode;
      setShowPricingConfirm(true);
    } else {
      set('pricingMode', mode);
    }
  };

  const confirmPricingSwitch = () => {
    if (pendingPricingMode.current) {
      set('pricingMode', pendingPricingMode.current);
      pendingPricingMode.current = null;
    }
    setShowPricingConfirm(false);
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
    <div className="space-y-8 max-w-3xl">
      {/* Warning banner */}
      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-[12.5px] text-red-700 flex items-start gap-3">
        <span className="text-red-500 text-lg leading-none flex-shrink-0">⚡</span>
        <span>
          <strong>God Mode</strong> — changes here affect the entire platform globally. Config persists to
          Firestore <code className="font-mono text-[11px]">config/site</code> and localStorage fallback.
        </span>
      </div>

      {/* Pricing mode toggle — prominent */}
      <Card className="p-6 space-y-4 border-amber-200 bg-amber-50/30">
        <SectionTitle>Pricing mode</SectionTitle>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handlePricingToggle('LIMITED_OFFER')}
            className={`flex-1 rounded-xl border-2 py-4 text-[13px] font-medium transition-all ${
              local.pricingMode === 'LIMITED_OFFER'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-ink/10 text-ink-mute hover:border-ink/20'
            }`}
          >
            <div className="text-lg mb-1">🎟️</div>
            <div>Limited offer</div>
            <div className="text-[11px] mt-0.5 opacity-70">Discounted prices shown to everyone</div>
          </button>
          <button
            onClick={() => handlePricingToggle('PAID')}
            className={`flex-1 rounded-xl border-2 py-4 text-[13px] font-medium transition-all ${
              local.pricingMode === 'PAID'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-ink/10 text-ink-mute hover:border-ink/20'
            }`}
          >
            <div className="text-lg mb-1">💳</div>
            <div>Full pricing</div>
            <div className="text-[11px] mt-0.5 opacity-70">All plans charged at full rate</div>
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
      </Card>

      {/* Pricing confirm modal */}
      {showPricingConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm">
          <div className="bg-cream-50 rounded-2xl border border-ink/10 p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="font-display text-[1.6rem] mb-2">End limited offer?</h2>
            <p className="text-[13px] text-ink-mute mb-4">
              Switching to <strong>Full Pricing</strong> will:
            </p>
            <ul className="text-[13px] space-y-1 mb-6 pl-4">
              <li className="list-disc text-ink-mute">Show full prices to all new visitors</li>
              <li className="list-disc text-ink-mute">Flag existing limited-offer subscribers for payment</li>
              <li className="list-disc text-amber-600 font-medium">This cannot be undone without switching back manually</li>
            </ul>
            <div className="flex gap-3">
              <button onClick={confirmPricingSwitch}
                className="flex-1 rounded-xl bg-red-600 text-white py-2.5 text-[13px] font-medium hover:bg-red-700 transition-all">
                Yes, switch to full pricing
              </button>
              <button onClick={() => setShowPricingConfirm(false)}
                className="flex-1 rounded-xl border border-ink/10 py-2.5 text-[13px] text-ink-mute hover:text-ink transition-all">
                Keep limited offer
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

      {/* System config */}
      <Card className="p-6 space-y-4">
        <SectionTitle>System config</SectionTitle>
        <p className="text-[11px] text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          Rate limit changes require API restart. QR rotation default applies to new sessions.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Default QR rotation (sec)" value={String(local.defaultQrRotationSec)}
            onChange={(v) => set('defaultQrRotationSec', Number(v))} type="number" />
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
      <Card className="p-5 border-blue-200 bg-blue-50/30 space-y-2">
        <SectionTitle>Firebase setup — Firestore rules</SectionTitle>
        <p className="text-[12px] text-ink-mute">If you see "missing permissions" when saving, deploy these rules in Firebase Console → Firestore → Rules:</p>
        <pre className="text-[11px] bg-ink text-cream-50 rounded-lg p-4 overflow-x-auto leading-relaxed">{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Config: public read, any authenticated user can write
    match /config/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`}</pre>
        <p className="text-[11px] text-ink-mute">After deploying rules, saving from God Mode will work immediately.</p>
      </Card>

      {/* Save button + status */}
      <div className="flex items-start gap-4">
        <button onClick={persist} disabled={saving}
          className="rounded-xl bg-red-600 text-white px-6 py-2.5 text-[13.5px] font-medium hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50">
          {saving ? 'Saving…' : 'Save all changes'}
        </button>
        {savedMsg && <span className="text-[13px] text-green-600 mt-2">{savedMsg}</span>}
        {saveError && (
          <div className={`flex-1 rounded-lg px-4 py-2 text-[12px] whitespace-pre-wrap ${
            saveError.startsWith('Saved locally')
              ? 'bg-amber-50 border border-amber-200 text-amber-800'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {saveError}
          </div>
        )}
      </div>
    </div>
  );
}

function CreateUserForm() {
  const [form, setForm] = useState({ institutionId: '', email: '', fullName: '', password: '', role: 'ADMIN' });
  const [status, setStatus] = useState('');
  const set = (k: keyof typeof form) => (v: string) => setForm((c) => ({ ...c, [k]: v }));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Institution ID" value={form.institutionId} onChange={set('institutionId')} placeholder="cuid…" />
        <div>
          <label className="block text-[11px] tracking-wide text-ink-mute mb-1">Role</label>
          <select value={form.role} onChange={(e) => set('role')(e.target.value)}
            className="w-full text-[13px] text-ink bg-cream-100 border border-ink/10 rounded-lg px-3 py-2 focus:outline-none">
            {['INSTITUTION', 'ADMIN', 'TEACHER', 'STUDENT'].map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <Field label="Email" value={form.email} onChange={set('email')} type="email" />
        <Field label="Full name" value={form.fullName} onChange={set('fullName')} />
        <Field label="Password" value={form.password} onChange={set('password')} type="password" />
      </div>
      <button onClick={() => setStatus('Wire to POST /v1/users')}
        className="rounded-lg bg-ink text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-ink/80 transition-all">
        Create user
      </button>
      {status && <p className="text-[11px] text-ink-mute">{status}</p>}
    </div>
  );
}

function CreateInstitutionForm() {
  const [form, setForm] = useState({ code: '', name: '', slug: '', ownerEmail: '', ownerName: '', ownerPassword: '' });
  const [status, setStatus] = useState('');
  const set = (k: keyof typeof form) => (v: string) => setForm((c) => ({ ...c, [k]: v }));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Code (e.g. MIT_ENG)" value={form.code} onChange={set('code')} placeholder="INST_CODE" />
        <Field label="Slug (e.g. mit-engineering)" value={form.slug} onChange={set('slug')} />
        <Field label="Institution name" value={form.name} onChange={set('name')} />
        <Field label="Owner email" value={form.ownerEmail} onChange={set('ownerEmail')} type="email" />
        <Field label="Owner full name" value={form.ownerName} onChange={set('ownerName')} />
        <Field label="Owner password" value={form.ownerPassword} onChange={set('ownerPassword')} type="password" />
      </div>
      <button onClick={() => setStatus('Wire to POST /v1/institutions')}
        className="rounded-lg bg-ink text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-ink/80 transition-all">
        Create institution
      </button>
      {status && <p className="text-[11px] text-ink-mute">{status}</p>}
    </div>
  );
}
