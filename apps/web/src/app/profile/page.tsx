'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth, type Role } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';

const ROLE_BADGE: Record<Role, { label: string; color: string }> = {
  developer:   { label: 'Developer',   color: 'bg-red-500/15 text-red-400 border border-red-500/25' },
  institution: { label: 'Institution', color: 'bg-orange-500/15 text-orange-400 border border-orange-500/25' },
  admin:       { label: 'Admin',       color: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25' },
  teacher:     { label: 'Teacher',     color: 'bg-blue-500/15 text-blue-400 border border-blue-500/25' },
  student:     { label: 'Student',     color: 'bg-ink/8 text-ink-mute border border-ink/15 dark:border-white/10' },
};

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}
function AutoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="9"/><path d="M12 3v9l4 4"/>
    </svg>
  );
}

interface InstInfo { name: string; code: string }

export default function ProfilePage() {
  const { user, role, signOut } = useAuth();
  const { mode, setMode } = useTheme();
  const [inst, setInst] = useState<InstInfo | null>(null);
  const [interestCount, setInterestCount] = useState<number | null>(null);
  const [memberSince, setMemberSince] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !db) return;
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as Record<string, unknown>;
      const createdAt = data.createdAt as { toDate?: () => Date } | undefined;
      if (createdAt?.toDate) {
        setMemberSince(new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(createdAt.toDate()));
      }
      if (data.institutionId) {
        getDoc(doc(db!, 'institutions', String(data.institutionId))).then((iSnap) => {
          if (iSnap.exists()) {
            const id = iSnap.data() as Record<string, unknown>;
            setInst({ name: String(id.name || ''), code: String(id.code || '') });
          }
        }).catch(() => {});
      }
    }).catch(() => {});

    if (role === 'developer') {
      const unsub = onSnapshot(collection(db, 'interests'), (snap) => {
        setInterestCount(snap.size);
      });
      return () => unsub();
    }
  }, [user, role]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-cream-50 dark:bg-[#0D0F14]">
        <p className="text-ink-mute text-[14px]">Sign in to view your profile.</p>
        <Link href="/" className="text-accent hover:underline text-[13px]">← Go back</Link>
      </div>
    );
  }

  const initials = user.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : (user.email?.[0] ?? '?').toUpperCase();

  const badge = role ? ROLE_BADGE[role] : null;

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-[#0D0F14] py-12 px-4">
      <div className="max-w-sm mx-auto space-y-4">

        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-ink-mute hover:text-ink dark:hover:text-white transition-colors mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M19 12H5M11 6l-6 6 6 6"/>
          </svg>
          Back to site
        </Link>

        {/* Avatar + identity */}
        <div className="rounded-2xl border border-ink/10 dark:border-white/8 bg-cream-50 dark:bg-[#13161D] p-6">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-16 h-16 rounded-full object-cover flex-shrink-0 ring-2 ring-ink/8 dark:ring-white/8" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[22px] font-semibold flex-shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <div className="font-semibold text-[16px] text-ink dark:text-white truncate">{user.displayName || 'User'}</div>
              <div className="text-[12px] text-ink-mute truncate mt-0.5">{user.email}</div>
              {badge && (
                <span className={`inline-block mt-2 text-[10.5px] px-2.5 py-0.5 rounded-full font-medium ${badge.color}`}>
                  {badge.label}
                </span>
              )}
            </div>
          </div>
          {memberSince && (
            <p className="text-[11px] text-ink-mute mt-4 pt-4 border-t border-ink/8 dark:border-white/8">
              Member since {memberSince}
            </p>
          )}
        </div>

        {/* Institution */}
        <div className="rounded-2xl border border-ink/10 dark:border-white/8 bg-cream-50 dark:bg-[#13161D] p-5">
          <div className="text-[11px] text-ink-mute uppercase tracking-widest mb-3 font-medium">Institution</div>
          {inst ? (
            <div>
              <div className="text-[14px] font-medium text-ink dark:text-white">{inst.name}</div>
              <div className="text-[12px] text-ink-mute mt-1">
                Code: <span className="font-mono font-semibold text-accent">{inst.code}</span>
              </div>
            </div>
          ) : (
            <div className="text-[13px] text-ink-mute">No institution linked.</div>
          )}
        </div>

        {/* Developer stats */}
        {role === 'developer' && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <div className="text-[11px] text-red-400 uppercase tracking-widest mb-3 font-medium">Developer Stats</div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-ink-mute">Interest registrations</span>
              <span className="text-[20px] font-semibold text-ink dark:text-white tabular-nums">
                {interestCount ?? '—'}
              </span>
            </div>
          </div>
        )}

        {/* Appearance */}
        <div className="rounded-2xl border border-ink/10 dark:border-white/8 bg-cream-50 dark:bg-[#13161D] p-5">
          <div className="text-[11px] text-ink-mute uppercase tracking-widest mb-3 font-medium">Appearance</div>
          <div className="flex items-center rounded-xl border border-ink/10 dark:border-white/10 overflow-hidden w-full" role="group" aria-label="Theme">
            {([
              { m: 'light' as const, icon: <SunIcon />, label: 'Light' },
              { m: 'auto' as const,  icon: <AutoIcon />, label: 'Auto' },
              { m: 'dark' as const,  icon: <MoonIcon />, label: 'Dark' },
            ]).map(({ m, icon, label }) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                aria-label={`${label} mode`}
                aria-pressed={mode === m}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] transition-all ${
                  mode === m
                    ? 'bg-ink dark:bg-white/15 text-cream-50 dark:text-white font-medium'
                    : 'text-ink-mute hover:text-ink dark:hover:text-white hover:bg-cream-100 dark:hover:bg-white/5'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="rounded-2xl border border-ink/10 dark:border-white/8 bg-cream-50 dark:bg-[#13161D] p-5 space-y-3">
          {role && ['developer', 'institution', 'admin', 'teacher'].includes(role) && (
            <Link
              href="/admin"
              className="block w-full text-center rounded-xl bg-ink dark:bg-white/10 text-cream-50 dark:text-white py-2.5 text-[13px] font-medium hover:bg-ink-soft dark:hover:bg-white/15 transition-all"
            >
              Open Dashboard
            </Link>
          )}
          <button
            onClick={() => signOut()}
            className="block w-full text-center rounded-xl border border-ink/10 dark:border-white/10 text-ink-mute dark:text-white/60 py-2.5 text-[13px] hover:text-red-500 hover:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
          >
            Sign out
          </button>
        </div>

      </div>
    </div>
  );
}
