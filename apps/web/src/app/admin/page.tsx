'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth, roleAtLeast, type Role } from '@/context/AuthContext';
import { useSiteConfig, type SiteConfig } from '@/context/SiteConfigContext';
import { AuthModal } from '@/components/AuthModal';

// ─── Role metadata ────────────────────────────────────────────────────────────

type Tab =
  | 'overview'
  | 'sessions'
  | 'students'
  | 'reports'
  | 'audit'
  | 'teacher-perms'
  | 'institution'
  | 'god-mode';

const ROLE_META: Record<Role, { label: string; dot: string; access: Tab[] }> = {
  developer: {
    label: 'Developer',
    dot: 'bg-red-500',
    access: ['overview', 'sessions', 'students', 'reports', 'audit', 'teacher-perms', 'institution', 'god-mode'],
  },
  institution: {
    label: 'Institution',
    dot: 'bg-orange-500',
    access: ['overview', 'sessions', 'students', 'reports', 'audit', 'teacher-perms', 'institution'],
  },
  admin: {
    label: 'Admin',
    dot: 'bg-yellow-500',
    access: ['overview', 'sessions', 'students', 'reports', 'audit', 'teacher-perms'],
  },
  teacher: {
    label: 'Teacher',
    dot: 'bg-blue-500',
    access: ['overview', 'sessions'],
  },
  student: {
    label: 'Student',
    dot: 'bg-gray-400',
    access: [],
  },
};

const TAB_LABELS: Record<Tab, string> = {
  'overview': 'Overview',
  'sessions': 'Sessions',
  'students': 'Students',
  'reports': 'Reports',
  'audit': 'Audit Logs',
  'teacher-perms': 'Teacher Perms',
  'institution': 'Institution',
  'god-mode': '⚡ God Mode',
};

// ─── Main shell ───────────────────────────────────────────────────────────────

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
        <Link href="/" className="text-[13px] text-ink-mute hover:text-ink transition-colors">
          ← back to site
        </Link>
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
      {/* Sidebar */}
      <aside className="w-64 border-r border-ink/10 bg-cream-50 p-5 flex flex-col flex-shrink-0">
        <div className="font-display text-[1.4rem] mb-2">Attendly</div>
        {meta && (
          <div className="flex items-center gap-2 mb-8 text-[11px] text-ink-mute">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`} />
            {meta.label}
            {user.displayName && (
              <span className="truncate text-ink/60 ml-1">· {user.displayName.split(' ')[0]}</span>
            )}
          </div>
        )}

        <nav className="flex-1 space-y-0.5">
          {(Object.keys(TAB_LABELS) as Tab[]).map((t) => {
            const allowed = allowedTabs.includes(t);
            const isGodMode = t === 'god-mode';
            return (
              <button
                key={t}
                onClick={() => allowed && setTab(t)}
                disabled={!allowed}
                className={`block w-full text-left px-3 py-2 rounded-md text-[13px] transition-colors ${
                  isGodMode && allowed
                    ? currentTab === t
                      ? 'bg-red-600 text-white font-semibold'
                      : 'text-red-600 hover:bg-red-50 font-medium'
                    : currentTab === t
                    ? 'bg-ink text-cream-50'
                    : allowed
                    ? 'text-ink-mute hover:text-ink hover:bg-cream-100'
                    : 'text-ink/20 cursor-not-allowed'
                }`}
              >
                {TAB_LABELS[t]}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-ink/8 text-[11px] text-ink-mute space-y-2">
          <Link href="/" className="link-line block">← back to site</Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-auto">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="font-display text-[2.4rem]">{TAB_LABELS[currentTab]}</h1>
          {roleAtLeast(role, 'teacher') && (
            <Link
              href="/admin/qr/demo"
              className="rounded-full bg-accent text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-accent/90 transition-all"
            >
              Start QR session
            </Link>
          )}
        </div>

        {currentTab === 'overview'       && <OverviewPanel role={role!} />}
        {currentTab === 'sessions'       && <SessionsPanel />}
        {currentTab === 'students'       && <StudentsPanel />}
        {currentTab === 'reports'        && <ReportsPanel />}
        {currentTab === 'audit'          && <AuditPanel />}
        {currentTab === 'teacher-perms'  && <TeacherPermsPanel />}
        {currentTab === 'institution'    && <InstitutionPanel />}
        {currentTab === 'god-mode'       && <GodModePanel />}
      </main>
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl bg-cream-50 border border-ink/8 ${className}`}>{children}</div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] tracking-[0.18em] uppercase text-ink-mute font-medium mb-4">{children}</h2>
  );
}

