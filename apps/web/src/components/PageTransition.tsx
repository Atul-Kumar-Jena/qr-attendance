'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

// Next.js static export sets basePath = '/qr-attendance'.
// anchor.getAttribute('href') already returns '/qr-attendance/admin' (Next.js
// renders it that way in the DOM), but router.push() ALSO prepends basePath.
// Stripping it first prevents double-prefix → /qr-attendance/qr-attendance/admin 404.
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
  const curtain = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Fade IN content + lift the curtain away on mount / route change.
  useEffect(() => {
    const el = ref.current;
    const c = curtain.current;
    if (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform' },
      );
    }
    if (c) {
      // Reveal: curtain (currently covering) slides up and away.
      gsap.fromTo(c,
        { scaleY: 1, transformOrigin: 'top' },
        { scaleY: 0, duration: 0.6, ease: 'power4.inOut',
          onComplete: () => gsap.set(c, { scaleY: 0 }) },
      );
    }
  }, [pathname]);

  // Intercept internal link clicks — curtain wipes UP to cover, then route.
  useEffect(() => {
    const el = ref.current;
    const c = curtain.current;
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

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || !c) {
        gsap.to(el, { opacity: 0, y: -8, duration: 0.24, ease: 'power2.in', onComplete: () => router.push(route) });
        return;
      }

      // Cover: curtain grows from the bottom edge upward.
      gsap.fromTo(c,
        { scaleY: 0, transformOrigin: 'bottom' },
        { scaleY: 1, duration: 0.42, ease: 'power4.inOut', onComplete: () => router.push(route) },
      );
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  return (
    <>
      <div ref={curtain} aria-hidden className="pt-curtain" />
      <div ref={ref} style={{ opacity: 1 }}>
        {children}
      </div>
    </>
  );
}
