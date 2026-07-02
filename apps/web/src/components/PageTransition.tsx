'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

const BASE_PATH = '/qr-attendance';

function stripBase(href: string): string {
  if (href.startsWith(BASE_PATH)) {
    const stripped = href.slice(BASE_PATH.length);
    return stripped || '/';
  }
  return href;
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Fade IN on mount or route change
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform' },
    );
  }, [pathname]);

  // Intercept link clicks — fade OUT then use Next.js router (no full reload)
  // IMPORTANT: Strip basePath from href before router.push — Next.js adds it automatically.
  // Without this, every click double-applies the basePath → 404.
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
        anchor.target === '_blank'
      ) return;

      e.preventDefault();
      const route = stripBase(rawHref);
      gsap.to(el, {
        opacity: 0,
        y: -8,
        duration: 0.28,
        ease: 'power2.in',
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
