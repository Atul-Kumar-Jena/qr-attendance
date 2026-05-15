'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';

type Tab = 'overview' | 'sessions' | 'students' | 'reports' | 'audit' | 'site-config';

const ROLE_META: Record<string, { label: string; dot: string; access: Tab[] }> = {
  developer:  { label: 'Developer',  dot: 'bg-red-500',    access: ['overview','sessions','students','reports','audit','site-config'] },
  sudo_admin: { label: 'Sudo Admin', dot: 'bg-orange-500', access: ['overview','sessions','students','reports','audit','site-config'] },
  admin:      { label: 'Admin',      dot: 'bg-yellow-500', access: ['overview','sessions','students','reports','audit'] },
  enterprise: { label: 'Enterprise', dot: 'bg-green-500',  access: ['overview','sessions','reports'] },
  student:    { label: 'Student',    dot: 'bg-gray-400',   access: [] },
};

/** Admin dashboard shell. Real auth + data hooks live in /lib/api. */
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

  // Not signed in
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

  // Student — redirect / access denied
  if (role === 'student' || !meta || meta.access.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-100 gap-4">
        <div className="text-[2rem] font-display">Access Denied</div>
        <p className="text-ink-mute text-[14px]">Your account does not have admin privileges.</p>
        {meta && (
          <span className={`inline-flex items-center gap-2 text-[12px] px-3 py-1 rounded-full bg-ink/8`}>
            <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        )}
        <Link href="/" className="text-[13px] text-accent hover:underline mt-2">
          ← back to site
        </Link>
      </div>
    );
  }

  // Ensure current tab is accessible
  const allowedTabs = meta.access;
  const currentTab: Tab = allowedTabs.includes(tab) ? tab : allowedTabs[0] as Tab;

  return (
    <div className="min-h-screen flex bg-cream-100">
      <aside className="w-60 border-r border-ink/10 bg-cream-50 p-5 flex flex-col">
        <div className="font-display text-[1.4rem] mb-2">Attendly</div>
        {/* Role badge */}
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
          {((['overview','sessions','students','reports','audit','site-config'] as Tab[])).map((t) => {
            const allowed = allowedTabs.includes(t);
            return (
              <button
                key={t}
                onClick={() => allowed && setTab(t)}
                disabled={!allowed}
                className={`block w-full text-left px-3 py-2 rounded-md text-[13px] capitalize transition-colors ${
                  currentTab === t
                    ? 'bg-ink text-cream-50'
                    : allowed
                    ? 'text-ink-mute hover:text-ink hover:bg-cream-100'
                    : 'text-ink/20 cursor-not-allowed'
                }`}
              >
                {t.replace('-', ' ')}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-ink/8 text-[11px] text-ink-mute space-y-2">
          <Link href="/" className="link-line block">← back to site</Link>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-auto">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="font-display text-[2.4rem] capitalize">{currentTab.replace('-', ' ')}</h1>
          <Link
            href="/admin/qr/demo"
            className="rounded-full bg-accent text-cream-50 px-4 py-2 text-[12.5px] font-medium hover:bg-accent/90 transition-all"
          >
            Start QR session
          </Link>
        </div>

        {currentTab === 'overview' && <Overview />}
        {currentTab === 'sessions' && <Placeholder name="Sessions" />}
        {currentTab === 'students' && <Placeholder name="Students" />}
        {currentTab === 'reports' && <Placeholder name="Reports" />}
        {currentTab === 'audit' && <Placeholder name="Audit" />}
        {currentTab === 'site-config' && <SiteConfig />}
      </main>
    </div>
  );
}

function Overview() {
  const stats = [
    { l: 'Students', v: '4,182' },
    { l: 'Classes', v: '64' },
    { l: "Today's sessions", v: '37' },
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

/* ─── Site Config ──────────────────────────────────────────────────────────── */
interface HeroConfig {
  headline0: string;
  headline1: string;
  subtext: string;
  badge: string;
  stat1: string;
  stat2: string;
  stat3: string;
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
}

interface SiteConfigState {
  hero: HeroConfig;
  features: Record<string, boolean>;
  pricing: PricingPlan[];
  cta: { headline: string; subheadline: string; button: string };
}

const DEFAULT_CONFIG: SiteConfigState = {
  hero: {
    headline0: 'Attendance that',
    headline1: "can't be fooled.",
    subtext: 'Signed QR tokens rotate every 7 seconds. Device binding, geofencing, and app attestation — built for institutions that demand truth.',
    badge: 'Trusted by institutions across India',
    stat1: '99.7% scan accuracy',
    stat2: '7s token rotation',
    stat3: '< 0.3% false positives',
  },
  features: {
    'QR Token Rotation': true,
    'Device Binding': true,
    'Geofencing': true,
    'App Attestation': true,
    'Live Dashboard': true,
    'Role-based Access': true,
    'Audit Logs': true,
    'Offline Mode': false,
  },
  pricing: [
    { name: 'Starter', price: '₹0', description: 'Up to 200 students, 5 sessions/day' },
    { name: 'Growth', price: '₹2,499', description: 'Up to 2,000 students, unlimited sessions' },
    { name: 'Enterprise', price: 'Custom', description: 'Unlimited, SSO, dedicated support' },
  ],
  cta: {
    headline: 'Stop guessing. Start knowing.',
    subheadline: 'Join institutions that have made attendance fraud a thing of the past.',
    button: 'Request early access',
  },
};

function SiteConfig() {
  const [config, setConfig] = useState<SiteConfigState>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  const save = () => {
    // In production: push to Firestore
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-[12px] text-amber-700">
        Changes here are local until Firebase is configured. Wire to Firestore <code>config/site</code> document to persist.
      </div>

      {/* Hero */}
      <Section title="Hero">
        {(Object.entries(config.hero) as [keyof HeroConfig, string][]).map(([k, v]) => (
          <Field
            key={k}
            label={k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
            value={v}
            onChange={(val) => setConfig(c => ({ ...c, hero: { ...c.hero, [k]: val } }))}
          />
        ))}
      </Section>

      {/* Features */}
      <Section title="Features visibility">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(config.features).map(([k, v]) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer text-[13px] text-ink-mute">
              <input
                type="checkbox"
                checked={v}
                onChange={(e) => setConfig(c => ({ ...c, features: { ...c.features, [k]: e.target.checked } }))}
                className="accent-accent w-4 h-4"
              />
              {k}
            </label>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section title="Pricing plans">
        {config.pricing.map((plan, i) => (
          <div key={i} className="mb-4 p-4 rounded-xl bg-cream-100 border border-ink/8 space-y-2">
            <Field
              label="Plan name"
              value={plan.name}
              onChange={(val) => {
                const updated = [...config.pricing];
                updated[i] = { ...updated[i], name: val };
                setConfig(c => ({ ...c, pricing: updated }));
              }}
            />
            <Field
              label="Price"
              value={plan.price}
              onChange={(val) => {
                const updated = [...config.pricing];
                updated[i] = { ...updated[i], price: val };
                setConfig(c => ({ ...c, pricing: updated }));
              }}
            />
            <Field
              label="Description"
              value={plan.description}
              onChange={(val) => {
                const updated = [...config.pricing];
                updated[i] = { ...updated[i], description: val };
                setConfig(c => ({ ...c, pricing: updated }));
              }}
            />
          </div>
        ))}
      </Section>

      {/* CTA */}
      <Section title="CTA section">
        <Field label="Headline" value={config.cta.headline} onChange={(val) => setConfig(c => ({ ...c, cta: { ...c.cta, headline: val } }))} />
        <Field label="Subheadline" value={config.cta.subheadline} onChange={(val) => setConfig(c => ({ ...c, cta: { ...c.cta, subheadline: val } }))} />
        <Field label="Button text" value={config.cta.button} onChange={(val) => setConfig(c => ({ ...c, cta: { ...c.cta, button: val } }))} />
      </Section>

      <button
        onClick={save}
        className="rounded-xl bg-accent text-cream-50 px-6 py-2.5 text-[13.5px] font-medium hover:bg-accent/90 transition-all active:scale-[0.98]"
      >
        {saved ? 'Saved!' : 'Save changes'}
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-cream-50 border border-ink/8 p-6 space-y-4">
      <h2 className="text-[11px] tracking-[0.18em] uppercase text-ink-mute font-medium">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] tracking-wide text-ink-mute mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-[13px] text-ink bg-cream-100 border border-ink/10 rounded-lg px-3 py-2 focus:outline-none focus:border-accent/50 transition-colors"
      />
    </div>
  );
}
