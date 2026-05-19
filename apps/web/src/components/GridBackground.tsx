'use client';

import { useEffect, useRef } from 'react';

const CELL = 72;
const GLOW_R = 260;

export function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0;
    let mx = -9999, my = -9999;
    let raf = 0;
    let t = 0;

    const isDark = () => document.documentElement.classList.contains('dark');

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const onMove  = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onLeave = () => { mx = -9999; my = -9999; };

    const glowRSq = GLOW_R * GLOW_R;

    const draw = () => {
      t += 0.007;
      ctx.clearRect(0, 0, w, h);

      const dark = isDark();
      const [ir, ig, ib] = dark ? [240, 237, 230] : [11, 18, 32];
      const lineA   = dark ? 0.028 : 0.036;
      const dotBase = dark ? 0.20  : 0.13;
      const cols = Math.ceil(w / CELL) + 1;
      const rows = Math.ceil(h / CELL) + 1;

      // Grid lines
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${ir},${ig},${ib},${lineA})`;
      ctx.lineWidth = 1;
      for (let c = 0; c <= cols; c++) {
        const x = c * CELL + 0.5; ctx.moveTo(x, 0); ctx.lineTo(x, h);
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * CELL + 0.5; ctx.moveTo(0, y); ctx.lineTo(w, y);
      }
      ctx.stroke();

      const cursorActive = mx > -999;

      // Ambient cursor gradient
      if (cursorActive) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 460);
        grad.addColorStop(0,   'rgba(255,107,61,0.10)');
        grad.addColorStop(0.4, 'rgba(255,107,61,0.045)');
        grad.addColorStop(1,   'rgba(255,107,61,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Glow halos (first pass — beneath dots)
      if (cursorActive) {
        for (let c = 0; c <= cols; c++) {
          for (let r = 0; r <= rows; r++) {
            const x = c * CELL, y = r * CELL;
            const dSq = (x - mx) * (x - mx) + (y - my) * (y - my);
            if (dSq > glowRSq) continue;
            const prox = 1 - dSq / glowRSq;
            ctx.beginPath();
            ctx.arc(x, y, 3 + prox * 9, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,107,61,${prox * prox * 0.38})`;
            ctx.fill();
          }
        }
      }

      // Intersection dots (second pass)
      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          const x = c * CELL, y = r * CELL;

          let prox = 0;
          if (cursorActive) {
            const dSq = (x - mx) * (x - mx) + (y - my) * (y - my);
            prox = dSq < glowRSq ? 1 - dSq / glowRSq : 0;
          }

          // Subtle per-dot flicker — each dot breathes independently
          const seed    = Math.sin(c * 6.11 + r * 11.31);
          const flicker = 0.75 + 0.25 * Math.sin(t * (1.1 + seed * 1.8) + seed * 9.2);

          const radius = 1.05 + prox * 1.9;

          let fr: number, fg: number, fb: number, fa: number;
          if (prox > 0.04) {
            const b  = prox * 0.9;
            fr = Math.round(ir + (255 - ir) * b);
            fg = Math.round(ig + (107 - ig) * b);
            fb = Math.round(ib + (61  - ib) * b);
            fa = Math.min(1, (dotBase + prox * 0.72) * flicker);
          } else {
            fr = ir; fg = ig; fb = ib;
            fa = dotBase * flicker;
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${fr},${fg},${fb},${fa})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize',    resize,  { passive: true });
    window.addEventListener('mousemove', onMove,  { passive: true });
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize',    resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const lightGrid: React.CSSProperties = {
    backgroundImage: `
      radial-gradient(circle at 1px 1px, rgba(11,18,32,0.13) 1.1px, transparent 1.6px),
      linear-gradient(rgba(11,18,32,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(11,18,32,0.035) 1px, transparent 1px)
    `,
    backgroundSize: '72px 72px, 72px 72px, 72px 72px',
  };
  const darkGrid: React.CSSProperties = {
    backgroundImage: `
      radial-gradient(circle at 1px 1px, rgba(240,237,230,0.10) 1.1px, transparent 1.6px),
      linear-gradient(rgba(240,237,230,0.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(240,237,230,0.028) 1px, transparent 1px)
    `,
    backgroundSize: '72px 72px, 72px 72px, 72px 72px',
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
      {/* Desktop: canvas-rendered interactive grid */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Mobile-only CSS static grid */}
      <div className="absolute inset-0 md:hidden">
        <div className="absolute inset-0 dark:hidden" style={lightGrid} />
        <div className="absolute inset-0 hidden dark:block" style={darkGrid} />
      </div>
      {/* Edge vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 90% 60% at 50% 0%, transparent 55%, var(--bg) 100%)',
      }} />
    </div>
  );
}
