'use client';

import { useEffect, useRef, useState } from 'react';

interface AuroraProps {
  className?: string;
  /** 'hero' = vivid; 'soft' = subtler for showcase sections */
  variant?: 'hero' | 'soft';
}

/**
 * The matte-glass moving-colour field used behind dark sections.
 * Pure CSS transforms (no rAF/canvas) → cheap. Lazy-mounts only when scrolled
 * near, and the global mobile CSS flattens the blur + drift on phones.
 */
export function Aurora({ className = '', variant = 'hero' }: AuroraProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const o = variant === 'soft' ? 0.55 : 0.8;

  // Soft silver-grey flow on near-black (Google "Flow"-style monochrome aurora).
  return (
    <div ref={ref} className={`aurora aurora-${variant} ${className}`} aria-hidden>
      {on && (
        <>
          {/* Soft multi-stop falloffs replace the old live blur + backdrop glass. */}
          <div className="aurora-blob" style={{
            width: '64%', height: '64%', left: '-10%', top: '-14%', opacity: o,
            background: 'radial-gradient(circle at 50% 50%, rgba(156,160,170,0.95) 0%, rgba(112,115,123,0.8) 22%, rgba(76,78,85,0.55) 40%, rgba(76,78,85,0.22) 56%, rgba(76,78,85,0.06) 66%, rgba(76,78,85,0) 73%)',
            animation: 'auroraDrift1 19s ease-in-out infinite',
          }} />
          <div className="aurora-blob" style={{
            width: '56%', height: '56%', right: '-8%', top: '-6%', opacity: o * 0.9,
            background: 'radial-gradient(circle at 50% 50%, rgba(194,198,206,0.95) 0%, rgba(140,143,151,0.78) 22%, rgba(90,92,99,0.55) 42%, rgba(90,92,99,0.22) 58%, rgba(90,92,99,0.06) 67%, rgba(90,92,99,0) 74%)',
            animation: 'auroraDrift2 23s ease-in-out infinite',
          }} />
          <div className="aurora-blob" style={{
            width: '60%', height: '60%', left: '24%', bottom: '-22%', opacity: o * 0.8,
            background: 'radial-gradient(circle at 50% 50%, rgba(116,119,127,0.95) 0%, rgba(80,82,88,0.75) 24%, rgba(48,49,55,0.55) 42%, rgba(48,49,55,0.22) 58%, rgba(48,49,55,0.06) 67%, rgba(48,49,55,0) 74%)',
            animation: 'auroraDrift3 27s ease-in-out infinite',
          }} />
          <div className="aurora-glass" />
          <div className="aurora-grain" />
        </>
      )}
    </div>
  );
}
