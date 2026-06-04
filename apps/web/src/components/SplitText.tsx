'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { initGSAP } from '@/lib/gsap-init';

interface SplitTextProps {
  children: string;
  as?: 'h2' | 'h3' | 'span' | 'p' | 'div';
  className?: string;
  by?: 'words' | 'chars';
  stagger?: number;
  /** px rise distance for each unit */
  y?: number;
  start?: string;
}

/**
 * Lightweight SplitText-style reveal (no paid GSAP plugin). Splits a plain
 * string into words (or chars), each in an inline-block span, and staggers a
 * rise + fade as it scrolls in. SEO-safe (real text in the DOM + aria-label),
 * reduced-motion-safe (skips entirely), and transform/opacity-only so it never
 * triggers layout/paint thrash.
 */
export function SplitText({
  children,
  as: Tag = 'span',
  className = '',
  by = 'words',
  stagger = 0.055,
  y = 26,
  start = 'top 85%',
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    initGSAP();
    const parts = el.querySelectorAll<HTMLElement>('[data-rv]');
    if (!parts.length) return;
    const ctx = gsap.context(() => {
      gsap.from(parts, {
        y, opacity: 0, duration: 0.85, ease: 'expo.out', stagger,
        immediateRender: false, // never strands the text hidden
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const units = by === 'chars' ? Array.from(children) : children.split(/(\s+)/);

  return (
    // @ts-expect-error polymorphic tag
    <Tag ref={ref} className={className} aria-label={children}>
      {units.map((u, i) =>
        /^\s+$/.test(u) ? (
          <span key={i} aria-hidden>{u}</span>
        ) : (
          <span key={i} data-rv aria-hidden className="inline-block">{u}</span>
        ),
      )}
    </Tag>
  );
}
