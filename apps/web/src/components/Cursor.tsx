'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Custom cursor: a small dot + lagging ring that magnetically snaps to
 * any [data-magnetic] element on hover. Hidden on touch devices.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const _dot = dot.current!;
    const _ring = ring.current!;
    gsap.set([_dot, _ring], { xPercent: -50, yPercent: -50 });

    const xToDot = gsap.quickTo(_dot, 'x', { duration: 0.08, ease: 'power3' });
    const yToDot = gsap.quickTo(_dot, 'y', { duration: 0.08, ease: 'power3' });
    const xToRing = gsap.quickTo(_ring, 'x', { duration: 0.9, ease: 'power3' });
    const yToRing = gsap.quickTo(_ring, 'y', { duration: 0.9, ease: 'power3' });

    const onMove = (e: PointerEvent) => {
      xToDot(e.clientX); yToDot(e.clientY);
      xToRing(e.clientX); yToRing(e.clientY);
    };
    window.addEventListener('pointermove', onMove);

    const enters: (() => void)[] = [];
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      const onEnter = () => gsap.to(_ring, { scale: 2.6, duration: 0.4, ease: 'power3.out' });
      const onLeave = () => gsap.to(_ring, { scale: 1, duration: 0.4, ease: 'power3.out' });
      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointerleave', onLeave);
      enters.push(() => {
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointerleave', onLeave);
      });
    });

    return () => {
      window.removeEventListener('pointermove', onMove);
      enters.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-7 w-7 rounded-full border border-ink/30 dark:border-white/25 hidden md:block"
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-ink dark:bg-[#F0EDE6] hidden md:block"
      />
    </>
  );
}
