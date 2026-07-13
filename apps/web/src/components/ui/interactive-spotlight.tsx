'use client';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type SpotlightProps = {
  className?: string;
  size?: number;
};

/**
 * Cursor-follow spotlight (ibelick-style) without framer-motion — a direct
 * rAF lerp writing transform/opacity, so it adds no heavy dependency to the
 * landing bundle. No-op on touch (no mousemove), so zero mobile cost.
 */
export function InteractiveSpotlight({ className, size = 200 }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // touch → stays hidden

    if (!parent.style.position) parent.style.position = 'relative';
    parent.style.overflow = 'hidden';

    let tx = 0, ty = 0, cx = 0, cy = 0, vis = 0, tvis = 0, raf = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    const onEnter = () => { tvis = 1; };
    const onLeave = () => { tvis = 0; };

    const loop = () => {
      cx = lerp(cx, tx, 0.12);
      cy = lerp(cy, ty, 0.12);
      vis = lerp(vis, tvis, 0.1);
      el.style.transform = `translate3d(${cx - size / 2}px, ${cy - size / 2}px, 0)`;
      el.style.opacity = String(vis);
      raf = requestAnimationFrame(loop);
    };

    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseenter', onEnter);
    parent.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      parent.removeEventListener('mousemove', onMove);
      parent.removeEventListener('mouseenter', onEnter);
      parent.removeEventListener('mouseleave', onLeave);
    };
  }, [size]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        'pointer-events-none absolute left-0 top-0 z-[2] rounded-full blur-2xl opacity-0',
        'bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)]',
        'from-accent/25 via-accent-rose/15 to-transparent',
        className,
      )}
      style={{ width: size, height: size, willChange: 'transform, opacity' }}
    />
  );
}
