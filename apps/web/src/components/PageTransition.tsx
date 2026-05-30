'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

// Next.js static export sets basePath = '/qr-attendance'. anchor.getAttribute('href')
// already returns the base-prefixed path, but router.push() also prepends it, so we
// strip the base first to avoid a doubled prefix → 404.
const BASE_PATH = '/qr-attendance';
function stripBase(href: string): string {
  if (href.startsWith(BASE_PATH)) {
    const stripped = href.slice(BASE_PATH.length);
    return stripped || '/';
  }
  return href;
}

/**
 * Minimal page transition: a gentle content fade on mount / route change.
 * (The old full-screen curtain wipe has been removed for a simpler start.)
 * Internal links still fade out softly before navigating.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const el = ref.current;
    if (el) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    }
  }, [pathname]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a');
      if (!anchor) return;
      const rawHref = anchor.getAttribute('href');
      if (
        !rawHref ||
        rawHref.startsWith('#') ||
        rawHref.startsWith('http') ||
        rawHref.startsWith('mailto') ||
        rawHref.startsWith('tel') ||
        anchor.target === '_blank'
      ) return;

      const route = stripBase(rawHref);
      e.preventDefault();
      gsap.to(el, {
        opacity: 0, duration: 0.2, ease: 'power2.in',
        onComplete: () => router.push(route),
      });
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  return (
    <div ref={ref} style={{ opacity: 1 }}>
      {children}
    </div>
  );
}