function Field({
  label, value, onChange, type = 'text', placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] tracking-wide text-ink-mute mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-[13px] text-ink bg-cream-100 border border-ink/10 rounded-lg px-3 py-2 focus:outline-none focus:border-accent/50 transition-colors"
      />
    </div>
  );
}

function Toggle({ label, checked, onChange, description }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; description?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div className="relative mt-0.5 flex-shrink-0">
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className={`w-9 h-5 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-ink/20'}`} />
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </div>
      <div>
        <div className="text-[13px] text-ink font-medium">{label}</div>
        {description && <div className="text-[11px] text-ink-mute mt-0.5">{description}</div>}
      </div>
    </label>
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
    { l: 'Students', v: '4,182' },
    { l: 'Classes', v: '64' },
    { l: "Today's sessions", v: '37' },
    { l: 'Avg. attendance', v: '88.3%' },
    { l: 'Absent today', v: '486' },
    { l: 'Suspicious scans', v: '12' },
  ];
  const devStats = [
    { l: 'Total institutions', v: '—' },
    { l: 'Total users', v: '—' },
    { l: 'Active sessions', v: '—' },
    { l: 'Site config', v: 'Firestore' },
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
            {devStats.map((s) => (
              <Card key={s.l} className="p-4 border-red-200 bg-red-50/40">
                <div className="text-[10px] tracking-[0.16em] text-red-500 uppercase">{s.l}</div>
                <div className="font-mono text-[1.4rem] mt-1 text-red-700">{s.v}</div>
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

// ─── Students ─────────────────────────────────────────────────────────────────

function StudentsPanel() {
  return <Placeholder name="Students" />;
}

// ─── Reports ─────────────────────────────────────────────────────────────────

function ReportsPanel() {
  return <Placeholder name="Reports" />;
}

// ─── Audit ────────────────────────────────────────────────────────────────────

function AuditPanel() {
  return <Placeholder name="Audit Logs" />;
}

// ─── Teacher Permissions ──────────────────────────────────────────────────────

function TeacherPermsPanel() {
  const permsConfig = [
    { key: 'canCreateSessions',    label: 'Create sessions',      desc: 'Teacher can open new attendance sessions.' },
    { key: 'canEndSessions',       label: 'End sessions',         desc: 'Teacher can close ongoing sessions.' },
    { key: 'canViewAllAttendance', label: 'View all attendance',  desc: 'See every student\'s record in their sessions.' },
    { key: 'canManageStudents',    label: 'Manage students',      desc: 'Add, edit, or suspend student records.' },
    { key: 'canExportReports',     label: 'Export reports',       desc: 'Download CSV/PDF attendance reports.' },
    { key: 'canViewAuditLog',      label: 'View audit log',       desc: 'Access the institution audit trail.' },
    { key: 'canManageClasses',     label: 'Manage classes',       desc: 'Create and edit class/batch/section records.' },
  ];

  const [selected, setSelected] = useState<string>('');
  const [perms, setPerms] = useState<Record<string, boolean>>(
    Object.fromEntries(permsConfig.map((p) => [p.key, p.key === 'canCreateSessions' || p.key === 'canEndSessions' || p.key === 'canViewAllAttendance']))
  );
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="p-6">
        <SectionTitle>Select teacher</SectionTitle>
        <Field
          label="Teacher ID or email"
          value={selected}
          onChange={setSelected}
          placeholder="Search by email…"
        />
        <p className="text-[11px] text-ink-mute mt-2">
          Wire to <code className="font-mono">GET /v1/users/institution?role=TEACHER</code>
        </p>
      </Card>

      <Card className="p-6 space-y-4">
        <SectionTitle>Permissions</SectionTitle>
        <p className="text-[12px] text-ink-mute -mt-2">
          Teachers are sudo-level within sessions by default. Remove rights here to restrict.
        </p>
        {permsConfig.map((p) => (
          <Toggle
            key={p.key}
            label={p.label}
            description={p.desc}
            checked={perms[p.key] ?? false}
            onChange={(v) => setPerms((c) => ({ ...c, [p.key]: v }))}
          />
        ))}
      </Card>

      <button
        onClick={save}
        className="rounded-xl bg-accent text-cream-50 px-6 py-2.5 text-[13.5px] font-medium hover:bg-accent/90 transition-all active:scale-[0.98]"
      >
        {saved ? 'Saved!' : 'Save permissions'}
      </button>
    </div>
  );
}

// ─── Institution Settings ─────────────────────────────────────────────────────

function InstitutionPanel() {
  const [form, setForm] = useState({
    name: '',
    qrRotationSec: '7',
    qrWindowMin: '15',
    lateAfterMin: '10',
    minAttendancePct: '75',
    geofenceM: '100',
  });
  const [saved, setSaved] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm((c) => ({ ...c, [k]: v }));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
        <p className="text-[11px] text-ink-mute">
          Lat/lng are set per-session. This radius is the institution-wide default.
        </p>
      </Card>

      <button
        onClick={save}
        className="rounded-xl bg-accent text-cream-50 px-6 py-2.5 text-[13.5px] font-medium hover:bg-accent/90 transition-all active:scale-[0.98]"
      >
        {saved ? 'Saved!' : 'Save institution settings'}
      </button>
    </div>
  );
}

// ─── God Mode ─────────────────────────────────────────────────────────────────

function GodModePanel() {
  const { config, save } = useSiteConfig();
  const [local, setLocal] = useState<SiteConfig>(config);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const set = useCallback(<K extends keyof SiteConfig>(k: K, v: SiteConfig[K]) => {
    setLocal((c) => ({ ...c, [k]: v }));
  }, []);

  const persist = async () => {
    setSaving(true);
    await save(local);
    setSaving(false);
    setSavedMsg('Changes saved!');
    setTimeout(() => setSavedMsg(''), 2500);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Warning banner */}
      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-[12.5px] text-red-700 flex items-start gap-3">
        <span className="text-red-500 text-lg leading-none">⚡</span>
        <span>
          <strong>God Mode</strong> — changes here affect the entire platform globally. Site config persists to
          Firestore <code className="font-mono text-[11px]">config/site</code>. Feature flag changes take effect immediately.
          System config changes (rate limits, QR TTL) require an API restart.
        </span>
      </div>

      {/* ── Branding ── */}
      <Card className="p-6 space-y-4">
        <SectionTitle>Branding &amp; text</SectionTitle>
        <Field label="Site title" value={local.siteTitle} onChange={(v) => set('siteTitle', v)} />
        <Field label="Tagline" value={local.tagline} onChange={(v) => set('tagline', v)} />
        <Field label="Logo URL" value={local.logoUrl ?? ''} onChange={(v) => set('logoUrl', v || null)} placeholder="https://…" />
        <Field label="Favicon URL" value={local.faviconUrl ?? ''} onChange={(v) => set('faviconUrl', v || null)} placeholder="https://…" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] tracking-wide text-ink-mute mb-1">Primary colour</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={local.primaryColor}
                onChange={(e) => set('primaryColor', e.target.value)}
                className="w-10 h-10 rounded-lg border border-ink/10 cursor-pointer"
              />
              <span className="font-mono text-[13px] text-ink-mute">{local.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-[11px] tracking-wide text-ink-mute mb-1">Accent colour</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={local.accentColor}
                onChange={(e) => set('accentColor', e.target.value)}
                className="w-10 h-10 rounded-lg border border-ink/10 cursor-pointer"
              />
              <span className="font-mono text-[13px] text-ink-mute">{local.accentColor}</span>
            </div>
          </div>
        </div>
        {/* Live preview */}
        <div className="rounded-lg border border-ink/8 p-4 bg-cream-100 space-y-1">
          <div className="font-display text-[1.6rem]" style={{ color: local.primaryColor }}>
            {local.siteTitle}
          </div>
          <div className="text-[13px] text-ink-mute">{local.tagline}</div>
          <button
            className="mt-2 px-4 py-1.5 rounded-lg text-white text-[12px]"
            style={{ background: local.accentColor }}
          >
            Sample button
          </button>
        </div>
      </Card>

      {/* ── Feature Flags ── */}
      <Card className="p-6 space-y-4">
        <SectionTitle>Feature flags</SectionTitle>
        <Toggle
          label="Geofencing"
          description="Reject scans outside the configured radius."
          checked={local.geofencingEnabled}
          onChange={(v) => set('geofencingEnabled', v)}
        />
        <Toggle
          label="Device binding"
          description="Lock each student to one registered device."
          checked={local.deviceBindingEnabled}
          onChange={(v) => set('deviceBindingEnabled', v)}
        />
        <Toggle
          label="App attestation"
          description="Require Play Integrity / DeviceCheck on mobile."
          checked={local.attestationEnabled}
          onChange={(v) => set('attestationEnabled', v)}
        />
        <Toggle
          label="Mock location detection"
          description="Flag and reject spoofed GPS readings."
          checked={local.mockLocationDetection}
          onChange={(v) => set('mockLocationDetection', v)}
        />
        <Toggle
          label="QR token rotation"
          description="Rotate signed tokens on the configured interval."
          checked={local.qrRotationEnabled}
          onChange={(v) => set('qrRotationEnabled', v)}
        />
        <Toggle
          label="Maintenance mode"
          description="Block all API requests with 503. Only Developer can toggle."
          checked={local.maintenanceMode}
          onChange={(v) => set('maintenanceMode', v)}
        />
      </Card>

      {/* ── System Config ── */}
      <Card className="p-6 space-y-4">
        <SectionTitle>System config</SectionTitle>
        <p className="text-[11px] text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          Rate limit and QR changes are persisted to Firestore and applied at next API restart.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <Field
            label="Default QR rotation (sec)"
            value={String(local.defaultQrRotationSec)}
            onChange={(v) => set('defaultQrRotationSec', Number(v))}
            type="number"
          />
          <Field
            label="Login rate limit (req/min)"
            value={String(local.loginRateLimitMax)}
            onChange={(v) => set('loginRateLimitMax', Number(v))}
            type="number"
          />
          <Field
            label="Scan rate limit (req/min)"
            value={String(local.scanRateLimitMax)}
            onChange={(v) => set('scanRateLimitMax', Number(v))}
            type="number"
          />
        </div>
      </Card>

      {/* ── User Management ── */}
      <Card className="p-6 space-y-4">
        <SectionTitle>User management (cross-institution)</SectionTitle>
        <CreateUserForm />
      </Card>

      {/* ── Institutions ── */}
      <Card className="p-6 space-y-4">
        <SectionTitle>Institutions management</SectionTitle>
        <CreateInstitutionForm />
      </Card>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={persist}
          disabled={saving}
          className="rounded-xl bg-red-600 text-white px-6 py-2.5 text-[13.5px] font-medium hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save all changes'}
        </button>
        {savedMsg && <span className="text-[13px] text-green-600">{savedMsg}</span>}
      </div>
    </div>
  );
}

function CreateUserForm() {
  const [form, setForm] = useState({ institutionId: '', email: '', fullName: '', password: '', role: 'ADMIN' });
  const [status, setStatus] = useState('');
  const set = (k: keyof typeof form) => (v: string) => setForm((c) => ({ ...c, [k]: v }));

  const submit = async () => {
    setStatus('Creating…');
    // Wire to POST /v1/users with Bearer token from API
    setTimeout(() => setStatus('Wire to POST /v1/users'), 1000);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Institution ID" value={form.institutionId} onChange={set('institutionId')} placeholder="cuid…" />
        <div>
          <label className="block text-[11px] tracking-wide text-ink-mute mb-1">Role</label>
          <select
            value={form.role}
            onChange={(e) => set('role')(e.target.value)}
            className="w-full text-[13px] text-ink bg-cream-100 border border-ink/10 rounded-lg px-3 py-2 focus:outline-none"
          >
            {['INSTITUTION', 'ADMIN', 'TEACHER', 'STUDENT'].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <Field label="Email" value={form.email} onChange={set('email')} type="email" />
        <Field label="Full name" value={form.fullName} onChange={set('fullName')} />
        <Field label="Password" value={form.password} onChange={set('password')} type="password" />
      </div>
      <button
        onClick={submit}
        className="rounded-lg bg-ink text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-ink/80 transition-all"
      >
        Create user
      </button>
      {status && <p className="text-[11px] text-ink-mute">{status}</p>}
    </div>
  );
}

function CreateInstitutionForm() {
  const [form, setForm] = useState({
    code: '', name: '', slug: '', ownerEmail: '', ownerName: '', ownerPassword: '',
  });
  const [status, setStatus] = useState('');
  const set = (k: keyof typeof form) => (v: string) => setForm((c) => ({ ...c, [k]: v }));

  const submit = async () => {
    setStatus('Creating…');
    setTimeout(() => setStatus('Wire to POST /v1/institutions'), 1000);
  };

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
      <button
        onClick={submit}
        className="rounded-lg bg-ink text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-ink/80 transition-all"
      >
        Create institution
      </button>
      {status && <p className="text-[11px] text-ink-mute">{status}</p>}
    </div>
  );
}
