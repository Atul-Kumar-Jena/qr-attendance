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

  const o = variant === 'soft' ? 0.5 : 0.72;

  return (
    <div ref={ref} className={`aurora ${className}`} aria-hidden>
      {on && (
        <>
          <div className="aurora-blob" style={{
            width: '60%', height: '60%', left: '-8%', top: '-12%', opacity: o,
            background: 'radial-gradient(circle at 50% 50%, #4A4A50, transparent 68%)',
            animation: 'auroraDrift1 19s ease-in-out infinite',
          }} />
          <div className="aurora-blob" style={{
            width: '54%', height: '54%', right: '-6%', top: '-4%', opacity: o * 0.92,
            background: 'radial-gradient(circle at 50% 50%, #6E6E76, transparent 68%)',
            animation: 'auroraDrift2 23s ease-in-out infinite',
          }} />
          <div className="aurora-blob" style={{
            width: '58%', height: '58%', left: '22%', bottom: '-20%', opacity: o * 0.85,
            background: 'radial-gradient(circle at 50% 50%, #2A2A2E, transparent 70%)',
            animation: 'auroraDrift3 27s ease-in-out infinite',
          }} />
          <div className="aurora-glass" />
          <div className="aurora-grain" />
        </>
      )}
    </div>
  );
}
