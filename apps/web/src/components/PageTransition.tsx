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

/**
 * Card-stack page transition. On internal navigation a stack of glass cards
 * slides up to cover the viewport (with the brand mark), the route swaps behind
 * it, then the cards slide away to reveal the new page. Deliberately slow and
 * evident. Falls back to a plain fade for reduced-motion.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  const navigating = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  // Reveal on mount / route change: slide the covering cards away.
  useEffect(() => {
    const el = ref.current;
    const cards = stack.current?.querySelectorAll<HTMLElement>('.pt-card');
    const label = stack.current?.querySelector<HTMLElement>('.pt-card-label');
    if (el) {
      gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform' });
    }
    if (cards && cards.length && navigating.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (stack.current) stack.current.classList.remove('active');
          navigating.current = false;
        },
      });
      tl.to(label as Element, { autoAlpha: 0, duration: 0.2 }, 0)
        .to(cards, { yPercent: -112, duration: 0.62, ease: 'power3.inOut', stagger: 0.08 }, 0.05);
    }
  }, [pathname]);

  // Intercept internal link clicks → play cover, push route, then reveal.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
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

      if (reduce) { router.push(route); return; }

      const cards = stack.current?.querySelectorAll<HTMLElement>('.pt-card');
      const label = stack.current?.querySelector<HTMLElement>('.pt-card-label');
      if (!cards || !cards.length) { router.push(route); return; }

      navigating.current = true;
      stack.current!.classList.add('active');
      gsap.set(cards, { yPercent: 112 });
      gsap.set(label as Element, { autoAlpha: 0, y: 20 });

      const tl = gsap.timeline({ onComplete: () => router.push(route) });
      tl.to(cards, { yPercent: 0, duration: 0.6, ease: 'power3.inOut', stagger: 0.07 }, 0)
        .to(label as Element, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.28);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  return (
    <>
      <div ref={ref} style={{ opacity: 1 }}>
        {children}
      </div>

      {/* Covering card stack */}
      <div id="pt-stack" ref={stack} aria-hidden>
        <div className="pt-card pt-card-3" />
        <div className="pt-card pt-card-2" />
        <div className="pt-card pt-card-1">
          <div className="pt-card-label">
            <span className="iri-text text-[14vw] md:text-[7vw] font-display">Attendly</span>
          </div>
        </div>
      </div>
    </>
  );
}
