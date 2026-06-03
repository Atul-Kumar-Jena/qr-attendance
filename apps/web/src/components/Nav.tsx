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

function ThemeToggle({ compact, onDark }: { compact?: boolean; onDark?: boolean }) {
  const { mode, setMode } = useTheme();
  // Static export bakes one mode into the SSR HTML; only reflect the *real*
  // selected mode after mount so the active pill can never flash on the wrong
  // option (page theme itself is already correct via the pre-paint boot script).
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const options: { m: 'light' | 'auto' | 'dark'; icon: React.ReactNode; label: string }[] = [
    { m: 'light', icon: <SunIcon />,  label: 'Light mode' },
    { m: 'auto',  icon: <AutoIcon />, label: 'Auto (time of day)' },
    { m: 'dark',  icon: <MoonIcon />, label: 'Dark mode' },
  ];
  return (
    <div className={cn('flex items-center rounded-lg border overflow-hidden transition-colors', onDark ? 'border-white/20' : 'border-ink/10 dark:border-white/10', compact && 'flex-1')} role="group" aria-label="Theme">
      {options.map(({ m, icon, label }) => {
        const active = mounted && mode === m;
        return (
          <button key={m} onClick={() => setMode(m)} aria-label={label} aria-pressed={active}
            className={cn('flex items-center justify-center transition-all duration-200',
              compact ? 'flex-1 py-2 gap-1.5 text-[12px]' : 'w-7 h-7',
              active
                ? (onDark ? 'bg-white/20 text-white' : 'bg-ink dark:bg-white/15 text-cream-50 dark:text-white')
                : (onDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-ink-mute hover:text-ink dark:hover:text-white hover:bg-cream-100 dark:hover:bg-white/5')
            )}>
            {icon}
            {compact && <span>{m.charAt(0).toUpperCase() + m.slice(1)}</span>}
          </button>
        );
      })}
    </div>
  );
}

function MobileSignOutButton({ onClose }: { onClose: () => void }) {
  const { signOut } = useAuth();
  return (
    <button
      onClick={() => { signOut(); onClose(); }}
      className="w-full flex items-center justify-center gap-2 rounded-xl border border-ink/10 dark:border-white/10 text-ink-mute dark:text-white/60 py-2.5 text-[13px] hover:text-red-500 hover:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16,17 21,12 16,7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      Sign out
    </button>
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
  const [active, setActive] = useState('');
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

  // Active-section indicator — highlights the nav link for the section in view.
  useEffect(() => {
    const els = links
      .map((l) => document.getElementById(l.href.replace('#', '')))
      .filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive('#' + e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
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
    const panel = menuRef.current;
    if (!panel) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = panel.querySelectorAll('.menu-item');
    if (menuOpen) {
      if (reduce) {
        gsap.set(panel, { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' });
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(panel,
        { opacity: 0, y: -12, scale: 0.985, pointerEvents: 'none' },
        { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: 'power3.out', pointerEvents: 'auto' },
      );
      gsap.fromTo(items,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.05, delay: 0.06 },
      );
    } else {
      gsap.to(panel, { opacity: 0, y: -8, scale: 0.99, duration: 0.2, ease: 'power2.in', pointerEvents: 'none' });
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
        className={cn('fixed inset-x-0 top-0 z-50', scrolled ? 'py-2' : 'py-5')}
        style={{ transition: 'padding 380ms cubic-bezier(0.4,0,0.2,1)' }}
      >
        <div className={cn(
          // nav-pill class is ALWAYS applied; CSS keeps it transparent until
          // scrolled. Only background / shadow / padding transition — never
          // border-width, which was causing a 1px white outline flash in dark
          // mode during the transition.
          'nav-pill container flex items-center justify-between gap-4 rounded-2xl backdrop-blur-xl',
          scrolled
            ? 'nav-pill-scrolled px-4 lg:px-6 py-3 max-w-5xl'
            : 'px-4 lg:px-6 py-3',
        )}>
          <Link href="/" className={cn('flex items-center gap-2.5 group transition-colors', scrolled ? 'text-ink dark:text-white' : 'text-white')}>
            <Logo />
            <span className="font-display text-[1.25rem] leading-none tracking-tight">Attendly</span>
          </Link>

          {/* Desktop nav — compresses gap when scrolled */}
          <nav className={cn(
            'hidden md:flex items-center text-[13px] tracking-wide transition-colors',
            scrolled ? 'text-ink-mute gap-5 lg:gap-6' : 'text-white/75 gap-7',
          )}>
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className={cn(
                  'relative py-1 transition-colors duration-200 after:absolute after:left-0 after:bottom-0 after:h-px after:bg-accent after:transition-all after:duration-300 hover:after:w-full',
                  active === l.href
                    ? 'text-accent after:w-full'
                    : 'hover:text-ink dark:hover:text-white/90 after:w-0',
                )}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 md:gap-3">
            {/* Desktop theme toggle */}
            <div className="hidden md:flex">
              <ThemeToggle onDark={!scrolled} />
            </div>

            {/* Desktop: UserMenu or Sign in */}
            {user ? (
              <div className="hidden md:flex">
                <UserMenu />
              </div>
            ) : (
              <AuthModal trigger={
                <button className={cn('hidden md:block text-[12.5px] tracking-wide transition-colors', scrolled ? 'text-ink-mute hover:text-ink dark:hover:text-white/90' : 'text-white/75 hover:text-white')}>
                  Sign in
                </button>
              } />
            )}

            {/* Signed-in: prominent Dashboard CTA. Signed-out: Request demo. */}
            {user && canAccessAdmin ? (
              <Link
                href="/admin"
                className={cn(
                  'hidden md:inline-flex items-center gap-1.5 rounded-xl btn-solid font-medium tracking-wide transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] whitespace-nowrap',
                  scrolled ? 'px-3 py-1.5 text-[12px]' : 'px-4 py-2 text-[12.5px]',
                )}
              >
                Dashboard
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </Link>
            ) : user ? (
              <Link
                href="/admin"
                className={cn(
                  'hidden md:inline-flex items-center gap-1.5 rounded-xl btn-solid font-medium tracking-wide transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] whitespace-nowrap',
                  scrolled ? 'px-3 py-1.5 text-[12px]' : 'px-4 py-2 text-[12.5px]',
                )}
              >
                My Dashboard
              </Link>
            ) : (
              <Link
                href="#pricing"
                className={cn(
                  'hidden md:inline-block rounded-xl font-medium tracking-wide transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] whitespace-nowrap',
                  scrolled
                    ? 'bg-ink dark:bg-[#1A2236] text-cream-50 hover:bg-ink-soft dark:hover:bg-[#222c3e] dark:border dark:border-white/15 px-3 py-1.5 text-[12px]'
                    : 'bg-white/10 border border-white/25 text-white hover:bg-white/15 px-4 py-2 text-[12.5px]',
                )}
              >
                Request demo
              </Link>
            )}

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
                <span className={cn(cn('block h-px w-5 transition-all duration-300', scrolled ? 'bg-ink dark:bg-[#F0EDE6]' : 'bg-white'), menuOpen && 'rotate-45 translate-y-2')} />
                <span className={cn(cn('block h-px w-5 transition-all duration-300', scrolled ? 'bg-ink dark:bg-[#F0EDE6]' : 'bg-white'), menuOpen && 'opacity-0')} />
                <span className={cn(cn('block h-px w-5 transition-all duration-300', scrolled ? 'bg-ink dark:bg-[#F0EDE6]' : 'bg-white'), menuOpen && '-rotate-45 -translate-y-2')} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      {menuOpen && <div className="fixed inset-0 z-30 md:hidden" onClick={() => setMenuOpen(false)} />}

      {/* Mobile menu — elevated surface (not near-black) so every control has
          real contrast in both themes; auto-inverting buttons; staggered items. */}
      <div
        ref={menuRef}
        className={cn(
          'fixed inset-x-4 z-40 rounded-2xl border border-ink/10 dark:border-white/12 bg-cream-50 dark:bg-[#15171d] backdrop-blur-xl shadow-2xl shadow-ink/15 dark:shadow-black/60 md:hidden opacity-0 pointer-events-none overflow-y-auto',
          scrolled ? 'top-[72px]' : 'top-[80px]',
          'max-h-[82vh]',
        )}
      >
        <div className="p-5 flex flex-col gap-4">
          {/* Signed-in user header */}
          <MobileUserHeader />

          {/* Dashboard CTA — every signed-in user gets a dashboard */}
          {user && (
            <div className="menu-item grid grid-cols-2 gap-2">
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="btn-solid block text-center rounded-xl py-3 text-[13px] font-semibold"
              >
                {canAccessAdmin ? 'Dashboard' : 'My Dashboard'}
              </Link>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="btn-outline-soft block text-center rounded-xl py-3 text-[13px] font-medium"
              >
                Profile
              </Link>
            </div>
          )}

          {/* Nav links */}
          <nav className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="menu-item group flex items-center justify-between text-[15px] font-medium text-ink dark:text-white/90 hover:text-ink dark:hover:text-white transition-colors border-b border-ink/8 dark:border-white/10 py-3.5 last:border-0"
              >
                {l.label}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-mute opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden>
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            ))}
          </nav>

          {/* Sign in (if not signed in) */}
          {!user && (
            <div className="menu-item space-y-2 pt-1">
              <AuthModal trigger={
                <button className="btn-solid w-full rounded-xl py-3 text-[13px] font-semibold inline-flex items-center justify-center gap-2">
                  <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M21.35 11.1H12v3.2h5.35c-.25 1.5-1.8 4.4-5.35 4.4-3.2 0-5.8-2.65-5.8-5.9s2.6-5.9 5.8-5.9c1.8 0 3 .77 3.7 1.43l2.5-2.42C16.6 3.9 14.5 3 12 3 6.9 3 2.8 7.1 2.8 12.2S6.9 21.4 12 21.4c5.9 0 8.2-4.15 8.2-6.3 0-.42-.05-.74-.1-1z"/></svg>
                  Sign in with Google
                </button>
              } />
              <Link
                href="#pricing"
                onClick={() => setMenuOpen(false)}
                className="btn-outline-soft block w-full text-center rounded-xl py-3 text-[13px] font-medium"
              >
                Request demo
              </Link>
            </div>
          )}

          {/* Sign out (if signed in) */}
          {user && (
            <div className="menu-item"><MobileSignOutButton onClose={() => setMenuOpen(false)} /></div>
          )}

          {/* Theme toggle row */}
          <div className="menu-item pt-1">
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
    <svg width="20" height="20" viewBox="0 0 22 22" className="flex-shrink-0" aria-hidden>
      <rect x="0" y="0" width="9" height="9" rx="2" fill="currentColor" />
      <rect x="13" y="0" width="9" height="9" rx="2" fill="currentColor" />
      <rect x="0" y="13" width="9" height="9" rx="2" fill="currentColor" />
      <rect x="15" y="15" width="7" height="7" rx="2" fill="var(--accent)" />
    </svg>
  );
}
