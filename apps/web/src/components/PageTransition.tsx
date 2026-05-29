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
  const mark = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Fade IN content + lift the curtain away on mount / route change.
  useEffect(() => {
    const el = ref.current;
    const c = curtain.current;
    if (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.18, clearProps: 'transform' },
      );
    }
    if (c) {
      // Reveal: the covering curtain sweeps up and away from the top edge.
      gsap.set(mark.current, { opacity: 0, scale: 0.6, rotate: -8 });
      gsap.set(bar.current, { opacity: 0 });
      gsap.timeline()
        .to(mark.current, { opacity: 1, scale: 1, rotate: 0, duration: 0.28, ease: 'back.out(2)' }, 0)
        .to(mark.current, { opacity: 0, scale: 0.8, duration: 0.25, ease: 'power2.in' }, 0.3)
        .fromTo(c,
          { scaleY: 1, transformOrigin: 'top' },
          { scaleY: 0, duration: 0.62, ease: 'power4.inOut',
            onComplete: () => gsap.set(c, { scaleY: 0 }) },
          0.34);
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

      // Cover: a bright bar sweeps across, then the panel grows up to fill.
      gsap.set(mark.current, { opacity: 0, scale: 0.6 });
      gsap.timeline({ onComplete: () => router.push(route) })
        .fromTo(bar.current,
          { opacity: 0, top: '100%' },
          { opacity: 1, top: '0%', duration: 0.34, ease: 'power3.inOut' }, 0)
        .fromTo(c,
          { scaleY: 0, transformOrigin: 'bottom' },
          { scaleY: 1, duration: 0.46, ease: 'power4.inOut' }, 0.06)
        .to(mark.current, { opacity: 1, scale: 1, duration: 0.22, ease: 'back.out(2)' }, 0.34);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  return (
    <>
      <div ref={curtain} aria-hidden className="pt-curtain">
        <div ref={bar} className="pt-curtain__bar" />
        <div ref={mark} className="pt-curtain__mark" />
      </div>
      <div ref={ref} style={{ opacity: 1 }}>
        {children}
      </div>
    </>
  );
}
