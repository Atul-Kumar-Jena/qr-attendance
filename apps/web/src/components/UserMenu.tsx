'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth, type Role } from '@/context/AuthContext';

const ROLE_BADGE: Record<Role, { label: string; color: string }> = {
  developer:   { label: 'Developer',   color: 'bg-red-500/15 text-red-400 border border-red-500/25' },
  institution: { label: 'Institution', color: 'bg-orange-500/15 text-orange-400 border border-orange-500/25' },
  admin:       { label: 'Admin',       color: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25' },
  teacher:     { label: 'Teacher',     color: 'bg-blue-500/15 text-blue-400 border border-blue-500/25' },
  student:     { label: 'Student',     color: 'bg-ink/8 text-ink-mute border border-ink/15' },
};

export function UserMenu() {
  const { user, role, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!user) return null;

  const initials = user.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : (user.email?.[0] ?? '?').toUpperCase();

  const badge = role ? ROLE_BADGE[role] : null;
  const canAccessAdmin = role && ['developer', 'institution', 'admin', 'teacher'].includes(role);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40"
        aria-label="Open account menu"
        aria-expanded={open}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-transparent hover:ring-accent/30 transition-all" />
        ) : (
          <span className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[11px] font-semibold ring-2 ring-transparent hover:ring-accent/30 transition-all">
            {initials}
          </span>
        )}
        {role === 'developer' && (
          <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
            Dev
          </span>
        )}
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-ink/10 dark:border-white/10 bg-cream-50 dark:bg-[#13161D] shadow-xl shadow-ink/10 dark:shadow-black/40 z-[200] overflow-hidden"
          role="menu"
        >
          {/* User header */}
          <div className="px-4 py-3 border-b border-ink/8 dark:border-white/8">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
              ) : (
                <span className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[13px] font-semibold flex-shrink-0">
                  {initials}
                </span>
              )}
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-ink dark:text-white truncate">{user.displayName || 'User'}</div>
                <div className="text-[11px] text-ink-mute truncate">{user.email}</div>
              </div>
            </div>
            {badge && (
              <span className={`mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${badge.color}`}>
                {badge.label}
              </span>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-ink-mute dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-cream-100 dark:hover:bg-white/5 transition-colors"
              role="menuitem"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              Profile
            </Link>

            {canAccessAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-ink-mute dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-cream-100 dark:hover:bg-white/5 transition-colors"
                role="menuitem"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                Dashboard
              </Link>
            )}
          </div>

          <div className="border-t border-ink/8 dark:border-white/8 py-1.5">
            <button
              onClick={() => { signOut(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-ink-mute dark:text-white/60 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              role="menuitem"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
