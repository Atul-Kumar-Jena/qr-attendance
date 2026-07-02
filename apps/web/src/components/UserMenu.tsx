'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, type Role } from '@/context/AuthContext';

const ROLE_BADGES: Record<Role, { label: string; cls: string }> = {
  developer:   { label: 'Developer',   cls: 'bg-red-500/15 text-red-400 border-red-500/25' },
  institution: { label: 'Institution', cls: 'bg-orange-500/15 text-orange-400 border-orange-500/25' },
  admin:       { label: 'Admin',       cls: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/25' },
  teacher:     { label: 'Teacher',     cls: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  student:     { label: 'Student',     cls: 'bg-green-500/15 text-green-400 border-green-500/25' },
};

export function UserMenu() {
  const { user, role, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!user) return null;

  const initials = user.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (user.email?.[0] ?? '?').toUpperCase();

  const badge = role ? ROLE_BADGES[role] : null;
  const canAccessAdmin = role && ['developer', 'institution', 'admin', 'teacher'].includes(role);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 rounded-full hover:opacity-80 transition-opacity"
        aria-label="Account menu"
        aria-expanded={open}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-ink/10 dark:ring-white/15" />
        ) : (
          <span className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[11px] font-semibold ring-2 ring-ink/10 dark:ring-white/15">
            {initials}
          </span>
        )}
        {badge && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border hidden sm:inline ${badge.cls}`}>
            {badge.label}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-ink/10 dark:border-white/10 bg-cream-50 dark:bg-[#13161D] shadow-2xl overflow-hidden z-[99990] animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User info */}
          <div className="px-4 py-3 border-b border-ink/8 dark:border-white/8">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <span className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[13px] font-semibold">
                  {initials}
                </span>
              )}
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-ink dark:text-cream-50 truncate">
                  {user.displayName || 'User'}
                </div>
                <div className="text-[11px] text-ink-mute truncate">{user.email}</div>
              </div>
            </div>
            {badge && (
              <span className={`mt-2 inline-flex text-[10px] px-2 py-0.5 rounded-full border ${badge.cls}`}>
                {badge.label}
              </span>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link href="/profile" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-ink dark:text-cream-50/90 hover:bg-ink/4 dark:hover:bg-white/6 transition-colors">
              <span className="text-base">👤</span> Profile
            </Link>
            {canAccessAdmin && (
              <Link href="/admin" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-ink dark:text-cream-50/90 hover:bg-ink/4 dark:hover:bg-white/6 transition-colors">
                <span className="text-base">🛠</span> Dashboard
              </Link>
            )}
          </div>

          <div className="border-t border-ink/8 dark:border-white/8 py-1">
            <button onClick={() => { setOpen(false); signOut(); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <span className="text-base">↩</span> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
