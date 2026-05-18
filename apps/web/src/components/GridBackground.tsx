'use client';

import { useEffect, useRef } from 'react';

export function GridBackground() {
  const glowRef   = useRef<HTMLDivElement>(null);
  const glowBRef  = useRef<HTMLDivElement>(null); // secondary drifting glow

  useEffect(() => {
    const glow  = glowRef.current;
    const glowB = glowBRef.current;
    if (!glow || !glowB) return;

    let raf = 0;
    let mx = window.innerWidth  * 0.5;
    let my = window.innerHeight * 0.4;
    let cx = mx, cy = my;
    // Secondary glow drifts on its own slow sine path
    let t = 0;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    const tick = () => {
      t += 0.004;
      // Primary glow — lazily follows cursor
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      glow.style.background =
        `radial-gradient(560px circle at ${cx}px ${cy}px,`
        + ` rgba(255,107,61,0.20) 0%,`
        + ` rgba(255,107,61,0.08) 35%,`
        + ` transparent 70%)`;

      // Secondary ambient glow — breathes slowly without cursor
      const bx = window.innerWidth  * (0.7 + 0.08 * Math.sin(t));
      const by = window.innerHeight * (0.3 + 0.06 * Math.cos(t * 0.7));
      glowB.style.background =
        `radial-gradient(700px circle at ${bx}px ${by}px,`
        + ` rgba(100,130,255,0.06) 0%,`
        + ` transparent 65%)`;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
      {/* Grid lines — very faint, ink-tinted */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(11,18,32,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(11,18,32,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />
      {/* Dark mode grid variant */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />
      {/* Primary cursor glow */}
      <div ref={glowRef}  className="absolute inset-0" />
      {/* Secondary ambient glow */}
      <div ref={glowBRef} className="absolute inset-0" />
      {/* Edge vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 90% 60% at 50% 0%, transparent 55%, var(--bg) 100%)',
      }} />
    </div>
  );
}
