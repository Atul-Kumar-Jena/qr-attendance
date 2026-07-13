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
    <div ref={ref} className={`aurora ${className}`} aria-hidden>
      {on && (
        <>
          <div className="aurora-blob" style={{
            width: '64%', height: '64%', left: '-10%', top: '-14%', opacity: o,
            background: 'radial-gradient(circle at 50% 50%, #9CA0AA, #4C4E55 38%, transparent 70%)',
            animation: 'auroraDrift1 19s ease-in-out infinite',
          }} />
          <div className="aurora-blob" style={{
            width: '56%', height: '56%', right: '-8%', top: '-6%', opacity: o * 0.9,
            background: 'radial-gradient(circle at 50% 50%, #C2C6CE, #5A5C63 40%, transparent 72%)',
            animation: 'auroraDrift2 23s ease-in-out infinite',
          }} />
          <div className="aurora-blob" style={{
            width: '60%', height: '60%', left: '24%', bottom: '-22%', opacity: o * 0.8,
            background: 'radial-gradient(circle at 50% 50%, #74777F, #303137 42%, transparent 72%)',
            animation: 'auroraDrift3 27s ease-in-out infinite',
          }} />
          <div className="aurora-glass" />
          <div className="aurora-grain" />
        </>
      )}
    </div>
  );
}
