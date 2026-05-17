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
  { href: '#solution',   label: 'Solution' },
  { href: '#features',   label: 'Features' },
  { href: '#security',   label: 'Security' },
  { href: '#dashboard',  label: 'Dashboard' },
  { href: '#pricing',    label: 'Pricing' },
];

function SunIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>; }
function MoonIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>; }
function AutoIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="12" cy="12" r="9"/><path d="M12 3v9l4 4"/></svg>; }

function ThemeToggle({ compact }: { compact?: boolean }) {
  const { mode, setMode } = useTheme();
  const options: { m: 'light' | 'auto' | 'dark'; icon: React.ReactNode; label: string }[] = [
    { m: 'light', icon: <SunIcon />,  label: 'Light mode' },
    { m: 'auto',  icon: <AutoIcon />, label: 'Auto (time of day)' },
    { m: 'dark',  icon: <MoonIcon />, label: 'Dark mode' },
  ];
  return (
    <div className={cn('flex items-center rounded-lg border border-ink/10 dark:border-white/10 overflow-hidden', compact && 'flex-1')} role="group" aria-label="Theme">
      {options.map(({ m, icon, label }) => (
        <button key={m} onClick={() => setMode(m)} aria-label={label} aria-pressed={mode === m}
          className={cn('flex items-center justify-center transition-all duration-200',
            compact ? 'flex-1 py-2 gap-1.5 text-[12px]' : 'w-7 h-7',
            mode === m
              ? 'bg-ink dark:bg-white/15 text-cream-50 dark:text-white'
              : 'text-ink-mute hover:text-ink dark:hover:text-white hover:bg-cream-100 dark:hover:bg-white/5'
          )}>
          {icon}
          {compact && <span>{m.charAt(0).toUpperCase() + m.slice(1)}</span>}
        </button>
      ))}
    </div>
  );
}

function MobileUserHeader() {
  const { user, role } = useAuth();
  if (!user) return null;
  const initials = user.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : (user.email?.[0] ?? '?').toUpperCase();
  return (
    <div className="flex items-center gap-3 pb-4 mb-2 border-b border-ink/8 dark:border-white/8">
      {user.photoURL ? (
        <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
      ) : (
        <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[14px] font-semibold flex-shrink-0">
          {initials}
        </span>
      )}
      <div className="min-w-0">
        <div className="text-[14px] font-medium text-ink dark:text-white truncate">{user.displayName || 'User'}</div>
        {role && (
          <div className="text-[11px] text-ink-mute mt-0.5 capitalize">{role}</div>
        )}
      </div>
    </div>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const { user, role } = useAuth();
  const canAccessAdmin = role && ['developer', 'institution', 'admin', 'teacher'].includes(role);

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
        className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-500', scrolled ? 'py-2' : 'py-5')}
      >
        <div className={cn(
          'container flex items-center justify-between transition-all duration-500',
          scrolled
            ? 'rounded-2xl border border-ink/8 px-5 py-3 max-w-3xl backdrop-blur-xl bg-cream-50/80 shadow-[0_4px_32px_-4px_rgba(11,18,32,0.12)] dark:bg-[#0D0F14]/85 dark:border-white/8 dark:shadow-[0_4px_40px_-4px_rgba(0,0,0,0.6),0_0_0_1px_rgba(240,237,230,0.07)]'
            : '',
        )}>
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo />
            <span className="font-display text-[1.25rem] leading-none tracking-tight">Attendly</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] tracking-wide text-ink-mute">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className="relative py-1 hover:text-ink dark:hover:text-white/90 transition-colors duration-200 after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Desktop theme toggle */}
            <div className="hidden md:flex">
              <ThemeToggle />
            </div>

            {/* Desktop: UserMenu or Sign in */}
            {user ? (
              <div className="hidden md:flex">
                <UserMenu />
              </div>
            ) : (
              <AuthModal trigger={
                <button className="hidden md:block text-[12.5px] tracking-wide text-ink-mute hover:text-ink dark:hover:text-white/90 transition-colors">
                  Sign in
                </button>
              } />
            )}

            <Link
              href="#pricing"
              className="hidden md:block rounded-xl bg-ink dark:bg-[#1A2236] px-4 py-2 text-[12.5px] font-medium tracking-wide text-cream-50 hover:bg-ink-soft dark:hover:bg-[#222c3e] dark:border dark:border-white/15 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              Request demo
            </Link>

            {/* Mobile: avatar preview + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              {user && (
                <Link href="/profile">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[11px] font-semibold">
                      {(user.displayName?.[0] ?? user.email?.[0] ?? '?').toUpperCase()}
                    </span>
                  )}
                </Link>
              )}
              <button
                ref={hamburgerRef}
                className="flex flex-col gap-1.5 p-1"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                <span className={cn('block h-px w-5 bg-ink dark:bg-[#F0EDE6] transition-all duration-300', menuOpen && 'rotate-45 translate-y-2')} />
                <span className={cn('block h-px w-5 bg-ink dark:bg-[#F0EDE6] transition-all duration-300', menuOpen && 'opacity-0')} />
                <span className={cn('block h-px w-5 bg-ink dark:bg-[#F0EDE6] transition-all duration-300', menuOpen && '-rotate-45 -translate-y-2')} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      {menuOpen && <div className="fixed inset-0 z-30 md:hidden" onClick={() => setMenuOpen(false)} />}

      {/* Mobile menu */}
      <div
        ref={menuRef}
        className={cn(
          'fixed inset-x-4 z-40 rounded-2xl border border-ink/8 dark:border-white/8 bg-cream-50/95 dark:bg-[#0D0F14]/97 backdrop-blur-xl shadow-lg md:hidden opacity-0 pointer-events-none overflow-y-auto',
          scrolled ? 'top-[72px]' : 'top-[80px]',
          'max-h-[80vh]',
        )}
      >
        <div className="p-5 flex flex-col gap-4">
          {/* Signed-in user header */}
          <MobileUserHeader />

          {/* Dashboard CTA — only if user can access admin */}
          {user && canAccessAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center rounded-xl bg-ink dark:bg-white/10 text-cream-50 dark:text-white py-2.5 text-[13px] font-medium hover:bg-ink-soft dark:hover:bg-white/15 transition-all"
            >
              Open Dashboard
            </Link>
          )}

          {/* Nav links */}
          <nav className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-[15px] text-ink-mute dark:text-white/60 hover:text-ink dark:hover:text-white transition-colors border-b border-ink/6 dark:border-white/6 py-3.5 last:border-0"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Sign in (if not signed in) */}
          {!user && (
            <div className="space-y-2 pt-1">
              <AuthModal trigger={
                <button className="w-full rounded-xl bg-ink dark:bg-white/10 text-cream-50 dark:text-white py-2.5 text-[13px] font-medium hover:bg-ink-soft dark:hover:bg-white/15 transition-all">
                  Sign in with Google
                </button>
              } />
              <Link
                href="#pricing"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center rounded-xl border border-ink/10 dark:border-white/10 text-ink-mute dark:text-white/60 py-2.5 text-[13px] hover:text-ink dark:hover:text-white hover:border-ink/20 transition-all"
              >
                Request demo
              </Link>
            </div>
          )}

          {/* Theme toggle row */}
          <div className="pt-1">
            <div className="text-[11px] text-ink-mute mb-2 uppercase tracking-widest">Appearance</div>
            <ThemeToggle compact />
          </div>
        </div>
      </div>
    </>
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
