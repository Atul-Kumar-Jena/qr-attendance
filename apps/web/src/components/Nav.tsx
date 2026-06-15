'use client';

import React from 'react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import gsap from 'gsap';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { UserMenu } from '@/components/UserMenu';

const links = [
  { href: '#solution', label: 'Solution' },
  { href: '#features', label: 'Features' },
  { href: '#security', label: 'Security' },
  { href: '#dashboard', label: 'Dashboard' },
  { href: '#pricing', label: 'Pricing' },
];

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
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
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 3v9l4 4"/>
    </svg>
  );
}

function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const options: { m: 'light' | 'auto' | 'dark'; icon: React.ReactNode; label: string }[] = [
    { m: 'light', icon: <SunIcon />,  label: 'Light mode' },
    { m: 'auto',  icon: <AutoIcon />, label: 'Auto (time of day)' },
    { m: 'dark',  icon: <MoonIcon />, label: 'Dark mode' },
  ];

  return (
    <div className="flex items-center rounded-lg border border-ink/10 dark:border-white/10 overflow-hidden" role="group" aria-label="Theme">
      {options.map(({ m, icon, label }) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          data-tip={label}
          aria-label={label}
          aria-pressed={mode === m}
          suppressHydrationWarning
          className={`w-7 h-7 flex items-center justify-center transition-all duration-200 ${
            mode === m
              ? 'bg-ink dark:bg-white/15 text-cream-50 dark:text-white'
              : 'text-ink-mute hover:text-ink dark:hover:text-white hover:bg-cream-100 dark:hover:bg-white/5'
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

function UserAvatar() {
  const { user, role } = useAuth();
  if (!user) return null;
  const initials = user.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  return (
    <span className="flex items-center gap-1.5">
      {user.photoURL ? (
        <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
      ) : (
        <span className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[11px] font-medium">
          {initials}
        </span>
      )}
      {role === 'developer' && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 hidden sm:inline">
          Dev
        </span>
      )}
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        hamburgerRef.current && !hamburgerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuRef.current) return;
    if (menuOpen) {
      gsap.fromTo(menuRef.current,
        { opacity: 0, y: -12, pointerEvents: 'none' },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out', pointerEvents: 'auto' },
      );
    } else {
      gsap.to(menuRef.current, { opacity: 0, y: -8, duration: 0.2, ease: 'power2.in', pointerEvents: 'none' });
    }
  }, [menuOpen]);

  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 },
    );
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'py-2' : 'py-4',
        )}
      >
        <div
          className={cn(
            'container relative flex items-center justify-between gap-4 transition-all duration-500',
            scrolled ? 'max-w-3xl px-6 py-3.5' : 'px-6',
          )}
        >
          {/* Pill background — fades in as a single layer to avoid dark-mode rectangle flash */}
          <div
            aria-hidden
            className={cn(
              'absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none',
              scrolled ? 'opacity-100' : 'opacity-0',
              'bg-cream-50/80 dark:bg-[#07140E]/85 backdrop-blur-xl',
              'border border-ink/8 dark:border-white/10',
              'shadow-[0_4px_32px_-4px_rgba(11,18,32,0.12)] dark:shadow-[0_4px_40px_-4px_rgba(0,0,0,0.6),0_0_0_1px_rgba(240,237,230,0.06)]',
            )}
          />

          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-2.5 group flex-shrink-0">
            <Logo />
            <span className="font-display text-[1.25rem] leading-none tracking-tight">Attendly</span>
          </Link>

          {/* Desktop nav */}
          <nav className={cn(
            'relative z-10 hidden md:flex items-center text-[13px] tracking-wide text-ink-mute',
            scrolled ? 'gap-5' : 'gap-7',
          )}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative py-1 whitespace-nowrap hover:text-ink dark:hover:text-white/90 transition-colors duration-200 after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="relative z-10 flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />

            {user ? (
              <div className="hidden sm:flex">
                <UserMenu />
              </div>
            ) : (
              <AuthModal trigger={
                <button className="hidden sm:block text-[12.5px] tracking-wide text-ink-mute hover:text-ink dark:hover:text-white/90 transition-colors">
                  Sign in
                </button>
              } />
            )}

            <Link
              href="#pricing"
              className="rounded-xl bg-ink dark:bg-[#13261B] px-4 py-2 text-[12.5px] font-medium tracking-wide text-cream-50 hover:bg-ink-soft dark:hover:bg-[#1A3324] dark:border dark:border-white/15 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              Request demo
            </Link>

            <button
              ref={hamburgerRef}
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span className={cn('block h-px w-5 bg-ink dark:bg-[#F0EDE6] transition-all duration-300', menuOpen && 'rotate-45 translate-y-2')} />
              <span className={cn('block h-px w-5 bg-ink dark:bg-[#F0EDE6] transition-all duration-300', menuOpen && 'opacity-0')} />
              <span className={cn('block h-px w-5 bg-ink dark:bg-[#F0EDE6] transition-all duration-300', menuOpen && '-rotate-45 -translate-y-2')} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && <div className="fixed inset-0 z-30 md:hidden" onClick={() => setMenuOpen(false)} />}

      <div
        ref={menuRef}
        className={cn(
          'fixed inset-x-4 z-40 rounded-2xl border border-ink/8 dark:border-white/10',
          'bg-cream-50/95 dark:bg-[#07140E]/95 backdrop-blur-xl shadow-lg md:hidden opacity-0 pointer-events-none',
          'max-h-[85vh] overflow-y-auto',
          scrolled ? 'top-[72px]' : 'top-[80px]',
        )}
      >
        <MobileMenuContents onClose={() => setMenuOpen(false)} />
      </div>
    </>
  );
}

function MobileMenuContents({ onClose }: { onClose: () => void }) {
  const { user, role, signOut } = useAuth();
  const canAccessAdmin = role && ['developer', 'institution', 'admin', 'teacher'].includes(role);
  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.[0] ?? '?').toUpperCase();

  return (
    <div className="p-5 space-y-4">
      {/* User header — when signed in */}
      {user && (
        <div className="rounded-xl border border-ink/8 dark:border-white/10 bg-ink/3 dark:bg-white/4 p-3.5 flex items-center gap-3">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[13px] font-semibold">{initials}</span>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-medium text-ink dark:text-cream-50 truncate">{user.displayName || 'User'}</div>
            <div className="text-[11.5px] text-ink-mute truncate">{user.email}</div>
          </div>
          {role && (
            <span className={cn(
              'text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0',
              role === 'developer'   && 'bg-red-500/15 text-red-400 border-red-500/25',
              role === 'institution' && 'bg-orange-500/15 text-orange-400 border-orange-500/25',
              role === 'admin'       && 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/25',
              role === 'teacher'     && 'bg-blue-500/15 text-blue-400 border-blue-500/25',
              role === 'student'     && 'bg-green-500/15 text-green-400 border-green-500/25',
            )}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          )}
        </div>
      )}

      {/* Dashboard CTA — when signed in and has access */}
      {user && canAccessAdmin && (
        <Link
          href="/admin"
          onClick={onClose}
          className="flex items-center justify-center gap-2 rounded-xl bg-accent text-cream-50 px-4 py-3 text-[13px] font-medium hover:bg-accent/90 transition-colors"
        >
          🛠 Open dashboard
        </Link>
      )}

      {/* Section nav */}
      <nav className="flex flex-col">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClose}
            className="text-[14.5px] text-ink dark:text-[#F0EDE6] hover:text-accent dark:hover:text-accent transition-colors border-b border-ink/6 dark:border-white/8 py-3 last:border-0"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Sign in / Profile / Sign out actions */}
      {user ? (
        <div className="flex gap-2">
          <Link
            href="/profile"
            onClick={onClose}
            className="flex-1 rounded-xl border border-ink/15 dark:border-white/15 px-4 py-2.5 text-[12.5px] text-center text-ink dark:text-cream-50/90 hover:bg-ink/4 dark:hover:bg-white/6 transition-colors"
          >
            Profile
          </Link>
          <button
            onClick={() => { onClose(); signOut(); }}
            className="flex-1 rounded-xl border border-red-500/25 text-red-500 dark:text-red-400 px-4 py-2.5 text-[12.5px] hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Sign out
          </button>
        </div>
      ) : (
        <AuthModal trigger={
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-accent text-cream-50 px-4 py-3 text-[13px] font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
          >
            Sign in with Google
          </button>
        } />
      )}

      {/* Theme toggle row */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-[11px] tracking-[0.18em] uppercase text-ink-mute">Appearance</div>
        <ThemeToggle />
      </div>
    </div>
  );
}

function Logo() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" className="text-ink flex-shrink-0" aria-hidden>
      <rect x="0" y="0" width="9" height="9" rx="2" fill="currentColor" />
      <rect x="13" y="0" width="9" height="9" rx="2" fill="currentColor" />
      <rect x="0" y="13" width="9" height="9" rx="2" fill="currentColor" />
      <rect x="15" y="15" width="7" height="7" rx="2" fill="var(--accent)" />
    </svg>
  );
}
