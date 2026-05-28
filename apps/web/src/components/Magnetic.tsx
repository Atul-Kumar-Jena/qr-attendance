'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Wrap any element to give it a gentle magnetic pull toward the cursor —
 * a classic "Stripe / Awwwards" micro-interaction not common on basic sites.
 */
export function Magnetic({
  children,
  strength = 0.35,
  as: As = 'div',
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'elastic.out(1, 0.4)' });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      xTo((e.clientX - cx) * strength);
      yTo((e.clientY - cy) * strength);
    };
    const onLeave = () => { xTo(0); yTo(0); };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [strength]);

  return (
    // @ts-expect-error - polymorphic
    <As ref={ref} data-magnetic className={className}>{children}</As>
  );
}
