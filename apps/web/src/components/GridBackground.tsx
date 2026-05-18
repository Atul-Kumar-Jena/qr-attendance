'use client';

import { useEffect, useRef } from 'react';

export function GridBackground() {
  const glowRef   = useRef<HTMLDivElement>(null);
  const glowBRef  = useRef<HTMLDivElement>(null); // secondary drifting glow
  const glowCRef  = useRef<HTMLDivElement>(null); // tertiary breathing glow

  useEffect(() => {
    const glow  = glowRef.current;
    const glowB = glowBRef.current;
    const glowC = glowCRef.current;
    if (!glow || !glowB || !glowC) return;

    let raf = 0;
    let mx = window.innerWidth  * 0.5;
    let my = window.innerHeight * 0.4;
    let cx = mx, cy = my;
    let t = 0;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    const tick = () => {
      t += 0.004;
      // Primary cursor glow — soft, multi-stop natural falloff
      cx += (mx - cx) * 0.07;
      cy += (my - cy) * 0.07;
      glow.style.background =
        `radial-gradient(620px circle at ${cx}px ${cy}px,`
        + ` rgba(255,107,61,0.14) 0%,`
        + ` rgba(255,107,61,0.10) 14%,`
        + ` rgba(255,107,61,0.06) 30%,`
        + ` rgba(255,107,61,0.025) 50%,`
        + ` transparent 75%)`;

      // Secondary ambient blue — slow drift, very soft
      const bx = window.innerWidth  * (0.7 + 0.08 * Math.sin(t));
      const by = window.innerHeight * (0.3 + 0.06 * Math.cos(t * 0.7));
      glowB.style.background =
        `radial-gradient(760px circle at ${bx}px ${by}px,`
        + ` rgba(100,130,255,0.05) 0%,`
        + ` rgba(100,130,255,0.025) 35%,`
        + ` transparent 70%)`;

      // Tertiary warm glow — breathes in opposite phase, opposite corner
      const px = window.innerWidth  * (0.18 + 0.06 * Math.cos(t * 0.6));
      const py = window.innerHeight * (0.78 + 0.05 * Math.sin(t * 0.9));
      const breathe = 0.5 + 0.5 * Math.sin(t * 1.6);
      glowC.style.background =
        `radial-gradient(540px circle at ${px}px ${py}px,`
        + ` rgba(255,180,140,${0.025 + 0.025 * breathe}) 0%,`
        + ` rgba(255,180,140,${0.012 + 0.012 * breathe}) 35%,`
        + ` transparent 70%)`;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Grid: 72px squares, with a tiny dot at every intersection.
  // Light mode: ink-tinted lines + dot.  Dark mode: cream-tinted variant.
  const lightGrid: React.CSSProperties = {
    backgroundImage: `
      radial-gradient(circle at 1px 1px, rgba(11,18,32,0.13) 1.1px, transparent 1.6px),
      linear-gradient(rgba(11,18,32,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(11,18,32,0.035) 1px, transparent 1px)
    `,
    backgroundSize: '72px 72px, 72px 72px, 72px 72px',
    backgroundPosition: '0 0, 0 0, 0 0',
  };
  const darkGrid: React.CSSProperties = {
    backgroundImage: `
      radial-gradient(circle at 1px 1px, rgba(240,237,230,0.10) 1.1px, transparent 1.6px),
      linear-gradient(rgba(240,237,230,0.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(240,237,230,0.028) 1px, transparent 1px)
    `,
    backgroundSize: '72px 72px, 72px 72px, 72px 72px',
    backgroundPosition: '0 0, 0 0, 0 0',
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
      {/* Grid lines + intersection dots — light mode */}
      <div className="absolute inset-0 dark:hidden" style={lightGrid} />
      {/* Dark mode variant */}
      <div className="absolute inset-0 hidden dark:block" style={darkGrid} />
      {/* Glow layers (mix-blend-mode: plus-lighter feels much more natural) */}
      <div ref={glowRef}  className="absolute inset-0" style={{ mixBlendMode: 'plus-lighter' }} />
      <div ref={glowBRef} className="absolute inset-0" style={{ mixBlendMode: 'plus-lighter' }} />
      <div ref={glowCRef} className="absolute inset-0" style={{ mixBlendMode: 'plus-lighter' }} />
      {/* Edge vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 90% 60% at 50% 0%, transparent 55%, var(--bg) 100%)',
      }} />
    </div>
  );
}
