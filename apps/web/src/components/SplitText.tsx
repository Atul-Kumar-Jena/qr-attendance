'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { initGSAP } from '@/lib/gsap-init';

interface SplitTextProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p' | 'div';
  className?: string;
  type?: 'words' | 'chars';
  stagger?: number;
  duration?: number;
  start?: string;
}

/**
 * Real GSAP SplitText (free since 3.13) with line-masking. Splits a plain
 * string into words/chars and wipes them up from behind a per-line mask as it
 * scrolls in. SSR-safe (plain text in the markup → SEO), reduced-motion-safe
 * (skips), accessible (SplitText keeps an aria-label), and reverts cleanly.
 */
export function SplitText({
  children,
  as: Tag = 'span',
  className = '',
  type = 'words',
  stagger = 0.06,
  duration = 0.9,
  start = 'top 85%',
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    initGSAP();

    let split: GSAPSplitText | undefined;
    const ctx = gsap.context(() => {
      split = new GSAPSplitText(el, { type: `${type},lines`, mask: 'lines', linesClass: 'split-line' });
      const targets = (type === 'chars' ? split.chars : split.words) ?? [];
      gsap.from(targets, {
        yPercent: 115,
        opacity: 0,
        duration,
        ease: 'expo.out',
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);

    return () => {
      try { split?.revert(); } catch {}
      ctx.revert();
    };
  }, []);

  // @ts-expect-error polymorphic tag
  return <Tag ref={ref} className={className}>{children}</Tag>;
}
