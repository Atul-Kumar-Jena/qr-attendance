'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { cn } from '@/lib/cn';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { UserMenu } from '@/components/UserMenu';

const links = [
  { href: '#solution', label: 'Problem' },
  { href: '#showcase', label: 'Showcase' },
  { href: '#features', label: 'Features' },
  { href: '#security', label: 'Security' },
  { href: '#pricing', label: 'Pricing' },
];

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function AutoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="9" /><path d="M12 3v9l4 4" />
    </svg>
  );
}

function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const options: { m: 'light' | 'auto' | 'dark'; icon: React.ReactNode; label: string }[] = [
    { m: 'light', icon: <SunIcon />, label: 'Light mode' },
    { m: 'auto', icon: <AutoIcon />, label: 'Auto' },
    { m: 'dark', icon: <MoonIcon />, label: 'Dark mode' },
  ];
  return (
    <div className="flex items-center rounded-full border border-white/10 overflow-hidden" role="group" aria-label="Theme">
      {options.map(({ m, icon, label }) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          data-tip={label}
          aria-label={label}
          aria-pressed={mode === m}
          suppressHydrationWarning
          className={cn(
            'w-7 h-7 flex items-center justify-center transition-all duration-200',
            mode === m ? 'bg-accent text-white' : 'text-ink-mute hover:text-ink',
          )}
        >
          {icon}
        </button>
      ))}
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

/**
 * Bottom fluid-glass dock. On load the glass pill expands from the centre, then
 * its contents fade in — "loads, then expands at the bottom". Thumb-friendly on
 * mobile via an upward sheet.
 */
export function DockNav() {
  const wrap = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(wrap.current, { autoAlpha: 1 });
      const tl = gsap.timeline({ delay: 0.35 });
      tl.fromTo(pill.current,
        { scaleX: 0.18, scaleY: 0.7, autoAlpha: 0, transformOrigin: '50% 50%' },
        { scaleX: 1, scaleY: 1, autoAlpha: 1, duration: 0.85, ease: 'expo.out' })
        .fromTo(content.current!.children,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05 }, '-=0.45');
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Mobile upward sheet */}
      <div
        className={cn(
          'fixed inset-x-3 bottom-[84px] z-[60] md:hidden rounded-3xl glass p-4 origin-bottom transition-all duration-300',
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none',
        )}
      >
        <nav className="flex flex-col">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="py-3 text-[15px] text-ink border-b border-white/8 last:border-0 hover:text-accent transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-3 flex items-center justify-between">
          <ThemeToggle />
          {user ? <UserMenu /> : (
            <AuthModal trigger={<button className="text-[13px] text-ink-mute hover:text-ink transition-colors">Sign in</button>} />
          )}
        </div>
      </div>

      {open && <div className="fixed inset-0 z-[55] md:hidden" onClick={() => setOpen(false)} />}

      {/* The dock */}
      <div ref={wrap} className="fixed bottom-4 md:bottom-6 left-0 right-0 z-[70] flex justify-center px-3 opacity-0">
        <div className="relative">
          <div ref={pill} aria-hidden className="absolute inset-0 rounded-full glass shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]" />
          <div ref={content} className="relative flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-2">
            <Link href="/" className="flex items-center gap-2 pl-1.5 pr-1 md:pr-2">
              <Logo />
              <span className="font-display text-[1.05rem] leading-none tracking-tight hidden sm:block">Attendly</span>
            </Link>

            <span className="hidden md:block h-5 w-px bg-white/10 mx-1" />

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-1 text-[12.5px] text-ink-mute">
              {links.map((l) => (
                <Link key={l.href} href={l.href}
                  className="px-2.5 py-1.5 rounded-full hover:text-ink hover:bg-white/8 transition-colors whitespace-nowrap">
                  {l.label}
                </Link>
              ))}
            </nav>

            <span className="hidden md:block h-5 w-px bg-white/10 mx-1" />

            <div className="hidden md:block"><ThemeToggle /></div>

            {user ? (
              <div className="hidden sm:flex"><UserMenu /></div>
            ) : (
              <AuthModal trigger={
                <button className="hidden md:block px-2.5 text-[12.5px] text-ink-mute hover:text-ink transition-colors">Sign in</button>
              } />
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              className="md:hidden h-9 w-9 grid place-items-center rounded-full hover:bg-white/8 text-ink"
            >
              <span className="relative flex flex-col gap-1">
                <span className={cn('block h-px w-4 bg-current transition-all', open && 'rotate-45 translate-y-[3px]')} />
                <span className={cn('block h-px w-4 bg-current transition-all', open && 'opacity-0')} />
                <span className={cn('block h-px w-4 bg-current transition-all', open && '-rotate-45 -translate-y-[3px]')} />
              </span>
            </button>

            <Link
              href="#pricing"
              className="btn-glass ml-0.5 rounded-full bg-accent px-4 md:px-5 py-2 text-[12.5px] font-medium text-white shadow-[0_10px_30px_-10px_rgba(46,138,92,0.8)] hover:scale-[1.04] active:scale-[0.97] transition-transform whitespace-nowrap"
            >
              Request demo
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
