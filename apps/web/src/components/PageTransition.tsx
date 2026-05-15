'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Fade IN on mount or route change
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', clearProps: 'transform' },
    );
  }, [pathname]);

  // Intercept link clicks — fade OUT before navigation
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      // Only animate real navigations (not hash links, external, or target=_blank)
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('http') ||
        anchor.target === '_blank'
      ) return;

      e.preventDefault();
      gsap.to(el, {
        opacity: 0,
        y: -10,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          window.location.href = href;
        },
      });
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
