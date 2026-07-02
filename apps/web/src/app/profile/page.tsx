'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, type Role, ROLE_WEIGHT } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const ROLE_META: Record<Role, { label: string; dot: string; description: string }> = {
  developer:   { label: 'Developer',   dot: 'bg-red-500',    description: 'Full platform access including God Mode' },
  institution: { label: 'Institution', dot: 'bg-orange-500', description: 'Owns and manages an institution' },
  admin:       { label: 'Admin',       dot: 'bg-yellow-500', description: 'Institution admin with full management rights' },
  teacher:     { label: 'Teacher',     dot: 'bg-blue-500',   description: 'Can create sessions and manage students' },
  student:     { label: 'Student',     dot: 'bg-green-500',  description: 'Attends sessions via QR code' },
};

export default function ProfilePage() {
  const { user, role, loading, signOut } = useAuth();
  const { mode, setMode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 dark:bg-[#0D0F14]">
        <div className="w-8 h-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
      </div>
    );
  }

  const meta = role ? ROLE_META[role] : null;
  const initials = user.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (user.email?.[0] ?? '?').toUpperCase();

  const themeModes: { m: 'light' | 'auto' | 'dark'; label: string; icon: string }[] = [
    { m: 'light', label: 'Light', icon: '☀️' },
    { m: 'auto',  label: 'Auto',  icon: '🕐' },
    { m: 'dark',  label: 'Dark',  icon: '🌙' },
  ];

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-[#0D0F14] py-12 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-ink-mute hover:text-ink dark:hover:text-cream-50 transition-colors">
          ← Back to site
        </Link>

        {/* Avatar + name */}
        <div className="rounded-2xl bg-cream-50 dark:bg-[#13161D] border border-ink/8 dark:border-white/8 p-6">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <span className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[1.5rem] font-semibold">
                {initials}
              </span>
            )}
            <div>
              <div className="font-display text-[1.4rem] text-ink dark:text-cream-50">{user.displayName || 'Anonymous'}</div>
              <div className="text-[13px] text-ink-mute">{user.email}</div>
              {meta && (
                <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-ink/6 dark:bg-white/8">
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  {meta.label} · {meta.description}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl bg-cream-50 dark:bg-[#13161D] border border-ink/8 dark:border-white/8 p-6">
          <div className="text-[11px] tracking-wide text-ink-mute uppercase mb-4">Appearance</div>
          <div className="flex gap-2">
            {themeModes.map(({ m, label, icon }) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-[12px] font-medium transition-all border ${
                  mode === m
                    ? 'bg-ink dark:bg-white/15 text-cream-50 dark:text-white border-ink dark:border-white/20'
                    : 'border-ink/10 dark:border-white/10 text-ink-mute hover:text-ink dark:hover:text-cream-50 hover:border-ink/20 dark:hover:border-white/20'
                }`}>
                <div className="text-lg mb-0.5">{icon}</div>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Account info */}
        <div className="rounded-2xl bg-cream-50 dark:bg-[#13161D] border border-ink/8 dark:border-white/8 p-6 space-y-3">
          <div className="text-[11px] tracking-wide text-ink-mute uppercase mb-4">Account</div>
          <div className="flex justify-between text-[13px]">
            <span className="text-ink-mute">UID</span>
            <span className="font-mono text-[11px] text-ink dark:text-cream-50/80 truncate max-w-[180px]">{user.uid}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-ink-mute">Role weight</span>
            <span className="font-mono text-ink dark:text-cream-50/80">{role ? ROLE_WEIGHT[role] : '—'}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-ink-mute">Provider</span>
            <span className="text-ink dark:text-cream-50/80">Google</span>
          </div>
        </div>

        {/* Sign out */}
        <button onClick={() => { signOut(); router.replace('/'); }}
          className="w-full py-3 rounded-2xl border border-red-200 dark:border-red-800/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-[13px] font-medium transition-all">
          Sign out
        </button>
      </div>
    </div>
  );
}
