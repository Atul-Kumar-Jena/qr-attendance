'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

const links = [
  { href: '#solution', label: 'Solution' },
  { href: '#features', label: 'Features' },
  { href: '#security', label: 'Security' },
  { href: '#dashboard', label: 'Dashboard' },
  { href: '#pricing', label: 'Pricing' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled ? 'py-3' : 'py-6',
      )}
    >
      <div
        className={cn(
          'container flex items-center justify-between transition-all duration-500',
          scrolled && 'rounded-full glass px-5 py-2 max-w-4xl',
        )}
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo />
          <span className="font-display text-[1.35rem] leading-none">Attendly</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-[13px] text-ink-mute">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="link-line hover:text-ink transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="hidden sm:block text-[13px] link-line text-ink-mute hover:text-ink">
            Sign in
          </Link>
          <Link
            href="#demo"
            className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-cream-50 hover:bg-ink-soft transition-colors"
          >
            Request demo
          </Link>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" className="text-ink" aria-hidden>
      <rect x="0" y="0" width="9" height="9" rx="1.5" fill="currentColor" />
      <rect x="13" y="0" width="9" height="9" rx="1.5" fill="currentColor" />
      <rect x="0" y="13" width="9" height="9" rx="1.5" fill="currentColor" />
      <rect x="15" y="15" width="7" height="7" rx="1.5" fill="#FF6B3D" />
    </svg>
  );
}
